import "./UserIcon.scss";
export default function UserIcon(props) {
    return (
        <div className="d-flex align-items-center">
            <div className="navbar__user-icon">
                <img src="https://kokekokko.com.vn/wp-content/uploads/2021/06/tai-hinh-anh-avatar-hai-huoc-nhin-la-bat-cuoi.jpg" alt="logo" width="100%"></img>
            </div>
            <div className="navbar__user-info">
                <h5 className="username">{props.station_name}</h5>
                <div className="roles">
                    <h5 className="role-tag">{props.user_name}</h5>
                </div>
            </div>
        </div>
    );
}