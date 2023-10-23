# 🎲 greedy app

This is a score tracking app that I built as a way to get out of doing a lot of math when my family plays the dice game greedy (aka farkle).

## 🥞 tech stack

I wanted to take the opportunity to build in technologies that I enjoy a lot

The tech I used:

- Astro (SSR mode)
- Supabase
- React

### Astro

Astro handles all the server-side code that I've written in the project. I've set up Supabase Auth and Database to interact with Astro server-side and pass down any data that it needs to the client. 

Astro API routes have been a lot of fun working with. 

The pattern that I've landed on is to send a request from the front end like this:

```js
const data = await fetch("/api/games/save", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    gameId,
    scores: gameScores,
    accessToken
  })
})
```

And on the backend API route handle the request:

```js
export const PUT: APIRoute = async ({redirect, request, cookies}) => {
  const {gameId, scores, accessToken} = await request?.json()
  if (!accessToken) {
    return new Response(JSON.stringify({
      status: 400,
      message: "No access token provided"
    }))
  }
   
  // https://github.com/supabase/gotrue-js/pull/340#issuecomment-1218065610
  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL, 
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY, {global: { headers: {
      Authorization: `Bearer ${accessToken}`
  }}})

  const {
    data: { user },
  } = await supabase.auth.getUser(accessToken);

  if (user) {
    const { error } = await supabase.from('games').update({scores}).eq('id', gameId)

    if (error?.code) {
      return new Response(JSON.stringify({
        data: error.message
      }), {status: 400})
    } else {
      return new Response(null, {status: 200})
    }

  }
  
  return new Response(null, {status: 500})
}
```

One pattern I learned building this is to construct a Supabase instance on every request with the proper authorization set from the request so requests are valid every single time.

### Supabase
Supabase is a pleasure to work with. I'm using their database features saving games through API routes in Astro. I'm also using Supabase Auth which creates sessions for me to authenticate users with.

The only table I have set up is `games`:

![games table](https://github.com/zacjones93/greedy-app-astro/assets/6188161/b5d5ad4e-df2e-4e9d-8bd8-29a5309f905f)

I also haven't normalized the `scores` column and keeping game scores stored as json as a convenience knowing I will use and that data as intended throughout my application.

A game's scores end up looking like this:

```json
{
  "Zac": [0,1100,650,300,600,700,300,300,250,950,350,2600,300,400],
  "Mariah": [0,800,2500,300,250,300,1050,400,300,1000,700,350,300,400,500,2550]
}
```

### React
I'm opting into React for the stateful aspects of this application. Representing game state and kicking off side-effects when new scores are entered. 

I'm also using React for the form to create games but plan to refactor that to html + astro.

## 🚀 Project Structure

Current folder structure of the application:

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components
│   │   ├── Card.astro
│   │   └── game
│   │       ├── create-game.tsx
│   │       ├── game-in-progress.tsx
│   │       └── game.tsx
│   ├── env.d.ts
│   ├── layouts
│   │   └── Layout.astro
│   ├── lib
│   │   ├── auth.ts
│   │   ├── database.ts
│   │   ├── gameStore.ts
│   │   └── supabase.ts
│   └── pages
│       ├── api
│       │   ├── auth
│       │   │   ├── login.ts
│       │   │   └── logout.ts
│       │   └── games
│       │       ├── create.ts
│       │       ├── delete.ts
│       │       ├── save.ts
│       │       └── win.ts
│       ├── check-your-email.astro
│       ├── games
│       │   ├── [...slug].astro
│       │   ├── index.astro
│       │   └── new.astro
│       ├── index.astro
│       ├── login.astro
│       └── sign-up.astro
├── astro.config.mjs
├── tailwind.config.cjs
├── tsconfig.json
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `yarn`                    | Installs dependencies                            |
| `yarn dev`                | Starts local dev server at `localhost:4321`      |
| `yarn build`              | Build your production site to `./dist/`          |
| `yarn preview`            | Preview your build locally, before deploying     |
| `npx run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npx run astro -- --help` | Get help using the Astro CLI                     |

To successfully run the project you will need a `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` that you will need to generate from a supabase project.

