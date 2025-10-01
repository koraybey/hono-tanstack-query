# hono-tanstack-query

> ⚠️ **Work in Progress**: This library is under active development. APIs may change.

## Installation

Install directly from GitHub:

```bash
pnpm add github:koraybey/hono-tanstack-query
```

Or with other package managers:

```bash
npm install github:koraybey/hono-tanstack-query
yarn add github:koraybey/hono-tanstack-query
```

## Requirements

- React >=18
- @tanstack/react-query ^5.0.0
- hono ^4.0.0

## Current Limitations

- `useSuspenseQuery` is not yet implemented

## Usage

### Setting up the client

First, create a Hono RPC client as usual:

```typescript
import { hc } from 'hono/client'
import type { AppType } from './server' // Your Hono app type

export const client = hc<AppType>('http://localhost:3000')
```

### Using queries

```typescript
import { useQuery } from 'hono-tanstack-query'
import { client } from './client'

const menuQuery = useQuery(
  client.api.menu[':businessLocationId'][':menuId'],
  '$get',
  {
    param: {
      menuId: '123',
      businessLocationId: '456',
    },
  },
  {
    staleTime: 5 * 60 * 1000,
  }
)
```

### Using mutations

```typescript
import { useMutation } from 'hono-tanstack-query'
import { client } from './client'

const createPaymentMutation = useMutation(
  client.api.payment['create-link'],
  '$post'
)

createPaymentMutation.mutate({
  json: {
    amount: 100,
    currency: 'USD',
  },
})
```

## License

MIT
