# Sans Paper Pilot - AI Solution for Sans Paper Environment

Sans Paper Pilot is an AI tools to be used with other Sans Paper products. Currently it consists of image gallery based on various sources such as Sans Paper Form and Upvise. Later updates will integrate more application as the source of images to be used in the project. Sans Paper Pilot aims to ease the user access on images and provide insights based on AI.

## Installation
Here are the steps you need to follow to install the dependencies.

1. Clone the project in the GitHub.

2. After that **cd** into the template directory then run this command to install all the dependencies

```
yarn install
```

3. Now run this command to start the developement server

```
npm run dev
```

or 

```
yarn dev
```

## Adding new Postgraphile API 
Steps to add new api to call. 

1. Add new GraphQL query inside a new file in folder `src/graphql/queries`. 

2. Open the file `codegen.ts`. Update new Bearer token in Authorization config section.

3. Open command line. Run command `npx graphql-code-generator --config codegen.ts`. Wait until finished and make sure no error.

4. New API is added. check the details at the bottom of file `src/gql/_generated.ts`.

