import "./Account.scss";
import Storage from "../../utils/storage";
import react from 'react';
import swal from 'sweetalert';
import Utils from "../../utils/utils";

import InputText from "../../components/FormGroup/InputText";

export default class Check extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSending: false,
            user: {
                name: Utils.DEFAULT.name,
                token: Utils.DEFAULT.token,
            },
            medical_station: {
                name: Utils.DEFAULT.medical_station,
                address: Utils.DEFAULT.address,
                wardsID: Utils.DEFAULT.wardsID,
                stationID: Utils.DEFAULT.stationID,
            }
        };
    }

    async componentDidMount() {
        const { user, medical_station, token } = await Storage.getAccountInfo();

        this.setState({
            user: {
                name: user.name,
                token: token,
            },
            medical_station: {
                name: medical_station.name,
                address: medical_station.address,
                wardsID: medical_station.wardsID,
                stationID: medical_station.stationID
            },
        });
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
                        user: {
                            name: Utils.DEFAULT.name,
                            token: Utils.DEFAULT.token,
                        },
                        medical_station: {
                            name: Utils.DEFAULT.medical_station,
                            address: Utils.DEFAULT.address,
                            wardsID: Utils.DEFAULT.wardsID,
                            stationID: Utils.DEFAULT.stationID,
                        }
                    });
                    await Storage.clearChromeStorage();

                    swal("Ok! Đã đăng xuất", {
                        icon: "success",
                    });
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
                </div>
            </div>
        )
    }
}