$(document).ready(function() {
	$("input.ee-searchText").focus();
	$("button.ee-searchButton").click(function(event) {
		event.preventDefault();
		$("div.jumbotron").hide();
		$("div#searchPage").show();
		var searchText = $(this).closest("form").find("input.ee-searchText").val();
		$("input#nb-searchText").val(searchText);

		//TODO: Cada vez que se hace una busqueda se hace algo en la historia...
		history.pushState({}, "Documentos Electronicos", document.location);

		$.getScript("js/ee-custom/ee-search.js", function() {
			ee_search(searchText);
		});
	});
});