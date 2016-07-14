$(document).ready(function() {
	pageSchedLoad();
});

function pageSchedLoad() {
	$('.page-sched-item-edit').off();
	$('#sched-list').html('<span style="color: #ccc;" id="page-sched-placeholder-nodata">Add new schedule from menu section</span>');
	for (var i = 0; i < localStorage.length; i++) {
		if (localStorage.key(i).indexOf('pillsched_schedule-') > -1) {
			$('#page-sched-placeholder-nodata').remove();
			addSchedule(i);
		}
	}
	$('.page-sched-item-edit').on('click', function(e) {
		page_edit_data = JSON.parse(localStorage.getItem(localStorage.key($(this).attr('value'))));
		$.mobile.changePage('#page-edit');
	});
	function addSchedule(ind) {
		try {
			var val = JSON.parse(localStorage.getItem(localStorage.key(i)));
//			console.log(val);
		} catch (e) {
			console.error(e);
			return;
		}
		function getTitleLeft() {
			function pad(d) {
				if (d < 10)
					return '0' + d;
				return d;
			}
			var ds = new Date(val.duration.start),
				de = new Date(val.duration.end);
			return pad(ds.getMonth() + 1) + '.' + pad(ds.getDate()) + ' - ' +
					pad(de.getMonth() + 1) + '.' + pad(de.getDate());
		}
		function getTitleRight() {
			switch (parseInt(val.freq)) {
				case 0:
					return '3 times';
				case 1:
					return '2 times';
				case 2:
					return 'Morning';
				case 3:
					return 'Evening';
				case 4:
					return 'Noon';
			}
		}
		function getDescription() {
			if (val.names.length == 1)
				return val.names[0];
			if (val.names.length == 2)
				return val.names[0] + '<br>' + val.names[1];
			return val.names[0] + '<br>' + val.names[1] + '<br>...'; 
		}
		function getDescriptionRight() {
			switch (parseInt(val.notification)) {
			case 0:
				return '5 min';
			case 1:
				return '10 min';
			case 2:
				return '15 min';
			case 3:
				return '30 min';
			case 4:
				return '1 hour';
		}
		}
//		var elt = $(
//			'<ul data-role="listview" data-inset="true" value="'+ind+'">'+
//				'<li><a href="#">'+getTitle()+'</a></li>'+
//				'<li>'+getDescription()+'</li>'+
//			'</ul>'
//		);
		var elt = $(
			'<ul data-role="listview" data-inset="true" class="ui-listview ui-listview-inset ui-corner-all ui-shadow page-sched-item-edit" value="'+ind+'">'+
			'<li class="ui-first-child"><a href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r">'+getTitleLeft()+
			'<span class="ui-btn-right" style="margin-right: 35px; margin-top: 7px;">'+getTitleRight()+'</span></a></li>'+
			'<li class="ui-li-static ui-body-inherit ui-last-child">'+getDescription()+'<span class="ui-btn-right" style="margin-right: 35px; margin-top: 7px;">'+getDescriptionRight()+'</span></li>'+
			'</ul>'
		);
		$('#sched-list').append(elt);
	}
}