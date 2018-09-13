import moment from 'moment';

const titles = {
  '#/account/dashboard': 'My Dashboard',
  '#/account/revenue': 'Revenue',
  '#/account/product-management/': 'Product Management',
  '#/account/new-assets': 'New Assets',
  '#/account/view-assets/': 'View Asset',
  '#/authentication/sign-in': 'Sign In',
  '#/authentication/sign-up': 'Sign Up',
  '#/authentication/change-password': 'Change Password',
  '#/account/my-profile': 'My Profile',
  '#/account/transactions': 'My Transactions',
  '#/store/view-member': 'View Member',
  '#/account/message-box/': 'Messages',
  '#/store/offers/': 'Offers',
  '#/store/product-detail/': 'Offer detail',
};

const filterHeadConfig = {
  '#/account/product-management/': true,
};

const breadCategoryPrefix = {
  '#/account/product-management/': '/account/product-management/',
};

const Common = {
  getBaseHash(hash) {
    // Remove last param
    const slashIndex = hash.lastIndexOf('/') + 1;
    return hash.substring(0, slashIndex);
  },

  setTitle(hash) {
    const baseHash = this.getBaseHash(hash);

    document.title = titles[hash] || titles[baseHash];
  },

  formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
  },

  formatDate(timestamp) {
    return moment(timestamp * 1000).format('DD/MM/YYYY HH:mm:ss');
  },

  shouldShowFilterHead(hash) {
    const baseHash = this.getBaseHash(hash);
    return !!(filterHeadConfig[hash] || filterHeadConfig[baseHash]);
  },

  getCategoryPrefix(hash) {
    const baseHash = this.getBaseHash(hash);
    return breadCategoryPrefix[hash] || breadCategoryPrefix[baseHash] || '/store/offers/';
  },

  getActivityDetailLink(type, entryId) {
    let link = '';
    switch (type) {
      case 'CREATE_NEW_ITEM':
        link = `/account/view-assets/${entryId}`;
        break;
      case 'REGISTER_ITEM':
        link = `/store/product-detail/${entryId}`;
        break;
      default:
        link = `/store/product-detail/${entryId}`;
    }

    return link;
  },

  shortenString(text, maxLength) {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  },
};

export default Common;
