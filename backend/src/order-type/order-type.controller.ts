import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderTypeService } from './order-type.service';
import { CreateOrderTypeDto } from './dto/create-order-type.dto';
import { UpdateOrderTypeDto } from './dto/update-order-type.dto';

@Controller('order-type')
export class OrderTypeController {
  constructor(private readonly orderTypeService: OrderTypeService) {}

  @Post()
  create(@Body() createOrderTypeDto: CreateOrderTypeDto) {
    return this.orderTypeService.create(createOrderTypeDto);
  }

  @Get()
  findAll() {
    return this.orderTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderTypeDto: UpdateOrderTypeDto) {
    return this.orderTypeService.update(+id, updateOrderTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderTypeService.remove(+id);
  }
}
