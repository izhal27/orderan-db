import { Test, TestingModule } from '@nestjs/testing';
import { OrderTypesController } from './order-types.controller';
import { OrderTypesService } from './order-types.service';

describe('OrderTypeController', () => {
  let controller: OrderTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderTypesController],
      providers: [OrderTypesService],
    }).compile();

    controller = module.get<OrderTypesController>(OrderTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
