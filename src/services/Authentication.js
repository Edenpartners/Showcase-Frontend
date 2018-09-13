import decode from 'jwt-decode';
import { ENV } from '../config';

const storeKey = `e1.showcase.authorization.${ENV}`;

const Authentication = {
  storeAuthKey(key) {
    localStorage.setItem(storeKey, key);
  },

  removeAuthKey() {
    localStorage.removeItem(storeKey);
  },

  getAuthKey() {
    return localStorage.getItem(storeKey);
  },

  getTokenExpirationDate(encodedToken) {
    const token = decode(encodedToken, { header: true });
    if (!token.exp) { return null; }

    const date = new Date(0);
    date.setUTCSeconds(token.exp);

    return date;
  },

  isTokenExpired(token) {
    const expirationDate = this.getTokenExpirationDate(token);
    return expirationDate < new Date();
  },

  isAuthenticated() {
    const idToken = this.getAuthKey();
    return !!idToken && !this.isTokenExpired(idToken);
  },

  /**
   * Parses the authToken to return the logged in user's public key
   */
  getPublicKey() {
    const token = this.getAuthKey();
    if (!token) return null;

    const content = window.atob(token.split('.')[1]);
    return JSON.parse(content).public_key;
  },

  /**
   * Get asset quantities from account
   * @param account
   * @returns {{asset: *, quantity?: *}|{}}
   */
  getAssetQuantities(account) {
    return account.holdings
      .reduce((quantities, { asset, quantity }) => {
        const qties = quantities;
        if (!qties[asset]) qties[asset] = quantity
        else qties[asset] = Math.max(qties[asset], quantity)
        return qties;
      }, {});
  },
};

export default Authentication;
