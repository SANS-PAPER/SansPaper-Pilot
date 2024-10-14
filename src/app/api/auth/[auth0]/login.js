import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export default handleAuth({
  login: async (req, res) => {
    await handleLogin(req, res, {
      returnTo: process.env.AUTH0_BASE_URL,
    });
  },
});
