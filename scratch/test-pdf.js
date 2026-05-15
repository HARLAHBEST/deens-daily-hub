import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

async function testExtract() {
    const dataBuffer = fs.readFileSync('c:/Users/user/Desktop/deen/nextjs-app/Invoice-4-KW2H4V-4-HPU5Z2.pdf');
    const data = await pdf(dataBuffer);
    console.log('--- TEXT START ---');
    console.log(data.text);
    console.log('--- TEXT END ---');
}

testExtract();
