/* 2012 - Guilherme Rossato */

window.addEventListener("load", windowLoadHandler, false);

function windowLoadHandler() {
	canvasApp()
}

var setExperiment;
var showSpeed = 1;

function canvasApp() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var size = new Object();

	function resize() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		size.x = window.innerWidth;
		size.y = window.innerHeight;
	}
	window.addEventListener("resize", resize, false);
	resize();
	var exp = new Array();
	function createExperiment(_name, _lineCount, _ticks, _genLine) {
		return {
			name: _name,
			lineCount: _lineCount,
			ticks: _ticks,
			genLine: _genLine,
			lines: []
		}
	}

	function expInit() {
		exp[0] = createExperiment("Random points", 50, 300, //name,lineCount,frames//
		function (id) {
			//id is a integer between 0 and the lineCount.
			var res = new Object();
			res.color = "#800";
			res.color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
			res.pts = new Array(9);
			for (var a = 0; a < 9; a++) {
				res.pts[a] = new Float64Array(2)
				res.pts[a][0] = Math.random();
				res.pts[a][1] = Math.random();
			}
			return res;
		})
		exp[1] = createExperiment("Intersection", 100, 300, //name,lineCount,frames//
		function (id, own) {
			if (id === 0) {
				own.tar = new Array();
				for (var a = 0; a < 9; a++) {
					own.tar.push([Math.random(), Math.random()]);
				}
			}
			if (own.tar.length === 9) {
				var res = new Object();
				res.color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
				res.pts = new Array();
				var mx, my, r, di;
				for (var a = 0; a < 9; a++) {
					r = (Math.random() * 2 * Math.PI);
					di = 0;
					if ((a === 0) || (a === 8)) {
						di = 0.1 + Math.random() * 0.15;
					}
					mx = own.tar[a][0] + Math.cos(r) * di;
					my = own.tar[a][1] + Math.sin(r) * di;
					res.pts.push([mx, my]);
				}
				return res;
			} else {
				return exp[0].genLine(id);
			}
		})
		exp[2] = createExperiment("Centerize", 100, 300, //name,lineCount,frames//
		function (id) {
			var res = new Object();
			res.color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
			res.pts = new Array();
			var mx, my, r = Math.random();
			if (r < 0.25) {
				mx = Math.random();
				my = -0.2;
			} else if (r < 0.5) {
				mx = Math.random();
				my = 1.2;
			} else if (r < 0.75) {
				mx = -0.2;
				my = Math.random();
			} else {
				mx = 1.2;
				my = Math.random();
			}
			res.pts.push([mx, my]);
			for (var a = 0; a < 7; a++) {
				res.pts.push([Math.random(), Math.random()]);
			}
			res.pts.push([0.5, 0.5]);
			return res;
		})
		exp[3] = createExperiment("The Big Bang", 100, 300, //name,lineCount,frames//
		function (id) {
			var res = new Object();
			res.color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
			res.pts = new Array();
			var mx, my, r = Math.random();
			res.pts.push([0.5, 0.5]);
			if (r < 0.25) {
				mx = Math.random();
				my = -0.2;
			} else if (r < 0.5) {
				mx = Math.random();
				my = 1.2;
			} else if (r < 0.75) {
				mx = -0.2;
				my = Math.random();
			} else {
				mx = 1.2;
				my = Math.random();
			}
			//res.pts.push([mx,my]);
			for (var a = 0; a < 8; a++) {
				res.pts.push([Math.random(), Math.random()]);
			}
			return res;
		})
		exp[4] = createExperiment("Angular Expansion", 100, 300, //name,lineCount,frames//
		function (id) {
			var res = new Object();
			res.color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
			res.pts = new Array();
			var mx, my, r = (Math.random() * 2 * Math.PI),
				di = (0.02 + Math.random() * 0.02);
			mx = 0.5 + Math.cos(r) * (di);
			my = 0.5 + Math.sin(r) * (di);
			res.pts.push([mx, my]);
			for (var a = 0; a < 8; a++) {
				di = di + (0.01 + Math.random() * 0.06);
				r += (Math.PI / 8);
				res.pts.push([mx + Math.cos(r) * (di), my + Math.sin(r) * (di)]);
			}
			return res;
		})
		exp[5] = createExperiment("Angular recursion", 500, 600, //name,lineCount,frames//
		function (id, own) {
			var res = new Object();
			res.color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
			res.pts = new Array();
			var di, r;
			var mx, my;
			mx = 0.5;
			my = 0.5;
			di = (id / own.lineCount) * 0.7;
			r = Math.random() * 2 * Math.PI;
			for (var a = 0; a < 8; a++) {
				di = di - 0.01;
				r = r + Math.PI / 4;
				res.pts.push([mx + Math.cos(r) * di, my + Math.sin(r) * di]);
			}
			res.pts.push([mx + Math.random() * 0.001 - 0.0005, my + Math.random() * 0.001 - 0.0005]);
			return res;
		})
		exp[6] = createExperiment("Race", 100, 300, //name,lineCount,frames//
		function (id, own) {
			var res = new Object();
			res.color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
			res.pts = new Array();
			var my;
			my = (id / (own.lineCount - 1));
			for (var a = 0; a < 8; a++) {
				if (a % 2 === 0) {
					res.pts.push([(a / 8) + ((Math.random() * 0.2) - 0.1), my]);
				} else {
					res.pts.push([(a / 8) + ((Math.random() * 0.2) - 0.1), my + ((Math.random() * 0.4) - 0.2)]);
				}
			}
			my = my + ((Math.random() * 0.4) - 0.2);
			if (my > 1) {
				my = 1;
			}
			if (my < 0) {
				my = 0;
			}
			if (id < 2) // allows only 2 'winners', subtle, i know....
			{
				res.pts.push([1, my + ((Math.random() * 0.4) - 0.2)]);
			} else {
				res.pts.push([1 - Math.random() * 0.1 - 0.005, my + ((Math.random() * 0.4) - 0.2)]);
			}
			return res;
		})
		exp[7] = createExperiment("Tube", 100, 300, //name,lineCount,frames//
		function (id, own) {
			if (id === 0) {
				own.tar = new Array();
				for (var a = 0; a < 9; a++) {
					own.tar.push([Math.random(), Math.random()]);
				}
			}
			if (own.tar.length === 9) {
				var res = new Object();
				res.color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
				res.pts = new Array();
				var r, di;
				for (var a = 0; a < 9; a++) {
					r = Math.random() * Math.PI * 2;
					di = Math.random() * 0.05;
					res.pts.push([own.tar[a][0] + Math.cos(r) * di, own.tar[a][1] + Math.sin(r) * di]);
				}
				return res;
			} else {
				return exp[0].genLine(id);
			}
		})
		exp[8] = createExperiment("CrossEye", 200, 500, //name,lineCount,frames//
		function (id, own) {
			var res = new Object();
			//res.color = "#"+((1<<24)*Math.random()|0).toString(16);
			res.color = "rgba(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(0.5 + Math.random() * 0.5 * 20) / 20 + ")";
			res.pts = new Array();
			if (id < own.lineCount * 0.5) {
				for (var a = 0; a < 9; a++) {
					var mx = Math.random();
					var my = Math.random();
					res.pts.push([mx, my]);
				}
				res.effected = (id / (own.lineCount - 1)) * 0.0005;
			} else if (id <= own.lineCount) {
				res.color = own.lines[id - (own.lineCount * 0.5)].color;
				var addx = 0;
				if (typeof (own.lines[id - (own.lineCount * 0.5)].effected) === "number") {
					addx = own.lines[id - (own.lineCount * 0.5)].effected
				}
				for (var a = 0; a < 9; a++) {
					var mx = own.lines[id - (own.lineCount * 0.5)].pts[a][0];
					var my = own.lines[id - (own.lineCount * 0.5)].pts[a][1];
					res.pts.push([mx + addx, my]);
				}
			}
			if (id < own.lineCount * 0.5) {
				for (var a = 0; a < res.pts.length; a++) {
					res.pts[a] = [res.pts[a][0] * 0.5, res.pts[a][1] * 0.5 + 0.25];
				}
			} else if (id < own.lineCount) {
				for (var a = 0; a < res.pts.length; a++) {
					res.pts[a] = [res.pts[a][0] + 0.5, res.pts[a][1]];
				}
			}
			return res;
		})
	}
	expInit();
	var experimentId = 0; // experiment ID
	var frame = 0;
	showSpeed = 1;

	function changeExperiment(id) {
		if (id < exp.length) {
			frame = 0;
			experimentId = id;
			ctx.fillStyle = "rgba(0,0,0,0.99)";
			ctx.fillRect(0,0,size.x,size.y);
			return true;
		} else {
			return false;
		}
	}
	
	setExperiment = changeExperiment;
	
	console.log("You can change the variable 'showSpeed' to show the experiments faster/slower, for example: showSpeed = 2 shows it twice as fast and showSpeed = 0.5 shows it half as normal.");
	
	function tickHandler() {
		if ((typeof (exp[experimentId]) === "object") && (typeof (exp[experimentId].lines) === "object") && (typeof (exp[experimentId].ticks) === "number") && (typeof (exp[experimentId].genLine) === "function") && (typeof (exp[experimentId].lineCount) === "number")) {
			onTick();
		}
		window.requestAnimationFrame(tickHandler);
	}

	tickHandler();

	function ease(t) {
		var ts = t * t;
		var tc = ts * t;
		return ((6 * tc * ts) + (-15 * ts * ts) + (10 * tc));
	}

	function b(a, b, c) {
		return a + (b - a) * c
	}
	
	var ffal = 0; // for firefox warning text
	if ((navigator.userAgent.indexOf("Firefox")!=-1)) { ffal++; }
	var timeBefore = 0;

	function onTick() {
		if (frame === 0) {
			exp[experimentId].lines = new Array();
			for (var a = 0; a < exp[experimentId].lineCount; a++) {
				exp[experimentId].lines.push(exp[experimentId].genLine(a, exp[experimentId]));
			}
			if ((navigator.userAgent.indexOf("Firefox")!=-1))
			{
				ctx.fillStyle = "rgba(0,0,0,0.3)";
			} else {
				ctx.fillStyle = "rgba(0,0,0,0.1)";
			}
			ctx.fillRect(0,0,size.x,size.y);
			ctx.font = "25px Calibri";
			ctx.fillStyle = '#FFF';
			ctx.textAlign = "center";
			ctx.fillText("Experiment: " + (experimentId + 1) + " (" + exp[experimentId].name + ")", size.x * 0.5, 30);
		} else if (frame <= exp[experimentId].ticks) {
			if (frame > exp[experimentId].ticks * 0.95) {
				ctx.fillStyle = "rgba(0,0,0,0.02)";
			} else {
				ctx.fillStyle = "rgba(0,0,0,0.005)";
			}
			if ((navigator.userAgent.indexOf("Firefox")!=-1))
			{
				ctx.fillStyle = "rgba(0,0,0,0.03)";
			}
			ctx.fillRect(0, 0, size.x, size.y);
			//console.log(exp[experimentId]); // debug

			var timeNow = Math.min(Math.max(ease(Math.min(Math.max(frame / exp[experimentId].ticks, 0), 1)), 0), 1);
			ctx.lineWidth = 0.1 + (ease(timeNow) * 2);
			ctx.lineCap = 'round';
			if (exp[experimentId].lines) {
				if (frame > 1)
				exp[experimentId].lines.forEach((obj) => {
					if (obj && obj.pts && obj.pts.length === 9) {
						ctx.strokeStyle = obj.color;
						obj = obj.pts;
						var e;
						ctx.beginPath();
						e = timeBefore;
						ctx.moveTo(b(b(b(b(obj[0][0], obj[1][0], e), b(obj[1][0], obj[2][0], e), e), b(b(obj[2][0], obj[3][0], e), b(obj[3][0], obj[4][0], e), e), e), b(b(b(obj[4][0], obj[5][0], e), b(obj[5][0], obj[6][0], e), e), b(b(obj[6][0], obj[7][0], e), b(obj[7][0], obj[8][0], e), e), e), e) * size.x, b(b(b(b(obj[0][1], obj[1][1], e), b(obj[1][1], obj[2][1], e), e), b(b(obj[2][1], obj[3][1], e), b(obj[3][1], obj[4][1], e), e), e), b(b(b(obj[4][1], obj[5][1], e), b(obj[5][1], obj[6][1], e), e), b(b(obj[6][1], obj[7][1], e), b(obj[7][1], obj[8][1], e), e), e), e) * size.y);
						e = timeNow;
						ctx.lineTo(b(b(b(b(obj[0][0], obj[1][0], e), b(obj[1][0], obj[2][0], e), e), b(b(obj[2][0], obj[3][0], e), b(obj[3][0], obj[4][0], e), e), e), b(b(b(obj[4][0], obj[5][0], e), b(obj[5][0], obj[6][0], e), e), b(b(obj[6][0], obj[7][0], e), b(obj[7][0], obj[8][0], e), e), e), e) * size.x, b(b(b(b(obj[0][1], obj[1][1], e), b(obj[1][1], obj[2][1], e), e), b(b(obj[2][1], obj[3][1], e), b(obj[3][1], obj[4][1], e), e), e), b(b(b(obj[4][1], obj[5][1], e), b(obj[5][1], obj[6][1], e), e), b(b(obj[6][1], obj[7][1], e), b(obj[7][1], obj[8][1], e), e), e), e) * size.y);
						ctx.stroke();
					}
				});
			} else {
				console.warn("Experiment " + experimentId + " has no lines!");
				exp[experimentId].lines = [];
			}
			timeBefore = timeNow;
		} else {
			if (changeExperiment(experimentId + 1) === false) {
				changeExperiment(0);
			}
			frame -= 1 * showSpeed;
		}
		frame += 1 * showSpeed;
	}
}
