import Image from "next/image";
import Button from "../global/small/Button";

const StartTrial = ({ setStep }) => {
  return (
    <div className="space-y-7">
      <Image
        src="/images/logo-icon.png"
        width={37}
        height={40}
        alt="logo-icon"
        className="mx-auto"
      />
      <div className="space-y-5">
        <h4 className="text-xl font-bold text-gray-900 text-center">
          Welcome to Arnio Beta
        </h4>
        <p className="text-gray-500 text-base text-center max-w-[477px] mx-auto">
          You’re early! Enjoy 30 days of full access to Arnio built to help
          brands like yours turn iMessage conversations into repeat sales.
        </p>
        <div className="text-gray-500 text-base text-center max-w-[500px]">
          See how real, two-way chats boost retention, educate customers, and
          build loyalty.
        </div>
        <div className="text-gray-500 text-base text-center max-w-[500px]">
          Your feedback will help shape the next generation of iMessage
          marketing.
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          text="Start trial"
          width="w-[124px]"
          onClick={() => setStep(2)}
        />
      </div>
    </div>
  );
};

export default StartTrial;
