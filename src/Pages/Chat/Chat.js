import React from 'react'
import { MessageBox } from 'react-chat-elements'
import 'react-chat-elements/dist/main.css'
import './Chat.css'
import { ChatItem } from 'react-chat-elements'

function Chat() {
    return (
        <div className="main-cont">
            <div className="msg-view">
                <div className='chat-top'>
                    <div className="messageBox">
                        <input required="" placeholder="Add Contact" type="text" id="messageInput" />
                        <button id="sendButton" type='submit'>
                            Add
                        </button>
                    </div>
                </div>

                <div className='chat-bot'>
                    <ChatItem
                        avatar={'https://lh3.googleusercontent.com/-Aj9UpzsKG6I/AAAAAAAAAAI/AAAAAAAAAAA/ALKGfkl6EVfI0qOj1cWw_nhbrLS1ToCsBw/photo.jpg?sz=46'}
                        alt={'Reactjs'}
                        title={'Facebook'}
                        // subtitle={'What are you doing?'}
                        date={""}
                    />
                </div>

            </div>
        </div >
    )
}

export default Chat