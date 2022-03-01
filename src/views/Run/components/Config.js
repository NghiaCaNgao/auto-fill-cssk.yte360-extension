import Checkbox from "../../../components/FormGroup/Checkbox"
import InputText from "../../../components/FormGroup/InputText"
import Select from "../../../components/FormGroup/Select"

export default function render() {
    return (
        <div className="row section pt-2">
            <div className="col-4">
                <Checkbox
                    id="is_12"
                    name='Chỉ "Điều trị tại nhà" và "Điều trị tại cơ sở ý tế"'
                    checked={this.state.filter.is_12}
                    onChange={this.handleChange.bind(this, "config", "is_12")}
                    disabled={this.state.isRunning}
                />
            </div>

            <div className="col-4 col-xl-3 row">
                <Checkbox
                    id="is_current_day"
                    name="Cấu hình cho ngày hiện tại"
                    checked={this.state.filter.is_current_day}
                    onChange={this.handleChange.bind(this, "config", "is_current_day")}
                    disabled={this.state.isRunning}
                />

                <InputText
                    id="action-date"
                    type="date"
                    name="Ngày cố định"
                    value={this.state.filter.action_date}
                    onChange={this.handleChange.bind(this, "config", "action_date")}
                    disabled={this.state.isRunning}
                />
            </div>

            <div className="col-4 col-xl-3">
                < Select
                    id="action"
                    name="Hành động"
                    value={this.state.configs.runMode}
                    onChange={this.handleChange.bind(this, "configs", "runMode")}
                    options={["Chỉ khai báo", "Chỉ khám", "Cả khai báo và khám", "Cập nhật tự động", "Xóa phiếu khám gần nhất", "Tạo phiếu kết thúc điều trị"]}
                    disabled={this.state.isRunning}
                />
            </div>

            <div className="col-0 col-xl-2">
            </div>
        </div>
    )
}