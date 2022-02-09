import "./Account.scss";
import core from "../../core";
import react from 'react';
import swal from 'sweetalert';

export default class Check extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSending: false,
            username: "",
            password: "",
            user: {
                name: "",
                phone: "",
                email: "",
                token: "",
                roles: []
            },
            medical_station: {
                name: "",
                address: "",
                wardsID: "",
                stationID: ""
            }
        };
        this.contactSubmit = this.contactSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({
            username: localStorage.getItem("username") || "",
            password: "password",
            user: {
                name: localStorage.getItem("user-full-name") || "",
                phone: localStorage.getItem("user-phone") || "",
                email: localStorage.getItem("user-email") || "",
                token: localStorage.getItem("user-token") || "",
                roles: localStorage.getItem("user-roles") || []
            },
            medical_station: {
                name: localStorage.getItem("station-name") || "",
                address: localStorage.getItem("station-address") || "",
                wardsID: localStorage.getItem("ward-id") || "",
                stationID: localStorage.getItem("station-id") || ""
            },

        });
    }

    saveData(data) {
        for (let key in data) {
            localStorage.setItem(key, data[key]);
        }
    }

    async contactSubmit(e) {
        e.preventDefault();
        this.setState({
            isSending: true
        });

        const data = await core.loginAction(this.state.username, this.state.password);
        console.log(data);

        if (data.ok) {
            swal("Thành công", "Đã đăng nhập thành công", "success");
            document.querySelector("#username").setCustomValidity(null);
            document.querySelector("#password").setCustomValidity(null);
            const { fullname, phone, token, roles, email, donvi, donvi_id } = data.data;
            const { ten, xaphuong_id, diachi } = donvi;

            this.setState({
                user: {
                    name: fullname,
                    phone: phone,
                    email: email,
                    token: token,
                    roles: roles
                },
                medical_station: {
                    name: ten,
                    address: diachi,
                    wardsID: xaphuong_id,
                    stationID: donvi_id
                }
            });

            this.saveData({
                username: this.state.username,
                "user-full-name": this.state.user.name,
                "user-phone": this.state.user.phone,
                "user-email": this.state.user.email,
                "user-token": this.state.user.token,
                "user-roles": this.state.user.roles,
                "station-name": this.state.medical_station.name,
                "station-address": this.state.medical_station.address,
                "ward-id": this.state.medical_station.wardsID,
                "station-id": this.state.medical_station.stationID
            });

        } else {
            swal("Error", data.error_message, "error");
            document.querySelector(".needs-validation").classList.add("was-validated");
            document.querySelector("#username").setCustomValidity("error");
            document.querySelector("#password").setCustomValidity("error");
        }

        this.setState({
            isSending: false
        });

        return data.ok;
    }

    contactClear() {
        swal({
            title: "Bạn có chắc?",
            text: "Khi bạn xóa, dữ liệu của bạn sẽ không thể khôi phục lại được!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    this.setState({
                        username: "",
                        password: "",
                        user: {
                            name: "",
                            phone: "",
                            email: "",
                            token: "",
                            roles: []
                        },
                        medical_station: {
                            name: "",
                            address: "",
                            wardsID: "",
                            stationID: ""
                        }
                    });

                    localStorage.clear();
                    swal("Ok! Dữ liệu đã xóa", {
                        icon: "success",
                    });
                } else {
                    swal("Hehe, bạn đã hủy thao tác này!");
                }
            });
    }

    handleChange(field, subField, e) {
        let fields = this.state;
        if (subField) {
            fields[field][subField] = e.target.value;
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }

    render() {
        return (
            <div className="af-account-page af-full-page" >
                <div className="page-name">
                    <h1>Tài khoản</h1>
                    <p>
                        Ở trnag này sẽ quản lý tài khoản của bạn. Để bắt đầu sử dụng hoặc khi xảy ra lỗi, bạn cũng cần đăng nhập lại
                    </p>
                </div>

                <div className="page">
                    <form
                        className="row needs-validation"
                        name="login-form">
                        <div className="col-md-4 p-3 section">
                            <div>
                                <div className="form-group">
                                    <label htmlFor="username">Tên tài khoản</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        value={this.state.username}
                                        onChange={this.handleChange.bind(this, "username", undefined)}
                                        placeholder="Enter username"
                                        disabled={this.state.isSending}
                                        required />
                                    <div className="invalid-feedback">
                                        oop! username or password is incorrect.
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Mật khẩu</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={this.state.password}
                                        onChange={this.handleChange.bind(this, "password", undefined)}
                                        placeholder="Password"
                                        disabled={this.state.isSending}
                                        required />
                                    <div className="invalid-feedback">
                                        oop! username or password is incorrect.
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end mt-5">
                                    <button className="btn btn-danger me-3" onClick={this.contactClear.bind(this)}>
                                        Xóa dữ liệu
                                    </button>

                                    <button
                                        className="btn btn-primary"
                                        disabled={this.state.isSending}
                                        onClick={this.contactSubmit.bind(this)}>
                                        {this.state.isSending
                                            ? (
                                                <div>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    <span className="ms-2">Loading...</span>
                                                </div>
                                            ) : "Login"}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 p-3 section">
                            <div>
                                <div className="form-group">
                                    <label htmlFor="user-name">Tên người dùng</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="user-name"
                                        placeholder="Nguyen Van A"
                                        value={this.state.user.name}
                                        onChange={this.handleChange.bind(this, "user", "name")}
                                        disabled />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="user-email">Email</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="user-email"
                                        placeholder="nvs@gmail.com"
                                        value={this.state.user.email}
                                        disabled />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="user-phone">Số ddienj thoại</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="user-phone"
                                        placeholder="0123456789"
                                        value={this.state.user.phone}
                                        onChange={this.handleChange.bind(this, "user", "phone")}
                                        disabled />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="organization-name">Tên trạm</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="organization-name"
                                        value={this.state.medical_station.name}
                                        onChange={this.handleChange.bind(this, "medical_station", "name")}
                                        placeholder="TTYT A"
                                        disabled />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="organization-address">Địa chỉ trạm</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="organization-address"
                                        value={this.state.medical_station.address}
                                        onChange={this.handleChange.bind(this, "medical_station", "address")}
                                        placeholder="Ha Noi"
                                        disabled />
                                </div>

                            </div>
                        </div>
                        <div className="col-md-4 p-3 section">
                            <div className="form-group">
                                <label htmlFor="user-token">Token</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="user-token"
                                    placeholder="user_token"
                                    value={this.state.user.token}
                                    onChange={this.handleChange.bind(this, "user", "token")}
                                    disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="organization-id">Mã trạm</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="organization-id"
                                    placeholder="organization_id"
                                    value={this.state.medical_station.stationID}
                                    onChange={this.handleChange.bind(this, "medical_station", "stationID")}
                                    disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wards-id">Mã địa phương</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="wards-id"
                                    placeholder="ward_id"
                                    value={this.state.medical_station.wardsID}
                                    onChange={this.handleChange.bind(this, "medical_station", "wardsID")}
                                    disabled />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}