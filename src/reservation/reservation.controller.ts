import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiOkResponsePaginated, PaginatedResult, PaginateOptions } from '../prisma/paginator';
import { ReservationEntity } from './entities/reservation.entity';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserEntity } from '../auth/entities/user.entity';

@Controller('reservation')
@ApiTags('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Retrieve all reservations with pagination results',
  })
  @ApiOkResponsePaginated(ReservationEntity)
  findAll(
    @Query() pageable: PaginateOptions,
  ): Promise<PaginatedResult<ReservationEntity>> {
    return this.reservationService.findAll(pageable);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Retrieve a reservation by its id',
  })
  @ApiParam({
    name: 'id',
    description: "Reservation's ID",
    required: true,
  })
  @ApiOkResponse({ type: ReservationEntity })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserEntity,
  ): Promise<ReservationEntity> {
    return this.reservationService.findOne(id, user);
  }
}
