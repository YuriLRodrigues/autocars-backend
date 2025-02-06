import { Module } from '@nestjs/common';
import { CryptographyModule } from '@root/infra/cryptography/cryptography.module';
import { DatabaseModule } from '@root/infra/database/database.module';
import { EnvModule } from '@root/infra/env/env.module';
import { MailModule } from '@root/infra/mailer/mail.module';

import { AuthorizationUserUseCase } from './authorization-user.use-case';
import { DeleteOwnUserUseCase } from './delete-own-user.use-case';
import { DeleteUserUseCase } from './delete-user.use-case';
import { FindAllTopSellersUseCase } from './find-all-top-sellers.use-case';
import { FindAllUsersUseCase } from './find-all-users.use-case';
import { ForgotPasswordUseCase } from './forgot-password.use-case';
import { HandleActiveUserUseCase } from './handle-active-user.use-case';
import { MeUseCase } from './me.use-case';
import { NewPasswordUseCase } from './new-password.use-case';
import { RegisterUserUseCase } from './register-user.use-case';
import { UpdateOwnUserUseCase } from './update-own-user.use-case';

@Module({
  imports: [DatabaseModule, CryptographyModule, EnvModule, MailModule],
  providers: [
    AuthorizationUserUseCase,
    HandleActiveUserUseCase,
    DeleteOwnUserUseCase,
    DeleteUserUseCase,
    FindAllTopSellersUseCase,
    FindAllUsersUseCase,
    ForgotPasswordUseCase,
    NewPasswordUseCase,
    RegisterUserUseCase,
    UpdateOwnUserUseCase,
    MeUseCase,
  ],
  exports: [
    AuthorizationUserUseCase,
    HandleActiveUserUseCase,
    DeleteOwnUserUseCase,
    DeleteUserUseCase,
    FindAllTopSellersUseCase,
    FindAllUsersUseCase,
    ForgotPasswordUseCase,
    NewPasswordUseCase,
    RegisterUserUseCase,
    UpdateOwnUserUseCase,
    MeUseCase,
  ],
})
export class UserUseCasesModule {}
