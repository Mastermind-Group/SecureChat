import React, { useEffect } from "react"

import { connect } from "react-redux"
import { loadChannels, setActive } from "../actions/channelActions"

import { withRouter } from "react-router-dom"

import Channel from "./Channel"
import CreateChannel from "./CreateChannel"

import { CircularProgress } from "@material-ui/core"
import { withTheme, useTheme } from "@material-ui/core/styles"

const SidePanel = props => {
    const theme = useTheme()

    useEffect(_ => {
        reload()
    }, [props.connection.serverConnected])

    const setActive = (channelIndex) => {
        props.setActive(channelIndex)
    }

    const sortChannels = (c1, c2) => {
        let c1Last = c1.messages[c1.messages.length - 1]
        let c2Last = c2.messages[c2.messages.length - 1]

        if(!c1Last) return 1
        if(!c2Last) return -1

        let c1Time = new Date(c1Last.Timestamp)
        let c2Time = new Date(c2Last.Timestamp)

        return c2Time - c1Time
    }

    const _renderChannels = _ => {
        if (props.channels.LOADING_CHANNELS) {
            return (
                <div style={{ display: "flex", justifyContent: "center", margin: "15px 0" }}>
                    <CircularProgress size={17} />
                </div>
            )
        }
        else {
            return props.channels.channels.slice().sort(sortChannels).map(e =>
                <Channel key={e._id} data={e} setActive={setActive} isCurrent={props.channels.activeChannel === e.index} />
            )
        }
    }

    const reload = _ => {
        if (props.connection.serverConnected && props.channels.channels.length === 0)
            props.loadChannels(props.user)
    }

    return (
        <div style={{ width: "20%", maxWidth: 200, backgroundColor: theme.palette.background.paper, overflowY: "auto", height: "100%" }}>
            {_renderChannels()}
            
            <CreateChannel />
        </div>
    );
}

const mapStateToProps = state => {
    return {
        user: state.user,
        channels: state.channels,
        connection: state.connection
    }
}

export default connect(mapStateToProps, { loadChannels, setActive })(withRouter(withTheme(SidePanel)))

