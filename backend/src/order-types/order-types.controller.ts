import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { OrderTypesService } from './order-types.service';
import { CreateOrderTypeDto, UpdateOrderTypeDto } from './dto';
import { OrderTypeEntity } from './entities/order-type.entity';

@Controller('order-types')
@ApiTags('order-types')
@ApiBearerAuth()
export class OrderTypesController {
  constructor(private readonly orderTypeService: OrderTypesService) { }

  @Post()
  @ApiCreatedResponse({ type: OrderTypeEntity })
  create(@Body() createOrderTypeDto: CreateOrderTypeDto) {
    return this.orderTypeService.create(createOrderTypeDto);
  }

  @Get()
  @ApiOkResponse({ type: OrderTypeEntity, isArray: true })
  findAll() {
    return this.orderTypeService.findMany();
  }

  @Get(':id')
  @ApiOkResponse({ type: OrderTypeEntity })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderTypeService.findUnique({ id });
  }

  @Patch(':id')
  @ApiOkResponse({ type: OrderTypeEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderTypeDto: UpdateOrderTypeDto,
  ) {
    return this.orderTypeService.update({
      where: { id },
      data: updateOrderTypeDto,
    });
  }

  @Delete(':id')
  @ApiOkResponse({ type: OrderTypeEntity })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.orderTypeService.delete({ id });
  }
}
