# Express TypeScript Boilerplate

Minimal Express.js boilerplate for building APIs with TypeScript support. Includes a structured folder architecture, environment configuration, and essential middleware like CORS and JSON parsing.

## Getting Started

Follow the steps below to get up and running with this project:

### 1. Clone the Repository

### 2. Install Dependencies

```bash
cd express-typescript-boilerplate
npm install
```

### 3. Set Up Environment Variables

Create a .env file in the root of the project directory. This file will contain environment variables. You can create the .env file by copying the .env.example

## Available Scripts

The project includes the following npm scripts:

#### npm run start

Builds the TypeScript code and starts the production server using Node.js. This will run the compiled JavaScript from the dist folder.

```bash
npm run start
```

#### npm run dev

Starts the development server with live-reloading using nodemon and ts-node. Any changes you make to the TypeScript files will automatically be recompiled and reloaded.

```bash
npm run dev
```

#### npm run build

Compiles the TypeScript code into JavaScript for production use. The output will be placed in the dist folder.

```bash
npm npm run build
```
