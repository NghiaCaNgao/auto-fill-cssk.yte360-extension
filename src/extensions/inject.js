/*global chrome*/

function getToken() {
    const token = window.localStorage.getItem("X-USER-TOKEN");
    if (token && token.trim() !== "") {
        return {
            token: token.slice(1, -1),
            message: "success"
        };
    }
    else {
        return {
            token: "",
            message: "Can't get token"
        };
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.command) {
            case "get_token":
                {
                    const { message, token } = getToken();
                    sendResponse({
                        success: (message === "success") ? true : false,
                        token: token,
                        message: message
                    });
                    break;
                }
        }
    }
);