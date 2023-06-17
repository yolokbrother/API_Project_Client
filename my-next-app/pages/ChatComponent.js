import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { deepOrange, deepPurple } from '@mui/material/colors';

import { useRouter } from 'next/router';
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    Paper,
} from "@mui/material";

//Auth
import { useAuth } from './AuthContext';
//other
import Link from 'next/link';
//firebase
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../firebase/firebaseClient';


function ChatComponent({ cat, onClose }) {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");

    // Fetch initial messages
    useEffect(() => {
        const fetchChatMessages = async () => {
            if (cat) {
                try {
                    const response = await fetch(`http://localhost:3001/api/chat/${cat.id}`);

                    if (!response.ok) {
                        throw new Error("Error fetching chat messages");
                    }

                    const { messages } = await response.json();
                    setMessages(messages);
                } catch (error) {
                    console.error("Error in fetchChatMessages:", error);
                }
            }
        };

        fetchChatMessages();
    }, [cat]);

    // Handle message submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (messageInput.trim() === "") {
            return;
        }

        const newMessage = {
            text: messageInput,
            timestamp: new Date().getTime(),
        };

        try {
            const response = await fetch("http://localhost:3001/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    catId: cat.id,
                    message: newMessage,
                }),
            });

            if (!response.ok) {
                throw new Error("Error sending the message");
            }

            // Update the messages state with the new message
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessageInput("");
        } catch (error) {
            console.error("Error in handleSubmit:", error);
        }
    };

    // Handle message deletion
    const handleDelete = async (messageId) => {
        // Debug logs
        console.log('Deleting message:', messageId);
        console.log('Cat ID:', cat.id);

        try {
            const response = await fetch(`http://localhost:3001/api/chat/${cat.id}/${messageId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error deleting the message');
            }

            // Update the messages state to remove the deleted message
            setMessages((prevMessages) => prevMessages.filter((message) => message.id !== messageId));
        } catch (error) {
            console.error('Error in handleDelete:', error);
        }
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Direct Chat with {cat.catName}</Typography>
                    <IconButton onClick={onClose} edge="end" color="inherit">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                {messages.map((message, index) => (
                    <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p>{message.text}</p>
                        <IconButton onClick={() => handleDelete(message.id)} edge="end" color="inherit">
                            <DeleteIcon />
                        </IconButton>
                    </div>
                ))}
                <form onSubmit={handleSubmit}>
                    <input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        type="text"
                        placeholder="Type your message..."
                    />
                    <button type="submit">Send</button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ChatComponent;