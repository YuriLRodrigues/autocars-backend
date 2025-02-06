import { Module } from '@nestjs/common';
import { Encrypter } from '@root/domain/application/cryptography/encrypter';
import { HashGenerator } from '@root/domain/application/cryptography/hash-generator';

import { Bcrypt } from './bcrypt';
import { JwtEncrypter } from './jwt-encrypter';

@Module({
  providers: [
    {
      provide: HashGenerator,
      useClass: Bcrypt,
    },
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
  ],
  exports: [HashGenerator, Encrypter],
})
export class CryptographyModule {}
