const pdf = require('pdf-parse/node');
console.log('pdf type:', typeof pdf);
if (typeof pdf === 'function') {
    console.log('pdf is a function');
} else {
    console.log('pdf keys:', Object.keys(pdf));
}
