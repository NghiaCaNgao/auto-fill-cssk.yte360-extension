import InputText from "../../../components/FormGroup/InputText";

export default function render() {
    return (
        <div className="row section" >
            <div className="row col-12 col-lg-6">
                <div className="col-4">
                    <InputText
                        id="address"
                        name="Địa chỉ"
                        value={this.state.filter.address}
                        onChange={this.handleChange.bind(this, "filter", "address")}
                        disabled={this.state.isRunning}
                    />
                </div>

                <div className="col-4">
                    <InputText
                        id="name"
                        name="Tên"
                        value={this.state.filter.name}
                        onChange={this.handleChange.bind(this, "filter", "name")}
                        disabled={this.state.isRunning}
                    />
                </div>

                <div className="col-4">
                    <InputText
                        id="phone"
                        name="Số điện thoại"
                        value={this.state.filter.phone}
                        onChange={this.handleChange.bind(this, "filter", "phone")}
                        disabled={this.state.isRunning}
                    />
                </div>
            </div>

            <div className="row col-12 col-lg-6">
                <div className="col-4">
                    <InputText
                        id="treatment-day"
                        name="Ngày bệnh thứ"
                        value={this.state.filter.treatment_day}
                        onChange={this.handleChange.bind(this, "filter", "treatment_day")}
                        disabled={this.state.isRunning || this.state.filter.from.trim() !== "" || this.state.filter.to.trim() !== ""}
                    />
                </div>

                <div className="col-4">
                    <InputText
                        id="from"
                        name="Từ ngày"
                        value={this.state.filter.from}
                        onChange={this.handleChange.bind(this, "filter", "from")}
                        disabled={this.state.isRunning || this.state.filter.treatment_day.trim() !== ""}
                    />
                </div>

                <div className="col-4">
                    <InputText
                        id="to"
                        name="Đến ngày"
                        value={this.state.filter.to}
                        onChange={this.handleChange.bind(this, "filter", "to")}
                        disabled={this.state.isRunning || this.state.filter.treatment_day.trim() !== ""}
                    />
                </div>
            </div>
        </div>
    )
}