import React from 'react'
import './Chat.css'
import { useLocation } from 'react-router-dom'


function Chat() {

    const { state } = useLocation();
    const { from, to } = state;
    return (
        <div>{from} {to}</div>
    )
}

export default Chat