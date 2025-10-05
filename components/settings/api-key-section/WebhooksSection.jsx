import { GitFork } from "lucide-react"; // 👈 import added
import useApiSettingsStore from "../../../store/settings/apiSettingsStore";
import Modal from "@/components/global/Modal";
import AddWebhookModal from "./api-modals/AddWebhookModal";

const WebhooksSection = () => {
  const {
    webhooks,
    hasWebhooks,
    showAddWebhookModal,

    toggleAddWebhookModal,
  } = useApiSettingsStore();

  const getWebhookIcon = (webhook) => {
    if (webhook.icon === "shopify") {
      return (
        <div className="w-[22px] h-[23px] bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-green-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M15.54 5.16L14.55 9.59L17.41 10.14L15.54 5.16M4.16 11.31L5.16 15.74L8.03 16.29L7.03 11.86L4.16 11.31M12.73 2.94L10.87 11.8L13.73 12.35L15.6 3.49L12.73 2.94Z" />
          </svg>
        </div>
      );
    }

    return (
      <div className="w-[22px] h-[23px] bg-blue-600 rounded-full flex items-center justify-center">
        <svg
          className="w-3 h-3 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900">Webhooks</h3>
          <button
            onClick={toggleAddWebhookModal}
            className="flex items-center gap-2 text-[12px] border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-100 font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-3 h-3"
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
            Add
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Receive meeting data in real-time when something happens in Arnio.
        </p>

        {!hasWebhooks ? (
          <div className="py-6 text-center bg-white">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {/* 👇 replaced inline SVG with GitFork from lucide-react */}
              <GitFork className="w-8 h-8 text-[#4A5565]" strokeWidth={2} />
            </div>
            <h4 className="text-base font-medium text-gray-900 mb-1">
              Create your first Webhook
            </h4>
            <p className="text-sm text-gray-500">
              Webhooks send real-time data from Arnio to other
              <br />
              apps when events happen.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {webhooks.map((webhook) => (
              <div
                key={webhook.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                {getWebhookIcon(webhook)}
                <div className="flex items-center gap-[58px] flex-1">
                  <h4 className="text-[16px] font-semibold text-gray-900">
                    {webhook.name}
                  </h4>
                  <span className="text-[16px] text-gray-500">
                    {webhook.targetUrl}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Webhook Modals */}
      {showAddWebhookModal && (
        <Modal title="Create Webhook" onClose={toggleAddWebhookModal}>
          <AddWebhookModal onClose={toggleAddWebhookModal} />
        </Modal>
      )}
    </>
  );
};

export default WebhooksSection;
