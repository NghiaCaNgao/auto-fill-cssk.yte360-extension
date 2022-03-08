
import Utils from './utils';
import Config, { ConfigObject, AccountObject } from './config';
import { ActionSet, CheckItemSet } from "./definitions";
import { fetchData, postData, END_POINT, ResponseObject } from "./core";
import CHECKUP_TEMPLATE from '../data/check_up.json';
import DECLARE_TEMPLATE from '../data/declare.json';

class Run extends Config {
    constructor(configs?: ConfigObject, account?: AccountObject) {
        super(configs, account);
    }

    static async load(): Promise<Run> {
        const config = new Run();
        config.setConfigs(await Config.getSavedConfigs());
        config.setAccounts(await Config.getSavedAccount());
        return config;
    }

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

    async checkHeathDeclaration(patientID: string): Promise<string[]> {
        // TODO: Xu ly ngay ngat quang
        const response = await this.getHeathDeclaration(patientID);
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

    async checkCheckupReport(patientID: string): Promise<string[]> {
        // TODO: Xu ly ngay ngat quang
        const response = await this.getCheckupReport(patientID);
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

    async removeCheckUpReport(patientID: string): Promise<string[]> {
        const response = await this.getCheckupReport(patientID);

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

    async removeDeclareReport(patientID: string): Promise<string[]> {
        // TODO: Xu ly xoa khai bao
        const response = await this.getHeathDeclaration(patientID);
        if (response.ok) {
            return [];
        } else
            return [response.message];
    }

    async postDeclare(patientID: string) {
        const declareReport = DECLARE_TEMPLATE;
        declareReport.nguoidan_id = patientID;

        const response = await postData(
            END_POINT.POST_DECLARE,
            declareReport
        );

        if (response.ok) return [];
        else return [response.message];
    }

    async postCheckUp(patientID: string) {
        const checkUpReport = CHECKUP_TEMPLATE;
        const config = this.getConfigs();
        const postDate = (config.use_current_date) ? new Date() : config.action_date;

        checkUpReport.nguoidan_id = patientID;
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
}

export default Run;