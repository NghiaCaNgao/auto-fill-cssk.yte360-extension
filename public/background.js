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
                    console.log(notificationIds);
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

// onInstalled
chrome.runtime.onInstalled.addListener(async details => {
    try {
        console.log(await clearNotifications());
    } catch (error) {
        console.log(error);
    }

    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
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