$(document).ready(
		function() {
			document.addEventListener('tizenhwkey', function(e) {
				if (e.keyName === "back") {
					try {
						tizen.application.getCurrentApplication().exit();
					} catch (ignore) {
					}
				}
			});

			var game_id = '';
			var coords = {};
			var auth = JSON.stringify({
				device_id : "#22"
			});
			var host = 'http://192.168.0.25:8081/init';
			
			$.ajax({
				url : host,
				data : auth,
				type : 'POST',
				error : function(e) {
					debugger;
					$('#content-text').text('Error: ' + e.status);
					console.log('error');
					console.log(e);
				},
				success : function(d) {
					debugger;
					game_id = d.game_id;
				}
			});
			$('#content-button').click(function() {
				getCoords();
				var data = JSON.stringify({
					game_id : game_id,
					point : coords
				});
				console.log('data: ' + data);
				$.ajax({
					url : 'http://192.168.0.25:8081/check_point',
					data : data,
					type : 'POST',
					error : function(e) {
						debugger;
						$('#content-text').text('Error: ' + e.status);
					},
					success : function(d) {
						debugger;
						console.log(d);
					}
				});
			});
			function getCoords() {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(d) {
						console.log(d.coords.latitude.toString() + ', '
								+ d.coords.longitude.toString());
						$('#content-text').text(
								d.coords.latitude.toString() + ', '
										+ d.coords.longitude.toString());
						coords = d.coords;
					}, function(e) {
						console.error(e);
					}, {
						maximumAge : 0
					});
				} else {
					$('#content-text').text('Geolocation not supported');
				}
			}
		});