var canvas = document.getElementById("engineDISP");
var ctx = canvas.getContext("2d");
var t0 = null;
var t1 = null;
var ttr = false;
var objectsCount = -1;
var objects = {};
var mouseSpawnsObj = false;
var gravity = 0.3;
function onload(){
	objects[Object.keys(objects).length] = new gameObjectRect(10, 10, 50, 50, "Test OBJ", "#3498db");
    objects[0].cancontrol = true;
}
function drawLine(x1,y1,x2,y2, color = "#000"){
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
}
function dispTTR(){
    ttr = !ttr;
}
function MSPO(){
	mouseSpawnsObj = document.querySelector(".mspochk").checked;
}
canvas.addEventListener("click", function(e){
    var temp = getMousePos(e, canvas);
    console.log("Mouse Pos: X " + temp.x + " Y " + temp.y);
    var mousetempOBJ = new gameObjectRect(temp.x, temp.y, 1, 1, "Mouse", "Black");
    mousetempOBJ.show = false;
    var check = checkColision(mousetempOBJ);
    if(check != false){
    	mousetempOBJ = null;
    	var selectID = -1;
    	for(var i = 0; i < Object.keys(objects).length; i++){
    		if(check == objects[i]){
    			selectID = i;
    			break;
    		}
    	}
    	document.getElementById("objects").selectedIndex = selectID + 1;
    	updateAvalibleActions();
    }
    else {
    	if(mouseSpawnsObj){
    		objects[Object.keys(objects).length] = new gameObjectRect(temp.x, temp.y, 10, 10, "Mspawn " + Object.keys(objects).length, "#e67e22");
    	}
    	document.getElementById("objects").selectedIndex = 0;
    	updateAvalibleActions();
    }
});
canvas.addEventListener("mouseover", function(e){
    var temp = getMousePos(e, canvas);
    console.log(temp);
});
getMousePos = function(evt, canvas){
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
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
    this.debugAxisLines = false;
    this.physicsIteration = function() {
        if(this.frozen != true){
            this.xv *= this.friction;
            this.yv *= this.friction;
            this.x += this.xv;
            this.y += this.yv;
            //this.yv += gravity;
        }
        if(this.x + this.width >= canvas.width){
            this.xv = 0;
            var distout = this.x + this.width - canvas.width;
            this.x -= distout;
        }
        if(this.y + this.height >= canvas.height){
            this.yv = 0;
            var distout = this.y + this.height - canvas.height;
            this.y -= distout;
        }
        if(this.x <= 0){
            this.xv = 0;
            var distout = 0 - this.x;
            this.x += distout;
        }
        if(this.y <= 0){
            this.yv = 0;
            var distout = 0 - this.y;
            this.y += distout;
        }
    }
    this.draw = function(){
        ctx = canvas.getContext("2d");
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if(this.debugAxisLines){
            drawLine(10,this.y, 10, this.y + this.height, this.color);
            drawLine(this.x, 389, this.x + width, 389, this.color);
            drawLine(this.x, 10, this.x + width, 10, this.color);
            drawLine(490, this.y, 490, this.y + this.height, this.color);
        }
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
    	if(objects[i] != null){
    		if(objects[i].cancontrol){
            control(objects[i]);
	        }
	        objects[i].physicsIteration();
	        objects[i].draw();
	        tempObjCount = i;
    	}
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
    	if(objects[i] == null){
    		continue;
    	}
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
        if(objects[i] != null){
        	if(objects[i].name != "undefined"){
            document.getElementById("objects").innerHTML += "<option value='" + i +"'>" + objects[i].name + " (" + i + ")</option>";
	        } else {
	            document.getElementById("objects").innerHTML += "<option value='" + i +"'>" + "Object ID: " + i + "</option>";
	        }
        }
    }
}
// function applyvelocity(x = document.getElementById("applyxv").value,
//                          y = document.getElementById("applyyv").value,
//                           object = document.getElementById("objects").value){
//     if(x != "" && y != "" && object != -1){
//         console.log("Launching Object: " + object + " in X: " + x + " and Y: " + y);
//         objects[object].xv += x;
//         objects[object].yv += y;
//     }
// }
function updateCancontrol(id = document.getElementById("objects").value){
	objects[id].cancontrol = document.querySelector(".ccchk").checked;
}
function destroy(id = document.getElementById("objects").value){
	objects[id] = null;
	updateObjectsBox(Object.keys(objects).length);
}
function updateDBAXIS(object = document.getElementById("objects").value){
    objects[object].debugAxisLines = document.querySelector(".dbais").checked;
}
function updateAvalibleActions(){
    if(document.getElementById("objects").value != -1){
        document.getElementById("modify").innerHTML = `
        <button onclick="destroy()">DELETE</button>
        <input type="checkbox" id="cancon" class="ccchk" onchange="updateCancontrol()">Can Control <br>
        <input type="checkbox" id="debugAxisLines" class="dbais" onchange="updateDBAXIS()"> Debug Axis Lines
        `;
        // Apply Velocity: <br>X: <input type="number" id="applyxv"><br>
        // Y: <input type="number" id="applyyv">
        // <button onclick="applyvelocity()">Apply</button>
        document.getElementById("cancon").checked = objects[document.getElementById("objects").value].cancontrol;
        document.getElementById("debugAxisLines").checked = objects[document.getElementById("objects").value].debugAxisLines;
    } else {
        document.getElementById("modify").innerHTML = "";
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
onload();