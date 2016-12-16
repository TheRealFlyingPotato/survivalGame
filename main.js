window.onload = beginGame;

function loadScript(url)
{    
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}

function beginGame() {
	g_VERSION = "0.0.07"
	g_MAPINFO = 0;
	try {
	screen.orientation.lock('landscape');
		}
	catch(err) {
		var vvvvv = true;
	}	
	$("#version")[0].innerHTML = g_VERSION
	$("#alert")[0].innerHTML = "Welcome!"



	/****************** GLOBAL CONSTANTS ******************/
	g_MAP_SIZE = 2500;
	if (false)
		g_MAP_SIZE = 30
	g_ui = "map" //map, inv
	/*//alert($("window").width())
	var GG = Math.floor(($(window).width()-35)/25);
	console.log("GG: " + GG);
	g_VIEW_WINDOW = Math.min(11, GG);*/
	g_MIN_WIN_SIZE = 20;
	g_VIEW_WINDOW = 12; //default
	wSize = $(window).width()
	while ((wSize-g_MIN_WIN_SIZE) / g_MIN_WIN_SIZE < g_VIEW_WINDOW)
		g_VIEW_WINDOW -= 2;
	g_VIEW_WINDOW--;
	console.log("cells" + g_VIEW_WINDOW);
	g_PIC_SRC = {"t" : "http://icons.iconarchive.com/icons/iconsmind/outline/256/Tree-3-icon.png",
			   "x" : "http://www.freeiconspng.com/uploads/rock-icon-0.png",
				"s" : "img/stones.png"}
    g_CHARACTER_IMG = "<img src = 'https://cdn3.iconfinder.com/data/icons/outdoor-and-camping-icons/512/Hiking-512.png' href = '#' id = 'character'/>";


	refreshGridSize();
	/****************** GLOBAL VARIABLES ******************/
	g_map = [];
	g_player = {};
	g_player.xpos = Math.floor(g_MAP_SIZE / 2);
	g_player.ypos = Math.floor(g_MAP_SIZE / 2);
	g_player.inventory = {};
	console.log(g_player);

	createMap();
	drawMap();
	g_TIME = [8, 0, 0];
	changeBG();
	displayTime();
	examine();

}

function getNewObject() {
	num = Math.floor(Math.random() * 100) + 1;
	if (num < 75)
		return "_";
	else if (num < 80)
		return "x";
	else if (num < 90)
		return "s";
	else
		return "t";
}

function createMap() {

	for (var y = 0; y < g_MAP_SIZE; y++) {
		var newRow = [];
		for (var x = 0; x < g_MAP_SIZE; x++) {
			newRow.push({"main" : getNewObject()});
		}
		g_map.push(newRow);
	}
	console.log(g_map);
	g_map[g_player.ypos][g_player.xpos] = {"main" : "_"}

}

function playerLoc() {
	return [g_player.xpos, g_player.ypos]
}

function drawMap() {
	while ($("#grid").children().length)
		$("#grid").children()[0].remove();
	var bg;
	var gRow;
	var ch = "";

	topX =  g_player.xpos - Math.floor(g_VIEW_WINDOW / 2);
	topY = g_player.ypos - Math.floor(g_VIEW_WINDOW / 2);
	if (topX < 0)
		topX = 0;
	else if (topX > g_MAP_SIZE - g_VIEW_WINDOW)
		topX = g_MAP_SIZE - g_VIEW_WINDOW; 
	if (topY < 0)
		topY = 0;
	else if (topY > g_MAP_SIZE - g_VIEW_WINDOW)
		topY = g_MAP_SIZE - g_VIEW_WINDOW; 


	mvtA = [playerLoc(),playerLoc(),playerLoc(),playerLoc()];
	mvtA[3][0]++; //up down left right
	mvtA[2][1]--;
	mvtA[1][0]--;
	mvtA[0][1]++;
	for (var k = 0; k < 4; k++)
		mvtA[k] = mvtA[k].toString();
	//console.log(mvtA);
	for (var cNum = 0; cNum < g_VIEW_WINDOW; cNum++) {
		$("#grid").append("<div class = 'gridrow' />");
		gRow = $($("#grid").children()[cNum]);
		for (var rNum = 0; rNum < g_VIEW_WINDOW; rNum++) {
			var cLoc = topX + cNum;
			var rLoc = topY + rNum;
			var imgsrc = "url(\'" + g_PIC_SRC[g_map[cLoc][rLoc].main] + "\')"
			ch = "";
			if (g_player.xpos == cLoc && rLoc == g_player.ypos)
				ch = g_CHARACTER_IMG;
			gSquare = gRow.append("<div class = 'gridsquare'>" + ch + "</div>").children()[rNum];
			gSquare.style.background = imgsrc;
			if (g_player.xpos == cLoc && rLoc == g_player.ypos)
				$(gSquare).css("background","rgba(256, 256, 256, .9)");
			else if(mvtA.indexOf([cLoc, rLoc].toString()) != -1) {
				$(gSquare).css("background-color","rgba(256, 256, 256, .9)");
				$(gSquare).attr('onClick','moveP(mvtA.indexOf([' + cLoc + ',' + rLoc + '].toString()))');
				// console.log(gSquare.onClick)
			}
			else
				$(gSquare).css("background-color","rgba(200, 200, 200, .9)");



		}
	}
	refreshGridSize();
}


document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;
    // console.log(e.keyCode)

    if (e.keyCode == '38' || e.keyCode == "87") {
        moveP(1);
    }
    else if (e.keyCode == '40' || e.keyCode == "83") {
        // down arrow
        moveP(3)

    }
    else if (e.keyCode == '37' || e.keyCode == "65") {
       // left arrow
       moveP(2)
    }
    else if (e.keyCode == '39' || e.keyCode == "68") {
       // right arrow
       moveP(0)

    }
    else if (e.keyCode == '32') {
    	collect();
    }

}

function moveP(direction) {

	if ($("#grid")[0].style.display != "none")
	{
		var startX = g_player.xpos;
		var startY = g_player.ypos;


		switch (direction)
		{
			case 1:
				g_player.xpos--;
				break;
			case 3:
				g_player.xpos++;
			    break;
			case 2:
			    g_player.ypos--;
			    break;
			case 0:
			    g_player.ypos++;
			    break;
		}

		g_player.ypos = Math.max(0, g_player.ypos)
		g_player.xpos = Math.max(0, g_player.xpos)
		g_player.ypos = Math.min(g_MAP_SIZE - 1, g_player.ypos)
		g_player.xpos = Math.min(g_MAP_SIZE - 1, g_player.xpos)

		var objT = mapInfo(focusedObj().main)
		if (objT.solid) {
			$("#alert")[0].innerHTML = "You cannot walk through a " + objT.name + ".";
			g_player.ypos = startY;
			g_player.xpos = startX;
		}
		else {
			setTime();
		    drawMap();
		    examine();
		    $("#alert")[0].innerHTML = "";
		}
	}
}

function focusedObj(x, y, relative) {
	if (x == undefined)
		x = 0 
	if (y == undefined)
		y = 0
	if (relative == undefined)
		relative = 1

	if (relative) {
		x += g_player.xpos
		y += g_player.ypos
	}

	return g_map[x][y]
}

function examine() {
	g_collectable = false;
	clearDiv("poscontents");
	$("#mainbtn").hide();
	item = mapInfo(focusedObj().main)
	$("#poscontents").append("<div style = 'font-weight: bold'>" + item.name + "</div>")
	if (item.collectable)	
	{
		if (hasItem(item.collectable)) {
			$("#poscontents").append("<div> Collectable by " + item.collectable + "</div>")
			console.log("black")
			$("#mainbtn").show();
			g_collectable = true;
		}
		else {
			$("#poscontents").append("<div style = 'color: red !important'> Collectable by " + item.collectable + "</div>")
			console.log("red?")}
	}
	$("#posimg").css("background", "url('" + g_PIC_SRC[focusedObj().main] +"')")

}

function hasItem(item) {
	if (item == "hand")
		return true;
	if ($.inArray(item, Object.keys(g_player.inventory)) != -1)
		return true;
	return false;
}

function clearDiv(container) {
	while ($("#" + container).children().length)
		$("#" + container).children()[0].remove();
}

function refreshGridSize() {
	g_cSize = Math.min(Math.floor($(window).width() / (g_VIEW_WINDOW + 3)),Math.floor($(window).height() / (g_VIEW_WINDOW + 5)))
	g_cSize = Math.max(g_MIN_WIN_SIZE, g_cSize);
	$(".gridsquare").css("width", g_cSize + "px");
	$(".gridsquare").css("height", g_cSize + "px");
	$("#posimg").css("width", g_cSize + "px");
	$("#posimg").css("height", g_cSize + "px");
}

$(window).resize(function() {
  //$( "#log" ).append( "<div>Handler for .resize() called.</div>" );
	g_VIEW_WINDOW = 12; //default
	wSize = $(window).width()
	while ((wSize-g_MIN_WIN_SIZE) / g_MIN_WIN_SIZE < g_VIEW_WINDOW)
		g_VIEW_WINDOW -= 2;
	g_VIEW_WINDOW--;
	//console.log("cells" + g_VIEW_WINDOW);
  drawMap();
});

function setTime(newTime, type, relative) {
	if (newTime == undefined)
		newTime = 8;
	if (type == undefined)
		type = "seconds";
	if (relative == undefined)
		relative = 1;

	if (type == "seconds")
		g_TIME[2] += newTime;
	//console.log (type + g_TIME)
	if (type == "hours") {
		g_TIME[0] += newTime;
	}
	if (g_TIME[2] > 56) {
		g_TIME[2] -= 60;
		g_TIME[1] += 1;
	}
	if (g_TIME[1] > 56) {
		g_TIME[1] -= 60;
		g_TIME[0] += 1;
	}
	if (g_TIME[0] > 23) {
		g_TIME[0] = 0;
	}  

	displayTime();
	changeBG();
}

function getTime(type) {
	if (type == undefined)
		return g_TIME;
	else if (type == "hour")
		return g_TIME[0];
	else if (type == "minute")
		return g_TIME[1];
}

function displayTime() {
	var hr = getTime("hour");
	var sign = " AM"
	if (hr == 0) {
		hr = 12;
	} else
	if (hr > 12) {
		hr -= 12;
		sign = " PM"
	}
	var minute = getTime("minute")
	minute = (minute < 10 ? "0" + minute : minute)
 	$("#time")[0].innerHTML = hr + ":" + minute + sign;
}

function changeBG() {

	var cHour = getTime("hour");
	var coCode;
	coCode = Math.abs(cHour - 12);
	coCode = 13 - coCode
	if (coCode > 9)
		coCode = {10 : "A", 11: "B", 12: "C", 13: "D"}[coCode];
	coCode = "#" + coCode + coCode + coCode 
	$("body").css("background", coCode) 

}

function uiSwitch(active) {
	$(".uiholder").hide();
	$("#" + active).show();
	g_ui = {"inventory": "inv", "mainboard":"map"}[active]
}

function collect() {
	if (g_ui == "map" && g_collectable)
	{
		var item = mapInfo(focusedObj().main);
		var drops = item.drop;
		for (var k = 0; k < drops.length; k++)
		addItems(drops[k].name, randInt(drops[k].min, drops[k].max))
		setFocusedObj("_");
		examine();
	}
}

function setFocusedObj(sym) {
	g_map[g_player.xpos][g_player.ypos] = sym;
}

function randInt(from, to) {
	return Math.floor(Math.random() * to) + from
}

function addItems(item, amount) {
	if (hasItem(item)) {
		console.log(g_player.inventory[item])
		g_player.inventory[item] += amount;
		$("#inv_" + item)[0].innerHTML = g_player.inventory[item];
	}
	else {
		g_player.inventory[item] = amount;
		$("#inventory").append("<div class='inventoryitem' id='inv_" + item + "'>"+amount+"</div>")
		$("#inv_Stones").css("background", 'url(\"' + itemInfo(item).imgsrc + '\")')
	} 
}

function mapInfo(mapItem) {
	if (mapItem == undefined)
		mapItem = "_";
	if (g_MAPINFO == 0)
		g_MAPINFO = {
			"t" : {
				"name": "Tree",
				"solid" : 0,
				"collectable": "axe",
				"drop" : [{
						"name" : "Wood",
						"min" : 3, "max" : 8,
						"chance" : 1
					}]     
		    },
			"x" : {
				"name" : "Boulder",
				"solid" : 1,
				"collectable": "pick",    
				"drop" : [{"name" : "Stones","min" : 3, "max" : 10, "chance" : 1}] 
			},
			"_" : {
				"name" : "",
				"solid" : 0,
				"collectable": 0,    
			}, 
			"s" : {
				"name" : "Stones", 
				"solid" : 0,
				"collectable": "hand",
				"drop" : [
					{"name" : "Stones",	"min" : 1, "max" : 4, "chance" : 1}
				]

			},
		} 
	return g_MAPINFO[mapItem];
}

function itemInfo(item) {
	try {
		g_ITEMINFO == 0
	}
	catch(err)
	{
		g_ITEMINFO = {
			"Stones" : {
				"imgsrc" : "img/items/Rock_Icon.png"
			}
		}
	}
	return g_ITEMINFO[item]
}
