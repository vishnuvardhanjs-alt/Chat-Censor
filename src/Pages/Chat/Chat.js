import React, { useEffect, useState, useRef} from "react";
import "./Chat.css";
import { useLocation } from "react-router-dom";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { Filter } from "bad-words";
import Sentiment from "sentiment";

function Chat() {
  const endRef = useRef(null);
  const filter = new Filter();
  let sentiment = new Sentiment();

  filter.addWords("some", "bad", "word");

  const { state } = useLocation();
  const { from, to } = state;

  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");

  const [senti, setSenti] = useState(0);
  const [emoji, setEmoji] = useState("😐");

  async function addNewDocument() {
    try {
      const collection_id = (from + to).split("").sort().join("");
      const docRef = await addDoc(collection(db, collection_id), {
        from: from,
        to: to,
        message: text,
        time: Timestamp.now(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  useEffect(()=>{
    if (senti === 69) {
        setEmoji("🥵")
    } else if (senti > 0) {
        setEmoji("😄")
    } else if (senti < 0) {
        setEmoji("☹️")
    } else {
        setEmoji("😐")
    }
  },[senti])

  useEffect(() => {
    endRef.current?.lastElementChild?.scrollIntoView();
    let msg_len = msgs.length
    let score_count = 0
    msgs.map((val,index)=>{
        score_count+= sentiment.analyze(val.message).comparative
    })
    setSenti( (score_count / msg_len).toFixed(2))
  }, [msgs]);

  useEffect(() => {
    endRef.current?.lastElementChild?.scrollIntoView();
    let msg_len = msgs.length
    const collection_id = (from + to).split("").sort().join("");
    const q = query(collection(db, collection_id), orderBy("time"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let cur_msgs = [];
      snapshot.docs.map((doc) => {
        let cur_doc = doc.data();
        if (cur_doc.from === localStorage.getItem("cur_user_id")) {
          cur_msgs.push({ ...cur_doc, position: "right" });
        } else {
          cur_msgs.push({ ...cur_doc, position: "left" });
        }
      });
      setMsgs(cur_msgs);
    });
    return () => unsubscribe();
  }, []);

  async function handleSend() {
    if (text !== "") {
      await addNewDocument();
      setText("");
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-main-cont">
      <div className="chat-msg-view">
        <div className="chat-msg-cont" ref={endRef}>
          {msgs.map((item, index) => {
            return (
              <MessageBox
                position={item.position}
                type={"text"}
                text={filter.clean(item.message)}
              />
            );
          })}
        </div>
        <div className="chat-messageBox">
          <input
            required=""
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setText(e.target.value);
            }}
            value={text}
            placeholder="Message..."
            type="text"
            id="chat-messageInput"
          />
          <button
            id="chat-sendButton"
            type="submit"
            onClick={() => {
              handleSend();
            }}
          >
            Send
          </button>
        </div>
      </div>
      <div className="chat-right-cont">
        {!isNaN(senti) ? (
          <div className="chat-score-cont">
            <p>Sentiment Score : {senti}</p>
            <p className="chat-emoji">{emoji}</p>
          </div>
        ) : (
          <div className="chat-score-cont">
            <p>Sentiment Score : 0.00</p>
            <p className="chat-emoji">😐</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
