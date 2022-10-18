import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Delete,
  ParseUUIDPipe,
  Logger,
} from '@nestjs/common';
import { ReferenceService } from '../services/reference.service';
import { CreateReferenceDto } from '../dto/create-reference.dto';
import { ResultService } from '../services/result.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('references')
export class ReferenceController {
  constructor(
    private readonly referenceService: ReferenceService,
    private readonly resultService: ResultService,
  ) {}

  @Post()
  async create(@Body() createReferenceDto: CreateReferenceDto) {
    return this.referenceService.create(createReferenceDto);
  }

  @Get(':id')
  findOne(@Param('id', new DefaultValuePipe(1), ParseUUIDPipe) id: string) {
    return this.referenceService.findOne(id);
  }

  @Delete()
  remove(@Param('id', new DefaultValuePipe(1), ParseUUIDPipe) id: string) {
    return this.referenceService.remove(id);
  }

  @Get(':id/results')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'size', required: false })
  async findResults(
    @Param('id', new DefaultValuePipe(1), ParseUUIDPipe) id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('size', new DefaultValuePipe(1), ParseIntPipe) size = 10,
  ) {
    Logger.debug(`Results reference_id: ${id} (page: ${page}, size: ${size})`);
    return await this.resultService.findAllByRefId(id, page, size);
  }

  @Get(':id/last-result')
  async findLastResults(
    @Param('id', new DefaultValuePipe(1), ParseUUIDPipe) id: string,
  ) {
    return await this.resultService.findAllByRefId(id, 0, 1);
  }

  @Delete('result/:id')
  async removeResult(
    @Param('id', new DefaultValuePipe(1), ParseUUIDPipe) id: string,
  ) {
    return await this.resultService.remove(id);
  }
}
