
window.onload = _init;

var inch;

function _init(){
	gridpak.bootstrap();
	var body = document.getElementsByTagName('body')[0];
	var hammer = Hammer(body).on('swipe', function(){console.log('tap!, ')});
	var panels = document.getElementById('mainContainer').children;
	triangles = document.getElementsByClassName('tri');
	var i, len;
	var colors = [
		'#3B2004',
		'#503D0F',
		'#0A503A',
		'#ADE188',
		'#00736A',
		'#3FBEB9',
	];
	len = panels.length;
	i = 0;
	for(; i < len; i++){
		if(panels[i].id != "" && hasClass(panels[i], 'panel') ){
			panels[i].style.display = 'none';
		}
	}
	i = 0;
	len = triangles.length;
	for(; i < len; i++){
		triangles[i].style.borderColor = colors[Math.floor(Math.random()*5)];
	}
	i = 0;
	for(; i < panels.length; i++){ //recalculate panels.length
		var panel = panels[i];
		if(panel.id != "" && hasClass(panel, 'panel')){
			panel.innerHTML += panel.outerHTML;
			var subPanel = panel.getElementsByClassName('panel')[0];
			subPanel.removeAttribute('id');
			subPanel.style.zIndex = "-1";
			subPanel.style.position = "absolute";
			subPanel.style.left = "0";
			subPanel.style.top = "0";
			panel.style.display = 'block';
			subPanel.style.display = 'block';
		}
	}
	blur();
}

function blur(){	
	var blur = [
		['mainPanel'],
		[],
		[],
		['aboutPanel']
	];
	var blurs = blur.length;
	var i = 0;
	for(; i < blurs; i++){
		var panels = blur[i].length;
		var j = 0;
		for(; j < panels; j++){
			var current = document.getElementById(blur[i][j]);
			current.style.webkitFilter = "url(#blur"+ i +")";
			current.style.filter = "url(#blur"+ i +")";
			current.style.opacity = 0.5 + 1/i;
			var subPanel = current.getElementsByClassName("panel")[0];
			subPanel.style.webkitFilter = "url(#blur"+ (i+1) +") url(#sat1)";
			subPanel.style.webkitFilter = "url(#blur"+ (i+1) +") url(#sat1)";
			subPanel.style.opacity = 0.5 + 1/i;
		}
	}
}
function hasClass(element, className) {
    return element.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className);
}

