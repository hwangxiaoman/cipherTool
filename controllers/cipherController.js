const md5 = require('md5');
const fs = require('fs');

function encrypt(text, key) {
    let result = '';
    const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const alphabetLength = alphabet.length;

    for (let i = 0; i < text.length; i++) {
        let char = text.charAt(i);

        // Check if character is a letter
        if (/[a-zA-Z]/.test(char)) {
            const isUppercase = char === char.toUpperCase();
            char = char.toLowerCase();
            const code = alphabet.indexOf(char);
            const shiftedCode = (code + parseInt(key)) % alphabetLength;
            char = alphabet[shiftedCode];

            if (isUppercase) {
                char = char.toUpperCase();
            }
        }
        // Check if character is a number
        else if (/[0-9]/.test(char)) {
            const code = alphabet.indexOf(char);
            const shiftedCode = (code + parseInt(key)) % alphabetLength;
            char = alphabet[shiftedCode];
        }

        result += char;
    }

    return result;
}

function decrypt(text, key) {
    let result = '';
    const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const alphabetLength = alphabet.length;

    for (let i = 0; i < text.length; i++) {
        let char = text.charAt(i);

        // Check if character is a letter
        if (/[a-zA-Z]/.test(char)) {
            const isUppercase = char === char.toUpperCase();
            char = char.toLowerCase();
            const code = alphabet.indexOf(char);
            const shiftedCode = (code - parseInt(key) + alphabetLength) % alphabetLength;
            char = alphabet[shiftedCode];

            if (isUppercase) {
                char = char.toUpperCase();
            }
        }
        // Check if character is a number
        else if (/[0-9]/.test(char)) {
            const code = alphabet.indexOf(char);
            const shiftedCode = (code - parseInt(key) + alphabetLength) % alphabetLength;
            char = alphabet[shiftedCode];
        }

        result += char;
    }

    return result;
}
/* start here */

function encryptDecryptFile(inputFile, key, cipherOption) {
    const outputFile = './uploads/CaesarCipherFile.txt';
    const chunkSize = 1024 * 1024; // Chunk size in bytes (1MB)
    const readStream = fs.createReadStream(inputFile, { highWaterMark: chunkSize });
    const writeStream = fs.createWriteStream(outputFile);

    readStream.on('data', (chunk) => {
        // Convert the chunk to a string
        const text = chunk.toString();

        // Perform encryption or decryption on the chunk
        let processedText;
        if (cipherOption === 'Encrypt') {
            processedText = encrypt(text, key);
        } else if (cipherOption === 'Decrypt') {
            processedText = decrypt(text, key);
        } else {
            throw new Error('Invalid cipherOption value');
        }

        // Write the processed chunk to the output file
        writeStream.write(processedText);
    });

    readStream.on('end', () => {
        // Close the write stream once all chunks have been processed
        writeStream.end();
    });

    writeStream.on('finish', () => {
        console.log('File encryption/decryption completed.');
    });

    writeStream.on('error', (error) => {
        console.error('Error writing to output file:', error);
    });
}




/* end here */





exports.getCipher = (req, res) => {
    res.render('cipher', {
        textMe: null,
        origText: null,
        keyNum: null,
        hashedVal: null
    });
};

exports.doCipher = (req, res) => {
    const { encryptThis, key, cipherOption } = req.body;

    if (encryptThis.endsWith('.txt')) {
        //fileTxtHandler(encryptThis, key, cipherOption);
        encryptDecryptFile(encryptThis, key, cipherOption);

        res.render('cipher', {
            textMe: 'CaesarCipheredFile.txt was created!',
            origText: encryptThis,
            keyNum: key,
            hashedVal: 'none',
        });
    } else {
        let processedText;
        if (cipherOption === 'Encrypt') {
            processedText = encrypt(encryptThis, key);
        } else if (cipherOption === 'Decrypt') {
            processedText = decrypt(encryptThis, key);
        } else {
            // Handle invalid cipherOption value
            throw new Error('Invalid cipherOption value');
        }

        const hashedText = md5(encryptThis);

        res.render('cipher', {
            textMe: processedText,
            origText: encryptThis,
            keyNum: key,
            hashedVal: hashedText
        });
    }
};
