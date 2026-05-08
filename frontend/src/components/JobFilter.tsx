"use client";

interface JobFiltersProps {
  draftFilters: any;
  setDraftFilters: (filters: any) => void;
  options: any;
  onApply: () => void;
  onClear: () => void;
}

export default function JobFilters({
  draftFilters,
  setDraftFilters,
  options,
  onApply,
  onClear,
}: JobFiltersProps) {
  const filterConfig = [
    { label: "Category", name: "category", opts: options?.categories },
    { label: "Location", name: "location", opts: options?.locations },
    { label: "Job Type", name: "type", opts: options?.types },
    { label: "Experience", name: "experience", opts: options?.experiences },
    { label: "Gender", name: "gender", opts: options?.genders },
    { label: "Salary Range", name: "salary", opts: options?.salaryRanges },
  ];

  const handleChange = (name: string, value: string) => {
    setDraftFilters({ ...draftFilters, [name]: value });
  };

  return (
    <div className="top-24 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
        <i className="fas fa-filter text-blue-600"></i>
        <h2 className="text-xl font-bold text-gray-800">Search Filters</h2>
      </div>

      <div className="space-y-5">
        {/* Keyword Input */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Keywords
          </label>
          <input
            type="text"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Title, company..."
            value={draftFilters.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        {/* Dynamic Selects */}
        {filterConfig.map((f) => (
          <div key={f.name}>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              {f.label}
            </label>
            <select
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm cursor-pointer"
              value={draftFilters[f.name]}
              onChange={(e) => handleChange(f.name, e.target.value)}
            >
              <option value="">
                All {f.label === "Category" ? "Categories" : `${f.label}s`}
              </option>
              {f.opts?.map((opt: any) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Action Buttons */}
        <div className="pt-4 space-y-3">
          <button
            onClick={onApply}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-200"
          >
            Apply Filters
          </button>
          <button
            onClick={onClear}
            className="w-full py-2 text-sm text-gray-500 hover:text-red-500 font-medium transition-colors"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </div>
  );
}
