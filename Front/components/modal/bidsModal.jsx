import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { bidsModalHide } from "../../redux/counterSlice";
import { ethers } from 'ethers';
import { useWallet } from "../../context/walletContext";
import { nftContractAddress } from '../../config/setting';
import nftBuySell from '../../data/abi/nftMintAbi.json';

const BidsModal = () => {
  const { account, balance } = useWallet();
  const [localBalance, setLocalBalance] = useState('');
  const [isWalletInitialized, setIsWalletInitialized] = useState(false);
  const { bidsModal } = useSelector((state) => state.counter);
  const dispatch = useDispatch();
  const pid = useSelector(state => state.counter.pid);
  const [payAmount, setPayAmount] = useState("");
  const [contract, setContract] = useState(null);
  const [ethToUsdRate, setEthToUsdRate] = useState(0);
  
  useEffect(() => {
    const storedBalance = localStorage.getItem('accountBalance');
    if (storedBalance) {
      setLocalBalance(storedBalance);
    }

    if(pid?.price !== null){
      const oriPrice = pid?.price;
      setPayAmount(oriPrice);
    }

    if (window.ethereum && account) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(nftContractAddress, nftBuySell, signer);
      setContract(nftContract);
      setIsWalletInitialized(true);
    } else {
      console.error('MetaMask extension not found or account not connected.');
    }
  }, [account,pid]);

  useEffect(() => {
    
    async function fetchEthToUsdRate() {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await response.json();
  
        if (data.ethereum && data.ethereum.usd) {
          setEthToUsdRate(data.ethereum.usd);
        } else {
          console.error("Unable to fetch exchange rate data.");
        }
      } catch (error) {
        console.error("An error occurred while fetching exchange rate data.");
      }
    }
  
    // Call the fetchEthToUsdRate function to fetch and update the exchange rate.
    fetchEthToUsdRate();
  }, [])

  const buyNFT = async () => {
    try {
      const tokenId = pid.pid; // Replace with the selected token ID
      const price = payAmount; // Replace with the selected price
  
      // Convert the price to Wei (if not already)
      const priceInWei = ethers.utils.parseEther(price.toString());
      console.log("priceInWei:", priceInWei.toString());

      console.log("After: ", priceInWei);
  
      // Call the buyNFT function from your smart contract
      const tx = await contract.buyNFT(tokenId, {
        value: priceInWei,
      });
  
      // Wait for the transaction to be confirmed
      await tx.wait();
  
      // Transaction successful, you can update the UI or show a success message
      console.log("NFT purchased successfully!");
    } catch (error) {
      console.error("Error buying NFT:", error);
    }
  };

  return (
    <div>
      <div className={bidsModal ? "modal fade show block" : "modal fade"}>
        <div className="modal-dialog max-w-2xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="placeBidLabel">
                Buy NFT
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => dispatch(bidsModalHide())}
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
              <div className="mb-2 flex items-center justify-between">
                <span className="font-display text-jacarta-700 text-sm font-semibold dark:text-white">
                  Price
                </span>
              </div>

              <div className="dark:border-jacarta-600 border-jacarta-100 relative mb-2 flex items-center overflow-hidden rounded-lg border">
                <div className="border-jacarta-100 bg-jacarta-50 flex flex-1 items-center self-stretch border-r px-2">
                  <span>
                    <svg className="icon icon-ETH mr-1 h-5 w-5">
                      <use xlinkHref="/icons.svg#icon-ETH"></use>
                    </svg>
                  </span>
                  <span className="font-display text-jacarta-700 text-sm">
                    ETH
                  </span>
                </div>

                <input
                  type="number"
                  className="focus:ring-accent h-12 w-full flex-[3] border-0 focus:ring-inse dark:text-jacarta-700"
                  placeholder={pid?.price || ''}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                />

                <div className="bg-jacarta-50 border-jacarta-100 flex flex-1 justify-end self-stretch border-l dark:text-jacarta-700">
                    <span className="self-center px-2 text-sm">
                      ${(payAmount * ethToUsdRate).toFixed(2)}
                    </span>
                  </div>
              </div>

              <div className="text-right">
                <span className="dark:text-jacarta-400 text-sm">
                  Balance: {`${localBalance}`} WETH
                </span>
              </div>

              {/* <!-- Terms --> */}
              {/* <div className="mt-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="checked:bg-accent dark:bg-jacarta-600 text-accent border-jacarta-200 focus:ring-accent/20 dark:border-jacarta-500 h-5 w-5 self-start rounded focus:ring-offset-0"
                />
                <label
                  htmlFor="terms"
                  className="dark:text-jacarta-200 text-sm"
                >
                  By checking this box, I agree to {"Xhibiter's"}{" "}
                  <a href="#" className="text-accent">
                    Terms of Service
                  </a>
                </label>
              </div> */}
            </div>
            {/* <!-- end body --> */}

            <div className="modal-footer">
              <div className="flex items-center justify-center space-x-4">
                <button
                  type="button"
                  className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                  onClick={buyNFT}
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidsModal;