import {
  PipeTransform,
  Injectable,
  ArgumentMetadata
} from '@nestjs/common';

@Injectable()
export class ToLowercasePipe implements PipeTransform {
  constructor(private fields: string[]) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'object' || !value) return value;

    for (const field of this.fields) {
      if (value[field] && typeof value[field] === 'string') {
        value[field] = value[field].toLowerCase();
      }
    }

    return value;
  }
}