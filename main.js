
window.onload = _init;

function _init(){
	var em = getEm();
	gridpak.bootstrap();
	var body = document.getElementsByTagName('body')[0];
	var hammer = Hammer(body).on('swipe', function(){console.log('tap!, ')});	
	var colors = [
		'#0A503A',
		'#ADE188',
		'#00736A',
		'#3FBEB9',
	];
	var planes = [];
	planes.main = {
		name : "main",
		x : 0,//getWindowPercentage(40),
		y : 0, //getWindowPercentage(-7),
		rotate : 7,
		scale : 1,
		opacity : 1,
		blur : 0,
		array : [
			[0, 1, 1, 1, 1, 1, 1, 1, 1], 2,
			[1, 1, 1, 1, 1, 1, 1, 1, 1], 2,
			[1, 1, 1, 1, 1, 1, 1, 1, 1], 4,
			[0, 1, 1, 1, 1, 1, 1, 1, 0, 1], 3,
			[0, 0, 1, 1, 1, 1, 1, 1, 1, 1], 3,
			[0, 0, 0, 0, 1, 1, 1, 1, 1, 1], 1,
		],
		extras : function(){
			// var svg = planes.main.svg;

			// var gradient = svg.gradient('radial', function(stop) {
			//   stop.at({ offset: 0, color: '#000', opacity: 0.5 });
			//   stop.at({ offset: 0.5, color: '#000', opacity: 0 });
			//   stop.at({ offset: 0.5, color: '#fff', opacity: 0 });
			//   stop.at({ offset: 0.7, color: '#fff', opacity: 0.5 });
			//   stop.at({ offset: 1, color: '#fff', opacity: 0.0 });
			// });
			// gradient.from(0.45, 0.25).to(0.5, 0.5).radius(0.5);
			// var proportion = getWindowPercentage(100);
			// var shadow = svg.rect(proportion, proportion).fill(gradient);
			// proportion /= -4;
			// shadow.move(proportion, proportion);
			// var mask = svg.mask().add(planes.main.area);
			// shadow.maskWith(mask);


			var highlights = {
				jellyfish : {
					link : 'http://www.google.com',
					thumb : 'media/medusa_small.gif',
					cell1: 14,
					cell2: 14,
					width: 2*8*em,
					height: 1*8*em,
					moveX : 3*8*em,
					moveY : 0.5*8*em,
					linkX : 3*8*em,
					linkY : 1*8*em
				}
			};
			drawThumbs();
			function drawThumbs(){
				var highlightLinks = document.getElementsByClassName('highlight');
				var buffer = document.createDocumentFragment();
				var i = 0;
				var svg = planes.main.svg;
				var triangles = planes.main.area._children;
				for(i in highlights){
					var image = planes.main.area.image(highlights[i].thumb, highlights[i].width).move(highlights[i].moveX, highlights[i].moveY);
					var triangle1 = triangles[highlights[i].cell1];
						triangle1.fill('#fff').stroke({width:0}); //fff
					var mask = svg.mask().add(triangle1);
					if (typeof(highlights[i].cell2) != 'undefined'){
						var triangle2 = triangles[highlights[i].cell2];
						triangle2.fill('#fff').stroke({width:0}); //fff
						mask.add(triangle2);
					}
					image.maskWith(mask);
					image.masker.click(function(){console.log('asdf')});

					var a = document.createElement('a');
					// var img = document.createElement('img');
					// img.src = highlights[i].thumb;
					a.style.width = highlights[i].width+"px";
					a.style.height = highlights[i].height+"px";
					a.href = highlights[i].link;
					a.style.left = highlights[i].linkX + "px";
					a.style.top = highlights[i].linkY + "px";
					a.className = 'highlight';
					// a.appendChild(img);
					buffer.appendChild(a);
				}
				var mainPlane = document.getElementById('mainPlane');
				mainPlane.appendChild(buffer);
			}
		}
	};
	planes.about = {
		name : "about",
		x : getWindowPercentage(5),
		rotate : 0,
		scale : 0.3,
		opacity : 0.4,
		blur : 2,
		array : [
			[0, 1, 1, 1, 1], 1,
			[1, 1, 1, 1], 2,
			[1, 1, 1, 1], 4,
			[1, 1, 1, 1], 2,
			[0, 1, 1, 1, 1], 4,
			[0, 1, 1, 1, 1], 1,
			[1, 1, 1, 1], 2,
			[1, 1, 1, 1], 4,
			[1, 1, 1, 1], 2,
			[0, 1, 1, 1, 1], 1,
			[1, 1, 1, 1], 2,
			[1, 1, 1, 1], 4,
			[1, 1, 1, 1], 2,
			[0, 1, 1, 1, 1], 4,
			[0, 1, 1, 1, 1], 1,
			[1, 1, 1, 1], 2,
			[1, 1, 1, 1], 4,
			[1, 1, 1, 1], 2,
			[0, 1, 1, 1, 1], 1
		]
	}
	var planesLen = planes.length;
	var triangleWorkers = [];
	var plane = 0;
	for(plane in planes){
		planes[plane].svg = SVG(plane+'Plane');
		var worker = new Worker('workerTriangleArray.js');
		worker.onmessage = drawPanel;
		triangleWorkers.push(worker);
		var data = {
			array : planes[plane].array,
			base : 8*em,
			plane : plane
		};
		worker = null;
		triangleWorkers[triangleWorkers.length-1].postMessage(data);
	}
	window.onresize = resizeWindow;


	document.getElementById('cv').onclick = function(ev){
		var main = document.getElementById('mainPlane');
		planes.main.area.animate(500, '<', 0).move(50*em, 0).scale(10)
		.after( function(){
			main.style.display = 'none';
			document.getElementById('gallery').nextElementSibling.style.visibility = 'hidden';
			ev.target.nextElementSibling.style.visibility = 'visible';
		});
		// main.style.transitionTimingFunction = 'ease-in';
		// main.style.transform = 'translate('+ 100*em +'px , 0px) scale(2)';
		var flag = true;
		planes.about.area.animate(500, '<>', 0).scale(1).move(25*em, 0).attr({opacity:1})
		.during(function(pos){
			if(pos <= 0.5 && flag){
				planes.about.blur = 1;
				flag = false;
				blur('about');
			} else if(pos <= 1 && !flag){
				planes.about.blur = 0;
				flag = true;
				blur('about');
			}
		});
	};
	var homes = document.getElementsByClassName('home');
	var len = homes.length;
	for(var i = 0; i < len; i++){
		homes[i].onclick = function(ev){
			var main = document.getElementById('mainPlane');
			main.style.display = 'block';
			planes.main.area.animate(500, '<', 0).move(0, 0).scale(1)
			.after( function(){
				var home = document.getElementsByClassName('home');
				var len = home.length;
				for(var i = 0; i < len; i++){
					home[i].style.visibility = 'hidden';
				}
			});
			var flag = true;
			planes.about.area.animate(500, '<>', 0).scale(1).move(planes.about.x, 0).attr({opacity:0.4}).scale(0.3)
			.during(function(pos){
				if(pos <= 0.5 && flag){
					planes.about.blur = 1;
					flag = false;
					blur('about');
				} else if(pos <= 1 && !flag){
					planes.about.blur = 2;
					flag = true;
					blur('about');
				}
			});
		}
	}
	
	document.getElementById('gallery').onclick = function(ev){
		var main = document.getElementById('mainPlane');
		planes.main.area.animate(500, '<', 0).scale(1).move(-getWindowPercentage(100), 0)
		.after( function(){
			main.style.display = 'block';
			document.getElementById('cv').nextElementSibling.style.visibility = 'hidden';
			ev.target.nextElementSibling.style.visibility = 'visible';
		});
		var flag = true;
		planes.about.area.animate(500, '<>', 0).scale(0.3).move(-20*em, 0)
		.after(function(){
			document.getElementById('aboutPlane').display = 'none';
		});
	}

	function blur(name){
		var current = document.getElementById(name+"Plane");
		var blur = planes[name].blur;
		current.style.webkitFilter = "url(#blur"+ blur +")";
		current.style.filter = "url(#blur"+ blur +")";
	}
	function drawPanel (ev) {
		var plane = planes[ev.data.plane];
		var svg = plane.svg; //todo el plano
		plane.area = plane.svg.group(); //area abarcada por objetos
		var area = plane.area;
		area.move(plane.x, plane.y);
		area.scale(plane.scale);
		area.opacity(plane.opacity);
		var len = ev.data.array.length;
		var vertex = ev.data.array;
		for(var i = 0; i < len; i++){
			var color = colors[Math.floor(Math.random()*4)];
			area.polygon(vertex[i]).fill(color).stroke({color : color, width: '0.7 / plane.scale'});
		}
		blur(ev.data.plane);
		typeof(plane.extras) == 'function' ? plane.extras() : null;
	}

	function getEm() {
		var emDiv = document.createElement('div');
		emDiv.style.width = '1em';
		document.body.appendChild(emDiv);
		var em = emDiv.offsetWidth;
		document.body.removeChild(emDiv);
		return em;
	}
	function getWindowPercentage(percentage){
		var body = document.getElementsByTagName('body')[0];
		return body.offsetWidth * (percentage / 100);
	}
	function resizeWindow () {
		window.onresize = null;
		var rezise = setTimeout(function(){
			window.onresize = resizeWindow;
		}, 500);
	}
}

