import react from "react";
import Storage from "../../utils/storage";
import swal from 'sweetalert';
import "./Configs.scss";
import Utils from "../../utils/utils";

export default class Check extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            advice: Utils.DEFAULT.advice,
            treatmentType: Utils.DEFAULT.treatment_type,
            healthStatus: Utils.DEFAULT.health_status,
            diagnosis: Utils.DEFAULT.diagnosis,
            delayRequest: Utils.DEFAULT.delay_request,
            delayPost: Utils.DEFAULT.delay_post,
            actionDate: Utils.DEFAULT.action_date,
            useCurrentDate: Utils.DEFAULT.use_current_date
        }
    }

    handleChange(field, e) {
        let fields = this.state;
        (e.target.type === "checkbox")
            ? fields[field] = e.target.checked
            : fields[field] = e.target.value || "";

        this.setState({ fields });
    }

    async componentDidMount() {
        const { post_config, run_config } = await Storage.getConfig();
        this.setState({
            advice: post_config.advice,
            treatmentType: post_config.treatment_type,
            healthStatus: post_config.health_status,
            diagnosis: post_config.diagnosis,
            actionDate: post_config.action_date,
            useCurrentDate: post_config.use_current_date,
            delayRequest: run_config.delay_request,
            delayPost: run_config.delay_post
        });
    }

    async saveData() {
        await Storage.setConfigInfo({
            post_config: {
                advice: this.state.advice,
                treatment_type: this.state.treatmentType,
                health_status: this.state.healthStatus,
                diagnosis: this.state.diagnosis,
                action_date: this.state.actionDate,
                use_current_date: this.state.useCurrentDate
            },
            run_config: {
                delay_request: this.state.delayRequest,
                delay_post: this.state.delayPost
            }
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
                        <div className="col-md-4 p-5 section">
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
                                        id="config-health-status"
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
                                <label htmlFor="config-diagnosis" className="col-6 col-form-label">Chẩn đoán</label>
                                <div className="col-6">
                                    <select
                                        className="form-control"
                                        id="config-diagnosis"
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
                        <div className="col-md-4 p-5 section">
                            <div className="form-group row">
                                <div className="col-12">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={this.state.useCurrentDate}
                                            onChange={this.handleChange.bind(this, "useCurrentDate")} />
                                        <label htmlFor="checkbox-1" className="form-check-label d-block text-truncate">
                                            Sử dụng ngày hiện tại làm ngày khai báo
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="config-action-date" className="col-6 col-form-label">Ngày xử lý</label>
                                <div className="col-6">
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="config-action-date"
                                        value={this.state.actionDate}
                                        onChange={this.handleChange.bind(this, "actionDate")}
                                        disabled={this.state.useCurrentDate}>
                                    </input>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 p-5 section">
                            <div className="form-group row">
                                <label htmlFor="config-delay-request" className="col-6 col-form-label">Độ trễ giữa các request</label>
                                <div className="col-6">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="config-delay-request"
                                        placeholder="Độ trễ"
                                        value={this.state.delayRequest}
                                        onChange={this.handleChange.bind(this, "delayRequest")} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="config-delay-post" className="col-6 col-form-label">Độ trễ giữa các lần tạo</label>
                                <div className="col-6">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="config-delay-post"
                                        placeholder="Độ trễ"
                                        value={this.state.delayPost}
                                        onChange={this.handleChange.bind(this, "delayPost")} />
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