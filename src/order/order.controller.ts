import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtGuard } from '../auth/guards/jwt.guard';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { OrderEntity } from './entities/order.entity';
import { ApiOkResponsePaginated, PaginatedResult } from '../prisma/paginator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserEntity } from '../auth/entities/user.entity';
import { PaymentCallbackParamsDto } from './dto/payment-callback-params.dto';
import { OrderPaymentRequiredDto } from './dto/order-payment-required.dto';

@Controller('order')
@ApiTags('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Create a new order',
  })
  @ApiCreatedResponse({ type: OrderPaymentRequiredDto })
  create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: UserEntity,
  ): Promise<OrderPaymentRequiredDto> {
    return this.orderService.create(createOrderDto, user);
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Retrieve all orders with pagination results',
  })
  @ApiOkResponsePaginated(OrderEntity)
  findAll(): Promise<PaginatedResult<OrderEntity>> {
    return this.orderService.findAll();
  }

  @Get('payment/callback')
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Verify payment after having paid on Stripe',
  })
  @ApiQuery({
    name: 'sessionId',
    description: "Stripe checkout session's id",
    required: true,
  })
  @ApiOkResponse({ type: OrderEntity })
  paymentCallback(
    @Query() paymentCallbackParams: PaymentCallbackParamsDto,
    @CurrentUser() user: UserEntity,
  ): Promise<string> {
    return this.orderService.verify(paymentCallbackParams.sessionId, user);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Retrieve an order by its id',
  })
  @ApiParam({
    name: 'id',
    description: "Order's ID",
    required: true,
  })
  @ApiOkResponse({ type: OrderEntity })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserEntity,
  ): Promise<OrderEntity> {
    return this.orderService.findOne(id, user);
  }
}
