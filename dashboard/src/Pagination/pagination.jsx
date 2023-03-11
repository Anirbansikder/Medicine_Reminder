import React from "react";

import "./pagination.css";

const Pagination = ({ patientsPerPage, totalPatients, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPatients / patientsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container">
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;
