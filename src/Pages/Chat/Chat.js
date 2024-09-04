import React, { useEffect, useState, useRef } from 'react'
import './Chat.css'
import { useLocation } from 'react-router-dom'
import { addDoc, collection, getDocs, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { MessageBox } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css'
import userEvent from '@testing-library/user-event';




function Chat() {
    const endRef = useRef(null);

    const { state } = useLocation();
    const { from, to } = state;

    const [msgs, setMsgs] = useState([])
    const [text, setText] = useState("")

    async function addNewDocument() {
        try {
            const collection_id = (from + to).split('').sort().join('')
            const docRef = await addDoc(collection(db, collection_id), {
                from: from,
                to: to,
                message: text,
                time: Timestamp.now()
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    useEffect(()=>{
        endRef.current?.lastElementChild?.scrollIntoView()
    },[msgs])

    useEffect(() => {
        const objDiv = document.getElementsByClassName('msg-cont');
        objDiv[0].scrollTop = objDiv[0].scrollHeight;
        const collection_id = (from + to).split('').sort().join('')
        const q = query(collection(db, collection_id), orderBy("time"));
        console.log("running")
        const unsubscribe = onSnapshot(q, (snapshot) => {
            let cur_msgs = []
            snapshot.docs.map((doc) => {
                let cur_doc = doc.data()
                if (cur_doc.from === localStorage.getItem("cur_user_id")) {
                    cur_msgs.push({ ...cur_doc, position: "right" })
                } else {
                    cur_msgs.push({ ...cur_doc, position: "left" })
                }
            });
            setMsgs(cur_msgs);
        });

        // Cleanup the subscription when the component unmounts
        return () => unsubscribe();
    }, []);

    async function handleSend() {
        if (text !== "") {
            await addNewDocument()
            setText("")
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSend();
        }
    };


    return (
        <div className="main-cont">
            <div className="msg-view">
                <div className="msg-cont" ref={endRef}>
                    {
                        msgs.map((item, index) => {
                            return (
                                <MessageBox
                                    key={index}
                                    position={item.position}
                                    type={'text'}
                                    text={item.message}
                                />
                            )
                        })
                    }

                </div>
                <div className="messageBox">
                    <input required="" onKeyDown={handleKeyDown} onChange={(e) => { setText(e.target.value) }} value={text} placeholder="Message..." type="text" id="messageInput" />
                    <button id="sendButton" type='submit'
                        onClick={() => { handleSend() }}>
                        Send
                    </button>
                </div>
            </div>
        </div >
    )
}

export default Chat