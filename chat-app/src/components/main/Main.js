// You need to import RingUI styles once
import '@jetbrains/ring-ui-built/components/style.css';

import alertService from '@jetbrains/ring-ui-built/components/alert-service/alert-service';
import Button from '@jetbrains/ring-ui-built/components/button/button';


function Main () {
    return (
        <Button onClick={() => alertService.successMessage('Hello world')}>
            Click me
        </Button>
    );
}
export default Main;