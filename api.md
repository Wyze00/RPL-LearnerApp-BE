# PAGES

### /login

- POST /api/auth/login

### /register

- POST /api/auth/register

### /forgot-password

- POST /api/auth/forgot-password

### /forgot-pasword/verify

- POST /api/auth/forgot-password/verify

### /logout

- DELETE /api/auth/logout

### /

- GET /api/courses?orderBy=enrolledLearners:desc

### /courses

- GET /api/courses?search=<search>

### /courses/:id

- GET /api/courses/:id

### /courses/:id/enroll

- POST /api/courses/:id/enroll

### /learner/enrollments

- GET /api/enrollments

### /learner/enrollments/:enrollmentId

- GET /api/enrollments/:enrollmentId?include=courses

### /learner/enrollments/:enrollmentId/videos/:videoId

- PUT /api/enrollments/:enrollmentId/videos/:videoId

### /instructor/

- GET /api/instructors/courses
- POST /api/instructors/courses
- GET /api/instructors/stats?year=&month=

### /instructor/courses/:courseId

- GET /api/courses/:courseId
- DELETE /api/courses/:courseId
- PUT /api/courses/:courseId
- POST /api/courses/:courseId/videos
- PUT /api/courses/:courseId/videos/:videoId
- DELETE /api/courses/:courseId/videos/:videoId

### /admin/transaction

- GET /api/admin/transactions
- GET /api/admin/users

# API

## AUTH

### POST /api/auth/login

Request Body

```json
{
  "username": "string",
  "password": "string"
}
```

Response Status 200

```json
{
  "data": {
    // Data disimpan oleh react redux di frontend
    "username": "string",
    "roles": "string[]"
  }
}
```

### POST /api/auth/register

```json
{
  "username": "string",
  "password": "string",
  "email": "string",
  "name": "string"
}
```

Response Status 200

```json
{
  "data": "success"
}
```

### POST /api/auth/forgot-password

```json
{
  "email": "string"
}
```

Response Status 200

```json
{
  "data": "success"
}
```

### GET /api/auth/me

Header :

- Cookie: token

Response Body 200

```json
{
  "data": {
    "username": "string",
    "roles": "string[]"
  }
}
```

### DELETE /api/auth/logout

Header :

- Cookie: token

Response Body 200

```json
{
  "data": "success"
}
```

### POST /api/auth/forgot-password/verify

```json
{
  "token": "string",
  "password": "string"
}
```

Response Status 200

```json
{
  "data": "success"
}
```

## COURSES

### GET /api/courses

Query Param :

- search: string (default "")
- orderBy: string[] (default null) (format <field>:<asc|desc>, separator comma (,))
- skip: number (default 0)
- take: number (default 10)

Response Body 200

```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "instructor_id": "string",
      "preview_video_link": "string",
      "price": "number"
    }
  ]
}
```

### GET /api/courses/:id

Url Param :

- id: uuid

Response Body 200

```json
{
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "instructor_id": "string",
    "preview_video_link": "string",
    "price": "number"
  }
}
```

### POST /api/courses/:id/enroll

Header :

- Cookie: token (Token harus role learner)

Url Param :

- id: uuid

Response Body 200

```json
{
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "instructor_id": "string",
    "preview_video_link": "string",
    "price": "number"
  }
}
```

## LEARNER

### GET /api/enrollments

Header :

- Cookie: token (Token harus role learner)

Response Body 200

```json
{
  "data": [
    {
      "id": "string",
      "learner_id": "string",
      "course_id": "string"
    }
  ]
}
```

### GET /api/enrollments/:enrollmentId

Header :

- Cookie: token (Token harus role learner)

Url Param :

- enrollmentId: uuid

Response Body 200

```json
{
  "data": {
    "id": "string",
    "learner_id": "string",
    "course_id": "string"
  }
}
```

### PUT /api/enrollments/:enrollmentId/videos/:videoId

Header :

- Cookie: token (Token harus role learner)

Url Param :

- enrollmentId: uuid
- videoId: uuid

Response Body 200

```json
{
  "data": {
    "id": "string",
    "enroll_id": "string",
    "video_id": "string",
    "isCompleted": "boolean"
  }
}
```

## INSTRUCTOR

### GET /api/instructors/courses

Header :

- Cookie: token (Token harus role instructor)

Response Body 200

```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "instructor_id": "string",
      "preview_video_link": "string"
    }
  ]
}
```

### POST /api/instructors/courses

Header :

- Cookie: token (Token harus role instructor)

Request Body

```json
{
  "title": "string",
  "description": "string",
  "preview_video_link": "string",
  "price": "number"
}
```

Response Body 200

```json
{
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "instructor_id": "string",
    "preview_video_link": "string",
    "price": "number"
  }
}
```

### GET /api/instructors/stats

Header :

- Cookie: token (Token harus role instructor)

Query Param :

- year: number
- month: number

Response Body 200

```json
{
  "data": [
    {
      "id": "string",
      "createdAt": "string",
      "payment_method": "string",
      "payment_mode": "string",
      "amount": "number",
      "status": "string",
    }
  ]
}
```

### PUT /api/courses/:courseId

Header :

- Cookie: token (Token harus role instructor)

Url Param :

- courseId: uuid

Request Body

```json
{
  "title": "string",
  "description": "string",
  "preview_video_link": "string",
  "price": "number"
}
```

Response Body 200

```json
{
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "instructor_id": "string",
    "preview_video_link": "string",
    "price": "number"
  }
}
```

### DELETE /api/courses/:courseId

Header :

- Cookie: token (Token harus role instructor)

Url Param :

- courseId: uuid

Response Body 200

```json
{
  "success": true
}
```

### POST /api/courses/:courseId/videos

Header :

- Cookie: token (Token harus role instructor)

Url Param :

- courseId: uuid

Request Body

```json
{
  "title": "string",
  "link": "string",
  "duration": "number",
  "order": "number"
}
```

Response Body 200

```json
{
  "data": {
    "id": "string",
    "title": "string",
    "link": "string",
    "duration": "number",
    "order": "number",
    "course_id": "string"
  }
}
```

### PUT /api/courses/:courseId/videos/:videoId

Header :

- Cookie: token (Token harus role instructor)

Url Param :

- courseId: uuid
- videoId: uuid

Request Body

```json
{
  "title": "string",
  "link": "string",
  "order": "number",
  "duration": "number"
}
```

Response Body 200

```json
{
  "data": {
    "id": "string",
    "title": "string",
    "link": "string",
    "duration": "number",
    "order": "number",
    "course_id": "string"
  }
}
```

### DELETE /api/courses/:courseId/videos/:videoId

Header :

- Cookie: token (Token harus role instructor)

Url Param :

- courseId: uuid
- videoId: uuid

Response Body 200

```json
{
  "data": {
    "id": "string",
    "title": "string",
    "link": "string",
    "duration": "number",
    "order": "number",
    "course_id": "string"
  }
}
```

## ADMIN

### GET /api/admin/transactions

Header :

- Cookie: token (Token harus role admin)

Response Body 200

```json
{
  "data": [
    {
      "id": "string",
      "course_id": "string",
      "learner_id": "string",
      "createdAt": "string",
      "payment_method": "string",
      "amount": "number",
      "status": "string"
    }
  ]
}
```

### GET /api/admin/users

Header :

- Cookie: token (Token harus role admin)

Response Body 200

```json
{
  "data": [
    {
      "id": "string",
      "username": "string",
      "name": "string",
      "description": "string",
      "createdAt": "string",
      "deletedAt": "string",
      "email": "string"
    }
  ]
}
```

### GET /api/admin/wallet

Header :

- Cookie: token

Response Body 200

```json
{
  "data": [
    {
      "id": "string",
      "amount": "number"
    }
  ]
}
```

### POST /api/admin/topup

Header :

- Cookie: token

Request Body 

```json
{
  "amount": "number",
  "paymentMethod": "string"
}
```


Response Body 200

```json
{
  "data": {
    "id": "string",
    "amount": "number"
  }
}
```

### POST /api/admin/withdraw

Header :

- Cookie: token

Request Body 

```json
{
  "amount": "number",
  "paymentMethod": "string"
}
```


Response Body 200

```json
{
  "data": {
    "id": "string",
    "amount": "number"
  }
}
```