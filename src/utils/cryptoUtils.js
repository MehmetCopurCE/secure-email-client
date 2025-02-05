export async function generateRSAKeys() {
  const keyPair = await window.crypto.subtle.generateKey(
      {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
  );

  const publicKeyPEM = await convertPublicKeyToPEM(keyPair.publicKey);
  const privateKeyPEM = await convertPrivateKeyToPEM(keyPair.privateKey);

  return { publicKeyPEM, privateKeyPEM };
}

export function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function convertPublicKeyToPEM(publicKey) {
  const exported = await window.crypto.subtle.exportKey("spki", publicKey);
  const base64 = arrayBufferToBase64(exported);
  return `-----BEGIN PUBLIC KEY-----\n${base64.match(/.{1,64}/g).join("\n")}\n-----END PUBLIC KEY-----`;
}

export async function convertPrivateKeyToPEM(privateKey) {
  const exported = await window.crypto.subtle.exportKey("pkcs8", privateKey);
  const base64 = arrayBufferToBase64(exported);
  return `-----BEGIN PRIVATE KEY-----\n${base64.match(/.{1,64}/g).join("\n")}\n-----END PRIVATE KEY-----`;
}

export async function storePrivateKey(email, privateKey) {
  if (!email || !privateKey) {
      console.error("Hata: Email veya Private Key boş!");
      return;
  }

  try {
      const enc = new TextEncoder();
      const keyMaterial = await crypto.subtle.digest("SHA-256", enc.encode(email));
      console.log("SHA-256 Anahtar Üretildi:", new Uint8Array(keyMaterial)); // DEBUG

      const encryptionKey = await crypto.subtle.importKey("raw", keyMaterial, { name: "AES-GCM" }, false, ["encrypt"]);
      
      const iv = crypto.getRandomValues(new Uint8Array(12)); // IV oluştur
      console.log("IV:", iv); // DEBUG

      const encryptedData = await crypto.subtle.encrypt(
          { name: "AES-GCM", iv },
          encryptionKey,
          enc.encode(privateKey)
      );
      console.log("Şifrelenmiş Private Key:", new Uint8Array(encryptedData)); // DEBUG

      // localStorage'a JSON formatında kaydet
      localStorage.setItem(email, JSON.stringify({
          iv: Array.from(iv), // Uint8Array -> Array
          encryptedKey: Array.from(new Uint8Array(encryptedData)) // Uint8Array -> Array
      }));

      console.log(`Private key başarıyla kaydedildi: ${email}`);

  } catch (error) {
      console.error("Private key saklama hatası:", error);
  }
}

export async function getPrivateKey(email) {
  if (!email) {
      console.error("Geçersiz email adresi!");
      return null;
  }

  const storedData = localStorage.getItem(email);
  if (!storedData) {
      console.warn(`Private key bulunamadı: ${email}`);
      return null;
  }

  let parsedData;
  try {
      parsedData = JSON.parse(storedData);
  } catch (error) {
      console.error("localStorage'daki veri JSON formatında değil!", error);
      return null;
  }

  const { iv, encryptedKey } = parsedData;
  if (!iv || !encryptedKey) {
      console.error("Şifreli anahtar verisi eksik!");
      return null;
  }

  try {
      const enc = new TextEncoder();
      const keyMaterial = await crypto.subtle.digest("SHA-256", enc.encode(email));
      console.log("SHA-256 Anahtar Çözüldü:", new Uint8Array(keyMaterial)); // DEBUG

      const decryptionKey = await crypto.subtle.importKey(
          "raw",
          keyMaterial,
          { name: "AES-GCM" },
          false,
          ["decrypt"]
      );

      const decryptedData = await crypto.subtle.decrypt(
          { name: "AES-GCM", iv: new Uint8Array(iv) },
          decryptionKey,
          new Uint8Array(encryptedKey)
      );

      const decodedPrivateKey = new TextDecoder().decode(decryptedData);
      console.log("Şifre Çözüldü:", decodedPrivateKey); // DEBUG
      return decodedPrivateKey;
  } catch (error) {
      console.error("Şifre çözme hatası:", error);
      return null;
  }
}
