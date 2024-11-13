# Note Taking App

## Additional Notes
- I am using `connection.sync({force: false})` to create tables. This is NOT a recommended method. We should instead write migration scripts for this in prod. 

## How to start
1. Install project dependencies

1. Create a `.env.local` file using `.env.sample` file or look at `env.utils.ts` file to check environment validation
to get context on what envs will be required

1. To start app in development mode run `npm run dev` command

2. To start app in docker container run `docker compose --env-file .env.local up --build;`