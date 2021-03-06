import React from "react"

import { FiX, FiCheck } from "react-icons/fi"
import { Dialog, DialogTitle, Button } from "@material-ui/core"

const ConfirmComp = props => {
    const _renderAdditional = _ => {
        if(props.render) return props.render()
    }

    return (
        <Dialog open={props.open}>
            <DialogTitle style={{ fontWeight: "800 !important" }}>{props.title}</DialogTitle>
            <ul>
                {
                    props.text.map((text, i) =>
                        <li key={i} style={{ margin: "15px 0" }}>{text}</li>
                    )
                }
            </ul>
            { _renderAdditional() }
            <div style={{ display: "flex", justifyContent: "flex-end", padding: 10 }}>
                <Button color="secondary" variant="outlined" onClick={props.onCancel}><FiX color="red" /> Cancel</Button>
                <h1 style={{ width: 15 }}></h1>
                <Button style={{ color: "green", borderColor: "green" }} variant="outlined" onClick={props.onProceed} ><FiCheck color="green" /> Proceed</Button>
            </div>
        </Dialog>
    )
}

export default ConfirmComp