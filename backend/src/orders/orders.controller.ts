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
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { OrderEntity } from './entities/order.entity';
import { CreateOrderDto, MarkPayDto, MarkPrintedDto, UpdateOrderDto } from './dto';
import { CancelType, OrdersService } from './orders.service';
import { GetCurrentUser, Roles } from '../common/decorators';
import { MarkTakenDto } from './dto/mark-taken.dto';
import { Role } from '../common';

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

  @Get('filter')
  filterOrders(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('orderNumber') orderNumber?: string,
    @Query('customer') customer?: string,
    @Query('user') user?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number) {
    return this.ordersService.filter({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      orderNumber: orderNumber ? orderNumber : undefined,
      customer: customer ? customer : undefined,
      user: user ? user : undefined,
      sortBy,
      sortOrder,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
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
    @GetCurrentUser('role') role: string,
    @GetCurrentUserId() userId: number) {
    return this.ordersService.delete({ id }, role, userId);
  }

  @Post('/detail/:orderDetailId/print')
  @Roles(Role.Admin, Role.Operator)
  @HttpCode(200)
  markPrinted(@Param('orderDetailId') id: string,
    @Body() markPrintedDto: MarkPrintedDto,
    @GetCurrentUserId() userId: number) {
    return this.ordersService.markPrint(id, markPrintedDto, userId);
  }

  @Post('/detail/:orderDetailId/cancel-print')
  @Roles(Role.Admin, Role.Operator)
  @HttpCode(200)
  cancelMarkPrinted(
    @Param('orderDetailId') id: string,
    @GetCurrentUserId() userId: number) {
    return this.ordersService.cancelStatus({ type: CancelType.PRINT, orderDetailId: id, userId });
  }

  @Post('/:id/pay')
  @HttpCode(200)
  markPay(@Param('id') id: string,
    @Body() markPayDto: MarkPayDto,
    @GetCurrentUserId() userId: number) {
    return this.ordersService.markPay(id, markPayDto, userId);
  }

  @Post('/:id/cancel-pay')
  @Roles(Role.Admin, Role.Administrasi)
  @HttpCode(200)
  cancelMarkPay(@Param('id') id: string,
    @GetCurrentUserId() userId: number) {
    return this.ordersService.cancelStatus({ type: CancelType.PAY, orderId: id, userId });
  }

  @Post('/:id/taken')
  @HttpCode(200)
  markTaken(@Param('id') id: string,
    @Body() markTakenDto: MarkTakenDto,
    @GetCurrentUserId() userId: number) {
    return this.ordersService.markTaken(id, markTakenDto, userId);
  }

  @Post('/:id/cancel-taken')
  @Roles(Role.Admin, Role.Administrasi)
  @HttpCode(200)
  cancelMarkTaken(@Param('id') id: string,
    @GetCurrentUserId() userId: number) {
    return this.ordersService.cancelStatus({ type: CancelType.TAKEN, orderId: id, userId });
  }
}
