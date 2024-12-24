import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class TimeBlockDto {
	@IsString()
	name: string

	@IsBoolean()
	@IsOptional()
	color?: boolean

	@IsNumber()
	duration: number

	@IsNumber()
	@IsOptional()
	order: number
}
