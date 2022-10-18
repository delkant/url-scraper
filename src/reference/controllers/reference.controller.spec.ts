import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceController } from './reference.controller';
import { ReferenceService } from '../services/reference.service';
import { Reference } from '../entities/reference.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ReferenceQueue } from '../model/reference.model';
import { ResultService } from '../services/result.service';
import { ReferenceProcessor } from '../worker/reference.processor';
import { Result } from '../entities/result.entity';
import { ScraperService } from '../../scraper/services/scraper.service';

describe('ReferenceController', () => {
  let controller: ReferenceController;
  let referenceService: ReferenceService;
  let resultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BullModule.registerQueue({
          name: ReferenceQueue.REFERENCE_ADDED,
        }),
      ],
      controllers: [ReferenceController],
      providers: [
        ReferenceService,
        ResultService,
        ScraperService,
        ReferenceProcessor,
        {
          provide: getRepositoryToken(Reference),
          useValue: {
            save: jest.fn().mockResolvedValue(mockReferenceEntity),
            findOneBy: jest.fn().mockResolvedValue(mockReferenceEntity),
            findOne: jest.fn().mockResolvedValue(mockReferenceEntity),
            remove: jest.fn().mockResolvedValue(mockReferenceEntity.id),
          },
        },
        {
          provide: getRepositoryToken(Result),
          useValue: {
            save: jest.fn().mockResolvedValue({}),
            remove: jest.fn().mockResolvedValue('mockedResultID'),
            findOneBy: jest.fn().mockResolvedValue(mockResultEntity),
          },
        },
      ],
    }).compile();
    controller = module.get<ReferenceController>(ReferenceController);
    referenceService = module.get(ReferenceService);
    resultService = module.get(ResultService);
  });

  it('post /references should queue reference for async fetching data', async () => {
    jest.spyOn(referenceService, 'queueFetchData').mockResolvedValue(null);

    const createReferenceResult = await controller.create(createReferenceDto);
    expect(createReferenceResult).toEqual(mockReferenceEntity);
    expect(referenceService.queueFetchData).toBeCalledTimes(1);
  });

  it('find one reference', async () => {
    const findOneReferenceResult = await controller.findOne('mockedUUID');
    expect(findOneReferenceResult).toEqual(mockReferenceEntity);
  });

  it('remove reference', async () => {
    const removeReferenceResult = await controller.remove('mockedUUID');
    expect(removeReferenceResult).toEqual(mockReferenceEntity.id);
  });

  it('find results', async () => {
    jest
      .spyOn(resultService, 'findAllByRefId')
      .mockResolvedValue({ result: mockedResults, total: 1, page: 1, size: 1 });
    const findResults = await controller.findResults('mockedUUID');
    expect(findResults.result).toEqual(mockedResults);
    expect(resultService.findAllByRefId).toBeCalledTimes(1);
  });

  it('find last result', async () => {
    jest
      .spyOn(resultService, 'findAllByRefId')
      .mockResolvedValue({ result: mockedResults, total: 1, page: 1, size: 1 });
    const findResults = await controller.findResults('mockedUUID');
    expect(findResults.result).toEqual(mockedResults);
    expect(resultService.findAllByRefId).toBeCalledTimes(1);
  });

  it('remove result', async () => {
    const removeReferenceResult = await controller.removeResult(
      'mockedResultID',
    );
    expect(removeReferenceResult).toEqual('mockedResultID');
  });
});
