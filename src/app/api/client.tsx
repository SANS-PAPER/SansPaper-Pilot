import crossFetch from 'cross-fetch';
import { GraphQLClient } from "graphql-request";
import { getAccessToken } from './auth0Service';

let client: GraphQLClient; // Declare client variable with explicit type

async function customCrossFetch(input: RequestInfo | URL, init?: RequestInit) {
    const response = await crossFetch(input, init);
    const clonedResponse = await response.clone().json();

    if (Array.isArray(clonedResponse.errors) && clonedResponse.errors.length === 1) {
        const firstError = clonedResponse.errors[0];

        switch (firstError.extensions?.code) {
            case 'INTERNAL_SERVER_ERROR':
                throw clonedResponse;
            default:
                return response;
        }
    }

    return response;
}

export const getAndLogAccessToken = async (): Promise<string> => {
    try {
        const postGraphileToken = await getAccessToken();
        let parsedAuthToken = postGraphileToken ? JSON.parse(postGraphileToken) : null;

        if (parsedAuthToken?.access_token) {
            // Check token expiry
            if (parsedAuthToken.expirationTime > Date.now()) {
                return parsedAuthToken.access_token;
            } else {
                return getAndLogAccessToken(); // Recursive call, but needs improvement
            }
        } else {
            return getAndLogAccessToken(); // Recursive call, but needs improvement
        }
    } catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
};

export const initializeGraphQLClient = async (): Promise<GraphQLClient> => {
    const REACT_APP_GQL_HOST_GRAPHILE = 'https://form-staging2.sanspaper.com:20991/graphql';

    try {
        const authToken = await getAndLogAccessToken();

        client = new GraphQLClient(REACT_APP_GQL_HOST_GRAPHILE, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            // errorPolicy: 'all',
            // fetch: customCrossFetch,
        });

        return client; // Return the client instance
    } catch (error) {
        console.error('Error setting up GraphQL client:', error);
        throw error;
    }
};

// Initialize the client at the start
initializeGraphQLClient();

export { client };