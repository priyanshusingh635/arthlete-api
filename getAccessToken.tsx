import axios from 'axios';
import qs from 'qs';


const CLIENT_ID = 'e005e47ae8374392928036f4afdeba91';
const CLIENT_SECRET = 'dc6a4f18d9534b96970fa5e59c904aee';

export const getAccessToken = async () => {
  const data = qs.stringify({ grant_type: 'client_credentials', scope: 'basic' });

  try {
    const response = await axios.post('https://oauth.fatsecret.com/connect/token', data, {
      auth: { username: CLIENT_ID, password: CLIENT_SECRET },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    console.log('🔑 Access Token:', response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    const err = error as any;
    console.error('❌ Error getting access token:', err.response?.data || err.message);
    return null;
  }
};
