import React, { useState } from "react";
import { TextField, Button, Box, FormControl, Typography, InputLabel, Select, MenuItem, Menu, FormLabel } from "@mui/material";

const typeOptions = [
  "REQ",
  "RES"
]

const methodOptions = [
  "HOME",
  "MOVE",
  "GRAB",
  "RELS",
  "ERRO",
]

export default function SendCommandToArduinoComponent() {
  const [formData, setFormData] = useState({ type: typeOptions[0], method: methodOptions[0], arguments: "" });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ 
      maxWidth: 400,
      padding: 2,
    boxShadow: 2 }}>
      <Typography variant="h6">
        Send Command to Arduino
      </Typography>
      <Box sx={{
        display: "flex",
        maxWidth: "700px",
        alignItems: "center"  
      }}>
        <FormControl margin="normal">
          <InputLabel id="send-command-to-arduino-type-label">Type</InputLabel>
          <Select
            labelId="send-command-to-arduino-type-label"
            label="Type"
            name="type"
            onChange={handleChange}
            value={formData.type}
          >
            {
              typeOptions.map((value, index) => 
                <MenuItem key={index + value} value={value}>{value}</MenuItem>
              )
            }
          </Select>
        </FormControl>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>:</Typography>
        <FormControl margin="normal">
          <InputLabel id="send-command-to-arduino-method-label">Method</InputLabel>
          <Select
            labelId="send-command-to-arduino-method-label"
            label="Method"
            name="method"
            onChange={handleChange}
            value={formData.method}
          >
            {
              methodOptions.map((value, index) => 
                <MenuItem key={index + value} value={value}>{value}</MenuItem>
              )
            }
          </Select>
        </FormControl>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>:</Typography>
        <FormControl sx={{maxWidth: "120px"}} margin="normal">
          <TextField
            label="Arguments"
            name="arguments"
            value={formData.arguments}
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