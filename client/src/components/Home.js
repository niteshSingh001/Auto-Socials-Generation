import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import base_url from "../bootapi";

import { Backdrop, CircularProgress } from "@mui/material";

const Home = () => {
  const [domains, setDomains] = useState("");
  const [isSearching, setIsSearching] = useState(false); // Track search status
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSearching(true); // Start search
    const domainList = domains
      .split("\n")
      .filter((domain) => domain.trim() !== "");
    try {
      const response = await axios.post(`${base_url.api1}/search`, {
        companies: domainList,
      });
      navigate("/result", { state: { results: response.data.data } });
      // console.log("22---->", response.data);
    } catch (error) {
      console.error("Error fetching LinkedIn data:", error);
    } finally {
      setIsSearching(false); // End search
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-end">
        <button
          type="submit"
          className="btn btn-primary"
          onClick={() => navigate("/view")}
        >
          View Lead Info
        </button>
      </div>
      <h1>B2B Lead Info</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="domains" className="form-label">
            Enter business domains:
          </label>
          <textarea
            className="form-control"
            id="domains"
            rows="10"
            value={domains}
            onChange={(e) => setDomains(e.target.value)}
          ></textarea>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSearching}
        >
          Get LinkedIn Info
        </button>
      </form>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSearching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Home;
