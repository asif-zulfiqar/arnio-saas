import Image from "next/image";
import Button from "../global/small/Button";
import Link from "next/link";
import useAuthStore from "@/store/auth/authStore";
import useOnboardingStore from "@/store/onboarding/onboardingStore";

const ActivatePhoneLine = ({ onClose }) => {
  const { updateOnboardingStatus } = useAuthStore();
  const { startOnboarding } = useOnboardingStore();

  const handleKeepExploring = async () => {
    try {
      // Call onboarding API to set isOnboarded: true
      await updateOnboardingStatus(true);
      
      // Close welcome screen
      onClose(false);
      
      // Wait 3 seconds then show onboarding steps
      setTimeout(() => {
        console.log("Starting onboarding steps after welcome screen");
        startOnboarding();
      }, 3000); // 3 seconds delay
      
    } catch (error) {
      console.error("Failed to update onboarding status:", error);
      // Close welcome screen anyway
      onClose(false);
    }
  };

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
          This can take a few minutes. We’ll text or email you when it’s ready.
          In the meantime, keep exploring Arnio.
        </p>
        <p className="text-base font-medium text-gray-900">
          Things you can do right now:
        </p>
        <ul className="space-y-2 text-base font-medium text-primary list-disc list-inside pl-2">
          <Link href="/campaigns" onClick={() => onClose(false)}>
            <li>Launch your first automated campaign</li>
          </Link>
          <Link href="/settings" onClick={() => onClose(false)}>
            <li>Open Settings</li>
          </Link>
          <Link href="/analytics" onClick={() => onClose(false)}>
            <li>Browse the Analytics dashboard</li>
          </Link>
          <Link href="https://docs.arnio.co/" target="_blank" rel="noreferrer">
            <li>Explore Arnio articles</li>
          </Link>
        </ul>
      </div>
      <div className="flex justify-center">
        <Button
          text="Keep exploring"
          width="w-[124px]"
          onClick={handleKeepExploring}
        />
      </div>
    </div>
  );
};

export default ActivatePhoneLine;
