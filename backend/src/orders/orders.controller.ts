import { GetCurrentUserId } from './../common/decorators/get-current-userId.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { OrderEntity } from './entities/order.entity';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { OrdersService } from './orders.service';
import { GetCurrentUser } from '../common/decorators';
import { ADMIN } from '../types';

@Controller('orders')
@ApiTags('orders')
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @ApiCreatedResponse({ type: OrderEntity })
  create(
    @Body() createOrderDto: CreateOrderDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.ordersService.create(createOrderDto, userId);
  }

  @Get()
  @ApiOkResponse({ type: OrderEntity, isArray: true })
  findAll() {
    return this.ordersService.findMany();
  }

  @Get(':id')
  @ApiOkResponse({ type: OrderEntity })
  findUnique(@Param('id') id: string) {
    return this.ordersService.findUnique({ id });
  }

  @Patch(':id')
  @ApiOkResponse({ type: OrderEntity })
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.ordersService.update(id, updateOrderDto, userId);
  }

  @Delete(':id')
  @ApiOkResponse({ type: OrderEntity })
  delete(@Param('id') id: string,
    @GetCurrentUser('role') role: string) {
    if (role !== ADMIN) {
      throw new ForbiddenException('403 Forbidden');
    }
    return this.ordersService.delete({ id });
  }

  @Post('/detail/:orderDetailId/print')
  @HttpCode(200)
  markPrinted(@Param('orderDetailId') id: string,
    @Body('status') status: boolean,
    @GetCurrentUserId() userId: number) {
    return this.ordersService.markPrint(id, status, userId);
  }

  @Post('/:id/pay')
  @HttpCode(200)
  markPay(@Param('id') id: string,
    @Body('status') status: boolean,
    @GetCurrentUserId() userId: number) {
    return this.ordersService.markPay(id, status, userId);
  }

  @Post('/:id/taken')
  @HttpCode(200)
  markTaken(@Param('id') id: string,
    @Body('status') status: boolean,
    @GetCurrentUserId() userId: number) {
    return this.ordersService.markTaken(id, status, userId);
  }
}
