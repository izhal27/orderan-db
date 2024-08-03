import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Customer, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger();

  constructor(private readonly prismaService: PrismaService) { }

  create(data: Prisma.CustomerCreateInput, userId: number): Promise<Customer> {
    const { name, address, contact, email, description } = data;
    try {
      return this.prismaService.customer.upsert({
        where: {
          name: data.name,
        },
        update: {
          name,
          address,
          contact,
          email,
          description,
        },
        create: {
          name,
          address,
          contact,
          email,
          description,
          createdById: userId,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
              password: false,
            },
          }
        }
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  findMany(): Promise<Customer[]> {
    try {
      return this.prismaService.customer.findMany({
        include: {
          createdBy: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
              password: false,
            },
          }
        }
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async findUnique(where: Prisma.CustomerWhereUniqueInput): Promise<Customer> {
    const article = await this.prismaService.customer.findUnique({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            password: false,
          },
        }
      }
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  update(params: {
    where: Prisma.CustomerWhereUniqueInput;
    data: Prisma.CustomerUpdateInput;
  }): Promise<Customer> {
    try {
      const { where, data } = params;
      return this.prismaService.customer.update({
        where,
        data,
        include: {
          createdBy: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
              password: false,
            },
          }
        }
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  delete(where: Prisma.CustomerWhereUniqueInput): Promise<Customer> {
    try {
      return this.prismaService.customer.delete({
        where,
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
