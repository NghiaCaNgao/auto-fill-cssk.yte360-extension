import Storage from './storage';
import {
    TreatmentSet, HealthStatusSet, DiagnosisSet,
    TestTypeSet, TestResultSet, RunModeSet
} from './definitions';

interface ConfigObject {
    treatment_type?: TreatmentSet,
    health_status?: HealthStatusSet,
    diagnosis?: DiagnosisSet,
    test_type?: TestTypeSet,
    test_result?: TestResultSet,
    advice?: string,

    run_mode?: RunModeSet,
    action_date?: Date,
    use_current_date?: boolean,
    is_12?: boolean,
    delay_per_request?: number,
    delay_per_post?: number,
}

interface AccountObject {
    name?: string,
    token?: string,
    medical_station: {
        name?: string,
        address?: string,
        wards_id?: string,
        medical_station_id?: string,
    },
}

const DefaultConfigObject: ConfigObject = {
    treatment_type: TreatmentSet.HOME_CHECKUP,
    health_status: HealthStatusSet.STABLE,
    diagnosis: DiagnosisSet.NO_SYMPTOMS,
    test_type: TestTypeSet.RAPID_ANTIGEN,
    test_result: TestResultSet.POSITIVE,
    advice: "Đảm bảo dinh dưỡng đầy đủ, tăng cường vitamin, quả tươi, luyện tập thể dục phù hợp với thể trạng",

    run_mode: RunModeSet.AUTO,
    is_12: false,
    action_date: new Date(),
    use_current_date: true,
    delay_per_request: 300,
    delay_per_post: 10000,
};

const DefaultAccountObject: AccountObject = {
    name: "",
    token: "",
    medical_station: {
        name: "",
        address: "",
        wards_id: "",
        medical_station_id: "",
    },
};

class Config {
    private configs: ConfigObject;
    private account: AccountObject;

    constructor(configs?: ConfigObject, account?: AccountObject) {
        this.configs = { ...DefaultConfigObject, ...configs };
        this.account = { ...DefaultAccountObject, ...account };
    }

    static async load(): Promise<Config> {
        const config = new Config();
        config.setConfigs(await Config.getSavedConfigs());
        config.setAccount(await Config.getSavedAccount());
        return config;
    }

    static async getSavedConfigs(): Promise<ConfigObject> {
        const config = (await Storage.get("config"))["config"] || {};
        return { ...DefaultConfigObject, ...config };
    }

    static async getSavedAccount(): Promise<AccountObject> {
        let responseData = await Storage.get(["token", "user", "medical_station"]);
        const account = {
            token: responseData["token"],
            name: responseData["user"]["name"],
            medical_station: responseData["medical_station"],
        };
        return { ...DefaultAccountObject, ...account };
    }

    static async clear() {
        await Storage.clear();
        const config = new Config();
        await config.save();
    }

    getAllConfig(): { configs: ConfigObject, account: AccountObject } {
        return {
            configs: this.configs,
            account: this.account,
        }
    }

    setConfigs(configs: ConfigObject) {
        this.configs = { ...this.configs, ...configs };
    }

    setAccount(account: AccountObject) {
        this.account = { ...this.account, ...account };
    }

    setAccountByRawData(data: any) {
        const { fullname, token, donvi, donvi_id } = data;
        const { ten, xaphuong_id, diachi } = donvi;
        const account: AccountObject = {
            token: token,
            name: fullname,
            medical_station: {
                name: ten,
                address: diachi,
                wards_id: xaphuong_id,
                medical_station_id: donvi_id,
            },
        };
        this.setAccount(account);
    }

    getConfigs(): ConfigObject {
        return this.configs;
    }

    getAccount(): AccountObject {
        return this.account;
    }

    async save() {
        await Storage.set({
            config: this.configs,
            token: this.account.token,
            user: { name: this.account.name },
            medical_station: this.account.medical_station,
        });
    }
}

export default Config;
export { ConfigObject, AccountObject, DefaultAccountObject, DefaultConfigObject };