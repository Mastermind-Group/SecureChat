import React from "react"

import { connect } from "react-redux"
import { withTheme, useTheme } from "@material-ui/core"

import SidePanel from "./SidePanel"
import ChannelView from "./ChannelView"

export const MessagesView = props => {
    const theme = useTheme()

    const _renderContent = _ => {
        const loading = props.channels.LOADING_CHANNELS
        const notIn = !props.channels.LOADING_CHANNELS && props.channels.channels.length === 0
        const click = !props.channels.LOADING_CHANNELS && props.channels.activeChannel === -1

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
            return <ChannelView />
        }
    }

    return (
        <div style = {{ height: "100%", display: "flex", width: "100%" }}>
            <SidePanel />
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