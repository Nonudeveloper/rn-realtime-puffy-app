import config from "../config/config";

export default function ajaxPostDev(dataString, url, callback) {
    const fullUrl = config.apiServerDev + url;
    const data = JSON.stringify(dataString);

    console.log(fullUrl);
    console.log(data);

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
            console.log(error);
        });
}
