/*global chrome*/

async function getDataFromChromeStorage(keys) {
    return new Promise((resolve, reject) => {
        if (keys.length > 0 && Array.isArray(keys)) {
            chrome.storage.sync.get(keys, (result) => {
                resolve(result);
            });
        } else {
            chrome.storage.sync.get(keys, (result) => {
                resolve(result);
            });
        }
    });
}

async function setDataToChromeStorage(data) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set(data, () => {
            resolve();
        });
    });
}

async function clearChromeStorage() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.clear(() => {
            resolve();
        });
    });
}

async function createDefaultData() {
    await setDataToChromeStorage({
        username: "",
        user: {
            name: "",
            token: ""
        },
        medical_station: {
            name: "",
            address: "",
            wardsID: "",
            stationID: ""
        }
    })
}

const Storage = {
    getDataFromChromeStorage,
    setDataToChromeStorage,
    clearChromeStorage,
    createDefaultData
}

export default Storage;