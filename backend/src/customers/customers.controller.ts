import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CustomerEntity } from './entities/customer.entity';
import { CustomersService } from './customers.service';
import { UpdateCustomerDto, CreateCustomerDto } from './dto';
import { GetCurrentUserId, PaginationDto, Role, Roles } from '../common';

@Controller('customers')
@ApiTags('customers')
@ApiBearerAuth()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  @Post()
  @ApiCreatedResponse({ type: CustomerEntity })
  create(
    @Body() createCustomerDto: CreateCustomerDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.customersService.create(createCustomerDto, userId);
  }

  @Get()
  @ApiOkResponse({ type: CustomerEntity, isArray: true })
  async findManyWithPaginate(@Query() paginationDto: PaginationDto) {
    // '/customers?page=1&limit=10: Fetches the first page with 10 customers.'
    return this.customersService.paginate(paginationDto);
  }

  @Get()
  @ApiOkResponse({ type: CustomerEntity, isArray: true })
  findAll() {
    return this.customersService.findMany();
  }

  @Get('filter')
  getSuggestions(@Query('query') query: string) {
    return this.customersService.filter(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: CustomerEntity })
  findOne(@Param('id') id: string) {
    return this.customersService.findUnique({ id });
  }

  @Patch(':id')
  @ApiOkResponse({ type: CustomerEntity })
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Administrasi)
  @ApiOkResponse({ type: CustomerEntity })
  delete(@Param('id') id: string) {
    return this.customersService.delete({ id });
  }
}
