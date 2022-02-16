/*global chrome*/

/*
* Return All notificationIDs
*/

async function getIDs() {
    return new Promise((resolve, reject) => {
        chrome.notifications.getAll(notifications => {
            resolve(Object.keys(notifications));
        });
    });
}

/* Check if notification exists 
* @param {string} notification_id
* @return {boolean}
*/

async function hasID(notification_id) {
    const IDSet = new Set(await getIDs());
    return IDSet.has(notification_id);
}

/*
* Clear notifications
* notification_id: string | string[] | undefined
* return: Promise<string> of status message
*/

async function clear(notification_id) {
    return new Promise(async (resolve, reject) => {
        // Clear special notification
        if (notification_id) {
            // Clear one notification
            if (typeof (notification_id) == 'string') {
                chrome.notifications.clear(notification_id, (wasCleared) => {
                    wasCleared
                        ? resolve('Cleared ' + notification_id)
                        : reject("Cannot clear notification " + notification_id);
                });
                // Clear array of notifications
            } else if (Array.isArray(notification_id)) {
                try {
                    resolve(await Promise.all(
                        notification_id.map(
                            element => clear(element))
                    ));
                } catch (error) {
                    reject(error);
                }
            } else {
                reject('Notification_id must be string or array');
            }
            // Clear all notifications
        } else {
            getIDs()
                .then(async (notificationIds) => {
                    try {
                        resolve(await clear(notificationIds));
                    } catch (error) {
                        reject(error);
                    }
                });
        }
    });
}

/* Create notification
*  title: string
*  message: string
*  id: string | null
*  buttons: object | null
*  return: Promise<string> of notificationId
*/

async function create({
    title = "Auto Fill",
    message = "Happy day!",
    id, buttons
}) {
    return new Promise(async (resolve, reject) => {
        try {
            if (await hasID(id)) await clear(id);

            chrome.notifications.create(id, {
                type: "basic",
                iconUrl: 'assets/logo/logo_48.png',
                title: title,
                message: message,
                buttons: buttons
            }, function (notificationId) {
                resolve(notificationId);
            });
        } catch (error) {
            reject(error);
        }
    });
}

const Notification = {
    create,
    clear,
    hasID,
    getIDs
}

export default Notification;