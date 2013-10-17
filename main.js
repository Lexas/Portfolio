
window.onload = _init;
function _init(){
	gridpak.bootstrap();
	// var hammer = Hammer(body).on('swipe', function(){console.log('tap!, ')});	
	var svg = SVG('wheelContainer', '90%');
	svg.attr('id', 'svgWheel');
	var wheel;
	var centerBox2 = centerBox3 = centerBox1 = null;
	var centerMask, center, centerPos; /* ToDo: make closure */
	var container, iframe = null;
	/* bbox and rbox returns empty values in chrome, dunno which is the async function causing the problem, thanks chrome! */
	setTimeout(function(){
		$.get('media/wheel0.svg', _importWheel, 'text');
	}, 1);
	
	function _importWheel(data){
		wheel = svg.svg(data);
		_initWheel();
	}
	function _initWheel(){
		centerBox1 = svg.bbox();
		svg.attr('viewBox', '0 0 298.4 298.4'); //scale elements to fit svg
		centerMask = svg.mask();
		centerMask.attr({'id': 'centerMask'});
		resizeWindow();
		var highlights = [
			{
				link : 'jellyfish',
				thumb : 'medusa_small.gif', /* hint: /media/thumbs/? */
				media : 'jellyfish' /* hint: /samples/? */
			},
			{
				link : 'goat',
				thumb : 'goat.png',
				media : 'goat.png'
			}
		];
		var buffer = document.createDocumentFragment();
		var i=0;
		var len = highlights.length;
		for(i; i < len; i++){
			hl = wheel['hl'+(i+1)];
			hlBox = hl.bbox();
			var image = wheel.layer1.image( 'media/thumbs/' + highlights[i].thumb, highlights[i].width); /* ToDo: make conf file with prefixes */
			hl.attr({fill:'#fff', stroke:'#000', 'stroke-width':1});
			image.attr({ 
				x: hlBox.x, 
				y: hlBox.y,
				width: 50,
				height: 50
			});
			var mask = svg.mask().add(hl);
			image.maskWith(mask);
			image.link = highlights[i].media;
			image.click(loadWheelCenter);
		}

		// window.onresize = resizeWindow;
	}

	// document.getElementById('cv').onclick = function(ev){
	// 	var main = document.getElementById('mainPlane');
	// 	planes.main.area.animate(500, '<', 0).move(20*em, 0).scale(5)
	// 	.after( function(){
	// 		main.style.display = 'none';
	// 		document.getElementById('gallery').nextElementSibling.style.visibility = 'hidden';
	// 		ev.target.nextElementSibling.style.visibility = 'visible';
	// 	});
	// 	// main.style.transitionTimingFunction = 'ease-in';
	// 	// main.style.transform = 'translate('+ 100*em +'px , 0px) scale(2)';
	// 	var flag = true;
	// 	planes.about.area.animate(500, '<>', 0).scale(1).move(10*em, 0).attr({opacity:1})
	// 	.during(function(pos){
	// 		if(pos <= 0.5 && flag){
	// 			planes.about.blur = 1;
	// 			flag = false;
	// 			blur('about');
	// 		} else if(pos <= 1 && !flag){
	// 			planes.about.blur = 0;
	// 			flag = true;
	// 			blur('about');
	// 		}
	// 	});
	// };
	// var homes = document.getElementsByClassName('home');
	// var len = homes.length;
	// for(var i = 0; i < len; i++){
	// 	homes[i].onclick = function(ev){
	// 		var main = document.getElementById('mainPlane');
	// 		main.style.display = 'block';
	// 		planes.main.area.animate(500, '<', 0).move(0, 0).scale(1)
	// 		.after( function(){
	// 			var home = document.getElementsByClassName('home');
	// 			var len = home.length;
	// 			for(var i = 0; i < len; i++){
	// 				home[i].style.visibility = 'hidden';
	// 			}
	// 		});
	// 		var flag = true;
	// 		planes.about.area.animate(500, '<>', 0).scale(1).move(planes.about.x, 0).attr({opacity:0.4}).scale(0.3)
	// 		.during(function(pos){
	// 			if(pos <= 0.5 && flag){
	// 				planes.about.blur = 1;
	// 				flag = false;
	// 				blur('about');
	// 			} else if(pos <= 1 && !flag){
	// 				planes.about.blur = 2;
	// 				flag = true;
	// 				blur('about');
	// 			}
	// 		});
	// 	}
	// }
	
	// document.getElementById('gallery').onclick = function(ev){
	// 	var main = document.getElementById('mainPlane');
	// 	planes.main.area.animate(500, '<', 0).scale(1).move(-getWindowPercentage(100), 0)
	// 	.after( function(){
	// 		main.style.display = 'block';
	// 		document.getElementById('cv').nextElementSibling.style.visibility = 'hidden';
	// 		ev.target.nextElementSibling.style.visibility = 'visible';
	// 	});
	// 	var flag = true;
	// 	planes.about.area.animate(500, '<>', 0).scale(0.3).move(-20*em, 0)
	// 	.after(function(){
	// 		document.getElementById('aboutPlane').display = 'none';
	// 	});
	// }


	function getEm() {
		var emDiv = document.createElement('div');
		emDiv.style.width = '1em';
		document.body.appendChild(emDiv);
		var em = emDiv.offsetWidth;
		document.body.removeChild(emDiv);
		return em;
	}
	function getWindowDimensions(){
		var body = document.getElementById('hugger');
		return { 
			w: body.offsetWidth, 
			h: body.offsetHeight
		}
	}
	function loadWheelCenter(ev) {
		var wheelContainer = document.getElementById('wheelContainer').getElementsByTagName('div')[0];
		if ( container ){
			wheelContainer.removeChild(container);
		}
		container = document.createElement('div');
		iframe = document.createElement('iframe');
		iframe.src = 'samples/' + ev.target.instance.link + '/';
		iframe.onload = function(){
			iframe.width = centerBox3.width;
			iframe.height = centerBox3.height;
		}
		positionWheelCenter();
		wheelContainer.style.display = 'block';
		container.style.zIndex = "-1";
		iframe.setAttribute('id', 'wheelCenter');
		iframe.style.overflow = "hidden";
		iframe.style.border = "none";
		container.appendChild(iframe);
		wheelContainer.appendChild(container);
		container.onclick = function(ev){
			container.style.display = 'none';
			container.getElementsByTagName('div')[0].removeChild(iframe);
		};
		iframe.onclick = function(ev){
		    if(e && e.stopPropagation) {
		        e.stopPropagation();
		    } else {
		          e = window.event;
		          e.cancelBubble = true;
		    }
		};
	}
	function positionWheelCenter () {
		/* toDo: no need to set properties each time */
		if(iframe){
			iframe.width = centerBox3.width;
			iframe.height = centerBox3.height;
		}
		if(container){
			if(typeof document.getElementById('wheelContainer').style.webkitMask != 'undefined'){
				container.style.webkitMaskBoxImage = 'url(media/center.svg) stretch';
				container.style.width = (svg.node.clientHeight) + 'px';
				container.style.height = (svg.node.clientHeight) + 'px';
				// container.style.left = svg.node.clientHeight*0.0004  + "px";
				// container.style.top = -svg.node.clientHeight*0.0005 + "px";
			} else {
				console.log(centerBox1, centerBox2, centerBox3);
				container.style.width = (centerBox2.width) + 'px';
				container.style.height = (centerBox2.height) + 'px';
				container.style.left = centerBox3.y  + "px";
				container.style.top = centerBox3.y + "px";
				container.style.mask = 'url(#centerMask)';
			}
		}
	}
	function resizeWindow (ev) {
		window.onresize = null;
		var rezise = setTimeout(function(){
			if (center != null) {
				center.remove();
				delete center;
			}
			center = svg.path(wheel.center.attr('d'));
			center.attr({fill:'#fff', stroke:'#fff', 'stroke-width': 0.5});
			centerBox2 = svg.rbox();
			centerBox3 = wheel.center.rbox();
			/* Note: wheel.center keeps displayed measures not obtainable trough defs */
			center.translate(centerBox3.y*0.05, centerBox3.y*0.07);
			console.log(center);
			center.scale(
				((centerBox2.cy) / (centerBox1.cy))
			);
			centerMask.add(center);
			if(ev){
				positionWheelCenter();
			}
			window.onresize = resizeWindow;
		}, 500);
	}
	function showIframe(ev){ //ToDo: make a closure to save states
		var container = document.getElementById('iframeContainer');
		var iframe = document.createElement('iframe');
		iframe.src = 'samples/' + ev.target.instance.link + '/';
		iframe.onload = function(){
			iframe.width = iframe.contentDocument.getElementById('hugger').offsetWidth;
			iframe.height = iframe.contentDocument.getElementById('hugger').offsetHeight;
		}
		container.style.display = 'inline-table';
		container.getElementsByTagName('div')[0].appendChild(iframe);
		container.onclick = function(ev){
			container.style.display = 'none';
			container.getElementsByTagName('div')[0].removeChild(iframe);
		};
		iframe.onclick = function(ev){
		    if(e && e.stopPropagation) {
		        e.stopPropagation();
		    } else {
		          e = window.event;
		          e.cancelBubble = true;
		    }
		};
	}
}

