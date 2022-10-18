import { Result } from '../entities/result.entity';

export enum ReferenceQueue {
  REFERENCE_ADDED = 'queue-reference-added',
}

export enum ReferenceProcess {
  FETCH_DATA = 'fetch-data',
}

export interface ResultPage {
  result: Result[];
  total: number;
  page: number;
  size: number;
}
