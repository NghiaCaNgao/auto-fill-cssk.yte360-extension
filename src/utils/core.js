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
    }

    if (filter && typeof (filter) === 'object') {
        for (let key in filter) {
            if (alias[key] && filter[key].trim() !== "") {
                let obj = {};
                obj[alias[key]] = {
                    "$eq": Utils.removeAccents(filter[key]).trim()
                };
                filterRequest.push(obj);
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

/* Fetches data from server
* @param {string} endpoint
* @param {string} type
* @param {object} data
* @param {object} params
* @return {Promise} data from server
*/

async function fetchData(endpoint, data, type, params) {
    const query = (type)
        ? createQuery(
            { patient_id: data.patientID },
            (type === "declare") ? ORDER_BY.DECLARE :
                type === "checkup" && ORDER_BY.CHECKUP,
            DIRECTION.DESC)
        : createQuery(data, ORDER_BY.LAST_CHECKUP, DIRECTION.ASC);

    let user_token = await Storage.getToken() || '';

    try {
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
            error_message: error.response.data.error_message || error.message
        }
    }
}

/* Post data to server
* @param {string} endpoint
* @param {object} data
* @return {Promise} data from server
*/

async function postData(endpoint, data, isLogin) {
    let user_token = (isLogin)
        ? await Storage.getToken() || ''
        : '';

    try {
        const response = await axios.post(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-USER-TOKEN': user_token
            },
            data: JSON.stringify(data)
        });

        return {
            ok: true,
            data: response.data
        }
    } catch (error) {
        return {
            ok: false,
            error_message: error.response.data.error_message || error.message
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
            { patientID },
            "declare",
            { results_per_page: 1 });

    if (response.ok) {
        const { created_at } = response.data.objects[0];
        return Utils.checkDate(created_at) ? [] : ["Sai ngày khai báo"];
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
            END_POINT.GET_CHECK_UP,
            { patientID },
            "checkup",
            { results_per_page: 1 });

    if (response.ok) {
        const { created_at, loidan_bacsi, loai_xu_ly } = response.data.objects[0];
        let errors = [];
        if (!Utils.checkDate(created_at)) errors.push("Sai ngày khám");
        if (!Utils.checkMatch(loidan_bacsi, "advice")) errors.push("Sai lời khuyên");
        if (!Utils.checkMatch(loai_xu_ly, "treatment-type")) errors.push("Sai loại xử lý");
        return errors;
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

async function postCheckUp(patientID) {
    const checkUpReport = CHECKUP_TEMPLATE;
    const { treatment_type, health_status, diagnosis, advice } =
        await Storage.getConfig();

    checkUpReport.nguoidan_id = patientID;
    checkUpReport.loai_xu_ly = treatment_type;
    checkUpReport.tinh_trang = health_status;
    checkUpReport.chan_doan = diagnosis;
    checkUpReport.loidan_bacsi = advice;
    checkUpReport.ngay_kham = Utils.genDateString();

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

    const response = await postData(END_POINT.POST_LOGIN, data, true);
    if (response.ok) {
        const { fullname, token, donvi, donvi_id } = response.data;
        const { ten, xaphuong_id, diachi } = donvi;
        const user = {
            name: fullname,
            token: token,
        };
        const medical_station = {
            name: ten,
            address: diachi,
            wardsID: xaphuong_id,
            stationID: donvi_id
        }
        await Storage.setAccountInfo({ username, token, user, medical_station });
        return {
            ok: true,
            data: { username, token, user, medical_station }
        };
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
        const response = await fetchData(END_POINT.GET_FILTER, filterObject);
        if (response.ok) {
            const data = [...response.data.objects];
            for (let i = 1; i < response.data.total_pages; i++) {
                const response = await fetchData(END_POINT.GET_FILTER, filterObject, undefined, { page: i + 1 });
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

    return (filter.is_12)
        ? result.filter(item => item.treatment_type <= 2)
        : result;
}

/* Checkup patient report
* @param {string} patientID
* @return {array} error
*/

async function check(patientID) {
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
            result = [...await postDeclare(patientID)];
            break;
        case "2":
            result = [...await postCheckUp(patientID)];
            break;
        case "3":
            result = [
                ...await postDeclare(patientID),
                ...await postCheckUp(patientID)
            ];
            break;
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
    login,
    remove,
    run
}

export default Core;