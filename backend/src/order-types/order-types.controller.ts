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

import { OrderTypesService } from './order-types.service';
import { CreateOrderTypeDto } from './dto/create-order-type.dto';
import { UpdateOrderTypeDto } from './dto/update-order-type.dto';

@Controller('order-type')
export class OrderTypesController {
  constructor(private readonly orderTypeService: OrderTypesService) {}

  @Post()
  create(@Body() createOrderTypeDto: CreateOrderTypeDto) {
    return this.orderTypeService.create(createOrderTypeDto);
  }

  @Get()
  findAll() {
    return this.orderTypeService.findMany();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderTypeService.findUnique({ id });
  }

  @Patch(':id')
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
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.orderTypeService.delete({ id });
  }
}
