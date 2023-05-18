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






function fileTxtHandler(filePath, key, cipherOption) {
    // Read the contents of the text file
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) throw err;

        let processedText;
        if (cipherOption === 'Encrypt') {
            processedText = encrypt(data, key);
        } else if (cipherOption === 'Decrypt') {
            processedText = decrypt(data, key);
        } else {
            // Handle invalid cipherOption value
            throw new Error('Invalid cipherOption value');
        }

        // Create a new file with the processed contents
        const outputFilePath = 'CaesarCipheredFile.txt';
        fs.writeFile(outputFilePath, processedText, 'utf-8', (err) => {
            if (err) throw err;

            console.log('File processed and saved:', outputFilePath);
        });

        const hashedText = md5(processedText);

        // Create a new file with the hashed contents
        const outputHashedFilePath = 'CaesarCipherHashedFile.txt';
        fs.writeFile(outputHashedFilePath, hashedText, 'utf-8', (err) => {
            if (err) throw err;

            console.log('File processed and saved:', outputHashedFilePath);
        });
    });
}


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
        fileTxtHandler(encryptThis, key, cipherOption);

        res.render('cipher', {
            textMe: 'CaesarCipheredFile.txt was created!',
            origText: encryptThis,
            keyNum: key,
            hashedVal: 'CaesarCipherHashedFile.txt was created!'
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
