import Dropdown from "../global/small/Dropdown";

const options = [
  { value: "17865617760", option: "+1 786 561 7760" },
  { value: "2345452342", option: "1 234 545 2342" },
];

const SentFrom = () => {
  const handleSelect = (value) => {
    console.log("Selected option:", value);
  };

  return (
    <div className="mt-8">
      <h6 className="font-medium text-xs text-gray-500 mb-1">Sent From</h6>
      <Dropdown
        initialValue={options[0]}
        options={options}
        onSelect={handleSelect}
        width="140px"
        bgColor="bg-transparent"
        border="border-transparent"
        color="text-gray-900"
        cn="!mt-0 !px-0"
      />
    </div>
  );
};

export default SentFrom;
