function EE_Download(id) {
	var self = this;

	this.id = id;

	this.execute = function(e) {
		e && e.preventDefault && e.preventDefault();
		document.location = EE_URL_HOST + EE_URL_DOWNLOAD + "?id=" + self.id
	}
}