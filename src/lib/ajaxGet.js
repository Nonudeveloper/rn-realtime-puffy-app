import config from "../config/config";

export default function ajaxGet(url, callback) {
	//console.log(url);

	fetch(url)
		.then(response => response.json())
		.then(responseJson => {
			callback(responseJson);
		})
		.catch(error => {
			console.log(error);
		});
}
