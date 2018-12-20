var purpleThrust = "rgba(255,125,25,1)";
var whiteThrust = "rgba(200,222,255,1)";
var width = {
	"interceptor":6,
	"fighter":7,
	"carrier":22,
	"destroyer":13,
	"destroyer2":18,
	"station":65,
}
var cam = {
	"x":0,
	"y":0,
	"X":0,
	"Y":0,
	"mass":10,
	"behave":function() {
		if (currState == menuState) {
			this.X = ship[0].x - cw/2;
			this.Y = ship[0].y - ch/2;
		} else {
			this.X = p.x - cw/2;
			this.Y = p.y - ch/2;
		}
		this.x += (this.X - this.x) / this.mass;
		this.y += (this.Y - this.y) / this.mass;
	},
	"reset":function() {
		this.x = 0;
		this.y = 0;
		this.X = 0;
		this.Y = 0;
	}
}
var starEff = {
	"ar":[],
	"arm":0,
	"temp":0,
	"spawn":function(num) {
		if (num == null) num = 1;
		for (var i = 0 ; i < num ; i ++) {
			if (this.ar[this.arm] == null) {
				this.ar[this.arm] = {};
				this.ar[this.arm].X = Math.random() * 1000;
				this.ar[this.arm].Y = Math.random() * 1000;
			}
			this.ar[this.arm].diff = Math.random();
			this.ar[this.arm].w = Math.random() * 1.5 + this.ar[this.arm].diff * 2;
			this.ar[this.arm].color = rgb(125 + Math.floor(Math.random() * 125), 125 + Math.floor(Math.random() * 125),125 + Math.floor(Math.random() * 125),Math.random() * 0.5 + 0.5);
			this.arm ++;
		}
	},
	"render":function() {
		for (k = 0 ; k < this.arm ; k ++) {
			this.ar[k].x = this.ar[k].X - (cam.x + cw/2) * this.ar[k].diff / 3000 * cw;
			this.ar[k].y = this.ar[k].Y - (cam.y + ch/2) * this.ar[k].diff / 3000 * ch;
			if (this.ar[k].x > cw) this.ar[k].x %= cw;
			if (this.ar[k].x < 0) this.ar[k].x %= cw;
			if (this.ar[k].y < 0) this.ar[k].y %= ch;
			if (this.ar[k].y > ch) this.ar[k].y %= ch;
			ctx.fillStyle = this.ar[k].color;
			ctx.fillRect(this.ar[k].x, this.ar[k].y, this.ar[k].w, this.ar[k].w);
		}
	}
}
var warpEff = {
	"ar":[],
	"arm":0,
	"temp":0,
	"spawn":function(q, sound) {
		if (inView(q)) {
			if (this.ar[this.arm] == null) {
				this.ar[this.arm] = {};
				this.ar[this.arm].maxLife = 30;
			}
			this.ar[this.arm].x = q.x;
			this.ar[this.arm].y = q.y;
			this.ar[this.arm].w = q.w + 3;
			this.ar[this.arm].lifeSpan = 0;
			if (q.side == 1) {
				this.ar[this.arm].color = "rgba(166,166,200,1)";
			} else {
				this.ar[this.arm].color = "rgba(225,200,255,1)";
			}
			this.arm ++;
		}
		for (var j = 0 ; j < Warpin.length ; j ++) Warpin[j].stop();
		if (sound == null) playRandom(Warpin);
	},
	"render":function() {
		for (k = 0 ; k < this.arm ; k ++) {
			ctx.strokeStyle = this.ar[k].color + (1-this.ar[k].lifeSpan / 120) + ")";
			ctx.lineWidth = this.ar[k].w / 5;
			for (o = 0 ; o < this.ar[k].w / 5; o ++) {
				ctx.beginPath();
				ctx.arc(this.ar[k].x, this.ar[k].y, Math.random() * this.ar[k].w,Math.random() * Math.PI * 2,Math.random() * Math.PI * 2);
				ctx.stroke();
			}
			ctx.fillStyle = rgb(255,255,255,1-this.ar[k].lifeSpan / this.ar[k].maxLife);
			ctx.beginPath();
			ctx.arc(this.ar[k].x, this.ar[k].y, (1-this.ar[k].lifeSpan / this.ar[k].maxLife) * this.ar[k].w, 0, Math.PI * 2);
			ctx.fill();
			this.ar[k].lifeSpan ++;
			if (this.ar[k].lifeSpan == this.ar[k].maxLife) remove(this, k);
		}
	}
}
var fireProjEff = {
	"ar":[],
	"arm":0,
	"temp":0,
	"spawn":function(q) {
		if (inView(q)) {
			if (this.ar[this.arm] == null) {
				this.ar[this.arm] = {};
				this.ar[this.arm].maxLife = 10;
			}
			this.ar[this.arm].x = q.x;
			this.ar[this.arm].y = q.y;
			this.ar[this.arm].vx = q.vx/4;
			this.ar[this.arm].vy = q.vy/4;
			this.ar[this.arm].w = q.w * 2;
			this.ar[this.arm].lifeSpan = 0;
			this.arm ++;
			return true;
		}
	},
	"render":function() {
		for (k = 0 ; k < this.arm ; k ++) {
			this.ar[k].x += this.ar[k].vx;
			this.ar[k].y += this.ar[k].vy;
			ctx.fillStyle = rgb(255,255,255,1 - this.ar[k].lifeSpan / this.ar[k].maxLife);
			ctx.beginPath();
			ctx.arc(this.ar[k].x, this.ar[k].y, this.ar[k].w, 0,Math.PI * 2);
			ctx.fill();
			this.ar[k].w -= this.ar[k].w / 55;
			this.ar[k].lifeSpan ++;
			if (this.ar[k].lifeSpan == this.ar[k].maxLife) remove(this, k);
		}
	}
}
var thrustEff = {
	"ar":[],
	"arm":0,
	"temp":0,
	"spawn":function(x, y, w, speed, angle,lifeSpan, color) {
		if (inView(x, y)) {
			if (this.ar[this.arm] == null) {
				this.ar[this.arm] = {};
				this.ar[this.arm].maxLife = lifeSpan;
			}
			this.ar[this.arm].x = x;
			this.ar[this.arm].y = y;
			if (color == null) {
				this.ar[this.arm].color = "rgba(255,222,125,1)";
			} else {
				this.ar[this.arm].color = color;
			}
			this.ar[this.arm].vx = -Math.cos(angle) * speed;
			this.ar[this.arm].vy = -Math.sin(angle) * speed;
			this.ar[this.arm].angle = Math.random() * 2 * Math.PI;
			this.ar[this.arm].turn = Math.random() - 0.5;
			this.ar[this.arm].w = w;
			this.ar[this.arm].lifeSpan = 0;
			this.arm ++;
		}
	},
	"render":function() {
		for (k = 0 ; k < this.arm ; k ++) {
			this.ar[k].x += this.ar[k].vx;
			this.ar[k].y += this.ar[k].vy;
			this.ar[k].angle += this.ar[k].turn;
			ctx.fillStyle = this.ar[k].color;
			ctx.save();
			ctx.translate(this.ar[k].x, this.ar[k].y);
			ctx.rotate(this.ar[k].angle);
			ctx.fillRect(-this.ar[k].w, -this.ar[k].w, this.ar[k].w * 2, this.ar[k].w * 2);
			ctx.restore();
			this.ar[k].w -= this.ar[k].w / this.ar[k].maxLife;
			this.ar[k].lifeSpan ++;
			if (this.ar[k].lifeSpan == this.ar[k].maxLife) remove(this, k);
		}
	}
}
var explosionEff = {
	"ar":[],
	"arm":0,
	"temp":0,
	"spawn":function(x, y, w) {
		if (this.ar[this.arm] == null) {
			this.ar[this.arm] = {};
			this.ar[this.arm].maxLife = 10 + Math.floor(w / 3);
		}
		this.ar[this.arm].x = x;
		this.ar[this.arm].y = y;
		this.ar[this.arm].w = w * Math.random() + w * 0.5;
		this.ar[this.arm].angle = Math.random() * 2 * Math.PI;
		this.ar[this.arm].lifeSpan = 0;
		if (w > 16) {
			this.ar[this.arm].image = explosionBig;
		} else {
			this.ar[this.arm].image = explosion;
		}
		this.arm ++;
	},
	"render":function() {
		for (k = 0 ; k < this.arm ; k ++) {
			ctx.save();
			ctx.translate(this.ar[k].x, this.ar[k].y);
			ctx.rotate(this.ar[k].angle);
			ctx.drawImage(this.ar[k].image[Math.floor(this.ar[k].lifeSpan / this.ar[k].maxLife * this.ar[k].image.length)],-this.ar[k].w, -this.ar[k].w, this.ar[k].w * 2, this.ar[k].w * 2);
			ctx.restore();
			this.ar[k].lifeSpan ++;
			if (this.ar[k].lifeSpan == this.ar[k].maxLife) remove(this, k);
		}
	}
}
var onFireEff = {
	"ar":[],
	"arm":0,
	"temp":0,
	"spawn":function(q) {
		if (inView(q)) {
			if (this.ar[this.arm] == null) {
				this.ar[this.arm] = {};
				this.ar[this.arm].maxLife = 240;
			}
			this.ar[this.arm].ts = q;
			this.ar[this.arm].lifeSpan = 0;
			this.ar[this.arm].o = Math.floor(Math.random() * 125) + 25;
			this.ar[this.arm].tick = Math.floor(Math.random() * 35) + 2;
			this.ar[this.arm].angle = q.angle;
			this.ar[this.arm].diffX = q.w * 0.25 * (Math.random() - 0.5);
			this.ar[this.arm].diffY = q.w * 0.25 * (Math.random() - 0.5);
			this.arm ++;
		}
	},
	"render":function() {
		ctx.fillStyle = "rgba(255,255,200,0.3)";
		for (k = 0 ; k < this.arm ; k ++) {
			if ((frames + this.ar[k].tick) % 5 == 0)fireEff.spawn(this.ar[k].ts);
			if ((frames + this.ar[k].tick) % 5 == 0 && Math.random() > 0.5)smokeEff.spawn(this.ar[k].ts, this.ar[k].o);
			if ((frames + this.ar[k].tick) % 60 == 0 && Math.random() > 0.9) debrisEff.spawn(this.ar[k].ts);
			this.ar[k].lifeSpan ++;
			if (this.ar[k].ts.w > 8 && this.ar[k].ts.w < 25 && frames % 12 < 6 && Math.random() > 0.5) {
				if ((frames + this.ar[k].tick) % 15 == 0 && Math.random() > 0.7) {
					this.ar[k].angle = Math.random() * 2 * Math.PI;
					this.ar[k].diffX = this.ar[k].ts.w * 0.25 * (Math.random() - 0.5);
					this.ar[k].diffY = this.ar[k].ts.w * 0.25 * (Math.random() - 0.5);
				}
				ctx.save();
				ctx.translate(this.ar[k].ts.x + this.ar[k].diffX, this.ar[k].ts.y + this.ar[k].diffY);
				ctx.rotate(this.ar[k].angle);
				ctx.scale(1.2, 1.2);
				ctx.drawImage(arcs[Math.floor((frames / 5) % arcs.length)], -this.ar[k].ts.w, -this.ar[k].ts.w, this.ar[k].ts.w * 2, this.ar[k].ts.w * 2);
				ctx.restore();
			}
			if (this.ar[k] == null || this.ar[k].ts.HP <= 0 || this.ar[k].lifeSpan >= this.ar[k].maxLife) remove(this, k);
		}
	}
}
var smokeEff = {
	"ar":[],
	"arm":0,
	"temp":0,
	"spawn":function(q, smoke) {
		if (this.arm < 100 && inView(q)) {
			if (this.ar[this.arm] == null) {
				this.ar[this.arm] = {};
				this.ar[this.arm].maxLife = 35;
			}
			ang = Math.random() * 2 * Math.PI - Math.PI;
			dist = Math.random() * q.w * 0.75;
			this.ar[this.arm].x = q.x + Math.cos(ang) * dist;
			this.ar[this.arm].y = q.y + Math.sin(ang) * dist;
			this.ar[this.arm].vx = q.vx/3;
			this.ar[this.arm].vy = q.vy/3;
			this.ar[this.arm].ts = q;
			this.ar[this.arm].w = Math.random() * q.w * 0.05;
			this.ar[this.arm].W = q.w / 100 + 0.2;
			this.ar[this.arm].o = smoke || Math.floor(Math.random() * 125) + 25;
			this.ar[this.arm].lifeSpan = Math.floor(Math.random() * this.ar[this.arm].maxLife);
			this.ar[this.arm].tick = Math.floor(Math.random() * 25) + 15;
			this.arm ++;
		}
	},
	"render":function() {
		for (k = 0 ; k < this.arm ; k ++) {
			ctx.fillStyle = rgb(this.ar[k].o, this.ar[k].o, this.ar[k].o, (this.ar[k].maxLife - this.ar[k].lifeSpan) / this.ar[k].maxLife);
			ctx.beginPath();
			ctx.arc(this.ar[k].x, this.ar[k].y, this.ar[k].w, 0, Math.PI * 2);
			ctx.fill();
			this.ar[k].x += this.ar[k].vx;
			this.ar[k].y += this.ar[k].vy;
			this.ar[k].vx *= 0.97;
			this.ar[k].vy *= 0.97;
			this.ar[k].lifeSpan ++;
			this.ar[k].w += this.ar[k].W;
			if (this.ar[k].lifeSpan == this.ar[k].maxLife) remove(this, k);
		}
	}
}
var fireEff = {
	"ar":[],
	"arm":0,
	"temp":0,
	"spawn":function(q) {
		if (inView(q)) {
			if (this.ar[this.arm] == null) {
				this.ar[this.arm] = {};
				this.ar[this.arm].maxLife = 20;
			}
			ang = Math.random() * 2 * Math.PI - Math.PI;
			dist = Math.random() * q.w * 0.75;
			this.ar[this.arm].x = q.x + Math.cos(ang) * dist;
			this.ar[this.arm].y = q.y + Math.sin(ang) * dist;
			this.ar[this.arm].vx = -q.vx;
			this.ar[this.arm].vy = -q.vy -0.2;
			this.ar[this.arm].ts = q;
			this.ar[this.arm].w = 0.2;
			this.ar[this.arm].W = q.w / 200 + 0.1;
			this.ar[this.arm].r = 150 + Math.floor(Math.random() * 105);
			this.ar[this.arm].g = 100 + Math.floor(Math.random() * 155);
			this.ar[this.arm].b = 25;
			this.ar[this.arm].lifeSpan = Math.floor(Math.random() * this.ar[this.arm].maxLife);
			this.arm ++;
		}
	},
	"render":function() {
		for (k = 0 ; k < this.arm ; k ++) {
			ctx.fillStyle = rgb(this.ar[k].r, this.ar[k].g, this.ar[k].b,1);
			ctx.fillRect(Math.floor(this.ar[k].x) - this.ar[k].w, Math.floor(this.ar[k].y) - this.ar[k].w, this.ar[k].w * 2, this.ar[k].w * 2);
			this.ar[k].x += this.ar[k].vx;
			this.ar[k].y += this.ar[k].vy;
			this.ar[k].lifeSpan ++;
			this.ar[k].w += this.ar[k].W;
			if (this.ar[k].w > 3) {
				this.ar[k].lifeSpan = this.ar[k].maxLife;
				this.spawn(this.ar[k]);
			}
			if (this.ar[k].lifeSpan == this.ar[k].maxLife) remove(this, k);
		}
	}
}
var shipDestroyedEff = {
	"ar":[],
	"arm":0,
	"temp":0,
	"spawn":function(q) {
		if (q != null) {
			if (this.ar[this.arm] == null) {
				this.ar[this.arm] = {};
				this.ar[this.arm].maxLife = 360;
			}
			this.ar[this.arm].x = q.x;
			this.ar[this.arm].y = q.y;
			this.ar[this.arm].w = q.w;
			this.ar[this.arm].W = 0.987 + Math.random() * 0.005;
			this.ar[this.arm].vx = q.vx / 2;
			this.ar[this.arm].vy = q.vy / 2;
			this.ar[this.arm].HP = 1;
			this.ar[this.arm].image = q.image.dead[q.imageNum][Math.floor(Math.random() * q.image.dead[q.imageNum].length)];
			this.ar[this.arm].lifeSpan = 0;
			this.ar[this.arm].angle = q.angle + Math.PI / 2;
			this.ar[this.arm].turn = q.turn * (Math.random() - 0.5) * 2;
			onFireEff.spawn(this.ar[this.arm]);
			for (var k = 0 ; k < onFireEff.arm ; k ++) {
				if (onFireEff.ar[k].ts == q) onFireEff.ar[k].ts = this.ar[this.arm];
			}
			this.arm ++;
		}
	},
	"render":function() {
		if (this.arm > 5) {
			for (k = 0 ; k < 5 ; k ++) {
				if (this.ar[k].lifeSpan < this.ar[k].maxLife - 120) {
					this.ar[k].lifeSpan = this.ar[k].maxLife - 120;
				}
			}
		}
		for (k = 0 ; k < this.arm ; k ++) {
			this.ar[k].lifeSpan ++;
			this.ar[k].w *= this.ar[k].W;
			if (inView(this.ar[k])) {
				this.ar[k].x += this.ar[k].vx;
				this.ar[k].y += this.ar[k].vy;
				this.ar[k].turn *= 0.99;
				this.ar[k].angle += this.ar[k].turn;
				ctx.save();
				ctx.translate(this.ar[k].x,this.ar[k].y);
				ctx.rotate(this.ar[k].angle);
				ctx.drawImage(this.ar[k].image,-this.ar[k].w, -this.ar[k].w, this.ar[k].w * 2, this.ar[k].w * 2);
				ctx.restore();
			}
			if (this.ar[k].lifeSpan >= this.ar[k].maxLife || this.ar[k].w <= 2) {
				remove(this, k);
			}
		}
	}
}
var warpWarningEff = {
	"ar":[],
	"arm":0,
	"temp":0,
	"spawn":function(x, y, w, ship, side) {
		if (this.ar[this.arm] == null) {
			this.ar[this.arm] = {};
		}
		this.ar[this.arm].x = x;
		this.ar[this.arm].y = y;
		this.ar[this.arm].w = w;
		if (side == null) {
			this.ar[this.arm].side = -p.side;
		} else {
			this.ar[this.arm].side = side;
		}
		this.ar[this.arm].lifeSpan = 0;
		this.ar[this.arm].ship = ship;
		this.arm ++;
	},
	"render":function() {
		for (k = 0 ; k < this.arm ; k ++) {
			this.ar[k].lifeSpan ++;
			if (inView(this.ar[k])) ctx.drawImage(icon.alert2[Math.floor((frames / 10) % icon.alert2.length)], this.ar[k].x - this.ar[k].w, this.ar[k].y - this.ar[k].w, this.ar[k].w * 2, this.ar[k].w * 2);
			if (this.ar[k].lifeSpan == 60) {
				ship[ship.length] = new this.ar[k].ship(this.ar[k].x, this.ar[k].y, this.ar[k].side);
				remove(this, k);
			}
		}
	}
}
var debrisEff = {
	"ar":[],
	"arm":0,
	"temp":0,
	"spawn":function(q, e) {
		if (q != null && this.arm < 75) {
			if (this.ar[this.arm] == null) {
				this.ar[this.arm] = {};
				this.ar[this.arm].maxLife = Math.floor(25 * Math.random()) + 20;
			}
			this.ar[this.arm].w = q.w / 3 * Math.random() + Math.random() * 3 + 4;
			if (Math.random() > 0.95) this.ar[this.arm].w = q.w/2;
			if (e == null) {
				ang = q.angle + (Math.random() - 0.5) * 2;
			} else {
				ang = e.angle + (Math.random() - 0.5) * 1.5;
			}
			temp = Math.sqrt(length(q.vx,q.vy));
			dist = Math.random() * temp * 0.5 + Math.random();
			temp2 = Math.random();
			this.ar[this.arm].x = q.x + Math.cos(ang) * q.w * temp2;
			this.ar[this.arm].y = q.y + Math.sin(ang) * q.w * temp2;
			this.ar[this.arm].vx = Math.cos(ang) * dist * 8 / this.ar[this.arm].w;
			this.ar[this.arm].vy = Math.sin(ang) * dist * 8 / this.ar[this.arm].w;
			this.ar[this.arm].HP = 1;
			this.ar[this.arm].W = Math.random() * 0.016 + 0.98;
			this.ar[this.arm].side = q.side;
			if (q.side == 1) {
				this.ar[this.arm].image = white.debris[Math.floor(Math.random() * white.debris.length)];
			} else {
				this.ar[this.arm].image = purple.debris[Math.floor(Math.random() * purple.debris.length)];
			}
			this.ar[this.arm].lifeSpan = 0;
			this.ar[this.arm].angle = q.angle;
			this.ar[this.arm].turn = q.turn * Math.random() || (Math.random() - 0.5) * 0.1;
			if (Math.random() > 0.6) onFireEff.spawn(this.ar[this.arm]);
			this.arm ++;
		}
	},
	"render":function() {
		for (k = 0 ; k < this.arm ; k ++) {
			if (inView(this.ar[k])) {
				this.ar[k].x += this.ar[k].vx;
				this.ar[k].y += this.ar[k].vy;
				this.ar[k].w *= this.ar[k].W;
				this.ar[k].angle += this.ar[k].turn;
				ctx.save();
				ctx.translate(this.ar[k].x,this.ar[k].y);
				ctx.rotate(this.ar[k].angle);
				ctx.drawImage(this.ar[k].image,-this.ar[k].w, -this.ar[k].w, this.ar[k].w * 2, this.ar[k].w * 2);
				ctx.restore();
			}
			this.ar[k].lifeSpan ++;
			if (this.ar[k].lifeSpan >= this.ar[k].maxLife) {
				this.ar[k].HP = 0;
				remove(this, k);
				if (this.ar[k].w > 6) {
					explosionEff.spawn(this.ar[k].x, this.ar[k].y, this.ar[k].w * 1.2);
					this.ar[k].vx /= 2;
					this.ar[k].vy /= 2;
					for (o = 0 ; o < 3 ; o ++) {
						debrisEff.spawn(this.ar[k]);
						debrisEff.ar[debrisEff.arm - 1].w = this.ar[k].w / 2;
					}
				}
			}
		}
	}
}
var minimap = {
	"x":0.1,
	"y":0.9,
	"w":0.09,
	"w2":0.1,
	"h":0.09,
	"h2":0.1,
	"render":function() {
		fore.clearRect(fw * this.x - fw * this.w2, fh * this.y - fh * this.h2, fw * this.w2 * 2, fh * this.h2 * 2);
		fore.lineWidth = 1;
		fore.fillStyle = "rgba(0,0,0,0.5)";
		fore.fillRect(fw * this.x - fw * this.w, fh * this.y - fh * this.h, fw * this.w * 2, fh * this.h * 2);
		for (i = 0 ; i < ship.length ; i ++) {
			if (ship[i].x > 0 && ship[i].x < mapX && ship[i].y > 0 && ship[i].y < mapY) {
				if (ship[i] == p) {
					fore.fillStyle = "yellow";
					fore.fillRect(Math.floor(fw * this.x - fw * this.w + ship[i].x / mapX * fw * this.w * 2), Math.floor(fh * this.y - fh * this.h + ship[i].y / mapY * fh * this.h * 2),fh * 0.01,fh * 0.01);
				} else {
					if (ship[i].side == 1) {
						fore.fillStyle = "white";
					} else {
						fore.fillStyle = "orange";
					}
					fore.fillRect(Math.floor(fw * this.x - fw * this.w + ship[i].x / mapX * fw * this.w * 2), Math.floor(fh * this.y - fh * this.h + ship[i].y / mapY * fh * this.h * 2),fh * 0.007,fh * 0.007);
				}
				
			}
		}
		fore.strokeStyle = "white";
		fore.strokeRect(fw * this.x - fw * this.w, fh * this.y - fh * this.h, fw * this.w * 2, fh * this.h * 2);
	}
}
var playerHPBar = {
	"x":0.5,
	"y":0.05,
	"w":0.3,
	"h":0.01,
	"render":function() {
		fore.clearRect(fw * this.x - this.w * fw, fh * this.y - this.h * fh,this.w * fw * 2, this.h * fh * 2);
		fore.lineWidth = 1;
		fore.fillStyle = "white";
		fore.fillRect(fw * this.x - this.w * fw, fh * this.y - this.h * fh,p.HP / p.HPMax * this.w * fw * 2, this.h * fh * 2);
		fore.lineWidth = 3;
		fore.strokeStyle = "rgba(125,125,125,0.8)";
		fore.strokeRect(fw * this.x - this.w * fw, fh * this.y - this.h * fh,this.w * fw * 2, this.h * fh * 2);
	}
}
var levelText = {
	"x":0.5,
	"y":0.1,
	"w":0.5,
	"h":0.06,
	"d":0.06,
	"text":[],
	"display":function(text, style) {
		fore.strokeStyle = "white";
		if (this.text.length > 0) fore.clearRect((this.x - this.w / 2) * fw, (this.y - this.h) * fh, this.w * fw, this.text.length * (this.h + this.d) * fh);
		if (text != null) this.text = text;
		if (style != null) {
			fore.fillStyle = style;
		} else {
			fore.fillStyle = "white";
		}
		for (var o = 0 ; o < this.text.length ; o ++) {
			fore.fillText(this.text[o], this.x * fw, (this.y + o * this.d) * fh, this.w * fw);
		}
	}
}
class HPDrop {
	constructor(x, y, HP) {
		this.x = x;
		this.y = y;
		this.w = 8;
		this.lifeSpan = 360;
		this.HP = HP || 1;
	}
	render() {
		if (this.lifeSpan > 120 || frames % 12 > 6) {
			ctx.drawImage(icon.HP[[Math.floor((frames / 10) % icon.HP.length)]], this.x - this.w, this.y - this.w, this.w * 2, this.w * 2);
		}
	}
	update() {
		temp = findDist2(this, p);
		this.x += (p.x - this.x) * 75 / temp;
		this.y += (p.y - this.y) * 75 / temp;
	}
	death() {
		p.HP += this.HP;
		if (p.HP > p.HPMax) p.HP = p.HPMax;
	}
}
class Proj {
	constructor(x, y, w, angle, speed, damage, side) {
		if (currState == gameState && side != p.side) {
			speed += difficulty * 0.8;
			speed *= 1 + wave * 0.05;
		}
		this.x = x;
		this.y = y;
		this.w = w;
		this.v = speed;
		this.angle = angle;
		this.vx = Math.cos(angle) * speed;
		this.vy = Math.sin(angle) * speed;
		this.lifeSpan = 360;
		this.damage = damage;
		this.side = side;
		this.turn = 0.15 + 0.1 * Math.random();
		this.diffAngle = 0;
		if (side == 1) {
			this.image = white.proj;
			this.thrustColor = "rgba(170,222,255,0.75)";
		} else {
			this.image = purple.proj;
			this.thrustColor = "rgba(255,222,125,0.75)";
		}
		playRandom(Laser);
		fireProjEff.spawn(this);
	}
	render() {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle + Math.PI / 2);
		ctx.drawImage(this.image[Math.floor((frames/4) % this.image.length)], -this.w * 1.5,-this.w * 1.5,this.w * 3,this.w * 3);
		ctx.restore();
		ang = this.angle + (Math.random() - 0.5);
		if (frames % 3 == 0) thrustEff.spawn(this.x - Math.cos(ang) * this.w , this.y - Math.sin(ang) * this.w / 2, this.w/2,-this.v/3,this.angle,3, this.thrustColor);
	}
	update() {
	}
	hurt(q) {
		explosionEff.spawn(this.x,this.y,this.w * 3);
		q.HP -= this.damage;
		this.lifeSpan = 1;
	}
	death() {
	}
}
class Missile extends Proj {
	constructor(x, y, w, angle, speed, damage, target) {
		super(x, y, w, angle, speed, damage, -target.side);
		this.tang = angle;
		this.turn = 0.01;
		if (currState == gameState && this.side != p.side) this.turn += difficulty * 0.002 + wave * 0.001;
		this.ts = target;
		this.lifeSpan = 240;
		this.v -= difficulty * 0.4;
		this.v = Math.min(this.v, 1.5);
		if (this.side == 1) {
			this.image = white.bullet;
		} else {
			this.image = purple.bullet;
		}
	}
	update() {
		if (this.ts != null && this.ts.HP > 0) {
			if (frames % 5 == 0) this.tang = Math.atan2(this.ts.y - this.y, this.ts.x - this.x);
			autoTurn(this);
			if (this.ts.HP <= 0) this.ts = null;
			if (this.angle > Math.PI) this.angle -= Math.PI * 2;
			if (this.angle < -Math.PI) this.angle += Math.PI * 2;
		}
	}
}
class Destroyer2Proj extends Proj {
	constructor(x, y, w, angle, speed, damage, side) {
		super(x, y, w, angle, speed, damage, side);
		this.damage2 = this.damage;
		this.damage = 0;
		temp = Math.sqrt(dist);
		this.lifeSpan = Math.floor(temp / this.v) + 1;
		this.maxLife = this.lifeSpan + 1;
		this.radius = w * 3.2;
		this.X = x + Math.cos(angle) * temp;
		this.Y = y + Math.sin(angle) * temp;
		if (side == 1) {
			this.image = white.bomb;
		} else {
			this.image = purple.bomb;
		}
	}
	render() {
		this.diffAngle += this.turn;
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle + this.diffAngle);
		ctx.drawImage(this.image[Math.floor((frames/5) % this.image.length)], -this.w * 1.5,-this.w * 1.5,this.w * 3,this.w * 3);
		ctx.restore();
		ang = this.angle + (Math.random() - 0.5);
		if (frames % 3 == 0) thrustEff.spawn(this.x - Math.cos(ang) * this.w , this.y - Math.sin(ang) * this.w / 2, this.w,-this.v/3,this.angle,5, this.thrustColor);
	}
	alert() {
		ctx.drawImage(icon.target[Math.floor(this.lifeSpan / this.maxLife * icon.target.length)], this.X - this.radius, this.Y - this.radius, this.radius * 2, this.radius * 2); 
	}
	death() {
		explosionEff.spawn(this.x,this.y,this.radius);
		explosionEff.spawn(this.x,this.y,this.radius/2);
		explosionEff.spawn(this.x,this.y,this.radius*0.75);
		smokeEff.spawn(this);
		smokeEff.spawn(this);
		for (var i = 0 ; i < ship.length ; i ++) {
			if (ship[i].side != this.side) {
				if (findDist2(this, ship[i]) < (this.radius + ship[i].w) * (this.radius + ship[i].w)) {
					ship[i].HP -= this.damage2;
					if (ship[i].HP < 0) ship[i].HP = 0;
					explosionEff.spawn(ship[i].x, ship[i].y, ship[i].w);
					debrisEff.spawn(ship[i], this);
					debrisEff.spawn(ship[i], this);
					debrisEff.spawn(ship[i], this);
				}
			}
		}
		playRandom(Explosion);
	}
}
class PlayerShip0Proj extends Proj {
	constructor(x, y, w, angle, speed, damage, lifeSpan, side) {
		super(x, y, w, angle, speed, damage, side);
		this.lifeSpan = lifeSpan;
	}
	hurt(q) {
		explosionEff.spawn(this.x,this.y,this.w * 3);
		q.HP -= this.damage;
		this.lifeSpan = 1;
	}
}
class PlayerShip1Proj extends Proj {
	constructor(x, y, w, angle, speed, damage, lifeSpan, side) {
		super(x, y, w, angle, speed, damage, side);
		this.lifeSpan = lifeSpan;
		this.maxLife = lifeSpan + 1;
		this.damage2 = damage;
		this.damage = 0;
		temp = Math.sqrt(findDist(mouseX, mouseY, x, y));
		this.lifeSpan = Math.floor(temp / this.v) + 1;
		this.radius = w * 7;
		this.image = white.bomb;
		this.X = mouseX;
		this.Y = mouseY;
	}
	render() {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle + Math.PI / 2);
		ctx.drawImage(this.image[Math.floor((frames/4) % this.image.length)], -this.w * 1.5,-this.w * 1.5,this.w * 3,this.w * 3);
		ctx.restore();
		ang = this.angle + (Math.random() - 0.5);
		if (frames % 3 == 0) thrustEff.spawn(this.x - Math.cos(ang) * this.w , this.y - Math.sin(ang) * this.w / 2, this.w/2,-this.v/3,this.angle,3, this.thrustColor);
		ctx.fillStyle = this.thrustColor;
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.arc(this.X, this.Y, this.radius * this.lifeSpan / this.maxLife, 0, Math.PI * 2);
		ctx.stroke();
		ctx.lineWidth = 0.25;
		ctx.strokeStyle = "white";
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.X, this.Y);
		ctx.setLineDash([10, 10]);
		ctx.lineDashOffset = 1000 - frames % 1000;
		ctx.stroke();
		ctx.setLineDash([0,0]);
	}
	hurt(q) {
		explosionEff.spawn(this.x,this.y,this.w * 3);
		q.HP -= this.damage;
		this.lifeSpan = 1;
	}
	death() {
		explosionEff.spawn(this.x,this.y,this.radius);
		explosionEff.spawn(this.x,this.y,this.radius/2);
		explosionEff.spawn(this.x,this.y,this.radius*0.75);
		smokeEff.spawn(this);
		smokeEff.spawn(this);
		for (var i = 0 ; i < ship.length ; i ++) {
			if (ship[i].side != this.side) {
				if (findDist2(this, ship[i]) < (this.radius + ship[i].w) * (this.radius + ship[i].w)) {
					ship[i].HP -= this.damage2;
					if (ship[i].HP < 0) ship[i].HP = 0;
					explosionEff.spawn(ship[i].x, ship[i].y, ship[i].w);
					debrisEff.spawn(ship[i], this);
					debrisEff.spawn(ship[i], this);
					debrisEff.spawn(ship[i], this);
				}
			}
		}
		playRandom(Explosion);
	}
}
class Ship {
	constructor(x, y, w, side) {
		this.HP;
		this.HPMax;
		this.x = x;
		this.y = y;
		this.w = w;
		this.vx = 0;
		this.vy = 0;
		this.v = 0;
		this.a = 0;
		this.d = 0;
		this.ts = null;
		this.tv = 0;
		this.vMax = 0;
		this.angle = Math.random() * 2 * Math.PI - Math.PI;
		this.tang = this.angle;
		this.turn;
		this.sightRange;
		this.side = side;
		this.weapon = [];
		this.drop = [];
		this.image;
		this.imageNum = 0;
		this.tick = Math.floor(Math.random() * 240) + 30;
		this.lastHit = 0;
	}
	hurt(q) {
		if (this.lastHit == 0) {
			debrisEff.spawn(this, q);
			debrisEff.spawn(this);
		}
		playRandom(Hurt);
		this.lastHit = 25;
	}
	death() {
		explosionEff.spawn(this.x, this.y,this.w * 2);
		for (o = 0 ; o < this.w / 4 ; o ++) debrisEff.spawn(this);
	}
}
class Interceptor extends Ship {
	constructor(x, y, side) {
		super(x, y, width.interceptor, side);
		this.HP = 2;
		this.HPMax = this.HP;
		this.angle = -Math.PI/2;
		this.v = 0.5;
		this.tv = 0.25;
		this.vMax = 0.8;
		this.turn = 0.04;	
		this.weaponRange = 355 * 355;
		this.sightRange = 555 * 555;
		this.minRange = 175 * 175;
		this.a = 0.01;
		this.d = 0.005;
		this.CD = 240;
		this.offAngle = -Math.PI / 2;
		this.currCD = Math.floor(Math.random() * this.CD);
		this.projSpeed = 2.3;
		if (side == 1) {
			this.image = white.interceptor;
			this.thrustColor = whiteThrust;
		} else {
			this.image = purple.interceptor;
			this.thrustColor = purpleThrust;
		}
		if (currState == gameState && side != p.side) {
			this.v += wave * 0.025;
			this.a += wave * 0.005;
			this.vMax += difficulty * 0.14;
			this.CD -= difficulty * 10;
			if (this.CD > 80) this.CD -= wave * 5;
		}
		warpEff.spawn(this);
	}
	render() {
		ctx.save();
		ctx.translate(Math.floor(this.x), Math.floor(this.y));
		ctx.rotate(this.angle + Math.PI / 2);
		ctx.drawImage(this.image.ship[this.imageNum][0], -this.w, -this.w, this.w * 2, this.w * 2);
		ctx.restore();
		ang = this.angle + (Math.random() - 0.5)*0.5;
		if ((frames + this.tick) % 5 == 0) thrustEff.spawn(this.x - Math.cos(ang) * this.w , this.y - Math.sin(ang) * this.w / 2, this.w/2 * (this.v/this.vMax),this.v,this.angle,15, this.thrustColor);
	}
	update() {
		if ((frames + this.tick) % 30 == 0 && this.ts == null) {
			findNearestTarget(this);
		}
		if (this.ts == null) {
			if ((frames + this.tick) % 240 == 120) {
				this.tang = this.angle;
				this.tv = 0.8 * this.vMax;
			}
			if ((frames + this.tick) % 240 == 0) {
				if (Math.random() > 0.5) {
					this.tang += Math.PI / 4;
				} else {
					this.tang -= Math.PI / 4;
				}
			}
		} else {
			if ((frames + this.tick) % 60 == 0) {
				if (Math.random() > 0.5) this.offAngle *= -1;
			}
			dist = findDist2(this,this.ts);
			this.targang = calculateProjLead(this,this.ts);
			if (dist < this.weaponRange) {
				if (dist < this.minRange && nofShips[this.side] > 2 && i > 2) {
					if ((frames + this.tick) % 5 == 0) this.tang = Math.atan2(this.ts.y - this.y, this.ts.x - this.x) + Math.PI;
				} else {
					if ((frames + this.tick) % 5 == 0) this.tang = Math.atan2(this.ts.y - this.y, this.ts.x - this.x) + this.offAngle;
				}
				if (this.currCD < this.CD / 3) {
					this.tv = 0;
				} else {
					this.tv = this.vMax;
				}
				if (this.currCD > 0) {
					this.currCD --;
				} else {
					this.currCD = this.CD;
					proj[proj.length] = new Proj(this.x, this.y, 4, calculateProjLead(this,this.ts), this.projSpeed, 1,this.side);
				}
			} else {
				if ((frames + this.tick) % 5 == 0) this.tang = Math.atan2(this.ts.y - this.y, this.ts.x - this.x);
				this.tv = this.vMax;
			}
		}
		autoTurn(this);
	}
}
class Fighter extends Ship {
	constructor(x, y, side) {
		super(x, y, width.fighter, side);
		this.HP = 3;
		this.HPMax = this.HP;
		this.angle = -Math.PI/2;
		this.v = 0.6;
		this.tv = 0.25;
		this.vMax = 0.45;
		this.turn = 0.045;
		this.weaponRange = 355 * 355;
		this.sightRange = 455 * 455;
		this.a = 0.01;
		this.d = 0.005;
		this.CD = 180;
		this.currCD = Math.floor(Math.random() * this.CD);
		this.projSpeed = 2;
		if (side == 1) {
			this.image = white.fighter;
			this.thrustColor = whiteThrust;
		} else {
			this.image = purple.fighter;
			this.thrustColor = purpleThrust;
		}
		warpEff.spawn(this);
		if (currState == gameState && side != p.side) {
			this.v += wave * 0.025;
			this.a += wave * 0.005;
			this.CD -= difficulty * 10;
			this.vMax += difficulty * 0.075
			if (this.CD > 100) this.CD -= wave * 5;
		}
	}
	render() {
		renderShipImage(this);
		ang = this.angle + (Math.random() - 0.5)*2;
		if ((frames + this.tick) % 5 == 0) thrustEff.spawn(this.x - Math.cos(ang) * this.w , this.y - Math.sin(ang) * this.w / 2, this.w/2,this.v,this.angle,15, this.thrustColor);
	}
	update() {
		if ((frames + this.tick) % 30 == 0 && this.ts == null) {
			findNearestTarget(this);
		}
		if (this.ts == null) {
			if ((frames + this.tick) % 240 == 120) {
				this.tang = this.angle;
				this.tv = 0.5;
			}
			if ((frames + this.tick) % 240 == 0) {
				if (Math.random() > 0.5) {
					this.tang += Math.PI / 4;
				} else {
					this.tang -= Math.PI / 4;
				}
			}
		} else {
			if (findDist2(this,this.ts) < this.weaponRange) {
				if ((frames + this.tick) % 5 == 0) this.tang = calculateProjLead(this,this.ts)
				if (this.currCD > this.CD / 4) {
					this.tv = this.vMax;
				} else {
					this.tv = 0;
				}
				if (this.currCD > 0) {
					this.currCD --;
				} else {
					this.currCD = this.CD;
					proj[proj.length] = new Missile(this.x, this.y, 3, this.angle, this.projSpeed, 1,this.ts);
				}
			} else {
				if ((frames + this.tick) % 45 == 0) this.tang = Math.atan2(this.ts.y - this.y, this.ts.x - this.x) + (Math.random() - 0.5) * 1.5;
				this.tv = this.vMax;
			}
		}
		autoTurn(this);
	}
}
class Destroyer extends Ship {
	constructor(x, y, side) {
		super(x, y, width.destroyer, side);
		this.HP = 16;
		this.HPMax = this.HP;
		this.angle = -Math.PI/2;
		this.v = 0.65;
		this.vAim = 0.4;
		this.tv = 0.25;
		this.vMax = 0.9;
		this.turn = 0.05;
		this.weaponRange = 444 * 444;
		this.weaponRange2 = 444;
		this.attackRange = 111 * 111;
		this.sightRange = 666 * 666;
		this.a = 0.05;
		this.d = 0.05;
		this.CD = 300;
		this.projSpeed = 2.5;
		this.arc = 0.3;
		this.currCD = Math.floor(Math.random() * this.CD);
		if (side == 1) {
			this.image = white.destroyer;
			this.thrustColor = whiteThrust;
		} else {
			this.image = purple.destroyer;
			this.thrustColor = purpleThrust;
		}
		warpEff.spawn(this);
		if (currState == gameState && side != p.side) {
			this.v += wave * 0.025;
			this.a += wave * 0.005;
			this.vMax += difficulty * 0.05;
			if (this.CD > 100) this.CD -= wave * 6;
		}
	}
	render() {
		renderShipImage(this);
		if ((frames + this.tick) % 5 == 0) {
			ang = this.angle + Math.random() * 0.6 + 0.2;
			thrustEff.spawn(this.x - Math.cos(ang) * this.w , this.y - Math.sin(ang) * this.w / 2, this.w/4,this.v,this.angle,15, this.thrustColor);
			ang = this.angle - Math.random() * 0.6 + 0.2;
			thrustEff.spawn(this.x - Math.cos(ang) * this.w , this.y - Math.sin(ang) * this.w / 2, this.w/4,this.v,this.angle,15, this.thrustColor);
		}
	}
	alert() {
		if (this.currCD < 60 && this.ts != null && Math.abs(Math.atan2(this.ts.y - this.y, this.ts.x - this.x) - this.angle) < this.arc) {
			ctx.setLineDash([10, 10]);
			ctx.lineDashOffset = 1000 - frames % 1000;
			ctx.strokeStyle = "orange";
			for (o = 0 ; o < 3 ; o ++) {
				x = this.x + Math.cos(this.angle - 0.05 + o * 0.05) * this.weaponRange2;
				y = this.y + Math.sin(this.angle - 0.05 + o * 0.05) * this.weaponRange2;
				ctx.beginPath();
				ctx.moveTo(this.x, this.y);
				ctx.lineTo(x, y);
				ctx.stroke();
			}
			ctx.setLineDash([0,0]);
		}
	}
	update() {
		if ((frames + this.tick) % 30 == 0 && this.ts == null) {
			findLargestInRange(this);
		}
		if (this.ts == null) {
			this.tv = this.vMax * 0.5;
			if ((frames + this.tick) % 240 == 120) {
				this.tang = this.angle;
				this.tv = this.vMax * 0.5;
			}
			if ((frames + this.tick) % 240 == 0) {
				if (Math.random() > 0.5) {
					this.tang += Math.PI / 4;
				} else {
					this.tang -= Math.PI / 4;
				}
			}
		} else {
			dist = findDist2(this, this.ts);
			ang = Math.atan2(this.ts.y - this.y, this.ts.x - this.x);
			if (Math.abs(ang - this.angle) > 2 || this.currCD > this.CD * 0.5) {
				this.tv = this.vMax;
				if (dist < this.attackRange) {
					this.tang = ang + Math.PI;
				} else {
					this.tang = ang;
				}
			} else {
				this.tang = calculateProjLead(this,this.ts);
				this.tv = this.vAim;
			}
			if (dist < this.weaponRange && Math.abs(ang - this.angle) < this.arc && this.currCD == 0) {
				this.currCD = this.CD;
				this.fire();
			}
			if (this.currCD > 0) {
				this.currCD --;
			}
		}
		autoTurn(this);
	}
	fire() {
		proj[proj.length] = new Proj(this.x, this.y, 6, this.angle - 0.05, this.projSpeed, 1,this.side);
		proj[proj.length] = new Proj(this.x, this.y, 6, this.angle, this.projSpeed, 1,this.side);
		proj[proj.length] = new Proj(this.x, this.y, 6, this.angle + 0.05, this.projSpeed, 1,this.side);
	}
}
class Destroyer2 extends Destroyer {
	constructor(x, y, side) {
		super(x, y, side);
		this.HP += 4;
		this.HPMax = this.HP;
		this.w = width.destroyer2;
		this.CD = 270;
		this.currCD = 270;
		this.turn *= 1.5;
		this.vMax *= 0.35;
		this.vAim *= 0.5;
		this.sightRange = 10000000;
		this.attackRange = 25;
		this.weaponRange = 1000000;
		this.weaponRange2 = 1000;
		this.projSpeed = 3;
		if (side == 1) {
			this.image = white.corsair;
		} else {
			this.image = purple.corsair;
		}
		if (currState == gameState && side != p.side) {
			this.CD -= difficulty * 10;
		}
	}
	render() {
		renderShipImage(this);
		if ((frames + this.tick) % 5 == 0) {
			ang = this.angle + Math.random() * 0.6 + 0.2;
			thrustEff.spawn(this.x - Math.cos(ang) * this.w , this.y - Math.sin(ang) * this.w / 2, this.w/4,this.v,this.angle,15, this.thrustColor);
			ang = this.angle - Math.random() * 0.6 + 0.2;
			thrustEff.spawn(this.x - Math.cos(ang) * this.w , this.y - Math.sin(ang) * this.w / 2, this.w/4,this.v,this.angle,15, this.thrustColor);
		}
	}
	alert() {
		if (this.currCD < 60 && this.ts != null && this.currCD < 60 && Math.abs(Math.atan2(this.ts.y - this.y, this.ts.x - this.x) - this.angle) < this.arc) {
			ctx.strokeStyle = "orange";
			x = this.x + Math.cos(this.angle) * this.weaponRange2;
			y = this.y + Math.sin(this.angle) * this.weaponRange2;
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(x, y);
			ctx.setLineDash([10, 10]);
			ctx.lineDashOffset = 1000 - frames % 1000;
			ctx.stroke();
			ctx.setLineDash([0,0]);
		}
	}
	fire() {
		proj[proj.length] = new Destroyer2Proj(this.x, this.y, 10, this.angle, this.projSpeed, 2,this.side);
	}
}
class Carrier extends Ship {
	constructor(x, y, side) {
		super(x, y, width.carrier, side);
		this.HP = 16;
		this.HPMax = this.HP;
		this.angle = -Math.PI/2;
		this.v = 0;
		this.tv = 0.25;
		this.vMax = 0.5;
		this.turn = 0.02;
		this.attackRange = 155 * 155;
		this.sightRange = 455 * 455;
		this.a = 0.05;
		this.d = 0.05;
		this.offAngle = 0;
		this.CD = 120;
		this.CD2 = 180;
		this.currCD = Math.floor(Math.random() * this.CD);
		this.currCD2 = Math.floor(Math.random() * this.CD2);
		this.ar = [];
		if (side == 1) {
			this.image = white.carrier;
			this.thrustColor = whiteThrust;
		} else {
			this.image = purple.carrier;
			this.thrustColor = purpleThrust;
		}
		warpEff.spawn(this);
		if (currState == gameState && side != p.side) {
			this.v += wave * 0.025;
			this.a += wave * 0.005;
			if (this.CD > 100) this.CD -= wave * 3;
			this.CD -= difficulty * 10;
			this.CD2 -= difficulty * 10;
		}
	}
	render() {
		renderShipImage(this);
		if ((frames + this.tick) % 5 == 0) {
			ang = this.angle + Math.random() * 0.8;
			thrustEff.spawn(this.x - Math.cos(ang) * this.w , this.y - Math.sin(ang) * this.w / 2, this.w/4,this.tv * 2,this.angle,25, this.thrustColor);
			ang = this.angle - Math.random() * 0.8;
			thrustEff.spawn(this.x - Math.cos(ang) * this.w , this.y - Math.sin(ang) * this.w / 2, this.w/4,this.tv * 2,this.angle,25, this.thrustColor);
		}
	}
	update() {
		if ((frames + this.tick) % 30 == 0 && this.ts == null) {
			findNearestTarget(this);
		}
		if (this.ts == null) {
			if ((frames + this.tick) % 240 == 120) {
				this.tang = this.angle;
				this.tv = this.vMax * 0.5;
			}
			if ((frames + this.tick) % 240 == 0) {
				if (Math.random() > 0.5) {
					this.tang += Math.PI / 4;
				} else {
					this.tang -= Math.PI / 4;
				}
			}
		} else {
			if ((frames + this.tick) % 15 == 0) {
				if (Math.random() > 0.5) this.offAngle = (Math.random() - 0.5) * 1.2;
				if (findDist2(this, this.ts) < this.attackRange) {
					this.tang = Math.atan2(this.ts.y - this.y, this.ts.x - this.x) + Math.PI;
					this.tv = this.vMax * 0.3;
				} else {
					this.tang = Math.atan2(this.ts.y - this.y, this.ts.x - this.x) + this.offAngle;
					this.tv = this.vMax;
				}
			}
			if (this.currCD > 0) {
				this.currCD --;
			} else if (this.ar.length < 3) {
				this.currCD = this.CD;
				ship[ship.length] = new Interceptor(this.x, this.y, this.side);
				this.ar[this.ar.length] = ship[ship.length - 1];
			}
			if (this.currCD2 > 0) {
				this.currCD2 --;
			} else if (this.ar.length < 2) {
				this.currCD2 = this.CD2;
				ship[ship.length] = new Fighter(this.x, this.y, this.side);
				this.ar[this.ar.length] = ship[ship.length - 1];
			}
		}
		if (frames % 10 == 0) {
			for (k = 0 ; k < this.ar.length ; k ++) {
				if (this.ts != p) {
					this.ar[k].ts = this.ts;
				} else {
					if (attack.length < attackMax) {
						this.ar[k].ts = this.ts;
						attack[attack.length] = this.ar[k];
					}
				}
				if (this.ar[k].HP <= 0) {
					this.ar.splice(k, 1);
					k --;
				}
			}
		}
		autoTurn(this);
	}
}
class Station extends Ship {
	constructor(x, y, side) {
		super(x, y, width.station, side);
		this.HP = 100;
		this.w2 = this.w * 1.4;
		this.HPMax = this.HP;
		this.angle = -Math.PI/2;
		this.v = 0;
		this.tv = 0;
		this.vMax = 3;
		this.turn = 0.05;
		this.attackRange = 300 * 300;
		this.sightRange = 455 * 455;
		this.a = 0.05;
		this.d = 0.05;
		this.offAngle = 0;
		this.CD = 450;
		this.CD2 = 600;
		this.currCD = Math.floor(Math.random() * this.CD);
		this.currCD2 = Math.floor(Math.random() * this.CD2);
		this.nof = 8;
		this.nof2 = 12;
		this.nof3 = 9;
		this.nof3 = 4;
		this.ar = [];
		this.ang = 0;
		if (side == 1) {
			this.image = white.carrier;
			this.thrustColor = whiteThrust;
		} else {
			this.image = purple.station;
			this.thrustColor = purpleThrust;
		}
		warpEff.spawn(this);
		if (currState == gameState && side != p.side) {
			this.v += wave * 0.025;
			this.a += wave * 0.005;
			if (this.CD > 100) this.CD -= wave * 3;
			this.CD -= difficulty * 10;
			this.CD2 -= difficulty * 10;
		}
	}
	render() {
		renderShipImage(this);
		if (this.HP < this.HPMax / 2) {
			if (frames % 15 == 0 && Math.random() > 0.7 + 0.3 * this.HP / this.HPMax) {
				ang = Math.random() * 2 * Math.PI;
				temp = Math.random() * this.w;
				x = this.x + Math.cos(ang) * temp;
				y = this.y + Math.sin(ang) * temp;
				temp2 = Math.random() * this.w / 2 + this.w / 5;
				explosionEff.spawn(x, y, temp2);
				if (Math.random() > 0.5 + 0.5 * this.HP / this.HPMax) {
					onFireEff.spawn(explosionEff.ar[explosionEff.arm - 1]);
				}
			}
		}
	}
	update() {
		if (frames % 600 == 0) {
			for (o = 0 ; o < 18 ; o ++) {
				temp = o / 9 * Math.PI + this.angle;
				proj[proj.length] = new Proj(this.x + Math.cos(temp) * this.w, this.y + Math.sin(temp) * this.w, 12, temp, 1, 3, this.side);
			}
		}
		if (this.nof2 > 0 && this.HP < this.HPMax * 0.5 && this.HP > this.HPMax * 0.25 && frames % 35 == 0) {
			ship[ship.length] = new Interceptor(this.x + Math.cos(this.ang) * this.w2, this.y + Math.sin(this.ang) * this.w2, this.side);
			this.ang += Math.PI * 0.25;
			this.nof2 --;
		}
		if (this.nof3 > 0 && this.HP < this.HPMax * 0.9 && this.HP > this.HPMax * 0.6 && frames % 75 == 0) {
			ship[ship.length] = new Fighter(this.x + Math.cos(this.ang) * this.w2, this.y + Math.sin(this.ang) * this.w2, this.side);
			this.ang += Math.PI * 0.25;
			this.nof3 --;
		}
		if (this.nof4 > 0 && this.HP < this.HPMax * 0.25 && this.HP > this.HPMax * 0.1 && frames % 60 == 0) {
			ship[ship.length] = new Carrier(this.x + Math.cos(this.ang) * this.w2, this.y + Math.sin(this.ang) * this.w2, this.side);
			this.ang += Math.PI * 0.25;
			this.nof4 -= 2;
		}
		if (this.currCD > 0) {
			this.currCD --;
		} else if (this.ar.length < 2 && this.nof > 0) {
			this.currCD = this.CD;
			ship[ship.length] = new Destroyer(this.x + Math.cos(this.angle + Math.PI / 2) * this.w2, this.y + Math.sin(this.angle + Math.PI / 2) * this.w2, this.side);
			this.ar[this.ar.length] = ship[ship.length - 1];
			this.nof --;
		}
		if (this.currCD2 > 0) {
			this.currCD2 --;
		} else if (this.ar.length < 2 && this.nof > 0) {
			this.currCD2 = this.CD2;
			ship[ship.length] = new Carrier(this.x + Math.cos(this.angle - Math.PI / 2) * this.w2, this.y + Math.sin(this.angle - Math.PI / 2) * this.w2, this.side);
			this.ar[this.ar.length] = ship[ship.length - 1];
			this.nof --;
		}
		if (frames % 10 == 0) {
			for (k = 0 ; k < this.ar.length ; k ++) {
				if (this.ts != p) {
					this.ar[k].ts = this.ts;
				} else {
					if (attack.length < attackMax) {
						this.ar[k].ts = this.ts;
						attack[attack.length] = this.ar[k];
					}
				}
				if (this.ar[k].HP <= 0) {
					this.ar.splice(k, 1);
					k --;
				}
			}
		}
		autoTurn(this);
	}
	hurt(q) {
		debrisEff.spawn(this, q);
		debrisEff.spawn(this);
		onFireEff.spawn(debrisEff.ar[debrisEff.arm - 1]);
		playRandom(Hurt);
	}
	death() {
		shipDestroyedEff.ar[shipDestroyedEff.arm - 1].turn = 0;
		for (var i = 0 ; i < ship.length ; i ++) {
			if (ship[i].side == this.side) ship[i].HP = 0;
		}
		this.v = this.vMax;
		for (o = 0 ; o < 35 ; o ++) {
			debrisEff.spawn(this);
			onFireEff.spawn(debrisEff.ar[debrisEff.arm - 1]);
			debrisEff.ar[debrisEff.arm - 1].w = this.w * Math.random() * 0.75;
			debrisEff.ar[debrisEff.arm - 1].W = 0.997;
			debrisEff.ar[debrisEff.arm - 1].maxLife += 60 + Math.floor(Math.random() * 60);
			if (debrisEff.ar[debrisEff.arm - 1].w > width.destroyer) {
				temp = Math.random();
				if (temp > 0.7) {
					debrisEff.ar[debrisEff.arm - 1].image = purple.carrier.dead[0][Math.floor(Math.random() * purple.carrier.dead[0].length)];
					debrisEff.ar[debrisEff.arm - 1].w = width.carrier;
				} else if (temp > 0.4) {
					debrisEff.ar[debrisEff.arm - 1].image = purple.destroyer.dead[0][Math.floor(Math.random() * purple.destroyer.dead[0].length)];
					debrisEff.ar[debrisEff.arm - 1].w = width.destroyer;
				} else {
					debrisEff.ar[debrisEff.arm - 1].image = purple.corsair.dead[0][Math.floor(Math.random() * purple.corsair.dead[0].length)];
					debrisEff.ar[debrisEff.arm - 1].w = width.destroyer2;
				}
			}
		}
	}
}
class PlayerShip0 extends Ship {
	constructor(x, y) {
		super(x, y, 9, 1);
		this.HP = 4;
		this.HPMax = this.HP;
		this.angle = -Math.PI/2;
		this.v = 0;
		this.vMax = 1.5;
		this.tv = 0;
		this.turn = 0.11;
		this.a = 0.25;
		this.d = 0.25;
		this.vSlow = 0.05;
		this.image = white.ship0;
		this.thrustColor = whiteThrust;
		this.weapon = {
			"currCD":0,
			"CD":40,
			"speed":5.5,
			"damage":2,
			"lifeSpan":65,
			"w":5,
			"boost":[],
			"tickMax":12,
			"tick":0,
			"update":function() {
				if (this.currCD > 0) {
					this.currCD --;
				} else if (keys[121] || keys[32]) {
					this.currCD = this.CD;
					this.fire();
				}
			},
			"fire":function() {
				ang = Math.atan2(diffY, diffX);
				proj[proj.length] = new PlayerShip0Proj(p.x, p.y, this.w, ang, this.speed, this.damage, this.lifeSpan, p.side);
				for (k = 0 ; k < this.boost.length ; k ++) {
					if (this.tick % (k + 1) == 0) {
						for (o = 0 ; o < this.boost[k].length ; o ++) {
							this.boost[k][o]();
						}
					}
				}
				this.tick ++;
				if (this.tick == this.tickMax) this.tick = 0;
			}
		}
		for (i = 0 ; i < this.weapon.tickMax ; i ++) this.weapon.boost[i] = [];
		this.avail = [];
		this.upgrade = [
			{
				"text":["+2 HP"],
				"level":0,
				"locked":false,
				"upgrade":function() {
					p.HPMax += 2;
					this.locked = true;
				}
			},
			{
				"text":["Big shot every 3 shots"],
				"level":0,
				"locked":false,
				"upgrade":function() {
					p.weapon.boost[2][p.weapon.boost[2].length] = function() {
						proj[proj.length - 1].w *= 2;
						proj[proj.length - 1].damage *= 2;
						proj[proj.length - 1].lifeSpan *= 4;
					}
					this.locked = true;
				}
			},
			{
				"text":["Triple shot every 4 shots"],
				"level":0,
				"locked":false,
				"upgrade":function() {
					p.weapon.boost[3][p.weapon.boost[3].length] = function() {
						proj[proj.length] = new PlayerShip0Proj(p.x, p.y, p.weapon.w, ang + 0.1, p.weapon.speed, p.weapon.damage, p.weapon.lifeSpan, p.side);
						proj[proj.length] = new PlayerShip0Proj(p.x, p.y, p.weapon.w, ang - 0.1, p.weapon.speed, p.weapon.damage, p.weapon.lifeSpan, p.side);
					}
					this.locked = true;
				}
			},
		];
		warpEff.spawn(this, false);
	}
	setUp() {
		this.HP = this.HPMax;
		this.weapon.currCD = 0;
		this.v = 0;
		this.tv = 0;
		ship[0] = this;
	}
	render() {
		ctx.save();
		ctx.translate(Math.floor(this.x), Math.floor(this.y));
		ctx.rotate(this.angle + Math.PI / 2);
		ctx.drawImage(this.image.ship[0][Math.floor(this.image.ship[0].length - this.HP/this.HPMax * (this.image.ship[0].length))], -this.w, -this.w, this.w * 2, this.w * 2);
		ctx.restore();
		ang = this.angle + (Math.random() - 0.5) * 1.3;
		thrustEff.spawn(this.x - Math.cos(ang) * this.w , this.y - Math.sin(ang) * this.w / 2, this.w / 3,this.v,this.angle,6, this.thrustColor);
	}
	update() {
		updatePlayer();
	}
}
class PlayerShip1 extends Ship {
	constructor(x, y) {
		super(x, y, 10, 1);
		this.HP = 4;
		this.HPMax = this.HP;
		this.angle = -Math.PI/2;
		this.v = 0;
		this.vMax = 1.5;
		this.tv = 0;
		this.turn = 0.13;
		this.a = 0.35;
		this.d = 0.35;
		this.vSlow = 0.08;
		this.image = white.ship1;
		this.thrustColor = whiteThrust;
		this.weapon = {
			"currCD":0,
			"CD":8,
			"chargeMax":6,
			"chargeCD":16,
			"chargeCurr":16,
			"speed":5,
			"damage":2,
			"lifeSpan":65,
			"firing":false,
			"charge":6,
			"w":3,
			"boost":[],
			"tickMax":12,
			"tick":0,
			"update":function() {
				if ((keys[121] || keys[32]) && this.charge > 0 && !this.firing && this.charge == this.chargeMax) {
					this.firing = true;
					this.currCD = this.CD;
				}
				if (this.currCD > 0) {
					this.currCD --;
				} else if (this.firing) {
					this.fire();
					this.currCD = this.CD;
					this.charge --;
					if (this.charge == 0) this.firing = false;
				}
				if (this.charge < this.chargeMax && !this.firing) {
					if (this.chargeCurr > 0) {
						this.chargeCurr --;
					} else {
						this.charge ++;
						this.chargeCurr = this.chargeCD;
					}
				}
			},
			"fire":function() {
				ang = Math.atan2(diffY, diffX);
				proj[proj.length] = new PlayerShip1Proj(p.x + Math.cos(p.angle + Math.PI * 0.2) * p.w * 0.75, p.y + Math.sin(p.angle + Math.PI * 0.2) * p.w * 0.75, this.w, ang, this.speed, this.damage, this.lifeSpan, p.side);
				for (k = 0 ; k < this.boost.length ; k ++) {
					if (this.tick % (k + 1) == 0) {
						for (o = 0 ; o < this.boost[k].length ; o ++) {
							this.boost[k][o]();
						}
					}
				}
				this.tick ++;
				if (this.tick == this.tickMax) this.tick = 0;
			}
		}
		for (i = 0 ; i < this.weapon.tickMax ; i ++) this.weapon.boost[i] = [];
		this.avail = [];
		this.upgrade = [
			{
				"text":["+2 HP"],
				"level":0,
				"locked":false,
				"upgrade":function() {
					p.HPMax += 2;
					this.locked = true;
				}
			},
			{
				"text":["+2 Missiles"],
				"level":0,
				"locked":false,
				"upgrade":function() {
					p.weapon.chargeMax += 2;
					this.locked = true;
				}
			},
			{
				"text":["-40% Reload time"],
				"level":0,
				"locked":false,
				"upgrade":function() {
					p.weapon.chargeCD = Math.ceil(p.weapon.chargeCD * 0.6);
					this.locked = true;
				}
			},
		];
		warpEff.spawn(this, false);
	}
	setUp() {
		this.HP = this.HPMax;
		this.weapon.currCD = 0;
		this.v = 0;
		this.tv = 0;
		ship[0] = this;
	}
	render() {
		if (this.weapon.charge < this.weapon.chargeMax) {
			ctx.fillStyle = "white";
			for (k = 0 ; k < this.weapon.charge ; k ++) {
				ctx.fillRect(this.x - 18 + k / this.weapon.chargeMax * 36, this.y - this.w * 1.8, this.w * 0.2, this.w * 0.2);
			}
		}
		ctx.save();
		ctx.translate(Math.floor(this.x), Math.floor(this.y));
		ctx.rotate(this.angle + Math.PI / 2);
		ctx.translate(0,-2);
		ctx.drawImage(this.image.ship[0][Math.floor(this.image.ship[0].length - this.HP/this.HPMax * (this.image.ship[0].length))], -this.w, -this.w, this.w * 2, this.w * 2);
		ctx.restore();
		ang = this.angle + (Math.random() - 0.5) * 1.3;
		thrustEff.spawn(this.x - Math.cos(ang) * this.w , this.y - Math.sin(ang) * this.w / 2, this.w / 3,this.v,this.angle,6, this.thrustColor);
	}
	update() {
		updatePlayer();
	}
}
function warp(x, y, ship) {
	if (x < 0) x = 0;
	if (x > mapX) x = mapX;
	if (y < 0) y = 0;
	if (y > mapY) y = mapY;
	if (ship == "interceptor") warpWarningEff.spawn(x, y, width.interceptor, Interceptor, -p.side);
	if (ship == "fighter") warpWarningEff.spawn(x, y, width.fighter, Fighter, -p.side);
	if (ship == "destroyer") warpWarningEff.spawn(x, y, width.destroyer, Destroyer, -p.side);
	if (ship == "destroyer2") warpWarningEff.spawn(x, y, width.destroyer2, Destroyer2, -p.side);
	if (ship == "carrier") warpWarningEff.spawn(x, y, width.carrier, Carrier, -p.side);
	if (ship == "station") warpWarningEff.spawn(x, y, width.station, Station, -p.side);
}
function calculateProjLead(q, e) {
	dist3 = Math.sqrt(findDist2(q, e));
	temp = Math.abs(e.angle - Math.atan2(e.y - q.y, e.x - q.x));
	if (Math.abs(e.v) > 1) {
		dist4 = Math.sqrt(findDist(e.x + dist3 / e.v, e.y + dist3 / e.v, q.x, q.y));
		addX = Math.cos(e.angle) * dist4 / q.projSpeed / e.v / temp;
		addY = Math.sin(e.angle) * dist4 / q.projSpeed / e.v / temp;
	} else {
		dist4 = Math.sqrt(findDist(e.x + dist3 * e.v, e.y + dist3 * e.v, q.x, q.y)) * e.v;
		addX = Math.cos(e.angle) * dist4 / q.projSpeed * e.v / temp;
		addY = Math.sin(e.angle) * dist4 / q.projSpeed * e.v / temp;
	}
	return Math.atan2(e.y - q.y + addY, e.x - q.x + addX);
}
function updatePlayer() {
	if (keys[68]) p.angle += p.turn;
	if (keys[65]) p.angle -= p.turn;
	if (keys[87] && p.tv <= p.vMax) p.tv += p.a;
	if (keys[83] && p.tv >= -p.vMax) p.tv -= p.a;
	p.vx = Math.cos(p.angle) * p.v;
	p.vy = Math.sin(p.angle) * p.v;
	p.weapon.update();
}
function renderMenuArrow(x, y) {
	fore.beginPath();
	fore.moveTo(x, y - 0.02 * fh);
	fore.lineTo(x, y + 0.02 * fh);
	fore.lineTo(x + 0.024 * fw, y);
	fore.lineTo(x, y - 0.02 * fh);
	fore.fill();
}
function renderShipImage(q) {
	ctx.save();
	ctx.translate(Math.floor(q.x), Math.floor(q.y));
	ctx.rotate(q.angle + Math.PI / 2);
	if (q.HP > 0) {
		ctx.drawImage(q.image.ship[q.imageNum][Math.floor((q.HPMax - q.HP) / q.HPMax * (q.image.ship[q.imageNum].length))], -q.w, -q.w, q.w * 2, q.w * 2);
	} else {
		ctx.drawImage(q.image.ship[q.imageNum][q.image.ship[q.imageNum].length - 1], -q.w, -q.w, q.w * 2, q.w * 2);
	}
	ctx.restore();
}
function renderArrows() {
	for (i = 0 ; i < ship.length ; i ++) {
		if (ship[i] != p) {
			if (!inView(ship[i])) {
				if (ship[i].side == 1) {
					ctx.strokeStyle = "white";
				} else {
					ctx.strokeStyle = "orange";
				}
				ctx.save();
				ctx.translate(w / 2,h / 2);
				ctx.rotate(Math.atan2(ship[i].y - p.y,ship[i].x - p.x));
				ctx.beginPath();
				ctx.moveTo(p.w * 2.2 + 3,2);
				ctx.lineTo(p.w * 2.2 + 3,-2);
				ctx.lineTo(p.w * 2.2 + 9,0);
				ctx.lineTo(p.w * 2.2 + 3,2);
				ctx.stroke();
				ctx.restore();
			}
			ctx.fillStyle = "rgba(255,222,125,1)";
			/*if (ship[i].side != p.side && ship[i].currCD <= 35 && ship[i].ts == p && ship[i].ar == null) {
				if (frames % 6 < 4) {
					ctx.save();
					ctx.translate(w / 2,h / 2);
					ctx.rotate(Math.atan2(ship[i].y - p.y,ship[i].x - p.x));
					ctx.beginPath();
					ctx.moveTo(p.w * 6 - ship[i].w * 0.8,ship[i].w * 0.8);
					ctx.lineTo(p.w * 6 - ship[i].w * 0.8,-ship[i].w * 0.8);
					ctx.lineTo(p.w * 6 - ship[i].w * 1.6,0);
					ctx.lineTo(p.w * 6 - ship[i].w * 0.8,ship[i].w * 0.8);
					ctx.fill();
					ctx.restore();
				}
			}*/
		}
	}
}
function nofShipsCalc(side) {
	count = 0;
	for (o = 0 ; o < ship.length ; o ++) {
		if (ship[o].side == side) count ++;
	}
	return count;
}
function inView(q, y) {
	if (cam == null) return true;
	if (y == null) {
		if (q.x - cam.x > -q.w && q.x - cam.x -cw < q.w) {
			if (q.y - cam.y > -q.w && q.y - cam.y -ch < q.w) {
				return true;
			}
		}
	} else {
		if (q - cam.x > 0 && q - cam.x -cw < 0) {
			if (y - cam.y > 0 && y - cam.y -ch < 0) {
				return true;
			}
		}
	}
	return false;
}
function playRandom(ar) {
	ar[Math.floor(ar.length * Math.random())].play();
}
function setAttack(q, index) {
	if (index != -1) {
		if (ship[index] == p) {
			if (attack.length < attackMax) {
				q.ts = p;
				if (q.ar == null) attack[attack.length] = q;
			}
		} else {
			if (currState == gameState && q.side != p.side && p.HP > 0 && attack.length < attackMax / 2 && findDist2(q, p) < q.sightRange) {
				q.ts = p;
			} else {
				q.ts = ship[index];
			}
		}
	} else {
		q.ts = null;
	}
}
function findLargestInRange(q) {
	temp = 0;
	index = -1
	for (k = 0 ; k < ship.length ; k ++) {
		if (ship[k].side == -q.side) {
			dist = findDist2(ship[k],q);
			if (dist < q.sightRange) {
				if (ship[k].w > temp && ship[k].w < q.w * 2) {
					temp = ship[k].w;
					index = k;
				}
			}
		}
	}
	setAttack(q, index);
}
function findNearestTarget(q) {
	temp = 1000000;
	temp2 = 0;
	index = -1;
	for (k = 0 ; k < ship.length ; k ++) {
		if (ship[k].side == -q.side) {
			dist = findDist2(ship[k],q);
			if (dist < q.sightRange && (dist < temp || ship[k].HP > temp2)) {
				temp = dist;
				temp2 = ship[k].HP;
				index = k;
			}
		}
	}
	setAttack(q, index);
}
function autoTurn(q) {
	if (q.angle != q.tang) {
		if (Math.abs(q.angle - q.tang) < q.turn) {
			q.angle = q.tang;
		} else {
			q.angle += turn(q.angle, q.tang) * q.turn;
		}
		autoThrust(q);
	}
}
function autoThrust(q) {
	q.vx = Math.cos(q.angle) * q.v;
	q.vy = Math.sin(q.angle) * q.v;
}