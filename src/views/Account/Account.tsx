import React from "react"
import swal from 'sweetalert';
import Storage from "@/utils/storage";
import InputText from "@/components/FormGroup/InputText";
import Config, { AccountObject, DefaultAccountObject } from '../../utils/config';

import "./Account.scss";

type State = {
    account: AccountObject,
}


export default class Check extends React.Component<{}, State> {
    async componentDidMount() {
        const config = await Config.load();
        const accountData = config.getAccount();

        this.setState({
            account: accountData,
        });
    }

    async logout() {
        // Confirm logout
        const willLogout = await swal({
            title: "Bạn có chắc?",
            text: "Khi bạn đăng xuất, token và các thông tin tài khoản của bạn sẽ mất!",
            icon: "warning",
            buttons: [true],
            dangerMode: true,
        });

        if (willLogout) {
            this.setState({
                account: DefaultAccountObject
            });
            await Storage.clear();
            swal("Ok! Đã đăng xuất", {
                icon: "success",
            });
        };
    }

    render() {
        return (
            <div className="af-account-page af-full-page" >
                <div className="page-name">
                    <h1>Tài khoản</h1>
                    <p>
                        Ở trang này sẽ quản lý tài khoản của bạn. Để bắt đầu sử dụng hoặc khi xảy ra lỗi, bạn cũng cần đăng nhập lại
                    </p>
                </div>

                <div className="page">
                    <div className="col-md-4 p-3 section">
                        <div>
                            <InputText
                                id="fullname"
                                name="Họ và tên"
                                value={this.state.account.name}
                                disabled={true}
                            />

                            <InputText
                                id="station_name"
                                name="Tên trạm"
                                value={this.state.account.medical_station.name}
                                disabled={true}
                            />

                            <InputText
                                id="station_address"
                                name="Địa chỉ trạm"
                                value={this.state.account.medical_station.address}
                                disabled={true}
                            />

                        </div>
                    </div>
                    <div className="col-md-4 p-3 section">
                        <InputText
                            id="token"
                            name="Token"
                            value={this.state.account.token}
                            disabled={true}
                        />

                        <InputText
                            id="station_id"
                            name="ID trạm"
                            value={this.state.account.medical_station.medical_station_id}
                            disabled={true}
                        />

                        <InputText
                            id="wards_id"
                            name="ID địa phương"
                            value={this.state.account.medical_station.wards_id}
                            disabled={true}
                        />
                    </div>
                </div>
            </div>
        )
    }
}