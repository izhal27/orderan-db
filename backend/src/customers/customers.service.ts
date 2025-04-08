import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Customer, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { PaginationDto } from 'src/common';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger();

  constructor(private readonly prismaService: PrismaService) { }

  create(data: Prisma.CustomerCreateInput, userId: number): Promise<Customer> {
    const { name, address, contact, email, description } = data;
    try {
      return this.prismaService.customer.upsert({
        where: {
          name: name,
        },
        update: {},
        create: {
          name,
          address,
          contact,
          email,
          description,
          createdById: userId,
        },
        include: {
          CreatedBy: {
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

  new(data: Prisma.CustomerCreateInput, userId: number): Promise<Customer> {
    const { name, address, contact, email, description } = data;
    try {
      return this.prismaService.customer.create({
        data: {
          name,
          address,
          contact,
          email,
          description,
          createdById: userId,
        },
        include: {
          CreatedBy: {
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
          CreatedBy: {
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

  filter(query: string) {
    return this.prismaService.customer.findMany({
      where: {
        name: {
          contains: query,
        }
      },
      take: 10
    })
  }

  async findUnique(where: Prisma.CustomerWhereUniqueInput): Promise<Customer> {
    const article = await this.prismaService.customer.findUnique({
      where,
      include: {
        CreatedBy: {
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
          CreatedBy: {
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

  async paginate(paginationDto: PaginationDto) {
    let { page = 1, limit = 25, search } = paginationDto;
    const skip = (page - 1) * limit;
    const take = limit;

    const where = search
      ? {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive' as const
            }
          },
        ],
      }
      : {};

    let [data, total] = await Promise.all([
      this.prismaService.customer.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
      }),
      this.prismaService.customer.count(),
    ]);

    // jika data pencarian kurang dari limit,
    // set total menjadi total data dan page 1
    if (search && data.length <= limit) {
      total = data.length;
      page = 1;
    }

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
