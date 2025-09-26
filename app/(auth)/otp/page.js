"use client";
import Button from "@/components/global/small/Button";
import Image from "next/image";
import { useState } from "react";
import OtpInput from "react-otp-input";

const Otp = () => {
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    console.log("Entered OTP:", otp);
  };

  return (
    <section className="bg-white grid place-items-center min-h-screen p-6">
      <div className="max-w-xl p-5 md:p-6 rounded-lg bg-white shadow space-y-6">
        <Image
          src="/images/arnio-logo.png"
          alt="logo"
          width={118}
          height={48}
        />
        <div>
          <h1 className="text-xl md:text-3xl font-semibold text-gray-900">
            Two-factor authentication
          </h1>
          <p className="text-base text-gray-500 mt-2">
            Open the two-factor authentication app on your device to view your
            authentication code and verify your identity.
          </p>
        </div>
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          inputType="tel"
          renderInput={(props) => (
            <input
              {...props}
              className="!size-16 mr-6 !text-4xl !font-extrabold !text-gray-900 text-center border !border-gray-200 !rounded-lg !focus:outline-none !focus:border-primary"
            />
          )}
        />
        <Button
          onClick={handleVerify}
          text="Verify"
          height="h-[41px]"
          cn="!text-sm"
        />
        <p className="text-sm text-gray-500">
          Didn’t get code?{" "}
          <button className="text-primary underline">Resend code</button>
        </p>
      </div>
    </section>
  );
};

export default Otp;
