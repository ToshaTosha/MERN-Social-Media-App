import React from "react";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

export default function Comment({ obj }) {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <Avatar>N</Avatar>
        <Typography variant="body2">{obj.comment}</Typography>
      </Stack>
    </Stack>
  );
}
