var canvas = document.getElementById("engineDISP");
var ctx = canvas.getContext("2d");
var objects = {};
function gameObjectRect(x, y, width, height, name = "undefined", color = "#000", xv = 0, yv = 0, show = true){
    this.x = x;
    this.y = y;
    this.xv = xv;
    this.yv = yv;
    this.width = width;
    this.height = height;
    this.show = show;
    this.color = color;
    this.name = name;
    this.terminalv = 2;
    this.speedinc = 0.3;
    this.drag = 0.90;
    this.friction = 0.95;
    this.cancontrol = false;
    this.physicsIteration = function() {
        this.xv *= this.friction;
        this.yv *= this.friction;
        this.x += this.xv;
        this.y += this.yv;
    }
    this.draw = function(){
        ctx = canvas.getContext("2d");
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
function init(){
    objects[Object.keys(objects).length] = new gameObjectRect(10 , 10, 60, 60, "TEST");
    objects[Object.keys(objects).length] = new gameObjectRect(70, 10, 20, 20, "A NAME");
}
setInterval(frame, 20);

function frame(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(var i = 0; i < Object.keys(objects).length; i++){
        if(objects[i].cancontrol){
            control(objects[i]);
        }
        objects[i].physicsIteration();
        objects[i].draw();
    }
}
function control(obj){
    if(obj.xv + obj.yv > obj.terminalv - obj.terminalv * 2){
        if(keymap[87]){
            // w
            obj.yv -= obj.speedinc;
        }
        if(keymap[68]){
            // d
            obj.xv += obj.speedinc;
        }
    }
    
    if(obj.xv + obj.yv < obj.terminalv){
        if(keymap[83]){
            // s
            obj.yv += obj.speedinc;
        }
        if(keymap[65]){
            // a
            obj.xv -= obj.speedinc;
        }
    }
    
}

function checkColision(obj1, obj2){
    if(obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y){
            return true;
        }
    return false;
}

function setGlobalFriction(friction = 0.95){
    for(var i = 0; i < Object.keys(objects).length; i++){
        objects[i].friction = friction;
    }
}

var keymap = {};

window.addEventListener("keydown", function(e){
    keymap[e.keyCode] = true;
    //console.log(e.key + " : " + e.keyCode);
});
window.addEventListener("keyup", function(e){
    keymap[e.keyCode] = false;
});