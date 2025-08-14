import Input from "../global/small/Input";

const AddContact = () => {
  return (
    <form className="space-y-5">
      <Input label="Name" placeholder="e.g. Jane Doe" />
      <Input label="Phone Number" placeholder="e.g. +1 123 456 7890" />
    </form>
  );
};

export default AddContact;
