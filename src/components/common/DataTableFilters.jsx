// components/common/DataTableFilters.js
import { FiSearch, FiPlus } from "react-icons/fi";
import Button from "./Button";
import { Link } from "react-router-dom";

const DataTableFilters = ({
  searchTerm = "",
  onSearchChange,
  onSearchSubmit,
  filters = [],
  totalItems = 0,
  addButtonLink,
  addButtonText,
  searchPlaceholder = "Search...",
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 mb-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <form onSubmit={onSearchSubmit} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </form>

        {/* Dynamic Filters */}
        <div className="flex gap-4 items-center">
          {filters.map((filter, index) => (
            <div key={index} className="flex-1">
              {filter.type === 'select' ? (
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                  value={filter.value}
                  onChange={filter.onChange}
                >
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : filter.type === 'input' ? (
                <input
                  type={filter.inputType || 'text'}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                  value={filter.value}
                  onChange={filter.onChange}
                  placeholder={filter.placeholder}
                />
              ) : null}
            </div>
          ))}
        </div>

        {/* Results and Add Button */}
        <div className="flex items-center justify-end gap-4">
          <span className="text-sm text-gray-600 pt-3">
            Showing {totalItems} items
          </span>
          {addButtonLink && (
            <Link to={addButtonLink} className="w-full md:w-auto">
              <Button className="flex items-center gap-2 w-full px-3">
                <FiPlus /> {addButtonText}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTableFilters;