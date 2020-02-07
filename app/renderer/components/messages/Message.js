import React from "react"

import { Button } from "@material-ui/core"
import { IoMdDownload } from "react-icons/io"

const Message = props => {
    const isMe = props.myself === props.parsed.sender
    let lastWasSame = false

    if(props.last)
        lastWasSame = props.parsed.sender === (props.last.Encrypted.sender)

    const border = isMe ? "8px 8px 0 8px" : "8px 8px 8px 0"
    const color = isMe ? props.myColor : props.otherColor
    const aligned = isMe ? "flex-end" : "flex-start"
    const sender = isMe ? "You: " : props.parsed.sender + ": "
    const textAlign = isMe ? "end" : "start"
    const textColor = isMe ? props.myText : props.otherText

    let time = false

    if(!props.last) {
        time = new Date(props.data.Timestamp)
    } 
    else if(new Date(props.last.Timestamp).getTime() <= new Date(props.data.Timestamp).getTime() - (3600 * 1000)) {
        time = new Date(props.data.Timestamp)
    }

    let extension = ""

    if(props.parsed.type !== "MESSAGE") {
        const reverse = props.parsed.content.name.split("").reverse().join("")

        for(let i of reverse) {
            extension += i

            if(i === ".") {
                break
            }
        }

        extension = extension.split("").reverse().join("")
    }

    return (
        <>
            { time && <p style = {{ textAlign: "center", margin: 0, color: props.backgroundText }}>{formatTime(time)}</p> }

            <div 
                style = {{ 
                    alignSelf: aligned, 
                    margin: "5px 10px", 
                    maxWidth: "50%", 
                    wordBreak: "break-all",
                    border: props.parsed.type !== "MESSAGE" ? "1px solid " + color : "",
                    borderRadius: border
                }}
            >
                { !lastWasSame && <h4 style = {{ textAlign: textAlign, margin: 0, color: props.backgroundText }}>{sender}</h4> }
                
                <div style = {{ backgroundColor: color, minWidth: 20, padding: 10, borderRadius: border }}>
                    { 
                        props.parsed.type === "MESSAGE" ?  
                        <p style = {{ margin: 0, color: textColor, wordBreak: "break-word" }}>{props.parsed.content}</p> : 
                        <>
                            <p style = {{ margin: 0, color: textColor }}>Short name: {props.parsed.content.name.slice(0, 25)}</p>
                            <p style = {{ margin: "5px 0 0 0", color: textColor }}>Type: {props.parsed.content.extension}: "{extension}"</p>
                            <p style = {{ margin: "5px 0 5px 0", color: textColor }}>Size: {(props.parsed.content.size / 1000000).toFixed(2)} MB</p>
                        </>
                    }
                    
                    <p style = {{ margin: 0, fontSize: "0.8rem", color: textColor }}>{formatMessageTime(props.data.Timestamp)}</p>
                </div>

                { 
                    props.parsed.type !== "MESSAGE" && 
                    <div style = {{ display: "flex", margin: "5px 10px", flexDirection: "column", alignItems: "flex-end" }}>
                        <h6 style = {{ margin: 0, color: props.backgroundText }}>{props.parsed.content.name}</h6> 
                        { 
                            props.parsed.type !== "MESSAGE" && 
                            <Button 
                                color = "primary"
                                variant = "contained"
                                onClick = {_ => props.fileDownloaded(props.parsed.content)} 
                                style = {{ margin: "10px 0px 10px 10px", color: textColor, width: 150 }}
                            >
                                Download 
                                <IoMdDownload size = {23} style = {{ marginLeft: 5 }} />
                            </Button> 
                        }
                    </div>
                }
            </div>
        </>
    )
}

export default Message

function formatMessageTime(time) {
    const date = new Date(time)

    let minute = date.getMinutes()

    if(minute === 0) minute = "00"
    else if (minute <= 9) minute = "0" + minute

    const ampm = date.getHours() <= 11 ? "AM" : "PM"

    let hour = ampm === "AM" ? date.getHours() : date.getHours() - 12

    if(hour === 0) hour = "00"

    return hour + ":" + minute + " " + ampm
}

function formatTime(date) {
    const currentDate = new Date()

    if(currentDate.getFullYear() === date.getFullYear() && currentDate.getMonth() === date.getMonth() && currentDate.getDate() === date.getDate()) {
        return formatMessageTime(date)
    }

    return date.toLocaleDateString()
}