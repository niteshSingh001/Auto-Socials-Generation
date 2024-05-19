import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { Pagination } from "@mui/material";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state ? location.state.results : [];
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 15;

  // Pagination Logic
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-end">
        <button
          type="submit"
          className="btn btn-primary"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>
      <h1>Results</h1>
      {results.length > 0 ? (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Domain</th>
                <th>LinkedIn Profile</th>
                <th>Employee Count</th>
                <th>Followers Count</th>
              </tr>
            </thead>
            <tbody>
              {currentResults.map((result, index) => (
                <tr key={index}>
                  <td>{indexOfFirstResult + index + 1}</td>
                  <td>{result.domain}</td>
                  <td>
                    <a
                      href={result.linkedinProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {result.linkedinProfile}
                    </a>
                  </td>
                  <td>{result.employeeCount}</td>
                  <td>{result.followersCount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination
            count={Math.ceil(results.length / resultsPerPage)}
            page={currentPage}
            onChange={(event, value) => paginate(value)}
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": {
                background: "#0D6DFD",
                color: "white",
              },
            }}
          />
        </>
      ) : (
        <p>No data available. Please submit some domains for analysis.</p>
      )}
    </div>
  );
};

export default Results;
