import React, {FC, ReactElement, useState} from 'react';
import axios from 'axios';
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
    text: string;
    sender: 'user' | 'bot';
}


const CurrentChat: FC<ChatProps> = ({}): ReactElement => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    const API_KEY = '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';
    const API_URL = 'https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct';


    // Send message to Hugging Face API
    const sendMessage = async (message: string) => {
        // Add user message to state
        setMessages([...messages, { text: message, sender: 'user' }]);

        try {
            const response = await axios.post(
                API_URL,
                { inputs: message },
                {
                    headers: {
                        Authorization: `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Get the response from the API
            const botMessage = response.data[0]?.generated_text;

            // Add bot response to state
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: botMessage || 'No response', sender: 'bot' },
            ]);
        } catch (error) {
            console.error('Error fetching response from Hugging Face:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: 'Sorry, something went wrong.', sender: 'bot' },
            ]);
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
            <Grid>
                <Row start="xs">
                    <div className={styles.chatbar}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Input className={styles.container} multiline label=""

                                   placeholder={"Let's chat! Type here...."} size={Size.L}
                                   onChange={handleInputChange}/>
                            <Button icon={replyArrow} title="Icon button" onClick={handleSubmit}/>
                        </div>
                    </div>
                </Row>
                <Row>
                    <div className={styles.history}>
                        <ChatBubble highlight={true} content={"this is more user input!"}/>

                        <ChatBubble content={"This is from the bot!"}/>
                        <ChatBubble highlight={true} content={"this is more user input!"}/>
                        <ChatBubble content={"More bot input."}/>
                        <ChatBubble highlight={true} content={"this is more user input!"}/>


                    </div>


                </Row>
            </Grid>
            <div> hello</div>
            <div className="messages">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.sender}`}
                    >
                        {message.sender === 'user' ? (
                            <div className="user-message">{message.text}</div>
                        ) : (
                            <div className="bot-message">{message.text}</div>
                        )}
                    </div>
                ))}
            </div>


        </>
    )
};
export default CurrentChat;