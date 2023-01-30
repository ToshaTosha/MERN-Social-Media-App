import React from "react";
import axios from "../axios";
import ListItemText from "@mui/material/ListItemText";

export default function Conversation({ conversation, currentUser }) {
  const friendId = conversation.members.find((m) => m !== currentUser._id);
  const [user, setUser] = React.useState();
  React.useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/user?username=${friendId}`);
      setUser(res.data.user);
    };
    fetchUser();
  }, []);
  return <ListItemText>{user?.fullName}</ListItemText>;
}
