window.AudioContext = window.AudioContext || window.webkitAudioContext; // prefixed naming used in Safary 8-9

// workaround for enabling audio in Safari
var finalAudioContext=null;
function fixAudioContext(e){if(finalAudioContext==null){finalAudioContext=new AudioContext();finalAudioContext.resume()}}
document.addEventListener("click",fixAudioContext);
document.addEventListener("touchstart",fixAudioContext);
document.addEventListener("touchend",fixAudioContext);

function DynamicAudio(args) {
    if (this instanceof arguments.callee) {
        if (typeof this.init === "function") {
            this.init.apply(this, (args && args.callee) ? args : arguments);
        }
    }
    else {
        return new arguments.callee(arguments);
    }
}

DynamicAudio.VERSION = "<%= version %>";
DynamicAudio.nextId = 1;

DynamicAudio.prototype = {
    nextId: null,
    audioContext: null,

    init: function(opts) {
        var self = this;
        self.id = DynamicAudio.nextId++;
    },

    write: function(samples) {
        if (this.audioContext !== null) {
            this.webAudioWrite(samples);
        }
    },

    writeInt: function(samples) {
        if (finalAudioContext !== null) {
        this.audioContext = finalAudioContext;
        this.webAudioWrite(samples, this.intToFloatSample);
        }
    },

    /**
     * Convert from interleaved buffer format to planar buffer
     * by writing right into appropriate channel buffers
     *
     * @param {Number[]} samples
     * @param {Function} converter - optional samples conversion function
     */
    webAudioWrite: function(samples, converter) {
        // Create output buffer (planar buffer format)
        var buffer = this.audioContext.createBuffer(2, samples.length, this.audioContext.sampleRate);
        var channelLeft = buffer.getChannelData(0);
        var channelRight = buffer.getChannelData(1);
        var j = 0;
        if (converter) { // for performance reasons we avoid conditions inside the for() cycle
            for (var i = 0; i < samples.length; i += 2) {
                channelLeft[j] = converter(samples[i]);
                channelRight[j] = converter(samples[i+1]);
                j++;
            }
        } else {
            for (var i = 0; i < samples.length; i += 2) {
                channelLeft[j] = samples[i];
                channelRight[j] = samples[i+1];
                j++;
            }
        }
        // Create sound source and play samples from buffer
        var source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination); // Output to sound card
        source.start();
    },

    /**
     * helper function to convert Int output to Float
     * to return AudioBuffer/Float32Array output used in HTML5 WebAudio API
     *
     * @param {Number} value
     * @returns {number}
     */
    intToFloatSample: function(value) {
        return value / 32768; // from -32767..32768 to -1..1 range
    },

};