# Every Backend API

NestJS backend for managing the every data with MongoDB. Used by [every](https://github.com/astrutz/every).

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Deployment](#deployment)
- [Running the App](#running-the-app)
- [API Documentation](#api-documentation)
    - [Countries](#countries)
    - [Contests](#contests)
    - [Entries](#entries)
- [License](#license)

---

## Tech Stack

- **[NestJS](https://nestjs.com/)**
- **[MongoDB](https://www.mongodb.com/)** 
- **[Mongoose](https://mongoosejs.com/)** 
- **[TypeScript](https://www.typescriptlang.org/)** 
- - **[class-validator](https://github.com/typestack/class-validator)**
- **[class-transformer](https://github.com/typestack/class-transformer)**

---

## Prerequisites

- **Node.js** v18+ and npm
- **MongoDB Atlas** account (or local MongoDB instance)
- **Git**

---

## Installation

```bash
# Clone the repository
git clone https://github.com/astrutz/every-backend.git
cd every-backend

# Install dependencies
npm install
```

---

### Environment Variables

see `example.env`

---

## Running the App

### Development Mode

```bash
# Start with hot-reload
npm run start:dev
```

The API will be available at `http://localhost:3000`

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

---

## Deployment
tbd

---
## 📚 API Documentation

Base URL: `http://localhost:3000` (Development) or your deployed URL

### Countries

#### Get All Countries

```http
GET /countries
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "code": "DE",
    "name": "Germany",
    "primaryColor": "#000000",
    "secondaryColor": "#FFCE00"
  }
]
```

#### Get Country by ID

```http
GET /countries/:id
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "code": "DE",
  "name": "Germany",
  "primaryColor": "#000000",
  "secondaryColor": "#FFCE00"
}
```

#### Create Country

```http
POST /countries
Content-Type: application/json

{
  "code": "DE",
  "name": "Germany",
  "primaryColor": "#000000",
  "secondaryColor": "#FFCE00"
}
```

#### Update Country

```http
PUT /countries/:id
Content-Type: application/json

{
  "name": "Germany",
  "primaryColor": "#000000",
  "secondaryColor": "#FFCE00"
}
```

#### Delete Country

```http
DELETE /countries/:id
```

---

### Contests

#### Get All Contests

```http
GET /contests
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "year": 2024,
    "colours": ["#f6d915", "#ff46e0", "#000000", "#000000"],
    "hostCountry": {
      "_id": "507f1f77bcf86cd799439014",
      "code": "SE",
      "name": "Sweden"
    },
    "entries": [...]
  }
]
```

#### Get Contest by Year

```http
GET /contests?year=2024
```

#### Get Contest by ID

```http
GET /contests/:id
```

#### Get Top Entries for Contest

Get the top-ranked entries for a specific year, sorted by weighted rating.

```http
GET /contests/:year/top?limit=10
```

**Parameters:**
- `year` (required): Contest year (e.g., 2024)
- `limit` (optional): Number of top entries to return (default: 10)

**Rating Calculation:**
- Energy: 30%
- Staging: 30%
- Studio: 15%
- Fun: 15%
- Vocals: 10%

**Example:**
```http
GET /contests/2024/top?limit=5
```

**Response:**
```json
{
  "year": 2024,
  "colours": ["#f6d915", "#ff46e0", "#000000", "#000000"],
  "hostCountry": {
    "_id": "507f1f77bcf86cd799439014",
    "code": "SE",
    "name": "Sweden"
  },
  "topEntries": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "year": 2024,
      "place": 2,
      "artist": "Baby Lasagna",
      "title": "Rim Tim Dagi Dim",
      "link": "https://www.youtube.com/watch?v=YIBjarAiAVc",
      "energyRating": 10,
      "stagingRating": 9,
      "studioRating": 9,
      "funRating": 10,
      "vocalsRating": 6,
      "totalRating": 9.45,
      "country": {
        "_id": "507f1f77bcf86cd799439016",
        "code": "HR",
        "name": "Croatia",
        "primaryColor": "#FF0000",
        "secondaryColor": "#0093DD"
      }
    }
  ]
}
```

#### Create Contest

```http
POST /contests
Content-Type: application/json

{
  "year": 2024,
  "hostCountry": "507f1f77bcf86cd799439014",
  "colours": ["#f6d915", "#ff46e0", "#000000", "#000000"],
  "entries": []
}
```

#### Update Contest

```http
PUT /contests/:id
Content-Type: application/json

{
  "colours": ["#f6d915", "#ff46e0", "#000000", "#000000"]
}
```

#### Delete Contest

```http
DELETE /contests/:id
```

---

### Entries

#### Get All Entries

```http
GET /entries
```

**Query Parameters:**
- `year` (optional): Filter by contest year
- `country` (optional): Filter by country code

**Examples:**
```http
# All entries
GET /entries

# All entries from 2024
GET /entries?year=2024

# All entries from Germany
GET /entries?country=DE

# All entries from Germany in 2024
GET /entries?year=2024&country=DE
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439017",
    "year": 2024,
    "place": 1,
    "artist": "Nemo",
    "title": "The Code",
    "link": "",
    "energyRating": 7,
    "stagingRating": 8,
    "studioRating": 8,
    "funRating": 7,
    "vocalsRating": 9,
    "country": {
      "_id": "507f1f77bcf86cd799439018",
      "code": "CH",
      "name": "Switzerland",
      "primaryColor": "#FF0000",
      "secondaryColor": "#FFFFFF"
    },
    "contest": {
      "_id": "507f1f77bcf86cd799439019",
      "year": 2024,
      "colours": ["#f6d915", "#ff46e0", "#000000", "#000000"],
      "hostCountry": {
        "_id": "507f1f77bcf86cd799439020",
        "code": "SE",
        "name": "Sweden"
      }
    }
  }
]
```

#### Get Entry by ID

```http
GET /entries/:id
```

#### Create Entry

```http
POST /entries
Content-Type: application/json

{
  "country": "507f1f77bcf86cd799439018",
  "contest": "507f1f77bcf86cd799439019",
  "year": 2024,
  "place": 1,
  "artist": "Nemo",
  "title": "The Code",
  "link": "",
  "energyRating": 7,
  "stagingRating": 8,
  "studioRating": 8,
  "funRating": 7,
  "vocalsRating": 9
}
```

**Validation Rules:**
- `country`: Must be a valid MongoDB ObjectId
- `contest`: Must be a valid MongoDB ObjectId
- `year`: Number
- `place`: Number
- `artist`: String (required)
- `title`: String (required)
- `link`: String (optional)
- `energyRating`: Number (0-10)
- `stagingRating`: Number (0-10)
- `studioRating`: Number (0-10)
- `funRating`: Number (0-10)
- `vocalsRating`: Number (0-10)

#### Update Entry

```http
PUT /entries/:id
Content-Type: application/json

{
  "place": 2,
  "energyRating": 8
}
```

#### Delete Entry

```http
DELETE /entries/:id
```

---

## Database Schema

### Country
```typescript
{
  code: string;           // ISO 3166-1 alpha-2 (e.g., "DE")
  name: string;           // Full country name
  primaryColor?: string;  // Hex color code
  secondaryColor?: string; // Hex color code
}
```

### Contest
```typescript
{
  year: number;           // Contest year (e.g., 2024)
  hostCountry: ObjectId;  // Reference to Country
  colours: string[];      // Array of hex color codes
  entries: ObjectId[];    // Array of Entry references
}
```

### Entry
```typescript
{
  country: ObjectId;      // Reference to Country
  contest: ObjectId;      // Reference to Contest
  year: number;           // Contest year
  place: number;          // Final placement
  artist: string;         // Artist name
  title: string;          // Song title
  link: string;           // YouTube/external link
  energyRating: number;   // 0-10
  stagingRating: number;  // 0-10
  studioRating: number;   // 0-10
  funRating: number;      // 0-10
  vocalsRating: number;   // 0-10
}
```

---

## API Response Formats

### Success Response
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "field1": "value1",
  "field2": "value2"
}
```

### Error Response
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### Validation Error Response
```json
{
  "statusCode": 400,
  "message": [
    "code must be a string",
    "name should not be empty"
  ],
  "error": "Bad Request"
}
```

---

## License

This project is licensed under the MIT License.

---

## Author

**Alex Strutz**

- Website: [alexstrutz.dev](https://alexstrutz.dev)
- GitHub: [@astrutz](https://github.com/astrutz)

---

**Made with ❤️ for Eurovision** 🎵