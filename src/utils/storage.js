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

/* Get user token from chrome storage
* @return {Promise} of String
*/

async function getToken() {
    let data = await getDataFromChromeStorage(["token"]);
    return data.token;
}

/* Get posting record config from chrome storage
* @return {Promise} of Object
*/
async function getConfig() {
    let data = await getDataFromChromeStorage(["post_config"]);
    return {
        treatment_type: data.post_config.treatment_type || "2",
        health_status: data.post_config.health_status || "2",
        diagnosis: data.post_config.diagnosis || "1",
        advice: data.post_config.advice || "",
    };
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

/* Set account info to chrome storage
* @param {Object} data
* @return {Promise} of undefined
*/

async function setAccountInfo(data) {
    let { username, token, user, medical_station } = data;
    user = user || {};
    medical_station = medical_station || {};

    await setDataToChromeStorage({
        username,
        token,
        user: {
            name: user.name,
        },
        medical_station: {
            name: medical_station.name,
            address: medical_station.address,
            wardsID: medical_station.wardsID,
            stationID: medical_station.stationID
        },
    })
};

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
        token: "",
        user: {
            name: ""
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
    getToken,
    getConfig,
    setDataToChromeStorage,
    setAccountInfo,
    clearChromeStorage,
    createDefaultData
}

export default Storage;