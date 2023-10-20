import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiOkResponsePaginated,
  PaginatedResult,
  PaginateOptions,
} from '../prisma/paginator';
import { Cinema, Role } from '@prisma/client';
import { Roles } from '../decorators/roles.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CinemaDetailsDto } from './dto/cinema-details.dto';
import { SearchDto } from '../dto/search.dto';
import { CinemaEntity } from './entities/cinema.entity';

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
  @ApiCreatedResponse({ type: CinemaEntity })
  create(@Body() createCinemaDto: CreateCinemaDto): Promise<CinemaEntity> {
    return this.cinemaService.create(createCinemaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all cinemas with pagination results',
  })
  @ApiOkResponsePaginated(CinemaEntity)
  findAll(
    @Query() pageable: PaginateOptions,
  ): Promise<PaginatedResult<Cinema>> {
    return this.cinemaService.findAll(pageable);
  }

  @Get('search/:query')
  @ApiOperation({
    summary: 'Search cinema in database. Results with pagination',
  })
  @ApiParam({
    name: 'query',
    description: 'The search pattern',
    required: true,
  })
  @ApiOkResponsePaginated(CinemaEntity)
  search(@Param() params: SearchDto): Promise<PaginatedResult<CinemaEntity>> {
    return this.cinemaService.search(params.query);
  }

  @Get(':id/details')
  @ApiOperation({
    summary: "Retrieve cinema's details by its id",
  })
  @ApiParam({
    name: 'id',
    description: "Cinema's ID",
    required: true,
  })
  @ApiOkResponse({ type: CinemaDetailsDto })
  findOneDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CinemaDetailsDto> {
    return this.cinemaService.findOneDetails(id);
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
  @ApiOkResponse({ type: CinemaEntity })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<CinemaEntity> {
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
  @ApiCreatedResponse({ type: CinemaEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCinemaDto: UpdateCinemaDto,
  ): Promise<CinemaEntity> {
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
  @ApiOkResponse({ type: CinemaEntity })
  remove(@Param('id', ParseIntPipe) id: number): Promise<CinemaEntity> {
    return this.cinemaService.remove(id);
  }
}
