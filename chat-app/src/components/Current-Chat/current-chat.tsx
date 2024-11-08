import React, { FC, ReactElement, useState, useRef, useEffect } from 'react';
import { HfInference } from "@huggingface/inference";
import { v4 as uuidv4 } from "uuid";

import '@jetbrains/ring-ui-built/components/style.css';
import Input from "@jetbrains/ring-ui-built/components/input/input";
import Button from "@jetbrains/ring-ui-built/components/button/button";
import { Size } from "@jetbrains/ring-ui-built/components/input/input";
import replyArrow from '@jetbrains/icons/reply-20px';
import addCircle from '@jetbrains/icons/add-circle-filled-20px';
import pastChatIcon from '@jetbrains/icons/artifacts-20px';

import styles from './current-chat.module.css';
import ChatBubble from "../Chat-Bubble/chat-bubble";
import { Grid } from "@jetbrains/ring-ui-built/components/grid/grid";
import Row from "@jetbrains/ring-ui-built/components/grid/row";
import Text from "@jetbrains/ring-ui-built/components/text/text";
import Dropdown from "@jetbrains/ring-ui-built/components/dropdown/dropdown";
import PopupMenu from "@jetbrains/ring-ui-built/components/popup-menu/popup-menu";

interface Message {
    role: string;
    content: string;
}

const CurrentChat: FC = (): ReactElement => {
    const [selectedItem, setSelectedItem] = useState<string>('microsoft/Phi-3-mini-4k-instruct');
    const [input, setInput] = useState('');
    const [sessionId, setSessionId] = useState<string>(uuidv4());
    const [sessionList, setSessionList] = useState<string[]>(() => JSON.parse(localStorage.getItem('chatSessions') || '[]'));
    const [messages, setMessages] = useState<Message[]>([]);
    const storageKey = `chatMessages_${selectedItem}_${sessionId}`;

    // It would be better to store the API key in a secure location, such as a server environment variable.
    // However, for the purpose of this demo, we will store it in the client-side code.
    const API_KEY = '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';
    const inference = new HfInference(API_KEY);
    const historyRef = useRef<HTMLDivElement>(null);

    // Load session messages from localStorage when `selectedItem` or `sessionId` changes
    useEffect(() => {
        const savedMessages = localStorage.getItem(storageKey);
        setMessages(savedMessages ? JSON.parse(savedMessages) : []);
    }, [selectedItem, sessionId]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(messages));
    }, [messages]);

    // Persist the session list to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('chatSessions', JSON.stringify(sessionList));
    }, [sessionList]);

    // Scroll to the bottom of the chat history whenever a new message is added
    useEffect(() => {
        if (historyRef.current) {
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async (message: string) => {
        try {
            // Add the user's message to the conversation history
            const newMessage: Message = { role: "user", content: message };
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            // Add a placeholder for the assistant's response
            const assistantMessage: Message = { role: "assistant", content: "" };
            setMessages((prevMessages) => [...prevMessages, assistantMessage]);

            const MAX_HISTORY_LENGTH = 10;
            // Prepare the conversation history for the API request
            const conversationHistory = [...messages, newMessage].slice(-MAX_HISTORY_LENGTH);

            let assistantMessageContent = "";
            for await (const chunk of inference.chatCompletionStream({
                model: selectedItem,
                messages: conversationHistory, // Use the full conversation history
                max_tokens: 500,
            })) {
                const responseChunk = chunk.choices[0]?.delta?.content || "";
                assistantMessageContent += responseChunk;

                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages];
                    updatedMessages[updatedMessages.length - 1] = {
                        role: "assistant",
                        content: assistantMessageContent,
                    };
                    return updatedMessages;
                });
            }
        } catch (error) {
            console.error("Error fetching message:", error);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (input.trim() === '') return;
        await sendMessage(input);
        setInput('');
    };

    const handleSelection = (item: { label: string }) => {
        setSelectedItem(item.label);
    };

    const loadSession = (sessionKey: string) => {
        const loadedMessages = localStorage.getItem(sessionKey);
        if (loadedMessages) {
            setMessages(JSON.parse(loadedMessages));
            setSessionId(sessionKey.split('_').pop() || uuidv4());
        }
    };

    const startNewSession = () => {
        const newSessionId = uuidv4();
        setSessionId(newSessionId);
        setMessages([]);
        const newSessionKey = `chatMessages_${selectedItem}_${newSessionId}`;
        setSessionList((prevList) => [...prevList, newSessionKey]);
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Grid>
                    <Row className={styles.row}>
                        <Text className={styles.text}>New Chat</Text>
                        <Button icon={addCircle} onClick={startNewSession}></Button>
                    </Row>
                    <Row className={styles.row}>
                        <Text className={styles.text}>Model Selection</Text>
                    </Row>
                    <Row className={styles.rowModel}>
                        <Dropdown anchor={<Button dropdown>{selectedItem}</Button>}>
                            <PopupMenu data={[{ label: 'microsoft/Phi-3-mini-4k-instruct' }, { label: 'HuggingFaceH4/starchat2-15b-v0.1' }]} onSelect={handleSelection} />
                        </Dropdown>
                    </Row>
                    <Row className={styles.row}>
                        <Text className={styles.historyText}>Chat History of {selectedItem}</Text>
                    </Row>
                    <div className={styles.totalHistory}>
                        {sessionList.map((sessionKey, index) => (
                            <Row key={sessionKey}>
                                <Button icon={pastChatIcon} onClick={() => loadSession(sessionKey)}>Session {index + 1}</Button>
                            </Row>
                        ))}
                    </div>
                </Grid>
            </div>
            <div className={styles.content}>
                <div className={styles.chatContainer}>
                    <div className={styles.history} ref={historyRef}>
                        {messages.map((message, index) => (
                            <ChatBubble key={index} highlight={message.role === 'user'} content={message.content} />
                        ))}
                    </div>
                    <div className={styles.chatbar}>
                        <Input multiline value={input} placeholder="Let's chat! Type here...." size={Size.L} onChange={handleInputChange} />
                        <Button icon={replyArrow} onClick={handleSubmit} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentChat;
