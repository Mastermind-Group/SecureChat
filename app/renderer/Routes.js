import React, { useEffect } from "react"

import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

import { loadUser, setUser } from "./actions/userActions"
import { setWebsocketStatus } from "./actions/connectionActions"
import { getThemes } from "./actions/themeActions"
import { openWebsocket, closeWebsocket } from "./actions/socketActions"

import storage from "electron-json-storage"
import { decrypt } from "./util/crypto"

import Header from "./components/Header"
import Login from "./components/Login"
import Register from "./components/Register"
import MessagesView from "./components/messages/Container"
import Settings from "./components/Settings"
import ImportKey from "./components/ImportKey"

import { MuiThemeProvider } from "@material-ui/core/styles"
import { Switch, Route } from "react-router-dom"

const Routes = props => {

    useEffect(_ => {
        storage.get("userData", (_err, data) => {
            if(data.token && data.token.length > 10) {
                const user = { ...data }

                storage.get("protectedKeys", (err, keys) => {
                    if(err) console.error(err)
                    else {
                        const myKey = keys[user._id]

                        if(!myKey) {
                            props.setUser(user, "IMPORT", user.token, user.password)
                            props.history.push("/importKey")
                        }
                        else {
                            const privateKey = decrypt(myKey, user.password)

                            props.setUser(user, privateKey, user.token, user.password)
                            props.history.push("/messages")
                        }
                    }
                })

                props.loadUser(user)
                props.history.push("/messages")
            }
        })
        
        props.getThemes()

        return _ => {
            props.closeWebsocket()
        }
    }, [])

    useEffect(_ => {
        if(props.user.token && props.user.token.length > 10 && !props.websocket && props.connection.serverConnected) {
            props.openWebsocket(props.user.token)
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

                        <Route exact path = "/importKey" component = {ImportKey} />
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
        theme: state.theme,
        websocket: state.websocket.websocket
    }
}

const actions = {
    loadUser, 
    setUser,
    setWebsocketStatus, 
    getThemes, 
    openWebsocket,
    closeWebsocket
}

export default connect(mapStateToProps, actions)(withRouter(Routes))