import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
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
import {
  ApiOkResponsePaginated,
  PaginatedResult,
  PaginateOptions,
} from '../prisma/paginator';
import { MovieDetails } from '../tmdb-api/models';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { SearchDto } from '../dto/search.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MovieEntity } from './entities/movie.entity';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CountPopularParamsDto } from './dto/count-popular-params.dto';

@Controller('movie')
@ApiTags('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve all movies with pagination results',
  })
  @ApiOkResponsePaginated(MovieEntity)
  findAll(@Query() pageable: PaginateOptions): Promise<PaginatedResult<Movie>> {
    return this.movieService.findAll(pageable);
  }

  @Get('only-published/:state')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Retrieve all movies with pagination results',
  })
  @ApiOkResponsePaginated(MovieEntity)
  findAllOnlyPublished(
    @Query() pageable: PaginateOptions,
    @Param('state', ParseBoolPipe) state: boolean,
  ): Promise<PaginatedResult<Movie>> {
    return this.movieService.findAll(pageable, state);
  }

  @Get('planned')
  @ApiOperation({
    summary:
      'Retrieve all movies with a screening in the future with pagination results',
  })
  @ApiOkResponsePaginated(MovieEntity)
  findAllPlanned(
    @Query() pageable: PaginateOptions,
  ): Promise<PaginatedResult<Movie>> {
    return this.movieService.findAllPlanned(pageable);
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
  @ApiOkResponsePaginated(MovieEntity)
  search(@Param() params: SearchDto): Promise<PaginatedResult<MovieEntity>> {
    return this.movieService.search(params.query);
  }

  @Get('popular/:count')
  @ApiOperation({
    summary: 'Find most popular movies',
  })
  @ApiParam({
    name: 'count',
    description: 'Number of movies wanted',
    required: true,
  })
  @ApiOkResponse({ type: MovieEntity, isArray: true })
  getMostPopular(
    @Param() queryParam: CountPopularParamsDto,
  ): Promise<MovieEntity[]> {
    return this.movieService.findMostPopular(queryParam.count);
  }

  @Get('popular/planned/:count')
  @ApiOperation({
    summary: 'Find most popular movies',
  })
  @ApiParam({
    name: 'count',
    description: 'Number of movies wanted',
    required: true,
  })
  @ApiOkResponse({ type: MovieEntity, isArray: true })
  getMostPopularPlanned(
    @Param() queryParam: CountPopularParamsDto,
  ): Promise<MovieEntity[]> {
    return this.movieService.findMostPopularPlanned(queryParam.count);
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
  @ApiQuery({
    name: 'addSeats',
    description: 'Add available seats to each screenings',
    required: false,
  })
  @ApiOkResponse({ type: MovieEntity })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('addSeats', new ParseBoolPipe({ optional: true }))
    addSeats: boolean = true,
  ): Promise<MovieEntity> {
    return this.movieService.findOne(id, addSeats);
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
