import Authentication from './Authentication';

export default function (error) {
  // let errMsg = '';
  if (error.response) {
    if (error.response.status === 401 || error.response.status === 503) {
      Authentication.removeAuthKey();
      window.location.href = '#/authentication/sign-in';
      // return;
    }
    if (error.response.status === 404) {
      // Authentication.removeAuthKey();
      // window.location.href = '/forbiden';
      // return;
    }
    // errMsg = error.response.data;
  } else if (error.request) {
    // errMsg = error.request;
  } else {
    // errMsg = 'Something\'s wrong!';
  }
  // toast.error(errMsg, {
  //   position: toast.POSITION.TOP_RIGHT,
  // });
}
