var canvas = document.getElementById("engineDISP");
var ctx = canvas.getContext("2d");
var t0 = null;
var t1 = null;
var ttr = false;
var objectsCount = -1;
var objects = {};
function dispTTR(){
    ttr = !ttr;
}
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
    this.speedinc = 0.2;
    this.drag = 0.90;
    this.friction = 0.95;
    this.cancontrol = false;
    this.frozen = false;
    this.physicsIteration = function() {
        if(this.frozen != true){
            this.xv *= this.friction;
            this.yv *= this.friction;
            this.x += this.xv;
            this.y += this.yv;
        }
    }
    this.draw = function(){
        ctx = canvas.getContext("2d");
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        var colCheck = checkColision(this);
        if(colCheck != false){
            console.log(this.name + " Colided With " + colCheck.name);
            colCheck.xv = this.xv;
            colCheck.yv = this.yv;
            this.xv = this.xv - this.xv;
            this.yv = this.yv - this.yv;   
        }
    }
}
function init(){
    objects[Object.keys(objects).length] = new gameObjectRect(10 , 10, 60, 60, "TEST");
    objects[0].cancontrol = true;
    objects[Object.keys(objects).length] = new gameObjectRect(120, 10, 30, 30, "Oppsie");
}
setInterval(frame, 30);

function frame(){
    t0 = performance.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var tempObjCount = null;
    for(var i = 0; i < Object.keys(objects).length; i++){
        if(objects[i].cancontrol){
            control(objects[i]);
        }
        objects[i].physicsIteration();
        objects[i].draw();
        tempObjCount = i;
    }
    if(tempObjCount != objectsCount){
        updateObjectsBox(tempObjCount);
    }
    t1 = performance.now();
    if(ttr){
        console.log("Frame took " + (t0 - t1) + " ms to render.");
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
function checkColision(obj1){
    for(var i = 0; i < Object.keys(objects).length; i++){
        obj2 = objects[i];
        if(obj2 === obj1){
            continue;
        }
        if(obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y){
                return obj2;
        }
    }
    return false;
}

function checkColisionOBJ(obj1, obj2){
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
function updateObjectsBox(newObjCount){
    objectsCount = newObjCount;
    document.getElementById("objects").innerHTML = "<option value='-1'>Please Select an Object ...</option>";
    for(var i = 0; i < Object.keys(objects).length; i++){
        console.log("Object Box update");
        if(objects[i].name != "undefined"){
            document.getElementById("objects").innerHTML += "<option value='" + i +"'>" + objects[i].name + " (" + i + ")</option>";
        } else {
            document.getElementById("objects").innerHTML += "<option value='" + i +"'>" + "Object ID: " + i + "</option>";
        }
    }
}
function updateAvalibleActions(){
    if(document.getElementById("objects").value != -1){
        objects[document.getElementById("objects").value].xv += -3;
    } else {
        document.getElementById("optionsDiv").innerHTML = "";
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