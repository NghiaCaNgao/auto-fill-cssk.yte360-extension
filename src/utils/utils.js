const DEFAULT = Object.freeze({
    token: "",
    name: "",
    address: "",
    wardsID: "",
    stationID: "",
    medical_station: "",

    treatment_type: "2",
    health_status: "2",
    diagnosis: "1",
    advice: "Đảm bảo dinh dưỡng đầy đủ, tăng cường vitamin, quả tươi, luyện tập thể dục phù hợp với thể trạng",
    use_current_date: true,
    delay_request: "300",
    delay_post: "10000",
    action_date: "",
    use_current_date: true,

    phone: "",
    name_filter: "",
    treatment_day: "",
    from: "",
    to: "",
    is_12: false,
    run_mode: "3",
})

function checkMatch(value, type) {
    if (type === "advice") {
        return value === (localStorage.getItem('advice') || DEFAULT.advice);
    }
    else if (type === "treatment-type") {
        return value === (Number(localStorage.getItem('treatment-type')) || Number(DEFAULT.treatment_type));
    }
    else if (type === "health-status") {
        return value === (Number(localStorage.getItem('health-status')) || Number(DEFAULT.health_status));
    }
    else if (type === "diagnosis") {
        return value === (Number(localStorage.getItem('diagnosis')) || Number(DEFAULT.diagnosis));
    } else return false;
}

function checkDate(time) {
    if (typeof (time) === "string") {
        if (Number.isInteger(Number(time))) {
            const now = new Date(Date.now());
            const test = convertDateString(time);
            return now.getDay() === test.getDay() && (now.getTime() - test.getTime()) <= 86400 * 1000;
        } else {
            return false;
        }
    } else {
        const now = new Date(Date.now());
        const test = new Date(time * 1000);
        return now.getDay() === test.getDay() && (now.getTime() - test.getTime()) <= 86400 * 1000;
    }
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

function genDateString(checkupDate) {
    const now = new Date();
    let year, month, day;

    if (checkupDate &&
        typeof (checkupDate) === "string" &&
        checkupDate.trim() !== "") {
        const optionsTime = new Date(checkupDate);
        year = optionsTime.getFullYear().addLeadingZeroes();
        month = (optionsTime.getMonth() + 1).addLeadingZeroes();
        day = optionsTime.getDate().addLeadingZeroes();
    }
    else {
        year = now.getFullYear().addLeadingZeroes();
        month = (now.getMonth() + 1).addLeadingZeroes();
        day = now.getDate().addLeadingZeroes();
    }

    const hour = now.getHours().addLeadingZeroes();
    const minute = now.getMinutes().addLeadingZeroes();
    return `${year}${month}${day}${hour}${minute}`;
}

function convertDateString(timeString) {
    if (typeof (timeString) === "string" && timeString.length === 12) {
        const year = Number(timeString.substring(0, 4));
        const month = Number(timeString.substring(4, 6));
        const day = Number(timeString.substring(6, 8));
        const hour = Number(timeString.substring(8, 10));
        const minute = Number(timeString.substring(10, 12));
        return new Date(year, month - 1, day, hour, minute);
    }
}

const Utils = {
    checkMatch,
    checkDate,
    genKey,
    removeAccents,
    delay,
    genDateString,
    DEFAULT,
}

export default Utils;