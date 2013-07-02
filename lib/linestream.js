/**
 * turn stream into lines
 */

var EventEmitter = require('events').EventEmitter,
    Stream = require('stream').Stream,
    fs = require('fs'),
    util = require('util');

//helper
function getPlatformLineSep() {
    return (process.platform === 'win32') ? '\r\n' : '\n';
}

function detectLineSep(text) {
    if (text.indexOf('\r\n') != -1) {
        return '\r\n';
    } else if (text.indexOf('\n') != -1) {
        return '\n';
    } else {
        return getPlatformLineSep();
    }
}

exports.LineStream = LineStream;

/**
 * Line seperated output control
 */
function LineStream(stream, options) {
    'use strict';

    var self = this,
        sep = null;

    this.readable = true;

    stream.on('data', function(buf) {
        buf = buf.toString('utf8');
        sep = sep || detectLineSep(buf);

        if (self.trail) {
            buf = self.trail + buf;
        }

        self.trail = null;
        var lines = buf.split(sep);
        var nl_idx = buf.indexOf('\n');
        if (nl_idx == -1) {
            self.trail = buf;
            return;
        }

        if (nl_idx == buf.length - 1) {
            lines.pop();
        } else {
            self.trail = lines.pop();
        }

        lines.forEach(function(line) {
            self.emit('data', line);
        });

    });

    stream.on('end', function() {
        self.trail && self.emit('data', self.trail);
        self.emit('end');
    });
}

util.inherits(LineStream, EventEmitter);
util.inherits(LineStream, Stream);

exports.createLineStream = function(filename) {
    return new LineStream(
        fs.createReadStream(filename, {encoding: 'utf8', bufferSize: 2048})
    );
};
