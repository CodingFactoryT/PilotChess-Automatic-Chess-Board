import React, { useState } from "react";
import { TextField, Button, Box, FormControl, Typography} from "@mui/material";
import { apiPost } from "@src/helpers/fetchBackendApi";
import BoardPosition from "@mainRoot/backend/src/helpers/BoardPosition";
import { useCurrentMove } from "@src/context/CurrentMoveContext";

export default function MakeMoveComponent() {
  const [formData, setFormData] = useState({ move: "" });
  const [isButtonEnabled, setButtonEnabled] = useState(false);
  const {setFromPosition, setToPosition} = useCurrentMove();

  const validateMove = (move) => {   
    return move.length === 4 && BoardPosition.isValid(move.charAt(0), Number(move.charAt(1))) && BoardPosition.isValid(move.charAt(2), Number(move.charAt(3)));
  }

  const handleChange = e => {
    const move = e.target.value;
    setFormData({ ...formData, [e.target.name]: move });
    if(move.length >= 2) {
      setFromPosition(move.substring(0, 2));  //only sets it if it is actually valid
    } else {
      setFromPosition("");
    }

    if(move.length >= 4) {
      setToPosition(move.substring(2, 4));  //only sets it if it is actually valid
    } else {
      setToPosition("");
    }

    setButtonEnabled(validateMove(e.target.value));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setFromPosition("");
    setToPosition("");
    apiPost("/game/move", JSON.stringify(formData))
    .then((response) => {
			console.log("Success: " + response.data);
		})
		.catch(() => {}); //axios handles the error message
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