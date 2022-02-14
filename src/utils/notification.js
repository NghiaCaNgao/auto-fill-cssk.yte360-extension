/*global chrome*/

/*
* Return All notificationIDs
*/

async function getAllNotificationIDs() {
    return new Promise((resolve, reject) => {
        chrome.notifications.getAll(notifications => {
            resolve(Object.keys(notifications));
        });
    });
}

/*
* Clear notifications
* notification_id: string | string[] | undefined
* return: Promise<string> of status message
*/

async function clearNotifications(notification_id) {
    return new Promise(async (resolve, reject) => {
        // Clear special notification
        if (notification_id) {
            // Clear one notification
            if (typeof (notification_id) == 'string') {
                chrome.notifications.clear(notification_id, (wasCleared) => {
                    wasCleared
                        ? resolve('Cleared ' + notification_id)
                        : reject("Can't not clear notification " + notification_id);
                });
                // Clear array of notifications
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
            // Clear all notifications
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

/* Create notification
*  title: string
*  message: string
*  id: string | null
*  buttons: object | null
*  return: Promise<string> of notificationId
*/
async function createBasicNotification(
    title = "Auto Fill",
    message = "Happy day!",
    id, buttons) {
    return new Promise((resolve, reject) => {
        chrome.notifications.create(id, {
            type: "basic",
            iconUrl: 'assets/logo/logo_48.png',
            title: title,
            message: message,
            buttons: buttons
        }, function (notificationId) {
            resolve(notificationId);
        });
    });
}

const Notification = {
    createBasicNotification,
    clearNotifications,
    getAllNotificationIDs
}

export default Notification;