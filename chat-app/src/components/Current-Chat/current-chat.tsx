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
import {Grid} from "@jetbrains/ring-ui-built/components/grid/grid";
import Row from "@jetbrains/ring-ui-built/components/grid/row";
import Text from "@jetbrains/ring-ui-built/components/text/text";
import Dropdown from "@jetbrains/ring-ui-built/components/dropdown/dropdown";
import PopupMenu from "@jetbrains/ring-ui-built/components/popup-menu/popup-menu";

type ChatProps = {
};

interface Message {
    role: string;
    content: string;
}

const CurrentChat: FC<ChatProps> = ({}): ReactElement => {
    const [selectedItem, setSelectedItem] = useState<string>('microsoft/Phi-3-mini-4k-instruct');
    const [input, setInput] = useState('');
    const [messagesReceivedCount, setMessagesReceivedCount] = useState(0);
    const [sessionId, setSessionId] = useState<string>(uuidv4());
    const [sessionList, setSessionList] = useState<string[]>([]);
    const storageKey = `chatMessages_${selectedItem}_${sessionId}`;
    const [messages, setMessages] = useState<Message[]>(JSON.parse(localStorage.getItem(storageKey) || '[]') as Message[]);

    // It would be better to store the API key in a secure location, such as a server environment variable.
    // However, for the purpose of this demo, we will store it in the client-side code.
    const API_KEY = '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';
    const inference = new HfInference(API_KEY);

    const historyRef = useRef<HTMLDivElement>(null);

    // Load messages from localStorage on mount
    useEffect(() => {
        if (selectedItem) {
            setMessages(JSON.parse(localStorage.getItem(storageKey) || '[]') as Message[]);
        }
    }, [selectedItem]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (selectedItem) {
            console.log(messages)
            localStorage.setItem(storageKey, JSON.stringify(messages));
        }
    }, [messagesReceivedCount]);

    useEffect(() => {
        localStorage.setItem('chatSessions', JSON.stringify(sessionList));
    }, [sessionList]);

    useEffect(() => {
        setSessionList(JSON.parse(localStorage.getItem('chatSessions') || '[]'));
    }, [sessionId]);

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
            setMessagesReceivedCount(messagesReceivedCount + 1);
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
        await sendMessage(input); // Await here to handle the Promise
        setInput('');
    };


    // Scroll to the bottom of the chat history whenever a new message is added
    useEffect(() => {
        if (historyRef.current) {
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
    }, [messages]);


    const data = [
        { label: 'microsoft/Phi-3-mini-4k-instruct' },
        { label: 'HuggingFaceH4/starchat2-15b-v0.1' }

    ];


    const handleSelection = (item: { label: string }) => {
        setSelectedItem(item.label); // Update selected item
    };


    // need to fix the below two functions
    const loadSession = (sessionKey: string) => {
        const loadedMessages = localStorage.getItem(sessionKey);
        if (loadedMessages) {
            setMessages(JSON.parse(loadedMessages));
            setSessionId(sessionKey);
        }
    };

    const startNewSession = () => {
        const newSessionId = uuidv4();
        setSessionId(newSessionId);
        setMessages([]); // Clear current messages for a new session
        setSessionList((prevList) => [...prevList, `chatMessages_${selectedItem}_${newSessionId}`]);
    };


    return (
        <>
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Grid>
                    <Row className={styles.row}>
                        <Text className={styles.text}>Model Selection</Text>
                    </Row>
                    <Row>
                        <Dropdown anchor={<Button dropdown>{selectedItem}</Button>}>
                            <PopupMenu closeOnSelect data={data} onSelect={handleSelection}/>
                        </Dropdown>
                    </Row>
                    <Row className={styles.row}>
                        <Text className={styles.text}>New Chat</Text>
                        <Button className={styles.button} icon={addCircle}
                                onClick={startNewSession}></Button>
                    </Row>

                    <Row className={styles.row}>
                        <Text className={styles.text}>Chat History</Text>
                    </Row>

                    <div className={styles.totalHistory}>
                        {sessionList.map((sessionKey, index) => (
                            <div key={sessionKey}>
                                <Row >
                                    <Button icon={pastChatIcon} title="Icon button" onClick={() => loadSession(sessionKey)}>Session {index+1}</Button>
                                </Row>
                            </div>
                        ))}
                    </div>
                </Grid>


            </div>

            <div className={styles.content}>
                <div className={styles.chatContainer}>


                    <div className={styles.history} ref={historyRef}>
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
         </div>
</div>

        </>
    );
};

export default CurrentChat;
