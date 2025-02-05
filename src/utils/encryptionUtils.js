// Şifreleme fonksiyonu (Secret key ile private key şifreleme)
async function encryptPrivateKey(privateKey, secretKey) {
  const encodedPrivateKey = new TextEncoder().encode(privateKey);
  const encodedSecretKey = new TextEncoder().encode(secretKey);

  const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encodedSecretKey,
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
  );

  const aesKey = await window.crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: encodedSecretKey, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
  );

  const encryptedPrivateKey = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: window.crypto.getRandomValues(new Uint8Array(12)) },
      aesKey,
      encodedPrivateKey
  );

  return encryptedPrivateKey;
}

// Private Key Decrypt (Şifreli private key’i çözme)
async function decryptPrivateKey(encryptedPrivateKey, secretKey) {
  const encodedSecretKey = new TextEncoder().encode(secretKey);
  
  const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encodedSecretKey,
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
  );

  const aesKey = await window.crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: encodedSecretKey, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
  );

  const decryptedPrivateKey = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(12) },
      aesKey,
      encryptedPrivateKey
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedPrivateKey);
}
