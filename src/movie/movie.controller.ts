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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie, Role } from '@prisma/client';
import { PaginatedResult, PaginateOptions } from '../prisma/paginator';
import { MovieDetails } from '../tmdb-api/models';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { SearchDto } from '../dto/search.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MovieEntity } from './entities/movie.entity';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movie')
@ApiTags('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve all movies with pagination results',
  })
  @ApiOkResponse({ type: PaginatedResult<Movie> })
  findAll(@Query() pageable: PaginateOptions): Promise<PaginatedResult<Movie>> {
    return this.movieService.findAll(pageable);
  }

  @Get('tmdb/:id')
  @ApiOperation({
    summary: 'Retrieve movie information from The Movie Database',
  })
  @ApiParam({
    name: 'id',
    description: 'ID from The Movie Database',
    required: true,
  })
  @ApiOkResponse({ type: MovieDetails })
  findOneTmdb(@Param('id', ParseIntPipe) id: number): Promise<MovieDetails> {
    return this.movieService.findOneTmdb(id);
  }

  @Post('tmdb/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Create a new movie with data extracted from The Movie Database',
  })
  @ApiParam({
    name: 'id',
    description: 'ID from The Movie Database',
    required: true,
  })
  @ApiCreatedResponse({ type: MovieEntity })
  create(@Param('id', ParseIntPipe) id: number): Promise<MovieEntity> {
    return this.movieService.create(id);
  }

  @Patch(':id/genre')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Add new genres to the movie',
  })
  @ApiParam({
    name: 'id',
    description: 'ID from The Movie Database',
    required: true,
  })
  @ApiCreatedResponse({ type: MovieEntity })
  attachGenre(
    @Param('id', ParseIntPipe) movieId: number,
    @Body() ids: number[],
  ): Promise<MovieEntity> {
    return this.movieService.attachGenre(movieId, ids);
  }

  @Delete(':id/genre')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Remove genres to the movie',
  })
  @ApiParam({
    name: 'id',
    description: 'ID from The Movie Database',
    required: true,
  })
  @ApiOkResponse({ type: MovieEntity })
  detachGenre(
    @Param('id', ParseIntPipe) movieId: number,
    @Body() ids: number[],
  ): Promise<MovieEntity> {
    return this.movieService.detachGenre(movieId, ids);
  }

  @Patch(':id/poster/tmdb')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: "Update movie's poster from The Movie Database",
  })
  @ApiParam({
    name: 'id',
    description: "Movie's ID",
    required: true,
  })
  @ApiCreatedResponse({ type: MovieEntity })
  updateImageTmdb(
    @Param('id', ParseIntPipe) movieId: number,
  ): Promise<MovieEntity> {
    return this.movieService.updateImageFromTmdb(movieId);
  }

  @Patch(':id/poster')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: "Update movie's poster",
  })
  @ApiParam({
    name: 'id',
    description: "Movie's ID",
    required: true,
  })
  @ApiCreatedResponse({ type: MovieEntity })
  updateImage(
    @Param('id', ParseIntPipe) movieId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MovieEntity> {
    return this.movieService.updateImageFromFile(movieId, file);
  }

  @Get('search/:query')
  @ApiOperation({
    summary: 'Search movie in database. Results with pagination',
  })
  @ApiParam({
    name: 'query',
    description: 'The search pattern',
    required: true,
  })
  @ApiOkResponse({ type: PaginatedResult<MovieEntity> })
  search(@Param() params: SearchDto): Promise<PaginatedResult<MovieEntity>> {
    return this.movieService.search(params.query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a movie by its id',
  })
  @ApiParam({
    name: 'id',
    description: "Movie's ID",
    required: true,
  })
  @ApiOkResponse({ type: MovieEntity })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<MovieEntity> {
    return this.movieService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Update a movie by its id',
  })
  @ApiParam({
    name: 'id',
    description: "Movie's ID",
    required: true,
  })
  @ApiCreatedResponse({ type: MovieEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMovieDto,
  ): Promise<MovieEntity> {
    return this.movieService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Delete a movie by its id',
  })
  @ApiParam({
    name: 'id',
    description: "Movie's ID",
    required: true,
  })
  @ApiOkResponse({ type: MovieEntity })
  delete(@Param('id', ParseIntPipe) id: number): Promise<MovieEntity> {
    return this.movieService.delete(id);
  }
}
