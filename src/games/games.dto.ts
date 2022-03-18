import { ApiProperty } from '@nestjs/swagger';

export class GetGamesDto {
  @ApiProperty({
    description: 'The name of the game',
    required: true,
    type: String
  })
  name: string;
}

export class GetGamesDtoResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  views: number;

  @ApiProperty()
  lastUpdatedAt: Date;
}
