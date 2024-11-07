import React, {FC, ReactElement, useState} from 'react';
import axios from 'axios';
import { HfInference } from "@huggingface/inference";

import '@jetbrains/ring-ui-built/components/style.css';


import {Grid} from "@jetbrains/ring-ui-built/components/grid/grid";
import Row from "@jetbrains/ring-ui-built/components/grid/row";
import Col from "@jetbrains/ring-ui-built/components/grid/col";
import Input from "@jetbrains/ring-ui-built/components/input/input";
import Button from "@jetbrains/ring-ui-built/components/button/button";

import {Size} from "@jetbrains/ring-ui-built/components/input/input";
import searchIcon from '@jetbrains/icons/agents-12px';
import downArrow from '@jetbrains/icons/arrow-20px-down';
import Text from "@jetbrains/ring-ui-built/components/text/text";
import replyArrow from '@jetbrains/icons/reply-20px';


import styles from './current-chat.module.css'
import ChatBubble from "../Chat-Bubble/chat-bubble";

// Parameters go here
type ChatProps = {

}

interface Message {
    role: string;
    content: string;
}


const CurrentChat: FC<ChatProps> = ({}): ReactElement => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const API_KEY = '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';
    const inference = new HfInference(API_KEY);

    const sendMessage = async (message: string) => {
        try {
            // Add the user message to the messages array
            const newMessage: Message = { role: "user", content: message };
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            // Initially add an empty assistant message to the messages array
            const assistantMessage: Message = { role: "assistant", content: "" };
            setMessages((prevMessages) => [...prevMessages, assistantMessage]);

            let assistantMessageContent = "";

            // Stream the assistant's message
            for await (const chunk of inference.chatCompletionStream({
                model: "microsoft/Phi-3-mini-4k-instruct",
                messages: [{ role: "user", content: message }],
                max_tokens: 500,
            })) {
                const responseChunk = chunk.choices[0]?.delta?.content || "";
                assistantMessageContent += responseChunk;

                // Update the last message in the messages array (the assistant's message)
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



    return (
        <>

            {/*<Grid>*/}
            {/*    <Row start="xs">*/}
            {/*        <div className={styles.history}>*/}
            {/*            {messages.map((message, index) => (*/}
            {/*                <div*/}
            {/*                    key={index}*/}
            {/*                    className={`message ${message.role}`}*/}
            {/*                >*/}
            {/*                    {message.role === 'user' ? (*/}

            {/*                        <ChatBubble highlight={true} content={message.content}/>*/}
            {/*                    ) : (*/}
            {/*                        <ChatBubble content={message.content}/>*/}
            {/*                    )}*/}
            {/*                </div>*/}
            {/*            ))}*/}

            {/*        </div>*/}


            {/*    </Row>*/}
            {/*    <Row >*/}
            {/*        <div className={styles.chatbar}>*/}
            {/*            <div style={{display: 'flex', alignItems: 'center'}}>*/}
            {/*                <Input className={styles.container} multiline label=""*/}
            {/*                       value={input}*/}
            {/*                       placeholder={"Let's chat! Type here...."} size={Size.L}*/}
            {/*                       onChange={handleInputChange}/>*/}
            {/*                <Button icon={replyArrow} title="Icon button" onClick={handleSubmit}/>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Row>*/}

            {/*</Grid>*/}

            <div className={styles.chatContainer}>
                <div className={styles.history}>
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.role}`}>
                            {message.role === 'user' ? (
                                <ChatBubble highlight={true} content={message.content}/>
                            ) : (
                                <ChatBubble content={message.content}/>
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
                    <Button icon={replyArrow} title="Icon button" onClick={handleSubmit}/>
                </div>
            </div>

        </>
    )
};
export default CurrentChat;