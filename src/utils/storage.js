/*global chrome*/

import Utils from "./utils";

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
async function getPostConfig() {
    let data = await getDataFromChromeStorage(["post_config"]);
    return {
        treatment_type: data.post_config.treatment_type || Utils.DEFAULT.treatment_type,
        health_status: data.post_config.health_status || Utils.DEFAULT.health_status,
        diagnosis: data.post_config.diagnosis || Utils.DEFAULT.diagnosis,
        advice: data.post_config.advice || Utils.DEFAULT.advice,
        action_date: data.post_config.action_date || Utils.DEFAULT.action_date,
        use_current_date: (data.post_config.use_current_date === undefined)
            ? Utils.DEFAULT.use_current_date
            : data.post_config.use_current_date,
    };
}

/* Get running record config from chrome storage
* @return {Promise} of Object
*/
async function getRunConfig() {
    let data = await getDataFromChromeStorage(["run_config"]);
    return {
        delay_request: data.run_config.delay_request || Utils.DEFAULT.delay_request,
        delay_post: data.run_config.delay_post || Utils.DEFAULT.delay_post,
    };
}

/* Get all configs from chrome storage
* @return {Promise} of Object
*/

async function getConfig() {
    return {
        run_config: await getRunConfig(),
        post_config: await getPostConfig(),
    }
}

/* Get account and related data from chrome storage
* @return {Promise} of Object
*/

async function getAccountInfo() {
    let data = await getDataFromChromeStorage(["token", "user", "medical_station"]);
    return {
        token: data.token || Utils.DEFAULT.token,
        user: {
            name: data.user.name || Utils.DEFAULT.name,
        },
        medical_station: {
            name: data.medical_station.name || Utils.DEFAULT.medical_station,
            address: data.medical_station.address || Utils.DEFAULT.address,
            wardsID: data.medical_station.wardsID || Utils.DEFAULT.wardsID,
            stationID: data.medical_station.stationID || Utils.DEFAULT.stationID,
        }
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
    let { token, user, medical_station } = data;
    user = user || {};
    medical_station = medical_station || {};

    await setDataToChromeStorage({
        token,
        user: {
            name: user.name || Utils.DEFAULT.name,
        },
        medical_station: {
            name: medical_station.name || Utils.DEFAULT.medical_station,
            address: medical_station.address || Utils.DEFAULT.address,
            wardsID: medical_station.wardsID || Utils.DEFAULT.wardsID,
            stationID: medical_station.stationID || Utils.DEFAULT.stationID,
        },
    })
};

async function setConfigInfo(data) {
    let { run_config, post_config } = data;
    run_config = run_config || {};
    post_config = post_config || {};

    await setDataToChromeStorage({
        run_config: {
            delay_request: run_config.delay_request || Utils.DEFAULT.delay_request,
            delay_post: run_config.delay_post || Utils.DEFAULT.delay_post,
        },
        post_config: {
            treatment_type: post_config.treatment_type || Utils.DEFAULT.treatment_type,
            health_status: post_config.health_status || Utils.DEFAULT.health_status,
            diagnosis: post_config.diagnosis || Utils.DEFAULT.diagnosis,
            advice: post_config.advice || Utils.DEFAULT.advice,
            action_date: post_config.action_date || Utils.DEFAULT.action_date,
            use_current_date: (post_config.use_current_date === undefined)
                ? Utils.DEFAULT.use_current_date
                : post_config.use_current_date,
        },
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
        token: Utils.DEFAULT.token,
        user: {
            name: Utils.DEFAULT.name,
        },
        medical_station: {
            name: Utils.DEFAULT.medical_station,
            address: Utils.DEFAULT.address,
            wardsID: Utils.DEFAULT.wardsID,
            stationID: Utils.DEFAULT.stationID,
        },
        post_config: {
            treatment_type: Utils.DEFAULT.treatment_type,
            health_status: Utils.DEFAULT.health_status,
            diagnosis: Utils.DEFAULT.diagnosis,
            advice: Utils.DEFAULT.advice,
            action_date: Utils.DEFAULT.action_date,
            use_current_date: Utils.DEFAULT.use_current_date,
        },
        run_config: {
            delay_request: Utils.DEFAULT.delay_request,
            delay_post: Utils.DEFAULT.delay_post
        }
    })
}

/* Handle raw account data
* @param {Object} accountInfo
* @return {Object}
*/

async function handleAccountInfo(accountInfo) {
    const { fullname, token, donvi, donvi_id } = accountInfo;
    const { ten, xaphuong_id, diachi } = donvi;
    const user = {
        name: fullname || Utils.DEFAULT.name,
        token: token || Utils.DEFAULT.token,
    };
    const medical_station = {
        name: ten || Utils.DEFAULT.medical_station,
        address: diachi || Utils.DEFAULT.address,
        wardsID: xaphuong_id || Utils.DEFAULT.wardsID,
        stationID: donvi_id || Utils.DEFAULT.stationID,
    }
    // Save to storage
    await Storage.setAccountInfo({ token, user, medical_station });

    return { token, user, medical_station };
}

const Storage = {
    getDataFromChromeStorage,
    getToken,
    getPostConfig,
    getRunConfig,
    getConfig,
    getAccountInfo,
    setDataToChromeStorage,
    setAccountInfo,
    setConfigInfo,
    clearChromeStorage,
    createDefaultData,
    handleAccountInfo
}

export default Storage;