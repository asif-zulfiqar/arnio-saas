// Parent Component
import ApiKeysSection from "./ApiKeysSection";
import WebhooksSection from "./WebhooksSection";
const ApiSettingsPage = () => {
  return (
    <div className="space-y-8">
      <ApiKeysSection />
      <WebhooksSection />
    </div>
  );
};
export default ApiSettingsPage;