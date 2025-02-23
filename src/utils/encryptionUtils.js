// Encrypts a message using RSA-OAEP encryption
export async function encryptMessage(message, publicKeyPem) {
    const publicKey = await importPublicKey(publicKeyPem); // RSA-OAEP for encryption
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(message);

    const encryptedMessage = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },  // Using RSA-OAEP for encryption
        publicKey,
        encodedMessage
    );

    return encryptedMessage;
}

// Decrypts a message using RSA-OAEP decryption
export async function decryptMessage(encryptedMessage, privateKeyPem) {
    const privateKey = await importPrivateKey(privateKeyPem); // RSA-OAEP for decryption

    const decryptedMessage = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },  // Using RSA-OAEP for decryption
        privateKey,
        encryptedMessage
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedMessage);
}

// Signs a message using RSA-PSS signing
export async function signMessage(message, privateKeyPem) {
    const privateKey = await importPrivateKeyForSigning(privateKeyPem); // RSA-PSS for signing
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(message);

    const signature = await window.crypto.subtle.sign(
        { name: "RSA-PSS", saltLength: 32 },  // Using RSA-PSS for signing
        privateKey,
        encodedMessage
    );

    return signature;
}

// Verifies the signature of a message using RSA-PSS verification
export async function verifyMessageSignature(message, signature, publicKeyPem) {
    const publicKey = await importPublicKeyForVerification(publicKeyPem); // RSA-PSS for verification
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(message);

    // Eğer signature base64 formatındaysa, ArrayBuffer'a dönüştür
    const signatureArrayBuffer = signature instanceof ArrayBuffer ? signature : base64ToArrayBuffer(signature);

    const isValid = await window.crypto.subtle.verify(
        { name: "RSA-PSS", saltLength: 32 },  // Using RSA-PSS for verification
        publicKey,
        signatureArrayBuffer,
        encodedMessage
    );

    return isValid;
}

// Imports a private key for decryption (RSA-OAEP)
async function importPrivateKey(pem) {
    const binaryDer = pemToArrayBuffer(pem);
    return await window.crypto.subtle.importKey(
        "pkcs8",
        binaryDer,
        { name: "RSA-OAEP", hash: "SHA-256" }, // RSA-OAEP for decryption
        true,
        ["decrypt"]  // Private key used for decryption
    );
}

// Imports a public key for encryption (RSA-OAEP)
async function importPublicKey(pem) {
    const binaryDer = pemToArrayBuffer(pem);
    return await window.crypto.subtle.importKey(
        "spki",
        binaryDer,
        { name: "RSA-OAEP", hash: "SHA-256" },  // RSA-OAEP for encryption
        true,
        ["encrypt"]  // Public key used for encryption
    );
}

// Imports a private key for signing (RSA-PSS)
async function importPrivateKeyForSigning(pem) {
    const binaryDer = pemToArrayBuffer(pem);
    return await window.crypto.subtle.importKey(
        "pkcs8",
        binaryDer,
        { name: "RSA-PSS", hash: "SHA-256" }, // RSA-PSS for signing
        true,
        ["sign"]  // Private key used for signing
    );
}

// Imports a public key for signature verification (RSA-PSS)
async function importPublicKeyForVerification(pem) {
    const binaryDer = pemToArrayBuffer(pem);
    return await window.crypto.subtle.importKey(
        "spki",
        binaryDer,
        { name: "RSA-PSS", hash: "SHA-256" },  // RSA-PSS for signature verification
        true,
        ["verify"]  // Public key used for verifying signatures
    );
}

// Converts PEM format keys to ArrayBuffer
function pemToArrayBuffer(pem) {
    const base64String = pem.replace(/-----BEGIN .* KEY-----|-----END .* KEY-----|\n/g, '');
    const binaryString = atob(base64String);
    const binaryArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        binaryArray[i] = binaryString.charCodeAt(i);
    }
    return binaryArray.buffer;
}

// ArrayBuffer'ı Base64 formatına dönüştüren yardımcı fonksiyon
export function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);  // ArrayBuffer'ı Uint8Array'e dönüştür
    const length = bytes.byteLength;
    for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i]);  // Uint8Array'deki her byte'ı bir karaktere dönüştür
    }
    return window.btoa(binary);  // Binary string'i Base64'e dönüştür
}


// Base64'ü ArrayBuffer'a dönüştürme fonksiyonu
export function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);  // Base64 string'ini decode ediyoruz
    const length = binaryString.length;
    const arrayBuffer = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        arrayBuffer[i] = binaryString.charCodeAt(i);  // Her karakteri byte'a dönüştür
    }
    return arrayBuffer.buffer;  // ArrayBuffer'ı döndür
}

