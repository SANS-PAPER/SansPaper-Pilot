import axios from 'axios';
import Swal from 'sweetalert2';

function showAlert() {
    Swal.fire({
      title: 'Alert!',
      text: 'Auth0 Postgraphile: Please refresh/relogin',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  }


export const getAccessToken = async () => {
    const auth0Endpoint = 'https://sanspaper.au.auth0.com/oauth/token';
    const clientId = 'rvse9brvfP7G78HFmy9L0sKiH5puELvQ';
    const clientSecret = 'uFoCLn_dQAuSbqElNWOUFm7hcMqhBhdcULlf0fvxbIcOoFReMp4CsuOaQjaMJB2C';
    const audience = 'https://sanspaper.com/postgraphile';
    const grantType = 'client_credentials';

     //console.log('masuk file getAccessToken------------------');

  
    try {
      const response = await axios.post(auth0Endpoint, {
        client_id: clientId,
        client_secret: clientSecret,
        audience: audience,
        grant_type: grantType,
      });

      //console.log('masuk file getAccessToken------------------', response);

  
      const { access_token, token_type, expires_in } = response.data;

      const expirationTime = new Date().getTime() + expires_in * 1000;



      sessionStorage.setItem('@postgraphile_token', JSON.stringify({ access_token, expirationTime }));
      // console.log('access_token------for postgraphile is ------------', access_token);



      return `${JSON.stringify({ access_token, expirationTime })}`;
    } catch (error) {
      showAlert();
      throw error;
    }
  };
