import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import MainButton from "./Buttons";
import { toast } from "react-hot-toast";
import { Button } from "@headlessui/react";
const coffeeAmount = 100_000; // 0.04 ICP in e8s
// ICP=
// 1,000,000,000,000 cycles per ICP
// 100,000,000 cycles
// ​
//  =0.0001 ICP
const NftPayment = ({ img, toggleModal, name, handlecreate }) => {
  const [message, setMessage] = useState("Make Payment");
  const [disabled, setDisabled] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.target.disabled = true;
    setLoading(true);

    try {
      const hasAllowed = await window.ic?.plug?.requestConnect();
      if (hasAllowed) {
        setMessage("Plug wallet is connected");

        const requestTransferArg = {
          to: "7yywi-leri6-n33rr-vskr6-yb4nd-dvj6j-xg2b4-reiw6-dljs7-slclz-2ae", // Replace with actual principal address
          amount: coffeeAmount,
        };
        const transfer = await window.ic?.plug?.requestTransfer(
          requestTransferArg
        );
        console.log("Transfer details:", transfer.height.height);

        if (transfer?.height && typeof transfer.height.height === "number") {
          setMessage(`Transferred ${coffeeAmount} e8s`);
          setPaymentStatus("Payment successful");
          toast.success("Payment successful!");

          handlecreate();
          toggleModal();
        } else if (transfer.height === null || transfer.height === undefined) {
          setMessage("Transfer is pending...");
          toast.loading("Payment pending...");
        } else {
          setMessage("Payment failed");
          toast.error("Payment failed!");
        }
      } else {
        setMessage("Plug wallet connection was refused");
        toast.error("Connection refused by Plug wallet");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage("Payment failed due to an error");
      toast.error("An error occurred during the payment process");
    } finally {
      setLoading(false);
      setTimeout(() => {
        e.target.disabled = false;
        setMessage("Make Payment");
      }, 5000);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white max-w-lg w-96 mx-4 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Payment Details</h2>
          <RxCross2 className="cursor-pointer text-xl" onClick={toggleModal} />
        </div>
        <div className="mb-6 flex flex-col justify-center items-center">
          <p className="text-xl text-black py-4">Token Name: {name}</p>
          <img src={img} className="w-32" alt="Collection Image" />
        </div>

        <div className="flex justify-between items-center">
          <div className=" flex  items-center mt-4 rounded-md  px-4 py-2">
            <p className="font-bold">Price: 0.001 ICP</p>
          </div>
          <Button
            className="border  bg-[#5542F6] text-white  flex font-semibold gap-2 px-4 py-2 rounded-md mt-4 "
            onClick={handlePayment}
            disabled={disabled || loading}
          >
            {loading ? "Processing..." : message}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NftPayment;
