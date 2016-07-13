//
//
// Main panel navi
$(document).ready(function() {
	$('#btn-page-month').click(function() {
		$.mobile.changePage('#page-month');
	});
});
//
//
//
//
// Edit page. Smart search logic
var edit_name_list_cnt = 0;
$(document).ready(function() {addSmartSearch();});
function addSmartSearch(id) {
	$("#filter-menu-"+(id ? id : 'origin')+"-menu")
	// "filter-menu-menu" is the ID generated for the listview when it is
	// created
	// by the custom selectmenu plugin. Upon creation of the listview widget
	// we
	// want to prepend an input field to the list to be used for a filter.
	.on("listviewcreate", function(e) {
				var input,
					listbox = $("#filter-menu-"+(id ? id : 'origin')+"-listbox"),
					form = listbox.jqmData("filter-form"),
					listview = $(e.target),
					add_btn = $('<a data-role="button" class="ui-btn" data-theme="b">Add custom</a>');
				console.log(listview.filterable);
				// We store the generated form in a variable attached to the
				// popup so we
				// avoid creating a second form/input field when the
				// listview is
				// destroyed/rebuilt during a refresh.
				if (!form) {
					input = $("<input data-type='search'></input>");
					form = $("<form></form>").append(input);
					input.textinput();
					$("#filter-menu-"+(id ? id : 'origin')+"-listbox").prepend(form).append(add_btn).jqmData("filter-form", form);
				}
				// Instantiate a filterable widget on the newly created
				// listview and
				// indicate that the generated input is to be used for the
				// filtering.
				listview.filterable({
					input : input
				});
			});
	// The custom select list may show up as either a popup or a dialog,
	// depending how much vertical room there is on the screen. If it shows
	// up
	// as a dialog, then the form containing the filter input field must be
	// transferred to the dialog so that the user can continue to use it for
	// filtering list items.
	//
	// After the dialog is closed, the form containing the filter input is
	// transferred back into the popup.
	$("#filter-menu-"+(id ? id : 'origin')+"-dialog").on("pagebeforeshow pagehide", function(e) {
				var form = $("#filter-menu-"+(id ? id : 'origin')+"-listbox").jqmData("filter-form"),
					placeInDialog = (e.type === "pagebeforeshow"),
					destination = placeInDialog ? $(e.target).find(".ui-content") : $("#filter-menu-"+(id ? id : 'origin')+"-listbox");
				
				form.find("input")
					// Turn off the "inset" option when the filter input is
					// inside a dialog
					// and turn it back on when it is placed back inside the
					// popup, because
					// it looks better that way.
					.textinput("option", "inset", !placeInDialog).end()
					.prependTo(destination);
			});
}
		
$(document).ready(function() {
//	<fieldset class="ui-grid-a edit-name-item-origin">
//	<div class="ui-block-a" style="width:85%;">
//		<form>
//		    <select id="filter-menu-origin" data-filter-reveal="true" data-native-menu="false">
//		        <option value="SFO">San Francisco</option>
//		        <option value="LAX">Los Angeles</option>
//		        <option value="YVR">Vancouver</option>
//		        <option value="YYZ">Toronto</option>
//		    </select>
//		</form>
//	</div>
//	<div class="ui-block-b" style="width:10%; margin-top: 7px; margin-left: 10px;">
//		<a data-iconpos="notext" data-role="button" data-icon="plus" title="Add">Home</a>
//	</div>
//</fieldset>
	var id = edit_name_list_cnt;
	$('#edit-name-btn-add').click(function() {	
//		var fieldset = $('<fieldset class="ui-grid-a edit-name-item-'+id+'">'+
//				'		<div class="ui-block-a" style="width:85%;">' +
//							'<form>' +
//							    '<select id="filter-menu-'+id+'" data-filter-reveal="true" data-native-menu="false">' +
//							        '<option value="SFO">San Francisco</option>' +
//							        '<option value="LAX">Los Angeles</option>' +
//							        '<option value="YVR">Vancouver</option>' +
//							        '<option value="YYZ">Toronto</option>' +
//							    '</select>' +
//							'</form>' +
//						'</div>' +
//						'</fieldset>');
		var fieldset = $('<fieldset class="ui-grid-a edit-name-item-'+id+'">'+
							'<div class="ui-block-a" style="width:85%;">' +
							'<form>' +
							    '<div class="ui-select">'+
							    '<a href="#filter-menu-'+id+'-listbox" role="button" id="filter-menu-'+id+'-button" aria-haspopup="true" class="ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow" data-rel="popup"><span>San Francisco</span></a><select id="filter-menu-'+id+'" data-filter-reveal="true" data-native-menu="false" tabindex="-1">'+
							        '<option value="SFO">San Francisco</option>'+
							        '<option value="LAX">Los Angeles</option>'+
							        '<option value="YVR">Vancouver</option>'+
							        '<option value="YYZ">Toronto</option>'+
							    '</select><div style="display: none;" id="filter-menu-'+id+'-listbox-placeholder"><!-- placeholder for filter-menu-'+id+'-listbox --></div></div>'+
							'</form>')
		$('#edit-name-list').append(fieldset);
		addSmartSearch(id);
		edit_name_list_cnt++;
	});	
});
//
//
//
//
//
//
//
//
//
//