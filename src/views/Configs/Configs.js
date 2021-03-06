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
                    <h1>C???u h??nh</h1>
                    <p>
                        Thi???t l???p c??c gi?? tr??? d??ng ????? ki???m d??? li???u v?? t???o d??? li???u t??? ?????ng
                    </p>
                </div>

                <div className="page">
                    <div
                        className="row"
                        name="config-form">
                        <div className="col-md-4 p-5 section">
                            <div className="form-group">
                                <label htmlFor="config-advice">L???i d???n</label>
                                <textarea
                                    rows={4}
                                    className="form-control"
                                    id="config-advice"
                                    placeholder="Advice"
                                    value={this.state.advice}
                                    onChange={this.handleChange.bind(this, "advice")} />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="config-treatment-type" className="col-6 col-form-label">Lo???i x??? l??</label>
                                <div className="col-6">
                                    <select
                                        className="form-control"
                                        id="config-treatment-type"
                                        value={this.state.treatmentType}
                                        onChange={this.handleChange.bind(this, "treatmentType")}>
                                        <option value="1">T?? v???n</option>
                                        <option value="2">Kh??m t???i nh??</option>
                                        <option value="3">Kh??m t???i y t???</option>
                                        <option value="4">C???p c???u</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="config-health-status" className="col-6 col-form-label">T??nh tr???ng s???c kh???e</label>
                                <div className="col-6">
                                    <select
                                        className="form-control"
                                        id="config-health-status"
                                        value={this.state.healthStatus}
                                        onChange={this.handleChange.bind(this, "healthStatus")}>
                                        <option value="1">Kh??ng ???n ?????nh</option>
                                        <option value="2">???n ?????nh</option>
                                        <option value="3">Kh??c</option>
                                        <option value="4">T??? vong</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="config-diagnosis" className="col-6 col-form-label">Ch???n ??o??n</label>
                                <div className="col-6">
                                    <select
                                        className="form-control"
                                        id="config-diagnosis"
                                        value={this.state.diagnosis}
                                        onChange={this.handleChange.bind(this, "diagnosis")}>
                                        <option value="1">Kh??ng tri???u ch???ng</option>
                                        <option value="2">M???c ????? nh???</option>
                                        <option value="3">M???c ????? trung b??nh</option>
                                        <option value="4">M???c ????? n???ng</option>
                                        <option value="5">M???c ????? nguy k???ch</option>
                                        <option value="6">T??? vong</option>
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
                                            S??? d???ng ng??y hi???n t???i l??m ng??y khai b??o
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="config-action-date" className="col-6 col-form-label">Ng??y x??? l??</label>
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
                                <label htmlFor="config-delay-request" className="col-6 col-form-label">????? tr??? gi???a c??c request</label>
                                <div className="col-6">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="config-delay-request"
                                        placeholder="????? tr???"
                                        value={this.state.delayRequest}
                                        onChange={this.handleChange.bind(this, "delayRequest")} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="config-delay-post" className="col-6 col-form-label">????? tr??? gi???a c??c l???n t???o</label>
                                <div className="col-6">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="config-delay-post"
                                        placeholder="????? tr???"
                                        value={this.state.delayPost}
                                        onChange={this.handleChange.bind(this, "delayPost")} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end mt-5">
                        <button className="btn btn-primary" onClick={this.saveData.bind(this)}>L??u</button>
                    </div>
                </div>
            </div>
        )
    }
}