
import React, {FC, ReactElement} from 'react';
import '@jetbrains/ring-ui-built/components/style.css';


import styles from './chat-main.module.css'

import CurrentChat from "../Current-Chat/current-chat";
import ContentLayout from "@jetbrains/ring-ui-built/components/content-layout/content-layout";
import Sidebar from "@jetbrains/ring-ui-built/components/content-layout/sidebar";
import DropdownMenu from "@jetbrains/ring-ui-built/components/dropdown-menu/dropdown-menu"

// Parameters go here
type ChatProps = {

}


const ChatMain: FC<ChatProps> = ({}): ReactElement => {
    const data = [{
        label: 'Item'
    }, {
        label: 'Link to jetbrains.com',
        href: 'http://www.jetbrains.com'
    }, {
        rgItemType: DropdownMenu.ListProps.Type.SEPARATOR
    }, {
        rgItemType: DropdownMenu.ListProps.Type.LINK,
        label: 'Link Item'
    }, {
        rgItemType: DropdownMenu.ListProps.Type.LINK,
        label: 'Link Item With Additional Class',
        className: 'test'
    }, {
        rgItemType: DropdownMenu.ListProps.Type.SEPARATOR,
        description: 'Separator With Description'
    }, {
        rgItemType: DropdownMenu.ListProps.Type.TITLE,
        label: 'Title'
    }, {
        rgItemType: DropdownMenu.ListProps.Type.ITEM,
        label: '1 Element in group'
    }, {
        rgItemType: DropdownMenu.ListProps.Type.ITEM,
        label: '2 Element in group'
    }];


    return (
        <>
            <ContentLayout>
                <Sidebar className={styles.sidebar}>
                    <DropdownMenu data={data} anchor={'Switch current model'} />
                </Sidebar>
                <CurrentChat></CurrentChat>
            </ContentLayout>
        </>
    )
};
export default ChatMain;