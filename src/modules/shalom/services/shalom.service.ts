import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ShalomPair } from '../entities/shalomPair.entity';
import { ShalomReadResponseDto } from '../dtos/shalom-read-response.dto';

@Injectable()
export class ShalomService {
  private readonly logger = new Logger(ShalomService.name);

  constructor(@InjectRepository(ShalomPair) private repo: Repository<ShalomPair>) {}

  async sayHello() {
    return 'hello';
  }

  async readKey(key: string): Promise<ShalomReadResponseDto> {
    this.logger.log('ShalomService:: getting record');
    const { value } = await this.repo.findOne({ where: { key } });
    return {
      key,
      value,
    };
  }
}
