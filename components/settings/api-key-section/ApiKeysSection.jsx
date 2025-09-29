import useApiSettingsStore from "../../../store/settings/apiSettingsStore";
import Modal from "@/components/global/Modal";
import AddApiKeyModal from "./api-modals/AddApiKeyModal";
import EditApiKeyModal from "./api-modals/EditApiKeyModal";
import ApiKeySuccessModal from "./api-modals/ApiKeySuccessModal";

const ApiKeysSection = () => {
  const {
    apiKeys,
    hasApiKeys,
    showAddApiKeyModal,
    showEditApiKeyModal,
    showApiKeySuccessModal,
    toggleAddApiKeyModal,
    toggleEditApiKeyModal,
    toggleApiKeySuccessModal,
  } = useApiSettingsStore();

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900">API Keys</h3>
          <button
            onClick={toggleAddApiKeyModal}
            className="flex items-center gap-2 text-sm border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Api Key
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          API keys allow you to make API calls for your own account.
        </p>

        {!hasApiKeys ? (
          <div className="py-12 text-center bg-white ">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <h4 className="text-base font-medium text-gray-900 mb-1">
              Create your first API key
            </h4>
            <p className="text-sm text-gray-500">
              API keys allow other apps to communicate with Arnio
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors "
              >
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {apiKey.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Expires {apiKey.expirationDate}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-2 py-1 bg-emerald-100 text-green-700 text-xs font-medium rounded-md">
                    {apiKey.status}
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => toggleEditApiKeyModal(apiKey)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 transform rotate-90"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddApiKeyModal && (
        <Modal title="Create an API Key" onClose={toggleAddApiKeyModal}>
          <AddApiKeyModal onClose={toggleAddApiKeyModal} />
        </Modal>
      )}

      {showEditApiKeyModal && (
        <Modal title="Edit API Key" onClose={toggleEditApiKeyModal}>
          <EditApiKeyModal onClose={toggleEditApiKeyModal} />
        </Modal>
      )}

      {showApiKeySuccessModal && (
        <Modal title="API Key Created" onClose={toggleApiKeySuccessModal}>
          <ApiKeySuccessModal onClose={toggleApiKeySuccessModal} />
        </Modal>
      )}
    </>
  );
};

export default ApiKeysSection;
