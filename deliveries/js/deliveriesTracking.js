var Manager;
var investigationFilters = [];
var instrumentFilters = [];
var lastInstrument = "all";
var lastInvestigation = "all";
var tableItemDetails = null;

var productLogicalIdentifier = null;
var productDataVersion = null;
var productName = null;


var productsUrl = "https://" + TrackingConts.server_host + "/services/tracking/json/products";
var deliveryUrl = "https://" + TrackingConts.server_host + "/services/tracking/json/delivery";

var addDeliveryUrl = "https://" + TrackingConts.server_host
		+ "/services/tracking/json/delivery/add";

(function ($) {
    $( document ).ready(function() {
        $.ajax({
            type: "GET",
            url: productsUrl + "/null/null",
            datatype: "json",
            success: function(data) {
              displayTrackingList(data);
              setUpFilters(data);
            }
        });

        $("#showTrackingServiceButton").on("click", function(){
            showTrackingTable();
            showReferenceFilter();
        });

        $( "#trackingServiceTable" ).on("click", ".listTitle", function() {
            productLogicalIdentifier = $(this).data("id");
            productDataVersion = $(this).data("version");
            productName = $(this).text();
            
            loadDeliveriesForProduct();
        });

        $(document).on('click', '#addDeliveryToServiceButton', function(){
          clearAddDeliveryForm();
          preFillAddDeliveryForm();
          disablePresetFormInputs();
        });

        $(document).on('click', '#addDeliveryToServiceWithoutSelectionButton', function(){
          clearAddDeliveryForm();
          enableFormInputs();
        });

        $('#addDeliveryModal').on('hidden.bs.modal', function () {
          resetForm();
        });

        $(document).on('click', '#addDeliveryModalAddButton', function(){
          if(validateAddDeliveryForm()){
            uploadNewDelivery();
          }
        });
    });
})(jQuery);

function init(){
}

function displayTrackingList(json){
    $("#trackingServiceTable").empty();
    showTrackingTable();
    showReferenceFilter();

    json = json.products;

    if (json){
      if(json.length > 0){
        var title = $('<h4>Products With Deliveries</h4>');
        var table = $('<table></table>').addClass('table table-hover');
        var thead = $('<thead><tr><th>Title</th><th>Version</th><th>Investigation</th><th>Instrument</th></tr></thead>');

        var tbody = $('<tbody></tbody');
        for(i=0; i<json.length; i++){
            var row = $('<tr>' +
                        '<td><a class="listTitle" data-version=' + json[i].version_id + ' data-id=' + json[i].logical_identifier + '>' + json[i].title + '</a></td>' +
                        '<td>' + json[i].version_id + '</td>' +
                        '<td>' + json[i].investigation[0].title + '</td>' +
                        '<td>' + json[i].instrument[0].title + '</td>' +
                        '</tr>');
            tbody.append(row);
        }

        table.append(thead);
        table.append(tbody);

        $('#trackingServiceTable').append(title);
        $('#trackingServiceTable').append(table);
      }
    }
}

function showTrackingTable(){
  $("#trackingServiceTable").removeClass("hidden");
  $("#deliveryTable").addClass("hidden");
  $("#showTrackingServiceButton").addClass("hidden");
  $("#addDeliveryToServiceButton").addClass("hidden");
  $("#addDeliveryToServiceWithoutSelectionButton").removeClass("hidden");
}

function loadDeliveriesForProduct(){
  $.ajax({
    type: "GET",
    url: deliveryUrl + "/" + productLogicalIdentifier + "/" + productDataVersion,
    datatype: "json",
    success: function(data) {
      tableItemDetails = {
        logicalIdentifier: productLogicalIdentifier,
        dataVersion: productDataVersion
      };
      displayDeliveryList(data);
    }
});
}

function displayDeliveryList(data){
  $("#deliveryTable").empty();
  showDeliveryTable();
  hideReferenceFilter();

  json = data.delivery;
  if (json){
    if(json.length > 0){
      var title = $('<h4>Deliveries For ' + productName + '</h4>');
      var table = $('<table></table>').addClass('table table-hover');
      var thead = $('<thead><tr><th>Name</th><th>Start Date</th><th>Stop Date</th><th>Source</th><th>Target</th><th>Due Date</th></tr></thead>');

      var tbody = $('<tbody></tbody');
      for(i=0; i<json.length; i++){
          var row = $('<tr>' +
                      '<td>' + json[i].name + '</td>' +
                      '<td>' + json[i].start_date_time + '</td>' +
                      '<td>' + json[i].stop_date_time + '</td>' +
                      '<td>' + json[i].source + '</td>' +
                      '<td>' + json[i].target + '</td>' +
                      '<td>' + json[i].due_date + '</td>' +
                      '</tr>');
          tbody.append(row);
      }

      table.append(thead);
      table.append(tbody);

      $('#deliveryTable').append(title)
      $('#deliveryTable').append(table);
    }
  }
}

function showDeliveryTable(){
  $("#deliveryTable").removeClass("hidden");
  $("#showTrackingServiceButton").removeClass("hidden");
  $("#addDeliveryToServiceButton").removeClass("hidden");
  $("#trackingServiceTable").addClass("hidden");
  $("#addDeliveryToServiceWithoutSelectionButton").addClass("hidden");
}

function setUpFilters(data){
  var products = data.products;

  for(var i = 0; i < products.length; i++){
    addToInvestigationsFilter(products[i]);
    addToInstrumentsFilter(products[i]);
  }

  createFilterSelects();
}

function addToInvestigationsFilter(product){
  var title = product.investigation[0].title;
  var reference = product.investigation[0].reference;

  var investigation = {
    "title": title,
    "reference": reference
  };

  if(!titleExistsInInvestigationFilter(title)){
    investigationFilters.push(investigation);
  }
}

function titleExistsInInvestigationFilter(title){
  for(var i = 0; i < investigationFilters.length; i++){
    if(investigationFilters[i].title === title){
      return true;
    }
  }

  return false;
}

function addToInstrumentsFilter(product){
  var title = product.instrument[0].title;
  var reference = product.instrument[0].reference;

  var instrument = {
    "title": title,
    "reference": reference
  };

  if(!titleExistsInInstrumentFilter(title)){
    instrumentFilters.push(instrument);
  }
}

function titleExistsInInstrumentFilter(title){
  for(var i = 0; i < instrumentFilters.length; i++){
    if(instrumentFilters[i].title === title){
      return true;
    }
  }

  return false;
}

function createFilterSelects(){
  createInvestigationFilterSelectList();
  createInstrumentsFilterSelectList();

  addInvestigationFilterSelectListener();
  addInstrumentFilterSelectListener();
}

function createInvestigationFilterSelectList(){
  $('#investigationSelect').find('option').remove();

  $('#investigationSelect').append('<option value="all">All</option>');
  for(var i = 0; i < investigationFilters.length; i++){
      $('#investigationSelect').append('<option value=' + investigationFilters[i].reference + '>' + investigationFilters[i].title + '</option>');
  }

  $('#investigationSelect').val('all');
  lastInvestigation = "all";
}

function createInstrumentsFilterSelectList(){
  $('#instrumentSelect').find('option').remove();

  $('#instrumentSelect').append('<option value="all">All</option>');
  for(var i = 0; i < instrumentFilters.length; i++){
      $('#instrumentSelect').append('<option value=' + instrumentFilters[i].reference + '>' + instrumentFilters[i].title + '</option>');
  }

  $('#instrumentSelect').val('all');
  lastInstrument = "all";
}

function addInvestigationFilterSelectListener(){
  $('#investigationSelect').on('change', function() {
    filterProducts(null, this.value);
  });
}

function addInstrumentFilterSelectListener(){
  $('#instrumentSelect').on('change', function() {
    filterProducts(this.value, null);
  });
}

function filterProducts(instrument, investigation){
  if(instrument === null){
    instrument = lastInstrument;
  }
  if(instrument === "all"){
    instrument = "null";
  }

  if(investigation === null){
    investigation = lastInvestigation;
  }
  if(investigation === "all"){
    investigation = "null";
  }

  lastInstrument = instrument;
  lastInvestigation = investigation;

  $.ajax({
      type: "GET",
      url: productsUrl + "/" + instrument + "/" + investigation,
      datatype: "json",
      success: function(data) {
        displayTrackingList(data);
      }
  });
}

function clearAddDeliveryForm(){
  $("#addDeliveryLogicalIdentifierInput")[0].value = "";
  $("#addDeliveryVersionInput")[0].value = "";
  $("#addDeliveryNameInput")[0].value = "";
  $("#addDeliveryStartDateInput")[0].value = "";
  $("#addDeliveryStopDateInput")[0].value = "";
  $("#addDeliverySourceInput")[0].value = "";
  $("#addDeliveryTargetInput")[0].value = "";
  $("#addDeliveryDueDateInput")[0].value = "";
}

function preFillAddDeliveryForm(){
  $("#addDeliveryLogicalIdentifierInput")[0].value = tableItemDetails.logicalIdentifier;
  $("#addDeliveryVersionInput")[0].value = tableItemDetails.dataVersion;
}

function disablePresetFormInputs(){
  $('#addDeliveryLogicalIdentifierInput').attr("readonly", true);
  $('#addDeliveryVersionInput').attr("readonly", true);
}

function enableFormInputs(){
  $('#addDeliveryLogicalIdentifierInput').attr("readonly", false);
  $('#addDeliveryVersionInput').attr("readonly", false);
}

function validateAddDeliveryForm() {
  var isFormValid = false;
  var isNameValid = validateAddDeliveryName();
	var isStartDateValid = validateAddDeliveryStartDate();
	var isStopDateValid = validateAddDeliveryStopDate();
	var isSourceValid = validateAddDeliverySource();
	var isTargetValid = validateAddDeliveryTarget();
	var isDueDateValid = validateAddDeliveryDueDate();

	if (!isNameValid || !isStartDateValid || !isStopDateValid  || !isSourceValid
			|| !isTargetValid || !isDueDateValid) {
		isFormValid = false;
	} else {
		isFormValid = true;
	}

	if (isFormValid) {
    return true;
	} else {
    return false;
	}
}

function validateAddDeliveryName() {
	var name = $('#addDeliveryNameInput').val();
	if (isValidString(name)) {
		setAddDeliveryNameToValid();
		return true;
	} else {
		setAddDeliveryNameToInvalid();
		return false;
	}
}

function validateAddDeliveryStartDate(){
  var dateTime = $("#addDeliveryStartDateInput").val();
	if (isValidDateTime(dateTime)) {
		setAddDeliveryStartDateToValid();
		return true;
	} else {
		setAddDeliveryStartDateToInvalid();
		return false;
	}
}

function validateAddDeliveryStopDate(){
  var dateTime = $("#addDeliveryStopDateInput").val();
	if (isValidDateTime(dateTime)) {
		setAddDeliveryStopDateToValid();
		return true;
	} else {
		setAddDeliveryStopDateToInvalid();
		return false;
	}
}

function validateAddDeliverySource() {
	var name = $('#addDeliverySourceInput').val();
	if (isValidString(name)) {
		setAddDeliverySourceToValid();
		return true;
	} else {
		setAddDeliverySourceToInvalid();
		return false;
	}
}

function validateAddDeliveryTarget() {
	var name = $('#addDeliveryTargetInput').val();
	if (isValidString(name)) {
		setAddDeliveryTargetToValid();
		return true;
	} else {
		setAddDeliveryTargetToInvalid();
		return false;
	}
}

function validateAddDeliveryDueDate(){
  var dateTime = $("#addDeliveryDueDateInput").val();
	if (isValidDate(dateTime)) {
		setAddDeliveryDueDateToValid();
		return true;
	} else {
		setAddDeliveryDueDateToInvalid();
		return false;
	}
}

function isValidString(input){
  var isValid = false;
  if(input.trim().length > 0 && input.trim().length < 255){
    return containsNumberOfWords(1, input);
  }
  return false;
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
  
  var has2Strings = containsNumberOfWords(2, input)

	return dateFormat && validDate && validTime && has2Strings;
}

function isValidDate(input) {
	// yyyy-mm-dd
	var stamp = input.split(" ");
	
	var dateFormat = /^\d{4}-\d{2}-\d{2}$/.test(stamp[0]);
  var validDate = !/Invalid|NaN/.test(new Date(stamp[0]).toString());
  
  var has1String = containsNumberOfWords(1, input)

	return dateFormat && validDate && has1String;
}

function containsNumberOfWords(number, input){
  input = input.replace(/(^\s*)|(\s*$)/gi,"");
  input = input.replace(/[ ]{2,}/gi," ");
  input = input.replace(/\n /,"\n");
  if (number === input.split(' ').length){
    return true;
  }
  return false;
}

function setAddDeliveryNameToValid() {
	$("#addDeliveryNameInputFormGroup").removeClass("has-error");

	$("#addDeliveryNameInputFormGroup").addClass("has-success");
	$("#addDeliveryNameInputHelpBlock").addClass("hidden");
}

function setAddDeliveryNameToInvalid() {
	$("#addDeliveryNameInputFormGroup").removeClass("has-success");
	$("#addDeliveryNameInputHelpBlock").removeClass("hidden");

	$("#addDeliveryNameInputFormGroup").addClass("has-error");
}

function setAddDeliveryStartDateToValid() {
	$("#addDeliveryStartDateInputFormGroup").removeClass("has-error");

	$("#addDeliveryStartDateInputFormGroup").addClass("has-success");
	$("#addDeliveryStartDateInputHelpBlock").addClass("hidden");
}

function setAddDeliveryStartDateToInvalid() {
	$("#addDeliveryStartDateInputFormGroup").removeClass("has-success");
	$("#addDeliveryStartDateInputHelpBlock").removeClass("hidden");

	$("#addDeliveryStartDateInputFormGroup").addClass("has-error");
}

function setAddDeliveryStopDateToValid() {
	$("#addDeliveryStopDateInputFormGroup").removeClass("has-error");

	$("#addDeliveryStopDateInputFormGroup").addClass("has-success");
	$("#addDeliveryStopDateInputHelpBlock").addClass("hidden");
}

function setAddDeliveryStopDateToInvalid() {
	$("#addDeliveryStopDateInputFormGroup").removeClass("has-success");
	$("#addDeliveryStopDateInputHelpBlock").removeClass("hidden");

	$("#addDeliveryStopDateInputFormGroup").addClass("has-error");
}

function setAddDeliverySourceToValid() {
	$("#addDeliverySourceInputFormGroup").removeClass("has-error");

	$("#addDeliverySourceInputFormGroup").addClass("has-success");
	$("#addDeliverySourceInputHelpBlock").addClass("hidden");
}

function setAddDeliverySourceToInvalid() {
	$("#addDeliverySourceInputFormGroup").removeClass("has-success");
	$("#addDeliverySourceInputHelpBlock").removeClass("hidden");

	$("#addDeliverySourceInputFormGroup").addClass("has-error");
}

function setAddDeliveryTargetToValid() {
	$("#addDeliveryTargetInputFormGroup").removeClass("has-error");

	$("#addDeliveryTargetInputFormGroup").addClass("has-success");
	$("#addDeliveryTargetInputHelpBlock").addClass("hidden");
}

function setAddDeliveryTargetToInvalid() {
	$("#addDeliveryTargetInputFormGroup").removeClass("has-success");
	$("#addDeliveryTargetInputHelpBlock").removeClass("hidden");

	$("#addDeliveryTargetInputFormGroup").addClass("has-error");
}

function setAddDeliveryDueDateToValid() {
	$("#addDeliveryDueDateInputFormGroup").removeClass("has-error");

	$("#addDeliveryDueDateInputFormGroup").addClass("has-success");
	$("#addDeliveryDueDateInputHelpBlock").addClass("hidden");
}

function setAddDeliveryDueDateToInvalid() {
	$("#addDeliveryDueDateInputFormGroup").removeClass("has-success");
	$("#addDeliveryDueDateInputHelpBlock").removeClass("hidden");

	$("#addDeliveryDueDateInputFormGroup").addClass("has-error");
}

function resetForm(){
  resetFormValidationMarkers();
  resetFormMessages();
}

function resetFormValidationMarkers(){
  $("#addDeliveryNameInputFormGroup").removeClass("has-error");
	$("#addDeliveryNameInputFormGroup").removeClass("has-success");
  $("#addDeliveryNameInputHelpBlock").addClass("hidden");
  
  $("#addDeliveryStartDateInputFormGroup").removeClass("has-error");
	$("#addDeliveryStartDateInputFormGroup").removeClass("has-success");
  $("#addDeliveryStartDateInputHelpBlock").addClass("hidden");
  
  $("#addDeliveryStopDateInputFormGroup").removeClass("has-error");
	$("#addDeliveryStopDateInputFormGroup").removeClass("has-success");
  $("#addDeliveryStopDateInputHelpBlock").addClass("hidden");
  
  $("#addDeliverySourceInputFormGroup").removeClass("has-error");
	$("#addDeliverySourceInputFormGroup").removeClass("has-success");
  $("#addDeliverySourceInputHelpBlock").addClass("hidden");
  
  $("#addDeliveryTargetInputFormGroup").removeClass("has-error");
	$("#addDeliveryTargetInputFormGroup").removeClass("has-success");
  $("#addDeliveryTargetInputHelpBlock").addClass("hidden");
  
  $("#addDeliveryDueDateInputFormGroup").removeClass("has-error");
	$("#addDeliveryDueDateInputFormGroup").removeClass("has-success");
	$("#addDeliveryDueDateInputHelpBlock").addClass("hidden");
}

function resetFormMessages(){
  $("#addDeliveryFormContainer").removeClass("hidden");
  $("#addDeliveryFormButtons").removeClass("hidden");
  
  $("#addDeliveryLoadingIcon").addClass("hidden");

  $("#addDeliveryFormCompleteMessage").addClass("hidden");
	$("#addDeliveryFormCompleteButtons").addClass("hidden");
}

function uploadNewDelivery(){
  hideAddDeliveryForm();
	showAddDeliveryFormLoadingIcon();

  $("input, textarea").each(function(){
    $(this).val($.trim($(this).val()));
  });

	var form = $('#addDeliveryForm');
  var serializedForm = form.serialize();
  
  $.ajax({
		type : "POST",
		url : addDeliveryUrl,
		data : serializedForm
	}).done(function(data) {
		hideAddDeliveryFormLoadingIcon();
    showAddDeliveryCompletedMessage();
    loadDeliveriesForProduct();
	}).fail(function(data) {
		hideAddDeliveryFormLoadingIcon();
    showAddDeliveryErrorMessage();
  });
}

function hideAddDeliveryForm() {
	$("#addDeliveryFormContainer").addClass("hidden");
	$("#addDeliveryFormButtons").addClass("hidden");
}

function showAddDeliveryFormLoadingIcon() {
	$("#addDeliveryLoadingIcon").removeClass("hidden");
}

function showAddDeliveryErrorMessage() {
	$("#addDeliveryFormCompleteMessage").removeClass("hidden");
	$("#addDeliveryFormCompleteButtons").removeClass("hidden");

	var errorHtml = '<div class="bg-danger"><p><b>Upload Error<b></p><p>There has been an error with your submission. Please try again.</p><p>If problems persist please contact the system administrator.</p>';
  $("#addDeliveryFormCompleteMessage").html(errorHtml);
}

function hideAddDeliveryFormLoadingIcon() {
	$("#addDeliveryLoadingIcon").addClass("hidden");
}

function showAddDeliveryCompletedMessage() {
	$("#addDeliveryFormCompleteMessage").removeClass("hidden");
	$("#addDeliveryFormCompleteButtons").removeClass("hidden");

	$("#addDeliveryFormCompleteMessage").html("Releases has been added.");
}

function showReferenceFilter(){
  $('#referenceFilterPanel').removeClass('hidden');
}

function hideReferenceFilter(){
  $('#referenceFilterPanel').addClass('hidden');
}