
import React, {FC, ReactElement} from 'react';
import '@jetbrains/ring-ui-built/components/style.css';

import Island, {Content} from "@jetbrains/ring-ui-built/components/island/island";
import styles from "./chat-bubble.module.css"
import Button from "@jetbrains/ring-ui-built/components/button/button";
import copy from '@jetbrains/icons/copy-20px';
import clipboard from "@jetbrains/ring-ui-built/components/clipboard/clipboard";

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
                        {!highlight && <Button className={styles.button} short icon={copy}
                                               onClick={() => clipboard.copyText(content, 'Text copied!', 'Text copying error')}>Copy Response</Button>}
                    </Island>
            </div>
        </>
    )
};
export default ChatBubble;