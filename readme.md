# Fauna Playground

Fauna is a distributed document-relational database delivered as a cloud API. Build new or migrate existing applications to Fauna and scale without worrying about operations.

## Useful Resources

-   [Fauna.com](https://fauna.com/)
-   [Cheat sheet](https://docs.fauna.com/fauna/current/api/fql/cheat_sheet)
-   [Fireship.io - FaunaDB Basics - The Database of your Dreams](https://www.youtube.com/watch?v=2CipVwISumA)

## Initial Setup

```
npm init -y
npm i faunadb express
```

## Installation

```
npm i
echo "FAUNADB_SECRET='{SECRET}'" > .env
node src
```

## Endpoints

-   http://localhost:5000/users
-   http://localhost:5000/users/search/:name
-   http://localhost:5000/users/:id
-   http://localhost:5000/phrases
-   http://localhost:5000/phrases/create
-   http://localhost:5000/phrases/:name
