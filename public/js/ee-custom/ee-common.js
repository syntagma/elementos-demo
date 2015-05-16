//var EE_URL_HOST = "http://localhost:3000";
var EE_URL_HOST = "";

var EE_URL_SEARCH = "/documents/search";
var EE_URL_UPLOAD = "/documents/insert";
var EE_URL_DOWNLOAD = "/documents/download";

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

function ee_handleAjaxError(data) {
	if (data.status == 404) {
		ee_error("Servicio no encontrado", "404");	
	}
	else {
		var emsg = "Ha ocurrido un error al realizar la consulta";
		if (data && data.responseJSON) emsg = data.responseJSON.message;
		ee_error(emsg, "Error");
	}
}