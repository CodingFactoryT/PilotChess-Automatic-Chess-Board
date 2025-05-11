import {Stack, Divider, ListItem} from "@mui/material"
import { useChat } from "@src/context/ChatContext";
import { useEffect } from "react";

export default function ChatComponent() {
  const {entries} = useChat();
  useEffect(() => {
    console.log(entries);
  }, [entries]);

  return (
      <Stack spacing={1}>
        {entries.map(entry => {
          return entry.username === "lichess" ? (
            <>
              <Divider variant="middle"/>
              <ListItem>{entry.message}</ListItem>
              <Divider variant="middle"/>
            </>
          ) : (
              <ListItem>{entry.message}</ListItem>
          )
        })}
      </Stack>
  );
}