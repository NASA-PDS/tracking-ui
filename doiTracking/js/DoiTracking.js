var Manager;

var doiListUrl = "https://" + TrackingConts.server_host + "/services/tracking/json/doi/";
var addDoiUrl = "https://" + TrackingConts.server_host + "/services/tracking/json/doi/add";
var updateDoiUrl = "https://" + TrackingConts.server_host + "/services/tracking/json/doi/update";

(function ($) {
    $( document ).ready(function() {
      setUpAddDoiModalListeners();
      setUpUpdateDoiModalListeners();
      setUpDoiList();
    });
})(jQuery);

function setUpAddDoiModalListeners(){
  clearAddDoiModalOnClose();
  createAddDoiModalValidationListener();
  createAddDoiModalAddButtonListener();
}

function setUpUpdateDoiModalListeners(){
  clearUpdateDoiModalOnClose();
  createUpdateDoiModalValidationListener();
  createUpdateDoiModalUpdateButtonListener();
}

function clearAddDoiModalOnClose(){
  $(document).on('hide.bs.modal','#addDoiModal', function () {
    clearAddDoiModal();
    setUpDoiList();
  });
}

function clearUpdateDoiModalOnClose(){
	  $(document).on('hide.bs.modal','#updateDoiModal', function () {
	    clearUpdateDoiModal();
	    setUpDoiList();
	  });
	}

function clearAddDoiModal(){
  $("#addDoiLogicalIdentifierInput").val('');
  $("#addDoiVersionInput").val('');
  $("#addDoiDoiInput").val('');
  $("#addDoiUrlInput").val('');
  $("#addDoiEmailInput").val('');
  $("#addDoiCommentInput").val('');


  $("#addDoiLogicalIdentifierFormGroup").removeClass("has-success");
  $("#addDoiLogicalIdentifierFormGroup").removeClass("has-error");
  $("#addDoiLogicalIdentifierInputHelpBlock").addClass("hidden");

  $("#addDoiVersionFormGroup").removeClass("has-success");
  $("#addDoiVersionFormGroup").removeClass("has-error");
  $("#addDoiVersionInputHelpBlock").addClass("hidden");

  $("#addDoiDoiInputFormGroup").removeClass("has-success");
  $("#addDoiDoiInputFormGroup").removeClass("has-error");
  $("#addDoiDoiInputHelpBlock").addClass("hidden");

  $("#addDoiUrlInputFormGroup").removeClass("has-success");
  $("#addDoiUrlInputFormGroup").removeClass("has-error");
  $("#addDoiUrlInputHelpBlock").addClass("hidden");

  $("#addDoiEmailInputFormGroup").removeClass("has-success");
  $("#addDoiEmailInputFormGroup").removeClass("has-error");
  $("#addDoiEmailInputHelpBlock").addClass("hidden");

  $("#addDoiCommentInputFormGroup").removeClass("has-success");
  $("#addDoiCommentInputFormGroup").removeClass("has-error");
  $("#addDoiCommentInputHelpBlock").addClass("hidden");

  $("#addDoiModalAddButtonDisabled").removeClass("hidden");
  $("#addDoiModalAddButton").addClass("hidden");

  $("#addDoiFormContainer").removeClass("hidden");
  $("#addDoiFormButtons").removeClass("hidden");

  $("#addDoiFormContainer").removeClass("hidden");
  $("#addDoiFormButtons").removeClass("hidden");

  $("#addDoiFormCompleteMessage").addClass("hidden");
  $("#addDoiFormCompleteButtons").addClass("hidden");
  $("#addDoiLoadingIcon").addClass("hidden");
}

function clearUpdateDoiModal(){
  $("#updateDoiUrlInput").val('');
  $("#updateDoiEmailInput").val('');
  $("#updateDoiCommentInput").val('');

  $("#updateDoiUrlInputFormGroup").removeClass("has-success");
  $("#updateDoiUrlInputFormGroup").removeClass("has-error");
  $("#updateDoiUrlInputHelpBlock").addClass("hidden");

  $("#updateDoiEmailInputFormGroup").removeClass("has-success");
  $("#updateDoiEmailInputFormGroup").removeClass("has-error");
  $("#updateDoiEmailInputHelpBlock").addClass("hidden");

  $("#updateDoiCommentInputFormGroup").removeClass("has-success");
  $("#updateDoiCommentInputFormGroup").removeClass("has-error");
  $("#updateDoiCommentInputHelpBlock").addClass("hidden");

  $("#updateDoiModalUpdateButtonDisabled").removeClass("hidden");
  $("#updateDoiModalUpdateButton").addClass("hidden");

  $("#updateDoiFormContainer").removeClass("hidden");
  $("#updateDoiFormButtons").removeClass("hidden");

  $("#updateDoiFormContainer").removeClass("hidden");
  $("#updateDoiFormButtons").removeClass("hidden");

  $("#updateDoiFormCompleteMessage").addClass("hidden");
  $("#updateDoiFormCompleteButtons").addClass("hidden");
  $("#updateDoiLoadingIcon").addClass("hidden");
}

function createAddDoiModalValidationListener(){
  $("#addDoiLogicalIdentifierInput").on("propertychange change click keyup input paste", validateAddDoiForm);
  $("#addDoiVersionInput").on("propertychange change click keyup input paste", validateAddDoiForm);
  $("#addDoiDoiInput").on("propertychange change click keyup input paste", validateAddDoiForm);
  $("#addDoiUrlInput").on("propertychange change click keyup input paste", validateAddDoiForm);
  $("#addDoiEmailInput").on("propertychange change click keyup input paste", validateAddDoiForm);
  $("#addDoiCommentInput").on("propertychange change click keyup input paste", validateAddDoiForm);
}

function createUpdateDoiModalValidationListener(){
	  $("#updateDoiUrlInput").on("propertychange change click keyup input paste", validateUpdateDoiForm);
	  $("#updateDoiEmailInput").on("propertychange change click keyup input paste", validateUpdateDoiForm);
	  $("#updateDoiCommentInput").on("propertychange change click keyup input paste", validateUpdateDoiForm);
	}

function validateAddDoiForm(){
  var isFormValid = false;

  var isLogicalIdentifierValid = validateAddDoiLogicalIdentifier();
  var isVersionValid = validateAddDoiVersion();
  var isDoiValid = validateAddDoiDoi();
  var isUrlValid = validateAddDoiUrl();
  var isEmailValid = validateAddDoiEmail();
  var isCommentValid = validateAddDoiComment();

  if(!isLogicalIdentifierValid ||
    !isVersionValid ||
    !isDoiValid ||
    !isUrlValid ||
    !isEmailValid ||
    !isCommentValid){
      isFormValid = false;
  }
  else{
    isFormValid = true;
  }

  if(isFormValid){
    showAddDoiButton();
  }
  else{
    hideAddDoiButton();
  }
}

function validateUpdateDoiForm(){
  var isFormValid = false;
  var isUrlValid = validateUpdateDoiUrl();
  var isEmailValid = validateUpdateDoiEmail();
  var isCommentValid = validateUpdateDoiComment();

  if(!isUrlValid ||
    !isEmailValid ||
    !isCommentValid){
      isFormValid = false;
  }
  else{
    isFormValid = true;
  }

  if(isFormValid){
    showUpdateDoiButton();
  }
  else{
    hideUpdateDoiButton();
  }
}

function validateAddDoiLogicalIdentifier(){
    var logicalIdentifierInput = $('#addDoiLogicalIdentifierInput').val();
    if(logicalIdentifierInput.trim().length > 0 && logicalIdentifierInput.trim().length < 255){
      setAddDoiLogicalIdentifierToValid();
      return true;
    }
    else{
      setAddDoiLogicalIdentifierToInvalid();
      return false;
    }
}

function validateAddDoiVersion(){
  var version = $("#addDoiVersionInput").val();
  if(version.trim().length > 0 && isNumDotOnly(version) && version.trim().length < 255){
    setAddDoiVersionToValid();
    return true;
  }
  else{
    setAddDoiVersionToInvalid();
    return false;
  }
}

function validateAddDoiDoi(){
  var doi = $("#addDoiDoiInput").val();
  if(doi.trim().length > 0 && doi.trim().length < 255){
    setAddDoiDoiToValid();
    return true;
  }
  else{
    setAddDoiDoiToInvalid();
    return false;
  }
}

function validateAddDoiUrl(){
  var url = $("#addDoiUrlInput").val();
  if(isUrlValid(url)){
    setAddDoiUrlToValid();
    return true;
  }
  else{
    setAddDoiUrlToInvalid();
    return false;
  }
}

function validateUpdateDoiUrl(){
  var url = $("#updateDoiUrlInput").val();
  if(isUrlValid(url)){
    setUpdateDoiUrlToValid();
    return true;
  }
  else{
    setUpdateDoiUrlToInvalid();
    return false;
  }
}

function validateAddDoiEmail(){
  var email = $("#addDoiEmailInput").val();
  if(isValidEmail(email)){
    setAddDoiEmailToValid();
    return true;
  }
  else{
    setAddDoiEmailToInvalid();
    return false;
  }
}

function validateUpdateDoiEmail(){
  var email = $("#updateDoiEmailInput").val();
  if(isValidEmail(email)){
    setUpdateDoiEmailToValid();
    return true;
  }
  else{
    setUpdateDoiEmailToInvalid();
    return false;
  }
}

function validateAddDoiComment(){
  var comment = $('#addDoiCommentInput').val();
  if(comment.trim().length == 0 || (comment.trim().length > 0 && comment.trim().length < 1024)){
    setAddDoiCommentToValid();
    return true;
  }
  else{
    setAddDoiCommentToInvalid();
    return false;
  }
}

function validateUpdateDoiComment(){
  var comment = $('#updateDoiCommentInput').val();
  if(comment.trim().length == 0 || (comment.trim().length > 0 && comment.trim().length < 1024)){
    setUpdateDoiCommentToValid();
    return true;
  }
  else{
    setUpdateDoiCommentToInvalid();
    return false;
  }
}

function isInputValid(input){
  if(input.indexOf("<") > -1 ||
  input.indexOf(">") > -1 ||
  input.indexOf("&") > -1 ||
  !isAsciiOnly(input)){
      return true;
  }

  return false;
}

function isAsciiOnly(str) {
  for (var i = 0; i < str.length; i++){
    if (str.charCodeAt(i) > 127){
        return false;
      }
  }
  return true;
}

function isNumDotOnly(str) {
  var isNumber = /^(\d+\.)*\d+$/.test(str);
  return isNumber;
}
function isUrlValid(input){
  //var re = new RegExp('^(https?:\\/\\/)?'+ // protocol
   var re = new RegExp('^http(s?):\\/\\/(www\.)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return re.test(input);
}

function isValidEmail(input){
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(input);
}

// For Add
function setAddDoiLogicalIdentifierToInvalid(){
  $("#addDoiLogicalIdentifierFormGroup").removeClass("has-success");
  $("#addDoiLogicalIdentifierInputHelpBlock").removeClass("hidden");

  $("#addDoiLogicalIdentifierFormGroup").addClass("has-error");
}

function setAddDoiLogicalIdentifierToValid(){
  $("#addDoiLogicalIdentifierFormGroup").removeClass("has-error");

  $("#addDoiLogicalIdentifierFormGroup").addClass("has-success");
  $("#addDoiLogicalIdentifierInputHelpBlock").addClass("hidden");
}

function setAddDoiVersionToValid(){
  $("#addDoiVersionFormGroup").removeClass("has-error");

  $("#addDoiVersionFormGroup").addClass("has-success");
  $("#addDoiVersionInputHelpBlock").addClass("hidden");
}

function setAddDoiVersionToInvalid(){
  $("#addDoiVersionFormGroup").removeClass("has-success");
  $("#addDoiVersionInputHelpBlock").removeClass("hidden");

  $("#addDoiVersionFormGroup").addClass("has-error");
}

function setAddDoiDoiToValid(){
  $("#addDoiDoiInputFormGroup").removeClass("has-error");

  $("#addDoiDoiInputFormGroup").addClass("has-success");
  $("#addDoiDoiInputHelpBlock").addClass("hidden");
}

function setAddDoiDoiToInvalid(){
  $("#addDoiDoiInputFormGroup").removeClass("has-success");
  $("#addDoiDoiInputHelpBlock").removeClass("hidden");

  $("#addDoiDoiInputFormGroup").addClass("has-error");
}

function setAddDoiUrlToValid(){
  $("#addDoiUrlInputFormGroup").removeClass("has-error");

  $("#addDoiUrlInputFormGroup").addClass("has-success");
  $("#addDoiUrlInputHelpBlock").addClass("hidden");
}

function setAddDoiUrlToInvalid(){
  $("#addDoiUrlInputFormGroup").removeClass("has-success");
  $("#addDoiUrlInputHelpBlock").removeClass("hidden");

  $("#addDoiUrlInputFormGroup").addClass("has-error");
}

function setAddDoiEmailToValid(){
  $("#addDoiEmailInputFormGroup").removeClass("has-error");

  $("#addDoiEmailInputFormGroup").addClass("has-success");
  $("#addDoiEmailInputHelpBlock").addClass("hidden");
}

function setAddDoiEmailToInvalid(){
  $("#addDoiEmailInputFormGroup").removeClass("has-success");
  $("#addDoiEmailInputHelpBlock").removeClass("hidden");

  $("#addDoiEmailInputFormGroup").addClass("has-error");
}

function setAddDoiCommentToValid(){
  $("#addDoiCommentInputFormGroup").removeClass("has-error");

  $("#addDoiCommentInputFormGroup").addClass("has-success");
  $("#addDoiCommentInputHelpBlock").addClass("hidden");
}

function setAddDoiCommentToInvalid(){
  $("#addDoiCommentInputFormGroup").removeClass("has-success");
  $("#addDoiCommentInputHelpBlock").removeClass("hidden");

  $("#addDoiCommentInputFormGroup").addClass("has-error");
}
//For update
function setUpdateDoiUrlToValid(){
  $("#updateDoiUrlInputFormGroup").removeClass("has-error");

  $("#updateDoiUrlInputFormGroup").addClass("has-success");
  $("#updateDoiUrlInputHelpBlock").addClass("hidden");
}

function setUpdateDoiUrlToInvalid(){
  $("#updateDoiUrlInputFormGroup").removeClass("has-success");
  $("#updateDoiUrlInputHelpBlock").removeClass("hidden");

  $("#updateDoiUrlInputFormGroup").addClass("has-error");
}

function setUpdateDoiEmailToValid(){
  $("#updateDoiEmailInputFormGroup").removeClass("has-error");

  $("#updateDoiEmailInputFormGroup").addClass("has-success");
  $("#updateDoiEmailInputHelpBlock").addClass("hidden");
}

function setUpdateDoiEmailToInvalid(){
  $("#updateDoiEmailInputFormGroup").removeClass("has-success");
  $("#updateDoiEmailInputHelpBlock").removeClass("hidden");

  $("#updateDoiEmailInputFormGroup").addClass("has-error");
}

function setUpdateDoiCommentToValid(){
  $("#updateDoiCommentInputFormGroup").removeClass("has-error");

  $("#updateDoiCommentInputFormGroup").addClass("has-success");
  $("#updateDoiCommentInputHelpBlock").addClass("hidden");
}

function setUpdateDoiCommentToInvalid(){
  $("#updateDoiCommentInputFormGroup").removeClass("has-success");
  $("#updateDoiCommentInputHelpBlock").removeClass("hidden");

  $("#updateDoiCommentInputFormGroup").addClass("has-error");
}
// For Add
function showAddDoiButton(){
  $("#addDoiModalAddButtonDisabled").addClass("hidden");
  $("#addDoiModalAddButton").removeClass("hidden");
}

function hideAddDoiButton(){
  $("#addDoiModalAddButtonDisabled").removeClass("hidden");
  $("#addDoiModalAddButton").addClass("hidden");
}

function createAddDoiModalAddButtonListener(){
  $( "#addDoiModalAddButton" ).on("click", uploadNewDoi);
}

//For Update
function showUpdateDoiButton(){
  $("#updateDoiModalUpdateButtonDisabled").addClass("hidden");
  $("#updateDoiModalUpdateButton").removeClass("hidden");
}

function hideUpdateDoiButton(){
  $("#updateDoiModalUpdateButtonDisabled").removeClass("hidden");
  $("#updateDoiModalUpdateButton").addClass("hidden");
}

function createUpdateDoiModalUpdateButtonListener(){
	$( "#updateDoiModalUpdateButton" ).on("click", uploadUpdateDoi);
}

function createUpdateModalListener(){
	$('#updateDoiModal').on('show.bs.modal', function (event) {
		var id = $(event.relatedTarget).data('id');
		var ver = $(event.relatedTarget).data('ver');//updateDoiVersionInput
		var url = $(event.relatedTarget).data('url');//updateDoiUrlInput
		var email = $(event.relatedTarget).data('email');//updateDoiEmailInput
		var comment = $(event.relatedTarget).data('comment');//updateDoiCommentInput
		var title = $(event.relatedTarget).data('title');//updateDoiModalLabel
		$(this).find('#updateDoiModalLabel').text(title);
		$(this).find('#updateDoiLogicalIdentifierInput').val(id);
		$(this).find('#updateDoiVersionInput').val(ver);
		$(this).find('#updateDoiUrlInput').val(url);
		$(this).find('#updateDoiEmailInput').val(email);
		$(this).find('#updateDoiCommentInput').val(comment);
		
	});
}

function uploadNewDoi(){
  hideAddDoiForm();
  showAddDoiFormLoadingIcon();

  var formData = new FormData();
  var logicalIdentifier = $('#addDoiLogicalIdentifierInput').val();
  var version = $("#addDoiVersionInput").val();
  var doi = $("#addDoiDoiInput").val();
  var url = $("#addDoiUrlInput").val();
  var email = $("#addDoiEmailInput").val();
  var comment = $('#addDoiCommentInput').val();

  console.log("submit logicalIdentifier", logicalIdentifier);
  console.log("submit version", version);
  console.log("submit doi", doi);
  console.log("submit url", url);
  console.log("submit email", email);
  console.log("submit comment", comment);

  var form = $('#addDoiForm');
  var serializedForm = form.serialize();
  console.log("serializedForm", serializedForm);
  console.log("form", form);

  $.ajax({
      type: "POST",
      url: addDoiUrl,
      data: serializedForm
    }).done(function(data) {
      hideAddDoiFormLoadingIcon();
      showAddDoiCompletedMessage();
    }).fail(function(data) {
      hideAddDoiFormLoadingIcon();
      showAddDoiErrorMessage(jqXHR, textStatus, error);
    });
}

function uploadUpdateDoi(){
  hideUpdateDoiForm();
  showUpdateDoiFormLoadingIcon();

  var formData = new FormData();
  var logicalIdentifier = $('#updateDoiLogicalIdentifierInput').val();
  var version = $("#updateDoiVersionInput").val();
  var url = $("#updateDoiUrlInput").val();
  var email = $("#updateDoiEmailInput").val();
  var comment = $('#updateDoiCommentInput').val();

  console.log("submit logicalIdentifier", logicalIdentifier);
  console.log("submit version", version);
  console.log("submit url", url);
  console.log("submit email", email);
  console.log("submit comment", comment);

  var form = $('#updateDoiForm');
  var serializedForm = form.serialize();
  console.log("serializedForm", serializedForm);
  console.log("form", form);

  $.ajax({
      type: "POST",
      url: updateDoiUrl,
      data: serializedForm
    }).done(function(data) {
      hideUpdateDoiFormLoadingIcon();
      showUpdateDoiCompletedMessage();
    }).fail(function(data) {
      hideUpdateDoiFormLoadingIcon();
      showUpdateDoiErrorMessage(jqXHR, textStatus, error);
    });
}

// For Add
function hideAddDoiForm(){
  $("#addDoiFormContainer").addClass("hidden");
  $("#addDoiFormButtons").addClass("hidden");
}

function showAddDoiFormLoadingIcon(){
  $("#addDoiLoadingIcon").removeClass("hidden");
}

function hideAddDoiFormLoadingIcon(){
  $("#addDoiLoadingIcon").addClass("hidden");
}

function showAddDoiErrorMessage(jqXHR, textStatus, error){
  $("#addDoiFormCompleteMessage").removeClass("hidden");
  $("#addDoiFormCompleteButtons").removeClass("hidden");

  var errorHtml = '<div class="bg-danger"><p><b>Upload Error<b></p><p>There has been an error with your submission. Please try again.</p><p>If problems persist please contact the system administrator.</p>';
  //errorHtml = errorHtml + jqXHR.responseText;
  $("#addDoiFormCompleteMessage").html(errorHtml);
}

function showAddDoiCompletedMessage(){
  $("#addDoiFormCompleteMessage").removeClass("hidden");
  $("#addDoiFormCompleteButtons").removeClass("hidden");

  $("#addDoiFormCompleteMessage").html("DOI has been added.");
}

// For Update
function hideUpdateDoiForm(){
  $("#updateDoiFormContainer").addClass("hidden");
  $("#updateDoiFormButtons").addClass("hidden");
}

function showUpdateDoiFormLoadingIcon(){
  $("#updateDoiLoadingIcon").removeClass("hidden");
}

function hideUpdateDoiFormLoadingIcon(){
  $("#updateDoiLoadingIcon").addClass("hidden");
}

function showUpdateDoiErrorMessage(jqXHR, textStatus, error){
  $("#updateDoiFormCompleteMessage").removeClass("hidden");
  $("#updateDoiFormCompleteButtons").removeClass("hidden");

  var errorHtml = '<div class="bg-danger"><p><b>Upload Error<b></p><p>There has been an error with your submission. Please try again.</p><p>If problems persist please contact the system administrator.</p>';
  //errorHtml = errorHtml + jqXHR.responseText;
  $("#updateDoiFormCompleteMessage").html(errorHtml);
}

function showUpdateDoiCompletedMessage(){
  $("#updateDoiFormCompleteMessage").removeClass("hidden");
  $("#updateDoiFormCompleteButtons").removeClass("hidden");

  $("#updateDoiFormCompleteMessage").html("DOI has been updated.");
}
	
function setUpDoiList(){
  $("#doiTable").empty();

  $.ajax({
      type: "GET",
      url: doiListUrl,
      datatype: "json",
      success: function(data) {
        displayDoiList(data);
      }
  });
}

function displayDoiList(json){
    showDoiTable();

    json = json.doi;

    if (json){
      if(json.length > 0){
        var table = $('<table></table>').addClass('table table-hover');
        var thead = $('<thead><tr><th>DOI</th><th>Registration Date</th><th>Comment</th><th>Email</th><th>Logical Identifier</th></tr></thead>');

        var tbody = $('<tbody></tbody');
        for(i=0; i<json.length; i++){
            //console.log("JSON", json[i]);
            var row = $('<tr>' +
                        '<td><a href="' + json[i].site_url + '" class="listTitle">' + json[i].doi + '</a></td>' +
                        '<td>' + json[i].registration_date + '</td>' +
                        '<td>' + json[i].comment+ '</td>' +
                        '<td>' + json[i].electronic_mail_address + '</td>' +
                        '<td>' + json[i].logical_identifier + '</td>' +
                        '<td><button type="button" class="btn btn-success" data-toggle="modal" data-target="#updateDoiModal"' 
                        + ' data-id="' + json[i].logical_identifier + '"'
                        + ' data-ver="' + json[i].version_id + '"'
                        + ' data-url="' + json[i].site_url + '"'
                        + ' data-email="' + json[i].electronic_mail_address + '"'
                        + ' data-comment="' + json[i].comment + '"'
                        + ' data-title="Update DOI ' + json[i].doi + '"'
                        + '">Update</button></td>' +
                        '</tr>');
            tbody.append(row);
            createUpdateModalListener();
        }

        table.append(thead);
        table.append(tbody);

        $('#doiTable').append(table);
      }
    }
}

function showDoiTable(){
  $("#doiTable").removeClass("hidden");
}
