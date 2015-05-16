function EE_Download(id) {
	var self = this;

	this.id = id;

	this.execute = function(e) {
		e && e.preventDefault && e.preventDefault();
		alert("Descargando Documento " + self.id);
	}
}