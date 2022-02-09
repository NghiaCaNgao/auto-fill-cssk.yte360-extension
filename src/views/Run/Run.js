import React from "react";
import swal from "sweetalert";
import Core from "../../core"

const DELAY = 500;

export default class Run extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSending: false,
            isChecking: false,
            isRunning: false,
            isCheckedAll: true,
            delay: DELAY,
            runMode: "1",
            filter: {
                phone: "",
                name: "",
                treatment_day: "",
                from: "",
                to: "",
                is_12: false,
            },
            patientList: [],
        };
    }

    async componentDidMount() {
        let filter = localStorage.getItem('filter') || '{}';
        filter = JSON.parse(filter);
        this.setState({
            filter: {
                phone: filter.phone || "",
                name: filter.name || "",
                treatment_day: filter.treatment_day || "",
                from: filter.from || "",
                to: filter.to || "",
                is_12: filter.is_12 || false,
            },
            delay: Number(localStorage.getItem('delay')) || 500,
            runMode: localStorage.getItem('run-mode') || "1",
        });
    }

    async handleFilter() {
        this.setState({
            isSending: true
        });
        const filter = this.state.filter;
        const data = await Core.getFilter(
            {
                ...filter,
                medical_station: localStorage.getItem('station-id') || "",
                ward_id: localStorage.getItem('ward-id') || ''
            });

        this.setState({
            patientList: data.map((item, _index) => {
                return {
                    ...item,
                    index: _index + 1,
                }
            }),
            isSending: false
        });
        localStorage.setItem('filter', JSON.stringify(filter));
    }

    async handleAdd() {
        this.setState({
            isSending: true
        });
        const filter = this.state.filter;
        const prevPatientList = this.state.patientList;
        const prevPatientListLength = prevPatientList.length;
        let data = await Core.getFilter(
            {
                ...filter,
                medical_station: localStorage.getItem('station-id') || "",
                ward_id: localStorage.getItem('ward-id') || ''
            });

        data = data.map((item, _index) => {
            return { ...item, index: _index + prevPatientListLength + 1 };
        })

        this.setState({
            patientList: [...prevPatientList, ...data],
            isSending: false
        });
        localStorage.setItem('filter', JSON.stringify(filter));
    }

    async handleCheck() {
        this.setState({
            isChecking: true
        });

        for (let i = 0; i < this.state.patientList.length; i++) {
            if (this.state.patientList[i].checked) {
                const field = this.state;
                const result = await Core.checkPatient(field.patientList[i].id)
                field.patientList[i].status = result;
                this.setState(field);
                await Core.delay(DELAY);
            }
        }
        
        this.setState({
            isChecking: false
        });
        swal("Checked!", "", "success");
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
                    this.setState({
                        isRunning: true
                    });
                    for (let i = 0; i < this.state.patientList.length; i++) {
                        const field = this.state;
                        if (field.patientList[i].checked) {
                            const result = await Core.run(
                                field.patientList[i].id,
                                field.runMode
                            );
                            field.patientList[i].status = result;
                            this.setState(field);
                            await Core.delay(DELAY);
                        }
                    }
                    this.setState({
                        isRunning: false
                    });
                    swal("Checked!", "", "success");
                }
            });
    }

    handleCheckAll() {
        const isCheckedAll = !this.state.isCheckedAll;
        const patientList = this.state.patientList;
        for (let i = 0; i < patientList.length; i++) {
            patientList[i].checked = isCheckedAll;
        }
        this.setState({
            isCheckedAll,
            patientList
        });
    }

    handleCheckItem(index) {
        const patientList = this.state.patientList;
        patientList[index].checked = !patientList[index].checked;
        this.setState({
            patientList,
            isCheckedAll: false
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

    handleChange(field, isField, e) {
        if (isField) {
            let filter = this.state.filter;
            filter[field] = (e.target.type === "checkbox")
                ? e.target.checked
                : e.target.value || "";
            this.setState({ filter });
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
                        <div className="col-4">
                            <div className="form-group">
                                <label htmlFor="filter-name">Họ tên</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="filter-name"
                                    value={this.state.filter.name}
                                    onChange={this.handleChange.bind(this, "name", true)}
                                    disabled={this.state.isSending}
                                />
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="form-group">
                                <label htmlFor="filter-phone">Số điện thoại</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="filter-phone"
                                    value={this.state.filter.phone}
                                    onChange={this.handleChange.bind(this, "phone", true)}
                                    disabled={this.state.isSending}
                                />
                            </div>
                        </div>

                        <div className="col-2">
                            <div className="form-group">
                                <label htmlFor="filter-treatment-day">Ngày điều trị</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="filter-treatment-day"
                                    value={this.state.filter.treatment_day}
                                    onChange={this.handleChange.bind(this, "treatment_day", true)}
                                    disabled={this.state.isSending || this.state.filter.from.trim() !== "" || this.state.filter.to.trim() !== ""}
                                />
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="form-group">
                                <label htmlFor="filter-from">Ngày bắt đầu</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="filter-from"
                                    value={this.state.filter.from}
                                    onChange={this.handleChange.bind(this, "from", true)}
                                    disabled={this.state.isSending || this.state.filter.treatment_day.trim() !== ""}
                                />
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="form-group">
                                <label htmlFor="filter-to">Ngày kết thúc</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="filter-to"
                                    value={this.state.filter.to}
                                    onChange={this.handleChange.bind(this, "to", true)}
                                    disabled={this.state.isSending || this.state.filter.treatment_day.trim() !== ""}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row section">
                        <div className="col-5">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={this.state.filter.is_12}
                                    onChange={this.handleChange.bind(this, "is_12", true)}
                                    disabled={this.state.isSending} />
                                <label className="form-check-label" htmlFor="checkbox-1">
                                    Chỉ "Điều trị tại nhà" và "Điều trị tại cơ sở ý tế"
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex mt-4 justify-content-end">
                        <div className="form-group d-flex">
                            <select
                                className="custom-select form-control"
                                value={this.state.runMode}
                                onChange={this.handleChange.bind(this, "runMode", false)}
                                disabled={this.state.isRunning}>
                                <option value="1">Chỉ khai báo</option>
                                <option value="2">Chỉ khám</option>
                                <option value="3">Cả khai báo và khám</option>
                            </select>
                            <button
                                className="btn btn-success ms-2"
                                onClick={this.handleRun.bind(this)}
                                disabled={this.state.isChecking || this.state.isSending || this.setState.isRunning}>
                                {this.state.isRunning
                                    ? (
                                        <div>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span className="ms-2">Đang chạy...</span>
                                        </div>
                                    ) : "Chạy"}
                            </button>
                        </div>
                        <div>
                            <button
                                className="btn btn-danger ms-2"
                                onClick={this.clearData.bind(this)}
                                disabled={this.state.isChecking || this.state.isSending || this.setState.isRunning}>
                                Xóa
                            </button>
                            <button
                                className="btn btn-info ms-2 text-white"
                                onClick={this.refineData.bind(this)}
                                disabled={this.state.isChecking || this.state.isSending || this.setState.isRunning}>
                                Lọc dữ liệu lỗi
                            </button>
                            <button
                                className="btn btn-warning text-white ms-2"
                                onClick={this.handleCheck.bind(this)}
                                disabled={this.state.isChecking || this.state.isSending || this.setState.isRunning} >
                                {this.state.isChecking
                                    ? (
                                        <div>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span className="ms-2">Kiểm tra...</span>
                                        </div>
                                    ) : "Kiểm tra"}
                            </button>
                            <button
                                className="btn btn-primary ms-2"
                                onClick={this.handleFilter.bind(this)}
                                disabled={this.state.isChecking || this.state.isSending || this.setState.isRunning}>
                                {this.state.isSending
                                    ? (
                                        <div>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span className="ms-2">Tìm kiếm...</span>
                                        </div>
                                    ) : "Tìm kiếm"}
                            </button>
                            <button
                                className="btn btn-dark ms-2"
                                onClick={this.handleAdd.bind(this)}
                                disabled={this.state.isChecking || this.state.isSending || this.setState.isRunning}>
                                {this.state.isSending
                                    ? (
                                        <div>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span className="ms-2">Đang thêm...</span>
                                        </div>
                                    ) : "Thêm"}
                            </button>
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="d-flex justify-content-between">
                            <div>
                                <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={this.removeSelected.bind(this)}>
                                    Xóa mục có dấu sao
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-warning me-2"
                                    onClick={this.removeUnselected.bind(this)}>
                                    Xóa mục không có dấu sao
                                </button>
                            </div>
                            <div>
                                <span className="badge bg-info me-2">
                                    Tổng: {this.state.patientList.length}
                                </span>
                                <span className="badge bg-primary me-2">
                                    Đang điều trị: {this.state.patientList.filter(item => (item.treatment_type <= 2)).length}
                                </span>
                                <span className="badge bg-success me-2">
                                    Hoàn thành điều trị: {this.state.patientList.filter(item => (item.treatment_type === 4)).length}
                                </span>
                                <span className="badge bg-secondary me-2">
                                    Đang chọn: {this.state.patientList.filter(item => (item.checked)).length}
                                </span>
                                <span className="badge bg-danger">
                                    Lỗi: {this.state.patientList.filter(item => (item.status.type === "error")).length}
                                </span>
                            </div>
                        </div>
                        <table className="table table-hover mt-3 ms-2">
                            <thead className="table-light">
                                <tr className="row">
                                    <th scope="col" className="col-1 d-flex">
                                        <input
                                            type="checkbox"
                                            checked={this.state.isCheckedAll}
                                            className="form-check-input"
                                            onChange={this.handleCheckAll.bind(this)}
                                            disabled={this.state.isChecking || this.state.isSending || this.setState.isRunning} />
                                        <p className="m-0 ms-3 p-0">#</p>
                                    </th>
                                    <th scope="col" className="col-4">Tên</th>
                                    <th scope="col" className="col-2">Số điện thoại</th>
                                    <th scope="col" className="col-5">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.patientList.map((item, index) => (
                                    <tr key={index} className="row">
                                        <td className="col-1 d-flex">
                                            <input
                                                type="checkbox"
                                                checked={item.checked}
                                                className="form-check-input"
                                                onChange={this.handleCheckItem.bind(this, index)}
                                                disabled={this.state.isChecking || this.state.isSending || this.setState.isRunning} />
                                            <p className="ms-3">{item.index}</p>
                                        </td>
                                        <td className="col-4">{item.name}</td>
                                        <td className="col-2">{item.phone}</td>
                                        <td className="col-5">
                                            {
                                                (this.state.patientList[index].status.type !== "unchecked")
                                                    ? (this.state.patientList[index].status.type === "error")
                                                        ? this.state.patientList[index].status.value.map(
                                                            (_item, _index) => (<span key={Core.genKey()} className={`badge bg-danger m-1`}>{_item}</span>))
                                                        : (this.state.patientList[index].status.type === "done")
                                                            ? (<span className={`badge bg-warning m-1`}>Xong</span>)
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
            </div >
        );
    }
}