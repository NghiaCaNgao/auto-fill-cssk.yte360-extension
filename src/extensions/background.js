/*global chrome*/

import Storage from "../utils/storage.js";

// Return All notificationIDs
async function getAllNotificationIDs() {
    return new Promise((resolve, reject) => {
        chrome.notifications.getAll(notifications => {
            resolve(Object.keys(notifications));
        });
    });
}

// notification_id: string | string[] | undefined
async function clearNotifications(notification_id) {
    return new Promise(async (resolve, reject) => {
        if (notification_id) {
            if (typeof (notification_id) == 'string') {
                chrome.notifications.clear(notification_id, (wasCleared) => {
                    wasCleared
                        ? resolve('Cleared ' + notification_id)
                        : reject("Can't not clear notification " + notification_id);
                });
            } else if (Array.isArray(notification_id)) {
                try {
                    resolve(await Promise.all(
                        notification_id.map(
                            element => clearNotifications(element))
                    ));
                } catch (error) {
                    reject(error);
                }
            } else {
                reject('Notification_id must be string or array');
            }
        } else {
            getAllNotificationIDs()
                .then(async (notificationIds) => {
                    try {
                        resolve(await clearNotifications(notificationIds));
                    } catch (error) {
                        reject(error);
                    }
                });
        }
    });
}

//  title: string
//  message: string
//  id: string | null
async function createBasicNotification(title = "Auto Fill", message = "Happy day!", id) {
    return new Promise((resolve, reject) => {
        chrome.notifications.create(id, {
            type: 'basic',
            iconUrl: 'assets/logo/logo_48.png',
            title: title,
            message: message
        }, function (notificationId) {
            resolve(notificationId);
        });
    });
}

function createContextMenu(id, title, checked = false) {
    chrome.contextMenus.create({
        contexts: ["all"],
        type: checked ? "checkbox" : "normal",
        documentUrlPatterns: [
            "https://chamsocsuckhoe.yte360.com/"
        ],
        checked: checked,
        id: id,
        title: title,
    });
}

function autoCheck(isCheck = true) {
    chrome.contextMenus.update("auto_check", {
        checked: isCheck
    });
    chrome.storage.sync.set({
        auto_check: isCheck
    });
}

function saveToken() {
    chrome.tabs.query(
        {
            active: true,
            currentWindow: true,
        },
        function (tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id,
                { command: "get_token" },
                function (response) {
                    if (response.success) {
                        chrome.storage.sync.set({
                            token: response.token
                        });
                    } else {
                        console.log(response.message);
                    }
                });
        });
}
// onInstalled
chrome.runtime.onInstalled.addListener(async details => {
    try {
        console.log(await clearNotifications());
    } catch (error) {
        console.log(error);
    }

    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        await Storage.createDefaultData();
        await createBasicNotification("Auto Fill", "Welcome to Auto FIll", "ok_welcome");
    }
    else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        await createBasicNotification("Auto Fill", "Update successfully", "ok_update");
    }
});

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({
        active: true,
        url: chrome.runtime.getURL('index.html')
    })
});

chrome.commands.onCommand.addListener((command) => {
    if (command === "open_app") {
        chrome.tabs.create({
            active: true,
            url: chrome.runtime.getURL('index.html')
        })
    }
});

chrome.contextMenus.removeAll();
createContextMenu("auto_check", "Tự động kiểm tra", true);
createContextMenu("save_token", "Lưu token");

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    switch (info.menuItemId) {
        case "auto_check":
            autoCheck(info.checked);
            break;
        case "save_token":
            saveToken();
            break;
    }
});
