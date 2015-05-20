function EE_Search(resultsContainer, waitContainer, searchText) {
	var self = this;
	this.list = $('<div class="container">');
	this.container = resultsContainer;
	this.wait = waitContainer;
	this.term = searchText;

	this.execute = function() {
		if (self.validate()) {
			self.init();
			//pongo un timeout para esperar un cacho hasta que empiece la busqueda y se vea el circulito :)
			setTimeout(self.search, 1000);
		}
	};

	this.validate = function() {
		if (self.term === undefined || self.term == "") {
			ee_error("Debe ingresar un termino de busqueda", "Busqueda Invalida");
			return false;
		}

		return true;
	};

	this.init = function() {
		self.container.hide();
		self.wait.show();
	} ;

	this.search = function(callback) {
		$.ajax({
			dataType: "json",
			url: EE_URL_HOST + EE_URL_SEARCH,
			data: { query: self.term },
			success: function(data) {
				self.makeList(data);
				self.success();
			}
		}).fail(function(data) {
			ee_handleAjaxError(data);
		}).always(function() {
			self.finalize();
		});
	};

	this.success = function() {
		self.container.empty();
		self.container.append(self.list);
	};

	this.finalize = function() {
		self.container.show();
		self.wait.hide();
	};

	this.makeList = function(hits) {
		if (hits.length == 0) {
			self.list.append($("<h3>").text("No se encontraron resultados"));
			return;
		}

		for (var i = 0; i < hits.length; i++) {
			var hit = hits[i];

			var filename = "[Desconocido]";
			if (hit.fields && hit.fields.title) filename = hit.fields.title[0];

			var detail = "";
			var nroPoliza = hit.fields.nroPoliza[0];
			if (hit.highlight && hit.highlight.file) detail = "[...]" + hit.highlight.file.join("[...]") + "[...]";
			detail = "<em>Nro de Poliza: </em>" + nroPoliza + "<br/>" + detail;

			//hit.fields.title + " " + hit.fields.tresdedos + " " + hit.fields.type;
			var button = $('<button class="btn btn-success btn-lg ee_download">')
				.html('<span class="glyphicon glyphicon-download"></span> Descargar');

			button.click(new EE_Download(hit._id).execute);

			var element = $('<div class="panel-body">');
			element.append($('<div class="row">')
				.append($('<div class="col-md-10">')
					.html('<h3><span class="glyphicon glyphicon-file"></span> ' + filename + '</h3>'))
				.append($('<div class="col-md-2">').append(button))
				.append($('<div>')
					.append($('<div class="col-md-12 ee-highlight">').append($("<p class='text-info well'>").html(detail)))
				)
			);
			self.list.append($('<div class="panel panel-default">').append(element));
		}
	};


}