export abstract class HashGenerator {
  abstract hash(plain: string): Promise<string>;
  abstract compare(plain: string, hashed: string): Promise<boolean>;
}
