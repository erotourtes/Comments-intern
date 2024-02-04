import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import config from '../../config';

export class ParseOrderPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query')
      throw new Error('ParseOrderPipe is only applicable to query parameters');

    return value === 'asc' || value === 'desc' ? value : config.pagination.sort;
  }
}
