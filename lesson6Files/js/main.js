//Утилиты планирования
//Redmine — диаграмма Ганта
//Kanban
//
//Простые описания лицензий
//tldrlegal.com

$(document).ready(function () {
    window.addEventListener( 'tizenhwkey', function( ev ) {
        if( ev.keyName === "back" ) {
            var activePopup = document.querySelector( '.ui-popup-active' ),
                page = document.getElementsByClassName( 'ui-page-active' )[0],
                pageid = page ? page.id : "";

            if( pageid === "one" && !activePopup ) {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {
                }
            } else {
                window.history.back();
            }
        }
    } );
    
    
	
	
    $('#button-write-file').click(function() {
		writeFile('myFile.txt', function(wr) {
			$('#popup-data-from-file').text(wr ? 'File successfully written' : 'Error occured');
		});
    });
    
    $('#button-read-file').click(function() {
    	readFile('myFile.txt', function(content) {
        	$('#p-data-from-file').html(content || '<span style="color: red;">File NOT FOUND</span>');
    	});
    });
    $('#button-delete-file').click(function() {
    	deleteFile('myFile.txt', function(dl) {
        	$('#popup-data-from-file').text(dl ? 'File successfully deleted' : 'Error occured');
    	});
    });
    
    function writeFile(path, f) {
    	tizen.filesystem.resolve('documents', onSuccess, function(e) {
    		console.error(e);
    		f();
    	}, 'rw');
    	
    	function onSuccess(dir) {
    		var file = null;
	    	try {
	    		file = dir.resolve(path);
	    	} catch(e) {
	    		file = dir.createFile(path);
	    		f();
	    	}
			
	    	try {
	    		file.openStream('a', function(str) {
	    			try {
	    				str.write($('#textarea-data-to-write').val() + '\r\n');
	    				str.close();
	    				$('#textarea-data-to-write').val('');
	    				f(1);
	    			} catch (e) {
	    				console.error(e);
	    	    		f();
	    			}
	    		}, function(e) {
					console.error(e);
		    		f();
	    		});
	    	} catch(e) {
	    		console.error(e);
	    		f();
	    	}
    	}
    }
    function readFile(path, f)  {
    	tizen.filesystem.resolve('documents', onSuccess, function(e) {
    		console.error(e);
    		f();
    	}, 'rw');
    	
    	function onSuccess(dir) {
	    	try {
	    		var file = dir.resolve(path);
	    	} catch(e) {
	    		console.error(e);
	    		f();
	    	}
	    	try {
	    		file.openStream('r', function(str) {
	    			try {
	    				var content = str.read(str.bytesAvailable);
	    				str.close();
	    				f(content);
	    			} catch (e) {
	    				console.error(e);
	    	    		f();
	    			}
	    		}, function(e) {
					console.error(e);
		    		f();
	    		});
	    	} catch(e) {
	    		console.error(e);
	    		f();
	    	}
    	}
    }
    function deleteFile(path, f) {
    	var file = null;
    	try {
    		file = dir.resolve(path);
    	} catch(e) {
    		f();
    	}
    	
    	tizen.filesystem.resolve('documents', onSuccess, function(e) {
    		console.error(e);
    		f();
    	}, 'rw');
    	
    	function onSuccess(dir) {
	    	try {
	    		dir.deleteFile(dir.fullPath + '/' + path);
	    		f(1);
			} catch (e) {
	    		console.error(e);
	    		f();
			}
    	}
    }
});