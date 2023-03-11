import React from "react";

const SearchBar = ({ searchText, setSearchText }) => {
  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search patients by name or phone number"
      value={searchText}
      onChange={handleInputChange}
    />
  );
};

export default SearchBar;
