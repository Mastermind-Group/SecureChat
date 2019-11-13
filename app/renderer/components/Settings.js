import React, { useEffect, useState } from "react"

import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

import Themes from "./Themes"

import { List, ListItem, ListItemIcon, ListItemText, makeStyles, withTheme, useTheme } from "@material-ui/core"

import { FiMessageCircle } from "react-icons/fi"

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper
    },
    selected: {
        backgroundColor: theme.palette.primary.main
    }
  }));

const SettingsList = [
    {
        name: "Themes",
        icon: props => <FiMessageCircle {...props} />,
        view: props => <Themes {...props} />,
        props : {},
        style: { cursor: "pointer" }
    },
    {
        name: "Chat preferences",
        icon: props => <FiMessageCircle {...props} />,
        view: <></>,
        props: { disabled: true },
        style: { }
    },
]

const SidePanel = props => {
    const theme = useTheme()

    const [activePanel, setActive] = useState(SettingsList[0])

    return (
        <div style = {{ height: "100%", display: "flex", width: "100%" }}>
            <div style={{ width: "20%", maxWidth: 200, backgroundColor: theme.palette.background.paper, overflowY: "auto", height: "100%" }}>
                <List>
                    {
                        SettingsList.map(panel => {
                            const isActive = panel === activePanel

                            const background = isActive ? theme.palette.primary.main : ""

                            const textColor = isActive ? theme.palette.primary.contrastText : ""

                            const newStyles = {
                                ...panel.style,
                                backgroundColor: background
                            }

                            return (
                                <ListItem key = {panel.name} style = {newStyles} button = {!isActive} onClick = {_ => setActive(panel)} selected = {isActive} {...panel.props} >
                                    <ListItemIcon>{panel.icon({ size: 23, color: textColor })}</ListItemIcon>
                                    <ListItemText primary={panel.name} style = {{ color: textColor }} />
                                </ListItem>
                            )
                        })
                    }
                </List>
            </div>
            <div style = {{ flex: 1, display: "flex", flexDirection: "column", height: "100%", backgroundColor: theme.palette.background.default }}>
                { activePanel.view() }
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        theme: state.theme,
    }
}

export default connect(mapStateToProps, {})(withRouter(withTheme(SidePanel)))