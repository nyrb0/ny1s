import { UseGuards } from '@nestjs/common'
import { JwtAuthGuards } from '../guards/jwt.guards'

export const Auth = () => UseGuards(JwtAuthGuards)
