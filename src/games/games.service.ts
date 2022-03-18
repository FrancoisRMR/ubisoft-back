import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { map, Observable, of, ReplaySubject, switchMap } from 'rxjs';
import {
  IGameDetails,
  IGameGeneralOverview,
  IStream,
  IStreamData,
  TokenResponse,
} from 'src/interfaces/games.interface';

@Injectable()
export class GamesService {
  private readonly basUrl: string = 'https://api.twitch.tv/helix';
  private readonly LIMIT: number = 100;
  private readonly clientId = 'wsgxey0lxu9mw8xfr0nd51lp3p3yyy';
  private readonly secret = 'am5leu84v1a98yjfm6t5wth9vepjcl';
  private accessToken: string;

  requestedGamesName$: ReplaySubject<any> = new ReplaySubject(1);
  wSIsRunning = true;

  constructor(private httpService: HttpService) {}

  getToken(): Observable<TokenResponse> {
    return this.httpService
      .post<TokenResponse>('https://id.twitch.tv/oauth2/token', {
        client_id: this.clientId,
        client_secret: this.secret,
        grant_type: 'client_credentials',
      })
      .pipe(
        map((response: AxiosResponse<TokenResponse>) => {
          this.accessToken = response.data.access_token;
          return response.data;
        }),
      );
  }

  getGameIdByGameName(name: string): Observable<IGameGeneralOverview> {
    const headersRequest = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
      'Client-Id': this.clientId,
    };

    return this.httpService
      .get(`${this.basUrl}/games?name=${name}`, {
        headers: headersRequest,
      })
      .pipe(
        map((response: AxiosResponse<IGameGeneralOverview>) => response.data),
      );
  }

  getStreamsInfoByGameId(
    name: string,
    id: string,
    totalViewersTemp = 0,
    url = `${this.basUrl}/streams?game_id=${id}&first=${this.LIMIT}`,
  ): Observable<IGameDetails> {
    const headersRequest = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
      'Client-Id': this.clientId,
    };

    let totalViewers: number = totalViewersTemp;
    if (this.wSIsRunning) {
      return this.httpService
        .get<IStream>(url, {
          headers: headersRequest,
        })
        .pipe(
          switchMap((response: AxiosResponse<IStream>) => {
            const twitchStreamData: IStream = response.data;

            twitchStreamData.data.forEach((details) => {
              totalViewers += details.viewer_count;
            });

            if (
              twitchStreamData.pagination.cursor &&
              !twitchStreamData.data.find(
                (details: IStreamData) => !details.viewer_count,
              )
            ) {
              const urlNext = `${url}&after=${twitchStreamData.pagination.cursor}`;
              return this.getStreamsInfoByGameId(
                name,
                id,
                totalViewers,
                urlNext,
              );
            } else {
              const dataToSend: IGameDetails = {
                name: name,
                views: totalViewers,
                lastUpdatedAt: new Date(),
              };
              return of(dataToSend);
            }
          }),
        );
    } else {
      return of();
    }
  }
}
