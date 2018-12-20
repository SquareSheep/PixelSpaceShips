level[0] = {
	"locked":false,
	"isClear":false,
	"frames":0,
	"nextLevel":1,
	"setUp":function() {
		levelText.display(["Eliminate enemy ships"]);
		this.frames = 0;
		this.isClear = false;
		mapX = 600;
		mapY = 600;
		p.x = mapX / 2;
		p.y = mapY / 2;
	},
	"render":function() {
		if (this.frames == 240) levelText.display([]);
	},
	"update":function() {
		if (this.frames == 120 || this.frames == 240) {
			var x = Math.random() * mapX;
			var y = mapY * 0.4;
			var w = mapX * 0.35;
			warp(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, "interceptor");
			warp(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, "interceptor");
		}
		if (this.frames == 540 || this.frames == 600) {
			var x = Math.random() * mapX;
			var y = mapY * 0.7;
			var w = mapX * 0.55;
			warp(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, "interceptor");
			warp(x, y, "fighter");
		}
		this.frames ++;
		if (this.frames > 620 && nofShips[-p.side] == 0 && p.HP > 0) {
			if (!this.isClear) levelText.display(["Mission complete!"]);
			this.isClear = true;
		}
	}
}
level[1] = {
	"locked":false,
	"isClear":false,
	"frames":0,
	"nextLevel":2,
	"ship":[],
	"setUp":function() {
		levelText.display(["Eliminate the enemy carriers"]);
		this.frames = 0;
		this.isClear = false;
		mapX = 850;
		mapY = 500;
		p.x = mapX * 0.2;
		p.y = mapY * 0.5;
		var y = mapY * 0.5;
		var w = mapX * 0.25;
		ship[ship.length] = new Carrier((Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, -p.side);
		ship[ship.length] = new Carrier(mapX * 0.5 + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, -p.side);
		ship[ship.length] = new Carrier(mapX + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, -p.side);
		this.ship = [ship[1], ship[2], ship[3]];
	},
	"render":function() {
		if (this.frames == 240) levelText.display([]);
	},
	"update":function() {
		for (k = 0 ; k < this.ship.length ; k ++) {
			if (this.ship[k].HP <= 0) {
				for (o = 0 ; o < this.ship[k].ar.length ; o ++) {
					this.ship[k].ar[o].HP = 0;
				}
				this.ship.splice(k, 1);
				var x = p.x;
				var y = p.y;
				var w = mapX * 0.1;
				ship[ship.length] = new Interceptor(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, p.side);
				ship[ship.length] = new Interceptor(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, p.side);
			}
		}
		this.frames ++;
		if (this.frames > 240 && nofShips[-1] == 0 && p.HP > 0) {
			if (!this.isClear) levelText.display(["Mission complete!"]);
			this.isClear = true;
		}
	}
}
level[2] = {
	"locked":false,
	"isClear":false,
	"canClear":true,
	"frames":0,
	"nextLevel":3,
	"setUp":function() {
		levelText.display(["Protect your ships"]);
		this.frames = 0;
		this.isClear = false;
		this.canClear = true;
		mapX = 900;
		mapY = 900;
		p.x = mapX * 0.5;
		p.y = mapY * 0.5;
		ship[ship.length] = new Carrier(p.x,p.y,p.side);
		ship[ship.length] = new Fighter(p.x,p.y,p.side);
		ship[ship.length] = new Fighter(p.x,p.y,p.side);

	},
	"render":function() {
		if (this.frames == 240) levelText.display([]);
		if (this.frames == 720) levelText.display(["Enemy ships arriving"]);
		if (this.frames == 900) levelText.display([]);
	},
	"update":function() {
		if (this.frames >= 800 && this.frames <= 1020 && this.frames % 60 == 0) warp(mapX * 0.8 + (Math.random() - 0.5) * mapX * 0.25, mapY * 0.5 + (Math.random() - 0.5) * mapX * 0.25, "interceptor");
		if (this.frames == 240) {
			var x = mapX * 0.7;
			var y = mapY * 0.3;
			var w = mapX * 0.5;
			warp(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, "destroyer");
			warp(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, "destroyer");
		}
		if (this.frames == 920 || this.frames == 1560) {
			var x = mapX * 0.8;
			var y = mapY * 0.5;
			var w = mapX * 0.25;
			warp(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, "destroyer");
		}
		if (this.frames >= 1200 && this.frames <= 1440 && this.frames % 60 == 0) warp(mapX * 0.2 + (Math.random() - 0.5) * mapX * 0.25, mapY * 0.5 + (Math.random() - 0.5) * mapX * 0.25, "fighter");
		this.frames ++;
		if (this.frames > 1200 && nofShips[-p.side] == 0 && this.canClear && p.HP > 0) {
			if (!this.isClear) levelText.display(["Mission complete!"]);
			this.isClear = true;
		}
	}
}
level[3] = {
	"locked":false,
	"isClear":false,
	"frames":0,
	"nextLevel":4,
	"setUp":function() {
		this.frames = 0;
		this.isClear = false;
		mapX = 1000;
		mapY = 750;
		p.x = mapX * 0.1;
		p.y = mapY * 0.5;
		var x = mapX * 0.1; var y = mapY * 0.5; var w = mapX * 0.25;
		ship[ship.length] = new Carrier(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, p.side);
		ship[ship.length] = new Fighter(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, p.side);
		ship[ship.length] = new Fighter(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, p.side);
		x = mapX * 0.9; y = mapY * 0.5; w = mapX * 0.15;
		levelText.display(["Destroy the incoming ships"]);
	},
	"render":function() {
		if (this.frames == 180) levelText.display([]);
	},
	"update":function() {
		if (this.frames == 60 || this.frames == 540) {
			var x = mapX * 0.1; var y = mapY * 0.5; var w = mapX * 0.15;
			ship[ship.length] = new Destroyer(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, p.side);
		}
		if (this.frames == 180 || this.frames == 360 || this.frames == 540 || this.frames == 800) {
			x = mapX * 0.8; y = mapY * 0.5; w = mapX * 0.15;
			warp(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, "interceptor");
			warp(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, "interceptor");
			warp(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, "fighter");
		}
		if (this.frames == 1000 || this.frames == 1900) {
			x = mapX * 0.75; y = mapY * 0.5; w = mapX * 0.15;
			warp(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, "carrier");
			warp(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, "destroyer");
		}
		if (this.frames == 1100 || this.frames == 1600) {
			x = mapX * 0.75; y = mapY * 0.5; w = mapX * 0.15;
			warp(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, "destroyer2");
		}
		if (frames % 30 == 0) {
			for (i = 0 ; i < ship.length ; i ++) {
				if (ship[i].side == p.side && ship[i].ts == null && ship[i] != p) {
					ship[i].tang = Math.atan2(p.y - ship[i].y, p.x - ship[i].x);
				} else if (ship[i].ts == null) {
					ship[i].ts = p;
				}
			}
		}
		this.frames ++;
		if (this.frames > 1900 && nofShips[-p.side] == 0 && p.HP > 0) {
			if (!this.isClear) levelText.display(["Mission complete!"]);
			this.isClear = true;
		}
	}
}
level[4] = {
	"locked":false,
	"isClear":false,
	"frames":0,
	"saidOff":false,
	"saidFrame":0,
	"nextLevel":4,
	"setUp":function() {
		this.frames = 0;
		this.isClear = false;
		mapX = 1200;
		mapY = 900;
		p.x = mapX * 0.1;
		p.y = mapY * 0.5;
		var x = mapX * 0.1; var y = mapY * 0.5; var w = mapX * 0.55;
		ship[ship.length] = new Carrier(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, p.side);
		ship[ship.length] = new Destroyer(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, p.side);
		ship[ship.length] = new Fighter(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, p.side);
		ship[ship.length] = new Fighter(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, p.side);
		ship[ship.length] = new Fighter(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, p.side);
		x = mapX * 0.9; y = mapY * 0.5; w = mapX * 0.15;
		warp(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, "destroyer2");
		warp(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, "destroyer2");
		ship[ship.length] = new Station(mapX * 0.75, mapY * 0.5, -p.side);
		levelText.display(["Destroy the enemy station"]);
	},
	"render":function() {
		if (this.frames == 360) levelText.display([]);
		if (!this.saidOff && this.frames == this.saidFrame) {
			levelText.display([]);
			this.saidOff = true;
		}
		if (this.saidFrame == 0 && p.HP < p.HPMax) {
			this.saidFrame = this.frames + 240;
			levelText.display(["Stay behind your ships!"]);
		}
	},
	"update":function() {
		if (this.frames % 15 == 0 && nofShips[p.side] < 5 + Math.min(this.frames / 300, 4)) {
			ship[ship.length] = new shipList[Math.floor(Math.random() * shipList.length)](mapX * 0.1, mapY * 0.5, p.side);
		}
		if (this.frames == 60 || this.frames == 540) {
			var x = mapX * 0.1; var y = mapY * 0.5; var w = mapX * 0.15;
			ship[ship.length] = new Destroyer(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, p.side);
		}
		if (this.frames == 360 || this.frames == 540 || this.frames == 800) {
			x = mapX * 0.8; y = mapY * 0.5; w = mapX * 0.15;
			warp(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, "interceptor");
			warp(x + (Math.random() - 0.5) * w, y + (Math.random() - 0.5) * w, "fighter");
		}
		if (frames % 30 == 0) {
			for (i = 0 ; i < ship.length ; i ++) {
				if (ship[i].side == p.side && ship[i].ts == null && ship[i] != p) {
					ship[i].tang = Math.atan2(p.y - ship[i].y, p.x - ship[i].x);
				} else if (ship[i].ts == null) {
					ship[i].ts = p;
				}
			}
		}
		this.frames ++;
		if (this.frames > 1200 && nofShips[-p.side] == 0 && p.HP > 0) {
			if (!this.isClear) levelText.display(["Victory!"]);
			this.isClear = true;
		}
	}
}