import "./Navbar.scss";

import { ReactComponent as ConfigIcon } from "../../assets/icons/chartvertical.svg";
import { ReactComponent as AccountIcon } from "../../assets/icons/user1.svg";
import { ReactComponent as RunIcon } from "../../assets/icons/play.svg";
import NavIcon from "./NavIcon";
import UserIcon from "./UserIcon";
import React from 'react';

export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            health_station_name: "TTYT",
            username: "nghia",
        }
    }

    componentDidMount() {
        this.setState({
            health_station_name: localStorage.getItem("station-name") || "Unknown",
            username: localStorage.getItem("user-full-name") || "Unknown",
        })
    }

    render() {
        return (
            <div className="navbar__wrapper">
                <div className={`navbar__container d-flex flex-column justify-content-between`}>
                    <div className="d-flex flex-column">
                        <div className="logo">
                            <img src="/assets/logo/logo_48_w.png" height="100%" alt="logo-app"></img>
                        </div>
                        <div className="py-5"></div>
                        <div>
                            <div className="af-group-link">
                                <h4>Setting</h4>
                                <div>
                                    <NavIcon to="/configs" title="Configs">
                                        <ConfigIcon />
                                    </NavIcon>
                                    <NavIcon to="/account" title="Account">
                                        <AccountIcon />
                                    </NavIcon>
                                </div>
                            </div>
                            <div className="af-group-link">
                                <h4>Work</h4>
                                <div>
                                    <NavIcon to="/" title="Run">
                                        <RunIcon />
                                    </NavIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                    <UserIcon station_name={this.state.health_station_name} user_name={this.state.username}></UserIcon>
                </div>
            </div>
        )
    }
}