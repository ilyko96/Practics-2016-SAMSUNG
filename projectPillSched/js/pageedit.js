var db_name = 'pillsched_medicines',
	table_name = 'medicines';
var edit_name_item_cnt = 2;

var names = [''],
	freq = 0,
	dur_start = new Date(),
	dur_end = new Date(new Date().setDate(new Date().getDate() + 7)),
	notification = 0;

var freq_time = {};
freq_timeInit();
function freq_timeInit() {
	var d = new Date();
	freq_time.morning = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 9, 0, 0);
	freq_time.dinner = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 14, 0, 0);
	freq_time.evening = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 19, 0, 0);
}


$(document).ready(function() {
	$('#page-settings-btn-receive_db').click(function(e) {
		importFromJSON('db.json', function() {
			$.mobile.changePage('#page-sched');
		});
	});
	
	
	///////DEBUG///////////
//	freq_time.morning = new Date(new Date().getTime() + 30 * 1000);
//	freq_time.dinner = new Date(new Date().getTime() + 40 * 1000);
//	freq_time.evening = new Date(new Date().getTime() + 50 * 1000);
	///////DEBUG///////////
	
	$('#page-sched').on('pagebeforeshow', function(e) {
		restorePageData();
	});
	// Хэндлер перехода на эту страницу
	$('#page-edit').on('pagebeforeshow', function(e) {
		restorePageData();
		if (page_edit_data) {
			console.log(page_edit_data);
			loadPageData();
			return;
		}
	});
	$('#page-edit').on('pagebeforehide', function(e) {
		page_edit_data = null;
		pageSchedLoad();
	});
	
	var db = openDatabase(db_name, '1.0', 'Database of medicines', 2 * 1024 * 1024);
	
	function dateToString(d) {
		var day = ("0" + d.getDate()).slice(-2);
		var month = ("0" + (d.getMonth() + 1)).slice(-2);
		return d.getFullYear()+"-"+(month)+"-"+(day) ;
	}
	
	$('#edit-duration-input-start').val(dateToString(dur_start));
	$('#edit-duration-input-end').val(dateToString(dur_end));
	$('#edit-duration-input-start').change(function(e) {
		dur_start = new Date($(this).val());
	});
	$('#edit-duration-input-end').change(function(e) {
		dur_end = new Date($(this).val());
	});
	
	addSearchTextChangeHandler(1);
	function addSearchTextChangeHandler(jqid) {
		// Обработчик изменения текста в поле поиска
		$('#edit-name-input-' + jqid).on('input', function(e) {
			var id = '#edit-name-input-' + jqid;
			var val = $(this).val();
			names[jqid - 1] = val;
			if (val.length == 0) {
				$('#edit-name-autocomplete-list-' + jqid).html('');
				return;
			}
			// Обращение к БД за n=10 результатами
			getMedicines(val, 10, function(arr) {
				if(arr.length == 0) {
					$('#edit-name-autocomplete-list-' + jqid).html('');
					return;
				}
				
				// Формируем набор <li></li> элементов из полученных от бд
				var html = '<li class="edit-name-autocomplete-'+jqid+' ui-first-child" for="'+id+'"><a href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r">' + arr[0] + '</a></li>';;
				for (var i = 1; i < arr.length; i++)
					html += '<li class="edit-name-autocomplete-'+jqid+(i == arr.length - 1 ? ' ui-last-child' : '')+'" '+
					'for="'+id+'"><a href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r">' + arr[i] + '</a></li>';

				$('#edit-name-autocomplete-list-'+jqid).html(html);

				// Ставим на созданные элементы хэндлер, чтобы по клику вставлять текст выбранного элемента
				$('.edit-name-autocomplete-'+jqid).off().on('click', function(e) {
					$($(this).attr('for')).val($(this).text());
					names[jqid - 1] = $(this).text();
					$('#edit-name-autocomplete-list-'+jqid).html('');
//					console.log(names);
				});
			});

			// Нажатие на крестик в поле поиска
			var $clear = $('#edit-name-input-clear-'+jqid);
//			if ($clear.length)
				$('#edit-name-input-clear-'+jqid).off().on('click', function(e) {
					$('#edit-name-input-clear-'+jqid).addClass('ui-input-clear-hidden');
					$('#edit-name-input-'+jqid).val('');
					$('#edit-name-autocomplete-list-'+jqid).html('');
				});
//			else
//				$('a[title="Clear text"]').off().on('click', function(e) {
//					$('a[title="Clear text"]').addClass('ui-input-clear-hidden');
//					$('#edit-name-input-'+jqid).val('');
//					$('#edit-name-autocomplete-list-'+jqid).html('');
//				});
		});
	}
	
	
	function getMedicines(term, n, f) {
		n = n || 10;
		if (term.length < 2) {
			f([]);
			return;
		}
		
		db.transaction(function (tx) {
			var sql = "SELECT * FROM " + table_name + " WHERE name LIKE '%" + term + "%'";
			tx.executeSql(sql, [],
				function (tx, rs) {
					var items = [];
					if (rs.rows.length == 0) {
						f([]);
						return;
					}
					
					var len = Math.min(rs.rows.length, n);
					for (var i = 0; i < len; i++) {
						items.push(rs.rows.item(i)['name']);
					}
					f(items);
				},
				function(e) {
					console.error(e);
					f([]);
				}
			);
		});
	}
	
	// Обработчик нажатия на кнопку "добавить еще поле"
	$('#edit-name-btn-add').on('click', function(e) {
		addEditNameField(edit_name_item_cnt);
		addSearchTextChangeHandler(edit_name_item_cnt);
		edit_name_item_cnt++;
	});
	
	
	function addEditNameField(jqid) {
		var fieldset = $(
		'<fieldset class="ui-grid-a" id="edit-name-item-'+jqid+'">'+
			'<div class="ui-block-a" style="width:85%;">'+
				'<form class="ui-filterable">'+
					'<div class="ui-input-search ui-body-inherit ui-corner-all ui-shadow-inset ui-input-has-clear">'+
						'<input type="text" data-type="search" id="edit-name-input-'+jqid+'">'+
						'<a href="#" class="ui-input-clear ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all ui-input-clear-hidden" title="Clear text" id="edit-name-input-clear-'+jqid+'">Clear text</a></div>'+
				'</form>'+
				'<ul id="edit-name-autocomplete-list-'+jqid+'" data-role="listview" data-inset="true" data-theme="c" class="ui-listview ui-listview-inset ui-corner-all ui-shadow ui-group-theme-c">'+
				'</ul>'+
			'</div>'+
		'</fieldset>'
		);
//		var fieldset = $(
//				'<fieldset class="ui-grid-a" id="edit-name-item-'+jqid+'">'+
//				'<div class="ui-block-a" style="width:85%;">'+
//					'<form class="ui-filterable">'+
//						'<input type="text" data-type="search" id="edit-name-input-'+jqid+'" />'+
//					'</form>'+
//					'<ul id="edit-name-autocomplete-list-'+jqid+'" data-role="listview" data-inset="true" data-theme="c" class="ui-listview ui-listview-inset ui-corner-all ui-shadow ui-group-theme-c">'+
//					'</ul>'+
//				'</div>'+
//			'</fieldset>'
//				);
		$('#edit-name-list').append(fieldset).listview('refresh');
		$('#edit-name-add-wrapper').detach().appendTo('#edit-name-item-'+jqid);
	}
	
	$('#edit-freq-form').change(function(e) {
		freq = $('#edit-freq-form option:selected').val();
	});
	$('#edit-notification-select').change(function(e) {
		notification = $('#edit-notification-select option:selected').val();
	});
	
	// Нажатие на кнопку сохранения графика
	$('#edit-btn-save').click(function(e) {
		console.log(names);
		var nms = [];
		var f = false;
		for (var i = 0; i < names.length; i++)
			if (names[i] != '') {
				nms.push(names[i]);
				f = true;
			}
		if (!f) return;
		
		var obj = {
				names: nms,
				freq: freq,
				duration: {
					start: dur_start,
					end: dur_end
				},
				notification: notification
		};
		var len = localStorage.getItem('pillsched_cnt');
		if (!len)
			len = 1;
		len++;
		
		var appControl = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/pillschedalarm');
		var appId = tizen.application.getCurrentApplication().appInfo.id;
		
		if (page_edit_data){
			console.log('удаляемся');
			console.log(page_edit_data);
			try {
				removeAlarms(page_edit_data.alarms);
			} catch(e) {
				console.error(e);
			}
			localStorage.removeItem(page_edit_data.lsKey);
		}
		
		obj.alarms = createAlarmsByFreq();
		console.log(new Date());
		for (var i = 0; i < obj.alarms.length; i++) {
			tizen.alarm.add(obj.alarms[i], appId, appControl);
			console.log("Alarm #"+i+" added with id: " + obj.alarms[i].id + '. Date: ' + obj.alarms[i].date);
		}
		obj.lsKey = 'pillsched_schedule-' + len;
		console.log(JSON.stringify(obj));
		localStorage.setItem('pillsched_schedule-' + len, JSON.stringify(obj));
		localStorage.setItem('pillsched_cnt', len);
		$.mobile.changePage('#page-sched');
//		pageSchedLoad();
	});
	
	function createAlarmsByFreq() {
		function getDel() {
			if (notification < 3)
				return (notification + 1) * 5 * 60;
			return (notification - 2) * 30 * 60;
		}
		var alarms = [],
			n = getDel(),
			dm = new Date(freq_time.morning.getTime() - n * 1000),
			dd = new Date(freq_time.dinner.getTime() - n * 1000),
			de = new Date(freq_time.evening.getTime() - n * 1000);
		if (freq < 3) {
			alarms.push(new tizen.AlarmAbsolute(dm, tizen.alarm.PERIOD_DAY));
		}
		if (freq % 4 == 0) {
			alarms.push(new tizen.AlarmAbsolute(dd, tizen.alarm.PERIOD_DAY));
		}
		if (freq < 2 || freq == 3) {
			alarms.push(new tizen.AlarmAbsolute(de, tizen.alarm.PERIOD_DAY));
		}
		return alarms;
	}
	
	
	$('#edit-btn-delete').click(function() {
		removeAlarms(page_edit_data.alarms);
		localStorage.removeItem(page_edit_data.lsKey);
		$.mobile.changePage('#page-sched');
	});
	
	function removeAlarms(alrms) {
		for (var i = 0; i < alrms.length; i++)
			tizen.alarm.remove(alrms[i].id);
	}
	function restorePageData() {
		$('#edit-name-add-wrapper').detach().appendTo('#edit-name-item-1');
		for (var i = 2; i <= edit_name_item_cnt; i++)
			$('#edit-name-item-'+i).remove();
		$('#edit-name-input-1').val('');
		edit_name_item_cnt = 2;
		$('#edit-btn-delete').hide();
		
		names = [''];
		freq = 0;
		dur_start = new Date();
		dur_end = new Date(new Date().setDate(new Date().getDate() + 7));
		notification = 0;
	}
	function loadPageData() {
		var o = page_edit_data;
		$('#edit-name-input-1').val(o.names[0]);
		names[0] = o.names[0];
		for (var i = 1; i < o.names.length; i++) {
			addEditNameField(edit_name_item_cnt);
			addSearchTextChangeHandler(edit_name_item_cnt);
			$('#edit-name-input-' + edit_name_item_cnt).val(o.names[i]);
			names[i] = o.names[i];
			edit_name_item_cnt++;
		}
		freq = o.freq;
		$('#edit-freq-select option[value="'+o.freq+'"]').prop('selected', true);
		$('#edit-freq-form span').text($('#edit-freq-select option[value="'+o.freq+'"]').text());
		dur_start = o.duration.start;
		$('#edit-duration-input-start').val(dateToString(new Date(o.duration.start)));
		dur_start = o.duration.end;
		$('#edit-duration-input-end').val(dateToString(new Date(o.duration.end)));
		notification = o.notification;
		$('#edit-notification-select option[value="'+o.notification+'"]').prop('selected', true);
		$('#edit-notification-form span').text($('#edit-notification-select option[value="'+o.notification+'"]').text());
		$('#edit-btn-delete').show();
	}
	
//	DEBUG Funcs
	function importFromJSON(url, f) {
		// Dangerous func, cuz w/o any checks
		$.get(url, '', function(d) {
			try {
				var datarr = JSON.parse(d);
				db.transaction(function (tx) {
					tx.executeSql('DROP TABLE IF EXISTS ' + table_name);
					tx.executeSql('CREATE TABLE IF NOT EXISTS ' + table_name + ' (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, properties TEXT)');
				   for (var i = 0; i < datarr.length; i++) {
					   tx.executeSql('INSERT INTO ' + table_name + ' (name, properties) VALUES (?, ?)', [datarr[i].Name, datarr[i].Properties]);
				   }
				   f();
				});
			} catch(e) {
				console.error(e);
			}
		});
	}
//	importFromJSON('db.json');
});