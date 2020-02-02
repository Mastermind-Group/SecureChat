import React, { useEffect, Fragment } from "react"

import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import { withTheme, useTheme } from "@material-ui/core/styles"

import { loadChannels, setActive } from "../../actions/channelActions"

import Channel from "./Channel"
import CreateChannel from "./CreateChannel"

import { CircularProgress, makeStyles, Divider } from "@material-ui/core"

const useStyles = makeStyles({
    container: ({ theme }) => ({
        resize: "horizontal",
        minWidth: 200,
        maxWidth: 400,
        overflowY: "auto", 
        height: "100%",
        backgroundColor: theme.palette.background.paper, 
    }),
    loadingContainer: {
        display: "flex", 
        justifyContent: "center", 
        margin: "15px 0"
    },
    divider: ({ theme }) => ({
        backgroundColor: theme.palette.background.default
    })
})

const SidePanel = props => {
    const theme = useTheme()
    const styles = useStyles({ theme })

    useEffect(_ => {
        reload()
    }, [props.connection.serverConnected])

    const setActive = (channelIndex) => {
        props.setActive(channelIndex)
    }

    const sortChannels = (c1, c2) => {
        const c1Last = c1.messages[c1.messages.length - 1]
        const c2Last = c2.messages[c2.messages.length - 1]

        if(!c1Last) return 1
        if(!c2Last) return -1

        const c1Time = new Date(c1Last.Timestamp)
        const c2Time = new Date(c2Last.Timestamp)

        return c2Time - c1Time
    }

    const _renderChannels = _ => {
        if (props.channels.LOADING_CHANNELS) {
            return (
                <div className = {styles.loadingContainer}>
                    <CircularProgress size={17} />
                </div>
            )
        }
        else {
            return props.channels.channels.slice().sort(sortChannels).map(e =>
                <Fragment key={e._id}>
                    <Channel data={e} setActive={setActive} isCurrent={props.channels.activeChannel === e.index} myUsername = {props.user.username} />
                    <Divider className = {styles.divider} />
                </Fragment>
            )
        }
    }

    const reload = _ => {
        if (props.connection.serverConnected && props.channels.channels.length === 0)
            props.loadChannels(props.user)
    }

    return (
        <div className = {styles.container}>
            {_renderChannels()}
            
            <CreateChannel />
        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user,
        channels: state.channels,
        connection: state.connection
    }
}

export default connect(mapStateToProps, { loadChannels, setActive })(withRouter(withTheme(SidePanel)))

