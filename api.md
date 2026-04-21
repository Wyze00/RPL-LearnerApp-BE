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

- PUT /api/courses/:courseId
- POST /api/courses/:courseId/videos
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
    "data": { // Buat disimpan oleh react redux di frontend
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
    "data": "Course[]"
}
```

### GET /api/courses/:id

Url Param :
- id: uuid

Response Body 200

```json
{
    "data": "Course"
}
```

### POST /api/courses/:id/enroll

Header :
- Cookie: token (Token harus role learner)

Url Param :
- id: uuid

Request Body

```json
{
    "paymentMethod": "string" 
}
```

Response Body 200

```json
{
    "data": "Course"
}
```