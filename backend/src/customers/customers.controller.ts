import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { GetCurrentUserId, Roles } from '../common/decorators';
import { Role } from '../common';

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
  findAll() {
    return this.customersService.findMany();
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
