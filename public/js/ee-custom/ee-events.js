$(document).ready(function() {
	$("input.ee-searchText").focus();

	$("button.ee-searchButton").click(function(event) {
		event.preventDefault();
		var searchText = $(this).closest("form").find("input.ee-searchText").val();
		
		//TODO: Cada vez que se hace una busqueda se deberia hace algo en la historia... tipo:
		//history.pushState({}, "Documentos Electronicos", document.location);
		new EE_Search($("div#searchResults"), $("div#waiting"), searchText).execute();
	});

	$("button#ee-uploadButton").click(function(event) {
		event.preventDefault();
		var form = $("#uploadModal").find("form").get(0);
		new EE_Upload(form).execute();
	});
});