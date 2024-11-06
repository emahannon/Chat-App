
import React, {FC, ReactElement} from 'react';
import '@jetbrains/ring-ui-built/components/style.css';


import Text from "@jetbrains/ring-ui-built/components/text/text";
import Island, {Header, Content} from "@jetbrains/ring-ui-built/components/island/island";
import styles from "./chat-bubble.module.css"

// Parameters go here
type ChatProps = {
    highlight?: boolean;
    content: string;

}


const ChatBubble: FC<ChatProps> = ({ highlight = false, content }): ReactElement => {



    return (
        <>
            <div className={highlight ? styles.chatLeft : styles.chatRight}>

                    <Island className={highlight ? styles.chatColor : ''}>
                        <Content>{content}</Content>
                    </Island>
            </div>


        </>
    )
};
export default ChatBubble;