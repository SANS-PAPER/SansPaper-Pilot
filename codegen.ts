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

// Modify Bearer token each time to run
const config: CodegenConfig = {
  schema: [
    {
      [GQL_STAGING_ENDPOINT]: {
        headers:   {
          Authorization:`Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlpOU0dyLWNmQmN3XzNTYVNRMlQ5WiJ9.eyJpc3MiOiJodHRwczovL3NhbnNwYXBlci5hdS5hdXRoMC5jb20vIiwic3ViIjoicnZzZTlicnZmUDdHNzhIRm15OUwwc0tpSDVwdUVMdlFAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vc2Fuc3BhcGVyLmNvbS9wb3N0Z3JhcGhpbGUiLCJpYXQiOjE3MjkxNTEwNjMsImV4cCI6MTcyOTIzNzQ2MywiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIiwiYXpwIjoicnZzZTlicnZmUDdHNzhIRm15OUwwc0tpSDVwdUVMdlEifQ.v1jb04Op6fuFUliuG8mLASvzx9mUR91Vl5Zcj0JbYYEr1ziK6c__5p9vzkZNtfBxMCqnSb2rY7fuDyjPbfDirwrIAqNFYddIYVXd0S3zicm3H6yRDP262p-wc7bDFCPlbr3DSTGd9oK3xi4mV6bGJbdV9ZTyTraYGUJ9hiTvMe_2LHnaLumsq_cqBDo2uLQNTsYbEggwU9x8K4dAVlcTaVeNA41GxdvU0YyIYW5fIDQc8bwXFijYE3-j4I9TwRd08IrHsBL5oiSdzPeOyFULaccQhpPdn5dCdXo1A4vztIAbfQcAmQpUh2ZF5H5UxFj53sZ3HBO0WCROxBnqTFQ90g`}

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