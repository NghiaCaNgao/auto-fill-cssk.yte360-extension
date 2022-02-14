import axios from 'axios';
import check_up_template from '../data/check_up.json';
import declare_template from '../data/declare.json';

async function loginAction(username, password) {
    try {
        const response = await axios({
            method: 'post',
            url: "https://chamsocsuckhoe.yte360.com/api/v1/login",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            data: JSON.stringify({
                data: username,
                password: password
            })
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

function getQuery(filter) {
    const filterRequest = [];
    const mapKeys = {
        phone: "so_dien_thoai",
        name: "tenkhongdau",
        treatment_day: "ngay_benh_thu",
        medical_station: "donvi_id",
        ward_id: "xaphuong_id"
    }

    if (filter && typeof (filter) === 'object') {
        for (let key in filter) {
            if (mapKeys[key] && filter[key].trim() !== "") {
                let obj = {};
                obj[mapKeys[key]] = {
                    "$eq": removeAccents(filter[key]).trim()
                };
                filterRequest.push(obj);
            }
        }
    }

    return {
        "filters":
        {
            "$and": filterRequest
        },
        "order_by": [
            {
                "field": "thoigian_khaibao_gannhat",
                "direction": "asc"
            }]
    }
}

function getQueryForCheck(patientID, type) {
    const patientIDAsString = patientID ? patientID : "";
    return {
        "filters": {
            "$and": [
                {
                    "deleted": {
                        "$eq": false
                    }
                },
                {
                    "nguoidan_id": {
                        "$eq": patientIDAsString
                    }
                }
            ]
        },
        "order_by": [
            {
                "field": (type === "declare") ? "thoigian_khaibao" : "ngay_kham",
                "direction": "desc"
            }
        ]
    }
}

async function fetchData(path, type, filter, params) {
    const host = "https://chamsocsuckhoe.yte360.com/api/v1"
    const query = (type) ? getQueryForCheck(filter.patientID, type) : getQuery(filter);
    let headers = {
        'X-USER-TOKEN': localStorage.getItem('user-token') || ''
    }

    try {
        const response = await axios.get(host + path, {
            params: {
                ...params,
                q: query
            },
            headers: headers
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

async function postData(path, data, headers) {
    const host = "https://chamsocsuckhoe.yte360.com/api/v1"
    try {
        const response = await axios({
            method: 'post',
            url: host + path,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                ...headers
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

async function getFilter(filter) {
    const path = "/theodoi_tainha_search";
    const { from, to, ...restFilter } = filter;
    if (from || to) {
        if (from.trim() !== "" || to.trim() !== "") {
            if (
                Number.isInteger(Number(from)) &&
                Number.isInteger(Number(to))) {
                const result = [];
                const start = Number(from);
                const end = Number(to);
                for (let i = start; i <= end; i++) {
                    restFilter.treatment_day = i.toString();
                    result.push(...await this.getFilter(restFilter));
                }
                return result;
            }
            else return [];
        } else return [];

    }
    else {
        const response = await fetchData(path, undefined, filter);
        if (response.ok) {
            const data = [...response.data.objects];
            for (let i = 1; i < response.data.total_pages; i++) {
                const response = await fetchData(path, undefined, filter, { page: i + 1 });
                if (response.ok) {
                    data.push(...response.data.objects);
                }
            }
            const result = data.map(item => {
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
            })

            return (filter.is_12)
                ? result.filter(item => item.treatment_type <= 2)
                : result;
        }
        else {
            return [];
        }
    }
}

async function checkDeclare(patientID) {
    const path = "/khaibao_theodoi";
    const response = await fetchData(path, "declare", { patientID }, { results_per_page: 1 });
    if (response.ok) {
        const { created_at } = response.data.objects[0];
        return checkDate(created_at) ? [] : ["Sai ngày khai báo"];
    }
    else {
        return [response.error_message];
    }
}

async function checkUpReport(patientID) {
    const path = "/thongtin_khambenh";
    const response = await fetchData(path, "checkup", { patientID }, { results_per_page: 1 });
    if (response.ok) {
        const { created_at, loidan_bacsi, loai_xu_ly } = response.data.objects[0];
        let errors = [];
        if (!checkDate(created_at)) errors.push("Sai ngày khám");
        if (!checkMatch(loidan_bacsi, "advice")) errors.push("Sai lời khuyên");
        if (!checkMatch(loai_xu_ly, "treatment-type")) errors.push("Sai loại xử lý");
        return errors;
    } else {
        return [response.error_message];
    }
}

async function postDeclare(patientID, options) {
    const path = "/khaibao_theodoi/khaiho";
    const declareReport = declare_template;
    declareReport.nguoidan_id = patientID;

    const response = await postData(
        path,
        declareReport,
        { 'X-USER-TOKEN': localStorage.getItem('user-token') }
    );

    if (response.ok) {
        return [];
    } else {
        return [response.error_message];
    }
}

async function postCheckUp(patientID, option) {
    const path = "/khamchuabenh/create";
    const checkUpReport = check_up_template;
    checkUpReport.nguoidan_id = patientID;
    checkUpReport.loai_xu_ly = localStorage.getItem('treatment-type') || "";
    checkUpReport.tinh_trang = localStorage.getItem('health-status') || "";
    checkUpReport.chan_doan = localStorage.getItem('diagnosis') || "";
    checkUpReport.loidan_bacsi = localStorage.getItem('advice') || "";
    checkUpReport.ngay_kham = genDateString();

    const response = await postData(
        path,
        checkUpReport,
        { 'X-USER-TOKEN': localStorage.getItem('user-token') || '' }
    );
    if (response.ok) {
        return [];
    } else {
        return [response.error_message];
    }
}

async function removeDeclare(patientID) { }
async function removeCheckUp(patientID) {
    const GetCheckupPath = "/thongtin_khambenh";
    const DeleteCheckupPath = "/khamchuabenh/delete";
    const responseCheckUp = await fetchData(GetCheckupPath, "checkup", { patientID }, { results_per_page: 1 });
    if (responseCheckUp.ok) {
        const CheckupID = await responseCheckUp.data.objects[0].id;
        const responseDelete = await postData(
            DeleteCheckupPath,
            {
                id: CheckupID
            },
            { 'X-USER-TOKEN': localStorage.getItem('user-token') || '' }
        );

        if (responseDelete.ok) {
            return [];
        } else {
            return [responseDelete.error_message];
        }
    }
    else {
        return [responseCheckUp.error_message];
    }
}

async function checkPatient(patientID) {
    const result = [
        ...await checkDeclare(patientID),
        ...await checkUpReport(patientID)
    ];
    return (result.length === 0)
        ? { type: "success", value: [] }
        : { type: "error", value: result };
}

async function run(patientID, mode, time) {
    let result = [];
    switch (mode) {
        case "1":
            result = [...await postDeclare(patientID, { time: time })];
            break;
        case "2":
            result = [...await postCheckUp(patientID, { time: time })];
            break;
        case "3":
            result = [
                ...await postDeclare(patientID, { time: time }),
                ...await postCheckUp(patientID, { time: time })
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

function checkMatch(value, type) {
    if (type === "advice") {
        return value === (localStorage.getItem('advice') || "");
    }
    else if (type === "treatment-type") {
        return value === (Number(localStorage.getItem('treatment-type')) || 0);
    }
}


function checkDate(time) {
    const now = new Date(Date.now());
    const test = new Date(time * 1000);
    return now.getDay() === test.getDay() && (now.getTime() - test.getTime()) <= 86400 * 1000;
}

function genKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function removeAccents(str) {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .toLowerCase();
}

async function delay(millisecond) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, millisecond);
    });
}

/*eslint no-extend-native: ["error", { "exceptions": ["Number"] }]*/
Number.prototype.addLeadingZeroes = function () {
    const n = Math.abs(this);
    return n < 10 ? '0' + n : n.toString();
}

function genDateString() {
    const date = new Date();
    const year = date.getFullYear().addLeadingZeroes();
    const month = (date.getMonth() + 1).addLeadingZeroes();
    const day = date.getDate().addLeadingZeroes();
    const hour = date.getHours().addLeadingZeroes();
    const minute = date.getMinutes().addLeadingZeroes();
    return `${year}${month}${day}${hour}${minute}`;
}

const Core = {
    loginAction,
    getFilter,
    checkPatient,
    genKey,
    delay,
    remove,
    run
}

export default Core;