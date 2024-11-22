import ChatBubble from "./ChatBubble";
import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/authContext";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, collection, addDoc, doc, getDocs, setDoc, serverTimestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import CollectionSelection from "./CollectionSelection";

const firebaseConfig = {
   removed
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function ChatBox() {
    const { currentUser, userLoggedIn } = useAuth();

    const initialMessageHistory = [{"role": "system", "content": "you are a homework assistance AI designed to provide support for people working on school assignments"}];
    const [messageHistory, setMessageHistory] = useState(initialMessageHistory);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const [selectedCollection, setSelectedCollection] = useState('default');

    const functions = getFunctions(app);
    const addmessage = httpsCallable(functions, 'addmessage');


    // TODO: seperate conversation histories by collection vs one bigass collection like chatGPT history archives not needed rn
    // const generateConversationId = () => {
    //     const now = new Date();
    //     return now.toISOString(); // Generates a string in the format "YYYY-MM-DDTHH:mm:ss.sssZ"
    // };

    // const conversationId = generateConversationId();

    useEffect(() => {
        // Fetch message history from Firestore when the component mounts
        const fetchMessages = async () => {
            if (currentUser && userLoggedIn) {
                const querySnapshot = await getDocs(collection(db, `users/${currentUser.uid}/conversations/conversationId/messages`));
                const messagesFromFirestore = querySnapshot.docs.map(doc => doc.data());
                setMessages(messagesFromFirestore);
            }
        };

        fetchMessages();
    }, [currentUser, userLoggedIn]);

    const saveMessageToFirestore = async (message, user) => {
        if (currentUser && userLoggedIn) {
            const messageId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
            const messageDocRef = doc(db, `users/${currentUser.uid}/conversations/conversationId/messages`, messageId);
            await setDoc(messageDocRef, {
                text: message,
                user: user,
                timestamp: serverTimestamp()
            });
        }
    };

    const chat = async (userInput) => {
        try {
            const response = await addmessage({ text: userInput, owner: currentUser.uid, collection: selectedCollection });

            if (response && response.data && response.data.text) {
                return response.data.text.answer;
            } else {
                console.log('Unexpected response structure:', response);
                return "Error communicating with the AI.";
            }
        } catch (error) {
            console.log('Error calling addmessage function:', error);
            return "Error communicating with the AI.";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userLoggedIn) {
            const cancel = { text: "Please login or register an account :)", user: false };
            setMessages((prevMessages) => [...prevMessages, cancel]);
            return;
        }

        if (!input.trim()) return;

        const userMessage = { text: input, user: true };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput('');

        await saveMessageToFirestore(userMessage.text, true); // Save user message to Firestore

        const response = await chat(input);
        const newAiMessage = { text: response, user: false };
        setMessages((prevMessages) => [...prevMessages, newAiMessage]);

        await saveMessageToFirestore(newAiMessage.text, false); // Save AI response to Firestore
    };

    return(<>
        <div className="flex flex-col w-full h-full justify-center items-center">
            <h1 className="flex justify-center text-bgl text-4xl pb-4">
                Ask your Questions!
            </h1>
            <div className="flex w-2/3 h-2/3">
                <div className="flex flex-col justify-between w-full max-h-full p-4 overflow-scroll border-4 border-bgd rounded-lg">
                    <ul className="w-full text-xl space-y-5">
                        {messages.map((message, index) => (
                            <ChatBubble key={index} text={message.text} className={message.user ? 'user-message bg-textcl text-bgl' : 'ai-message bg-bgd text-bgl'}/>
                        ))}
                    </ul>
                </div>
                
            </div>
            <div className="min-w-full">
                <form className="flex justify-center pt-2" onSubmit={handleSubmit}>
                    <div className=""><CollectionSelection onCollectionChange={setSelectedCollection}/></div>
                    <input className="bg-bgd p-2.5 w-128 text-white" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type Your Message Here"  ></input>
                    <button className="flex items-center justify-center text-bgl text-xl bg-textcl w-24 h-12 rounded hover:bg-textclh" type="submit">Send</button>
                </form>
            </div>
            
        </div> 
    </>)
}

export default ChatBox;

