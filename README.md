# FletNix

A Netflix-style catalog browser built with Angular and Node.js. Users can register, log in, and browse a database of movies and TV shows with search, filters, and age-based content restrictions.

## Tech stack

- **Frontend:** Angular 19, Tailwind CSS, ngx-toastr, Lucide icons
- **Backend:** Express.js, MongoDB (Mongoose), JWT auth, bcryptjs
- **Deployment:** Vercel (both frontend and backend)

## How to run locally

### Backend

```
cd backend
npm install
```

Create a `.env` file:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=any_secret_key_here
```

```
npm run dev
```

Runs on `http://localhost:3000`

### Frontend

```
cd frontend
npm install
ng serve
```

Runs on `http://localhost:4200`


## Features

- JWT-based authentication with token stored in localStorage
- Age-based content filtering (R-rated content hidden for users under 18)
- Debounced search across title and cast
- Type filter (All / Movies / TV Shows)
- Pagination
- Responsive layout

## deployed link
- https://flet-nix-frontend-dev.vercel.app/