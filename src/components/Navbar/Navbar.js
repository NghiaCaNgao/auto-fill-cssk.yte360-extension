import "./NavIcon.scss";

import { ReactComponent as ConfigIcon } from "../../assets/icons/chartvertical.svg";
import { ReactComponent as AccountIcon } from "../../assets/icons/user1.svg";
import { ReactComponent as RunIcon } from "../../assets/icons/play.svg";
import { ReactComponent as InfoIcon } from "../../assets/icons/infocircle.svg";
import React from 'react';
import { NavLink } from "react-router-dom";

export default class Navbar extends React.Component {
    render() {
        return (
            <div className="vh-100 p-3 d-flex flex-column justify-content-start align-items-center af-navbar">
                 <div className="py-3"></div>
                <div className="logo">
                    <img src="/assets/logo/logo_48_p.png" height="100%" alt="logo-app"></img>
                </div>
                <div className="py-5"></div>
                <div className="d-flex flex-column justify-content-start align-items-center">
                    <div className="af-group-link">
                        <div>
                            <NavLink
                                to="/configs"
                                activeclassname="active"
                                className="d-flex align-items-center justify-content-center navbar__icon mx-auto">
                                <ConfigIcon />
                            </NavLink >
                            <NavLink
                                to="/account"
                                activeclassname="active"
                                className="d-flex align-items-center justify-content-center navbar__icon mx-auto">
                                <AccountIcon />
                            </NavLink >
                            <NavLink
                                to="/"
                                activeclassname="active"
                                className="d-flex align-items-center justify-content-center navbar__icon mx-auto">
                                <RunIcon />
                            </NavLink >
                            <NavLink
                                to="/info"
                                activeclassname="active"
                                className="d-flex align-items-center justify-content-center navbar__icon mx-auto">
                                <InfoIcon />
                            </NavLink >
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}