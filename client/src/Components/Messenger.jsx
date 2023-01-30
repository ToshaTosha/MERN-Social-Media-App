import React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../axios";

import Message from "./Message";

import Grid from "@mui/material/Unstable_Grid2";
import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Conversation from "./Conversation";
const { io } = require("socket.io-client");

export default function Messenger() {
  const user = useSelector((state) => state.auth.data);
  //console.log(user);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      console.log(data);
      setArrivalMessage({
        sender: data.sender,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      //console.log(users);
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversation");
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user?._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`/messages/${currentChat?._id}`);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      sender: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: "10px 40px" }}>
      <Grid container spacing={3}>
        <Grid xs={9}>
          {currentChat ? (
            <Paper
              sx={{
                width: "100%",
                height: "500px",
              }}
            >
              <Stack spacing={2} sx={{ height: "85%", overflowY: "scroll" }}>
                {messages.map((m) => (
                  <Message message={m.text} own={m.sender === user._id} />
                ))}
              </Stack>
              <Stack direction="row" spacing={2} sx={{ margin: "0px 20px" }}>
                <TextField
                  label="Напишите сообщение..."
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                  variant="standard"
                  maxRows={10}
                  multiline
                  fullWidth
                />
                <Button onClick={handleSubmit} variant="outlined">
                  Send
                </Button>
              </Stack>
            </Paper>
          ) : (
            <Paper
              sx={{
                width: "100%",
                height: "500px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ margin: "0 auto" }}>
                Open a conversation to start a chat.
              </span>
            </Paper>
          )}
        </Grid>
        <Grid xs={3}>
          <Paper sx={{ width: 320, maxWidth: "100%" }}>
            <MenuList>
              {conversations.map((c) => (
                <MenuItem onClick={() => setCurrentChat(c)}>
                  <Conversation conversation={c} currentUser={user._id} />
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
