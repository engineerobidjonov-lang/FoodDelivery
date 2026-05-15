# Food Delivery Backend

Express API for the FoodDelivery frontend. The backend currently uses in-memory seed data so it runs immediately without database setup.

## Run

```bash
npm start
```

The server starts on `http://localhost:5000` by default.

## Endpoints

### Health

- `GET /api/health`

### Catalog

- `GET /api/categories`
- `GET /api/categories/:categoryId`
- `GET /api/categories/:categoryId/foods`
- `GET /api/foods`
- `GET /api/foods/:id`

Supported query params on `/api/foods` and `/api/categories/:categoryId/foods`:

- `category`
- `search`
- `maxPrice`
- `sort` with `default`, `price_asc`, `price_desc`, `name_asc`
- `limit`
- `availableOnly=true`

### Location and Addresses

- `GET /api/location/detect`
- `GET /api/addresses`
- `POST /api/addresses`

Example `POST /api/addresses` body:

```json
{
  "label": "Home",
  "street": "742 Market Street",
  "city": "San Francisco",
  "region": "CA",
  "postalCode": "94103"
}
```

### Orders

- `POST /api/orders/quote`
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/:id`

Example `POST /api/orders/quote` body:

```json
{
  "items": [
    { "foodId": 1, "quantity": 2 },
    { "foodId": 21, "quantity": 1 }
  ]
}
```

Example `POST /api/orders` body:

```json
{
  "customerName": "Alex Johnson",
  "contactPhone": "+1 555 201 4455",
  "address": {
    "street": "742 Market Street",
    "city": "San Francisco",
    "region": "CA",
    "postalCode": "94103"
  },
  "items": [
    { "foodId": 1, "quantity": 2 },
    { "foodId": 21, "quantity": 1 }
  ]
}
```

## Notes

- Data is reset when the server restarts.
- The existing frontend already works with `GET /api/categories` and `GET /api/foods`.
