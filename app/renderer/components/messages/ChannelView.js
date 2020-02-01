import React, { useEffect, useState } from "react"

import { connect } from "react-redux"
import { withTheme, useTheme } from "@material-ui/core"

import { sendData } from "../../actions/socketActions"

import { encrypt } from "../../util/crypto"
import { authReq } from "../../customAxios"

import Message from "./Message"

import { 
    TextField, 
    Button, 
    CircularProgress, 
    Divider 
} from "@material-ui/core"

let lastSend = null
const typingDurationSafety = 3000

const ChannelView = props => {
    const theme = useTheme()

    const [formMessage, setMessage] = useState("")
    const [sending, setSending] = useState(false)
    const [loading] = useState(false)

    const currentChannel = props.channels.channels[props.channels.activeChannel]
    const users = Object.keys(currentChannel.privateKeys).map(key => key)
    const typers = Object.keys(currentChannel.typers).map(key => currentChannel.typers[key])
    let typingText = " "

    if(typers.length > 3) {
        typingText = "Multiple people are typing"
    }
    else if(typers.length === 1) {
        typingText = typers[0].WhoTypingUsername + " is typing"
    }
    else if(typers.length === 2) {
        typingText = typers[0].WhoTypingUsername + " and " + typers[1].WhoTypingUsername + " are typing"
    }
    else if(typers.length > 2) {
        for(let i of typers) {
            typingText += i.WhoTypingUsername

            if(i !== typers[typers.length - 1]) {
                typingText += ", "
            }
        }

        typingText += " are typing"
    }
    useEffect(_ => {
        lastSend = null

        return _ => {
            lastSend = null
        }
    }, [])

    useEffect(_ => {
        document.getElementById("message-scroll-here").scrollTop = document.getElementById("message-scroll-here").scrollHeight
    }, [currentChannel.messages.length])

    const sendMessage = _ => {
        if(formMessage === "") {
            return
        }

        setSending(true)

        authReq(props.user.token).post("https://servicetechlink.com/message/create", JSON.stringify({
            channelID: currentChannel._id,
            message: encrypt(JSON.stringify({
                content: formMessage,
                sender: props.user.username
            }), currentChannel.AESKey)
        }))
            .then(_data => {
                setSending(false)
                setMessage("")
            })
    }

    const sendTyping = _ => {
        const userCopy = [...users]

        //delete userCopy[props.user._id]

        props.sendData(JSON.stringify({
            type: "IS_TYPING",
            content: {
                channelID: currentChannel._id,
                users: userCopy,
                whoTypingUsername: props.user.username,
                whoTypingID: props.user._id
            }
        }))
        lastSend = new Date()
    }

    const handleKeyPress = event => {
        if(!event) return

        const keyCode = event.keyCode || event.which

        if(keyCode === 13 && !loading) {
            sendMessage()
            return false
        } else if(!loading) {
            if(!lastSend) {
                sendTyping()
            }
            else if(new Date().getTime() - lastSend.getTime() >= typingDurationSafety) {
                sendTyping()
            }
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

            return (
                <Message 
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
            )
        })
    }

    return (
        <div style = {{ flex: 1, display: "flex", flexDirection: "column", height: "100%", backgroundColor: theme.palette.background.default }}>
            <div style = {{ flex: "1 1 auto", display: "flex", flexDirection: "column", overflowY: "auto" }} id = "message-scroll-here">
                { _renderMessages() }
            </div>
            <Divider />
            <div style = {{ display: "flex", flexDirection: "column", justifyContent: "center", backgroundColor: theme.palette.background.default, marginTop: 15 }}>
                <div style = {{ display: "flex", alignItems: "center", backgroundColor: theme.palette.background.default, margin: "0 15px" }}>
                    <TextField 
                        style = {{ flex: 1, padding: 0, borderRadius: "4px 0 0 4px" }} 
                        label = {"Message " + currentChannel.Name}
                        variant = "outlined" 
                        value = {formMessage} 
                        onChange = {event => setMessage(event.target.value)} 
                        onKeyDown = {handleKeyPress}
                    />
                    { <Button style = {{ height: 56, borderRadius: "0 4px 4px 0" }} color = "primary" variant = "contained" onClick = {sendMessage} disabled = {sending}>Send</Button>}
                </div>
                <h6 style = {{ margin: 0, marginLeft: 15, color: theme.palette.text.primary, minHeight: 15 }}>{typingText}</h6>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user,
        channels: state.channels,
    }
}

export default connect(mapStateToProps, { sendData })(withTheme(ChannelView))