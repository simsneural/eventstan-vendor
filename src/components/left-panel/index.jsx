import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from "@material-ui/core";
import { HomeOutlined } from "@material-ui/icons";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const LeftPanelOuter = styled.div`
    background: #8489b2;
    width: 219px;
    height: 100vh;
    padding-top: 27px;
    float: left;
    .logo {
        width: 100%;
        float: left;
        padding: 0 20px;
        text-align: center;
    }
    .navigation {
        width: 100%;
        float: left;
        height: calc(100vh - 72px);
        overflow-y: auto;
        margin-top: 23px;
        .sidenav {
            .dashboard {
                .icon {
                    min-width: 0;
                    margin-right: 16px;
                }
            }
            .count {
                color: #ffffff;
                font-size: 12px;
                letter-spacing: 0;
                line-height: 16px;
                font-family: "camptonsemibold";
                height: 24px;
                width: 24px;
                border-radius: 50%;
                background-color: #111110;
                padding: 4px;
            }
            a {
                font-size: 16px;
                font-family: "camptonsemibold";
                line-height: 16px;
                letter-spacing: 0;
                font-weight: 600;
                &:hover {
                    background-color: rgba(0, 0, 0, 0.08);
                }
            }
        }
    }
`;

const LeftPanel = (props) => {
    const [activelink, setActivelink] = useState('/') 
    const location = useLocation();
    useEffect(() => {
        setActivelink(location.pathname)
      });
    const logout = ()=>{
        localStorage.removeItem("vendor-id");
        localStorage.removeItem("vend-auth-token");
        window.location.replace("/");
    }
    return (
        <LeftPanelOuter>
            <div className="logo">
                <img alt="EventStan Logo" src={require("../../images/logo.png").default} />
            </div>
            <div className="navigation">
                <List components="nav" className="sidenav">
                    <ListItem button component={Link} to="/" className="dashboard" selected={activelink=='/'?true:false} >
                        <ListItemIcon className="icon">
                            <HomeOutlined style={{ color: "#ffffff" }} />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" style={{ color: "#ffffff" }} />
                        <ListItemSecondaryAction>
                            <span className="count"></span>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem button component={Link} to="/listing" selected={activelink=='/listing'?true:false} >
                        <ListItemText primary="Listings" style={{ color: "#ffffff" }} />
                    </ListItem>
                    <ListItem button onClick={logout}>
                        <ListItemText primary="Logout" style={{ color: "#ffffff" }} />
                    </ListItem>
                </List>
            </div>
        </LeftPanelOuter>
    );
};

export default LeftPanel;
