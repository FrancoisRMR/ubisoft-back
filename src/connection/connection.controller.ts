import { Controller, Get } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { map, Observable } from 'rxjs';
import { GamesService } from 'src/games/games.service';

@ApiTags('Connection')
@Controller('connection')
export class ConnectionController {
  constructor(private gamesService: GamesService) {}

  @Get()
  @ApiOkResponse({
    status: 201,
    type: Boolean
  })
  getTwitchToken(): Observable<boolean> {
    return this.gamesService.getToken().pipe(
      map((res) => {
        if (res) {
          return true;
        } else {
          return false;
        }
      }),
    );
  }
}
