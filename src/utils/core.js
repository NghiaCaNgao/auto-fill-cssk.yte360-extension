import axios from 'axios';
import Storage from "./storage";
import Utils from './utils';

import CHECKUP_TEMPLATE from '../data/check_up.json';
import DECLARE_TEMPLATE from '../data/declare.json';

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

const ORDER_BY = Object.freeze({
    LAST_CHECKUP: "thoigian_khaibao_gannhat",
    DECLARE: "thoigian_khaibao",
    CHECKUP: "ngay_kham",
});

const DIRECTION = Object.freeze({
    ASC: "asc",
    DESC: "desc"
});

/* Create query object from filter object
* @param {object} filter
* @return {Query Object}
*/

function createQuery(filter, order_by, direction) {
    const filterRequest = [];
    const alias = {
        phone: "so_dien_thoai",
        name: "tenkhongdau",
        treatment_day: "ngay_benh_thu",
        medical_station: "donvi_id",
        ward_id: "xaphuong_id",
        was_deleted: "deleted",
        patient_id: "nguoidan_id",
        deleted: "deleted",
    }

    if (filter && typeof (filter) === 'object') {
        for (let key in filter) {
            if (alias[key]) {
                if (typeof (filter[key]) === 'string' && filter[key].trim() !== "") {
                    let obj = {};
                    obj[alias[key]] = {
                        "$eq": Utils.removeAccents(filter[key]).trim()
                    };
                    filterRequest.push(obj);
                }
                else if (typeof (filter[key]) !== 'string') {
                    let obj = {};
                    obj[alias[key]] = {
                        "$eq": filter[key]
                    };
                    filterRequest.push(obj);
                }

            }
        }
    }
    return {
        "filters": {
            "$and": filterRequest
        },
        "order_by": [
            {
                "field": order_by,
                "direction": direction
            }
        ]
    }
}

/* Switch case for creating query object
* @param {string} type
* @param {object} data
* @return {Query Object}
*/

async function switchQuery(type, data) {
    var query = {};
    switch (type) {
        case "declare":
            query = createQuery(data, ORDER_BY.DECLARE, DIRECTION.DESC);
            break;
        case "checkup":
            query = createQuery(data, ORDER_BY.CHECKUP, DIRECTION.DESC);
            break;
        case "current_user":
            query = {};
            break;
        case "filter":
            query = createQuery(data, ORDER_BY.LAST_CHECKUP, DIRECTION.DESC);
            break;
        default:
            query = {}
            break;
    }
    return query;
}

/* Fetches data from server
* @param {string} endpoint
* @param {string} type
* @param {object} data
* @param {object} params
* @return {Promise} data from server
*/

async function fetchData(endpoint, data, type, params) {
    try {
        const query = await switchQuery(type, data);
        const user_token = await Storage.getToken() || Utils.DEFAULT.token;

        const response = await axios.get(endpoint, {
            params: {
                ...params,
                q: query
            },
            headers: {
                'X-USER-TOKEN': user_token
            }
        });

        return {
            ok: true,
            data: response.data
        }
    } catch (error) {
        return {
            ok: false,
            error_message: error.message || error.response.data.error_message
        }
    }
}

/* Post data to server
* @param {string} endpoint
* @param {object} data
* @return {Promise} data from server
*/

async function postData(endpoint, data, isLogin) {
    const user_token = (!isLogin)
        ? await Storage.getToken() || Utils.DEFAULT.token
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
            data: response.data
        }
    } catch (error) {
        return {
            ok: false,
            error_message: error.message || error.response.data.error_message
        }
    }
}

/* Check last declare report
* @param {string} patientID
* @return {array} error 
*/

async function checkDeclare(patientID) {
    const response =
        await fetchData(
            END_POINT.GET_DECLARE,
            { patient_id: patientID, deleted: false },
            "declare",
            { results_per_page: 1 });

    if (response.ok) {
        if (response.data.objects.length > 0) {
            const { created_at } = response.data.objects[0];
            return Utils.checkDate(created_at) ? [] : ["Sai ngày khai báo"];
        } else {
            return ["Chưa khai báo lần nào"];
        }
    }
    else {
        return [response.error_message];
    }
}

/* Check last checkup report
* @param {string} patientID
* @return {array} error
*/

async function checkUpReport(patientID) {
    const response =
        await fetchData(
            END_POINT.GET_CHECKUP,
            { patient_id: patientID, deleted: false },
            "checkup",
            { results_per_page: 1 });

    if (response.ok) {
        if (response.data.objects.length > 0) {
            const { ngay_kham, loidan_bacsi, loai_xu_ly, tinh_trang, chan_doan } = response.data.objects[0];
            let errors = [];
            if (!Utils.checkDate(ngay_kham)) errors.push("Sai ngày khám");
            if (!Utils.checkMatch(loidan_bacsi, "advice")) errors.push("Sai lời khuyên");
            if (!Utils.checkMatch(chan_doan, "diagnosis")) errors.push("Sai chẩn đoán");
            if (!Utils.checkMatch(loai_xu_ly, "treatment-type")) errors.push("Sai loại xử lý");
            if (!Utils.checkMatch(tinh_trang, "health-status")) errors.push("Sai tình trạng");

            return errors;
        }
        else {
            return ["Chưa khám lần nào"];
        }
    } else {
        return [response.error_message];
    }
}

/* Post declare report
* @param {string} patientID
* @return {array} error
*/

async function postDeclare(patientID) {
    const declareReport = DECLARE_TEMPLATE;
    declareReport.nguoidan_id = patientID;

    const response = await postData(
        END_POINT.POST_DECLARE,
        declareReport
    );

    if (response.ok) {
        return [];
    } else {
        return [response.error_message];
    }
}

/* Post checkup report
* @param {string} patientID
* @return {array} error
*/

async function postCheckUp(patientID, checkupDate) {
    const checkUpReport = CHECKUP_TEMPLATE;
    const { treatment_type, health_status, diagnosis, advice } =
        await Storage.getPostConfig();

    checkUpReport.nguoidan_id = patientID;
    checkUpReport.loai_xu_ly = treatment_type;
    checkUpReport.tinh_trang = health_status;
    checkUpReport.chan_doan = diagnosis;
    checkUpReport.loidan_bacsi = advice;
    checkUpReport.ngay_kham = Utils.genDateString(checkupDate);

    const response = await postData(
        END_POINT.POST_CHECKUP,
        checkUpReport
    );

    if (response.ok) {
        return [];
    } else {
        return [response.error_message];
    }
}

// Unknown
async function removeDeclare(patientID) {
    return [];
}

/* Remove last checkup report
* @param {string} patientID
* @return {array} error
*/

async function removeCheckUp(patientID) {
    const lastCheckupReport =
        await fetchData(
            END_POINT.GET_CHECKUP,
            { patientID },
            "checkup",
            { results_per_page: 1 });

    if (lastCheckupReport.ok) {
        const CheckupID = await lastCheckupReport.data.objects[0].id;
        const responseDelete = await postData(
            END_POINT.DELETE_CHECKUP,
            { id: CheckupID },
        );

        if (responseDelete.ok) {
            return [];
        } else {
            return [responseDelete.error_message];
        }
    }
    else {
        return [lastCheckupReport.error_message];
    }
}

/* Login account
* @param {string} username
* @param {string} password
* @return {object} data
*/

async function login(username, password) {
    const data = {
        data: username,
        password: password
    }

    const responseData = await Storage.handleAccountInfo({ ...response.data, username: username });
    const response = await postData(END_POINT.POST_LOGIN, data, true);
    if (response.ok) {
        return {
            ok: true,
            data: responseData
        }
    }
    else {
        return {
            ok: false,
            error_message: response.error_message
        }
    }
}

/* Login account
* @return {object} data
*/

async function currentUser() {
    const response =
        await fetchData(END_POINT.GET_CURRENT_USER, {}, "current_user");
    const responseData = await Storage.handleAccountInfo({ ...response.data });
    if (response.ok) {
        return {
            ok: true,
            data: responseData
        }
    }
    else {
        return {
            ok: false,
            error_message: response.error_message
        }
    }
}

/* get patient by filter
* @param {object} filterObject
* @return {array} data
*/
async function filter(filterObject) {
    const { from, to, ...restFilter } = filterObject;
    let result = [];

    if (from || to) {
        if (from.trim() !== "" || to.trim() !== "") {
            if (
                Number.isInteger(Number(from)) &&
                Number.isInteger(Number(to))) {

                const start = Number(from);
                const end = Number(to);
                for (let i = start; i <= end; i++) {
                    restFilter.treatment_day = i.toString();
                    result.push(...await filter(restFilter));
                }
            }
        }
    }
    else {
        const response = await fetchData(END_POINT.GET_FILTER, filterObject, "filter");
        if (response.ok) {
            const data = [...response.data.objects];
            for (let i = 1; i < response.data.total_pages; i++) {
                const response = await fetchData(END_POINT.GET_FILTER, filterObject, "filter", { page: i + 1 });
                if (response.ok) {
                    data.push(...response.data.objects);
                }
            }
            result = data.map(item => {
                return {
                    id: item.id,
                    name: item.ho_ten,
                    phone: item.so_dien_thoai,
                    treatment_type: item.trang_thai,
                    checked: true,
                    status: {
                        type: "unchecked",
                        value: []
                    },
                }
            });
        }
    }

    return (filterObject.is_12)
        ? result.filter(item => item.treatment_type <= 2)
        : result;
}

/* Checkup patient report
* @param {string} patientID
* @return {array} error
*/

async function check(patientID) {
    const configs = await Storage.getPostConfig();
    localStorage.setItem("advice", configs.advice);
    localStorage.setItem("diagnosis", configs.diagnosis);
    localStorage.setItem("treatment-type", configs.treatment_type);
    localStorage.setItem("health-status", configs.health_status);

    const result = [
        ...await checkDeclare(patientID),
        ...await checkUpReport(patientID)
    ];
    return (result.length === 0)
        ? { type: "success", value: [] }
        : { type: "error", value: result };
}

/* Post patient report to server
* @param {string} patientID
* @param {string} mode
* @return {array} error
*/

async function run(patientID, mode) {
    let result = [];
    switch (mode) {
        case "1":
            {
                result = [...await postDeclare(patientID)];
                break;
            }
        case "2":
            {
                const postConfig = await Storage.getPostConfig();
                const checkupDate =
                    (postConfig.use_current_date)
                        ? undefined
                        : postConfig.action_date
                result = [...await postCheckUp(patientID, checkupDate)];
                break;
            }
        case "3":
            {
                const postConfig = await Storage.getPostConfig();
                const checkupDate =
                    (postConfig.use_current_date)
                        ? undefined
                        : postConfig.action_date

                result = [
                    ...await postDeclare(patientID),
                    ...await postCheckUp(patientID, checkupDate)
                ];
                break;
            }

        default:
            result = [];
            break;
    }

    return (result.length === 0)
        ? { type: "done", value: [] }
        : { type: "error", value: result };
}

/* Remove patient report from server
* @param {string} patientID
* @param {string} mode
* @return {array} error
*/

async function remove(patientID, mode) {
    let result = [];
    switch (mode) {
        case "1":
            result = [...await removeDeclare(patientID)];
            break;
        case "2":
            result = [...await removeCheckUp(patientID)];
            break;
        case "3":
            result = [
                ...await removeDeclare(patientID),
                ...await removeCheckUp(patientID)
            ];
            break;
        default:
            result = [];
            break;
    }

    return (result.length === 0)
        ? { type: "deleted", value: [] }
        : { type: "error", value: result };
}

const Core = {
    check,
    filter,
    remove,
    run,
    login,
    currentUser
}

export default Core;