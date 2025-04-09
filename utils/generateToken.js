import crypto from 'crypto';

const generateToken = () => {
    return crypto.randomBytes(32).toString('hex'); // Generates a 64-character token
};

export default generateToken;
