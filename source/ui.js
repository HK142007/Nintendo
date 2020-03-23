/*
JSNES, based on Jamie Sanders" vNES
Copyright (C) 2010 Ben Firshman

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

JSNES.DummyUI = function(nes)
	{
	this.nes = nes;
	this.enable = function() {};
	this.updateStatus = function() {};
	this.writeAudio = function() {};
	this.writeFrame = function() {};
	};

function JSNESUI()
	{
	var UI = function(nes)
		{
		var self = this;
		self.nes = nes;

		self.screen = $("<canvas class='gui_canvas' width='256' height='240'></canvas>").appendTo("body");

		self.screen.animate({width: "107%",height: "107%"});
		self.canvasContext = self.screen[0].getContext("2d");
		self.canvasImageData = self.canvasContext.getImageData(0, 0, 256, 240);
		self.resetCanvas();

		self.dynamicaudio = new DynamicAudio();

		$(document).bind("keydown", function(evt){self.nes.keyboard.keyDown(evt)});
		$(document).bind("keyup", function(evt){self.nes.keyboard.keyUp(evt)});
		$(document).bind("keypress", function(evt){self.nes.keyboard.keyPress(evt)});
		};

	UI.prototype = {
		resetCanvas: function()
			{
			this.canvasContext.fillStyle = "black";

			// set alpha to opaque
			this.canvasContext.fillRect(0, 0, 256, 240);

			// Set alpha
			for (var i = 3; i < this.canvasImageData.data.length-3; i += 4)
				{
				this.canvasImageData.data[i] = 0xFF;
				}
			},

		screenshot: function() {},
		enable: function() {},
		updateStatus: function(s) {},
		writeAudio: function(samples)
			{
			return this.dynamicaudio.writeInt(samples);
			},
		writeFrame: function(buffer, prevBuffer)
			{
			var imageData = this.canvasImageData.data;
			var pixel, i, j;
			for (i=0; i<256*240; i++)
				{
				pixel = buffer[i];
				if (pixel != prevBuffer[i])
					{
					j = i*4;
					imageData[j] = pixel & 0xFF;
					imageData[j+1] = (pixel >> 8) & 0xFF;
					imageData[j+2] = (pixel >> 16) & 0xFF;
					prevBuffer[i] = pixel;
					}
				}
			this.canvasContext.putImageData(this.canvasImageData, 0, 0);
			}
		};

	return UI;
	}