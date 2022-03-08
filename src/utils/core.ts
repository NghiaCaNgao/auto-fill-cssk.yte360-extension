import axios from 'axios';
import Storage from "./storage";
import Utils from './utils';
import { ActionSet, ActionStatus, StatusCheckSet, TreatmentSet, RunModeSet } from './definitions';
import Filter, { ORDER_BY, DIRECTION, FilterObject } from "./filter";

import Config from './config';
import Patient from './patient';
import Run from './run';

const HOST = "https://chamsocsuckhoe.yte360.com/api/v1";

const END_POINT = Object.freeze({
    GET_FILTER: HOST + "/theodoi_tainha_search",
    GET_CURRENT_USER: HOST + "/current_user",
    GET_DECLARE: HOST + "/khaibao_theodoi",
    GET_CHECKUP: HOST + "/thongtin_khambenh",

    POST_LOGIN: HOST + "/login",
    POST_DECLARE: HOST + "/khaibao_theodoi/khaiho",
    POST_CHECKUP: HOST + "/khamchuabenh/create",

    DELETE_CHECK_UP: HOST + "/khamchuabenh/delete",
});

interface ResponseObject {
    ok: boolean,
    data?: any,
    message: string
}

async function switchQuery(type: ActionSet, data: FilterObject) {
    const filter = new Filter(data);
    let query: object;

    switch (type) {
        case ActionSet.DECLARE:
            query = filter.createQueryString(ORDER_BY.DECLARE, DIRECTION.DESC);
            break;
        case ActionSet.CHECKUP:
            query = filter.createQueryString(ORDER_BY.CHECKUP, DIRECTION.DESC);
            break;
        case ActionSet.FILTER:
            query = filter.createQueryString(ORDER_BY.LAST_CHECKUP, DIRECTION.DESC);
            break;
        case ActionSet.CURRENT_USER:
            query = {};
            break;
        default:
            query = {}
            break;
    }
    return query;
}

async function fetchData(endpoint: string, data: FilterObject, type: ActionSet, params?: object): Promise<ResponseObject> {
    try {
        const query = await switchQuery(type, data);
        const user_token = (await Config.load()).getAccount().token;

        const response = await axios.get(endpoint, {
            params: {
                ...params,
                q: query
            },
            headers: { 'X-USER-TOKEN': user_token }
        });

        return {
            ok: true,
            data: response.data,
            message: "success"
        }
    } catch (error) {
        return {
            ok: false,
            message: error.message || error.response.data.error_message,
            data: {}
        }
    }
}

async function postData(endpoint: string, data: any, isLogin: boolean = false): Promise<ResponseObject> {
    const user_token = (!isLogin)
        ? (await Config.load()).getAccount().token
        : ''

    try {
        const response = await axios.post(endpoint, JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-USER-TOKEN': user_token
            }
        });

        return {
            ok: true,
            data: response.data,
            message: "success"
        }
    } catch (error) {
        return {
            ok: false,
            message: error.message || error.response.data.error_message,
            data: {}
        }
    }
}

async function setCurrentUser(): Promise<ResponseObject> {
    const response =
        await fetchData(END_POINT.GET_CURRENT_USER, {}, ActionSet.CURRENT_USER, {});
    const config = await Config.load();
    config.setAccountByRawData(response.data);
    await config.save();

    if (response.ok)
        return {
            ok: true,
            message: "success"
        }
    else
        return {
            ok: false,
            message: response.message
        }
}

async function filterByDay(filter: FilterObject): Promise<Patient[]> {
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

async function filter(filter: FilterObject): Promise<Patient[]> {
    let result = [];
    for (let day = filter.from; day <= filter.to; day++) {
        filter.treatment_day = day;
        result.push(...await filterByDay(filter));
    }
    return result;
}


async function check(patientID: string): Promise<ActionStatus> {
    const run = await Run.load();
    const errors = [
        ...await run.checkCheckupReport(patientID),
        ...await run.checkCheckupReport(patientID)
    ];

    return (errors.length === 0)
        ? { status: StatusCheckSet.PASSED, value: [] }
        : { status: StatusCheckSet.ERROR, value: errors };
}

async function run(patientID: string, mode: RunModeSet): Promise<ActionStatus> {
    let errors: string[] = [];
    const run = await Run.load();

    switch (mode) {
        case RunModeSet.ONLY_DECLARE:
            errors = [...await run.postDeclare(patientID)];
            break;
        case RunModeSet.ONLY_CHECKUP:
            errors = [...await run.postCheckUp(patientID)];
            break;
        case RunModeSet.CHECKUP_DECLARE:
            errors = [
                ...await run.postCheckUp(patientID),
                ...await run.postDeclare(patientID)
            ];
            break;
        default:
            errors = [];
            break;
    }

    return (errors.length === 0)
        ? { status: StatusCheckSet.DONE, value: [] }
        : { status: StatusCheckSet.ERROR, value: errors };
}

async function remove(patientID, mode) {
    let errors: string[] = [];
    const run = await Run.load();

    switch (mode) {
        case RunModeSet.REMOVE_LAST_DECLARE:
            errors = [...await run.removeDeclareReport(patientID)];
            break;
        case "2":
            errors = [...await run.removeCheckUpReport(patientID)];
            break;
        case "3":
            errors = [
                ...await run.removeDeclareReport(patientID),
                ...await run.removeCheckUpReport(patientID)
            ];
            break;
        default:
            errors = [];
            break;
    }

    return (errors.length === 0)
        ? { status: StatusCheckSet.DELETED, value: [] }
        : { status: StatusCheckSet.ERROR, value: errors };
}

const Core = {
    check,
    filter,
    remove,
    run,
    setCurrentUser
}

export default Core;
export { END_POINT, postData, fetchData, ResponseObject };