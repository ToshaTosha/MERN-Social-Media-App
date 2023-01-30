import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";

export default function Search() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const search = async () => {
      try {
        if (!query.trim()) {
          setData([]);
          return;
        }
        const res = await axios.get(`http://localhost:4444/search?q=${query}`);
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (query.length === 0 || query.length > 2) search();
  }, [query]);

  return (
    <Stack>
      <input
        className="search"
        placeholder="Search..."
        onChange={(e) => setQuery(e.target.value.toLowerCase())}
        style={{ height: "100%" }}
      />
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          position: "relative",
          overflow: "auto",
          maxHeight: 100,
          "& ul": { padding: 0 },
        }}
      >
        {data?.data?.map((item, i) => (
          <ListItem key={i}>
            <Link to={`/user/${item._id}`}>
              <ListItemText primary={item.fullName} />
            </Link>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
