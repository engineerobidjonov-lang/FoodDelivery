# FoodDash Customer UI

Mock customer-facing food delivery frontend built with Vue 3, Vite, Vue Router, Pinia, and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

## Environment

For Vercel deployment, set this environment variable:

```text
VITE_API_URL=https://abdurahmon-food-backend.onrender.com
```

The app will call backend endpoints as `/api/catalog/categories` and `/api/catalog/foods`.
Local development can keep `VITE_API_URL` empty and use the Vite `/api` proxy.

## Available routes

- `/` home page with featured categories
- `/category/:name` category listing with search and price filter
- `/cart` cart management and seller call modal
- `/location` delivery address and location mock
