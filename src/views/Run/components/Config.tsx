import React from "react"

import Checkbox from "@/components/FormGroup/Checkbox"
import InputText from "@/components/FormGroup/InputText"
import Select from "@/components/FormGroup/Select"

import { RunModeSet } from "@/utils/definitions"

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
                    dataset={[
                        { value: RunModeSet.ONLY_DECLARE, label: "Chỉ khai báo" },
                        { value: RunModeSet.ONLY_CHECKUP, label: "Chỉ khám" },
                        { value: RunModeSet.CHECKUP_DECLARE, label: "Cả khai báo và khám" },
                        { value: RunModeSet.AUTO, label: "Cập nhật tự động" },
                        { value: RunModeSet.REMOVE_LAST_CHECKUP, label: "Xóa phiếu khám gần nhất" },
                        { value: RunModeSet.FINISH_TREATMENT, label: "Tạo phiếu kết thúc điều trị" }
                    ]}
                    disabled={this.state.isRunning}
                />
            </div>

            <div className="col-0 col-xl-2">
            </div>
        </div>
    )
}