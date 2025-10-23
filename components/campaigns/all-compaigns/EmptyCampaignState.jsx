import Image from "next/image";

const EmptyCampaignState = ({ isCreditsEmpty = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Image
          src="/svgs/campaigns/megaphone.svg"
          alt=""
          width={32}
          height={32}
          className="text-gray-400"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No campaigns yet
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-md">
        Create your first campaign to reach out to your customers and track
        results here.
      </p>
    </div>
  );
};

export default EmptyCampaignState;
