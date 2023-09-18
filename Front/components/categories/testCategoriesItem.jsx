import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Likes from "../likes";
import Auctions_dropdown from "../dropdown/Auctions_dropdown";
import { useDispatch, useSelector } from "react-redux";
import { buyModalShow } from "../../redux/counterSlice";
const { fetchProfileNFTData } = require('../../data/nftDataFetcher');

const testCategoriesItem = () => {
  const [userNFTs, setUserNFTs] = useState([]);
  const [filteredNFTs, setFilteredNFTs] = useState([]);
  const [localAddress, setLocalAddress] = useState('');
  const dispatch = useDispatch();
  
  useEffect(() => {
    const storedAddress = localStorage.getItem('defaultAccount');
  
    if (storedAddress) {
      setLocalAddress(storedAddress);
    }
  });

  useEffect(() => {
    // Fetch data only once when the component mounts
    fetchProfileNFTData()
      .then((data) => {
        setUserNFTs(data); // Set the fetched data in the state
      })
      .catch((error) => console.error('Error fetching and processing NFT data:', error.message));
  },[]);

  useEffect(() => {
    const filteredData = userNFTs.filter((nft) => {
      // Check if ownerName matches localAddress and price is not null
      return nft.ownerName.toLowerCase() === localAddress;
    });
    setFilteredNFTs(filteredData);
  }, [userNFTs]); // Trigger the filter when userNFTs or localAddress change

  // console.log("Data: ", userNFTs);
  // console.log("Address: ", localAddress);
  console.log("Filtered NFTs(Owned): ", filteredNFTs);

  return (
    <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
      {filteredNFTs.map((item) => {
        const {
          id,
          image,
          title,
          price,
          likes,
          creator,
          owner,
        } = item;
        
        const itemLink = image
          .split("/")
          .slice(-1)
          .toString()
          .replace(".jpg", "")
          .replace(".gif", "");
        return (
          <article key={id}>
            <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
              <figure className="relative">
                <Link href={`/item/${id}`}>
                  <Image
                    width={230}
                    height={230}
                    src={image}
                    alt="item 5"
                    className="w-full h-[230px] rounded-[0.625rem] object-cover"
                  />
                </Link>

                <Likes like={likes} />

                <div className="absolute left-3 -bottom-3">
                  <div className="flex -space-x-2">
                    <Link href={`/item/${itemLink}`}>
                      <Tippy content={<span>creator: {creator.name}</span>}>
                        <Image
                          width={21}
                          height={21}
                          src={creator.image}
                          alt="creator"
                          className="dark:border-jacarta-600 hover:border-accent dark:hover:border-accent h-6 w-6 rounded-full border-2 border-white"
                        />
                      </Tippy>
                    </Link>
                    <Link href={`/item/${itemLink}`}>
                      <Tippy content={<span>creator: {owner.name}</span>}>
                        <Image
                          width={21}
                          height={21}
                          src={owner.image}
                          alt="owner"
                          className="dark:border-jacarta-600 hover:border-accent dark:hover:border-accent h-6 w-6 rounded-full border-2 border-white"
                        />
                      </Tippy>
                    </Link>
                  </div>
                </div>
              </figure>
              <div className="mt-7 flex items-center justify-between">
                <Link href={`/item/${itemLink}`}>
                  <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                    {title}
                  </span>
                </Link>

                {/* auction dropdown  */}
                {/* <Auctions_dropdown classes="dark:hover:bg-jacarta-600 dropup hover:bg-jacarta-100 rounded-full " /> */}
              </div>
              <div className="mt-2 text-sm">
                {price !== null ?(
                  <span className="dark:text-jacarta-200 text-jacarta-700 mr-1">
                  {`${price.substring(0,5)}..${price.slice(-4)}`}
                  </span>
                ):(
                  <span className="dark:text-jacarta-200 text-jacarta-700 mr-1">
                    Not For Sale Yet
                  </span>
                )}
                {/* <span className="dark:text-jacarta-300 text-jacarta-500">
                  {bidCount}/{bidLimit}
                </span> */}
              </div>

              <div className="mt-8 flex items-center justify-between">
                {/* <button
                  className="text-accent font-display text-sm font-semibold"
                  onClick={() => dispatch(buyModalShow())}
                >
                  Buy now
                </button>
                <Link
                  href={`/item/${itemLink}`}
                  className="group flex items-center"
                >
                  <svg className="icon icon-history group-hover:fill-accent dark:fill-jacarta-200 fill-jacarta-500 mr-1 mb-[3px] h-4 w-4">
                    <use xlinkHref="/icons.svg#icon-history"></use>
                  </svg>
                  <span className="group-hover:text-accent font-display dark:text-jacarta-200 text-sm font-semibold">
                    View History
                  </span>
                </Link> */}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default testCategoriesItem;