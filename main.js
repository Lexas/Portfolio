
window.onload = _init;
function _init(){
	var ajax = qwest;
	gridpak.bootstrap();
	// var hammer = Hammer(body).on('swipe', function(){console.log('tap!, ')});	
	var svg = SVG('wheelContainer');
	svg.attr('id', 'svgWheel');
	var wheel;
	var centerBox2 = centerBox3 = centerBox1 = null;
	var centerMask, center, centerPos; /* ToDo: make closure */
	var iframeContainer = document.getElementById('iframeContainer');
	var iframe = iframeContainer.getElementsByTagName('iframe')[0];
	/* bbox and rbox returns empty values in chrome, dunno which is the async function causing the problem, thanks chrome! */
	setTimeout(function(){
		$.get('media/wheel0.svg', _importWheel, 'text');
	}, 100);
	_initMenus();
	function _importWheel(data){
		wheel = svg.svg(data);
		_initWheel();
	}
	function _initMenus () {
		var loaded = ['homePage', 'cvPage', 'contactPage'];
		var current = "homePage";
		var links = document.getElementsByTagName('nav')[0].getElementsByTagName('a');
		var len = links.length;
		for (var i = 0; i < len; i++){
			links[i].onclick = open;
		}
		function open (ev) {
			var page = ev.target.dataset.open;
			if(current != page){
				if(loaded.indexOf(page) <= 0){ //not loaded yet
					ajax.get(page).success(loadPage);
				} else {
					var currPage = document.getElementById(current);
					currPage.style.display = 'none';
					var div = document.getElementById(page);
					div.style.position = 'relative';
					div.style.display = 'inline-block';
				}
			}
			function loadPage(data){
				/* ToDo: put in closure */
				var currPage = document.getElementById(current);
				currpage.style.display = 'none';
				var hugger = document.getElementById('hugger');
				var div = document.createElement('div');
				div.innerHtml = data;
				div.style.position = 'relative';
				hugger.appendChild(div);
				current = ev.target.dataset.open;
				loaded.push(current);
				div.style.display = 'inline-block';
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
				media : 'jellyfish', /* hint: /samples/? */
				type : 'code'
			},
			{
				link : 'goat',
				thumb : 'goat.png',
				media : 'goat.png',
				type : 'image'
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
			image.type = highlights[i].type;
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
		iframeContainer.style.display = 'none';
		iframeContainer.removeChild(iframe);
		if(ev.target.instance.type == 'image'){
			iframe = document.createElement('img');
		} else {
			iframe = document.createElement('iframe');
		}
		iframe.src = 'samples/' + ev.target.instance.link + '/';
		iframeContainer.appendChild(iframe);
		positionWheelCenter();
		iframeContainer.style.display = 'block';
	}
	function positionWheelCenter () {
		/* toDo: no need to set properties each time */
		if(iframeContainer){
			if(typeof document.getElementById('wheelContainer').style.webkitMask != 'undefined'){
				iframeContainer.style.webkitMaskBoxImage = 'url(media/center.svg) stretch';
			} else {
				iframeContainer.style.left = '-1px';
				iframeContainer.style.top = '-2px';
				iframeContainer.style.mask = 'url(#centerMask)';
			}
		}
	}
	function resizeWindow (ev) {
		window.onresize = null;
		var resize = setTimeout(function(){
			if (center != null) {
				center.remove();
				delete center;
			}
			center = svg.path(wheel.center.attr('d'));
			center.attr({fill:'#fff', stroke:'#fff', 'stroke-width': 0.5});
			centerBox2 = svg.rbox();
			centerBox3 = center.rbox();
			/* Note: wheel.center keeps displayed measures not obtainable trough svg defs */
			/* Note: webkit wont translate, but it keeps the position of the mask */
			var ty = centerBox3.y + centerBox3.cy + window.pageYOffset;
			var tx = centerBox3.x + centerBox3.cx + window.pageXOffset;
			center.translate(tx, ty);
			center.scale(centerBox2.cx / centerBox1.cx);
			centerMask.add(center);
			if(ev){
				positionWheelCenter();
			}
			window.onresize = resizeWindow;
		}, 500);
	}
}

