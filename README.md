# Prozel-Physics-Engine
This is a basic WIP physics engine built in javascript.

[Launch Engine](https://jack7076.github.io/Prozel-Physics-Engine/ "Launch Engine")

## Quick Start
Open JS console, then type `init();` and run the command.
Then to control objects look at Controling Objects

## Create Custom Objects (RECT)
Open JS console, then type:
```javascript
objects[Object.keys(objects).length] = new gameObjectRect(xpos, ypos, width, height, [optional Parameters] name, color, xv, yv, show);
```

## Controling Objects
Open JS console, then set your object to `cancontrol = true`.

e.g
```javascript
objects[0].cancontrol = true;
```
