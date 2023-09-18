// cookie.js

import Cookies from 'js-cookie';

// Function to set the profile information in a cookie as a delimited string
export const setProfileInfoCookie = (address, imageUrl) => {
  const profileInfo = `${address}:${imageUrl}`;
  Cookies.set('profileInfo', profileInfo, { expires: 365 });
};

// Function to get the profile information from the cookie and split it
export const getProfileInfoCookie = () => {
  const profileInfo = Cookies.get('profileInfo');
  if (profileInfo) {
    const [address, imageUrl] = profileInfo.split(':');
    return { address, imageUrl };
  }
  return { address: '', imageUrl: '/images/avatars/default.jpg' };
};
