import React from 'react'

import store from "./store/store"
import history from "./history"

import Routes from "./Routes"

import { Provider } from "react-redux"
import { HashRouter } from "react-router-dom"

const App = _ => {
    return (
        <Provider store = {store}>
            <HashRouter history = {history}>
                <Routes />
            </HashRouter>
        </Provider>
    )
}

export default App