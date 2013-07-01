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
+ support consective files input
```js
    s = stream.createLineStream(file1, file2, ....);
    s.on('data', function(line) {
    });
    s.on('next', function(filename) {
        // beginning next file with a 'data' event right after it
    });
    s.on('end', function() {
    });
```
