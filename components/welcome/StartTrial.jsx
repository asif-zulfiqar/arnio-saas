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
          Welcome to Arnio Pro
        </h4>
        <p className="text-gray-500 text-base text-center max-w-[477px]">
          You’re on a free 7-day trial of Pro. Explore every feature and see
          what fits your team.
        </p>
        <div className="text-gray-500 text-base text-center max-w-[536px]">
          When the trial ends, continue with Pro or switch to Starter.
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          text="Start Trial"
          width="w-[124px]"
          onClick={() => setStep(2)}
        />
      </div>
    </div>
  );
};

export default StartTrial;
