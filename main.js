var ctx, c, w, h, fw, fh, ch, cw; var rect, scaleX, scaleY;
var frames = 0, pausedFrames = 0, pause = 0;
var b, back, f, fore;
var mouseX = 0, mouseY = 0, foreX = 0, foreY = 0, diffX = -1, diffY = 0;
var keys = [];
var i, k, j, u, o, m, l, temp, temp2, speed, dist, count, ang, angle, ang2, angle2, dist2, dist3, dist4, speed2, index, index2, go, x, y, addX, addY, diffX, diffY;
var state = [], menuState = 0, gameState = 1, currState, selectState = 2, difficultyState = 4; currLevel = 0, upgradeState = 3, difficulty = 0; wave = 0;
var ship = [], eff = [], eff2 = [], proj = [], drop = [], p; nofShips = [];
var attack = []; attackMax = 3; HPDropTick = 0;
var level = [], mapX, mapY, moveX, moveY;
var resW = 1920 * 0.4, resH = 1080 * 0.4;
var devW = window.innerWidth, devH = window.innerHeight;
var scale = Math.max(window.innerWidth / resW, window.innerHeight / resH);
var textFont, titleFont;
var shipList = [Interceptor, Fighter, Carrier, Destroyer, Destroyer2];
state[menuState] = {
	"mode":0,
	"onkeydown":function(e) {
		if (e.keyCode == 88) changeState(selectState);
	},
	"render":function() {
		renderAll();
	},
	"display":function() {
		fore.clearRect(0,0,fw, fh);
		fore.fillStyle = "white";
		fore.font = titleFont;
		fore.textAlign = "center";
		fore.fillText("Pixel Space Ships", f.width / 2,fh * 0.15);
		fore.font = textFont;
		fore.textAlign = "center";
		fore.fillText("Press X to start", fw * 0.5,fh * 0.55);
	},
	"setUp":function() {
		clearAll();
		paused = false;
		ctx.clearRect(0,0,c.width, c.height);
		fore.clearRect(0,0,f.width, f.height);
		mapX = resW * 1.5;
		mapY = resH * 1.5;
		ship[0] = new Interceptor(Math.random() * mapX, Math.random() * mapY, 1);
		this.display();
	},
	"update":function() {
		if (frames % 60 == 0) {
			if (ship[0].sightRange < 100000) ship[0].sightRange = 1000000;
		}
		if (frames % 130 == 0) {
			if (nofShips[-1] < 10) ship[ship.length] = new shipList[Math.floor(Math.random() * shipList.length)](Math.random() * mapX, Math.random() * mapY, -1);
			if (nofShips[1] < 10) ship[ship.length] = new shipList[Math.floor(Math.random() * shipList.length)](Math.random() * mapX, Math.random() * mapY, 1);
		}
		if (frames % 15 == 0) {
			for (i = 0 ; i < ship.length ; i ++) {
				if (ship[i].ts == null) {
					ship[i].tang = Math.atan2(mapY / 2 - ship[i].y, mapX / 2 - ship[i].x);
				}
			}
		}
		updateAll();
	}
}
state[selectState] = {
	"ship":[
		{
			"name":"Cannon Ship",
			"desc":["Dogfighting ship", "Uses rapid fire cannons"],
			"ship":PlayerShip0,
		},
		{
			"name":"Missile Ship",
			"desc":["Long ranged ship", "Uses explosive missiles"],
			"ship":PlayerShip1,
		}
	],
	"currShip":0,
	"setShip":function(q) {
		ship[0] = new this.ship[q].ship();
		p = ship[0];
		p.x = mapX / 2;
		p.y = mapY / 2;
	},
	"onkeydown":function(e) {
		for (o = 0 ; o < this.ship.length ; o ++) {
			if (e.keyCode == o + 49 && this.currShip != o) {
				this.setShip(o);
				this.currShip = o;
				this.display();
			}
		}
		if (e.keyCode == 88 && this.currShip != -1) changeState(difficultyState);
		if (e.keyCode == 66) changeState(menuState);
	},
	"render":function() {
		renderAll();
	},
	"display":function() {
		fore.clearRect(0,0,fw,fh);
		fore.fillStyle = "white";
		fore.font = titleFont;
		fore.fillText("Select ship:", f.width / 2,fh * 0.25, fw * 0.5, fh * 0.1);
		fore.textAlign = "left";
		fore.font = textFont;
		for (i = 0 ; i < this.ship.length ; i ++) {
			fore.fillText(this.ship[i].name + " (Press " + (i + 1) + ")", fw * 0.3,fh * (0.35 + i * 0.1));
		}
		for (i = 0 ; i < this.ship[this.currShip].desc.length ; i ++) {
			fore.fillText(this.ship[this.currShip].desc[i], fw * 0.6, fh * (0.35 + i * 0.05 + this.currShip * 0.1));
		}
		renderMenuArrow(fw * 0.27, fh * (0.33 + this.currShip * 0.1));
		fore.textAlign = "center";
		fore.fillText("Press X to confirm", fw * 0.5,fh * 0.85, fw * 0.5, fh * 0.1);
		fore.fillText("Press B to go back", fw * 0.5, fh * 0.9);
	},
	"setUp":function() {
		ctx.clearRect(0,0,cw,ch);
		clearAll();
		ship.length = 0;
		this.setShip(this.currShip);
		paused = false;
		currLevel = 0;
		this.display();
	},
	"update":function() {
		updateAll();
	}
}
state[difficultyState] = {
	"difficulty":0,
	"onkeydown":function(e) {
		for (var i = 0 ; i < 4 ; i ++) {
			if (e.keyCode == (i + 49)) {
				this.setDifficulty(i);
				this.display();
			}
		}
		if (e.keyCode == 88) changeState(gameState);
		if (e.keyCode == 66) changeState(selectState);
	},
	"render":function() {
		renderAll();
	},
	"setDifficulty":function(q) {
		if (q < 3) {
			difficulty = q;
		} else {
			difficulty = q * 2;
		}
		this.difficulty = q;
		attackMax = Math.ceil(difficulty * 2 + 2);
	},
	"display":function() {
		fore.clearRect(0,0,fw,fh);
		fore.fillStyle = "white";
		fore.font = titleFont;
		fore.fillText("Select difficulty:", f.width / 2,fh * 0.25, fw * 0.5, fh * 0.1);
		fore.textAlign = "left";
		fore.font = textFont;
		fore.fillText("Beginner (1)", fw * 0.3,fh * 0.35);
		fore.fillText("Intermediate (2)", fw * 0.3,fh * 0.45);
		fore.fillText("Expert (3)", fw * 0.3,fh * 0.55);
		fore.fillText("Death (4)", fw * 0.3,fh * 0.65);
		renderMenuArrow(fw * 0.27, fh * (0.33 + this.difficulty * 0.1));
		fore.textAlign = "center";
		fore.fillText("Press X to confirm", fw * 0.5,fh * 0.85, fw * 0.5, fh * 0.1);
		fore.fillText("Press B to go back", fw * 0.5, fh * 0.9);
	},
	"setUp":function() {
		ctx.clearRect(0,0,cw,ch);
		clearAll();
		paused = false;
		this.setDifficulty(0);
		wave = 0;
		this.display();
		state[upgradeState].upgrade = 0;
	},
	"update":function() {
		updateAll();
	}
}
state[upgradeState] = {
	"y":0.2,
	"upgrade":0,
	"canUpgrade":false,
	"onkeydown":function(e) {
		if (wave < p.avail.length) {
			for (var i = 0 ; i < p.avail[wave].length ; i ++) {
				if (e.keyCode == (i + 49) && !p.upgrade[p.avail[wave][i]].locked) {
					this.upgrade = i;
					this.display();
				}
			}
		} else {
			for (var i = 0 ; i < p.upgrade.length ; i ++) {
				if (e.keyCode == (i + 49) && !p.upgrade[i].locked) {
					this.upgrade = i;
					this.display();
				}
			}
		}
		if (e.keyCode == 88) {
			go = false;
			if (wave < p.avail.length) {
				if (!p.upgrade[p.avail[wave][this.upgrade]].locked) {
					p.upgrade[p.avail[wave][this.upgrade]].upgrade();
					go = true;
				}
			} else {
				if (!p.upgrade[this.upgrade].locked) {
					p.upgrade[this.upgrade].upgrade();
					go = true;
				}
			}
			if (go || !this.canUpgrade) {
				if (level[currLevel].nextLevel != null) {
					currLevel = level[currLevel].nextLevel;
				} else {
					currLevel = Math.floor(Math.random() * (level.length - 1));
				}
				wave ++;
				changeState(gameState);
			}
		}
		if (e.keyCode == 66) changeState(menuState);
	},
	"render":function() {
	},
	"display":function() {
		this.canUpgrade = false;
		fore.clearRect(0,0,fw,fh);
		fore.fillStyle = "white";
		fore.textAlign = "left";
		fore.font = textFont;
		go = false;
		if (wave < p.avail.length) {
			for (i = 0 ; i < p.avail[wave].length ; i ++) {
				fore.fillText(p.upgrade[p.avail[wave][i]].text + " (" + (i + 1) + ")", fw * 0.3,fh * (this.y + i * 0.1));
				if (p.upgrade[p.avail[wave][i]].locked) {
					fore.fillStyle = "yellow";
					fore.fillText("Max Upgrade", fw * 0.12,fh * (this.y + i * 0.1));
					fore.fillStyle = "white";
				} else {
					go = true;
				}
			}
		} else {
			for (i = 0 ; i < p.upgrade.length ; i ++) {
				fore.fillText(p.upgrade[i].text + " (" + (i + 1) + ")", fw * 0.3,fh * (this.y + i * 0.1));
				if (p.upgrade[i].locked) {
					fore.fillStyle = "yellow";
					fore.fillText("Max Upgrade", fw * 0.12,fh * (this.y + i * 0.1));
					fore.fillStyle = "white";
				} else {
					go = true;
				}
			}
		}
		if (go) {
			this.canUpgrade = true;
			renderMenuArrow(fw * 0.27, fh * (this.y + this.upgrade * 0.1));
		}
		fore.textAlign = "center";
		fore.fillText("Press X to continue",fw * 0.5, fh * 0.9);
		fore.fillText("Select an upgrade",fw * 0.5, fh * 0.1);
		fore.fillText("Press B to go back", fw * 0.5, fh * 0.95);
	},
	"setUp":function() {
		p.setUp();
		ctx.clearRect(0,0,cw, ch);
		clearAll();
		this.go = false;
		levelText.display([]);
		this.display();
	},
	"update":function() {
	}
}
state[gameState] = {
	"currCD":0,
	"CD":150,
	"onkeydown":function(e) {
		if (e.keyCode == 66) changeState(menuState);
		if (e.keyCode == 82) changeState(gameState);
		if (e.keyCode == 76 && currLevel < level.length - 1) changeState(upgradeState);
	},
	"render":function() {
		renderAll();
		fore.lineWidth = f.width * 0.03;
		ctx.lineWidth = c.width * 0.001;
		minimap.render();
		playerHPBar.render();
		if (p.HP > 0) renderArrows();
		level[currLevel].render();
		if (p.HP <= 0) {
			fore.clearRect(f.width * 0.4, f.height * 0.52, f.width * 0.2, f.height * 0.26);
			fore.fillStyle = "white";
			fore.fillText("You died",f.width / 2, f.height * 0.55);
			fore.fillText("Press B to go back",f.width / 2, f.height * 0.7);
			fore.fillText("Press R to restart level",f.width / 2, f.height * 0.75);
		}
	},
	"display":function() {
		fore.fillText("Back (B)", fw * 0.94, fh * 0.9);
		fore.fillText("Restart (R)", fw * 0.94, fh * 0.94);
		if (currLevel < level.length - 1) fore.fillText("Skip (L)", fw * 0.94, fh * 0.86);
	},
	"setUp":function() {
		levelText.display([]);
		fore.clearRect(0,0,f.width,f.height);
		fore.textAlign = "center";
		fore.font = textFont;
		clearAll();
		paused = false;
		mapX = 1200;
		mapY = 1200;
		moveX = mapX / 2;
		moveY = mapY / 2;
		moveW = mapX / 2.2;
		level[currLevel].setUp();
		HPDropTick = 0;
		p.setUp();
		this.display();
		this.currCD = 0;
	},
	"update":function() {
		level[currLevel].update();
		if (level[currLevel].isClear) {
			if (this.currCD < this.CD) {
				this.currCD ++;
			} else {
				if (currLevel < level.length - 1) {
					changeState(upgradeState);
				} else {
					if (this.currCD < this.CD + 120) {
						this.currCD ++;
					} else {
						changeState(menuState);
					}
				}
			}
		}
		updateAll();
	}
}
function start() {
	c = document.getElementById("ctxCanvas");
	ctx = c.getContext("2d");
	b = document.getElementById("backCanvas");
	back = b.getContext("2d");
	f = document.getElementById("foreCanvas");
	fore = f.getContext("2d");
	c.style.height = '94%';
	f.style.height = '94%';
	b.style.height = '94%';
	eff[eff.length] = shipDestroyedEff;
	eff[eff.length] = onFireEff;
	eff[eff.length] = fireEff;
	eff[eff.length] = smokeEff;
	eff[eff.length] = explosionEff;
	eff[eff.length] = fireProjEff;
	eff[eff.length] = warpEff;
	Howler.volume(0.1);
	currLevel = 0;
	c.addEventListener("mousemove", mouseMove, false);
	document.addEventListener("keydown", keyDown);
	document.addEventListener("keyup", keyUp);
	f.addEventListener("mousemove", mouseMove, false);
	starEff.spawn(100);
	currState = menuState;
	changeState(menuState);
	resize();
	mainLoop();
}
