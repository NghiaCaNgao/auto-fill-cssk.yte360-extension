import React from "react";
import swal from "sweetalert";
import Core from "../../utils/core";
import Storage from "../../utils/storage";
import Utils from "../../utils/utils";
export default class Run extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRunning: false,
            isShiftPressing: false,
            lastCheckedItemIndex: 0,
            isCheckedAll: true,
            patientList: [],
            filter: {
                phone: Utils.DEFAULT.phone,
                name: Utils.DEFAULT.name_filter,
                treatment_day: Utils.DEFAULT.treatment_day,
                from: Utils.DEFAULT.from,
                to: Utils.DEFAULT.to,
                is_12: Utils.DEFAULT.is_12,
            },
            configs: {
                delay: Utils.DEFAULT.delay_request,
                delayPost: Utils.DEFAULT.delay_post,
                runMode: Utils.DEFAULT.run_mode,
            },
        };
    }

    async componentDidMount() {
        let filter = localStorage.getItem('filter') || '{}';
        const run_config = await Storage.getRunConfig();
        const account = await Storage.getAccountInfo();
        filter = JSON.parse(filter);

        this.setState({
            filter: {
                phone: filter.phone || Utils.DEFAULT.phone,
                name: filter.name || Utils.DEFAULT.name_filter,
                treatment_day: filter.treatment_day || Utils.DEFAULT.treatment_day,
                from: filter.from || Utils.DEFAULT.from,
                to: filter.to || Utils.DEFAULT.to,
                is_12: filter.is_12 || Utils.DEFAULT.is_12,
            },
            configs: {
                runMode: localStorage.getItem('run-mode') || Utils.DEFAULT.run_mode,
                delay: run_config.delay_request,
                delayPost: run_config.delay_post,
                medicalStationID: account.medical_station.stationID,
                wardID: account.medical_station.wardsID
            },
        });

        window.addEventListener('keydown', (e) => {
            if (e.keyCode === 16) {
                this.setState({
                    isShiftPressing: true
                });
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.keyCode === 16) {
                this.setState({
                    isShiftPressing: false
                });
            }
        });
    }

    async getFilterData(prev) {
        this.setState({
            isRunning: true
        });

        const filter = this.state.filter;
        const prevLength = prev.length;

        let data = await Core.filter(
            {
                ...filter,
                medical_station: this.state.configs.medicalStationID,
                ward_id: this.state.configs.wardID
            });

        data = data.map((item, _index) => {
            return { ...item, index: _index + prevLength + 1 };
        })

        this.setState({
            patientList: [...prev, ...data],
            isRunning: false,
            isCheckedAll: true,
        });

        localStorage.setItem('filter', JSON.stringify(filter));
    }

    async actions(success_text, delay, func, ...args) {
        this.setState({
            isRunning: true
        });

        const numberOfPatients = this.state.patientList.length;
        for (let i = 0; i < numberOfPatients; i++) {
            const patientList = this.state.patientList;
            if (patientList[i].checked) {
                const result = await func(patientList[i].id, ...args);
                patientList[i].status = result;
                this.setState({ patientList });
                if (i !== numberOfPatients - 1) await Utils.delay(delay);
            }
        }
        swal(success_text, "", "success");

        this.setState({
            isRunning: false,
        });
    }

    async handleFilter() {
        this.getFilterData([]);
    }

    async handleAdd() {
        this.getFilterData(this.state.patientList);
    }

    async removeCheckupReport() {
        swal({
            title: "Bạn chắc chứ?",
            text: "Khi bạn xóa, hệ thống sẽ xóa tất cả các bệnh nhân trong danh sách!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (willRemove) => {
                if (willRemove) {
                    await this.actions("Đã xóa xong!", this.state.configs.delay, Core.remove, "2");
                }
            });
    }

    async handleRun() {
        swal({
            title: "Bạn chắc chứ?",
            text: "Khi bạn chạy, hệ thống sẽ tự động khai báo cho tất cả các bệnh nhân trong danh sách!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (willRun) => {
                if (willRun) {
                    const runMode = this.state.configs.runMode;
                    localStorage.setItem('run-mode', runMode);
                    await this.actions("Đã chạy xong!", this.state.configs.delayPost, Core.run, runMode);
                }
            });
    }

    async handleCheck() {
        await this.actions("Đã kiểm tra xong", this.state.configs.delay, Core.check);
    }

    handleCheckAll() {
        const isCheckedAll = !this.state.isCheckedAll;
        const patientList = this.state.patientList;
        for (let i = 0; i < patientList.length; i++) {
            patientList[i].checked = isCheckedAll;
        }
        this.setState({
            isCheckedAll,
            patientList,
            lastCheckedItemIndex: 0
        });
    }

    handleCheckItem(index) {
        const patientList = this.state.patientList;
        if (this.state.isShiftPressing) {
            const start = Math.min(this.state.lastCheckedItemIndex, index);
            const end = Math.max(this.state.lastCheckedItemIndex, index);
            const state = !patientList[index].checked;
            for (let i = start; i <= end; i++) {
                patientList[i].checked = state;
            }
        } else {
            patientList[index].checked = !patientList[index].checked;
        }
        this.setState({
            patientList,
            isCheckedAll: false,
            lastCheckedItemIndex: index
        });
    }

    refineData() {
        const data = this.state.patientList;
        const refinedData = data
            .filter(item =>
                (item.status.type === "error" || item.status.type === "unchecked"))
            .map((item, _index) => {
                return { ...item, index: _index + 1 };
            });

        this.setState({
            patientList: refinedData
        });
        return refinedData;
    }

    removeSelected() {
        const data = this.state.patientList;
        const refinedData = data
            .filter(item => !item.checked)
            .map((item, _index) => {
                return { ...item, index: _index + 1 }
            });
        this.setState({
            patientList: refinedData
        });
        return refinedData;
    }

    removeUnselected() {
        const data = this.state.patientList;
        const refinedData = data
            .filter(item => item.checked)
            .map((item, _index) => {
                return { ...item, index: _index + 1 }
            });
        this.setState({
            patientList: refinedData
        });
        return refinedData;
    }

    clearData() {
        this.setState({
            patientList: []
        });
    }

    handleChange(field, subField, e) {
        if (subField) {
            let fields = this.state[field];
            fields[subField] = (e.target.type === "checkbox")
                ? e.target.checked
                : e.target.value || "";
            this.setState({ [field]: fields });
        } else {
            this.setState({ [field]: e.target.value });
        }

    }

    render() {
        return (
            <div className="af-configs-page af-full-page" >
                <div className="page-name">
                    <h1>Trang chủ</h1>
                    <p>
                        Ở trang này được sử dụng để chạy các hành động
                    </p>
                </div>

                <div className="page">
                    <div className="row section">
                        <div className="row col-12 col-lg-6">
                            <div className="col-8">
                                <div className="form-group">
                                    <label htmlFor="filter-name" className="d-block text-truncate">Họ tên</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="filter-name"
                                        value={this.state.filter.name}
                                        onChange={this.handleChange.bind(this, "filter", "name")}
                                        disabled={this.state.isRunning}
                                    />
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group">
                                    <label htmlFor="filter-phone" className="d-block text-truncate">Số điện thoại</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="filter-phone"
                                        value={this.state.filter.phone}
                                        onChange={this.handleChange.bind(this, "filter", "phone")}
                                        disabled={this.state.isRunning}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row col-12 col-lg-6">
                            <div className="col-4">
                                <div className="form-group">
                                    <label htmlFor="filter-treatment-day" className="d-block text-truncate">Ngày điều trị</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="filter-treatment-day"
                                        value={this.state.filter.treatment_day}
                                        onChange={this.handleChange.bind(this, "filter", "treatment_day")}
                                        disabled={this.state.isRunning || this.state.filter.from.trim() !== "" || this.state.filter.to.trim() !== ""}
                                    />
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group">
                                    <label htmlFor="filter-from" className="d-block text-truncate">Ngày bắt đầu</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="filter-from"
                                        value={this.state.filter.from}
                                        onChange={this.handleChange.bind(this, "filter", "from")}
                                        disabled={this.state.isRunning || this.state.filter.treatment_day.trim() !== ""}
                                    />
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group">
                                    <label htmlFor="filter-to" className="d-block text-truncate">Ngày kết thúc</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="filter-to"
                                        value={this.state.filter.to}
                                        onChange={this.handleChange.bind(this, "filter", "to")}
                                        disabled={this.state.isRunning || this.state.filter.treatment_day.trim() !== ""}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row section">
                        <div className="col-12">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={this.state.filter.is_12}
                                    onChange={this.handleChange.bind(this, "filter", "is_12")}
                                    disabled={this.state.isRunning} />
                                <label htmlFor="checkbox-1" className="form-check-label d-block text-truncate">
                                    Chỉ "Điều trị tại nhà" và "Điều trị tại cơ sở ý tế"
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex mt-4 flex-column flex-xl-row align-items-end justify-content-end">
                        <div className="form-group d-flex">
                            <select
                                className="custom-select form-control m-1"
                                value={this.state.configs.runMode}
                                onChange={this.handleChange.bind(this, "configs", "runMode")}
                                disabled={this.state.isRunning}>
                                <option value="1">Chỉ khai báo</option>
                                <option value="2">Chỉ khám</option>
                                <option value="3">Cả khai báo và khám</option>
                            </select>
                            <button
                                className="btn btn-success m-1"
                                onClick={this.handleRun.bind(this)}
                                disabled={this.state.isRunning}>
                                {this.state.isRunning
                                    ? (
                                        <div>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span className="m-1">Đang chạy...</span>
                                        </div>
                                    ) : "Chạy"}
                            </button>
                        </div>
                        <div className="d-flex justify-content-end flex-wrap">
                            <button
                                className="btn btn-danger m-1"
                                onClick={this.removeCheckupReport.bind(this)}
                                disabled={this.state.isRunning}>
                                Xóa phiếu khám gần nhất
                            </button>
                            <button
                                className="btn btn-danger m-1"
                                onClick={this.clearData.bind(this)}
                                disabled={this.state.isRunning}>
                                Xóa danh sách
                            </button>
                            <button
                                className="btn btn-info m-1 text-white"
                                onClick={this.refineData.bind(this)}
                                disabled={this.state.isRunning}>
                                Lọc dữ liệu lỗi
                            </button>
                            <button
                                className="btn btn-warning text-white m-1"
                                onClick={this.handleCheck.bind(this)}
                                disabled={this.state.isRunning} >
                                {this.state.isRunning
                                    ? (
                                        <div>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span className="m-1">Kiểm tra...</span>
                                        </div>
                                    ) : "Kiểm tra"}
                            </button>
                            <button
                                className="btn btn-primary m-1"
                                onClick={this.handleFilter.bind(this)}
                                disabled={this.state.isRunning}>
                                {this.state.isRunning
                                    ? (
                                        <div>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span className="m-1">Tìm kiếm...</span>
                                        </div>
                                    ) : "Tìm kiếm"}
                            </button>
                            <button
                                className="btn btn-dark m-1"
                                onClick={this.handleAdd.bind(this)}
                                disabled={this.state.isRunning}>
                                {this.state.isSending
                                    ? (
                                        <div>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span className="m-1">Đang thêm...</span>
                                        </div>
                                    ) : "Thêm"}
                            </button>
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <button
                                    className="btn btn-sm btn-outline-primary m-1"
                                    onClick={this.removeSelected.bind(this)}>
                                    Xóa mục có dấu sao
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-warning m-1"
                                    onClick={this.removeUnselected.bind(this)}>
                                    Xóa mục không có dấu sao
                                </button>
                            </div>
                            <div className="d-flex flex-wrap justify-content-end align-items-start">
                                <span className="badge bg-info m-1">
                                    Tổng: {this.state.patientList.length}
                                </span>
                                <span className="badge bg-primary m-1">
                                    Đang điều trị: {this.state.patientList.filter(item => (item.treatment_type <= 2)).length}
                                </span>
                                <span className="badge bg-success m-1">
                                    Hoàn thành điều trị: {this.state.patientList.filter(item => (item.treatment_type === 4)).length}
                                </span>
                                <span className="badge bg-secondary m-1">
                                    Đang chọn: {this.state.patientList.filter(item => (item.checked)).length}
                                </span>
                                <span className="badge bg-danger m-1">
                                    Lỗi: {this.state.patientList.filter(item => (item.status.type === "error")).length}
                                </span>
                            </div>
                        </div>
                        <table className="table table-hover mt-3 ms-2">
                            <thead className="table-light">
                                <tr className="row">
                                    <th scope="col" className="col-2 col-lg-1 d-flex">
                                        <input
                                            type="checkbox"
                                            checked={this.state.isCheckedAll}
                                            className="form-check-input"
                                            onChange={this.handleCheckAll.bind(this)}
                                            disabled={this.state.isRunning} />
                                        <p className="m-0 ms-3 p-0">#</p>
                                    </th>
                                    <th scope="col" className="col-4 text-truncate">Tên</th>
                                    <th scope="col" className="col-2 text-truncate">Số điện thoại</th>
                                    <th scope="col" className="col-4 col-lg-5 text-truncate">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.patientList.map((item, index) => (
                                    <tr key={index} className="row">
                                        <td className="col-2 col-lg-1 d-flex">
                                            <input
                                                type="checkbox"
                                                checked={item.checked}
                                                className="form-check-input"
                                                onChange={this.handleCheckItem.bind(this, index)}
                                                disabled={this.state.isRunning} />
                                            <p className="ms-3">{item.index}</p>
                                        </td>
                                        <td className="col-4">{item.name}</td>
                                        <td className="col-2">{item.phone}</td>
                                        <td className="col-4 col-lg-5">
                                            {
                                                (this.state.patientList[index].status.type !== "unchecked")
                                                    ? (this.state.patientList[index].status.type === "error")
                                                        ? this.state.patientList[index].status.value.map(
                                                            (_item, _index) => (<span key={Utils.genKey()} className={`badge bg-danger m-1`}>{_item}</span>))
                                                        : (this.state.patientList[index].status.type === "done")
                                                            ? (<span className={`badge bg-warning m-1`}>Xong</span>)
                                                            : (this.state.patientList[index].status.type === "deleted")
                                                                ? (<span className={`badge bg-danger m-1`}>Đã xóa</span>)
                                                                : (<span className={`badge bg-success m-1`}>Đúng</span>)
                                                    : <span className={`badge bg-info m-1`}>Chưa kiểm tra</span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}