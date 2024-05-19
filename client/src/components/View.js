import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { Pagination } from "@mui/material";
import axios from "axios";
import base_url from "../bootapi";
import { Backdrop, CircularProgress } from "@mui/material";

const View = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(true);
  const [results, setResultData] = useState();
  const resultsPerPage = 15;

  useEffect(() => {
    axios
      .get(`${base_url.api1}/getLinkedinData`)
      .then((response) => {
        console.log("17--->", response.data);
        setResultData(response.data.data);
        setIsSearching(false);
      })
      .catch((error) => {
        console.log("error");
        setResultData([]);
        setIsSearching(false);
      });
  }, []);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results?.slice(indexOfFirstResult, indexOfLastResult);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

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
      <h2>Lead Info Stored Data</h2>
      {currentResults && currentResults.length > 0 ? (
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
                  <td>{index + indexOfFirstResult + 1}</td>
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
            count={Math.ceil(results?.length / resultsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSearching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default View;
