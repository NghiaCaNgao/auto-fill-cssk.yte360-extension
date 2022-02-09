import "./NavIcon.scss";
import { NavLink } from "react-router-dom";

export default function NavIcon(props) {
    return (
        <NavLink to={props.to} activeclassname="active" className="d-flex align-items-center justify-content-center navbar__icon">
            {props.children}
            <h5 className="title">{props.title}</h5>
        </NavLink >
    );
}