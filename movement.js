var tileme;
var spawnCnt =0;
var isDead = false;
var majkremImg = loadImg("assets/img/majkrem_small.png");

mobileFullscreen();

class BgElem{
    constructor(width, height){
        this.height = height;
        this.width = width;
        this.x = 0.0;
        this.y = 0.0;
        this.dx = 0.0;
        this.dy = 0.0;
        var canvas = document.getElementById("gamearea");
        var ctx = canvas.getContext('2d');
        this.ctx = ctx;
        this.img = loadImg("assets/img/pavement_test.png");
		
    }

    draw(){
//		this.ctx.fillRect(0,0,this.width, this.height);
		this.pattern = this.ctx.createPattern(this.img, 'repeat');
		this.ctx.fillStyle = this.pattern;
		var canvas = document.getElementById("gamearea");
		this.ctx.fillRect(10,canvas.height-100,canvas.width-20,80);
    }
}

class Actor{
    constructor(name, width, height, x, y){
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
        this.dx = 0.0;
        this.dy = 0.0;
        var canvas = document.getElementById("gamearea");
        var ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.ctx = ctx;
		this.name = name;
		this.noOfFrames = 3;
		this.imgFrames = loadMoveAnim(name, 3);
		this.animFrame = 0;
		this.animFrameDelta = 1;
		this.animFrameDiff = 0;
		this.state='idle';
		this.frameLength = 14;
		this.friction = 0.95;
		
		//this.img = loadImg("../../assets/img/pavement_test.png");
		
    }

	pressed(keyCode){
		var modifier = 1;
		console.log(keyCode);
		if(keyCode == 37){
			modifier=-1;
		} else if(keyCode != 39) {
			return;
		}
		
		var step=modifier*0.7;
		this.dx+=step;
		this.dx=clampMe(this.dx,step,modifier*3);
	}
	
    draw(){
        //var x = (frameCnt/20)%(this.noOfFrames*2);
//console.log(x);
		//var animFrame = roundInt(x);
		//console.log(frameCnt);
	//	console.log(this.animFrame);
		var fdelta = Math.abs(this.dx) > 1.2 ? 2: 1;
		this.animFrameDiff+=fdelta;
		if(this.animFrameDiff >= this.frameLength){
			this.animFrameDiff = 0; 
			this.animFrame+=this.animFrameDelta; 
	//		console.log(this.imgFrames[this.state][this.animFrame].src);
		}
		
		var flip = false;
		if(this.dx <0){ flip = true;}
		drawImage(this.ctx, this.imgFrames[this.state][this.animFrame], this.x, this.y, this.width, this.height, 0, flip, false, true);
		
		this.animFrame == this.noOfFrames-1? this.animFrameDelta = -1 : (this.animFrame == 0 ? this.animFrameDelta =1 : ()=>{});
    }
	
	update(){
        for (var m of bullets)
        {
            if(Math.abs(m.x-this.x)<30 && Math.abs(m.y-this.y)<30)
            {
                isDead = true;
                return;
            }
        }

        if(this.x<10 && this.dx<0|| this.x>=this.canvas.width-20 && this.dx>0)
        {
            return;
        }

		this.x+=this.dx;
		if(this.dx>0.3 || this.dx <-0.3){
			this.state='running';
		} else {this.state='idle';}
		this.dx*=this.friction;
	}
}

var bulletMaxDy = 6;
var bulletMinDy = 2;

class Bullet //majkrem in reality :D
{
    constructor(width, height, x, y){
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
        this.dx = 0.0;
        this.dy = randBetween(bulletMaxDy,bulletMinDy);
        var canvas = document.getElementById("gamearea");
        var ctx = canvas.getContext('2d');
        this.ctx = ctx;
        this.canvas = canvas;
        this.name = name;
        this.friction = 1.01;
        this.img = majkremImg;
    }

    draw(){
        drawImage(this.ctx, this.img, this.x, this.y, this.width, this.height, frameCnt*this.dy/4, false, false, true);
    }

    update(){
        if(this.y>this.canvas.height-100)
        {
            console.log(bullets);
            var index = bullets.indexOf(this);
            if (index > -1) {
              bullets.splice(index, 1);
            }

            return;
        }

        this.y+=this.dy;
        this.dy*=this.friction;
    }


}

var bgmusic, bgmusic2, bgmusicCnt=0;
var isbgmusic_playing = false;
var a;
var actors = [];
var bgs = [];
var bullets = [];
var started = false;
var onLoad = function (){
   b = new BgElem(400,80);
   a = new Actor('guy', 20, 40, 30.0, 400.0);
   c = new Bullet(56, 60, 50.0, 20.0);
   actors.push(a);
   bgs.push(b);
   bullets.push(c);
   tileme = loadImg("assets/img/tileme.png");

   bgmusic=new Audio("assets/sounds/motorik_kit.wav");
   bgmusic.addEventListener('timeupdate', function(){
                 var buffer = .08
                 if(this.currentTime > this.duration - buffer){
                     //this.currentTime = 0
                     bgmusic2.play()
                 }}, false);

   bgmusic2=new Audio("assets/sounds/motorik_kit_song.wav");
   bgmusic2.addEventListener('timeupdate', function(){
                var buffer = .08
                if(this.currentTime > this.duration - buffer){
                    this.currentTime = 0;
                    bgmusicCnt++;
                    if(bgmusicCnt < 5)
                    {
                        this.play();
                    } else {
                        bgmusicCnt = 0;
                        this.pause();
                        bgmusic.play();
                    }
                }}, false);
}

function keydown(key)
{
    if(started==false){
		bgmusic.play();
        started = true;
	}
	a.pressed(key.keyCode);
}
function keyup(key)
{
	
}
window.addEventListener("keydown", keydown, true);
//window.addEventListener("keyup", keyup, true);

if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  onLoad();
} else {
  document.addEventListener("DOMContentLoaded", onLoad);
}

var lastTime = 0;

var fps = 60;
var frametimeMs = 1000 / fps;
var score=0;

function drawscore()
{
    var canvas = document.getElementById("gamearea");
    var ctx = canvas.getContext('2d');

    ctx.font = '48px serif';
    ctx.fillStyle = 'rgb(50,50,50)';
    if(!isDead && started){
    score = frameCnt/10;
    score=roundInt(score);
    }
    ctx.fillText(score, canvas.width-100, 100);

}

function render()
{
    drawscore();
	for (var b of bgs)
	{
		b.draw();
	}
    for (var actor of actors)
    {
        actor.draw();
    }
    if (started)
    {
        for (var b of bullets)
        {
            b.draw();
        }
    }
}

function update(delta)
{
    for (var actor of actors)
    {
        actor.update();
    }
    if (started && !isDead)
    {

        for (var b of bullets)
        {
            b.update();
        }
    }
}

function round(number, decimals)
{
	return (number-Math.floor(number)).toFixed(decimals);
}

function roundInt(number)
{
	return Math.floor(number);
}

function clampMe(number, min, max)
{
	if (max<min)
	{
		min = max + (max=min, 0);
	}
	return number < max ? (number > min ? number : min) : max;
}

function loadingAnimation()
{
	var canvas = document.getElementById("gamearea");
	var ctx = canvas.getContext('2d');
	
	ctx.font = '48px serif';
	ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillText('loading...', canvas.width/2-40, canvas.height/2-24);
	
	let p = frameCnt/100;
	p=round(p,5);
	p=0.5*(Math.sin(p*Math.PI*2)+1); // pulse between 0 and 1

	let alpha = clampMe(EasingFunctions.easeInCubic(p), 0.0, 0.6);

	ctx.fillStyle = `rgba(255,255,255,${alpha})`;   // these are called template strings
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function overlayAnimation()
{
	var canvas = document.getElementById("gamearea");
	var ctx = canvas.getContext('2d');
	
	let p = frameCnt/100;
	p=round(p,5);

	p=0.5*(Math.cos(p*Math.PI)+1); // pulse between 0 and 1

	let alpha = clampMe(EasingFunctions.easeInCubic(p), 0.0, 0.9);

	ctx.fillStyle = `rgba(240,240,240,${alpha})`;   // these are called template strings
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
}

function overlayAnimDeath()
{
    var canvas = document.getElementById("gamearea");
    var ctx = canvas.getContext('2d');

    let p = frameCnt/50;
    p=round(p,5);
   
    p=0.5*(Math.cos(p*Math.PI)+1); // pulse between 0 and 1
   
    let alpha = clampMe(EasingFunctions.easeInCubic(p), 0.0, 0.9);
   
    ctx.fillStyle = `rgba(240,0,0,${alpha})`;   // these are called template strings
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}


function overlays()
{
	var canvas = document.getElementById("gamearea");
	var ctx = canvas.getContext('2d');
	tilepattern = ctx.createPattern(tileme, 'repeat');
	ctx.fillStyle = tilepattern;
	ctx.fillRect(0,0,canvas.width, canvas.height);
}

function randBetween(min,max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var checkSpawn = 50;

function spawnBullets(){
    if(isDead) return;
    if(Number.isInteger(spawnCnt/600))
    {
        bulletMaxDy++;
        bulletMinDy++;
        console.log("bullet min dy " + bulletMinDy + ' max ' +bulletMaxDy);
        if (checkSpawn > 5)
        {
            checkSpawn -=5;
        }
    }
    if(Number.isInteger(spawnCnt/checkSpawn))
    {
        var r = Math.random();
        spawn = r < 0.3 ? false : true;
        if(spawn)
        {
            var canvas = document.getElementById("gamearea");
            var x = randBetween(30, canvas.width-40);
            var b = new Bullet(56, 60, x, 20.0);
            bullets.push(b);
        }
    }
}

var timeofdeath =0;

function gameLoop(currentTime) {
    if(isDead && timeofdeath && (currentTime - timeofdeath) > 600)
    {
        console.log('dead');
        window.removeEventListener("keydown", keydown, true);
        window.stop();
        return;
    }

    delta = currentTime - lastTime;

	clearCanvas();
	if(assetCnt!=0 || frameCnt < 100) 
	{
	//	console.log('still loading');
		loadingAnimation();
		lastTime = currentTime;
		frameCnt++;
		window.requestAnimationFrame(gameLoop);
		return;
	}
	
    render();
    if(isDead)
    {
        timeofdeath = currentTime;
        overlayAnimDeath();
        bgmusic.pause();
        bgmusic2.pause();
        window.requestAnimationFrame(gameLoop);
    }

	update(delta);
	if(frameCnt < 200)
		overlayAnimation();
	overlays();
    spawnBullets();
    lastTime = currentTime;
	frameCnt++;
    spawnCnt++;
    window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);
