const md5 = require('md5');

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
            const code = char.charCodeAt(0) - 97;
            const shiftedCode = (code + parseInt(key)) % 26;
            char = alphabet[shiftedCode];

            if (isUppercase) {
                char = char.toUpperCase();
            }
        }
        // Check if character is a number
        else if (/[0-9]/.test(char)) {
            const code = alphabet.indexOf(char);
            char = alphabet[(code + parseInt(key)) % alphabetLength];
        }

        result += char;
    }

    return result;
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
    const { encryptThis, key } = req.body;

    const encrypted_text = encrypt(encryptThis, key);
    const hashedText = md5(encryptThis);

    res.render('cipher', { textMe: encrypted_text, origText: encryptThis, keyNum: key, hashedVal: hashedText });
};


