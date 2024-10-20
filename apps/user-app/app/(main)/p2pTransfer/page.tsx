"use client";
import { Button } from "@repo/ui/button";
import { TextInput } from "@repo/ui/text-input";
import React, { useState } from "react";
import { p2pTransfer } from "../../actions/p2pTransfer";
import toast from "react-hot-toast";

const page = () => {
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  function handleAmountChange(value: string) {
    setAmount(value);
  }
  function handlephoneNumberChange(value: string) {
    setPhoneNumber(value);
  }
  async function handleSubmit() {
    const transactionStatus = await p2pTransfer({
      amount: Number(amount),
      phoneNumber,
    });
    if (transactionStatus?.status === 200) {
      toast.success(transactionStatus.message);
    } else toast.error(transactionStatus?.message as string);
    setAmount("");
    setPhoneNumber("");
  }
  console.log(amount);
  return (
    <div className=" flex justify-center items-center w-full ">
      <div className="rounded-md     flex flex-col gapy-4 p-8 border">
        <TextInput
          label="Phone Number"
          onChange={handlephoneNumberChange}
          placeholder="Phone number"
          value={phoneNumber}
        />
        <TextInput
          label="Amount in Rs."
          onChange={handleAmountChange}
          placeholder="Amount"
          value={amount}
          type="number"
        />
        <div className="mt-4 w-full flex justify-center">
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default page;
