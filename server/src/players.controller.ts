import { PlayersService } from './players.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  findAll() {
    return this.playersService.findAll();
  }

  @Post()
  create(@Body() body: { username: string; country: string }) {
    return this.playersService.create(body);
  }
}
