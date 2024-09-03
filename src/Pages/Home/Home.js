import React, { useEffect, useState } from "react";
import "react-chat-elements/dist/main.css";
import "./Home.css";
import { ChatItem } from "react-chat-elements";
import { db } from "../../firebase/firebase";
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  getDoc,
  query,
  where,
  arrayUnion
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";



function Home() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [useraddCount, setaddCount] = useState(0);

  async function getDocsFromFirebase(id) {
    const querySnapshot = doc(db, "Users", id);
    const docSnap = await getDoc(querySnapshot);
    return docSnap.data();
  }

  useEffect(() => {
    async function getData() {
      const data = await getDocsFromFirebase(
        localStorage.getItem("cur_user_id")
      );
      const temp = data.chats;
      let temp_chats = [];
      if (temp !== undefined) {
        for (let i = 0; i < temp.length; i++) {
          const chat_to = await getDocsFromFirebase(temp[i]);
          temp_chats.push(chat_to);
        }
        setChats(temp_chats);
      }
    }
    getData();
  }, [useraddCount]);

  async function getDocumentIdByField(collectionName, fieldName, fieldValue) {
    const colRef = collection(db, collectionName);

    const q = query(colRef, where(fieldName, "==", fieldValue));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      return docId;
    } else {
      return null;
    }
  }

  const addChat = async () => {
    const querySnapshot = doc(db, "Users", localStorage.getItem("cur_user_id"));
    const found_id = await getDocumentIdByField("Users", "email", searchUser);
    if (found_id === null) {
      alert("User Not Found!...");
      return;
    } else if (found_id === localStorage.getItem("cur_user_id")) {
      alert("Cannot add yourself!...");
      return;
    }

    const data = {
      chats: arrayUnion(found_id),
    };

    updateDoc(querySnapshot, data)
      .then(() => {
        setaddCount(useraddCount + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function handleChat(from, to){
    navigate("/chat",{ state: { from: from, to: to } })
  }

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
              onChange={(e) => setSearchUser(e.target.value)}
            />
            <button id="sendButton" onClick={addChat} type="submit">
              Add
            </button>
          </div>
        </div>

        <div className="chat-bot">
          {chats.map((item, index) => {
            return (
              <ChatItem
                key={index}
                avatar={item.pfp}
                alt={item.name}
                title={item.name}
                date={""}
                onClick={()=>{handleChat(localStorage.getItem("cur_user_id"), item.uid)}}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
