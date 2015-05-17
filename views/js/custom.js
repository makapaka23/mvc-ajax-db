$(function() {
	
	$(document).on("click", "a#search_form", function(){ getSearchForm(this); });	
	$(document).on("click", "a#list", function(){ getList(this); });	
	$(document).on("click", "button#add_model", function(){ addModel(this); });
	$(document).on("click", "button#search_model", function(){ searchModel(this); });
	
	//target td#field for editing
	$(document).on("dblclick", "td#field", function(){ makeEditable(this); });
	//when dropdown selection made
	$(document).on("blur", "select#editDD", function(){ updateConfirmation(this); });
	$(document).on("click", "button.update", function(){ removeEditable(this); });


});


function removeEditable(element) { 

	$('#indicator').show();
	
	console.log("Saving...");
	var Model = new Object();
	Model.ModelNumber = $('.current').attr('modelNumber');
	Model.field = $('.current').attr('field');	
	Model.newvalue = $("#update_confirm_modal input#update_val").val();

	var ModelJson = JSON.stringify(Model);
	
	//make sure they didn't stay on "please select" option and value is empty
	if (Model.newvalue){
		console.log("Update Model " + Model.ModelNumber + "; on field: " + Model.field + " New Val= " + Model.newvalue);		
		$.post('controller/Controller.php',
			{
				action: 'update_field_data',			
				Model: modelJson
			},
			function(data, textStatus) {
				//$('td.current').html($(element).val());
				$('td.current').html(Model.newvalue);
				$('.current').removeClass('current');
						
			}, 
			"json"		
		);	
	}
	$("#update_confirm_modal").modal("hide");
	$('#indicator').hide();	
}

function makeEditable(element) { 
	console.log("editable: " + element.id);
	//target specific column in results table to allow editing 
	//create selectable dropdown list
	if (element.id == "field") {
		//rebuild dropdown
		$(element).html('<select id="editDD" name="editDD" >' +
			'<option value="">Please select...</option>' +
			'<option value="VALUES">VALUES</option>' +			
			'</select>');
		$('#editDD').focus();
	}
	$(element).addClass('current'); 
}

function deleteConfirmation(element) {	
	$("#delete_confirm_modal").modal("show");
	$("#delete_confirm_modal input#model_ID").val($(element).attr('model_ID'));
}

function updateConfirmation(element) {	
	$("#update_confirm_modal").modal("show");
	$("#update_confirm_modal input#update_val").val(element.value);
	
}

function deleteUser(element) {	
	
	var Model = new Object();
	Model.opaxID = $("#delete_confirm_modal input#model_ID").val();

	
	var modelJson = JSON.stringify(Model);
	
	$.post('controllers/Controller.php',
		{
			action: 'delete_model',
			Model: modelJson
		},
		function(data, textStatus) {
			getModelList(element);
			$("#delete_confirm_modal").modal("hide");
		}, 
		"json"		
	);	
}

function getList(element) {
	console.log("custom/getList");
	$('#indicator').show();
	
	$.post('controllers/Controller.php',
		{
			action: 'get_list'				
		},
		function(data, textStatus) {
			console.log("run get_list");
			renderList(data);
			$('#indicator').hide();
		}, 		
		"json"		
	);
	$('#indicator').hide();	
}

function searchModel(element) {
	$('#indicator').show();

	var Model = new Object();
	Model.ID = $("input#search_name").val();
	console.log("Searching " + Model.ID);
	
	var modelJson = JSON.stringify(Model);
	$.post('controllers/Controller.php',
		{
			action: 'search_model',
			user: modelJson				
		},
		function(data, textStatus) {
			console.log("search_model done");
			renderList(data);
			$('#indicator').hide();
		}, 		
		"json"		
	);
	$('#indicator').hide();	
}


function renderList(jsonData) {
	console.log("renderList records " + jsonData.length);
	
	if (jsonData.length > 0){
		var table = '<table width="100%" cellpadding="5" id="lookup" class="table table-hover table-bordered"><thead><tr><th scope="col">Address</th><th scope="col">Sale</th><th scope="col">Settlement</th><th scope="col">Price</th><th scope="col">Seller</th></tr></thead>';
		
		$.each( jsonData, function( index, fees){     
			table += '<tr>';
			table += '<td class="edit" field="property_address" id="'+fees.id+'">'+fees.property_address+'</td>';
			table += '<td class="edit" field="sale_date" id="'+fees.id+'">'+fees.sale_date+'</td>';
			table += '<td class="edit" field="settle_date" id="'+fees.id+'">'+fees.settle_date+'</td>';
			table += '<td class="edit" field="price" id="'+fees.id+'">'+fees.price+'</td>';
			table += '<td class="edit" field="seller" id="'+fees.id+'">'+fees.seller+'</td>';
			table += '</tr>';
	    });
		
		table += '</tbody></table>';
		
	}
	else {
		var table = '<h2>Not found<br/></h2>';
	}
	$('div#nav_content').html(table);
	
	//add jquery datatable 
	$('#lookup').dataTable( {
        "order": [[ 1, "asc" ]]
    } );
}

function addModel(element) {	
	
	$('#indicator').show();
	
	var Model = new Object();
	//Model.studentID = $('input#studentID').val();
	Model.ID = $('input#ID').val();
	Model.title = $('input#title').val();
	Model.email = $('input#email').val();
	Model.familyName = $('input#familyName').val();
	Model.givenNames = $('input#givenNames').val();
	
	var modelJson = JSON.stringify(Model);
	//validation check all entries
	if (((Model.ID)) && ((Model.email)) && (Model.title) && 
			(Model.familyName) && (Model.givenNames) && (Model.unit != "Please select...")) {
				
		$.post('controllers/Controller.php',
			{
				action: 'add_model',
				model: modelJson
			},
			function(data, textStatus) {
				createSuccess(element);
				$('#indicator').hide();
			}, 
			"json"		
		);
	}
	else{
		alert("Please check all fields entered");
		$('#indicator').hide();
	}
}

function createSuccess(element) {
	var success = '<h3>User created</h3>';

	$('div#nav_content').html(success);
}

function getCreateForm(element) {
	var form = '<div class="input-prepend">';			
		form +=	'<span class="add-on"><i class="icon-user icon-black"></i> Title</span>';
		form +=	'<input type="text" id="title" name="title" value="" class="input-large" />';
		form +=	'</div><br/><br/>';

		form +=	'<div class="input-prepend">';
		form +=	'<span class="add-on"><i class="icon-user icon-black"></i> Family Name</span>';
		form +=	'<input type="text" id="familyName" name="familyName" value="" class="input-xlarge" />';		
		form +=	'</div><br/><br/>';

		form +=	'<div class="input-prepend">';
		form +=	'<span class="add-on"><i class="icon-user icon-black"></i> Given Names</span>';
		form +=	'<input type="text" id="givenNames" name="givenNames" value="" class="input-xlarge" />';
		form +=	'</div><br/><br/>';

		form +=	'<div class="input-prepend">';
		form +=	'<span class="add-on"><i class="icon-envelope icon-black"></i> Email</span>';
		form +=	'<input type="text" id="email" name="email" value="" class="input-xlarge" />';
		form +=	'</div><br/><br/>';	
			
		form +=	'<div class="control-group">';
		form +=	'<div class="">';		
		form +=	'<button type="button" id="add_user" class="btn btn-primary"><i class="icon-ok icon-white"></i> Add User</button>';
		form +=	'</div>';
		form +=	'</div>';
		
		$('div#nav_content').html(form);
}

function getSearchForm(element) {
	var form = '<div class="input-prepend">';
		form +=	'<span class="add-on"><i class="icon-user icon-black"></i> Search by ID:</span>';
		form +=	'<input type="text" id="search_name" name="search_name" value="" class="input-large" />';
		form +=	'</div><br/><br/>';

		form +=	'<div class="control-group">';
		form +=	'<div class="">';		
		form +=	'<button type="button" id="search_model" class="btn btn-primary"><i class="icon-ok icon-white"></i> Search Model</button>';
		form +=	'</div>';
		form +=	'</div>';

	$('div#nav_content').html(form);
}

