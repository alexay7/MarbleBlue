# MarbleBlue

A server that listen requests and serves responses so that things work for certain games.

## Self Hosting
1. Install [Docker](https://www.docker.com/get-started/)
2. (optional) Create a [Discord developer application](https://discord.com/developers/applications) if you want to use the web UI since it requires OAuth2 authentication.
3. Download the [docker-compose.yml](https://github.com/alexay7/MarbleBlue/blob/main/docker-compose.yml) file from this repository.
4. Fill the environment variables in the `docker-compose.yml` file like this:
- `MONGO_URI`: Leave it as is or change it to your own MongoDB connection string.
- `ALLNET_HOST`: The IP address or hostname where your server will be reachable from the internet or the local IP of the server if you do not plan on making the server public.
- `AIME_SECRET`: A random string used to encrypt Aime tokens, you can generate one using `openssl rand -base64 64`.
- `AIME_KEY`: The string used to sign Aime tokens, you can find it if you search for a bit.
- `DEFAULT_CHU3_MATCHING_URI`: The public address of a matching server if you know of one (port 9004).
- `DEFAULT_CHU3_MATCHING_REFLECTOR`: The public address of a matching server if you know of one (port 50201).
- `SCORES_SERVER`: The public address of a well-known scores server without slash at the end.
- `WEBUI_URL`: (optional) The public address where the web UI will be reachable from the internet or the local IP of the server if you do not plan on making the server public.
- `TZ`: Leave it as is or you will be playing in the future if you do not live in Japan.
- `SESSION_SECRET`: A random string used to sign session tokens, you can generate one using `openssl rand -base64 64`.
- `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`: (optional) The client ID and secret of your Discord developer application if you created one in step 2.
- `KEYCHIP_AUTH`: (optional) Set it to true if you want to enable KeyChip authentication, take into account that you will need to generate a keychip for yourself and add it to the `keychips` collection in the database for any game to work.
5. Run `docker compose up -d` to start the server.
6. Prepare the config file in your game so that it points to your server.
7. Enjoy!

### Web UI configuration
1. Uncomment the `frontend` service in the `docker-compose.yml` file if you want to use the web UI.
2. Fill the environment variables related to the web UI in the `docker-compose.yml` file like this:
- `MY_APP_DISCORD_URL`: The oath URL that Discord gives you when you set up your application, it must be pointed to your frontend URL.
- `MY_APP_SCORES_SERVER`: The public address of a well-known scores server without slash at the end.
- `MY_APP_API_URL`: The public address where the API will be reachable from the internet or the local IP of the server if you do not plan on making the server public.
3. a) Get yourself the game assets needed for the web UI (I can't provide them sorry) and put them in a folder called `public` in the same directory as the `docker-compose.yml` file.
    b) Get yourself the game data needed for the web UI, you can generate it by running the {game}exporter.py file in your game directory.
4. Rebuild the `frontend` service by running `docker compose up -d --build frontend`.
5. Run `docker compose up -d` to start the server.
6. Enjoy!

## Credit
- All the devs who contributed to the development of the Artemis and Aqua servers which served as the base for this server.
- All the people who contributed to the development and investigation of the protocols and data formats of the games supported by this server.