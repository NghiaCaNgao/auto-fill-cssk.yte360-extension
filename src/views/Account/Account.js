import "./Account.scss";
import Core from "../../utils/core";
import Storage from "../../utils/storage";
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
                token: ""
            },
            medical_station: {
                name: "",
                address: "",
                wardsID: "",
                stationID: ""
            }
        };
        this.accountSubmit = this.accountSubmit.bind(this);
    }

    async componentDidMount() {
        const { username, user, medical_station, token } =
            await Storage.getDataFromChromeStorage(["username", "user", "medical_station", "token"]);

        this.setState({
            username: username || "",
            password: "password",
            user: {
                name: user.name || "",
                token: token || "",
            },
            medical_station: {
                name: medical_station.name || "",
                address: medical_station.address || "",
                wardsID: medical_station.wardsID || "",
                stationID: medical_station.stationID || ""
            },
        });
    }

    async accountSubmit(e) {
        // Show loading
        e.preventDefault();
        this.setState({
            isSending: true
        });

        // Login and handle response data
        const data = await Core.loginAction(this.state.username, this.state.password);
        if (data.ok) {
            swal("Thành công", "Đã đăng nhập thành công", "success");
            const { fullname, token, donvi, donvi_id } = data.data;
            const { ten, xaphuong_id, diachi } = donvi;

            // Save data to state and chrome storage
            this.setState({
                user: {
                    name: fullname,
                    token: token,
                },
                medical_station: {
                    name: ten,
                    address: diachi,
                    wardsID: xaphuong_id,
                    stationID: donvi_id
                }
            });

            await Storage.setDataToChromeStorage({
                username: this.state.username,
                user: {
                    name: this.state.user.name,
                },
                token: this.state.user.token,
                medical_station: {
                    name: this.state.medical_station.name,
                    address: this.state.medical_station.address,
                    wardsID: this.state.medical_station.wardsID,
                    stationID: this.state.medical_station.stationID
                }
            });

        } else {
            // If fail, show error message
            swal("Error", data.error_message, "error");
            document.querySelector(".needs-validation").classList.add("was-validated");
            document.querySelector("#username").setCustomValidity("error");
            document.querySelector("#password").setCustomValidity("error");
        }

        // Hide loading
        this.setState({
            isSending: false
        });
        return data.ok;
    }

    logout() {
        // Confirm logout
        swal({
            title: "Bạn có chắc?",
            text: "Khi bạn đăng xuất, token và các thông tin tài khoản của bạn sẽ mất!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    // Reset data to default
                    this.setState({
                        username: "",
                        password: "",
                        user: {
                            name: "",
                            token: "",
                        },
                        medical_station: {
                            name: "",
                            address: "",
                            wardsID: "",
                            stationID: ""
                        }
                    });
                    await Storage.clearChromeStorage();

                    swal("Ok! Đã đăng xuất", {
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
                                        oop! Tài khoản hoặc mật khẩu không đúng.
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
                                        oop! Tài khoản hoặc mật khẩu không đúng.
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end mt-5">
                                    <button
                                        className="btn btn-danger me-3"
                                        onClick={this.logout.bind(this)}>
                                        Đăng xuất
                                    </button>

                                    <button
                                        className="btn btn-primary"
                                        disabled={this.state.isSending}
                                        onClick={this.accountSubmit.bind(this)}>
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