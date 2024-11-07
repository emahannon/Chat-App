import React, { FC, ReactElement, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { HfInference } from "@huggingface/inference";

import '@jetbrains/ring-ui-built/components/style.css';

import { Grid } from "@jetbrains/ring-ui-built/components/grid/grid";
import Row from "@jetbrains/ring-ui-built/components/grid/row";
import Col from "@jetbrains/ring-ui-built/components/grid/col";
import Input from "@jetbrains/ring-ui-built/components/input/input";
import Button from "@jetbrains/ring-ui-built/components/button/button";

import { Size } from "@jetbrains/ring-ui-built/components/input/input";
import replyArrow from '@jetbrains/icons/reply-20px';

import styles from './current-chat.module.css';
import ChatBubble from "../Chat-Bubble/chat-bubble";

type ChatProps = {
    selectedItem: string | null;
};

interface Message {
    role: string;
    content: string;
}

const CurrentChat: FC<ChatProps> = ({ selectedItem }): ReactElement => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const API_KEY = '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';
    const inference = new HfInference(API_KEY);
    // const [scrolling, setScrolling] = useState(false);

    // Create a reference for the chat history div
    const historyRef = useRef<HTMLDivElement>(null);

    const sendMessage = async (message: string) => {
        try {
            const newMessage: Message = { role: "user", content: message };
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            const assistantMessage: Message = { role: "assistant", content: "" };
            setMessages((prevMessages) => [...prevMessages, assistantMessage]);

            let assistantMessageContent = "";
            for await (const chunk of inference.chatCompletionStream({
                model: selectedItem,
                messages: [{ role: "user", content: message }],
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

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (input.trim() === '') return;
        sendMessage(input);
        setInput('');
    };

    // const handleScroll = () => {
    //     if (historyRef.current) {
    //         const isAtBottom = historyRef.current.scrollHeight - historyRef.current.scrollTop === historyRef.current.clientHeight;
    //         setScrolling(isAtBottom);  // Set scrolling state based on position
    //     }
    // };

    // Scroll to the bottom of the chat history whenever a new message is added
    useEffect(() => {
        if (historyRef.current) {
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className={styles.chatContainer}>
            <div className={styles.history} ref={historyRef} >
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.role}`}>
                        {message.role === 'user' ? (
                            <ChatBubble highlight={true} content={message.content} />
                        ) : (
                            <ChatBubble content={message.content} />
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.chatbar}>
                <Input
                    className={styles.container}
                    multiline
                    label=""
                    value={input}
                    placeholder={"Let's chat! Type here...."}
                    size={Size.L}
                    onChange={handleInputChange}
                />
                <Button icon={replyArrow} title="Icon button" onClick={handleSubmit} />
            </div>
        </div>
    );
};

export default CurrentChat;
