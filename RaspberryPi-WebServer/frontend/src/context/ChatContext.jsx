import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export function ChatProvider({children}) {
  const [entries, setEntries] = useState([]);

  const clearEntries = () => setEntries([]);
  const addEntry = (username, isMe, message) => setEntries(prevEntries => [...prevEntries, {username, isMe, message}]);

  return (
    <ChatContext.Provider value={{entries, clearEntries, addEntry}}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  return useContext(ChatContext);
}