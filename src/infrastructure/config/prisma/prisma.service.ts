import { Injectable } from '@nestjs/common';
import { PrismaServiceBase } from '../../../domain/config/prisma.base';

@Injectable()
export class PrismaService extends PrismaServiceBase {}
