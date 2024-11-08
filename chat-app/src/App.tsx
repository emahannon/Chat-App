import React from 'react';
// You need to import RingUI styles once
import '@jetbrains/ring-ui-built/components/style.css';

import alertService from '@jetbrains/ring-ui-built/components/alert-service/alert-service';
import Button from '@jetbrains/ring-ui-built/components/button/button';

import CurrentChat from "./components/Current-Chat/current-chat";

function App() {
    return (
        <>
            <CurrentChat></CurrentChat>
        </>

    );
}

export default App;
