# LineStream 
a simple stream filter to seperate text stream into lines


    var stream = require('linestream'),
        s = stream.createLineStream('linestream.js'),
        cnt = 0;

    s.on('data', function(line) {
        process.stdout.write(getPlatformLineSep() + '[' + ++cnt + ']:');
    });

    s.pipe(process.stdout);

## todo

+ support line decoration
+ line filter
+ check if stream is valid
