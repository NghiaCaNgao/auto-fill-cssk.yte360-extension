import React from "react";
import swal from "sweetalert";
import Utils from "../../utils/utils";
import Patient from "../../utils/patient";
import Filter, { FilterObject } from "../../utils/filter";
import Config, { AccountObject, ConfigObject } from "../../utils/config";

import Layout from "./Layout"
import "./Run.scss";
import { StatusCheckSet } from "../../utils/definitions";

enum ToggleButtonSet {
    MoreAction = "context_menu_more_action_show",
}


type State = {
    isRunning: boolean,
    isShiftPressing: boolean,
    isCheckedAll: boolean,
    context_menu_more_action_show: boolean,
    lastCheckedItemIndex: number,

    patientList: Patient[],
    filter: FilterObject,
    config: ConfigObject,
    account: AccountObject
}

export default class Run extends React.Component<{}, State> {
    async componentDidMount() {
        const filter = Filter.load();
        const config = await Config.load();
        const filterData = filter.get();
        const configData = config.getConfigs();
        const account = config.getAccount();

        this.setState({
            isRunning: false,
            context_menu_more_action_show: false,
            isShiftPressing: false,
            lastCheckedItemIndex: 0,
            isCheckedAll: true,

            filter: filterData,
            config: configData,
        });

        // Event on press shift key
        window.addEventListener('keydown', this.handleShiftKey.bind(this));
        window.addEventListener('keyup', this.handleShiftKey.bind(this));
    }

    handleShiftKey(event: React.KeyboardEvent<HTMLDivElement>) {
        if (event.shiftKey) {
            this.setState({
                isShiftPressing: (event.type === 'keydown') ? true : false
            });
        }
    }

    getLastCheckedItem(): number {
        return this.state.patientList.reduce((prev, currPatient, index) => (currPatient.check) ? index : prev, 0);
    }

    async getFilterData(prev: Patient[]) {
        this.setState({ isRunning: true });
        const filter = this.state.filter;
        let data = await Patient.filter(
            {
                ...filter,
                medical_station_id: this.state.account.medical_station.medical_station_id,
                wards_id: this.state.account.medical_station.wards_id,
                token: this.state.account.token
            });
        this.setState({
            patientList: [...prev, ...data],
            isRunning: false,
            isCheckedAll: true,
        });
        localStorage.setItem('filter', JSON.stringify(filter));
    }

    async handleFilter() {
        this.getFilterData([]);
    }

    async handleAdd() {
        this.getFilterData(this.state.patientList);
    }

    async handleRun() {
        const actionDate = (this.state.config.use_current_date)
            ? new Date()
            : new Date(this.state.config.action_date);

        const willRun = await swal({
            title: "Bạn chắc chứ?",
            text: `Dữ liệu được chạy cho ngày: ${actionDate.toLocaleDateString("vi")}`,
            icon: "warning",
            buttons: [true],
            dangerMode: true,
        });

        if (willRun) {
            this.setState({ isRunning: true });
            const patientLength = this.state.patientList.length;
            const lastCheckedItem = this.getLastCheckedItem();

            for (let i = 0; i < patientLength; i++) {
                if (this.state.patientList[i].check) {
                    this.state.patientList[i].run(this.state.config.run_mode);
                    if (i !== lastCheckedItem)
                        await Utils.delay(this.state.config.delay_per_post);
                }
            }
            swal("Đã chạy xong", "", "success");
            this.setState({ isRunning: false });
        }
    }

    async handleCheck() {
        this.setState({ isRunning: true });
        const patientLength = this.state.patientList.length;
        const lastCheckedItem = this.getLastCheckedItem();

        for (let i = 0; i < patientLength; i++) {
            if (this.state.patientList[i].check) {
                this.state.patientList[i].check();
                if (i !== lastCheckedItem)
                    await Utils.delay(this.state.config.delay_per_request);
            }
        }
        swal("Đã kiểm tra xong", "", "success");
        this.setState({ isRunning: false });
    }

    handleCheckAll() {
        const isCheckedAll = !this.state.isCheckedAll;
        const patientList = this.state.patientList;
        for (let i = 0; i < patientList.length; i++)
            patientList[i].patient.checked = isCheckedAll;

        this.setState({
            isCheckedAll,
            patientList,
            lastCheckedItemIndex: 0
        });
    }

    handleCheckItem(index: number) {
        const patientList = this.state.patientList;
        if (this.state.isShiftPressing) {
            const start = Math.min(this.state.lastCheckedItemIndex, index);
            const end = Math.max(this.state.lastCheckedItemIndex, index);
            const state = !patientList[index].patient.checked;

            for (let i = start; i <= end; i++)
                patientList[i].patient.checked = state;
        } else
            patientList[index].patient.checked = !patientList[index].patient.checked;

        this.setState({
            patientList,
            isCheckedAll: patientList.every(item => item.patient.checked),
            lastCheckedItemIndex: index
        });
    }

    refineFailedData() {
        this.setState({
            patientList: this.state.patientList.filter(item => {
                const status = item.patient.status.status;
                return (status === StatusCheckSet.ERROR || status === StatusCheckSet.UNCHECKED);
            })
        });
    }

    removeSelectedData() {
        this.setState({
            patientList: this.state.patientList.filter(item => !item.patient.checked)
        });
    }

    clearData() {
        this.setState({
            patientList: []
        });
    }

    handleChange(field: string, subField: string, event: React.ChangeEvent<HTMLInputElement>) {
        let fields = this.state[field];
        fields[subField] = (event.target.type === "checkbox")
            ? event.target.checked
            : event.target.value || "";
        if (field === "configs") this.setState({ config: fields as ConfigObject });
        else if (field === "filter") this.setState({ filter: fields as FilterObject });
    }

    toggleButton(field: ToggleButtonSet) {
        this.setState({
            [field]: !this.state[field]
        });
    }

    render() {
        return Layout.call(this);
    }
}