# Movies backend
Nadezda Artamonova
231815

Аутенфикация требуется на операции добавления, обновления и удаления.

# Step 1.

.env
DB_NAME = DB_Artamonova
DB_USERNAME = 
DB_PASSWORD = 
DB_HOST = 
DB_PORT = 5432
DB_DIALECT = postgres

JWT_SECRET=supersecretkey123

## PACKAGES
    "bcryptjs": "^3.0.2",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.13.3",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.37.6"

# Register
Thunder Client

http://localhost:3000/auth/register

{
  "username": "test",
  "password": "123"
}

# Login
http://localhost:3000/auth/login

{
  "username": "test",
  "password": "123"
}

# Category
## CRUD
### GET ALL
http://localhost:3000/categories

### GET BY ID
http://localhost:3000/categories/2

### CREATE
post
http://localhost:3000/categories
{
  "name": "Test cat1"
}

### UPDATE
http://localhost:3000/categories/20
Put
{
  "name": "Test cat2"
}

### DELETE
http://localhost:3000/categories/20


# Actor
## CRUD
### GET ALL
http://localhost:3000/actors

### GET BY ID
http://localhost:3000/actors/2

### CREATE
post
http://localhost:3000/categories
{
  "first_name": "Nadia",
  "last_name": "Art"
}

### UPDATE
http://localhost:3000/actors/205
Put
{
  "first_name": "Nadia123",
  "last_name": "Art23"
}

### DELETE
http://localhost:3000/actors/205

# Language
## CRUD
### GET ALL
http://localhost:3000/languages

### GET BY ID
http://localhost:3000/languages

### CREATE
post
http://localhost:3000/languages
{
  "name": "Estonian"
}

### UPDATE
http://localhost:3000/languages/8
Put
{
  "name": "Russian"
}

### DELETE
http://localhost:3000/languages/8

# Film

## CRUD

### GET ALL
http://localhost:3000/films

works with pagination. standart:
from id = 1, size = 100
http://localhost:3000/films

http://localhost:3000/films?page=2&size=200

  "page": 2,
  "size": 200,
  "total": 200,

http://localhost:3000/films?page=2&size=10
    "page": 2,
    "size": 10,
    "total": 10,



### GET BY ID
http://localhost:3000/films/1

### CREATE
post
http://localhost:3000/films
{
  "title": "Titanic123",
  "release_year": 1997,
  "language_id": 1,
  "actor_ids": [1, 2, 3],
  "category_ids": [4, 5]
}

### UPDATE
http://localhost:3000/films/1003
Put
{

  "language_id": 3,
  "actor_ids": [4],
  "category_ids": [1]
}

### DELETE
http://localhost:3000/films/1003

## SEARCH
### By title

http://localhost:3000/films/search/title?title=Academy

### with filter 
http://localhost:3000/films/search/title?title=Academy&sortBy=rental_rate&order=DESC
http://localhost:3000/films/search/language?language=English&sortBy=film_id&order=ASC


### Search actors with the name // last name // name+lastname

http://localhost:3000/films/search/actor?actor=Nick
http://localhost:3000/films/search/actor?actor=MARY KEITEL
http://localhost:3000/films/search/actor?actor=MARY&sortBy=length&order=ASC

### By language

http://localhost:3000/films/search/language?language=Italian

### By category
http://localhost:3000/films/search/category?category=Comedy

### By actors in film
http://localhost:3000/films/actors?film_id=5