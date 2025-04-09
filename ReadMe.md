### social media platform 

### features 

- user can create an account and login
- user can create posts
- user can comment on posts
- user can like posts
- user can view posts
- user can view comments
- user can view likes

### technologies 

- express
- mongoose
- mongodb
- json web tokens
- cors
- express.json
- bcrypt
- dotenv

### backend 

- create a new post
- get all posts
- get a single post
- update a post
- delete a post
- like a post

### frontend 

- create a new post
- get all posts
- get a single post
- update a post
- delete a post
- like a post

### database 

- posts
- comments
- likes
- users

### api 

- create a new post
- get all posts
- get a single post
- update a post
- delete a post
- like a post

### database schema 

- posts
- comments
- likes
- users

### user stories 

- as a user, i want to be able to create an account and login
- as a user, i want to be able to create posts
- as a user, i want to be able to comment on posts
- as a user, i want to be able to like posts

### api documentation with endpoints and methods body and example

### API Endpoints

#### User Authentication
- POST `/api/users/register`
  - Body: `{ username, email, password }`
  - Example: `{ "username": "john_doe", "email": "john@example.com", "password": "securepass123" }`

- POST `/api/users/login`
  - Body: `{ email, password }`
  - Example: `{ "email": "john@example.com", "password": "securepass123" }`

- GET `/api/users/profile`
  - Header: `Authorization: Bearer <token>`
  - Example: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### Posts
- POST `/api/posts`
  - Header: `Authorization: Bearer <token>`
  - Body: `{ title, content }`
  - Example: `{ "title": "My first post", "content": "This is my first post" }`

- GET `/api/posts`
  - Method: GET
  - Description: Retrieves all posts

- GET `/api/posts/:id`
  - Method: GET
  - Description: Retrieves a single post by ID
  - Example: `/api/posts/643d6d594d27c427610e0e10`

- PUT `/api/posts/:id`
  - Header: `Authorization: Bearer <token>`
  - Body: `{ title, content }`
  - Example: `{ "title": "Updated post", "content": "This is my updated post" }`

- DELETE `/api/posts/:id`
  - Header: `Authorization: Bearer <token>`
  - Description: Deletes a post by ID

- POST `/api/posts/:id/like`
  - Header: `Authorization: Bearer <token>`
  - Description: Toggles like status on a post

#### Comments
- POST `/api/comments`
  - Header: `Authorization: Bearer <token>`
  - Body: `{ content, postId }`
  - Example: `{ "content": "Great post!", "postId": "643d6d594d27c427610e0e10" }`

- GET `/api/comments/post/:postId`
  - Description: Retrieves all comments for a specific post
  - Example: `/api/comments/post/643d6d594d27c427610e0e10`

- PUT `/api/comments/:id`
  - Header: `Authorization: Bearer <token>`
  - Body: `{ content }`
  - Example: `{ "content": "Updated comment" }`

- DELETE `/api/comments/:id`
  - Header: `Authorization: Bearer <token>`
  - Description: Deletes a comment by ID

All protected routes require a valid JWT token in the Authorization header.
Responses will be in JSON format with appropriate HTTP status codes.



