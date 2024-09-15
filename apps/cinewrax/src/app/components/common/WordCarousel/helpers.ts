const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function randomChars(length: number) {
  let chars = "";
  for (let i = 0; i < length; i += 1) {
    chars += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }

  return chars;
}
