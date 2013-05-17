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
        if (sep) {
            var eol = new RegExp(sep + '$');
        }

        if (self.trail) {
            buf = self.trail + buf;
        }

        var lines = buf.split(sep);
        if (eol && eol.test(buf)) {
            self.trail = lines.pop();
        } else {
            self.trail = null;
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

/// testing
function test() {
    var s = exports.createLineStream('linestream.js'),
        cnt = 0;

    s.on('data', function(line) {
        process.stdout.write(getPlatformLineSep() + '[' + ++cnt + ']:');
    });

    s.pipe(process.stdout);
}
