var EE_URL_HOST = "http://localhost:8000";
var EE_URL_SEARCH = "/js/json/documents.json";

function ee_error(errormsg, title) {
	var _title = title || "";
	new PNotify({
		title: _title,
		text: errormsg,
		type: 'error',
		styling: 'bootstrap3',
		icon: 'glyphicon glyphicon-exclamation-sign'
	});
}