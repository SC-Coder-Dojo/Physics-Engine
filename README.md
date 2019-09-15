# Physics-Engine
This is a basic WIP physics engine built in javascript.

[Launch Engine](https://SC-Coder-Dojo.github.io/Physics-Engine/ "Launch Engine")

## Quick Start
Open JS console, then type `init();` and run the command.
Then to control objects look at Controling Objects

## Create Custom Objects (RECT)
Open JS console, then type:
```javascript
objects[Object.keys(objects).length] = new gameObjectRect(xpos, ypos, width, height, [optional Parameters] name, color, xv, yv, show);
```

## Controling Objects
Either click on the object or select it in the objects select box and then check the can control checkbox. Otherwise you can:
Open JS console, then set your object to `cancontrol = true`.

e.g
```javascript
objects[0].cancontrol = true;
```
Then you can use the `W A S D` keys to control all objects with the `cancontrol` atribute set to `true`

## Accessing Object Parameters
Sometimes you need to inspect object parameters (Velocity, Position, Terminal Velocity); and in some cases you will need to change these values.

To access/change Object Parameters you will need to open the JS console.
Then most objects are stored in the objects array you can access it like so:
```javascript
objects[<YOUR_OBJECT_ID>]
```
When this is run in webkit enviournments you will see all the parameters of the object.

Then to change such parameters you can do the following:
```javascript
objects[<YOUR_OBJECT_ID>].<PARAMETER> = <YOUR_VALUE>
```

## Feature Request
If there are any missing features please open an issue on the [GitHub](https://github.com/SC-Coder-Dojo/Physics-Engine/issues "Submit Issue") page.