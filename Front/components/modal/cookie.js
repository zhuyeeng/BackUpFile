// cookie.js

import Cookies from 'js-cookie';

export const setProfileImageCookie = (imageUrl) => {
  Cookies.set('selectedProfileImage', imageUrl, { expires: 365 }); // Store the selected profile image for 1 year (adjust as needed)
};

export const getProfileImageCookie = () => {
  return Cookies.get('selectedProfileImage') || '/images/avatars/default.jpg'; // Return the default image if the cookie is not set
};