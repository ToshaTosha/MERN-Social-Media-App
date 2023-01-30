import React from "react";
import { Paper } from "@mui/material";

export default function Message({ message, own }) {
  return own ? (
    <Paper variant="outlined">{message}</Paper>
  ) : (
    <Paper variant="outlined" sx={{ backgroundColor: "#eee" }}>
      {message}
    </Paper>
  );
}
