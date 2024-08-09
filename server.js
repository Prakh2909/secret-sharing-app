require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(helmet()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(limiter);

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const IV_LENGTH = 16; // For AES


function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

app.post('/encrypt', (req, res) => {
    const { message, password } = req.body;
    const encryptedMessage = encrypt(message);
    const encryptedPassword = password ? encrypt(password) : '';
    res.json({ encryptedMessage, encryptedPassword });
});

app.get('/decrypt', (req, res) => {
    const { msg: encryptedMessage, pwd: encryptedPassword } = req.query;
    let decryptedMessage;
    try {
        decryptedMessage = decrypt(encryptedMessage);
    } catch (e) {
        return res.status(400).send('Invalid message encryption.');
    }

    if (encryptedPassword) {
        const userPassword = decrypt(encryptedPassword);
        res.send(`
            <html>
                <head>
                    <title>Decrypt Message</title>
                </head>
                <body>
                    <h2>Enter the password to decrypt the message:</h2>
                    <form method="POST" action="/decrypt-message">
                        <input type="hidden" name="message" value="${encryptedMessage}">
                        <input type="hidden" name="correctPassword" value="${userPassword}">
                        <input type="password" name="userPassword" placeholder="Enter password" required>
                        <button type="submit">Decrypt</button>
                    </form>
                </body>
            </html>
        `);
    } else {
        res.send(`
            <html>
                <head>
                    <title>Decrypted Message</title>
                </head>
                <body>
                    <h2>Your decrypted message is:</h2>
                    <p>${decryptedMessage}</p>
                </body>
            </html>
        `);
    }
});

app.post('/decrypt-message', (req, res) => {
    const { message: encryptedMessage, correctPassword, userPassword } = req.body;

    if (correctPassword !== userPassword) {
        return res.status(401).send('Invalid password.');
    }

    let decryptedMessage;
    try {
        decryptedMessage = decrypt(encryptedMessage);
    } catch (e) {
        return res.status(400).send('Invalid message encryption.');
    }

    res.send(`
        <html>
            <head>
                <title>Decrypted Message</title>
            </head>
            <body>
                <h2>Your decrypted message is:</h2>
                <p>${decryptedMessage}</p>
            </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = { app, server };