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
          Authorization:`Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlpOU0dyLWNmQmN3XzNTYVNRMlQ5WiJ9.eyJpc3MiOiJodHRwczovL3NhbnNwYXBlci5hdS5hdXRoMC5jb20vIiwic3ViIjoiTjMzaWFyVERkWGhDOGFXaWRsT2p4WVdWN0dxU3JjMnBAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vc2Fuc3BhcGVyLmNvbS9wb3N0Z3JhcGhpbGUiLCJpYXQiOjE3MjM3MTAzMzQsImV4cCI6MTcyMzc5NjczNCwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIiwiYXpwIjoiTjMzaWFyVERkWGhDOGFXaWRsT2p4WVdWN0dxU3JjMnAifQ.aLyeN6kyZDHHOzHl_QBjSeF8m6HzqgGeD9chePkTA-DKxG8GEhGYWfHz19ewIlh4-3ELQBUegJuS-eY9YPDkhhTCZC-Uv4eNKSIMOVnoMRxxqnDoVfYC98H-3P17mjjRa8oWQmsbmcwICh_BNvKpc1s0pwp9AitAEXAbqZDJ0z8zOlHS6uqxaEnIQEYT5B5i0G8jVmyMkr9_rtzV3g0gxHU5SKEyWEyzoUom3w_BLIMm5O8tZLx9PlW_l2bWURajJSWDRKXosCaM-GGYSHJ5zlBED_FciTRT_Axh9o-xmjBUNwBgWSftyhdNmzJvTjv2CG1cxJN6OA5NnI5e10X4Kg`}
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