import { SetMetadata } from '@nestjs/common';

export const ContentType = (type: any) => SetMetadata('contentType', type);
