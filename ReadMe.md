# Blog task

this is task is about creating a new blog with posts and users and also and admin for this blog.

## Description

I used Laravel 11 to create tha api needed for the blog with mysql for database
for the frontend I used reactjs with redux and redux toolkit rtk query
there is 3 folders

- laravel backend for apis
- admin dashboard with reactjs
- blog website with reactjs

## Getting Started

### Dependencies

- mysql
- node js
- composer

### Installing

- clone the repository

- in the backend laravel you have to setup the environment variables in the .env file
  first copy the .env.example
  add mysql credentials and the database name

```
  DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=blogs_task
DB_USERNAME=root
DB_PASSWORD=AWb9q0iQgg6EqHH

```

- in the admin dashboard you have to setup the backend url in the .env file
- in the blog website you have to setup the backend url in the .env file

```
VITE_API_URL = http://127.0.0.1:8000/api
```

### Executing program

#### backend

- run these commands

```
cd Blog-task
```

```
composer install
```

```
php artisan migrate
```

```
php artisan db:seed
```

```
php artisan serve
```

#### frontend (admin dashboard & blog site)

```
npm install
```

```
npm run dev
```
