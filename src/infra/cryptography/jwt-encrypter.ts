import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Encrypter } from '@root/domain/application/cryptography/encrypter';

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private readonly jwtService: JwtService) {}

  encrypt(payload: Record<string, string>): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn: '7d' });
  }
}
