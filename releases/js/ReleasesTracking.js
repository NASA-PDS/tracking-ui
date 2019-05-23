var investigationFilters = [];
var instrumentFilters = [];
var nodeFilters = [];
var lastInstrument = "all";
var lastInvestigation = "all";
var lastNode = "all";

var productsUrl = "https://" + TrackingConts.server_host
		+ "/services/tracking/json/products";
var releasesUrl = "https://" + TrackingConts.server_host
		+ "/services/tracking/json/releases";

var addReleasesUrl = "https://" + TrackingConts.server_host
		+ "/services/tracking/json/releases/add";

(function($) {
	$(document).ready(function() {
		addAddReleasesModalListener();
		addProductsSearchListener();

		// Display the list of products with the latest of Releases.
		setUpProductsList();

		// Return button
		$("#showProductReleasesButton").on("click", function() {
			setUpProductsList();
		});

		$("#productReleasesTable").on("click", ".listreleases", function() {
			var logicalIdentifier = $(this).data("id");
			var dataVersion = $(this).data("ver");
			// console.log("id: ", logicalIdentifier);
			// console.log("ver: ", dataVersion);
			showReleasesPage(logicalIdentifier, dataVersion)
		});

		$.datetimepicker.setLocale('en');

		$('#addReleasesDateInput').datetimepicker({
			dayOfWeekStart : 1,
			lang : 'en',
			showSecond : true,
			format : 'Y-m-d H:i:s'
		});
		$('#addReleasesAnsmDateInput').datetimepicker({
			dayOfWeekStart : 1,
			lang : 'en',
			showSecond : true,
			format : 'Y-m-d H:i:s'
		});

	});
})(jQuery);

function init() {
}

function setUpProductsList() {
	$("#productReleasesTable").empty();

	$.ajax({
		type : "GET",
		url : productsUrl + "/prod-with-releases/null/null/null",
		datatype : "json",
		success : function(data) {
			displayProductList(data);
			setUpFilters(data);
		}
	});
}

function displayProductList(json) {
	$("#productReleasesTable").empty();
	showProductReleasesTable();

	json = json.products;

	if (json) {
		if (json.length > 0) {
			console.log("Number of Products JSON:", json.length);
			var table = $('<table></table>').addClass('table table-hover');
			var thead = $('<thead><tr><th>Title<br/><span style="font-weight:normal">Logical Identifier::version</span</th><th>Release Name</th><th>Investigation</th><th>Instrument</th><th>Node</th></tr></thead>');
			var tbody = $('<tbody></tbody');
			for (i = 0; i < json.length; i++) {
				//console.log("JSON: ", json[i]);

				var title = json[i].title;
				var id = json[i].logical_identifier;
				var ver = json[i].version_id;

				var name = json[i].releasesName;
				var date = json[i].releasesDate;
				var description = json[i].releasesDescription;

				var releasesLink = "<td><button type=\"button\" class=\"btn btn-success\" data-toggle=\"modal\" data-target=\"#addReleasesModal\""
						+ " data-id=\""
						+ id
						+ "\""
						+ " data-ver=\""
						+ ver
						+ "\"" + ">Add</button></td>";
				if (name != null && name.length > 0) {
					releasesLink = "<td><a class=\"listreleases\""
							+ " data-id=\"" + id + "\"" + " data-ver=\"" + ver
							+ "\">" + name + "</a></td>";
				}

				var row = $('<tr>' + '<td><b>' + title + '</b><br/>' + id
						+ '::' + ver + '</td>' + releasesLink + '<td>'
						+ json[i].investigation[0].title + '</td>' + '<td>'
						+ json[i].instrument[0].title + '</td>' + '<td>'
						+ json[i].node[0].title + '</td>' + '</tr>');
				tbody.append(row);
			}

			table.append(thead);
			table.append(tbody);

			$('#productReleasesTable').append(table);
		}
	}
}
function showProductReleasesTable() {
	$("#searchDiv").removeClass("hidden");
	$("#filterDiv").removeClass("hidden");
	$("#prodSearchInput").val('');
	$("#productReleasesTable").removeClass("hidden");

	$("#releasesTable").addClass("hidden");
	$("#showProductReleasesButton").addClass("hidden");
}
function addAddReleasesModalListener() {

	$('#addReleasesModal').on('show.bs.modal', function(event) {

		// set values of id and ver to the form
		var id = $(event.relatedTarget).data('id');
		var ver = $(event.relatedTarget).data('ver');
		$(this).find('#addReleasesLogicalIdentifierInput').val(id);
		$(this).find('#addReleasesVersionInput').val(ver);

		// Validation Listener
		createAddReleasesModalValidationListener();
	});

	// Clear AddReleasesModal on Close
	$(document).on('hide.bs.modal', '#addReleasesModal', function() {
		// back to Releases page, need id and ver
		var logicalIdentifier = $('#addReleasesLogicalIdentifierInput').val();
		var version = $("#addReleasesVersionInput").val();
		// Clear Modal and show the releases page
		clearAddReleasesModal();
		showReleasesPage(logicalIdentifier, version);
	});

	$("#addReleasesModalAddButton").on("click", function() {
		uploadNewReleases();
	});
}

function clearAddReleasesModal() {
	$("#addReleasesLogicalIdentifierInput").val('');
	$("#addReleasesVersionInput").val('');
	$("#addReleasesDateInput").val('');
	$("#addReleasesAnsmDateInput").val('');
	$("#addReleasesNameInput").val('');
	$("#addReleasesDescInput").val('');
	$("#addReleasesEmailInput").val('');
	$("#addReleasesCommentInput").val('');

	$("#addReleasesLogicalIdentifierFormGroup").removeClass("has-success");
	$("#addReleasesLogicalIdentifierFormGroup").removeClass("has-error");
	$("#addReleasesLogicalIdentifierInputHelpBlock").addClass("hidden");

	$("#addReleasesVersionFormGroup").removeClass("has-success");
	$("#addReleasesVersionFormGroup").removeClass("has-error");
	$("#addReleasesVersionInputHelpBlock").addClass("hidden");

	$("#addReleasesDateInputFormGroup").removeClass("has-success");
	$("#addReleasesDateInputFormGroup").removeClass("has-error");
	$("#addReleasesDateInputHelpBlock").addClass("hidden");

	$("#addReleasesAnsmDateInputFormGroup").removeClass("has-success");
	$("#addReleasesAnsmDateInputFormGroup").removeClass("has-error");
	$("#addReleasesAnsmDateInputHelpBlock").addClass("hidden");

	$("#addReleasesNameInputFormGroup").removeClass("has-success");
	$("#addReleasesNameInputFormGroup").removeClass("has-error");
	$("#addReleasesNameInputHelpBlock").addClass("hidden");

	$("#addReleasesDescInputFormGroup").removeClass("has-success");
	$("#addReleasesDescInputFormGroup").removeClass("has-error");
	$("#addReleasesDescInputHelpBlock").addClass("hidden");

	$("#addReleasesEmailInputFormGroup").removeClass("has-success");
	$("#addReleasesEmailInputFormGroup").removeClass("has-error");
	$("#addReleasesEmailInputHelpBlock").addClass("hidden");

	$("#addReleasesCommentInputFormGroup").removeClass("has-success");
	$("#addReleasesCommentInputFormGroup").removeClass("has-error");
	$("#addReleasesCommentInputHelpBlock").addClass("hidden");

	$("#addReleasesModalAddButtonDisabled").removeClass("hidden");
	$("#addReleasesModalAddButton").addClass("hidden");

	$("#addReleasesFormContainer").removeClass("hidden");
	$("#addReleasesFormButtons").removeClass("hidden");

	$("#addReleasesFormCompleteMessage").addClass("hidden");
	$("#addReleasesFormCompleteButtons").addClass("hidden");
	$("#addReleasesLoadingIcon").addClass("hidden");
}

function showReleasesPage(id, ver) {
	$("#releasesTable").empty();
	$.ajax({
		type : "GET",
		url : releasesUrl + "/" + id + "/" + ver + "/false",
		datatype : "json",
		success : function(data) {
			displayReleasesList(data, id, ver);
		}
	});
}
// ###### Validation
function createAddReleasesModalValidationListener() {
	$("#addReleasesDateInput").on(
			"propertychange change click keyup input paste",
			validateAddReleasesForm);
	$("#addReleasesAnsmDateInput").on(
			"propertychange change click keyup input paste",
			validateAddReleasesForm);
	$("#addReleasesNameInput").on(
			"propertychange change click keyup input paste",
			validateAddReleasesForm);
	$("#addReleasesDescInput").on(
			"propertychange change click keyup input paste",
			validateAddReleasesForm);
	$("#addReleasesEmailInput").on(
			"propertychange change click keyup input paste",
			validateAddReleasesForm);
	$("#addReleasesCommentInput").on(
			"propertychange change click keyup input paste",
			validateAddReleasesForm);
}

function validateAddReleasesForm() {
	var isFormValid = false;
	var isDateValid = validateAddReleasesDate();
	var isAnsmDateValid = validateAddReleasesAnsmDate();
	var isNameValid = validateAddReleasesName();
	var isDescValid = validateAddReleasesDesc();
	var isEmailValid = validateAddReleasesEmail();
	var isCommentValid = validateAddReleasesComment();

	//console.log("Valid: ");
	//console.log(isDateValid);
	//console.log(isAnsmDateValid);
	//console.log(isNameValid);
	//console.log(isDescValid);
	//console.log(isEmailValid);
	//console.log(isCommentValid);

	if (!isDateValid || !isAnsmDateValid || !isNameValid || !isDescValid
			|| !isEmailValid || !isCommentValid) {
		isFormValid = false;
	} else {
		isFormValid = true;
	}

	if (isFormValid) {
		showAddReleasesButton();
	} else {
		hideAddReleasesButton();
	}
}

function validateAddReleasesDate() {
	var dateTime = $("#addReleasesDateInput").val();
	if (isValidDateTime(dateTime)) {
		setAddReleasesDateToValid();
		return true;
	} else {
		setAddReleasesDateToInvalid();
		return false;
	}
}

function validateAddReleasesAnsmDate() {
	var dateTime = $("#addReleasesAnsmDateInput").val();
	if (isValidDateTime(dateTime)) {
		setAddReleasesAnsmDateToValid();
		return true;
	} else {
		setAddReleasesAnsmDateToInvalid();
		return false;
	}
}

function validateAddReleasesName() {
	var name = $('#addReleasesNameInput').val();
	if ((name.trim().length > 0 && name.trim().length < 255)) {
		setAddReleasesNameToValid();
		return true;
	} else {
		setAddReleasesNameToInvalid();
		return false;
	}
}

function validateAddReleasesDesc() {
	var desc = $('#addReleasesDescInput').val();
	if ((desc.trim().length > 0 && desc.trim().length < 255)) {
		setAddReleasesDescToValid();
		return true;
	} else {
		setAddReleasesDescToInvalid();
		return false;
	}
}

function validateAddReleasesEmail() {
	var email = $("#addReleasesEmailInput").val();
	if (isValidEmail(email)) {
		setAddReleasesEmailToValid();
		return true;
	} else {
		setAddReleasesEmailToInvalid();
		return false;
	}
}

function validateAddReleasesComment() {
	var comment = $('#addReleasesCommentInput').val();
	if (comment.trim().length == 0
			|| (comment.trim().length > 0 && comment.trim().length < 1024)) {
		setAddReleasesCommentToValid();
		return true;
	} else {
		setAddReleasesCommentToInvalid();
		return false;
	}
}
function showAddReleasesButton() {
	$("#addReleasesModalAddButtonDisabled").addClass("hidden");
	$("#addReleasesModalAddButton").removeClass("hidden");
}

function hideAddReleasesButton() {
	$("#addReleasesModalAddButtonDisabled").removeClass("hidden");
	$("#addReleasesModalAddButton").addClass("hidden");
}

function setAddReleasesEmailToValid() {
	$("#addReleasesEmailInputFormGroup").removeClass("has-error");

	$("#addReleasesEmailInputFormGroup").addClass("has-success");
	$("#addReleasesEmailInputHelpBlock").addClass("hidden");
}

function setAddReleasesEmailToInvalid() {
	$("#addReleasesEmailInputFormGroup").removeClass("has-success");
	$("#addReleasesEmailInputHelpBlock").removeClass("hidden");

	$("#addReleasesEmailInputFormGroup").addClass("has-error");
}

function setAddReleasesDateToValid() {
	$("#addReleasesDateInputFormGroup").removeClass("has-error");

	$("#addReleasesDateInputFormGroup").addClass("has-success");
	$("#addReleasesDateInputHelpBlock").addClass("hidden");
}

function setAddReleasesDateToInvalid() {
	$("#addReleasesDateInputFormGroup").removeClass("has-success");
	$("#addReleasesDateInputHelpBlock").removeClass("hidden");

	$("#addReleasesDateInputFormGroup").addClass("has-error");
}

function setAddReleasesAnsmDateToValid() {
	$("#addReleasesAnsmDateInputFormGroup").removeClass("has-error");

	$("#addReleasesAnsmDateInputFormGroup").addClass("has-success");
	$("#addReleasesAnsmDateInputHelpBlock").addClass("hidden");
}

function setAddReleasesAnsmDateToInvalid() {
	$("#addReleasesAnsmDateInputFormGroup").removeClass("has-success");
	$("#addReleasesAnsmDateInputHelpBlock").removeClass("hidden");

	$("#addReleasesAnsmDateInputFormGroup").addClass("has-error");
}

function setAddReleasesNameToValid() {
	$("#addReleasesNameInputFormGroup").removeClass("has-error");

	$("#addReleasesNameInputFormGroup").addClass("has-success");
	$("#addReleasesNameInputHelpBlock").addClass("hidden");
}

function setAddReleasesNameToInvalid() {
	$("#addReleasesNameInputFormGroup").removeClass("has-success");
	$("#addReleasesNameInputHelpBlock").removeClass("hidden");

	$("#addReleasesNameInputFormGroup").addClass("has-error");
}

function setAddReleasesDescToValid() {
	$("#addReleasesDescInputFormGroup").removeClass("has-error");

	$("#addReleasesDescInputFormGroup").addClass("has-success");
	$("#addReleasesDescInputHelpBlock").addClass("hidden");
}

function setAddReleasesDescToInvalid() {
	$("#addReleasesDescInputFormGroup").removeClass("has-success");
	$("#addReleasesDescInputHelpBlock").removeClass("hidden");

	$("#addReleasesDescInputFormGroup").addClass("has-error");
}

function setAddReleasesCommentToValid() {
	$("#addReleasesCommentInputFormGroup").removeClass("has-error");

	$("#addReleasesCommentInputFormGroup").addClass("has-success");
	$("#addReleasesCommentInputHelpBlock").addClass("hidden");
}

function setAddReleasesCommentToInvalid() {
	$("#addReleasesCommentInputFormGroup").removeClass("has-success");
	$("#addReleasesCommentInputHelpBlock").removeClass("hidden");

	$("#addReleasesCommentInputFormGroup").addClass("has-error");
}

// ##### End Validation

function uploadNewReleases() {

	hideAddReleasesForm();
	showAddReleasesFormLoadingIcon();

	var formData = new FormData();
	var logicalIdentifier = $('#addReleasesLogicalIdentifierInput').val();
	var version = $('#addReleasesVersionInput').val();
	var date = $('#addReleasesDateInput').val();
	var ansmDate = $('#addReleasesAnsmDateInput').val();
	var name = $('#addReleasesNameInput').val();
	var desc = $('#addReleasesDescInput').val();
	var email = $('#addReleasesEmailInput').val();
	var comment = $('#addReleasesCommentInput').val();

	//console.log("submit logicalIdentifier", logicalIdentifier);
	//console.log("submit version", version);
	//console.log("submit date", date);
	//console.log("submit ansmDate", ansmDate);
	//console.log("submit name", name);
	//console.log("submit desc", desc);
	//console.log("submit email", email);
	//console.log("submit comment", comment);

	var form = $('#addReleasesForm');
	var serializedForm = form.serialize();
	//console.log("serializedForm", serializedForm);
	//console.log("form", form);

	$.ajax({
		type : "POST",
		url : addReleasesUrl,
		data : serializedForm
	}).done(function(data) {
		hideAddReleasesFormLoadingIcon();
		showAddReleasesCompletedMessage();
	}).fail(function(data) {
		hideAddReleasesFormLoadingIcon();
		showAddReleasesErrorMessage(jqXHR, textStatus, error);
	});
}

function hideAddReleasesForm() {
	$("#addReleasesFormContainer").addClass("hidden");
	$("#addReleasesFormButtons").addClass("hidden");
}

function showAddReleasesFormLoadingIcon() {
	$("#addReleasesLoadingIcon").removeClass("hidden");
}

function hideAddReleasesFormLoadingIcon() {
	$("#addReleasesLoadingIcon").addClass("hidden");
}

function showAddReleasesErrorMessage(jqXHR, textStatus, error) {
	$("#addReleasesFormCompleteMessage").removeClass("hidden");
	$("#addReleasesFormCompleteButtons").removeClass("hidden");

	var errorHtml = '<div class="bg-danger"><p><b>Upload Error<b></p><p>There has been an error with your submission. Please try again.</p><p>If problems persist please contact the system administrator.</p>';
	// errorHtml = errorHtml + jqXHR.responseText;
	$("#addReleasesFormCompleteMessage").html(errorHtml);
}

function showAddReleasesCompletedMessage() {
	$("#addReleasesFormCompleteMessage").removeClass("hidden");
	$("#addReleasesFormCompleteButtons").removeClass("hidden");

	$("#addReleasesFormCompleteMessage").html("Releases has been added.");
}

function displayReleasesList(json, id, ver) {
	$("#releasesTable").empty();
	showReleasesTable();
	
	json = json["Releases"];
	if (json) {
		if (json.length > 0) {
			var idJson = json[0].logical_identifier;
			var verJson = json[0].version_id;

			var table = $('<table></table>').addClass('table table-hover');
			var addButton = $('<thead><tr><th colspan="4">'
					+ '<button id="showReleasesModalButton" type="button" class="btn btn-success" data-toggle="modal" data-target="#addReleasesModal"'
					+ ' data-id="' + idJson + '"' + ' data-ver="' + verJson
					+ '"> Add </button></th></tr></thead>');
			var subTitle = $('<thead><tr><th colspan="6">Releases<br>' + idJson
					+ '::' + verJson + '</th></tr></thead>');
			var thead = $('<thead><tr>' + '<th>Name</th>'
					+ '<th>Releases Date Time</th>'
					+ '<th>Announcement Date Time</th>'
					+ '<th>Description</th>' + '<th>Email</th>'
					+ '<th>Comment</th>' + '</tr></thead>');

			var tbody = $('<tbody></tbody');
			for (i = 0; i < json.length; i++) {
				//console.log("JSON Releases: ", json[i]);
				var row = $('<tr>' + '<td>' + json[i].name + '</td>' + '<td>'
						+ json[i].release_date_time + '</td>' + '<td>'
						+ json[i].announcement_date_time + '</td>' + '<td>'
						+ json[i].description + '</td>' + '<td>'
						+ json[i].electronic_mail_address + '</td>' + '<td>'
						+ json[i].comment + '</td>' + '</tr>');
				tbody.append(row);
			}

			table.append(subTitle);
			table.append(addButton);
			table.append(thead);
			table.append(tbody);

			$('#releasesTable').append(table);
		}
	} else {
		/*
		 * var tableNonReleases = $('<table></table>').addClass('table
		 * table-hover'); var subTitle = $('<thead><tr><th colspan="6">Releases<br>' +
		 * id + '::' + ver + '</th></tr></thead>') var tbody = $('<tbody><tr><td>Cancelled
		 * Add Releases</td></tr></tbody');
		 * 
		 * tableNonReleases.append(subTitle); tableNonReleases.append(tbody);
		 * 
		 * $('#releasesTable').append(tableNonReleases);
		 */
		setUpProductsList();
	}
}

function showReleasesTable() {
	$("#releasesTable").removeClass("hidden");
	$("#showProductReleasesButton").removeClass("hidden");
	$("#searchDiv").addClass("hidden");
	$("#filterDiv").addClass("hidden");
	$("#productReleasesTable").addClass("hidden");
}

function isValidEmail(input) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(input);
}
function isValidDateTime(input) {
	// yyyy-mm-dd hh:mm:ss
	var stamp = input.split(" ");
	
	var dateFormat = /^\d{4}-\d{2}-\d{2}$/.test(stamp[0]);
	var validDate = !/Invalid|NaN/.test(new Date(stamp[0]).toString());
	var validTime = /^(?:[01]?\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(stamp[1]);

	return dateFormat && validDate && validTime;
}

// product searching
function addProductsSearchListener() {
	$("#prodSearchInput").on("propertychange change click keyup input paste",
			getProdResults);
}

function getProdResults() {
	var text = $(this).val().toLowerCase();
	$("#productReleasesTable tr").filter(function() {
		$(this).toggle($(this).children('td').first().text().toLowerCase().indexOf(text) > -1)
	});
	
}
// References filter
function setUpFilters(data) {
	var products = data.products;

	for (var i = 0; i < products.length; i++) {
		addToInvestigationsFilter(products[i]);
		addToInstrumentsFilter(products[i]);
		addToNodeFilter(products[i]);
	}

	createFilterSelects();
}

function addToInvestigationsFilter(product) {
	var title = product.investigation[0].title;
	var reference = product.investigation[0].reference;

	var investigation = {
		"title" : title,
		"reference" : reference
	};

	if (!titleExistsInInvestigationFilter(title)) {
		investigationFilters.push(investigation);
	}
}

function titleExistsInInvestigationFilter(title) {
	for (var i = 0; i < investigationFilters.length; i++) {
		if (investigationFilters[i].title === title) {
			return true;
		}
	}

	return false;
}

function addToInstrumentsFilter(product) {
	var title = product.instrument[0].title;
	var reference = product.instrument[0].reference;

	var instrument = {
		"title" : title,
		"reference" : reference
	};

	if (!titleExistsInInstrumentFilter(title)) {
		instrumentFilters.push(instrument);
	}
}

function titleExistsInInstrumentFilter(title) {
	for (var i = 0; i < instrumentFilters.length; i++) {
		if (instrumentFilters[i].title === title) {
			return true;
		}
	}

	return false;
}

function addToNodeFilter(product) {
	var title = product.node[0].title;
	var reference = product.node[0].reference;

	var node = {
		"title" : title,
		"reference" : reference
	};

	if (!titleExistsNodeFilter(title)) {
		nodeFilters.push(node);
	}
}

function titleExistsNodeFilter(title) {
	for (var i = 0; i < nodeFilters.length; i++) {
		if (nodeFilters[i].title === title) {
			return true;
		}
	}

	return false;
}

function createFilterSelects() {
	createInvestigationFilterSelectList();
	createInstrumentsFilterSelectList();
	createNodeFilterSelectList();

	addInvestigationFilterSelectListener();
	addInstrumentFilterSelectListener();
	addNodeFilterSelectListener();
}

function createInvestigationFilterSelectList() {
	$('#investigationSelect').find('option').remove();

	$('#investigationSelect').append('<option value="all">All</option>');
	for (var i = 0; i < investigationFilters.length; i++) {
		$('#investigationSelect').append(
				'<option value=' + investigationFilters[i].reference + '>'
						+ investigationFilters[i].title + '</option>');
	}

	$('#investigationSelect').val('all');
	lastInvestigation = "all";
}

function createInstrumentsFilterSelectList() {
	$('#instrumentSelect').find('option').remove();

	$('#instrumentSelect').append('<option value="all">All</option>');
	for (var i = 0; i < instrumentFilters.length; i++) {
		$('#instrumentSelect').append(
				'<option value=' + instrumentFilters[i].reference + '>'
						+ instrumentFilters[i].title + '</option>');
	}

	$('#instrumentSelect').val('all');
	lastInstrument = "all";
}
function createNodeFilterSelectList() {
	$('#nodeSelect').find('option').remove();

	$('#nodeSelect').append('<option value="all">All</option>');
	for (var i = 0; i < nodeFilters.length; i++) {
		$('#nodeSelect').append(
				'<option value=' + nodeFilters[i].reference + '>'
						+ nodeFilters[i].title + '</option>');
	}

	$('#nodeSelect').val('all');
	lastNode = "all";
}

function addInvestigationFilterSelectListener() {
	$('#investigationSelect').on('change', function() {
		filterProducts(null, this.value, null);
	});
}

function addInstrumentFilterSelectListener() {
	$('#instrumentSelect').on('change', function() {
		filterProducts(this.value, null, null);
	});
}
function addNodeFilterSelectListener() {
	$('#nodeSelect').on('change', function() {
		filterProducts(null, null, this.value);
	});
}
function filterProducts(instrument, investigation, node) {
	if (instrument === null) {
		instrument = lastInstrument;
	}
	if (instrument === "all") {
		instrument = "null";
	}

	if (investigation === null) {
		investigation = lastInvestigation;
	}
	if (investigation === "all") {
		investigation = "null";
	}
	if (node === null) {
		node = lastNode;
	}
	if (node === "all") {
		node = "null";
	}

	lastInstrument = instrument;
	lastInvestigation = investigation;
	lastNode = node;

	$.ajax({
		type : "GET",
		url : productsUrl + "/prod-with-releases/" + instrument + "/"
				+ investigation + "/" + node,
		datatype : "json",
		success : function(data) {
			displayProductList(data);
		}
	});
}