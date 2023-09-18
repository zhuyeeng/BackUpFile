import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { profileModalHide } from "../../redux/counterSlice";
import { ethers } from 'ethers';
import { nftContractAddress } from '../../config/setting';
import { fetchProfileImage } from "../../data/nftDataFetcher";
import { setSelectedProfileImage } from "../../redux/counterSlice";
import { setProfileInfoCookie, getProfileInfoCookie } from './cookie.js';

const ProfileModal = () => {
  const { profileModal } = useSelector((state) => state.counter);
  const [NFTImage, setNFTImage] = useState([]);
  const [localAddress, setLocalAddress] = useState('');
  const [selectedProfileImage, setSelectedProfileImage] = useState("/images/avatars/default.jpg"); // Initialize with the default image
  const dispatch = useDispatch();

  // const handleImageClick = (imageUrl) => {
  //   setSelectedProfileImage(imageUrl);

  //   // Save the selected image URL in local storage
  //   // localStorage.setItem('selectedProfileImage', imageUrl);

  //   // Save the selected image URL in both state and cookie
  //   localStorage.setItem('selectedProfileImage', imageUrl);
  //   setProfileImageCookie(imageUrl); // Save the selected image URL in a cookie
  // };

  const handleImageClick = (imageUrl) => {
    setSelectedProfileImage(imageUrl);
  
    // Assume 'localAddress' contains the user's Ethereum address
    setProfileInfoCookie(localAddress, imageUrl); // Store both address and image URL
  };

  // useEffect(() => {
  //   // Detect if the user is connected to their wallet here
  //   // For this example, let's assume the user is connected
  //   const userIsConnected = true;

  //   if (userIsConnected) {
  //     // Retrieve the profile image from the cookie
  //     const storedProfileImage = getProfileImageCookie();

  //     // Update the profile image in the state
  //     setSelectedProfileImage(storedProfileImage);
  //   }
  // }, []);

  useEffect(() => {
    // Detect if the user is connected to their wallet here
    // For this example, let's assume the user is connected
    const userIsConnected = true;
  
    if (userIsConnected) {
      // Retrieve the profile information from the cookie
      const { address, imageUrl } = getProfileInfoCookie();
  
      // Update the profile image and address in the state
      setSelectedProfileImage(imageUrl);
      setLocalAddress(address);
    }
  }, []);

  useEffect(() => {
    const storedAddress = localStorage.getItem('defaultAccount');
  
    if (storedAddress) {
      setLocalAddress(storedAddress);
    }
  },[]);

  useEffect(() => {
    fetchProfileImage()
      .then((data) => {
        const ownedNFT = data.filter(item => item.ownerName.toLowerCase() === localAddress);
        setNFTImage(ownedNFT);
      })
      .catch((error) => console.error("Error Message: ", error.message));
  }, [localAddress]);

  // console.log(NFTImage);

  return (
    <div>
      <div className={profileModal ? "modal fade show block" : "modal fade"}>
        <div className="modal-dialog max-w-2xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="placeBidLabel">
                Profile Picture
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => dispatch(profileModalHide())}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="fill-jacarta-700 h-6 w-6 dark:fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
                </svg>
              </button>
            </div>

            {/* <!-- Body --> */}
            <div className="modal-body p-6">
              <div className="flex">
                <div className="mr-4"> {/* Add margin for spacing */}
                  <Image 
                    onClick={() => handleImageClick("/images/avatars/default.jpg")}
                    width={230}
                    height={230}
                    src="/images/avatars/default.jpg"
                    alt="Default Profile Image"
                  />
                </div>
                {NFTImage.map((item, index) => (
                  <div key={index} className="mr-4"> {/* Add margin for spacing */}
                    <Image
                      onClick={() => handleImageClick(item.image)}
                      width={230}
                      height={230}
                      src={item.image}
                      alt="NFT Image"
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* <!-- end body --> */}

            <div className="modal-footer">
              <div className="flex items-center justify-center space-x-4">
                <button>
                  Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
