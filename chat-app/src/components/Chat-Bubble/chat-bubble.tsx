
import React, {FC, ReactElement} from 'react';
import '@jetbrains/ring-ui-built/components/style.css';


import Text from "@jetbrains/ring-ui-built/components/text/text";
import Island, {Header, Content} from "@jetbrains/ring-ui-built/components/island/island";
import styles from "./chat-bubble.module.css"
import Button from "@jetbrains/ring-ui-built/components/button/button";
import copy from '@jetbrains/icons/copy-20px';


// Parameters go here
type ChatProps = {
    highlight?: boolean;
    content: string;

}


const ChatBubble: FC<ChatProps> = ({ highlight = false, content }): ReactElement => {

    const handleCopy = () => {
        // Use the Clipboard API to copy the content to the clipboard
        navigator.clipboard.writeText(content).then(() => {
            alert('Content copied to clipboard!'); // You can customize this feedback as needed
        }).catch(err => {
            alert('Failed to copy: ' + err);
        });
    };


    return (
        <>
            <div className={highlight ? styles.chatLeft : styles.chatRight}>

                    <Island className={highlight ? styles.chatColor : ''}>
                        <Content>{content}</Content>
                        {!highlight && <Button className={styles.button} short icon={copy} onClick={handleCopy}>Copy Response</Button>}
                    </Island>
            </div>


        </>
    )
};
export default ChatBubble;