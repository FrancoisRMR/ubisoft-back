# Backend NestJS Ubisoft Test

## Installation

Run `npm install` to install all dependences

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:3000/`.
Run `npm run start:dev` for a dev server. Navigate to `http://localhost:3000/`, The app will automatically reload if you change any of the source files.
Run `npm run start:prod` for a dev server. Navigate to `http://localhost:3000/`.

## Swagger

After runned the server, you can access to the swagger to `http://localhost:3000/api`.
Be sure to first of all send the request `GET` `Connection` to generate the twitch `Bearer Token` and add it automatically to the others endpoints.

## Features

You will find in this project globally two features.

The first is a chain call to the twitch api in order to retrieve the data of a game sent by the frontend.

The second feature is an implementation of a websocket that loops requests for retrieving streams to send useful data to the frontend.

## License

Nest is [MIT licensed](LICENSE).
