import React from 'react'

import { Provider } from "react-redux"
import store from "./store/store"

import { HashRouter } from "react-router-dom"

import Routes from "./Routes"

import history from "./history"

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