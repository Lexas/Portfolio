
window.onload = _init;
function _init(){
	gridpak.bootstrap();
	// var hammer = Hammer(body).on('swipe', function(){console.log('tap!, ')});	
	var svg = SVG('wheelContainer');
	svg.attr('id', 'svgWheel');
	var wheel;
	var centerBox2 = centerBox3 = centerBox1 = null;
	var centerMask, center, centerPos; /* ToDo: make closure */
	var container, iframe = null;
	/* bbox and rbox returns empty values in chrome, dunno which is the async function causing the problem, thanks chrome! */
	setTimeout(function(){
		$.get('media/wheel0.svg', _importWheel, 'text');
	}, 1);
	_initMenus();
	function _importWheel(data){
		wheel = svg.svg(data);
		_initWheel();
	}
	function _initMenus () {
		var loaded = [];
		var current = "wheelContainer";
		$('a').on('click', open);
		function open (ev) {
			var page = ev.target.href.split('#')[1] + "Area";
			page = page == '' ? 'wheelContainer' : page;
			if(current != page){
				if(loaded.indexOf(page) >= 0){
					$('#'+current).css('display', 'none');
					$('#'+page).css('display', 'inline-block');
				} else {
					$.get('pages/' + ev.target.href.split('#')[1], loadPage);
				}
			}
			function loadPage(data){
				current = ev.target.id;
				loaded.push(current);
				$('#'+current).css('display', 'none');
				$('#'+hugger).append(data);
			}
		}
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
		window.onresize = resizeWindow;
	}
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
		if(container){
			if(typeof document.getElementById('wheelContainer').style.webkitMask != 'undefined'){
				container.style.display = 'inline-table';
				iframe.style.width = "100%";
				iframe.style.height = "100%";
				iframe.style.margin = "auto";
				iframe.style.marginTop = centerBox2.cy*0.9 + "px";
				container.style.webkitMaskBoxImage = 'url(media/center.svg) stretch';
				container.style.width = (svg.node.offsetWidth) + 'px';
				container.style.height = (svg.node.offsetHeight) + 'px';
				container.style.marginLeft = -centerBox2.x  + "px";
				container.style.marginTop = centerBox2.y + "px";
			} else {
				iframe.width = centerBox3.width;
				iframe.height = centerBox3.height;
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
			centerBox3 = center.rbox();
			/* Note: wheel.center keeps displayed measures not obtainable trough defs */
			center.translate(centerBox3.y*0.043, centerBox3.y*0.07);
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

