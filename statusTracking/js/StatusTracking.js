var productsUrl = "https://" + TrackingConts.server_host + "/services/tracking/json/products";
var archivestatusUrl = "https://" + TrackingConts.server_host + "/services/tracking/json/archivestatus";
var certificationstatusUrl = "https://" + TrackingConts.server_host + "/services/tracking/json/certificationstatus";
var nssdcastatusUrl = "https://" + TrackingConts.server_host + "/services/tracking/json/nssdcastatus";

var addAStatusUrl = "https://" + TrackingConts.server_host + "/services/tracking/json/archivestatus/add";
var addCStatusUrl = "https://" + TrackingConts.server_host + "/services/tracking/json/certificationstatus/add";
var addNssdcaUrl = "https://" + TrackingConts.server_host + "/services/tracking/json/nssdcastatus/add";

(function ($) {
    $( document ).ready(function() {
    	addAddAStatusModalListener();
    	addAddCStatusModalListener();
        addAddNssdcaModalListener();
        addProductsSeachListener();
    	
    	//Display the list of products with the latest of three types of status. 
    	setUpProductsList();
    	
    	//Return button
        $("#showProductStatusButton").on("click", function(){
        	setUpProductsList();
        });

       $( "#productStatusTable" ).on("click", ".listarchive", function() {
            var logicalIdentifier = $(this).data("id");
            var dataVersion = $(this).data("ver");
            //console.log("id: ", logicalIdentifier);
            //console.log("ver: ", dataVersion);
            showAStatusPage(logicalIdentifier, dataVersion)
        });
       $( "#productStatusTable" ).on("click", ".listcertification", function() {
           var logicalIdentifier = $(this).data("id");
           var dataVersion = $(this).data("ver");
           //console.log("id: ", logicalIdentifier);
           //console.log("ver: ", dataVersion);
           showCStatusPage(logicalIdentifier, dataVersion)
       });
       $( "#productStatusTable" ).on("click", ".listnssdca", function() {
           var logicalIdentifier = $(this).data("id");
           var dataVersion = $(this).data("ver");
           //console.log("id: ", logicalIdentifier);
           //console.log("ver: ", dataVersion);
           showNssdcaPage(logicalIdentifier, dataVersion)
       });
    });
})(jQuery);

function init(){
}

function setUpProductsList(){
  $("#productStatusTable").empty();

  $.ajax({
      type: "GET",
      url: productsUrl + "/prod-with-status",
      datatype: "json",
      success: function(data) {
        displayProductList(data);
      }
  });
}

function displayProductList(json){
    $("#productStatusTable").empty();
    showProductStatusTable();

    json = json.products;

    if (json){
      if(json.length > 0){
    	console.log("Number of Products JSON", json.length);
        var table = $('<table></table>').addClass('table table-hover');
        var thead = $('<thead><tr><th>Title<br/><span style="font-weight:normal">Logical Identifier::version</span</th><th>Archive</th><th>Certification</th><th>NSSDCA</th></tr></thead>');
        var tbody = $('<tbody></tbody');
        for(i=0; i<json.length; i++){
            //console.log("JSON", json[i]);
            
            var title = json[i].title;
            var id = json[i].logical_identifier;
            var ver = json[i].version_id;
            
            var archive = json[i].astatus;
            var certification = json[i].cstatus;
            var nssdca = json[i].nssdca;
            
            
            var archiveLink = "<td><button type=\"button\" class=\"btn btn-success\" data-toggle=\"modal\" data-target=\"#addAStatusModal\"" 
                + " data-id=\"" + id + "\""
                + " data-ver=\"" + ver + "\""
                + ">Add</button></td>";
            if (archive != null && archive.length > 0){
	            archiveLink = "<td><a class=\"listarchive\""
	            	+ " data-id=\"" + id + "\""
	            	+ " data-ver=\"" + ver + "\">"
	            	+ archive + "</a></td>";
	        }
            var certificationLink = "<td><button type=\"button\" class=\"btn btn-success\" data-toggle=\"modal\" data-target=\"#addCStatusModal\"" 
                + " data-id=\"" + id + "\""
                + " data-ver=\"" + ver + "\""
                + ">Add</button></td>";
            if (certification != null && certification.length > 0){
            	certificationLink = "<td><a class=\"listcertification\""
	            	+ " data-id=\"" + id + "\""
	            	+ " data-ver=\"" + ver + "\">"
	            	+ certification + "</a></td>";
	        }
            var nssdcaLink = "<td><button type=\"button\" class=\"btn btn-success\" data-toggle=\"modal\" data-target=\"#addNssdcaModal\"" 
                + " data-id=\"" + id + "\""
                + " data-ver=\"" + ver + "\""
                + ">Add</button></td>";
            if (nssdca != null && nssdca.length > 0){
            	nssdcaLink = "<td><a class=\"listnssdca\""
	            	+ " data-id=\"" + id + "\""
	            	+ " data-ver=\"" + ver + "\">"
	            	+ nssdca + "</a></td>";
	        }
            
            var row = $('<tr>' +
            			'<td><b>' + title + '</b><br/>' + id + '::' + ver + '</td>' +
            			archiveLink +
            			certificationLink +
            			nssdcaLink +
                        '</tr>');
            tbody.append(row);
        }

        table.append(thead);
        table.append(tbody);

        $('#productStatusTable').append(table);
      }
    }
}
function showProductStatusTable(){
  $("#searchDiv").removeClass("hidden");
  $("#prodSearchInput").val('');
  $("#productStatusTable").removeClass("hidden");
  
  $("#astatusTable").addClass("hidden");
  $("#cstatusTable").addClass("hidden");
  $("#nssdcaTable").addClass("hidden");
  $("#showProductStatusButton").addClass("hidden");
}

//========================== Archive Status ======================
function addAddAStatusModalListener(){
	
	$('#addAStatusModal').on('show.bs.modal', function (event) {

		//set values of id and ver to the form
		var id = $(event.relatedTarget).data('id');
		var ver = $(event.relatedTarget).data('ver');
		$(this).find('#addAStatusLogicalIdentifierInput').val(id);
		$(this).find('#addAStatusVersionInput').val(ver);
				
		//Validation Listener 
		createAddAStatusModalValidationListener();
	});
	
	//Clear AddAStatusModal on Close
	$(document).on('hide.bs.modal','#addAStatusModal', function () {		
	    //back to AStatus page, need id and ver
	    var logicalIdentifier = $('#addAStatusLogicalIdentifierInput').val();
	    var version = $("#addAStatusVersionInput").val();
	    // Clear Modal and show the status page
	    clearAddAStatusModal();
	    showAStatusPage(logicalIdentifier,version);
	});
	
	$("#addAStatusModalAddButton").on("click", function(){
		uploadNewAStatus();
	});
}

function clearAddAStatusModal(){
  $("#addAStatusLogicalIdentifierInput").val('');
  $("#addAStatusVersionInput").val('');
  $("#addAStatusStatusInput").val('');
  $("#addAStatusEmailInput").val('');
  $("#addAStatusCommentInput").val('');


  $("#addAStatusLogicalIdentifierFormGroup").removeClass("has-success");
  $("#addAStatusLogicalIdentifierFormGroup").removeClass("has-error");
  $("#addAStatusLogicalIdentifierInputHelpBlock").addClass("hidden");

  $("#addAStatusVersionFormGroup").removeClass("has-success");
  $("#addAStatusVersionFormGroup").removeClass("has-error");
  $("#addAStatusVersionInputHelpBlock").addClass("hidden");

  $("#addAStatusStatusInputFormGroup").removeClass("has-success");
  $("#addAStatusStatusInputFormGroup").removeClass("has-error");
  $("#addAStatusStatusInputHelpBlock").addClass("hidden");

  $("#addAStatusEmailInputFormGroup").removeClass("has-success");
  $("#addAStatusEmailInputFormGroup").removeClass("has-error");
  $("#addAStatusEmailInputHelpBlock").addClass("hidden");

  $("#addAStatusCommentInputFormGroup").removeClass("has-success");
  $("#addAStatusCommentInputFormGroup").removeClass("has-error");
  $("#addAStatusCommentInputHelpBlock").addClass("hidden");

  $("#addAStatusModalAddButtonDisabled").removeClass("hidden");
  $("#addAStatusModalAddButton").addClass("hidden");

  $("#addAStatusFormContainer").removeClass("hidden");
  $("#addAStatusFormButtons").removeClass("hidden");

  $("#addAStatusFormCompleteMessage").addClass("hidden");
  $("#addAStatusFormCompleteButtons").addClass("hidden");
  $("#addAStatusLoadingIcon").addClass("hidden");
}

function showAStatusPage(id, ver){
	$("#astatusTable").empty();
	//console.log("receved id to get status list", id);
    //console.log("receved  to get status list", ver);
	$.ajax({
        type: "GET",
        url: archivestatusUrl + "/" + id + "/" + ver + "/false",
        datatype: "json",
        success: function(data) {
        	displayArchiveList(data, id, ver);
        }
    });
}
// ###### Validation
function createAddAStatusModalValidationListener(){
  $("#addAStatusStatusInput").on("propertychange change click keyup input paste", validateAddAStatusForm);
  $("#addAStatusEmailInput").on("propertychange change click keyup input paste", validateAddAStatusForm);
  $("#addAStatusCommentInput").on("propertychange change click keyup input paste", validateAddAStatusForm);
}

function validateAddAStatusForm(){
  var isFormValid = false;
  var isStatusValid = validateAddAStatusStatus();
  var isEmailValid = validateAddAStatusEmail();
  var isCommentValid = validateAddAStatusComment();

  if(!isStatusValid ||
    !isEmailValid ||
    !isCommentValid){
      isFormValid = false;
  }
  else{
    isFormValid = true;
  }

  if(isFormValid){
	  showAddAStatusButton();
  }
  else{
	  hideAddAStatusButton();
  }
}
function validateAddAStatusEmail(){
  var email = $("#addAStatusEmailInput").val();
  if(isValidEmail(email)){
    setAddAStatusEmailToValid();
    return true;
  }
  else{
    setAddAStatusEmailToInvalid();
    return false;
  }
}

function validateAddAStatusStatus(){
  var status = $('#addAStatusStatusInput').val();
  if((status.trim().length > 0 && status.trim().length < 255)){
    setAddAStatusStatusToValid();
    return true;
  }
  else{
    setAddAStatusStatusToInvalid();
    return false;
  }
}

function validateAddAStatusComment(){
  var comment = $('#addAStatusCommentInput').val();
  if(comment.trim().length == 0 || (comment.trim().length > 0 && comment.trim().length < 1024)){
    setAddAStatusCommentToValid();
    return true;
  }
  else{
    setAddAStatusCommentToInvalid();
    return false;
  }
}
function showAddAStatusButton(){
  $("#addAStatusModalAddButtonDisabled").addClass("hidden");
  $("#addAStatusModalAddButton").removeClass("hidden");
}

function hideAddAStatusButton(){
  $("#addAStatusModalAddButtonDisabled").removeClass("hidden");
  $("#addAStatusModalAddButton").addClass("hidden");
}

function setAddAStatusEmailToValid(){
  $("#addAStatusEmailInputFormGroup").removeClass("has-error");

  $("#addAStatusEmailInputFormGroup").addClass("has-success");
  $("#addAStatusEmailInputHelpBlock").addClass("hidden");
}

function setAddAStatusEmailToInvalid(){
  $("#addAStatusEmailInputFormGroup").removeClass("has-success");
  $("#addAStatusEmailInputHelpBlock").removeClass("hidden");

  $("#addAStatusEmailInputFormGroup").addClass("has-error");
}

function setAddAStatusStatusToValid(){
  $("#addAStatusStatusInputFormGroup").removeClass("has-error");

  $("#addAStatusStatusInputFormGroup").addClass("has-success");
  $("#addAStatusStatusInputHelpBlock").addClass("hidden");
}

function setAddAStatusStatusToInvalid(){
  $("#addAStatusStatusInputFormGroup").removeClass("has-success");
  $("#addAStatusStatusInputHelpBlock").removeClass("hidden");

  $("#addAStatusStatusInputFormGroup").addClass("has-error");
}
	
function setAddAStatusCommentToValid(){
  $("#addAStatusCommentInputFormGroup").removeClass("has-error");

  $("#addAStatusCommentInputFormGroup").addClass("has-success");
  $("#addAStatusCommentInputHelpBlock").addClass("hidden");
}

function setAddAStatusCommentToInvalid(){
  $("#addAStatusCommentInputFormGroup").removeClass("has-success");
  $("#addAStatusCommentInputHelpBlock").removeClass("hidden");

  $("#addAStatusCommentInputFormGroup").addClass("has-error");
}

// ##### End Validation

function uploadNewAStatus(){
	
	hideAddAStatusForm();
	showAddAStatusFormLoadingIcon();

	  var formData = new FormData();
	  var logicalIdentifier = $('#addAStatusLogicalIdentifierInput').val();
	  var version = $("#addAStatusVersionInput").val();
	  var status = $("#addAStatusStatusInput").val();
	  var email = $("#addAStatusEmailInput").val();
	  var comment = $('#addAStatusCommentInput').val();
	
	  console.log("submit logicalIdentifier", logicalIdentifier);
	  console.log("submit version", version);
	  console.log("submit status", status);
	  console.log("submit email", email);
	  console.log("submit comment", comment);
	
	  var form = $('#addAStatusForm');
	  var serializedForm = form.serialize();
	  //console.log("serializedForm", serializedForm);
	  //console.log("form", form);
	
	$.ajax({
	      type: "POST",
		  url: addAStatusUrl,
		  data: serializedForm
	}).done(function(data) {
		hideAddAStatusFormLoadingIcon();
		showAddAStatusCompletedMessage();
	}).fail(function(data) {
		hideAddAStatusFormLoadingIcon();
		showAddAStatusErrorMessage(jqXHR, textStatus, error);
	});
}

function hideAddAStatusForm(){
  $("#addAStatusFormContainer").addClass("hidden");
  $("#addAStatusFormButtons").addClass("hidden");
}

function showAddAStatusFormLoadingIcon(){
  $("#addAStatusLoadingIcon").removeClass("hidden");
}

function hideAddAStatusFormLoadingIcon(){
  $("#addAStatusLoadingIcon").addClass("hidden");
}

function showAddAStatusErrorMessage(jqXHR, textStatus, error){
  $("#addAStatusFormCompleteMessage").removeClass("hidden");
  $("#addAStatusFormCompleteButtons").removeClass("hidden");

  var errorHtml = '<div class="bg-danger"><p><b>Upload Error<b></p><p>There has been an error with your submission. Please try again.</p><p>If problems persist please contact the system administrator.</p>';
  //errorHtml = errorHtml + jqXHR.responseText;
  $("#addAStatusFormCompleteMessage").html(errorHtml);
}

function showAddAStatusCompletedMessage(){
  $("#addAStatusFormCompleteMessage").removeClass("hidden");
  $("#addAStatusFormCompleteButtons").removeClass("hidden");

  $("#addAStatusFormCompleteMessage").html("Archive Status has been added.");
}

function displayArchiveList(json, id, ver){
  $("#astatusTable").empty();
  showAStatusTable();
  
  //console.log("id for display status list", id);
  //console.log("ver for display  status list", ver);
  json = json["Archive Status"];
  if (json){
    if(json.length > 0){
    	var idJson = json[0].logical_identifier;
    	var verJson = json[0].version_id;

      var table = $('<table></table>').addClass('table table-hover');
      var addButton = $('<thead><tr><th colspan="4">' + 
    		  			'<button id="showAStatusModalButton" type="button" class="btn btn-success" data-toggle="modal" data-target="#addAStatusModal"' + 
    		  			' data-id="' + idJson + '"' + 
    		  			' data-ver="' + verJson + '"> Add </button></th></tr></thead>');
      var subTitle = $('<thead><tr><th colspan="4">Archive Status<br>' + idJson + '::'+ verJson + '</th></tr></thead>');
      var thead = $('<thead><tr>' +
    		  '<th>Status</th>' + 
    		  '<th>Status Date Time</th>' + 
    		  '<th>Email</th>' + 
    		  '<th>Comment</th>' +
    		  '</tr></thead>');

      var tbody = $('<tbody></tbody');
      for(i=0; i<json.length; i++){
    	  //console.log("JSON Archive Status: ", json[i]);
          var row = $('<tr>' +
                      '<td>' + json[i].status + '</td>' +
                      '<td>' + json[i].status_date_time + '</td>' +
                      '<td>' + json[i].electronic_mail_address + '</td>' +
                      '<td>' + json[i].comment + '</td>' +
                      '</tr>');
          tbody.append(row);
      }

      table.append(subTitle);      
      table.append(addButton);
      table.append(thead);
      table.append(tbody);
      
      $('#astatusTable').append(table);
    }   
  }
  else{
  	  /*var tableNonStatus = $('<table></table>').addClass('table table-hover');
      var subTitle = $('<thead><tr><th colspan="4">Archive Status<br>' + id + '::'+ ver + '</th></tr></thead>')
      var tbody = $('<tbody><tr><td>Cancelled Add Archive Status</td></tr></tbody');

      tableNonStatus.append(subTitle);
      tableNonStatus.append(tbody);
      
      $('#astatusTable').append(tableNonStatus);*/
	  setUpProductsList();
  }
}

function showAStatusTable(){
  $("#astatusTable").removeClass("hidden");
  $("#showProductStatusButton").removeClass("hidden");
  $("#searchDiv").addClass("hidden");
  $("#productStatusTable").addClass("hidden");
}

//========================== End Archive Status ======================


//========================== Certification Status ======================
function addAddCStatusModalListener(){
	
	$('#addCStatusModal').on('show.bs.modal', function (event) {

		//set values of id and ver to the form
		var id = $(event.relatedTarget).data('id');
		var ver = $(event.relatedTarget).data('ver');
		$(this).find('#addCStatusLogicalIdentifierInput').val(id);
		$(this).find('#addCStatusVersionInput').val(ver);
		
		//Validation Listener 
		createAddCStatusModalValidationListener();
		
	});
	//Clear AddCStatusModal on Close
	$(document).on('hide.bs.modal','#addCStatusModal', function () {
		//back to AStatus page, need id and ver
	    var logicalIdentifier = $('#addCStatusLogicalIdentifierInput').val();
	    var version = $("#addCStatusVersionInput").val();
		// Clear Modal
	    clearAddCStatusModal();
	    showCStatusPage(logicalIdentifier,version);
	});
	// Add CStatusModal Add Button Listener
	$("#addCStatusModalAddButton").on("click", function(){
		uploadNewCStatus();
	});
}

function clearAddCStatusModal(){
  $("#addCStatusLogicalIdentifierInput").val('');
  $("#addCStatusVersionInput").val('');
  $("#addCStatusStatusInput").val('');
  $("#addCStatusEmailInput").val('');
  $("#addCStatusCommentInput").val('');


  $("#addCStatusLogicalIdentifierFormGroup").removeClass("has-success");
  $("#addCStatusLogicalIdentifierFormGroup").removeClass("has-error");
  $("#addCStatusLogicalIdentifierInputHelpBlock").addClass("hidden");

  $("#addCStatusVersionFormGroup").removeClass("has-success");
  $("#addCStatusVersionFormGroup").removeClass("has-error");
  $("#addCStatusVersionInputHelpBlock").addClass("hidden");

  $("#addCStatusStatusInputFormGroup").removeClass("has-success");
  $("#addCStatusStatusInputFormGroup").removeClass("has-error");
  $("#addCStatusStatusInputHelpBlock").addClass("hidden");

  $("#addCStatusEmailInputFormGroup").removeClass("has-success");
  $("#addCStatusEmailInputFormGroup").removeClass("has-error");
  $("#addCStatusEmailInputHelpBlock").addClass("hidden");

  $("#addCStatusCommentInputFormGroup").removeClass("has-success");
  $("#addCStatusCommentInputFormGroup").removeClass("has-error");
  $("#addCStatusCommentInputHelpBlock").addClass("hidden");

  $("#addCStatusModalAddButtonDisabled").removeClass("hidden");
  $("#addCStatusModalAddButton").addClass("hidden");

  $("#addCStatusFormContainer").removeClass("hidden");
  $("#addCStatusFormButtons").removeClass("hidden");

  $("#addCStatusFormCompleteMessage").addClass("hidden");
  $("#addCStatusFormCompleteButtons").addClass("hidden");
  $("#addCStatusLoadingIcon").addClass("hidden");
}

function showCStatusPage(id, ver){
	$("#cstatusTable").empty();
	
	$.ajax({
        type: "GET",
        url: certificationstatusUrl + "/" + id + "/" + ver + "/false",
        datatype: "json",
        success: function(data) {
        	displayCertificationList(data, id, ver);
        }
    });
}
// ###### Validation
function createAddCStatusModalValidationListener(){
  $("#addCStatusStatusInput").on("propertychange change click keyup input paste", validateAddCStatusForm);
  $("#addCStatusEmailInput").on("propertychange change click keyup input paste", validateAddCStatusForm);
  $("#addCStatusCommentInput").on("propertychange change click keyup input paste", validateAddCStatusForm);
}

function validateAddCStatusForm(){
  var isFormValid = false;
  var isStatusValid = validateAddCStatusStatus();
  var isEmailValid = validateAddCStatusEmail();
  var isCommentValid = validateAddCStatusComment();

  if(!isStatusValid ||
    !isEmailValid ||
    !isCommentValid){
      isFormValid = false;
  }
  else{
    isFormValid = true;
  }

  if(isFormValid){
	  showAddCStatusButton();
  }
  else{
	  hideAddCStatusButton();
  }
}
function validateAddCStatusEmail(){
  var email = $("#addCStatusEmailInput").val();
  if(isValidEmail(email)){
    setAddCStatusEmailToValid();
    return true;
  }
  else{
    setAddCStatusEmailToInvalid();
    return false;
  }
}

function validateAddCStatusStatus(){
  var status = $('#addCStatusStatusInput').val();
  if((status.trim().length > 0 && status.trim().length < 255)){
    setAddCStatusStatusToValid();
    return true;
  }
  else{
    setAddCStatusStatusToInvalid();
    return false;
  }
}

function validateAddCStatusComment(){
  var comment = $('#addCStatusCommentInput').val();
  if(comment.trim().length == 0 || (comment.trim().length > 0 && comment.trim().length < 1024)){
    setAddCStatusCommentToValid();
    return true;
  }
  else{
    setAddCStatusCommentToInvalid();
    return false;
  }
}
function showAddCStatusButton(){
  $("#addCStatusModalAddButtonDisabled").addClass("hidden");
  $("#addCStatusModalAddButton").removeClass("hidden");
}

function hideAddCStatusButton(){
  $("#addCStatusModalAddButtonDisabled").removeClass("hidden");
  $("#addCStatusModalAddButton").addClass("hidden");
}

function setAddCStatusEmailToValid(){
  $("#addCStatusEmailInputFormGroup").removeClass("has-error");

  $("#addCStatusEmailInputFormGroup").addClass("has-success");
  $("#addCStatusEmailInputHelpBlock").addClass("hidden");
}

function setAddCStatusEmailToInvalid(){
  $("#addCStatusEmailInputFormGroup").removeClass("has-success");
  $("#addCStatusEmailInputHelpBlock").removeClass("hidden");

  $("#addCStatusEmailInputFormGroup").addClass("has-error");
}

function setAddCStatusStatusToValid(){
  $("#addCStatusStatusInputFormGroup").removeClass("has-error");

  $("#addCStatusStatusInputFormGroup").addClass("has-success");
  $("#addCStatusStatusInputHelpBlock").addClass("hidden");
}

function setAddCStatusStatusToInvalid(){
  $("#addCStatusStatusInputFormGroup").removeClass("has-success");
  $("#addCStatusStatusInputHelpBlock").removeClass("hidden");

  $("#addCStatusStatusInputFormGroup").addClass("has-error");
}
	
function setAddCStatusCommentToValid(){
  $("#addCStatusCommentInputFormGroup").removeClass("has-error");

  $("#addCStatusCommentInputFormGroup").addClass("has-success");
  $("#addCStatusCommentInputHelpBlock").addClass("hidden");
}

function setAddCStatusCommentToInvalid(){
  $("#addCStatusCommentInputFormGroup").removeClass("has-success");
  $("#addCStatusCommentInputHelpBlock").removeClass("hidden");

  $("#addCStatusCommentInputFormGroup").addClass("has-error");
}

// ##### End Validation

function uploadNewCStatus(){
	
	hideAddCStatusForm();
	showAddCStatusFormLoadingIcon();

	  var formData = new FormData();
	  var logicalIdentifier = $('#addCStatusLogicalIdentifierInput').val();
	  var version = $("#addCStatusVersionInput").val();
	  var status = $("#addCStatusStatusInput").val();
	  var email = $("#addCStatusEmailInput").val();
	  var comment = $('#addCStatusCommentInput').val();
	
	  console.log("submit logicalIdentifier", logicalIdentifier);
	  console.log("submit version", version);
	  console.log("submit status", status);
	  console.log("submit email", email);
	  console.log("submit comment", comment);
	
	  var form = $('#addCStatusForm');
	  var serializedForm = form.serialize();
	  //console.log("serializedForm", serializedForm);
	  //console.log("form", form);
	
	$.ajax({
	      type: "POST",
		  url: addCStatusUrl,
		  data: serializedForm
	}).done(function(data) {
		hideAddCStatusFormLoadingIcon();
		showAddCStatusCompletedMessage();
	}).fail(function(data) {
		hideAddCStatusFormLoadingIcon();
		showAddCStatusErrorMessage(jqXHR, textStatus, error);
	});
}

function hideAddCStatusForm(){
  $("#addCStatusFormContainer").addClass("hidden");
  $("#addCStatusFormButtons").addClass("hidden");
}

function showAddCStatusFormLoadingIcon(){
  $("#addCStatusLoadingIcon").removeClass("hidden");
}

function hideAddCStatusFormLoadingIcon(){
  $("#addCStatusLoadingIcon").addClass("hidden");
}

function showAddCStatusErrorMessage(jqXHR, textStatus, error){
  $("#addCStatusFormCompleteMessage").removeClass("hidden");
  $("#addCStatusFormCompleteButtons").removeClass("hidden");

  var errorHtml = '<div class="bg-danger"><p><b>Upload Error<b></p><p>There has been an error with your submission. Please try again.</p><p>If problems persist please contact the system administrator.</p>';
  //errorHtml = errorHtml + jqXHR.responseText;
  $("#addCStatusFormCompleteMessage").html(errorHtml);
}

function showAddCStatusCompletedMessage(){
  $("#addCStatusFormCompleteMessage").removeClass("hidden");
  $("#addCStatusFormCompleteButtons").removeClass("hidden");

  $("#addCStatusFormCompleteMessage").html("Certification Status has been added.");
}

function displayCertificationList(json, id, ver){
  $("#cstatusTable").empty();
  showCStatusTable();

  json = json["Certification Status"];
  if (json){
    if(json.length > 0){
    	var idJson = json[0].logical_identifier;
    	var verJson = json[0].version_id;
    	
      var table = $('<table></table>').addClass('table table-hover');
      var addButton = $('<thead><tr><th colspan="4">' + 
    		  			'<button id="showCStatusModalButton" type="button" class="btn btn-success" data-toggle="modal" data-target="#addCStatusModal"' + 
    		  			' data-id="' + idJson + '"' + 
    		  			' data-ver="' + verJson + '"> Add </button></th></tr></thead>');
      var subTitle = $('<thead><tr><th colspan="4">Certification Status<br>' + idJson + '::'+ verJson + '</th></tr></thead>');
      var thead = $('<thead><tr>' +
    		  '<th>Status</th>' + 
    		  '<th>Status Date Time</th>' + 
    		  '<th>Email</th>' + 
    		  '<th>Comment</th>' +
    		  '</tr></thead>');

      var tbody = $('<tbody></tbody');
      for(i=0; i<json.length; i++){
    	  //console.log("JSON Certification Status: ", json[i]);
          var row = $('<tr>' +
                      '<td>' + json[i].status + '</td>' +
                      '<td>' + json[i].status_date_time + '</td>' +
                      '<td>' + json[i].electronic_mail_address + '</td>' +
                      '<td>' + json[i].comment + '</td>' +
                      '</tr>');
          tbody.append(row);
      }

      table.append(subTitle);      
      table.append(addButton);
      table.append(thead);
      table.append(tbody);
      
      $('#cstatusTable').append(table);
    }   
  }
  else{
  	/*var tableNonStatus = $('<table></table>').addClass('table table-hover');
      var subTitle = $('<thead><tr><th colspan="4">Certification Status<br>' + id + '::'+ ver + '</th></tr></thead>')

      var tbody = $('<tbody><tr><td>Cancelled Add Certification Status</tr></td></tbody');

      tableNonStatus.append(subTitle);
      tableNonStatus.append(tbody);
      
      $('#cstatusTable').append(tableNonStatus);*/
	  setUpProductsList();
  }
}

function showCStatusTable(){
  $("#cstatusTable").removeClass("hidden");
  $("#showProductStatusButton").removeClass("hidden");
  $("#searchDiv").addClass("hidden");
  $("#productStatusTable").addClass("hidden");
}

//========================== End Certification Status ======================

//========================== NSSDCA ======================
function addAddNssdcaModalListener(){
	
	$('#addNssdcaModal').on('show.bs.modal', function (event) {

		//set values of id and ver to the form
		var id = $(event.relatedTarget).data('id');
		var ver = $(event.relatedTarget).data('ver');
		$(this).find('#addNssdcaLogicalIdentifierInput').val(id);
		$(this).find('#addNssdcaVersionInput').val(ver);		
		//Validation Listener 
		createAddNssdcaModalValidationListener();
		
	});
	//Clear AddNssdcaModal on Close
	$(document).on('hide.bs.modal','#addNssdcaModal', function () {
		//back to Nssdca page, need id and ver
		var logicalIdentifier = $('#addNssdcaLogicalIdentifierInput').val();
		var version = $("#addNssdcaVersionInput").val();
		// Clear Modal
	    clearAddNssdcaModal();
	    
	    showNssdcaPage(logicalIdentifier,version);
	});
	// Add NssdcaModal Add Button Listener
	$("#addNssdcaModalAddButton").on("click", function(){
		uploadNewNssdca();
	});
}

function clearAddNssdcaModal(){
  $("#addNssdcaLogicalIdentifierInput").val('');
  $("#addNssdcaVersionInput").val('');
  $("#addNssdcaIdentifierInput").val('');
  $("#addNssdcaEmailInput").val('');
  $("#addNssdcaCommentInput").val('');


  $("#addNssdcaLogicalIdentifierFormGroup").removeClass("has-success");
  $("#addNssdcaLogicalIdentifierFormGroup").removeClass("has-error");
  $("#addNssdcaLogicalIdentifierInputHelpBlock").addClass("hidden");

  $("#addNssdcaVersionFormGroup").removeClass("has-success");
  $("#addNssdcaVersionFormGroup").removeClass("has-error");
  $("#addNssdcaVersionInputHelpBlock").addClass("hidden");

  $("#addNssdcaIdentifierInputFormGroup").removeClass("has-success");
  $("#addNssdcaIdentifierInputFormGroup").removeClass("has-error");
  $("#addNssdcaIdentifierInputHelpBlock").addClass("hidden");

  $("#addNssdcaEmailInputFormGroup").removeClass("has-success");
  $("#addNssdcaEmailInputFormGroup").removeClass("has-error");
  $("#addNssdcaEmailInputHelpBlock").addClass("hidden");

  $("#addNssdcaCommentInputFormGroup").removeClass("has-success");
  $("#addNssdcaCommentInputFormGroup").removeClass("has-error");
  $("#addNssdcaCommentInputHelpBlock").addClass("hidden");

  $("#addNssdcaModalAddButtonDisabled").removeClass("hidden");
  $("#addNssdcaModalAddButton").addClass("hidden");

  $("#addNssdcaFormContainer").removeClass("hidden");
  $("#addNssdcaFormButtons").removeClass("hidden");

  $("#addNssdcaFormCompleteMessage").addClass("hidden");
  $("#addNssdcaFormCompleteButtons").addClass("hidden");
  $("#addNssdcaLoadingIcon").addClass("hidden");
}

function showNssdcaPage(id, ver){
	$("#nssdcaTable").empty();
	
	$.ajax({
        type: "GET",
        url: nssdcastatusUrl + "/" + id + "/" + ver,
        datatype: "json",
        success: function(data) {
        	displayNssdcaList(data, id, ver);
        }
    });
}
// ###### Validation
function createAddNssdcaModalValidationListener(){
  $("#addNssdcaIdentifierInput").on("propertychange change click keyup input paste", validateAddNssdcaForm);
  $("#addNssdcaEmailInput").on("propertychange change click keyup input paste", validateAddNssdcaForm);
  $("#addNssdcaCommentInput").on("propertychange change click keyup input paste", validateAddNssdcaForm);
}

function validateAddNssdcaForm(){
  var isFormValid = false;
  var isStatusValid = validateAddNssdca();
  var isEmailValid = validateAddNssdcaEmail();
  var isCommentValid = validateAddNssdcaComment();

  if(!isStatusValid ||
    !isEmailValid ||
    !isCommentValid){
      isFormValid = false;
  }
  else{
    isFormValid = true;
  }

  if(isFormValid){
	  showAddNssdcaButton();
  }
  else{
	  hideAddNssdcaButton();
  }
}
function validateAddNssdcaEmail(){
  var email = $("#addNssdcaEmailInput").val();
  if(isValidEmail(email)){
    setAddNssdcaEmailToValid();
    return true;
  }
  else{
    setAddNssdcaEmailToInvalid();
    return false;
  }
}

function validateAddNssdca(){
  var nssdca = $('#addNssdcaIdentifierInput').val();
  if((nssdca.trim().length > 0 && nssdca.trim().length < 255)){
    setAddNssdcaToValid();
    return true;
  }
  else{
    setAddNssdcaToInvalid();
    return false;
  }
}

function validateAddNssdcaComment(){
  var comment = $('#addNssdcaCommentInput').val();
  if(comment.trim().length == 0 || (comment.trim().length > 0 && comment.trim().length < 1024)){
    setAddNssdcaCommentToValid();
    return true;
  }
  else{
    setAddNssdcaCommentToInvalid();
    return false;
  }
}
function showAddNssdcaButton(){
  $("#addNssdcaModalAddButtonDisabled").addClass("hidden");
  $("#addNssdcaModalAddButton").removeClass("hidden");
}

function hideAddNssdcaButton(){
  $("#addNssdcaModalAddButtonDisabled").removeClass("hidden");
  $("#addNssdcaModalAddButton").addClass("hidden");
}

function setAddNssdcaEmailToValid(){
  $("#addNssdcaEmailInputFormGroup").removeClass("has-error");

  $("#addNssdcaEmailInputFormGroup").addClass("has-success");
  $("#addNssdcaEmailInputHelpBlock").addClass("hidden");
}

function setAddNssdcaEmailToInvalid(){
  $("#addNssdcaEmailInputFormGroup").removeClass("has-success");
  $("#addNssdcaEmailInputHelpBlock").removeClass("hidden");

  $("#addNssdcaEmailInputFormGroup").addClass("has-error");
}

function setAddNssdcaToValid(){
  $("#addNssdcaIdentifierInputFormGroup").removeClass("has-error");

  $("#addNssdcaIdentifierInputFormGroup").addClass("has-success");
  $("#addNssdcaIdentifierInputHelpBlock").addClass("hidden");
}

function setAddNssdcaToInvalid(){
  $("#addNssdcaIdentifierInputFormGroup").removeClass("has-success");
  $("#addNssdcaIdentifierInputHelpBlock").removeClass("hidden");

  $("#addNssdcaIdentifierInputFormGroup").addClass("has-error");
}
	
function setAddNssdcaCommentToValid(){
  $("#addNssdcaCommentInputFormGroup").removeClass("has-error");

  $("#addNssdcaCommentInputFormGroup").addClass("has-success");
  $("#addNssdcaCommentInputHelpBlock").addClass("hidden");
}

function setAddNssdcaCommentToInvalid(){
  $("#addNssdcaCommentInputFormGroup").removeClass("has-success");
  $("#addNssdcaCommentInputHelpBlock").removeClass("hidden");

  $("#addNssdcaCommentInputFormGroup").addClass("has-error");
}

// ##### End Validation

function uploadNewNssdca(){
	
	hideAddNssdcaForm();
	showAddNssdcaFormLoadingIcon();

	  var formData = new FormData();
	  var logicalIdentifier = $('#addNssdcaLogicalIdentifierInput').val();
	  var version = $("#addNssdcaVersionInput").val();
	  var nssdca = $("#addNssdcaIdentifierInput").val();
	  var email = $("#addNssdcaEmailInput").val();
	  var comment = $('#addNssdcaCommentInput').val();
	
	  console.log("submit logicalIdentifier", logicalIdentifier);
	  console.log("submit version", version);
	  console.log("submit nssdca", nssdca);
	  console.log("submit email", email);
	  console.log("submit comment", comment);
	
	  var form = $('#addNssdcaForm');
	  var serializedForm = form.serialize();
	  //console.log("serializedForm", serializedForm);
	  //console.log("form", form);
	
	$.ajax({
	      type: "POST",
		  url: addNssdcaUrl,
		  data: serializedForm
	}).done(function(data) {
		hideAddNssdcaFormLoadingIcon();
		showAddNssdcaCompletedMessage();
	}).fail(function(data) {
		hideAddNssdcaFormLoadingIcon();
		showAddNssdcaErrorMessage(jqXHR, textStatus, error);
	});
}

function hideAddNssdcaForm(){
  $("#addNssdcaFormContainer").addClass("hidden");
  $("#addNssdcaFormButtons").addClass("hidden");
}

function showAddNssdcaFormLoadingIcon(){
  $("#addNssdcaLoadingIcon").removeClass("hidden");
}

function hideAddNssdcaFormLoadingIcon(){
  $("#addNssdcaLoadingIcon").addClass("hidden");
}

function showAddNssdcaErrorMessage(jqXHR, textStatus, error){
  $("#addNssdcaFormCompleteMessage").removeClass("hidden");
  $("#addNssdcaFormCompleteButtons").removeClass("hidden");

  var errorHtml = '<div class="bg-danger"><p><b>Upload Error<b></p><p>There has been an error with your submission. Please try again.</p><p>If problems persist please contact the system administrator.</p>';
  //errorHtml = errorHtml + jqXHR.responseText;
  $("#addNssdcaFormCompleteMessage").html(errorHtml);
}

function showAddNssdcaCompletedMessage(){
  $("#addNssdcaFormCompleteMessage").removeClass("hidden");
  $("#addNssdcaFormCompleteButtons").removeClass("hidden");

  $("#addNssdcaFormCompleteMessage").html("NSSDCA has been added.");
}

function displayNssdcaList(json, id, ver){
  $("#nssdcaTable").empty();
  showNssdcaTable();

  json = json["NSSDCA Status"];
  if (json){
    if(json.length > 0){
    	var idJson = json[0].logical_identifier;
    	var verJson = json[0].version_id;
    	
      var table = $('<table></table>').addClass('table table-hover');

      var subTitle = $('<thead><tr><th colspan="4">NSSDCA<br>' + idJson + '::'+ verJson + '</th></tr></thead>');
      var thead = $('<thead><tr>' +
    		  '<th>NSSDCA</th>' + 
    		  '<th>Status Date Time</th>' + 
    		  '<th>Email</th>' + 
    		  '<th>Comment</th>' +
    		  '</tr></thead>');

      var tbody = $('<tbody></tbody');
      for(i=0; i<json.length; i++){
    	  console.log("JSON NSSDCA: ", json[i]);
          var row = $('<tr>' +
                      '<td>' + json[i].nssdca_identifier + '</td>' +
                      '<td>' + json[i].status_date_time + '</td>' +
                      '<td>' + json[i].electronic_mail_address + '</td>' +
                      '<td>' + json[i].comment + '</td>' +
                      '</tr>');
          tbody.append(row);
      }

      table.append(subTitle);
      table.append(thead);
      table.append(tbody);
      
      $('#nssdcaTable').append(table);
    }   
  }
  else{
  	/*var tableNonStatus = $('<table></table>').addClass('table table-hover');
      var subTitle = $('<thead><tr><th colspan="4">NSSDCA<br>' + id + '::'+ ver + '</th></tr></thead>')

      var tbody = $('<tbody><tr><td>Cancelled Add NSSDCA</td></tr></tbody');

      tableNonStatus.append(subTitle);
      tableNonStatus.append(tbody);
      
      $('#nssdcaTable').append(tableNonStatus);*/
	  setUpProductsList();
  }
}

function showNssdcaTable(){
  $("#nssdcaTable").removeClass("hidden");
  $("#showProductStatusButton").removeClass("hidden");
  $("#searchDiv").addClass("hidden");
  $("#productStatusTable").addClass("hidden");
}

//========================== End NSSDCA ======================

function isValidEmail(input){
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(input);
}

function addProductsSeachListener(){
	  $("#prodSearchInput").on("propertychange change click keyup input paste", getProdResults);
}

function  getProdResults(){
    var text = $(this).val().toLowerCase();
    $("#productStatusTable tr").filter(function() {
         $(this).toggle($(this).children('td').first().text().toLowerCase().indexOf(text) > -1)
     });
}



