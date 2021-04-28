var w,h;
w = document.documentElement.clientWidth;
h = document.documentElement.clientHeight;
let textPointArr;
let font;
let points = new Array();

class tPoint {
        constructor(x,y){
                this.pos = createVector(x,y);
                this.vel = createVector(0,0);
                this.acc = createVector(0,0);
                this.force = createVector(0,0);
                this.target = createVector(x,y);
                this.maxspeed = 10;
                this.maxforce = .5;
        }
        update(){
                this.pos.add(this.vel);
                this.vel.add(this.acc);
                this.acc.mult(0);
        }
        show(){
                point(this.pos.x,this.pos.y);
        }
        steer(){
                var arrive = this.arrive(this.target);
                var mouse = createVector(mouseX,mouseY);
                var flee = this.flee(mouse);

                arrive.mult(1);
                flee.mult(5);

                this.applyForce(arrive);
                this.applyForce(flee);

        }
        applyForce(f){
                this.acc.add(f);
        }
        seek(target){
                var desired = p5.Vector.sub(target,this.pos);
                desired.setMag(this.maxspeed);
                var steer = p5.Vector.sub(desired,this.vel);
                return steer;
        }
        flee(target){
                var desired = p5.Vector.sub(target, this.pos);
                var d = desired.mag();
                if (d < 100) {
                        desired.setMag(this.maxspeed);
                        desired.mult(-1);
                        var steer = p5.Vector.sub(desired, this.vel);
                        steer.limit(this.maxforce);
                        return steer;
                } else {
                        return createVector(0, 0);
                }             
        }
        arrive(target){
                var desired = p5.Vector.sub(target, this.pos);
                var d = desired.mag();
                var speed = this.maxspeed;
                if (d < 1000) {
                  speed = map(d, 0, 100, 0, this.maxspeed);
                }
                desired.setMag(speed);
                var steer = p5.Vector.sub(desired, this.vel);
                steer.limit(this.maxforce);
                return steer;
        }
}

function preload() {
  font = loadFont('Inconsolata-Medium.otf');
}

function setup(){
        createCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight);
        background(2);
        textPointArr = font.textToPoints("Taylor Hudson's", width/4, height/2, 100 ,{
                sampleFactor: .5,
                simplifyThreshold: 0
              });
        for (var i = 0; i<textPointArr.length; i++){
                points[i] = new tPoint(textPointArr[i].x,textPointArr[i].y);
        }
        // for (var i = 0; i<textPointArr.length; i++){
        //         // console.log(textPointArr[i].x *bounds.w+ " " + textPointArr[i].y * bounds.h)
        // };
}

function draw(){
        background(2);
        
        for (var i = 0; i<textPointArr.length; i++){
                
                stroke ("White");
                points[i].steer();
                points[i].update();
                points[i].show();
                
                
       };

}