import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ShalomService } from './services/shalom.service';
import { ShalomController } from './controllers/shalom.controller';
import { ShalomPair } from './entities/shalomPair.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShalomPair])],
  controllers: [ShalomController],
  providers: [ShalomService],
  exports: [ShalomService],
})
export class ShalomModule {}
