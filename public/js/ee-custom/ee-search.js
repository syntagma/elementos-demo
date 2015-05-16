function ee_search(searchText) {
	if (searchText && searchText !== "") {
		$("div#searchResults").hide();
		$("div#waiting").show();
		setTimeout(function() {
			var s = new EE_Search($("div#searchResults"));
			s.search(searchText);
		}, 2000);
	}
	else {
		ee_error("Debe ingresar un texto de busqueda", "Busqueda Invalida");
		$("div#waiting").hide();
	}
}

function ee_download(id) {
	return function() {
		alert("Descargando Archivo " + id);
	};
}

function EE_Search(resultsContainer) {
	var self = this;
	this.list = $('<div class="container">');
	this.container = resultsContainer;

	this.container.empty();

	this.search = function(term) {
		$.ajax({
			dataType: "json",
			url: EE_URL_HOST + EE_URL_SEARCH,
			data: { query: term },
			success: function(data) {
				self.makeList(data.hits);
				self.container.append(self.list);
				self.container.show();
			}
		}).fail(function(data) {
			var emsg = "Ha ocurrido un error al realizar la consulta";
			if (data && data.errorMessage) emsg = data.errorMessage;
			ee_error(emsg, "Error");
		}).always(function() {
			$("div#waiting").hide();
		});
	};

	this.makeList = function(hits) {
		for (var i = 0; i < hits.length; i++) {
			var hit = hits[i];

			var button = $('<button class="btn btn-success btn-lg ee_download">')
				.html('<span class="glyphicon glyphicon-download"></span> Descargar');

			button.click(ee_download(hit._id));

			var element = $('<div class="panel-body">');
			element.append($('<div class="row">')
				.append($('<div class="col-md-10">').html('<h3><span class="glyphicon glyphicon-file"></span> ' + hit.filename + '</h3>'))
				.append($('<div class="col-md-2">').append(button))
				.append($('<div>')
					.append($('<div class="col-md-12 ee-highlight">').html("[...]" + hit.highlight + "[...]"))
				)
			);
			self.list.append($('<div class="panel panel-default">').append(element));
		}
	};


}