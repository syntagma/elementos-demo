function EE_Upload(form) {
	this.execute = function() {
		form.action = EE_URL_HOST + EE_URL_UPLOAD;
		form.method = "POST";
		form.enctype="multipart/form-data";
		form.submit();
	};
}