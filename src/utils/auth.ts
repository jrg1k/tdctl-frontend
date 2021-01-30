import { accessTokenKey, refreshTokenKey } from 'constants/apiConstants';
import { TokenPair } from 'models/apiModels';
import { authenticate, getMemberAssociatedWithToken } from './api';

const getTokens = (): TokenPair => {
  const accessToken = sessionStorage.getItem(accessTokenKey) || '';
  const refreshToken = sessionStorage.getItem(refreshTokenKey) || '';
  return { accessToken, refreshToken };
};
const setTokens = (accessToken: string, refreshToken: string) => {
  sessionStorage.setItem(accessTokenKey, accessToken);
  sessionStorage.setItem(refreshTokenKey, refreshToken);
};

const login = async (email: string, password: string) =>
  authenticate(email, password).then((tokens) =>
    setTokens(tokens.accessToken, tokens.refreshToken)
  );
/* Deeply checks if user is authenticated by 
   performing a query to the API */
const verifyAuthentication = async () => {
  const tokens = getTokens();
  if (tokens.accessToken === '' || tokens.refreshToken === '') {
    return false;
  }
  try {
    await getMemberAssociatedWithToken();
    return true;
  } catch {
    return false;
  }
};

export { login, setTokens, getTokens, verifyAuthentication };