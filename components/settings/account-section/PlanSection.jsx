import useAccountStore from "../../../store/settings/useAccountStore";

const PlanSection = () => {
  const {
    planName,
    planStartDate,
    contactsUsed,
    contactsTotal,
    creditsUsed,
    creditsTotal,
    upgradePlan,
  } = useAccountStore();

  const contactsPercentage = (contactsUsed / contactsTotal) * 100;
  const creditsPercentage = (creditsUsed / creditsTotal) * 100;

  return (
    <div className="bg-white rounded-lg  p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Plan</h3>

      <div className="mb-4 bg-gray-50 p-4  border border-gray-300 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              {planName}
            </span>
            <span className="text-[16px] font-medium text-gray-900">+</span>
          </div>
          <span className="text-sm text-gray-500">
            Next payment {planStartDate}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Short info about pricing plan
        </p>

        {/* Contacts Usage */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              {contactsUsed} out of {contactsTotal} contacts remaining
            </span>
            <span className="text-sm font-medium text-gray-900">
              {contactsPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-[6px]">
            <div
              className="bg-blue-600 h-[6px] rounded-full transition-all duration-300"
              style={{ width: `${contactsPercentage}%` }}
            />
          </div>
        </div>

        {/* Credits Usage */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Amio Credits</span>
            <span className="text-sm font-medium text-gray-900">
              {creditsUsed}/{creditsTotal}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-[6px]">
            <div
              className="bg-blue-600 h-[6px] rounded-full transition-all duration-300"
              style={{ width: `${creditsPercentage}%` }}
            />
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={upgradePlan}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50  transition-colors"
          >
            Upgrade Plan →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanSection;
