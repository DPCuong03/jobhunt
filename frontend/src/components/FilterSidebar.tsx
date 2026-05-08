const FilterSidebar = () => {
  const filterGroups = [
    { label: "Company Name", type: "text", placeholder: "Company Name..." },
    {
      label: "Company Industry",
      type: "select",
      options: ["IT Company", "Real Estate", "Finance"],
    },
    {
      label: "Company Location",
      type: "select",
      options: ["Viet Nam", "USA", "Singapore"],
    },
    {
      label: "Company Size",
      type: "select",
      options: ["1-50", "51-200", "201-500", "500+"],
    },
    { label: "Founded On", type: "select", options: ["2020", "2021", "2022"] },
  ];

  return (
    <div className="space-y-6">
      {filterGroups.map((group, index) => (
        <div key={index}>
          <label className="block text-gray-800 font-bold text-sm mb-2">
            {group.label}
          </label>
          {group.type === "text" ? (
            <input
              type="text"
              placeholder={group.placeholder}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm"
            />
          ) : (
            <select className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm text-gray-500">
              <option>{group.label}</option>
              {group.options?.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          )}
        </div>
      ))}
    </div>
  );
};

export default FilterSidebar;
