import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ShalomService } from '../services/shalom.service';

import { ShalomReadResponseDto } from '../dtos/shalom-read-response.dto';

@ApiTags('Shalom')
@Controller('v1/shalom')
export class ShalomController {
  constructor(private shalomService: ShalomService) {}

  @Get()
  @ApiOperation({ summary: 'Hello World' })
  @ApiResponse({ status: 200 })
  sayHello() {
    return this.shalomService.sayHello();
  }

  @Get('/:key')
  @ApiOperation({ summary: 'Read value provided the key' })
  @ApiResponse({ status: 200, type: ShalomReadResponseDto })
  readKey(@Param('key') key: string) {
    return this.shalomService.readKey(key);
  }
}
