import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginatedResultMeta {
  @ApiProperty()
  total: number;

  @ApiProperty()
  lastPage: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  perPage: number;

  @ApiProperty()
  prev: number | null;

  @ApiProperty()
  next: number | null;
}

export class PaginatedResult<T> {
  @ApiProperty({ type: 'object', isArray: true })
  data: T[];

  @ApiProperty()
  meta: PaginatedResultMeta;
}

export const ApiOkResponsePaginated = <DataDto extends Function>(
  dataDto: DataDto,
) => {
  return applyDecorators(
    ApiExtraModels(PaginatedResult, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResult) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
};

export class PaginateOptions {
  @ApiProperty({ type: 'number', default: 1, required: false })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  page?: number;

  @ApiProperty({ type: 'number', default: 10, required: false })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  perPage?: number;
}

export type PaginateFunction = <T, K>(
  model: any,
  args?: K,
  options?: PaginateOptions,
) => Promise<PaginatedResult<T>>;

const internalPaginator = (
  defaultOptions: PaginateOptions,
): PaginateFunction => {
  return async (model, args: any = { where: undefined }, options) => {
    const page = Number(options?.page || defaultOptions?.page) || 1;
    const perPage = Number(options?.perPage || defaultOptions?.perPage) || 10;

    const skip = page > 0 ? perPage * (page - 1) : 0;
    const [total, data] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany({
        ...args,
        take: perPage,
        skip,
      }),
    ]);
    const lastPage = Math.ceil(total / perPage);

    return {
      data,
      meta: {
        total,
        lastPage,
        currentPage: page,
        perPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
    };
  };
};

export const paginator: PaginateFunction = internalPaginator({
  page: 0,
  perPage: 15,
});
