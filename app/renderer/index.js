import React from 'react';
import ReactDOM from 'react-dom';
//import '../../dist-assets/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import storage from "electron-json-storage"

import fs from "fs"

if(!fs.existsSync(storage.getDataPath() + "\\userData.json")) {
    storage.set("userData", {})
}

ReactDOM.render(<App />, document.getElementById('app'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
