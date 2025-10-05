import Image from "next/image";

const StartTrail = ({ setStep }) => {
  return (
    <div className="space-y-7">
      <Image
        src="/images/logo-icon.png"
        width={37}
        height={40}
        alt="logo-icon"
      />
      <div className="space-y-5">
        <h4 className="text-xl font-bold text-gray-900 text-center">
          Welcome to Arnio Pro
        </h4>
        <p className="text-gray-500 text-base text-center">
          You’re on a free 7-day trial of Pro. Explore every feature and see
          what fits your team.
        </p>
        <div className="text-gray-500 text-base text-center">
          When the trial ends, continue with Pro or switch to Starter.
        </div>
      </div>
    </div>
  );
};

export default StartTrail;
