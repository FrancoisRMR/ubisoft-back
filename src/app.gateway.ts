import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Subscription } from 'rxjs';
import { Server } from 'socket.io';
import { GamesController } from './games/games.controller';
import { GamesService } from './games/games.service';
import { IGameDetails } from './interfaces/games.interface';

@WebSocketGateway({ cors: true })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  subscriptions: Subscription = null;
  isrunning;

  constructor(
    private gamesService: GamesService,
    private gamesController: GamesController,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection() {
    this.gamesService.wSIsRunning = true;

    if (!this.subscriptions) {
      this.subscriptions = this.gamesService.requestedGamesName$.subscribe({
        next: (query: any) => {
          if (query) {
            this.gamesController.getViewversByGameName(query).subscribe({
              next: (values: IGameDetails[]) =>
                this.server.emit('getViewversByGames', values),
            });
          }
        },
      });
    }
  }

  handleDisconnect() {
    this.gamesService.wSIsRunning = false;
    this.gamesService.requestedGamesName$.next(null);
  }
}
