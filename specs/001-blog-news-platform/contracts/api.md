# API Contracts: 个人博客与新闻平台

**Created**: 2025-06-16

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

All admin APIs require authentication via NextAuth session cookie.

Public APIs (news list, blog list) are accessible without authentication.

## Blog Posts API

### List Posts

```http
GET /api/posts?page=1&limit=10&tag=typescript&search=keyword
```

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10, max: 50) |
| tag | string | No | Filter by tag slug |
| search | string | No | Search in title and content |
| status | string | No | `published` or `draft` (admin only) |

**Response:**
```json
{
  "data": [
    {
      "id": "cuid",
      "title": "Post Title",
      "slug": "post-title",
      "excerpt": "Post excerpt...",
      "coverImage": "https://...",
      "publishedAt": "2025-06-16T00:00:00Z",
      "author": {
        "name": "Author Name",
        "avatar": "https://..."
      },
      "tags": [
        { "name": "TypeScript", "slug": "typescript" }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Get Single Post

```http
GET /api/posts/:slug
```

**Response:**
```json
{
  "id": "cuid",
  "title": "Post Title",
  "slug": "post-title",
  "content": "# Markdown content...",
  "excerpt": "Post excerpt...",
  "coverImage": "https://...",
  "publishedAt": "2025-06-16T00:00:00Z",
  "viewCount": 123,
  "author": {
    "name": "Author Name",
    "avatar": "https://..."
  },
  "tags": [
    { "name": "TypeScript", "slug": "typescript" }
  ]
}
```

### Create Post (Admin)

```http
POST /api/posts
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Post Title",
  "content": "# Markdown content...",
  "excerpt": "Optional excerpt",
  "coverImage": "https://...",
  "status": "draft",
  "publishedAt": "2025-06-16T00:00:00Z",
  "tagIds": ["tag-id-1", "tag-id-2"]
}
```

**Response:** `201 Created`
```json
{
  "id": "cuid",
  "slug": "post-title",
  "status": "draft",
  "createdAt": "2025-06-16T00:00:00Z"
}
```

### Update Post (Admin)

```http
PUT /api/posts/:id
Content-Type: application/json
```

**Request Body:** Same as Create

**Response:** `200 OK`

### Delete Post (Admin)

```http
DELETE /api/posts/:id
```

**Response:** `204 No Content`

## News API

### List News

```http
GET /api/news?category=ai&page=1&limit=20
```

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| category | string | No | `ai` or `space` |
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 20) |
| featured | boolean | No | Only featured news |

**Response:**
```json
{
  "data": [
    {
      "id": "cuid",
      "title": "News Title",
      "slug": "news-title",
      "excerpt": "News excerpt...",
      "coverImage": "https://...",
      "category": "AI",
      "sourceName": "Source Name",
      "sourceUrl": "https://source.com/article",
      "publishedAt": "2025-06-16T00:00:00Z",
      "viewCount": 456
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 200
  }
}
```

### Get Single News

```http
GET /api/news/:slug
```

**Response:**
```json
{
  "id": "cuid",
  "title": "News Title",
  "slug": "news-title",
  "content": "Full content...",
  "excerpt": "News excerpt...",
  "coverImage": "https://...",
  "category": "AI",
  "sourceName": "Source Name",
  "sourceUrl": "https://source.com/article",
  "publishedAt": "2025-06-16T00:00:00Z",
  "fetchedAt": "2025-06-16T01:00:00Z",
  "viewCount": 456
}
```

### Update News Status (Admin)

```http
PUT /api/news/:id/status
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "approved"
}
```

**Response:** `200 OK`

## Tags API

### List Tags

```http
GET /api/tags
```

**Response:**
```json
{
  "data": [
    {
      "id": "cuid",
      "name": "TypeScript",
      "slug": "typescript",
      "postCount": 10
    }
  ]
}
```

### Create Tag (Admin)

```http
POST /api/tags
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Tag",
  "description": "Tag description"
}
```

**Response:** `201 Created`

## RSS Sources API (Admin)

### List Sources

```http
GET /api/rss-sources
```

**Response:**
```json
{
  "data": [
    {
      "id": "cuid",
      "name": "Machine Heart",
      "url": "https://jiqizhixin.com/rss",
      "category": "AI",
      "isActive": true,
      "lastFetchedAt": "2025-06-16T00:00:00Z",
      "fetchInterval": 120
    }
  ]
}
```

### Create Source

```http
POST /api/rss-sources
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Source Name",
  "url": "https://example.com/rss",
  "category": "AI",
  "fetchInterval": 120
}
```

### Update Source

```http
PUT /api/rss-sources/:id
Content-Type: application/json
```

### Delete Source

```http
DELETE /api/rss-sources/:id
```

## RSS Crawler API

### Trigger Crawl (Admin or Cron)

```http
POST /api/cron/rss
Headers: Authorization: Bearer ${CRON_SECRET}
```

**Response:**
```json
{
  "success": true,
  "fetched": 5,
  "new": 3,
  "errors": []
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 422 | Invalid request data |
| INTERNAL_ERROR | 500 | Server error |

## Rate Limiting

Public APIs: 100 requests per minute per IP
Admin APIs: 300 requests per minute per user

## Pagination

All list endpoints support cursor-based pagination (optional):

```http
GET /api/posts?cursor=last-item-id&limit=10
```

**Response includes:**
```json
{
  "data": [...],
  "meta": {
    "nextCursor": "next-item-id",
    "hasMore": true
  }
}
```
