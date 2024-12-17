import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@MinLength(6, { message: 'Password must be at least 6 characters long' })
	@IsString()
	password: string

	@IsEmail()
	email: string
}
