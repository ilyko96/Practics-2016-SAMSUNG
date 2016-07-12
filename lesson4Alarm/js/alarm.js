var dot = 175;
var dash = 3 * dot;
var pause = dot;
var pattern = [dot, pause, dot, pause, dot, pause,
               dash, pause, dash, pause, dash, pause,
               dot, pause, dot, pause, dot, pause];
window.onload = function() {
	tizen.power.request('CPU', 'CPU_AWAKE');
	tizen.power.turnScreenOn();
	
	var cd = calcDur();
	var interval = setInterval(function() {
		navigator.vibrate(pattern);
	}, cd + 1000)
	console.log('ПРОСНИИИИСЬ!!');
	setTimeout(function() {
		clearInterval(interval);
	}, 3 * (cd + 1000));
	
	document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
            	window.location.href('index.html');
                //tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
            return;
        }
    });
	function calcDur() {
		var s = 0;
		for (var i = 0; i < pattern.length; i++)
			s += pattern[i];
		return s;
	}
}