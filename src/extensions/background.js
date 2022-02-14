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
    // Clear all notification
    try {
        console.log(await clearNotifications());
    } catch (error) {
        console.log(error);
    }

    // Create new welcome notification
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        // Create new welcome notification for first time
        await Storage.createDefaultData();
        await Notification.createBasicNotification("Auto Fill", "Welcome to Auto FIll", "af_install");
    }
    else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        await Notification.createBasicNotification(
            title = "Auto Fill",
            message = "Update successfully",
            id = "af_update",
            buttons = [{
                title: "View changelog",
            }]);
    }
});

// On click notification
chrome.notifications.onButtonClicked.addListener(
    (notificationId, buttonIndex) => {
        if (notificationId === "ok_update" && buttonIndex === 0) {
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

// Create context menu
chrome.contextMenus.removeAll();
const auto_check_status = await Storage.getDataFromChromeStorage("auto_check");
createContextMenu("auto_check", "Tự động kiểm tra", auto_check_status);
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
