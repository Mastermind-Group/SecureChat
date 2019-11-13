import React, { useEffect, useState } from "react"

import { connect } from 'react-redux'

import Message from "./Message"

import axios from "axios"

import { TextField, Button, CircularProgress, withTheme, useTheme } from "@material-ui/core"

import { encrypt } from '../util/crypto'

const Messages = props => {
    const theme = useTheme()

    const [formMessage, setMessage] = useState("")
    const [sending, setSending] = useState(false)
    const [loading, setLoading] = useState(false)

    const currentChannel = props.channels.channels[props.channels.activeChannel]

    useEffect(_ => {
        document.getElementById("message-scroll-here").scrollTop = document.getElementById("message-scroll-here").scrollHeight
    }, [currentChannel.messages.length])

    const sendMessage = _ => {
        if(formMessage === "") {
            return
        }

        setSending(true)

        axios.post("https://servicetechlink.com/message/create", JSON.stringify({
            channelID: currentChannel._id,
            message: encrypt(JSON.stringify({
                content: formMessage,
                sender: props.user.username
            }), currentChannel.AESKey)
        }), {
            headers: {
                'Accept': "application/json",
                "Authorization": props.user.token,
                "Content-Type": "application/json"
            }
        })
            .then(data => {
                setSending(false)
                setMessage("")
            })
    }

    const handleKeyPress = event => {
        if(!event) event = window.event

        let keyCode = event.keyCode || event.which

        if(keyCode === 13 && !loading) {
            sendMessage()
            return false
        }
    }

    const _renderMessages = _ => {
        if(loading) {
            return <><h4>Loading and decrypting messages...</h4><CircularProgress size = {23} /></>
        }
        else return currentChannel.messages.map((e, index) => {
            let data = e.Encrypted

            if(typeof data === "string")
                data = JSON.parse(e.Encrypted)

            let last = false

            if(index > 0) {
                last = currentChannel.messages[index - 1]

                if(typeof last.Encrypted === "string")
                    last.Encrypted = JSON.parse(currentChannel.messages[index - 1].Encrypted)
            }

            return <Message 
                        key = {e._id} 
                        data = {e} 
                        parsed = {data} 
                        myself = {props.user.username} 
                        last = {last} 
                        myColor = {theme.palette.primary.main} 
                        myText = {theme.palette.primary.contrastText}
                        otherColor = {theme.palette.secondary.main}
                        otherText = {theme.palette.secondary.contrastText}
                        backgroundText = {theme.palette.text.primary}
                    />
        })
    }

    return (
        <div style = {{ flex: 1, display: "flex", flexDirection: "column", height: "100%", backgroundColor: theme.palette.background.default }}>
            <div style = {{ flex: "1 1 auto", display: "flex", flexDirection: "column", overflowY: "auto" }} id = "message-scroll-here">
                { _renderMessages() }
            </div>
            <div style = {{ display: "flex", alignItems: "center", backgroundColor: theme.palette.background.default }}>
                <TextField 
                    style = {{ flex: 1, padding: 0 }} 
                    label = {"Message " + currentChannel.Name}
                    variant = "outlined" 
                    value = {formMessage} 
                    onChange = {event => setMessage(event.target.value)} 
                    onKeyDown = {handleKeyPress}
                />
                { <Button style = {{ height: 56 }} color = "primary" variant = "contained" onClick = {sendMessage} disabled = {sending}>Send</Button>}
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        user: state.user,
        channels: state.channels
    }
}

export default connect(mapStateToProps, {  })(withTheme(Messages))