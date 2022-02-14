/*global chrome*/
import Storage from "../utils/storage";
import Notification from "../utils/notification";

const IndexPath = chrome.runtime.getURL("index.html");
const HomePagePath = "https://github.com/NghiaCaNgao/auto-fill-cssk.yte360-extension";

function createTab(url) {
    chrome.tabs.create({
        active: true,
        url: url
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
    console.log("autoCheck", isCheck);
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
            console.log(tabs);
            chrome.tabs.sendMessage(
                tabs[0].id,
                { command: "get_token" },
                function (response) {
                    if (response.success) {
                        Storage.setDataToChromeStorage({ token: response.token });
                        
                        Notification.create({title: "Auto Fill", message: "Save token success!"});
                    } else {
                        console.log(response.message);
                    }
                });
        });
}

// onInstalled
chrome.runtime.onInstalled.addListener(async details => {
    // Clear all notification
    try {
        console.log(await Notification.clearNotifications());
    } catch (error) {
        console.log(error);
    }

    // Create new welcome notification
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        // Create new welcome notification for first time
        await Storage.createDefaultData();
        await Notification.createBasicNotification({
            title: "Welcome to Auto Fill",
            message: "Boost your work right now!",
            id: "af_installed",
        });
    }
    else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        await Notification.createBasicNotification({
            title: "Autofill",
            message: "Update successfully",
            id: "af_updated",
            buttons: [{
                title: "View changelog",
            }]
        });
    }
});

// On click notification
chrome.notifications.onButtonClicked.addListener(
    (notificationId, buttonIndex) => {
        if (notificationId === "af_updated" && buttonIndex === 0) {
            createTab(HomePagePath);
        }
    });

// On icon click
chrome.action.onClicked.addListener(() => {
    createTab(IndexPath);
});

// On press Alt + L
chrome.commands.onCommand.addListener((command) => {
    if (command === "open_app") {
        chrome.tabs.create({
            active: true,
            url: IndexPath
        })
    }
});

// handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    switch (info.menuItemId) {
        case "auto_check": {
            console.log(info.checked);
            autoCheck(info.checked);
            break;
        }
        case "save_token": {
            saveToken();
            break;
        }
    }
});

// Create context menu
chrome.contextMenus.removeAll();
createContextMenu("auto_check", "Tự động kiểm tra", true);
createContextMenu("save_token", "Lưu token");

Storage.getDataFromChromeStorage(["auto_check"])
    .then((data) => {
        const auto_check_status = data.auto_check || false;
        autoCheck(auto_check_status);
    });