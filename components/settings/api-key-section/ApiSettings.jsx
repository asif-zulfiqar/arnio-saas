// Parent Component
import ApiKeysSection from "./ApiKeysSection";
import WebhooksSection from "./WebhooksSection";
const ApiSettingsPage = () => {
  return (
    <div className="space-y-0">
      <ApiKeysSection />
      <WebhooksSection />
    </div>
  );
};
export default ApiSettingsPage;
