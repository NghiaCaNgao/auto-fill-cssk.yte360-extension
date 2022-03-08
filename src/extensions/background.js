/*global chrome*/
import Storage from "../utils/storage";
import Notification from "../utils/notification";
import Config from "../utils/config";

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

function callSaveToken() {
    chrome.tabs.query(
        { active: true, currentWindow: true },
        function (tabs) {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { command: "get_token" });
            }
        });
}

// onInstalled
chrome.runtime.onInstalled.addListener(async details => {
    // Clear all notification
    try {
        console.log(await Notification.clear());
    } catch (error) {
        console.log(error);
    }

    // Create new welcome notification
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        // Create new welcome notification for first time
        const config = new Config();
        config.save();

        await Notification.create({
            title: "Welcome to Autofill",
            message: "Boost your work right now!",
            id: "af_installed",
        });
    }
    else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        await Notification.create({
            title: "Autofill",
            message: "Update successfully",
            id: "af_updated",
            buttons: [{
                title: "Changelog",
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
        case "save_token": {
            callSaveToken();
            break;
        }
    }
});

// Create context menu
chrome.contextMenus.removeAll();
createContextMenu("save_token", "Lưu token");