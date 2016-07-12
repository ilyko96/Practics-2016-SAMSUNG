var d;
window.onload = function() {
	// TODO:: Do your initialization job
	console.log('Я включился');
	d = new Date();
	var timer = document.getElementById('time');
	timer.value = d.toString();
	timer.addEventListener('change', function(e) {
		var parts = e.target.value.split(':');
		d = new Date();
		d.setHours(parseInt(parts[0]));
		d.setMinutes(parseInt(parts[1]));
		d.setSeconds(parseInt(parts[2]));
	});

	// add eventListener for tizenhwkey
	document.addEventListener('tizenhwkey', function(e) {
		if (e.keyName === "back") {
			try {
				tizen.application.getCurrentApplication().exit();
			} catch (ignore) {
			}
			return;
		}
	});

	// Sample code
	var btnSetAlarm = document.querySelector('#add-alarm-button');

	btnSetAlarm.addEventListener("click", function() {
		var appId = tizen.application.getCurrentApplication().appInfo.id;

		var date = d;
		var alarm = new tizen.AlarmAbsolute(date);
		var appControl = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/alarm');
		tizen.alarm.add(alarm, appId, appControl);
		console.log(d);

		console.log('Я поставил будильник');
	});
};