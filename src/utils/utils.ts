import { ConfigObject } from "./config";
import { CheckItemSet } from "./definitions";

// Compare two the given value with corresponding key
function checkMatchText(value: string | number, type: CheckItemSet, config: ConfigObject): boolean {
    if (typeof (value) === "string") {
        value = removeAccents(value);
        if (Number(value)) value = Number(value);
    }

    return (config[type]) ? (value === config[type]) : false;
}

// Check given date is valid or not
function checkDate(date: Date): boolean {
    const now = new Date();
    return now.getDay() === date.getDay() && (now.getTime() - date.getTime()) <= 86400 * 1000;
}

//  Generate key for looping elements 
function genKey(): string {
    return Math.random().toString(36).substring(2, 15);
}

// remove accents from string: "Hôm nay" => "hom nay"
function removeAccents(str: string): string {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .toLowerCase();
}

//  Delay for a given time (in milliseconds)
async function delay(millisecond: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, millisecond);
    });
}

//  Add leading zeroes to fit date string format
function addLeadingZeroes(num: number): string {
    const n = Math.abs(num);
    return n < 10 ? '0' + n : n.toString();
};

// Convert Date object to date string ({yyyy}{mm}{dd}{hh}{mm})
function generateDateString(date?: Date): string {
    const target = date ? date : new Date();

    const year = addLeadingZeroes(target.getFullYear());
    const month = addLeadingZeroes(target.getMonth() + 1);
    const day = addLeadingZeroes(target.getDate());
    const hour = addLeadingZeroes(target.getHours());
    const minute = addLeadingZeroes(target.getMinutes());

    return `${year}${month}${day}${hour}${minute}`;
}

// Convert date string ({yyyy}{mm}{dd}{hh}{mm}) to Date object 
function convertStringToDate(timeString: string): Date | null {
    if (timeString.length === 12 && Number(timeString)) {
        const year = Number(timeString.substring(0, 4));
        const month = Number(timeString.substring(4, 6));
        const day = Number(timeString.substring(6, 8));
        const hour = Number(timeString.substring(8, 10));
        const minute = Number(timeString.substring(10, 12));
        return new Date(year, month - 1, day, hour, minute);
    }
    return null;
}

export default {
    checkMatchText,
    checkDate,
    genKey,
    removeAccents,
    delay,
    generateDateString,
    convertStringToDate,
};