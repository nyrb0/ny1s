import { Injectable } from '@nestjs/common'
// import { CreateUserDto } from './dto/create-user.dto'
// import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from 'src/prisma.service'
import { TimeBlockDto } from './dto/time-block.dto'

@Injectable()
export class TimeBlockService {
	constructor(private prisma: PrismaService) {}
	async getAll(userId: string) {
		return this.prisma.timeBlock.findMany({
			where: {
				userId,
			},
			orderBy: {
				order: 'asc',
			},
		})
	}

	async create(dto: TimeBlockDto, userId: string) {
		return this.prisma.timeBlock.create({
			data: {
				...dto,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		})
	}

	async update(dto: Partial<TimeBlockDto>, taskId: string, userId: string) {
		return this.prisma.task.update({
			where: {
				userId,
				id: taskId,
			},
			data: dto,
		})
	}

	async delete(taskId: string) {
		return this.prisma.task.delete({
			where: {
				id: taskId,
			},
		})
	}
}
