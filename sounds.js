function Sound(src) {
	return new Howl({src: ['../Sounds/' + src]});
}
function SoundArray(ar) {
	var temp = [];
	for (var i = 0 ; i < ar.length ; i ++) {
		temp[i] = Sound(ar[i]);
	}
	return temp;
}
var Hurt = SoundArray(["Hurt1.wav", "Hurt2.wav"]);
var Explosion = SoundArray(["Explosion1.wav", "Explosion2.wav", "Explosion3.wav", "Explosion4.wav"]);
var Laser = SoundArray(["Laser1.wav", "Laser2.wav", "Laser3.wav"]);
var Warpin = SoundArray(["Warpin1.wav", "Warpin2.wav", "Warpin3.wav"]);