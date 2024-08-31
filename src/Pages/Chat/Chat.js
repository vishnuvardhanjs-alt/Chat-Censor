import React, { useEffect, useState } from "react";
import "react-chat-elements/dist/main.css";
import "./Chat.css";
import { ChatItem, MessageBox } from "react-chat-elements";
import { db } from "../../firebase/firebase";
import { getDocs, collection } from "firebase/firestore";

function Chat() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "Users"));
      const items = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
      setChats(items);
      setLoading(false);
    }
    getData();
  }, []);

  return (
    <div className="main-cont">
      <div className="msg-view">
        <div className="chat-top">
          <div className="messageBox">
            <input
              required=""
              placeholder="Add Contact"
              type="text"
              id="messageInput"
            />
            <button id="sendButton" type="submit">
              Add
            </button>
          </div>
        </div>

        <div className="chat-bot">
          {chats.map((item, index) => {
            return (
              <ChatItem
                avatar={item.pfp}
                alt={item.name}
                title={item.name}
                date={""}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Chat;
