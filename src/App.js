import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login/Login';
import { ContextProvider } from './context/store';
import Chat from './Pages/Chat/Chat';

function App() {

    return (
        <ContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ContextProvider>

    )
}

export default App