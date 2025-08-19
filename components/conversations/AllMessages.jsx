import Dropdown from "../global/small/Dropdown";

const options = [
  { value: "all", option: "All Messages" },
  { value: "unread", option: "Unread" },
  { value: "pinned", option: "Pinned" },
];

const AllMessages = () => {
  const handleSelect = (value) => {
    console.log("Selected option:", value);
  };
  return (
    <Dropdown
      defaultText="All Messages"
      options={options}
      onSelect={handleSelect}
      width="140px"
      bgColor="bg-transparent"
      border="border-transparent"
      color="text-gray-900"
      cn="!mt-0 !px-0"
    />
  );
};

export default AllMessages;
