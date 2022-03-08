/* Get data from chrome storage
* @param {Array of String} key
* @return {Promise} of Object
*/
async function get(keys: string | string[]): Promise<object> {
    return chrome.storage.sync.get(keys);
}


/* Set data to chrome storage
* @param {Object} data
* @return {Promise} of void
*/

async function set(data: object): Promise<void> {
    return chrome.storage.sync.set(data);
}

/* Clear all data in chrome storage
* @return {Promise} of undefined
*/

async function clear(): Promise<void> {
    chrome.storage.sync.clear();
}

const Storage = {
    get,
    set,
    clear
}

export default Storage;