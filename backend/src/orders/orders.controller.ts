import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrderEntity } from './entities/order.entity';

@Controller('orders')
@ApiTags('orders')
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiCreatedResponse({ type: OrderEntity })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOkResponse({ type: OrderEntity, isArray: true })
  findAll() {
    return this.ordersService.findMany();
  }

  @Get(':id')
  findUnique(@Param('id') id: string) {
    return this.ordersService.findUnique({ id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update({ where: { id }, data: updateOrderDto });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.ordersService.delete({ id });
  }
}
