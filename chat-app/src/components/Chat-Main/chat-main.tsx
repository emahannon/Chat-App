
import React, {FC, ReactElement, useState} from 'react';
import '@jetbrains/ring-ui-built/components/style.css';


import styles from './chat-main.module.css'

import CurrentChat from "../Current-Chat/current-chat";
import ContentLayout from "@jetbrains/ring-ui-built/components/content-layout/content-layout";
import Sidebar from "@jetbrains/ring-ui-built/components/content-layout/sidebar";
import DropdownMenu from "@jetbrains/ring-ui-built/components/dropdown-menu/dropdown-menu"
import Button from "@jetbrains/ring-ui-built/components/button/button";
import Text from "@jetbrains/ring-ui-built/components/text/text";
import {Grid} from "@jetbrains/ring-ui-built/components/grid/grid";
import Row from "@jetbrains/ring-ui-built/components/grid/row";
import Col from "@jetbrains/ring-ui-built/components/grid/col";
import addCircle from '@jetbrains/icons/add-circle-20px';
import Dropdown from "@jetbrains/ring-ui-built/components/dropdown/dropdown";
import PopupMenu from "@jetbrains/ring-ui-built/components/popup-menu/popup-menu";


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
                    <Grid>
                        <Row className={styles.row}>
                            <Text className={styles.text}>Model Selection</Text>
                        </Row>
                        <Row>
                            <Dropdown anchor={<Button dropdown>{selectedItem}</Button>}>
                                <PopupMenu closeOnSelect data={data} onSelect={handleSelection} />
                            </Dropdown>
                        </Row>
                        <Row className={styles.row}>
                            <Text className={styles.text}>New Chat</Text>
                            <Button className={styles.button} icon={addCircle} onClick={() => window.location.reload()}></Button>
                        </Row>
                        <Row className={styles.row}>
                            <Text className={styles.text}>Chat History</Text>
                        </Row>
                    </Grid>



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