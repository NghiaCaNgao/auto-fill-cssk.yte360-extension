/*global chrome*/

/* Get data from chrome storage
* @param {Array of String} key
* @return {Promise} of Object
*/
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

/* Set data to chrome storage
* @param {Object} data
* @return {Promise} of undefined
*/

async function setDataToChromeStorage(data) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set(data, () => {
            resolve();
        });
    });
}

/* Clear all data in chrome storage
* @return {Promise} of undefined
*/

async function clearChromeStorage() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.clear(() => {
            resolve();
        });
    });
}

/* reset data to default
* @return {Promise} of undefined
*/

async function createDefaultData() {
    await setDataToChromeStorage({
        username: "",
        auto_check: false,
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