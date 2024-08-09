const request = require('supertest');
const { app, server } = require('../server'); 


describe('Encryption and Decryption', () => {

    afterAll((done) => {
        server.close(done);
    });

    it('should encrypt a message without a password', async () => {
        const response = await request(app)
            .post('/encrypt')
            .send({ message: 'Hello, World!' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('encryptedMessage');
    });

    it('should encrypt and decrypt a message without a password', async () => {
        const encryptResponse = await request(app)
            .post('/encrypt')
            .send({ message: 'Hello, World!' });

        const encryptedMessage = encryptResponse.body.encryptedMessage;

        const decryptResponse = await request(app)
            .get(`/decrypt?msg=${encodeURIComponent(encryptedMessage)}`);

        expect(decryptResponse.status).toBe(200);
        expect(decryptResponse.text).toContain('Hello, World!');
    });

    it('should encrypt and decrypt a message with a password', async () => {
        const encryptResponse = await request(app)
            .post('/encrypt')
            .send({ message: 'Secret Message', password: 'password123' });

        const { encryptedMessage, encryptedPassword } = encryptResponse.body;

        const decryptFormResponse = await request(app)
            .get(`/decrypt?msg=${encodeURIComponent(encryptedMessage)}&pwd=${encodeURIComponent(encryptedPassword)}`);

        expect(decryptFormResponse.status).toBe(200);
        expect(decryptFormResponse.text).toContain('Enter the password to decrypt the message:');

        const decryptMessageResponse = await request(app)
            .post('/decrypt-message')
            .send({
                message: encryptedMessage,
                correctPassword: 'password123',
                userPassword: 'password123',
            });

        expect(decryptMessageResponse.status).toBe(200);
        expect(decryptMessageResponse.text).toContain('Secret Message');
    });

    it('should return an error when the wrong password is provided', async () => {
        const encryptResponse = await request(app)
            .post('/encrypt')
            .send({ message: 'Secret Message', password: 'password123' });

        const { encryptedMessage, encryptedPassword } = encryptResponse.body;

        const decryptMessageResponse = await request(app)
            .post('/decrypt-message')
            .send({
                message: encryptedMessage,
                correctPassword: 'password123',
                userPassword: 'wrongpassword',
            });

        expect(decryptMessageResponse.status).toBe(401);
        expect(decryptMessageResponse.text).toContain('Invalid password.');
    });

    it('should return an error for invalid encrypted message', async () => {
        const response = await request(app)
            .get('/decrypt?msg=invalid-encrypted-message');

        expect(response.status).toBe(400);
        expect(response.text).toContain('Invalid message encryption.');
    });
});
