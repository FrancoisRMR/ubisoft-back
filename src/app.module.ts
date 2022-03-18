import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConnectionController } from './connection/connection.controller';
import { GamesController } from './games/games.controller';
import { GamesService } from './games/games.service';
import { AppGateway } from './app.gateway';

@Module({
  imports: [HttpModule],
  controllers: [ConnectionController, GamesController],
  providers: [GamesService, AppGateway, GamesController],
})
export class AppModule {}
