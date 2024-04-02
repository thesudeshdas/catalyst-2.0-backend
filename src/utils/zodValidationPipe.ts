import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodObject } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown) {
    try {
      this.schema.parse(value);
    } catch (error) {
      const validationErrorMessages = error.errors.reduce(
        (acc, cur) => acc + cur.message + ', ',
        '',
      );

      throw new BadRequestException(
        `Validation failed. ${validationErrorMessages}`,
      );
    }
    return value;
  }
}
