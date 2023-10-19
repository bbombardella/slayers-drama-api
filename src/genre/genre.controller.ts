import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GenreEntity } from './entities/genre.entity';
import { ApiOkResponsePaginated, PaginatedResult, PaginateOptions } from '../prisma/paginator';

@Controller('genre')
@ApiTags('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Create a new genre',
  })
  @ApiCreatedResponse({ type: GenreEntity })
  create(@Body() createGenreDto: CreateGenreDto): Promise<GenreEntity> {
    return this.genreService.create(createGenreDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all genres with pagination results',
  })
  @ApiOkResponsePaginated(GenreEntity)
  findAll(
    @Query() pageable: PaginateOptions,
  ): Promise<PaginatedResult<GenreEntity>> {
    return this.genreService.findAll(pageable);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Retrieve a genre by its id',
  })
  @ApiParam({
    name: 'id',
    description: "Genre's ID",
    required: true,
  })
  @ApiOkResponse({ type: GenreEntity })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<GenreEntity> {
    return this.genreService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Update a genre by its id',
  })
  @ApiParam({
    name: 'id',
    description: "Genre's ID",
    required: true,
  })
  @ApiCreatedResponse({ type: GenreEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGenreDto: UpdateGenreDto,
  ): Promise<GenreEntity> {
    return this.genreService.update(id, updateGenreDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Delete a genre by its id',
  })
  @ApiParam({
    name: 'id',
    description: "Genre's ID",
    required: true,
  })
  @ApiOkResponse({ type: GenreEntity })
  remove(@Param('id', ParseIntPipe) id: number): Promise<GenreEntity> {
    return this.genreService.remove(id);
  }
}
