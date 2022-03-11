import Utils from './utils';
import Config from './config';
import CHECKUP_TEMPLATE from '../data/check_up.json';
import DECLARE_TEMPLATE from '../data/declare.json';
import { fetchData, postData, END_POINT, ResponseObject } from "./core";
import { FilterObject } from './filter';
import {
    ActionStatus, TreatmentSet, StatusCheckSet,
    RunModeSet, CheckItemSet, ActionSet
} from "./definitions"
interface PatientObject {
    id?: string;
    name?: string;
    phone?: string;
    treatment_type?: TreatmentSet;
    status?: ActionStatus;
    checked?: boolean;
    tag?: string;
}

const DefaultPatientObject: PatientObject = {
    id: "",
    name: "",
    phone: "",
    treatment_type: TreatmentSet.HOME_CHECKUP,
    status: {
        status: StatusCheckSet.UNCHECKED,
        value: []
    },
    checked: true,
    tag: ""
}

class Patient extends Config {
    patient: PatientObject;

    private async getHeathDeclaration(patientID: string): Promise<ResponseObject> {
        // TODO: Get tat ca report cua patient
        return await fetchData(
            END_POINT.GET_DECLARE,
            { patient_id: patientID, was_deleted: false },
            ActionSet.DECLARE,
            { results_per_page: 1 });
    }

    private async getCheckupReport(patientID: string): Promise<ResponseObject> {
        // TODO: Get tat ca report cua patient
        return await fetchData(
            END_POINT.GET_CHECKUP,
            { patient_id: patientID, was_deleted: false },
            ActionSet.CHECKUP,
            { results_per_page: 1 });
    }

    private async checkHeathDeclaration(): Promise<string[]> {
        // TODO: Xu ly ngay ngat quang
        const response = await this.getHeathDeclaration(this.patient.id);
        if (response.ok) {
            if (response.data.length > 0) {
                const times = 1000;
                const { created_at } = response.data.objects[0];
                return Utils.checkDate(new Date(created_at * times))
                    ? []
                    : ["Sai ngày khai báo"];
            }
            else
                return ["Chưa khai báo lần nào"];
        } else return [response.message];
    }

    private async checkCheckupReport(): Promise<string[]> {
        // TODO: Xu ly ngay ngat quang
        const response = await this.getCheckupReport(this.patient.id);
        if (response.ok) {
            if (response.data.length > 0) {
                const { ngay_kham, loidan_bacsi, loai_xu_ly, tinh_trang, chan_doan } = response.data.objects[0];
                const configSetting = this.getConfigs();
                let errors = [];
                if (!Utils.checkDate(Utils.convertStringToDate(ngay_kham))) errors.push("Sai ngày khám");
                if (!Utils.checkMatchText(loidan_bacsi, CheckItemSet.ADVICE, configSetting)) errors.push("Sai lời khuyên");
                if (!Utils.checkMatchText(chan_doan, CheckItemSet.DIAGNOSIS, configSetting)) errors.push("Sai chẩn đoán");
                if (!Utils.checkMatchText(loai_xu_ly, CheckItemSet.TREATMENT_TYPE, configSetting)) errors.push("Sai loại xử lý");
                if (!Utils.checkMatchText(tinh_trang, CheckItemSet.HEALTH_STATUS, configSetting)) errors.push("Sai tình trạng");
            }
            else
                return ["Chưa khai báo lần nào"];
        } else return [response.message];
    }

    private async postDeclare() {
        const declareReport = DECLARE_TEMPLATE;
        declareReport.nguoidan_id = this.patient.id;

        const response = await postData(
            END_POINT.POST_DECLARE,
            declareReport
        );

        if (response.ok) return [];
        else return [response.message];
    }

    private async postCheckUp() {
        const checkUpReport = CHECKUP_TEMPLATE;
        const config = this.getConfigs();
        const postDate = (config.use_current_date) ? new Date() : config.action_date;

        checkUpReport.nguoidan_id = this.patient.id;
        checkUpReport.loai_xu_ly = config.treatment_type;
        checkUpReport.tinh_trang = config.health_status;
        checkUpReport.chan_doan = config.diagnosis;
        checkUpReport.loidan_bacsi = config.advice;
        checkUpReport.ngay_kham = Utils.generateDateString(postDate);

        const response = await postData(
            END_POINT.POST_CHECKUP,
            checkUpReport
        );

        if (response.ok) return [];
        else return [response.message];
    }

    private async removeCheckUpReport(): Promise<string[]> {
        const response = await this.getCheckupReport(this.patient.id);

        if (response.ok) {
            const CheckupID = response.data.objects[0].id;
            const responseDelete = await postData(
                END_POINT.DELETE_CHECK_UP,
                { id: CheckupID },
            );

            if (responseDelete.ok) return [];
            else return [responseDelete.message];
        }
        else return [response.message];
    }

    private async removeDeclareReport(): Promise<string[]> {
        // TODO: Xu ly xoa khai bao
        const response = await this.getHeathDeclaration(this.patient.id);
        if (response.ok) {
            return [];
        } else
            return [response.message];
    }

    private setStatus(status: ActionStatus) {
        this.patient.status = status;
    }

    constructor(patient: PatientObject) {
        super();
        this.patient = { ...DefaultPatientObject, ...patient };
    }

    getPatient() {
        return this.patient;
    }

    setPatient(patient: PatientObject) {
        this.patient = { ...this.patient, ...patient };
    }

    async updateConfig() {
        this.setConfigs(await Config.getSavedConfigs());
        this.setAccount(await Config.getSavedAccount());
    }

    async check() {
        const errors = [
            ...await this.checkCheckupReport(),
            ...await this.checkHeathDeclaration()
        ];

        if (errors.length > 0)
            this.setStatus({ status: StatusCheckSet.PASSED, value: [] });
        else
            this.setStatus({ status: StatusCheckSet.ERROR, value: errors });
    }

    async run(mode: RunModeSet) {
        let errors: string[] = [];

        switch (mode) {
            case RunModeSet.ONLY_DECLARE:
                errors = [...await this.postDeclare()];
                break;
            case RunModeSet.ONLY_CHECKUP:
                errors = [...await this.postCheckUp()];
                break;
            case RunModeSet.CHECKUP_DECLARE:
                errors = [
                    ...await this.postCheckUp(),
                    ...await this.postDeclare()
                ];
                break;
            default:
                errors = [];
                break;
        }

        if (errors.length === 0)
            this.setStatus({ status: StatusCheckSet.DONE, value: [] });
        else
            this.setStatus({ status: StatusCheckSet.ERROR, value: errors });
    }

    async remove(mode: RunModeSet) {
        let errors: string[] = [];

        switch (mode) {
            case RunModeSet.REMOVE_LAST_DECLARE:
                errors = [...await this.removeDeclareReport()];
                break;
            case RunModeSet.REMOVE_LAST_CHECKUP:
                errors = [...await this.removeCheckUpReport()];
                break;
            case RunModeSet.REMOVE_CHECKUP_DECLARE:
                errors = [
                    ...await this.removeDeclareReport(),
                    ...await this.removeCheckUpReport()
                ];
                break;
            default:
                errors = [];
                break;
        }

        if (errors.length === 0)
            this.setStatus({ status: StatusCheckSet.DELETED, value: [] })
        else
            this.setStatus({ status: StatusCheckSet.ERROR, value: errors });
    }

    static async filterByDay(filter: FilterObject): Promise<Patient[]> {
        let result: Patient[] = [];

        const response = await fetchData(END_POINT.GET_FILTER, filter, ActionSet.FILTER);
        if (response.ok) {
            const data = [...response.data.objects];
            for (let i = 1; i < response.data.total_pages; i++) {
                const response = await fetchData(END_POINT.GET_FILTER, filter, ActionSet.FILTER, { page: i + 1 });
                if (response.ok)
                    data.push(...response.data.objects);
            }

            result = data.map(item => {
                return new Patient({
                    id: item.id as string,
                    name: item.ho_ten as string,
                    phone: item.so_dien_thoai as string,
                    treatment_type: item.trang_thai as TreatmentSet
                });
            });
        }
        return result;
    }

    static async filter(filter: FilterObject): Promise<Patient[]> {
        let result = [];
        for (let day = filter.from; day <= filter.to; day++) {
            filter.treatment_day = day;
            result.push(...await Patient.filterByDay(filter));
        }
        return result;
    }
}

export default Patient;