import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query, UseGuards,
} from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PaginatedResult, PaginateOptions } from '../prisma/paginator';
import { Cinema, Role } from '@prisma/client';
import { Roles } from '../decorators/roles.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('cinema')
@ApiTags('cinema')
export class CinemaController {
  constructor(private readonly cinemaService: CinemaService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Create a new cinema',
  })
  create(@Body() createCinemaDto: CreateCinemaDto): Promise<Cinema> {
    return this.cinemaService.create(createCinemaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all cinemas with pagination results',
  })
  findAll(
    @Query() pageable: PaginateOptions,
  ): Promise<PaginatedResult<Cinema>> {
    return this.cinemaService.findAll(pageable);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a cinema by its id',
  })
  @ApiParam({
    name: 'id',
    description: "Cinema's ID",
    required: true,
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Cinema> {
    return this.cinemaService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Update a cinema by its id',
  })
  @ApiParam({
    name: 'id',
    description: "Cinema's ID",
    required: true,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCinemaDto: UpdateCinemaDto,
  ): Promise<Cinema> {
    return this.cinemaService.update(id, updateCinemaDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Delete a cinema by its id',
  })
  @ApiParam({
    name: 'id',
    description: "Cinema's ID",
    required: true,
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Cinema> {
    return this.cinemaService.remove(id);
  }
}
