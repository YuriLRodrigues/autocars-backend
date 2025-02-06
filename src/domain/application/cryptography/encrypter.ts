export abstract class Encrypter {
  abstract encrypt(payload: Record<string, string | Array<string>>): Promise<string>;
}
