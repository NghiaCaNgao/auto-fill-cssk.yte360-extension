import react from "react"
import { ReactComponent as SettingIcon } from "../../../assets/icons/settings.svg"

export default function render() {
    return (
        <div className="d-flex justify-content-between align-items-start">
            <div>
                <button
                    className="btn btn-sm btn-outline-primary m-1 text-truncate"
                    onClick={this.removeSelected.bind(this)}>
                    Xóa mục có dấu sao
                </button>
                <button
                    className="btn btn-sm btn-outline-warning m-1 text-truncate"
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
                <a>
                    <SettingIcon />
                </a>
            </div>
        </div>
    )
}