import React, { useEffect } from 'react'

import { Switch, Route, withRouter } from "react-router-dom"

import { connect } from "react-redux"
import { loadUser } from "./actions/userActions"
import { setWebsocketStatus } from "./actions/connectionActions"
import { getThemes } from "./actions/themeActions"

import Header from "./components/Header"

import Login from "./components/Login"
import Register from "./components/Register"
import MessagesView from "./components/MessagesView"
import Settings from "./components/Settings"

import { MuiThemeProvider } from "@material-ui/core/styles"

import storage from "electron-json-storage"

import fs from "fs"

import websocket from "ws"

import { WebsocketOpen, WebsocketMessage, WebsocketError, WebsocketClose } from "./websocket/ws-redux-connect"

let client = null

function isAuthed(pathname) {
    return pathname !== "/" && pathname !== "/login" && pathname !== "/register"
}

const Routes = props => {

    useEffect(_ => {
        storage.get("userData", (err, data) => {
            if(data.token && data.token.length > 10) {
                const user = { ...data }
                props.loadUser(user)
                props.history.push("/messages")
            }
        })
        props.getThemes()
    }, [])

    useEffect(_ => {
        const pathname = props.history.location.pathname

        if(!props.user.token || props.user.token.length < 10) {

        } else {
            if(!client && props.connection.serverConnected) {
                function connectWebsocket() {
                    let error = null
                    client = new websocket("wss://servicetechlink.com/ws", {
                        headers: {
                            "Authorization": props.user.token
                        }
                    })
    
                    client.onopen = WebsocketOpen
    
                    client.onmessage = message => {
                        const parsed = JSON.parse(message.data)
                        WebsocketMessage(parsed)
                    }
    
                    client.onerror = err => {
                        error = err
                        WebsocketError(err)
                    }
    
                    client.onclose = _ => {
                        WebsocketClose()
                        client = null
                    }
                }
    
                connectWebsocket()
                
            } else if(client) {
                client.close()
                console.log("Websocket client closed")
                client = null
            }
        }

        return _ => {
            if(client) {
                WebsocketClose()
                client = null
            }
        }

    }, [props.history, props.user, props.connection.serverConnected, props.channels.channels.length])

    return (
        <MuiThemeProvider theme = {props.theme.currentTheme}>
            <div style = {{ height: "100%", display: "flex", flexDirection: "column" }}>
                <Header />
                <div style = {{ display: "flex", flex: 1, height: "100%" }}>
                    <Switch>
                        <Route exact path = "/" component = {Login} />
                        <Route exact path = "/login" component = {Login} />

                        <Route exact path = "/register" component = {Register} />

                        <Route exact path = "/messages" component = {MessagesView} />
                        <Route exact path = "/settings" component = {Settings} />
                    </Switch>
                </div>
            </div>
        </MuiThemeProvider>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user,
        connection: state.connection,
        channels: state.channels,
        theme: state.theme
    }
}

export default connect(mapStateToProps, { loadUser, setWebsocketStatus, getThemes })(withRouter(Routes))