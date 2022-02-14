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

const Utils = {
    checkMatch,
    checkDate,
    genKey,
    removeAccents,
    delay,
    genDateString
}

export default Utils;