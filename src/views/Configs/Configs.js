import react from "react";
import "./Configs.scss";
import swal from 'sweetalert';

export default class Check extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            advice: "",
            treatmentType: "1",
            healthStatus: "1",
            diagnosis: "1",
            delayRequest: "500",
            language: "en",
        }
    }

    handleChange(field, e) {
        let fields = this.state;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    componentDidMount() {
        this.setState({
            advice: localStorage.getItem("advice") || "",
            treatmentType: localStorage.getItem("treatment-type") || "1",
            healthStatus: localStorage.getItem("health-status") || "1",
            diagnosis: localStorage.getItem("diagnosis") || "1",
            delayRequest: localStorage.getItem("delay-request") || "500",
            language: localStorage.getItem("language") || "en",
        });
    }
    saveToLocal(data) {
        for (let key in data) {
            localStorage.setItem(key, data[key]);
        }
    }

    async saveData() {
        this.saveToLocal({
            "advice": this.state.advice,
            "treatment-type": this.state.treatmentType,
            "health-status": this.state.healthStatus,
            "diagnosis": this.state.diagnosis,
            "delay-request": this.state.delayRequest,
            "language": this.state.language,
        });
        swal("Success", "Save successfully!", "success");
    }

    render() {
        return (
            <div className="af-configs-page af-full-page" >
                <div className="page-name">
                    <h1>Cấu hình</h1>
                    <p>
                        Thiết lập các giá trị dùng để kiểm dữ liệu và tạo dữ liệu tự động
                    </p>
                </div>

                <div className="page">
                    <div
                        className="row"
                        name="config-form">
                        <div className="col-md-6 p-5 section">
                            <div className="form-group">
                                <label htmlFor="config-advice">Lời dặn</label>
                                <textarea
                                    rows={4}
                                    className="form-control"
                                    id="config-advice"
                                    placeholder="Advice"
                                    value={this.state.advice}
                                    onChange={this.handleChange.bind(this, "advice")} />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="config-treatment-type" className="col-6 col-form-label">Loại xử lý</label>
                                <div className="col-6">
                                    <select
                                        className="form-control"
                                        id="config-treatment-type"
                                        value={this.state.treatmentType}
                                        onChange={this.handleChange.bind(this, "treatmentType")}>
                                        <option value="1">Tư vấn</option>
                                        <option value="2">Khám tại nhà</option>
                                        <option value="3">Khám tại y tế</option>
                                        <option value="4">Cấp cứu</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="config-health-status" className="col-6 col-form-label">Tình trạng sức khỏe</label>
                                <div className="col-6">
                                    <select
                                        className="form-control"
                                        id="config-treatment-type"
                                        value={this.state.healthStatus}
                                        onChange={this.handleChange.bind(this, "healthStatus")}>
                                        <option value="1">Không ổn định</option>
                                        <option value="2">Ổn định</option>
                                        <option value="3">Khác</option>
                                        <option value="4">Tử vong</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="config-health-status" className="col-6 col-form-label">Chẩn đoán</label>
                                <div className="col-6">
                                    <select
                                        className="form-control"
                                        id="config-treatment-type"
                                        value={this.state.diagnosis}
                                        onChange={this.handleChange.bind(this, "diagnosis")}>
                                        <option value="1">Không triệu chứng</option>
                                        <option value="2">Mức độ nhẹ</option>
                                        <option value="3">Mức độ trung bình</option>
                                        <option value="4">Mức độ nặng</option>
                                        <option value="5">Mức độ nguy kịch</option>
                                        <option value="6">Tử vong</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 p-5 section">
                            <div className="form-group row">
                                <label htmlFor="config-delay-request" className="col-6 col-form-label">Độ trễ giữa các request</label>
                                <div className="col-6">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="config-delay-request"
                                        placeholder="Delay request"
                                        value={this.state.delayRequest}
                                        onChange={this.handleChange.bind(this, "delayRequest")} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end mt-5">
                        <button className="btn btn-primary" onClick={this.saveData.bind(this)}>Lưu</button>
                    </div>
                </div>
            </div>
        )
    }
}