import { Test, TestingModule } from '@nestjs/testing';
import { OrderTypeController } from './order-type.controller';
import { OrderTypeService } from './order-type.service';

describe('OrderTypeController', () => {
  let controller: OrderTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderTypeController],
      providers: [OrderTypeService],
    }).compile();

    controller = module.get<OrderTypeController>(OrderTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
