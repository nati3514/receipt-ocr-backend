#  Receipt OCR Backend

A high-performance GraphQL API for processing and managing receipts using OCR (Optical Character Recognition) technology. This scalable backend service enables users to upload receipt images, extract structured data, and perform advanced queries with filtering capabilities.

##  Key Features

- **OCR-Powered Receipt Processing**
  - Image upload support (JPG, PNG)
  - Text extraction using Tesseract.js
  - Structured data parsing (store, date, items, totals)

- **Advanced Querying**
  - Filter by store name (case-insensitive, partial match)
  - Date range filtering
  - Combined filter conditions
  - Pagination-ready architecture

- **Modern Tech Stack**
  - **Runtime**: Node.js 18+ with TypeScript
  - **API**: Apollo Server 4 (GraphQL)
  - **Database**: PostgreSQL with Prisma ORM
  - **OCR**: Tesseract.js
  - **File Handling**: Stream-based processing

## Quick Start

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 13+
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/yourusername/receipt-ocr-backend.git
   cd receipt-ocr-backend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Update .env with your database credentials
   ```

3. **Initialize database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Build the application**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   Access the GraphQL Playground at `http://localhost:4000/graphql`

6. **For development with auto-reload**
   ```bash
   npm run dev
   ```

## 📚 API Documentation

### GraphQL Endpoint
```
POST /graphql
Content-Type: application/json
```

### Example Queries

#### 1. Upload Receipt
```graphql
mutation UploadReceipt($file: Upload!) {
  uploadReceipt(file: $file) {
    id
    storeName
    purchaseDate
    totalAmount
    items {
      name
      price
      quantity
    }
  }
}
```

#### 2. Filter Receipts
```graphql
query GetReceipts($filter: ReceiptFilter) {
  receipts(filter: $filter) {
    id
    storeName
    purchaseDate
    totalAmount
    items {
      name
      price
      quantity
    }
  }
}
```

**Filter Variables Example:**
```json
{
  "filter": {
    "storeName": "walmart",
    "startDate": "2023-11-01T00:00:00Z",
    "endDate": "2023-11-30T23:59:59Z"
  }
}
```

##  Project Structure

```
receipt-ocr-backend/
├── src/
│   ├── index.ts           # Server configuration
│   ├── resolvers.ts       # GraphQL resolvers
│   ├── schema.graphql     # Type definitions
│   └── services/
│       └── ocr.service.ts # Business logic
├── prisma/
│   └── schema.prisma     # Database schema
├── uploads/              # Receipt storage
├── test/                 # Test suite
└── README.md            # This file
```

## Testing

Run the test suite:
```bash
npm test
```

## Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment**
   ```bash
   export NODE_ENV=production
   ```

3. **Run migrations**
   ```bash
   npx prisma migrate deploy
   ```

4. **Start the server**
   ```bash
   npm start
   ```

