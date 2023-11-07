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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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
import { ProductEntity } from './entities/product.entity';
import {
  ApiOkResponsePaginated,
  PaginatedResult,
  PaginateOptions,
} from '../prisma/paginator';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Create a new product',
  })
  @ApiCreatedResponse({ type: ProductEntity })
  create(@Body() createProductDto: CreateProductDto): Promise<ProductEntity> {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all products with pagination results',
  })
  @ApiOkResponsePaginated(ProductEntity)
  findAll(
    @Query() pageable: PaginateOptions,
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.productService.findAll(pageable);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Retrieve a product by its id',
  })
  @ApiParam({
    name: 'id',
    description: "Product's ID",
    required: true,
  })
  @ApiOkResponse({ type: ProductEntity })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductEntity> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Update a product by its id',
  })
  @ApiParam({
    name: 'id',
    description: "Product's ID",
    required: true,
  })
  @ApiCreatedResponse({ type: ProductEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.update(id, updateProductDto);
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
  @ApiOkResponse({ type: ProductEntity })
  remove(@Param('id', ParseIntPipe) id: number): Promise<ProductEntity> {
    return this.productService.remove(id);
  }

  @Get('cinema/:id')
  @ApiOperation({
    summary: 'Retrieve all products available in the cinema',
  })
  @ApiOkResponse({ type: ProductEntity, isArray: true })
  findAllInsideCinema(
    @Param('id', ParseIntPipe) cinemaId: number,
  ): Promise<ProductEntity[]> {
    return this.productService.findAllInsideCinema(cinemaId);
  }
}
