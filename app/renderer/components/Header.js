import React, { useEffect, useState } from "react"

import { connect } from "react-redux"
import { logout } from "../actions/userActions"
import { setServerStatus } from "../actions/connectionActions"

import { withRouter } from "react-router-dom"

import {
    Drawer,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    withTheme,
    useTheme,
} from '@material-ui/core';

import axios from "axios"

import { FiServer, FiMoon, FiZap, FiZapOff, FiMenu, FiMessageCircle, FiSettings, FiLogOut, FiLock, FiClipboard } from "react-icons/fi"

let interval = null

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

const Header = props => {
    const theme = useTheme()
    const classes = useStyles();

    const [drawerOpen, setDrawer] = useState(false)

    useEffect(_ => {
        pingServer(props)
        clearInterval(interval)
        interval = setInterval(_ => pingServer(props), 10000)
    }, [props])

    const pingServer = props => {
        axios.get("https://servicetechlink.com/ping", {
            timeout: 5000
        })
            .then(data => {
                if (data.status === 200) {
                    if (props.connection.serverConnected === false) {
                        props.setServerStatus(true)
                    }
                }
            })
            .catch(err => {
                if (props.connection.serverConnected) {
                    props.setServerStatus(false)
                }
            })
    }

    const sidePanel = _ => {
        const isActiveMessages = props.history.location.pathname === "/messages"
        const isActiveSettings = props.history.location.pathname === "/settings"

        const getActiveBackground = isActive => {
            return isActive ? theme.palette.primary.main : ""
        }

        const getActiveColor = isActive => {
            return isActive ? theme.palette.primary.contrastText : ""
        }

        return (
            <div
                className={classes.list}
                role="presentation"
                onClick={_ => setDrawer(false)}
                onKeyDown={_ => setDrawer(false)}
            >
                <h2 style = {{ paddingLeft: 16 }}>{props.user.username}</h2>
                <Divider />
                <List>
                    <ListItem button={!isActiveMessages} style={{ backgroundColor: getActiveBackground(isActiveMessages) }} onClick = {_ => props.history.push("/messages")}>
                        <ListItemIcon><FiMessageCircle size={23} color = {getActiveColor(isActiveMessages)}  /></ListItemIcon>
                        <ListItemText primary = "Messages" style = {{ color: getActiveColor(isActiveMessages) }} />
                    </ListItem>
                    <ListItem button disabled>
                        <ListItemIcon><FiLock size={23}  /></ListItemIcon>
                        <ListItemText primary = "Passwords" />
                    </ListItem>
                    <ListItem button disabled>
                        <ListItemIcon><FiClipboard size={23} /></ListItemIcon>
                        <ListItemText primary = "Notes" />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button={!isActiveSettings} style={{ backgroundColor: getActiveBackground(isActiveSettings) }} onClick = {_ => props.history.push("/settings")}>
                        <ListItemIcon><FiSettings size={23} color = {getActiveColor(isActiveSettings)}  /></ListItemIcon>
                        <ListItemText primary = "Settings" style = {{ color: getActiveColor(isActiveSettings) }} />
                    </ListItem>

                    <ListItem button={true} onClick = {_ => handleLogout()}>
                        <ListItemIcon><FiLogOut size={23} /></ListItemIcon>
                        <ListItemText primary = "Logout" />
                    </ListItem>
                </List>
            </div>
        );
    }

    const handleLogout = _ => {
        setDrawer(false)
        props.logout()
        props.history.push("/login")
    }

    const _renderMenu = _ => {
        if (props.user.token && props.user.token.length > 10) {
            return <FiMenu size={23} onClick={_ => setDrawer(true)} style = {{ cursor: "pointer", marginLeft: 15, color: theme.palette.text.primary }} />;
        }
    }

    let name = ""

    if(props.history.location.pathname === "/messages") name = "Messages"
    else if(props.history.location.pathname === "/settings") name = "Settings"

    return (
        <div style={{ ...containerStyle, backgroundColor: theme.palette.background.paper, borderBottom: "1px solid " + theme.palette.background.default }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                {_renderMenu()}
                <h1 style = {{ margin: "0 15px", color: theme.palette.text.primary }}>{name}</h1>
            </div>
            <Drawer open={drawerOpen} onClose={_ => setDrawer(false)}>
                {sidePanel()}
            </Drawer>
            <div style={{ display: "flex" }}>

                {
                    props.connection.serverConnected ?
                        <FiServer color={theme.palette.primary.main} size={23} title="Server is running" /> :
                        <FiServer color="red" size={23} title="Server is down" />
                }
                <h2 style={{ margin: "0 5px" }}> </h2>
                {
                    props.connection.websocketConnected ?
                        <FiZap color={theme.palette.primary.main} size={23} title="Websocket is open" /> :
                        <FiZapOff color="red" size={23} title="Websocket is closed" />
                }
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    let channelName = ""

    if (state.channels.activeChannel !== -1) {
        channelName = state.channels.channels[state.channels.activeChannel].Name
    }

    return {
        user: state.user,
        connection: state.connection,
        channelName: channelName
    }
}

export default connect(mapStateToProps, { logout, setServerStatus })(withRouter(withTheme(Header)))

const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    top: 0,
    backgroundColor: "white",
    padding: 5,
}