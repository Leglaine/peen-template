# PEEN Template

A template for creating web apps with the PEEN stack (PostgreSQL, Express, EJS, Node).

## Technologies

- Language: Node
- Framework: Express
- Database: PostgreSQL
- ORM: Sequelize
- Template Engine: EJS
- Auth: JWT
- Encryption: Bcrypt
- Logging: Morgan

## Features

- RESTful API for handling authentication via JSON Web Tokens
- Role-based permissions
- Endpoint testing using jest and supertest
- Server-side rendering using EJS templates

## Requirements

- Install [Node](https://nodejs.org/en)
- Install [npm](https://www.npmjs.com/)
- Install [git](https://git-scm.com/)
- Install [PostgreSQL](https://www.postgresql.org/)
- Install [sequelize-cli](https://www.npmjs.com/package/sequelize-cli)

## Use

- Run `git clone https://github.com/Leglaine/peen-template.git` to clone this repository
- Run `npm install` to install project dependencies
- Create databases using psql or pgAdmin
- Rename example.env to .env and fill out any missing information
- Migrate/seed databases
- Run `npm test` to make sure everything is working correctly

## Scripts

- `npm start` - Start the server
- `npm run dev` - Start the server in dev mode
- `npm test` - Run test suites
- `sequelize db:migrate` - Migrate database
- `sequelize db:migrate --env test` - Migrate test database
- `sequelize db:seed` - Seed database