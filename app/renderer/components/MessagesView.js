import React from "react"

import { connect } from "react-redux"
import { withTheme, useTheme } from "@material-ui/core"

import ChannelList from "./Channels"
import Messages from "./Messages"

export const MessagesView = props => {
    const theme = useTheme()

    const _renderContent = _ => {
        let loading = props.channels.LOADING_CHANNELS
        let notIn = !props.channels.LOADING_CHANNELS && props.channels.channels.length === 0
        let click = !props.channels.LOADING_CHANNELS && props.channels.activeChannel === -1

        if(loading || notIn || click) {
            let message = ""

            if(loading) message = "Decrypting channels..."
            else if(notIn) message = "You are not in any channels! Click '+' to create a channel"
            else if(click) message = "Click on a channel"

            return (
                <div style = {{ flex: 1, display: "flex", flexDirection: "column", height: "100%", backgroundColor: theme.palette.background.default }}>
                    <h1 style = {{ color: theme.palette.text.primary, textAlign: "center", margin: "auto" }}>{message}</h1>
                </div>
            )
        }
        else {
            return <Messages />
        }
    }

    return (
        <div style = {{ height: "100%", display: "flex", width: "100%" }}>
            <ChannelList />
            { _renderContent() }
        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user,
        channels: state.channels
    }
}

export default connect(mapStateToProps, {  })(withTheme(MessagesView))