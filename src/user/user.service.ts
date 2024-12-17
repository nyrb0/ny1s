import { Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import { AuthDto } from 'src/auth/dto/auth.dto'
// import { CreateUserDto } from './dto/create-user.dto'
// import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from 'src/prisma.service'
import { UserDto } from './dto/user.dto'
import { startOfWeek, startOfYear, subDays } from 'date-fns'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: { id },
			include: {
				tasks: true,
			},
		})
	}

	async getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
		})
	}

	async getProfile(id: string) {
		const profile = await this.getById(id)

		const totalTasks = profile.tasks.length
		const completedTasks = await this.prisma.task.count({
			where: {
				userId: id,
				isCompleted: true,
			},
		})

		const toDaysStart = startOfYear(new Date())

		const weekStart = startOfWeek(subDays(new Date(), 7))

		const toDaysTasks = await this.prisma.task.count({
			where: {
				userId: id,
				createdAt: {
					gte: toDaysStart.toISOString(),
				},
			},
		})

		const weekTasks = await this.prisma.task.count({
			where: {
				userId: id,
				createdAt: {
					gte: weekStart.toISOString(),
				},
			},
		})

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...rest } = profile

		return {
			user: rest,
			statistics: [
				{ label: 'Total', value: totalTasks },
				{ label: 'Completed Tasks', value: completedTasks },
				{ label: 'Today tasks', value: toDaysTasks },
				{ label: 'Week tasks', value: weekTasks },
			],
		}
	}

	async create(dto: AuthDto) {
		const user = {
			email: dto.email,
			name: '',
			password: await hash(dto.password),
		}
		return this.prisma.user.create({
			data: user,
		})
	}

	async update(id: string, dto: UserDto) {
		let data = dto
		if (dto.password) {
			data = { ...dto, password: await hash(dto.password) }
		}

		return this.prisma.user.update({
			where: { id },
			data,
		})
	}
}
