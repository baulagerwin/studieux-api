
# Introduction

The backend application that powers the [studieux-web](https://github.com/baulagerwin/studieux-web).
## Requirements

Install the following requirements first before proceeding.

- [Git](https://git-scm.com/) - Version Control System
- [MongoDB](https://www.mongodb.com/) - NoSQL Database
- [Node](https://nodejs.org/en) - JavaScript Runtime Environment
- [NPM](https://www.npmjs.com/) - Node Package Manager
## Installation

Follow these instructions to run this project on your local machine for development and testing purposes.

1. Clone the repository.

```bash
  git clone https://github.com/baulagerwin/studieux-api.git
```
2. Create a .env file with this content

```bash
  SECRET_KEY=testKey
```

3. Install its dependencies

```bash
  npm install
```

4. Populate the database

```bash
  npm run seed
```

5. Run the dev server

```bash
  npm run dev
```

6. In your default browser, copy the text below and paste it in address bar.

```bash
  http://localhost:3000/api/testing
```

7. Enjoy!
## Built With
-   Node JS
-   Express
-   TypeScript
-   MongoDB
## Acknowledgements

 -  [Mongoose](https://mongoosejs.com/) - ORM
 -  [Joi](https://joi.dev) - Data Validator