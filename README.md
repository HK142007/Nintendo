# Nintendo

Nintendo Emulator in JavaScript.

![alt screenshot](https://raw.githubusercontent.com/lrusso/Nintendo/master/Nintendo.png)

## Web version

https://lrusso.github.io/Nintendo/Nintendo.htm

## Android version

https://lrusso.github.io/Nintendo/Nintendo.apk

## Main differences with JSNES

* Sound button.
* Restart button.
* Audio working in Safari (MacOS and iOS).
* Load and save state working (several bug fixes).
* Mobile compatibility (virtual joystick and buttons).
* Pause and Resume automatically if the window is focused or not.
* It is a Progressive Web App compatible with Android and iOS devices.

## Roadmap

* Remove clipping: The PPU.js file has a ScrollWrite function that implements a 7px clipping.

## Virtual joystick code:

https://github.com/lrusso/VirtualJoystick

## Based on the work of:

https://github.com/bfirsh/jsnes
