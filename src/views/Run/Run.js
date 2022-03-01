import React from "react";
import swal from "sweetalert";
import Core from "../../utils/core";
import Storage from "../../utils/storage";
import Utils from "../../utils/utils";

import "./Run.scss";
import Layout from "./Layout"
export default class Run extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRunning: false,
            context_menu_more_action_show: false,
            isShiftPressing: false,
            lastCheckedItemIndex: 0,
            isCheckedAll: true,
            patientList: [],
            filter: {
                phone: Utils.DEFAULT.phone,
                name: Utils.DEFAULT.name_filter,
                treatment_day: Utils.DEFAULT.treatment_day,
                from: Utils.DEFAULT.from,
                to: Utils.DEFAULT.to,
                is_12: Utils.DEFAULT.is_12,
            },
            configs: {
                delay: Utils.DEFAULT.delay_request,
                delayPost: Utils.DEFAULT.delay_post,
                runMode: Utils.DEFAULT.run_mode,
            },
        };
    }

    async componentDidMount() {
        let filter = localStorage.getItem('filter') || '{}';
        const run_config = await Storage.getRunConfig();
        const account = await Storage.getAccountInfo();
        filter = JSON.parse(filter);

        this.setState({
            filter: {
                phone: filter.phone || Utils.DEFAULT.phone,
                name: filter.name || Utils.DEFAULT.name_filter,
                treatment_day: filter.treatment_day || Utils.DEFAULT.treatment_day,
                from: filter.from || Utils.DEFAULT.from,
                to: filter.to || Utils.DEFAULT.to,
                is_12: filter.is_12 || Utils.DEFAULT.is_12,
            },
            configs: {
                runMode: localStorage.getItem('run-mode') || Utils.DEFAULT.run_mode,
                delay: run_config.delay_request,
                delayPost: run_config.delay_post,
                medicalStationID: account.medical_station.stationID,
                wardID: account.medical_station.wardsID
            },
        });

        window.addEventListener('keydown', (e) => {
            if (e.keyCode === 16) {
                this.setState({
                    isShiftPressing: true
                });
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.keyCode === 16) {
                this.setState({
                    isShiftPressing: false
                });
            }
        });
    }

    async getFilterData(prev) {
        this.setState({
            isRunning: true
        });

        const filter = this.state.filter;
        const prevLength = prev.length;

        let data = await Core.filter(
            {
                ...filter,
                medical_station: this.state.configs.medicalStationID,
                ward_id: this.state.configs.wardID
            });

        data = data.map((item, _index) => {
            return { ...item, index: _index + prevLength + 1 };
        })

        this.setState({
            patientList: [...prev, ...data],
            isRunning: false,
            isCheckedAll: true,
        });

        localStorage.setItem('filter', JSON.stringify(filter));
    }

    async actions(success_text, delay, func, ...args) {
        this.setState({
            isRunning: true
        });

        const numberOfPatients = this.state.patientList.length;
        for (let i = 0; i < numberOfPatients; i++) {
            const patientList = this.state.patientList;
            if (patientList[i].checked) {
                const result = await func(patientList[i].id, ...args);
                patientList[i].status = result;
                this.setState({ patientList });
                if (i !== numberOfPatients - 1) await Utils.delay(delay);
            }
        }
        swal(success_text, "", "success");

        this.setState({
            isRunning: false,
        });
    }

    async handleFilter() {
        this.getFilterData([]);
    }

    async handleAdd() {
        this.getFilterData(this.state.patientList);
    }

    async removeCheckupReport() {
        swal({
            title: "Bạn chắc chứ?",
            text: "Khi bạn xóa, hệ thống sẽ xóa tất cả các bệnh nhân trong danh sách!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (willRemove) => {
                if (willRemove) {
                    await this.actions("Đã xóa xong!", this.state.configs.delay, Core.remove, "2");
                }
            });
    }

    async handleRun() {
        const postConfig = await Storage.getPostConfig();
        const actionDate = (postConfig.use_current_date) ? new Date() : new Date(postConfig.date);
        swal({
            title: "Bạn chắc chứ?",
            text: `Dữ liệu được chạy cho ngày: ${actionDate.toLocaleDateString("vi")}`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (willRun) => {
                if (willRun) {
                    const runMode = this.state.configs.runMode;
                    localStorage.setItem('run-mode', runMode);
                    await this.actions("Đã chạy xong!", this.state.configs.delayPost, Core.run, runMode);
                }
            });
    }

    async handleCheck() {
        await this.actions("Đã kiểm tra xong", this.state.configs.delay, Core.check);
    }

    handleCheckAll() {
        const isCheckedAll = !this.state.isCheckedAll;
        const patientList = this.state.patientList;
        for (let i = 0; i < patientList.length; i++) {
            patientList[i].checked = isCheckedAll;
        }
        this.setState({
            isCheckedAll,
            patientList,
            lastCheckedItemIndex: 0
        });
    }

    handleCheckItem(index) {
        const patientList = this.state.patientList;
        if (this.state.isShiftPressing) {
            const start = Math.min(this.state.lastCheckedItemIndex, index);
            const end = Math.max(this.state.lastCheckedItemIndex, index);
            const state = !patientList[index].checked;
            for (let i = start; i <= end; i++) {
                patientList[i].checked = state;
            }
        } else {
            patientList[index].checked = !patientList[index].checked;
        }
        this.setState({
            patientList,
            isCheckedAll: false,
            lastCheckedItemIndex: index
        });
    }

    refineData() {
        const data = this.state.patientList;
        const refinedData = data
            .filter(item =>
                (item.status.type === "error" || item.status.type === "unchecked"))
            .map((item, _index) => {
                return { ...item, index: _index + 1 };
            });

        this.setState({
            patientList: refinedData
        });
        return refinedData;
    }

    removeSelected() {
        const data = this.state.patientList;
        const refinedData = data
            .filter(item => !item.checked)
            .map((item, _index) => {
                return { ...item, index: _index + 1 }
            });
        this.setState({
            patientList: refinedData
        });
        return refinedData;
    }

    removeUnselected() {
        const data = this.state.patientList;
        const refinedData = data
            .filter(item => item.checked)
            .map((item, _index) => {
                return { ...item, index: _index + 1 }
            });
        this.setState({
            patientList: refinedData
        });
        return refinedData;
    }

    clearData() {
        this.setState({
            patientList: []
        });
    }

    handleChange(field, subField, e) {
        if (subField) {
            let fields = this.state[field];
            fields[subField] = (e.target.type === "checkbox")
                ? e.target.checked
                : e.target.value || "";
            this.setState({ [field]: fields });
        } else {
            this.setState({ [field]: e.target.value });
        }

    }

    toggleButton(field) {
        this.setState({
            [field]: !this.state[field]
        });
    }

    render() {
        return Layout.call(this);
    }
}