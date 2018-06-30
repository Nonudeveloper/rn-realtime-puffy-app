import { AppRegistry } from 'react-native';
import App from './src/App';

const _XHR = GLOBAL.originalXMLHttpRequest ?  
    GLOBAL.originalXMLHttpRequest :           
    GLOBAL.XMLHttpRequest;

    XMLHttpRequest = _XHR;


AppRegistry.registerComponent('Puffy', () => App);
