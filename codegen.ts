import type { CodegenConfig } from '@graphql-codegen/cli';

 const GQL_STAGING_ENDPOINT =
  process.env.GQL_CUSTOMER_APP_ENDPOINT || 'https://form-staging2.sanspaper.com:20991/graphql';

// const GQL_STAGING_ENDPOINT =
//   process.env.GQL_CUSTOMER_APP_ENDPOINT || 'https://graphql.sanspaper.com:20991/graphql';




// const comments = [
//   '/* eslint-disable @typescript-eslint/ban-ts-comment */',
//   '/* eslint-disable @typescript-eslint/no-explicit-any */',
//   '/* eslint-disable @typescript-eslint/no-non-null-assertion */',
//   '/* eslint-disable @typescript-eslint/no-unsafe-assignment */',
//   '/* eslint-disable @typescript-eslint/prefer-optional-chain */',
//   '/* eslint-disable no-prototype-builtins */',
//   '// @ts-nocheck',
// ];

// const addCommentPlugins = comments.map((content) => ({
//   add: {
//     content,
//   },
// }));



// getAndLogAccessToken();


const config: CodegenConfig = {
  schema: [
    {
      [GQL_STAGING_ENDPOINT]: {
        headers:   {

          Authorization:`Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlpOU0dyLWNmQmN3XzNTYVNRMlQ5WiJ9.eyJpc3MiOiJodHRwczovL3NhbnNwYXBlci5hdS5hdXRoMC5jb20vIiwic3ViIjoiTjMzaWFyVERkWGhDOGFXaWRsT2p4WVdWN0dxU3JjMnBAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vc2Fuc3BhcGVyLmNvbS9wb3N0Z3JhcGhpbGUiLCJpYXQiOjE3MjQyOTIyOTIsImV4cCI6MTcyNDM3ODY5MiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIiwiYXpwIjoiTjMzaWFyVERkWGhDOGFXaWRsT2p4WVdWN0dxU3JjMnAifQ.TdGFjHvtWhyqLVZxoH_EBd8xh44O2HdwjxLntRwh3w1gj62df-NH-6ujSR1G2xXpsKbbEvUz9DeFTt5Ejn7xS1ApSXvYpHDfcV1W5M_A0vmbngYq45f_AUFkkIDgM4ta0uvqBCTOlMu9Vk9Eg2q0Xxva1UAUGHIishlFrm9bjuWY9_LgU1Z8VUbYT7HyGbikv18__1idPdPWg5HGPUjXKmPhoP3aMj2J5Ja3PyyaacUuHGZSk5ahKa9YYDJu-Jma1c_9ThQ6eP_3MuAw2HPPIKfUmYFAY8EOAgpqP7uaXbKrXnrGNAx3oivEsZ4qT4GaxdCg8kkjR1wBMJZzNuP7Fw`}

      },
    },
  ],
  
  documents: "src/**/*.graphql",
  emitLegacyCommonJSImports: false,
  generates: {
    './src/gql/_generated.ts': {
      plugins: [
        // ...addCommentPlugins,
        'typescript',
        {
          'typescript-operations': {
            nonOptionalTypename: false,
          },
        },
        {
          'typescript-react-query': {
            addInfiniteQuery: true,
          },
        },
      ],
      config: {
        // fetcher: '@goodhuman-me/api/client#request',
        // isReactHook: true,
        fetcher: 'graphql-request',
        scalars: {
          // JSON: 'string',
          // UUID: 'string',
          DateTime: 'Date',
        },
        // fetcher: {
        //   endpoint: 'http://localhost:4000/graphql',
        //   fetchParams: {
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //   },
        // },
      },
    },
  }
};
export default config;