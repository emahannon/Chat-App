
import React, {FC, ReactElement, useState} from 'react';
import '@jetbrains/ring-ui-built/components/style.css';


import styles from './chat-main.module.css'

import CurrentChat from "../Current-Chat/current-chat";
import ContentLayout from "@jetbrains/ring-ui-built/components/content-layout/content-layout";
import Sidebar from "@jetbrains/ring-ui-built/components/content-layout/sidebar";
import DropdownMenu from "@jetbrains/ring-ui-built/components/dropdown-menu/dropdown-menu"
import Button from "@jetbrains/ring-ui-built/components/button/button";
import Text from "@jetbrains/ring-ui-built/components/text/text";

// Parameters go here
type ChatProps = {

}


const ChatMain: FC<ChatProps> = ({}): ReactElement => {
    const [selectedItem, setSelectedItem] = useState<string>('microsoft/Phi-3-mini-4k-instruct');

    const data = [
        { label: 'microsoft/Phi-3-mini-4k-instruct' },
        { label: 'HuggingFaceH4/starchat2-15b-v0.1' }

    ];


    const handleSelection = (item: { label: string }) => {
        setSelectedItem(item.label); // Update selected item
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <Text className={styles.text}>Model Selection</Text>
                    <DropdownMenu data={data} anchor={selectedItem} onSelect={handleSelection} />
                    <Text className={styles.text}>New Chat</Text>
                    <Text className={styles.text}>Chat History</Text>
                </div>
                <div className={styles.content}>
                    <CurrentChat selectedItem={selectedItem}></CurrentChat>
                </div>
            </div>


            {/*<ContentLayout>*/}
            {/*    <Sidebar className={styles.sidebar}>*/}
            {/*        <Text>Model Selection</Text>*/}
            {/*        <div className={styles.dropDown}>*/}
            {/*            <DropdownMenu data={data} anchor={selectedItem} onSelect={handleSelection} />*/}

            {/*        </div>*/}
            {/*    </Sidebar>*/}
            {/*    <CurrentChat selectedItem={selectedItem}></CurrentChat>*/}
            {/*</ContentLayout>*/}
        </>
    )
};
export default ChatMain;