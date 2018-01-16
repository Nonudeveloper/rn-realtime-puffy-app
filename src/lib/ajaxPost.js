import { Platform } from "react-native";
import config from "../config/config";

export default function ajaxPost(dataString, url, callback) {
    dataString["device"] = Platform.OS;
    const fullUrl = config.apiServer + url;
    const data = JSON.stringify(dataString);

    //console.log(fullUrl);
    //console.log(data);

    fetch(fullUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: data
    })
        .then(response => response.json())
        .then(responseJson => {
            callback(responseJson);
        })
        .catch(error => {
            callback(-1);
            console.log(error);
        });
}
