import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./connect/useClient";
import { RxCross2 } from "react-icons/rx";
import { useLocation } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import WalletModal2 from "./common/WalletModel2";
import bgmain1 from "./assets/img/mainbg1.png";
import bgmain2 from "./assets/img/mainbg2.png";
import { MdArrowOutward } from "react-icons/md";
import { InfinitySpin } from "react-loader-spinner";
import Confetti from "react-confetti";
import { createActor } from "../../declarations/extv2";

const LinkClaiming = () => {
  const navigate = useNavigate();
  const {
    identity,
    backend,
    principal,
    connectWallet,
    disconnect,
    isConnected,
  } = useAuth();

  const [deposits, setDeposits] = useState([]);
  const width = window.innerWidth || 300;
  const height = window.innerHeight || 200;
  const [celebrate, setCelebrate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [principalText, setPrincipalText] = useState("connect wallet");
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const canisterId = pathParts[2];
  const nftIndex = pathParts[3];
  const [allnft, setAllNFt] = useState([]);
  const [storednft, setstorednft] = useState([]);
  const nft = createActor(canisterId, {
    agentOptions: { identity, verifyQuerySignatures: false },
  });

  console.log("nft", nft);
  useEffect(() => {
    console.log("Canister ID:", canisterId);
    console.log("NFT Index:", nftIndex);
  }, [canisterId, nftIndex]);
  useEffect(() => {
    if (isConnected && principal) {
      setPrincipalText(principal.toText());
    } else {
      setPrincipalText("connect wallet");
    }
  }, [isConnected, principal]);

  useEffect(() => {
    const canister = Principal.fromText(canisterId);
    const getDeposits = async () => {
      try {
        const detail = await backend.getAlldepositItemsMap();
        const data = await nft.getAllNonFungibleTokenData();
        const stored = await backend.getStoredTokens(canister);

        setDeposits(detail);
        setAllNFt(data);
        setstorednft(stored);
        console.log("Deposits:", detail);
        console.log("all nfts:", data);
        console.log("stored:", stored);
      } catch (error) {
        console.log("Error fetching deposits:", error);
      } finally {
        setLoadingData(false);
      }
    };
    getDeposits();
  }, [backend]);
  const handleClaim = async () => {
    if (!isConnected) {
      setShowModal(true);
      return;
    }

    setLoading(true);
    try {
      const canister = Principal.fromText(canisterId);
      const res = await backend.claim(canister, Number(nftIndex));
      console.log("Response of claim:", res);
      if (res.ok == 0) {
        toast.success("NFT claimed successfully!");
        setCelebrate(true);
        setTimeout(() => {
          setCelebrate(false);
          navigate("/");
        }, 9000);
      } else {
        toast.error("Failed to claim the NFT.");
      }
    } catch (error) {
      console.error("Error claiming NFT:", error);
      toast.error("Error claiming NFT.");
    } finally {
      setLoading(false);
    }
  };

  const renderNftDetails = () => {
    if (loadingData) {
      return (
        <div className="my-auto flex justify-center items-start mt-16 text-3xl text-gray-300 animate-pulse">
          <InfinitySpin
            visible={true}
            width="200"
            color="#564BF1"
            ariaLabel="infinity-spin-loading"
            className="flex justify-center "
          />
        </div>
      );
    }

    const matchedDeposit = deposits.find(
      (deposit) =>
        deposit[1].collectionCanister?.toText() === canisterId &&
        deposit[0] == nftIndex
    );
    console.log("matched", matchedDeposit);
    if (!matchedDeposit) {
      return (
        <div className="my-auto mt-16 text-xl text-center text-red-500">
          No matching NFT found.
        </div>
      );
    }

    return (
      <motion.div
        key={matchedDeposit[1]?.tokenId}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="bg-white px-4 py-4 mt-8 rounded-xl cursor-pointer"
      >
        {matchedDeposit[1].claimPattern == "transfer"
          ? allnft.map((nft, index) =>
              nft[0] == matchedDeposit[1]?.tokenId ? (
                <div className="flex flex-col justify-center items-center">
                  {" "}
                  <img
                    width="200px"
                    height="200px"
                    src={nft?.[2]?.nonfungible?.thumbnail}
                    alt="NFT Thumbnail"
                    className="flex items-center justify-center "
                  />
                  <h2 className="text-xl black font-bold mt-5">
                    {nft?.[2]?.nonfungible?.name}
                  </h2>
                </div>
              ) : null
            )
          : storednft[0]?.map((nft, index) =>
              nft[0] == matchedDeposit[1]?.tokenId ? (
                <div className="flex flex-col justify-center items-center">
                  {" "}
                  <img
                    width="200px"
                    height="200px"
                    src={nft?.[1]?.nonfungible?.thumbnail}
                    alt="NFT Thumbnail"
                    className="flex items-center justify-center "
                  />
                  <h2 className="text-xl black font-bold mt-5">
                    {nft?.[1]?.nonfungible?.name}
                  </h2>
                </div>
              ) : null
            )}

        <p className="text-xs gray mt-1">
          <p className="text-xs gray mt-1">
            {new Date(
              Number(matchedDeposit[1]?.timestamp) / 1e6
            ).toLocaleString()}
          </p>
        </p>
        <div className="border border-gray-200 my-4 w-full"></div>
        <div className="w-full">
          <div className="flex justify-between mt-2">
            <p className="text-xs gray">Token ID</p>
            <p className="text-xs font-semibold">
              {matchedDeposit[1]?.tokenId}
            </p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-xs gray">Claim Pattern</p>
            <p className="text-xs font-semibold">
              {matchedDeposit[1]?.claimPattern}
            </p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-xs gray">Status</p>
            <p className="text-xs font-semibold">{matchedDeposit[1]?.status}</p>
          </div>
        </div>
        <div className="border border-gray-200 my-4"></div>
      </motion.div>
    );
  };

  return (
    <div className="flex mt-10 w-full justify-center bg-transparent">
      <div
        className="absolute inset-0 bg-black opacity-10 z-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        }}
      ></div>
      <div className="h-screen overflow-hidden z-10">
        <img
          src={bgmain1}
          alt=""
          className="transition-transform duration-300  z-20 h-[90vh] transform hover:scale-105 ease-in"
        />
      </div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { ease: "easeInOut", duration: 0.4 },
        }}
        className="filter-card  rounded-xl w-full"
      >
        <div className="flex flex-col w-[400px] justify-center mx-auto">
          <div className="text-4xl mb-8 font-quicksand tracking-wide text-[#2E2C34] flex items-center">
            claimlink
            <MdArrowOutward className="bg-[#3B00B9] rounded text-white ml-2" />
          </div>
          <div className="flex justify-between gap-4">
            <h1 className="text-xl font-medium">Claim Your NFT</h1>
          </div>
          {renderNftDetails()}
          {deposits.length > 0 && !loadingData ? (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleClaim}
                disabled={loading}
                className={`button px-4 z-20 py-2 rounded-md text-white ${
                  loading ? "bg-gray-500" : "bg-[#564BF1]"
                }`}
              >
                {loading ? "Claiming..." : "Claim NFT"}
              </button>
            </div>
          ) : null}
        </div>
      </motion.div>
      <div className="h-screen overflow-hidden z-10">
        <img
          src={bgmain2}
          alt=""
          className="transition-transform h-[90vh] z-20 duration-300 transform hover:scale-105 ease-in"
        />
      </div>
      <WalletModal2 isOpen={showModal} onClose={() => setShowModal(false)} />
      {celebrate ? (
        <Confetti className="z-20" width={width} height={height} />
      ) : null}
    </div>
  );
};

export default LinkClaiming;
