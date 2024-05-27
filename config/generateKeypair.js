const fs = require('fs');
const { generateKeyPair } = require('crypto');

generateKeyPair(
    'rsa',
    {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    },
    (err, publicKey, privateKey) => {
        if (err) {
            console.error(err);
            return;
        }

        fs.writeFileSync('id_rsa_pub.pem', publicKey);
        fs.writeFileSync('id_rsa_pri.pem', privateKey);
    }
);
