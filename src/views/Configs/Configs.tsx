import react from "react";
import swal from 'sweetalert';
import InputText from "../../components/FormGroup/InputText";
import CustomSelect from "../../components/FormGroup/Select"
import Checkbox from "../../components/FormGroup/Checkbox";
import Config, { ConfigObject } from "../../utils/config";
import { TreatmentSet, HealthStatusSet, DiagnosisSet } from "../../utils/definitions";
import "./Configs.scss";

type State = {
    configs: ConfigObject
}

export default class Check extends react.Component<{}, State>{
    handleChange(field: string, e: React.ChangeEvent<HTMLInputElement>) {
        let fields = this.state.configs;

        (e.target.type === "checkbox")
            ? fields[field] = e.target.checked
            : fields[field] = e.target.value || "";

        this.setState({ configs: fields });
    }

    async componentDidMount() {
        const config = await Config.load();
        const configData = config.getConfigs();

        this.setState({
            configs: configData
        });
    }

    async saveData() {
        const config = await Config.load();
        config.setConfigs(this.state.configs);
        await config.save();

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
                    <div className="row" >
                        <div className="col-md-4 p-5 section">
                            <InputText
                                id="advice"
                                name="Lời khuyên"
                                value={this.state.configs.advice}
                                placeholder="Lời khuyên"
                                onChange={this.handleChange.bind(this, "advice")}
                            />

                            <CustomSelect
                                id="treatment-type"
                                name="Loại điều trị"
                                value={this.state.configs.treatment_type}
                                placeholder="Loại điều trị"
                                onChange={this.handleChange.bind(this, "treatment_type")}
                                dataset={[
                                    { value: TreatmentSet.ADVISORY, label: "Tư vấn" },
                                    { value: TreatmentSet.HOME_CHECKUP, label: "Khám tại nhà" },
                                    { value: TreatmentSet.STATION_CHECKUP, label: "Khám tại y tế" },
                                    { value: TreatmentSet.EMERGENCY, label: "Cấp cứu" }]}
                            />

                            <CustomSelect
                                id="health-status"
                                name="Tình trạng sức khỏe"
                                value={this.state.configs.health_status}
                                placeholder="Tình trạng sức khỏe"
                                onChange={this.handleChange.bind(this, "health_status")}
                                dataset={[
                                    { value: HealthStatusSet.UNSTABLE, label: "Không ổn định" },
                                    { value: HealthStatusSet.STABLE, label: "Ổn định" },
                                    { value: HealthStatusSet.OTHERS, label: "Khác" },
                                    { value: HealthStatusSet.DEAD, label: "Tử vong" }
                                ]}
                            />

                            <CustomSelect
                                id="diagnosis"
                                name="Chẩn đoán"
                                value={this.state.configs.diagnosis}
                                placeholder="Chẩn đoán"
                                onChange={this.handleChange.bind(this, "diagnosis")}
                                dataset={[
                                    { value: DiagnosisSet.NO_SYMPTOMS, label: "Không triệu chứng" },
                                    { value: DiagnosisSet.MILD_SYMPTOMS, label: "Triệu chứng nhẹ" },
                                    { value: DiagnosisSet.MODERATE_SYMPTOMS, label: "Triệu chứng trung bình" },
                                    { value: DiagnosisSet.SEVERE_SYMPTOMS, label: "Triệu chứng nghiêm trọng" },
                                    { value: DiagnosisSet.CRITICAL_SYMPTOMS, label: "Nguy kịch" },
                                    { value: DiagnosisSet.DEAD, label: "Tử vong" }
                                ]}
                            />
                        </div>

                        <div className="col-md-4 p-5 section">
                            <Checkbox
                                id="use-today"
                                name="Sử dụng ngày hôm nay làm ngày khai báo"
                                checked={this.state.configs.use_current_date}
                                onChange={this.handleChange.bind(this, "use_current_date")}
                            />

                            <InputText
                                id="action-date"
                                name="Ngày xử lý"
                                type="date"
                                value={(new Date(this.state.configs.action_date)).getTime()}
                                placeholder="Ngày xử lý"
                                onChange={this.handleChange.bind(this, "action_date")}
                                disabled={!this.state.configs.use_current_date}
                            />
                        </div>
                        <div className="col-md-4 p-5 section">
                            <InputText
                                id="delay-request"
                                name="Thời gian chờ yêu cầu"
                                type="number"
                                value={this.state.configs.delay_per_request}
                                onChange={this.handleChange.bind(this, "delay_per_request")}
                            />

                            <InputText
                                id="delay-post"
                                name="Thời gian chờ gửi yêu cầu"
                                type="number"
                                value={this.state.configs.delay_per_post}
                                onChange={this.handleChange.bind(this, "delay_per_post")}
                            />
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