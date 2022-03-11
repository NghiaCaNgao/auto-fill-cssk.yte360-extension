import React from 'react'
import Utils from "@/utils/utils";

export default function render() {
    return (
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
    )
}