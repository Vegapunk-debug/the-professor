const pdf = require('pdf-parse');
console.log('PDFParse type:', typeof pdf.PDFParse);
if (typeof pdf.PDFParse === 'function') {
    try {
        const instance = new pdf.PDFParse();
        console.log('PDFParse instance methods:', Object.keys(Object.getPrototypeOf(instance)));
    } catch (e) {
        console.log('Error creating instance:', e.message);
    }
}
