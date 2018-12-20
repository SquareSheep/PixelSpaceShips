function remove(q,index) {
	q.temp = q.ar[index];
	q.ar[index] = q.ar[q.arm - 1];
	q.ar[q.arm - 1] = q.temp;
	q.arm --;
}
function renderAll() {
	ctx.clearRect(0,0,c.width,c.height);
	starEff.render();
	cam.behave();
	ctx.translate(-cam.x,-cam.y);
	thrustEff.render();
	debrisEff.render();
	renderShip();
	renderEff();
	renderShipOutline();
	renderDrop();
	renderProj();
	warpWarningEff.render();
	ctx.strokeStyle = "rgba(255,255,255,0.3)";
	ctx.lineWidth = 3;
	ctx.strokeRect(0,0,mapX,mapY);
	ctx.translate(cam.x, cam.y);
}
function updateAll() {
	updateProj();
	updateShip();
	updateDrop();
}
function clearAll() {
	eff2.length = 0;
	proj.length = 0;
	drop.length = 0;
	attack.length = 0;
	if (ship.length > 1) ship.length = 1;
	clearEff();
	warpWarningEff.ar.length = 0;
	warpWarningEff.arm = 0;
	cam.reset();
}
function renderEff() {
	for (i = 0 ; i < eff.length ; i ++) {
		eff[i].render();
	}
}
function renderEff2() {
	for (i = 0 ; i < eff2.length ; i ++) {
		eff2[i].render();
		if (eff2[i].lifeSpan <= 0) {
			eff2[i].death();
			eff2.splice(i, 1);
			i --;
		}
	}
}
function clearEff() {
	for (i = 0 ; i < eff.length ; i ++) {
		eff[i].arm = 0;
		eff[i].ar.length = 0;
	}
}
function renderDrop() {
	for (i = 0 ; i < drop.length ; i ++) {
		drop[i].render();
	}
}
function updateDrop() {
	for (i = 0 ; i < drop.length ; i ++) {
		if (p.HP > 0) drop[i].update();
		drop[i].lifeSpan --;
		if (drop[i].x < drop[i].w) { drop[i].x = drop[i].w; drop[i].vx = Math.abs(drop[i].vx); }
		if (drop[i].y < drop[i].w) { drop[i].y = drop[i].w; drop[i].vy = Math.abs(drop[i].vy); }
		if (drop[i].x > mapX - drop[i].w) { drop[i].x = mapX - drop[i].w; drop[i].vx = -Math.abs(drop[i].vx); }
		if (drop[i].y > mapY - drop[i].w) { drop[i].y = mapY - drop[i].w; drop[i].vy = -Math.abs(drop[i].vy); }
		if (p.HP > 0 && findDist2(drop[i], p) < (p.w + drop[i].w) * (p.w + drop[i].w)) {
			drop[i].death();
			drop[i].lifeSpan = 0;
		}
		if (drop[i].lifeSpan == 0) {
			drop.splice(i, 1);
			i --;
		}
	}
}
function renderProj() {
	for (i = 0 ; i < proj.length ; i ++) {
		if (inView(proj[i])) proj[i].render();
	}
	if (currState == gameState) {
		for (i = proj.length - 1 ; i >= 0 ; i --) {
			if (proj[i].alert != null && proj[i].side != p.side) proj[i].alert();
		}
	}
}
function updateProj() {
	for (i = 0 ; i < proj.length ; i ++) {
		proj[i].update();
		proj[i].x += proj[i].vx;
		proj[i].y += proj[i].vy;
		proj[i].lifeSpan --;
		if (frames % 3 == 0) {
			if (proj[i].x < 0 || proj[i].x > mapX || proj[i].y < 0 || proj[i].y > mapY) {
				proj[i].lifeSpan = 0;
				warpEff.spawn(proj[i], false);
			}
		}
		if (proj[i].lifeSpan <= 0) {
			proj[i].death();
			proj.splice(i, 1);
			i --;
		}
	}
}
function renderShip() {
	for (i = ship.length - 1 ; i >= 0 ; i --) {
		if (inView(ship[i])) {
			ship[i].render();
			if (currState == gameState && ship[i].side == -p.side) {
				if (ship[i].currCD < 35 && ship[i].ts != null && ship[i].ar == null) {
					ctx.drawImage(icon.alert[Math.floor((frames / 7) % icon.alert.length)], Math.floor(ship[i].x - ship[i].w), Math.floor(ship[i].y) - ship[i].w * 2, ship[i].w * 2, ship[i].w * 2);
				}
			}
		}
		
		if (ship[i].lastHit > 0) ship[i].lastHit --;
	}
	if (currState == gameState) {
		for (i = ship.length - 1 ; i >= 0 ; i --) {
			if (ship[i].alert != null && ship[i].side != p.side) ship[i].alert();
		}
	}
}
function renderShipOutline() {
	for (i = ship.length - 1 ; i >= 0 ; i --) {
		if (inView(ship[i])) {
			if (currState == gameState && ship[i].side != p.side && findDist(mouseX, mouseY, ship[i].x, ship[i].y) < 3000) {
				ctx.save();
				ctx.translate(Math.abs(ship[i].x), Math.abs(ship[i].y));
				ctx.rotate(ship[i].angle + Math.PI / 2);
				ctx.drawImage(ship[i].image.outline, -ship[i].w, -ship[i].w, ship[i].w * 2, ship[i].w * 2);
				ctx.restore();
			}
		}
	}
}
function renderDebug() {
	ctx.fillStyle = "yellow";
	ctx.strokeStyle = "yellow";
	if (ship[i].side == 1) {
		ctx.fillStyle = "white";
		ctx.strokeStyle = "white";
	}
	if (ship[i].ts != null) {ctx.fillRect(ship[i].ts.x,ship[i].ts.y,5,5);
	ctx.strokeStyle = "white";
	ctx.beginPath();
	ctx.moveTo(ship[i].x, ship[i].y);
	ctx.lineTo(ship[i].ts.x, ship[i].ts.y);
	ctx.stroke();
	}
	ctx.fillRect(ship[i].tx, ship[i].ty, 5,5);
}
function updateShip() {
	nofShips[1] = nofShipsCalc(1);
	nofShips[-1] = nofShipsCalc(-1);
	for (i = 0 ; i < ship.length ; i ++) {
		ship[i].update();
		if (ship[i].v != ship[i].tv) {
			if (ship[i].v < ship[i].tv) ship[i].v += ship[i].a;
			if (ship[i].v > ship[i].tv) {
				ship[i].v -= ship[i].d;
				if (ship[i].v < 0 && ship[i] != p) ship[i].v = 0;
			}
			autoThrust(ship[i]);
		}
		ship[i].x += ship[i].vx;
		ship[i].y += ship[i].vy;
		if (frames % 15 == 0 && ship[i].ts != null) {
			if (ship[i].ts.HP <= 0 || findDist(ship[i], ship[i].ts) > ship[i].sightRange) {
				ship[i].ts = null;
			}
		}
		if (ship[i].x < ship[i].w) { autoThrust(ship[i]); ship[i].x = ship[i].w; ship[i].angle += Math.PI; ship[i].tang -= Math.PI; }
		if (ship[i].x > mapX - ship[i].w) {autoThrust(ship[i]); ship[i].x = mapX - ship[i].w; ship[i].angle += Math.PI; ship[i].tang -= Math.PI; }
		if (ship[i].y < ship[i].w) {autoThrust(ship[i]); ship[i].y = ship[i].w; ship[i].angle += Math.PI; ship[i].tang -= Math.PI; }
		if (ship[i].y > mapY - ship[i].w) {autoThrust(ship[i]); ship[i].y = mapY - ship[i].w; ship[i].angle += Math.PI; ship[i].tang -= Math.PI; }
		if (ship[i].angle > Math.PI) ship[i].angle -= Math.PI * 2;
		if (ship[i].angle < -Math.PI) ship[i].angle += Math.PI * 2;
		if (ship[i].tang > Math.PI) ship[i].tang -= Math.PI * 2;
		if (ship[i].tang < -Math.PI) ship[i].tang += Math.PI * 2;
		for (k = 0 ; k < proj.length ; k ++) {
			if (proj[k].side != ship[i].side) {
				if (Math.abs(proj[k].x - ship[i].x) < ship[i].w * 1.5 + proj[k].w) {
					if (Math.abs(proj[k].y - ship[i].y) < ship[i].w * 1.5 + proj[k].w) {
						if (findDist2(proj[k],ship[i]) < Math.pow(proj[k].w + ship[i].w, 2)) {
							ship[i].hurt(proj[k]);
							proj[k].hurt(ship[i]);
							if (ship[i].HP < 0) ship[i].HP = 0;
							if (ship[i].HP < ship[i].HPMax / 2) onFireEff.spawn(ship[i]);
						}
					}
				}
			}
		}
		if (ship[i].HP <= 0) {
			if (currState == gameState && ship[i].side != p.side) {
				if (HPDropTick % 3 == 2) drop[drop.length] = new HPDrop(ship[i].x, ship[i].y, 1);
			}
			if (p != null && ship[i].side != p.side) p.exp += ship[i].exp;
			Explosion[Math.floor(Math.random() * Explosion.length)].play();
			debrisEff.spawn(ship[i]);
			debrisEff.spawn(ship[i]);
			debrisEff.spawn(ship[i]);
			shipDestroyedEff.spawn(ship[i]);
			ship[i].death();
			ship.splice(i, 1);
			i --;
			HPDropTick ++;
			if (HPDropTick > 12) HPDropTick = 0;
		}
	}
	for (i = 0 ; i < attack.length ; i ++) {
		if (attack[i].ts != p || attack[i].HP <= 0) {
			attack.splice(i, 1);
			i --;
		}
	}
}
function changeState(x) {
	clearAll();
	currState = x;
	state[currState].setUp();
}
function mainLoop() {
	if (document.hasFocus()) {
		if (pause) {
		} else {
			state[currState].update();
		}
		state[currState].render();
		frames ++;
	}
	window.requestAnimationFrame(mainLoop);
}
function rgb(r, g, b, a) {
	if (a == null) a = 1;
	return "rgba(" + r + "," + g + "," + b + "," + a+ ")";
}
function mouseUp(e) {
	keys[121] = false;
}
function resize() {
	devW = window.innerWidth;
	devH = window.innerHeight;
	scale = Math.max(window.innerWidth / resW, window.innerHeight / resH);
	c.width = Math.floor(devW / scale);
	c.height = Math.floor(devH / scale);
	f.width = window.innerWidth;
	f.height = window.innerHeight;
	w = c.width;
	cw = c.width;
	h = c.height;
	ch = c.height;
	fw = f.width;
	fh = f.height;
	if (c.width > 1300) {
		ctx.imageSmoothingEnabled = true;
		fore.imageSmoothingEnabled = true;
	} else {
		fore.imageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
	}
	fore.textAlign = "center";
	textFont = f.width * 0.02 + "px Calibri";
	titleFont = f.width * 0.04 + "px Calibri";
	fore.font = textFont;
	levelText.display(levelText.text);
	state[currState].display();
}
function mouseDown(e) {
	keys[121] = true;
}
function keyDown(e) {
	if (e.keyCode == 80 && !keys[80] && currState == gameState) {
		if (pause) {
			frames = pausedFrames;
		} else {
			pausedFrames = frames;
		}
		pause = !pause;
	}
	state[currState].onkeydown(e);
	keys[e.keyCode] = true;
}
function keyUp(e) {
	keys[e.keyCode] = false;
}
function mouseMove(e) {
	rect = c.getBoundingClientRect();
    scaleX = w / rect.width;
    scaleY = h / rect.height;
    mouseX = (e.clientX - rect.left) * scaleX + cam.x;
    mouseY = (e.clientY - rect.top) * scaleY + cam.y;
	if (currState == gameState || currState == selectState) {
		diffX = mouseX - p.x;
		diffY = mouseY - p.y;
	}
	rect = f.getBoundingClientRect();
	scaleX = fw / rect.width;
	scaleY = fh / rect.height;
	foreX = (e.clientX - rect.left) * scaleX;
	foreY = (e.clientY - rect.top) * scaleY;
	if (p != null) p.tang = Math.atan2(mouseY - p.y, mouseX - p.x);
}
function turn(ang1, targ) {
	temp = 0;
	if (targ > ang1) {
		temp = 1;
		if (targ - ang1 > Math.PI) {
			temp = -1
		}
	} else if (targ < ang1) {
		temp = -1;
		if (targ - ang1 < -Math.PI) {
			temp = 1;
		}
	}
	return temp;
}
function length(x, y) {
	return x * x + y * y;
}
function findDist2(x1, y1) {
	return (x1.x - y1.x) * (x1.x - y1.x) + (x1.y - y1.y) * (x1.y - y1.y);
}
function floor(w) {
	return w * w/100;
}
function findDist(x1, y1, x2, y2) {
	return (x1 - x2) * (x1- x2) + (y1 - y2) * (y1 - y2);
}
function findIndexOf(q, ar) {
	for (var i = 0 ; i < ar.length ; i ++) {
		if (ar[i] == q) return i;
	}
	return -1;
}