import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import {
  IGameDetails,
  IGameGeneralOverview,
} from 'src/interfaces/games.interface';
import { GetGamesDto, GetGamesDtoResponse } from './games.dto';
import { GamesService } from './games.service';

@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Get('/views')
  @ApiOkResponse({
    status: 201,
    type: GetGamesDtoResponse,
  })
  getViewversByGameName(
    @Query() query: GetGamesDto,
  ): Observable<IGameDetails[]> {
    const parsedQuery: string[] = query.name.split(',');

    if (parsedQuery.length === 1) {
      return this.gamesService.getGameIdByGameName(query.name).pipe(
        switchMap((generalOverview: IGameGeneralOverview) => {
          return this.gamesService
            .getStreamsInfoByGameId(query.name, generalOverview.data[0].id)
            .pipe(
              map((gameDetails: IGameDetails) => {
                return [gameDetails];
              }),
            )
            .pipe(
              tap(() => {
                if (this.gamesService.wSIsRunning) {
                  this.gamesService.requestedGamesName$.next(query);
                }
              }),
            );
        }),
      );
    } else if (parsedQuery.length > 1) {
      const observableList: Observable<IGameDetails>[] = [];
      parsedQuery.forEach((name: string) => {
        const observable: Observable<IGameDetails> = this.gamesService
          .getGameIdByGameName(name)
          .pipe(
            switchMap((generalOverview: IGameGeneralOverview) => {
              return this.gamesService.getStreamsInfoByGameId(
                name,
                generalOverview.data[0].id,
              );
            }),
          );
        observableList.push(observable);
      });
      return forkJoin(observableList).pipe(
        tap(() => {
          if (this.gamesService.wSIsRunning) {
            this.gamesService.requestedGamesName$.next(query);
          }
        }),
      );
    } else {
      if (this.gamesService.wSIsRunning) {
        this.gamesService.requestedGamesName$.next(query);
      }
      return of(null);
    }
  }
}
