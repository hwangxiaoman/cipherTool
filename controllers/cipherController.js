const md5 = require('md5');

function encrypt(text, shift) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        let char = text.charAt(i);
        // Check if character is a letter
        if (/[a-zA-Z]/.test(char)) {
            let code = text.charCodeAt(i);
            // Uppercase letters
            if (code >= 65 && code <= 90) {
                char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
            }
            // Lowercase letters
            else if (code >= 97 && code <= 122) {
                char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
            }
        }
        // Check if character is a number or special character
        else if (/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(char)) {
            let code = text.charCodeAt(i);
            char = String.fromCharCode((code + shift) % 128);
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


