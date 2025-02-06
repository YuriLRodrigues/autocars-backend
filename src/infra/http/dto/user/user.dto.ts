import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { IsArray, IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class UserDto {
  @ApiProperty({
    example: 'John Doe',
    description: "The user's full name",
    type: String,
  })
  @IsString({
    message: 'This field must be a string',
  })
  @IsNotEmpty({
    message: 'The name field is required',
  })
  name: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'The username',
    type: String,
  })
  @IsString({
    message: 'This field must be a string',
  })
  @IsNotEmpty({
    message: 'The username field is required',
  })
  username: string;

  @ApiProperty({
    example: 'https://avatar-test.googleapis.com/',
    description: 'The user avatar',
    type: String,
  })
  @IsString({
    message: 'This field must be a string',
  })
  @IsNotEmpty({
    message: 'The avatar field is required',
  })
  avatar: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The user email',
    type: String,
  })
  @IsEmail(
    {},
    {
      message: 'The email field is not valid',
    },
  )
  @IsNotEmpty({
    message: 'The email field is required',
  })
  email: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'The user password',
    type: String,
  })
  @IsStrongPassword({
    minLength: 6,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  @IsNotEmpty({
    message: 'The password field is required',
  })
  password: string;

  @ApiProperty({
    example: [UserRoles.Seller, UserRoles.Manager],
    description: "The user's roles",
    type: [String],
  })
  @IsEnum(UserRoles, { each: true, message: 'Each role must be a valid UserRole' })
  @IsArray({
    message: 'Roles must be an array of UserRole',
  })
  @IsNotEmpty({
    message: 'The roles field is required',
  })
  roles: UserRoles[];

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'The date when the user was disabled',
    type: Date,
  })
  @IsOptional()
  @IsDate({ message: 'The disabled field must be a valid date' })
  disabled?: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'The date when the user was created',
    type: Date,
  })
  @IsDate({ message: 'The createdAt field must be a valid date' })
  @IsNotEmpty({ message: 'The createdAt field is required' })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'The date when the user was last updated',
    type: Date,
  })
  @IsOptional()
  @IsDate({ message: 'The updatedAt field must be a valid date' })
  updatedAt?: Date;
}
