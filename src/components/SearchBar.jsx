import React from 'react'

import { CiSearch } from "react-icons/ci";



function SearchBar({width}) {

  return (
    <div className={` w-full flex`}>
      <form
        
        className="flex items-center justify-center space-x-2 w-full"
      >
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search Categories, items or Products here"
            className="w-full px-4 py-2 pl-10 rounded-lg bg-white text-[#667085] border border-gray-700 
            focus:outline-none focus:ring-2 focus:ring-primary-dark outline-none"
          />
          <CiSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667085]"
            size={20}
          />
          
        </div>
        <button
          type="submit"
          className=" text-white px-4 py-2 rounded-lg bg-primary-light"
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar