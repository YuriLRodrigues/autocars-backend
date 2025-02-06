import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { EmailBadFormattedError } from '@root/domain/application/errors/email-bad-formatted-error';
import { ForgotPasswordUseCase } from '@root/domain/application/use-cases/user/forgot-password.use-case';
import { Public } from '@root/infra/auth/public';

import { ForgotPasswordBodyDto, SwaggerForgotPasswordDto } from '../../dto/user/forgot-password.dto';

@ApiTags('User - Controller')
@Controller('user')
export class ForgotPasswordController {
  constructor(private forgotPassword: ForgotPasswordUseCase) {}

  @Public()
  @Post('/forgot-password')
  @HttpCode(200)
  @SwaggerForgotPasswordDto()
  async handle(@Body() body: ForgotPasswordBodyDto) {
    const { email } = body;

    const result = await this.forgotPassword.execute({
      email,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case EmailBadFormattedError:
          throw new BadRequestException(error.message, {
            description: error.name,
          });

        case ResourceNotFoundError:
          throw new NotFoundException(error.message, {
            description: error.name,
          });

        default:
          throw new BadRequestException('Bad request', {
            description: 'BadRequestError',
          });
      }
    }

    return {
      message: 'Password recovery sent to your email',
    };
  }
}
