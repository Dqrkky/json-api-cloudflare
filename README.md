```txt
npm install
npm run dev
```

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

# JSON Storage API (Cloudflare D1 + Hono)
Serverless JSON storage API using Cloudflare Workers and D1.

# JSON Storage API

A simple JSON storage API built with Hono + Cloudflare D1.
Save, retrieve, update, and delete JSON objects by ID.

---

## Base URL
```
https://your-domain.com
```

---

## API Endpoints

- `GET /` - Health check.  
  **Response:** 
  ```str
  "JSON Storage API with Name is running."
  ```

- `POST /save` - Save a new JSON record.  
  **Request Body:**
  ```json
  { "name": "example", "data": { "foo": "bar" } }
  ```  
  **Response:**
  ```json
  { "success": true, "id": 1 }
  ```

- `GET /get/:id` - Get a JSON record by ID.  
  **Response:**
  ```json
  { "id": 1, "name": "example", "data": { "foo": "bar" } }
  ```

- `GET /all` - Get all JSON records.  
  **Response:**
  ```json
  [
    { "id": 1, "name": "example", "data": { "foo": "bar" } },
    { "id": 2, "name": "another", "data": [1,2,3] }
  ]
  ```

- `PUT /update/:id` - Update a JSON record by ID.  
  **Request Body (at least one field required):**
  ```json
  { "name": "updated", "data": { "foo": "baz" } }
  ```  
  **Response:**
  ```json
  { "success": true }
  ```

- `DELETE /delete/:id` - Delete a JSON record by ID.  
  **Response:**
  ```json
  { "success": true }
  ```

---

## Examples with `curl`

- **Health Check**
```bash
curl -X GET https://your-domain.com/
```
- **Response:**
```str
"JSON Storage API with Name is running."
```

- **Save**
```bash
curl -X POST https://your-domain.com/save   -H "Content-Type: application/json"   -d '{"name":"example","data":{"foo":"bar"}}'
```
- **Response:**
```json
{ "success": true, "id": 1 }
```

- **Get by ID**
```bash
curl -X GET https://your-domain.com/get/1
```
- **Response:**
```json
{ "id": 1, "name": "example", "data": { "foo": "bar" } }
```

- **Get all**
```bash
curl -X GET https://your-domain.com/all
```
- **Response:**
```json
[
  { "id": 1, "name": "example", "data": { "foo": "bar" } },
  { "id": 2, "name": "another", "data": [1,2,3] }
]
```

- **Update**
```bash
curl -X PUT https://your-domain.com/update/1   -H "Content-Type: application/json"   -d '{"name":"updated","data":{"foo":"baz"}}'
```
- **Response:**
```json
{ "success": true }
```

- **Delete**
```bash
curl -X DELETE https://your-domain.com/delete/1
```
- **Response:**
```json
{ "success": true }
```
