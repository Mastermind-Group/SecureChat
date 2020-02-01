import React from "react"

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

    return (
        <>
            { time && <p style = {{ textAlign: "center", margin: 0, color: props.backgroundText }}>{formatTime(time)}</p> }

            <div style = {{ alignSelf: aligned, margin: "5px 10px", maxWidth: "50%", wordBreak: "break-all" }}>
                { !lastWasSame && <h4 style = {{ textAlign: textAlign, margin: 0, color: props.backgroundText }}>{sender}</h4> }
                <div style = {{ backgroundColor: color, minWidth: 20, padding: 10, borderRadius: border }}>
                    <p style = {{ margin: 0, color: textColor }}>{props.parsed.content}</p>
                    <p style = {{ margin: 0, fontSize: "0.8rem" }}>{formatMessageTime(props.data.Timestamp)}</p>
                </div>
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