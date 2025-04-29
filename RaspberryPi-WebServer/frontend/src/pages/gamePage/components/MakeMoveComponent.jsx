import React, { useState } from "react";
import { TextField, Button, Box, FormControl, Typography, InputLabel, Select, MenuItem, Menu, FormLabel } from "@mui/material";
import { apiPost } from "../../../helpers/fetchBackendApi";
import BoardPosition from "../../../../../backend/src/api/helpers/BoardPosition";

export default function SendCommandToArduinoComponent() {
  const [formData, setFormData] = useState({ move: "" });
  const [isButtonEnabled, setButtonEnabled] = useState(false);

  const validateMove = (move) => {
    return move.length === 4 && BoardPosition.isValid(move.charAt(0), Number(move.charAt(1))) && BoardPosition.isValid(move.charAt(2), Number(move.charAt(3)));
  }

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setButtonEnabled(validateMove(e.target.value));
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
            autoComplete="off"
            onChange={handleChange}
          />
        </FormControl>
      </Box>
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={!isButtonEnabled}>
        Send
      </Button>
    </Box>
  );
}