import { formatPhoneNumber } from "@/utils/utils";
import Button from "../global/small/Button";

const DuplicatePhone = ({
  duplicateContact,
  onClose,
  setActiveConversation,
}) => {
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-600">
        A contact with phone{" "}
        <b>{formatPhoneNumber(duplicateContact.phoneNumber)}</b> already exists.
      </p>
      <div className="flex justify-end gap-3">
        <Button
          onClick={onClose}
          text="Cancel"
          width="64px"
          color="text-gray-900"
          bgColor="bg-white"
          cn="border border-gray-200"
        />
        <Button
          text="View Conversation"
          onClick={() => {
            setActiveConversation(duplicateContact.id);
            onClose();
          }}
        />
      </div>
    </div>
  );
};

export default DuplicatePhone;
