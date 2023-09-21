## Halal Restaurant Locator

## Getting Started

### Define environment variables for local development

Create .env.local file in the root of the project and have the following environemnt variables defined.

- `DATABASE_URL=[contact admin of repo for the value]`.
- `NEXT_PUBLIC_MAPBOX_ACCESS=[contact admin of repo for the value]`

### Install dependencies

In your terminal, in the root of the project run `npm install`

Prisma ORM: You need to generate a prisma client to succesfully run database comands. Run the following command in the root of your project.

- `npx prisma generate client`

### Start development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

### APi Documentation

Open [http://localhost:3000/api-doc](http://localhost:3000/api-doc) to see the api specifications.

### Branching Strategy

Our base branch that everything comes from is called main. All branches originate from the main branch.
