function newImagesArray(x) {
	var ar = [];
	for (var i = 0 ; i < x.length ; i ++) {
		ar[i] = newImage(x[i]);
	}
	return ar;
}
function newImage(x) {
	var img = new Image();
	img.src = "../Images/" + x + ".png";
	return img;
}
class ShipImages {
	constructor(shipImages, deadImages, outline) {
		this.ship = [];
		this.dead = [];
		if (outline != null) this.outline = newImage(outline);
		for (var i = 0 ; i < shipImages.length ; i ++) {
			this.ship[i] = [];
			for (var k = 0 ; k < shipImages[i].length ; k ++) {
				this.ship[i][k] = newImage(shipImages[i][k]);
			}
		}
		for (var i = 0 ; i < deadImages.length ; i ++) {
			this.dead[i] = [];
			for (var k = 0 ; k < deadImages[i].length ; k ++) {
				this.dead[i][k] = newImage(deadImages[i][k]);
			}
		}
	}
}
var purple = {
	"debris":[],
	"corsair": new ShipImages([["Corsair Purple", "Corsair Purple Damaged1", "Corsair Purple Damaged2"]], 
	[["Corsair Purple Destroyed1","Corsair Purple Destroyed2", "Corsair Purple Destroyed3"]], "Corsair Purple Enemy Outline"),
	"destroyer": new ShipImages([["Destroyer Purple", "Destroyer Purple Damaged1", "Destroyer Purple Damaged2"]], 
	[["Destroyer Purple Destroyed1", "Destroyer Purple Destroyed2"]], "Destroyer Purple Enemy Outline"),
	"carrier": new ShipImages([["Carrier Purple", "Carrier Purple Damaged1", "Carrier Purple Damaged2"]], 
	[["Carrier Purple Destroyed1","Carrier Purple Destroyed2", "Carrier Purple Destroyed3"]], "Carrier Purple Enemy Outline"),
	"interceptor": new ShipImages([["Interceptor Purple"]], [["Interceptor Purple Destroyed1", "Interceptor Purple Destroyed2"]], "Interceptor Purple Enemy Outline"),
	"fighter": new ShipImages([["Fighter Purple", "Fighter Purple Damaged1"]], [["Fighter Purple Destroyed1"]], "Fighter Purple Enemy Outline"),
	"station": new ShipImages([["Purple Station", "Purple Station Damaged1", "Purple Station Damaged2", "Purple Station Damaged3"]], [["Purple Station Destroyed1", "Purple Station Destroyed2"]], "Purple Station Enemy Outline")
}
var white = {
	"debris":[],
	"corsair": new ShipImages([["White Corsair", "White Corsair Damaged1", "White Corsair Damaged2"]], 
	[["White Corsair Destroyed1","White Corsair Destroyed2", "White Corsair Destroyed3"]], "White Corsair Enemy Outline"),
	"destroyer": new ShipImages([["Destroyer White", "Destroyer White Damaged1", "Destroyer White Damaged2"]], 
	[["Destroyer White Destroyed1", "Destroyer White Destroyed2"]], "Destroyer White Enemy Outline"),
	"carrier": new ShipImages([["Carrier White", "Carrier White Damaged1", "Carrier White Damaged2"]], 
	[["Carrier White Destroyed1","Carrier White Destroyed2", "Carrier White Destroyed3"]], "Carrier White Enemy Outline"),
	"interceptor": new ShipImages([["Interceptor White"]], [["Interceptor White Destroyed1", "Interceptor White Destroyed2"]], "Interceptor White Enemy Outline"),
	"fighter": new ShipImages([["Fighter White", "Fighter White Damaged1"]], [["Fighter White Destroyed1"]], "Fighter White Enemy Outline"),
	"turret": new ShipImages([["Player Ship", "Player Ship Damaged1", "Player Ship Damaged2"]],[["Player Ship Destroyed1", "Player Ship Destroyed2"]]),
	"ship0": new ShipImages([["Ship0", "Ship0 Damaged1", "Ship0 Damaged2"]],[["Ship0 Destroyed1"]]),
	"ship1": new ShipImages([["Ship1", "Ship1 Damaged1", "Ship1 Damaged2"]],[["Ship1 Destroyed1"]])
}
purple.proj = [];
for (var i = 0; i < 4 ; i ++) {
	purple.proj[i] = newImage("Purple Proj (" + (4 - i) + ")");
}
white.proj = [];
for (var i = 0; i < 4 ; i ++) {
	white.proj[i] = newImage("White Proj (" + (4 - i) + ")");
}
purple.bullet = [];
for (var i = 0; i < 4 ; i ++) {
	purple.bullet[i] = newImage("Purple Bullet (" + (4 - i) + ")");
}
white.bullet = [];
for (var i = 0; i < 4 ; i ++) {
	white.bullet[i] = newImage("White Bullet (" + (4 - i) + ")");
}
var icon = {
	"alert":newImagesArray(["Alert (3)", "Alert (2)", "Alert (1)"]),
	"alert2":newImagesArray(["Alert2 (3)", "Alert2 (2)", "Alert2 (1)"]),
	"target":newImagesArray(["Target (1)", "Target (2)", "Target (3)", "Target (4)"]),
	"target2":newImagesArray(["Small Target (1)", "Small Target (2)", "Small Target (3)", "Small Target (4)"]),
	"HP":newImagesArray(["HP Drop (1)", "HP Drop (2)", "HP Drop (3)"])
}
for (var i = 0; i < 5 ; i ++) {
	white.proj[i] = new Image();
	white.proj[i].src = "../Images/White Proj (" + (5 - i) + ").png";
}
purple.bomb = newImagesArray(["Purple Bomb (1)", "Purple Bomb (2)", "Purple Bomb (3)"]);
white.bomb = newImagesArray(["White Bomb (1)", "White Bomb (2)", "White Bomb (3)"]);
var explosion = newImagesArray(["Explosion1", "Explosion2", "Explosion3", "Explosion4"]);
var explosionBig = [];
for (var i = 0 ; i < 8 ; i ++) {
	explosionBig[i] = newImage("Explosion Big (" + (8 - i) + ")");
}
var arcs = [];
for (var i = 0 ; i < 8 ; i ++) {
	arcs[i] = newImage("Lightning (" + (i + 1) + ")");
}
purple.debris = newImagesArray(["Purple Debris-1", "Purple Debris-2", "Purple Debris-3", "Purple Debris-4"]);
white.debris = newImagesArray(["White Debris-1", "White Debris-2", "White Debris-3", "White Debris-4", "White Debris-5"]);