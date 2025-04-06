import React, { useState } from "react";
import { TextField, Button, Box, FormControl, Typography, InputLabel, Select, MenuItem, Menu, FormLabel } from "@mui/material";
import { apiPost } from "../../../helpers/fetchBackendApi";

export default function SendCommandToArduinoComponent() {
  const [formData, setFormData] = useState({ move: "" });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    apiPost("/game/move", JSON.stringify(formData))
    .then((response) => {
			console.log("Success: " + response.data);
		})
		.catch(e => {}); //axios handles the error message
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ 
      maxWidth: 400,
      padding: 2,
      marginRight: "10px",
      boxShadow: 2 }}>
      <Typography variant="h6">
        Make Manual Move
      </Typography>
      <Box sx={{
        display: "flex",
        maxWidth: "700px",
        alignItems: "center"  
      }}>
        <FormControl sx={{maxWidth: "120px"}} margin="normal">
          <TextField
            label="Move"
            name="move"
            value={formData.move}
            onChange={handleChange}
          />
        </FormControl>
      </Box>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Send
      </Button>
    </Box>
  );
}