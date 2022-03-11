import axios from 'axios';
import { ActionSet } from './definitions';
import Filter, { ORDER_BY, DIRECTION, FilterObject } from "./filter";
import Config from './config';

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
        const user_token = data.token;

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

async function setCurrentUser(token: string): Promise<ResponseObject> {
    const response =
        await fetchData(END_POINT.GET_CURRENT_USER, { token }, ActionSet.CURRENT_USER, {});
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

export { setCurrentUser, END_POINT, postData, fetchData, ResponseObject };