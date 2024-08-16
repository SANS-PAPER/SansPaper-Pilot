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
          Authorization:`Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlpOU0dyLWNmQmN3XzNTYVNRMlQ5WiJ9.eyJpc3MiOiJodHRwczovL3NhbnNwYXBlci5hdS5hdXRoMC5jb20vIiwic3ViIjoiTjMzaWFyVERkWGhDOGFXaWRsT2p4WVdWN0dxU3JjMnBAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vc2Fuc3BhcGVyLmNvbS9wb3N0Z3JhcGhpbGUiLCJpYXQiOjE3MjM3NzMzMzcsImV4cCI6MTcyMzg1OTczNywiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIiwiYXpwIjoiTjMzaWFyVERkWGhDOGFXaWRsT2p4WVdWN0dxU3JjMnAifQ.EVzVRFRtj1c1DfgvHag7CzJHEIGh-mVsI7dSz-R8DeJVuS900RBdlRFzpO83y6AbnLcAvXZ-Pd9Y9UdzYlze30DXUtwP2_17G7QzsfmhkVDbA0Z-_WQnlmyNyWbdPUnnYTBm6HABq3UpF4mQdsjmxgtHET0MK823jIvpytZK4X9b9_oJqwTt1ryf_RrPRUSn35U5acRUsHFHHMaenVgvfvK6-uPCyN_cnEAbrzvuW8dxj1-G-8mCPeKgkw7i7sZwF4zNweznFy2XUBB3koZWZAE5dBrTL2BuTgnae08dFdo2FqlOJcV933DKC9EXZaMqKDdwHpT87LU2BrsrTpPbPw`}
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