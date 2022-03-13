import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ENCRYPT_KEY = process.env.ENCRYPT_KEY || "";

export function encrypt(text: string) {
    const iv = randomBytes(16);
    const cipher = createCipheriv("aes-256-cbc", Buffer.from(ENCRYPT_KEY), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string) {
    const textParts = text.split(":");
    const iv = Buffer.from(`${textParts.shift()}`, "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = createDecipheriv(
        "aes-256-cbc",
        Buffer.from(ENCRYPT_KEY),
        iv
    );
    const decrypted = Buffer.concat([
        decipher.update(encryptedText),
        decipher.final(),
    ]);

    return decrypted.toString();
}
