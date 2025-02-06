import { Encrypter } from '@root/domain/application/cryptography/encrypter';

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, string | string[]>): Promise<string> {
    return JSON.stringify(payload);
  }
}
