/*global chrome*/
import Storage from "../utils/storage";
import Core from "../utils/core";
import swal from "sweetalert";

function getToken() {
    const token = window.localStorage.getItem("X-USER-TOKEN");
    if (token && token.trim() !== "") {
        return {
            token: token.slice(1, -1),
            message: "Đã lấy token thành công",
            ok: true
        };
    }
    else {
        return {
            token: "",
            message: "Không tìm thấy token",
            ok: false
        };
    }
}

async function setToken(token) {
    await Storage.setDataToChromeStorage({ token: token });
    await Core.currentUser();
}

chrome.runtime.onMessage.addListener(
    async function (request) {
        switch (request.command) {
            case "get_token":
                {
                    const { message, token, ok } = getToken();
                    if (ok) {
                        await setToken(token);
                        swal("Thành công", message, "success");
                    }
                    else
                        swal("Thất bại", message, "error");
                    break;
                }
        }
    }
);