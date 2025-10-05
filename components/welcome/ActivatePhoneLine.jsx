import Image from "next/image";
import Button from "../global/small/Button";

const ActivatePhoneLine = ({ onClose }) => {
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
          Activating your phone line…
        </h4>
        <p className="text-gray-500 text-base text-center max-w-[477px]">
          This can take up to 1 hour. We’ll text or email you when it’s ready.
          In the meantime, keep exploring Arnio.
        </p>
        <p className="text-base font-medium text-gray-900">
          Things you can do right now:
        </p>
        <ul className="space-y-2 text-base font-medium text-primary list-disc list-inside pl-2">
          <li className="">Set up an automation sequence</li>
          <li>Open Settings</li>
          <li>Browse the Analytics dashboard</li>
          <li>Explore Arnio articles</li>
        </ul>
      </div>
      <div className="flex justify-center">
        <Button
          text="Keep exploring"
          width="w-[124px]"
          onClick={() => onClose(false)}
        />
      </div>
    </div>
  );
};

export default ActivatePhoneLine;
