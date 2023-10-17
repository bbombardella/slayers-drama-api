import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ScreeningService } from './screening.service';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';
import {
  ApiCreatedResponse, ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { Role, Screening } from '@prisma/client';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { PaginatedResult } from '../prisma/paginator';
import { ScreeningEntity } from './entities/screening.entity';

@Controller('screening')
@ApiTags('screening')
export class ScreeningController {
  constructor(private readonly screeningService: ScreeningService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Create a new screening',
  })
  @ApiCreatedResponse({ type: ScreeningEntity })
  create(
    @Body() createScreeningDto: CreateScreeningDto,
  ): Promise<ScreeningEntity> {
    return this.screeningService.create(createScreeningDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all screenings with pagination results',
  })
  @ApiOkResponse({ type: PaginatedResult<ScreeningEntity> })
  findAll(): Promise<PaginatedResult<ScreeningEntity>> {
    return this.screeningService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a screening by its id',
  })
  @ApiParam({
    name: 'id',
    description: "Screening's ID",
    required: true,
  })
  @ApiOkResponse({ type: ScreeningEntity })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ScreeningEntity> {
    return this.screeningService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Update a screening by its id',
  })
  @ApiParam({
    name: 'id',
    description: "Screening's ID",
    required: true,
  })
  @ApiCreatedResponse({ type: ScreeningEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateScreeningDto: UpdateScreeningDto,
  ): Promise<ScreeningEntity> {
    return this.screeningService.update(id, updateScreeningDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Delete a screening by its id',
  })
  @ApiParam({
    name: 'id',
    description: "Screening's ID",
    required: true,
  })
  @ApiOkResponse({ type: ScreeningEntity })
  remove(@Param('id', ParseIntPipe) id: number): Promise<ScreeningEntity> {
    return this.screeningService.remove(id);
  }
}
