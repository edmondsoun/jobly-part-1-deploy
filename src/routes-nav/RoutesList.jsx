import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "../homepage/Homepage";
import CompanyList from "../companies/CompanyList";
import JobList from "../jobs/JobList";
import CompanyDetail from "../companies/CompanyDetail";


/** Site-wide routes.
 *
 * Visiting a non-existent route navigates to the homepage.
 */

function RoutesList() {
  console.debug("Routes");

  return (
    <div className="pt-5">
      <Routes>
        <Route path="/" element={<Homepage />}/>
        <Route path="/companies" element={<CompanyList />}/>
        <Route path="/jobs" element={<JobList />}/>
        <Route path="/companies/:handle" element={<CompanyDetail />}/>
        <Route element={<Navigate to="/" /> } />
      </Routes>
    </div>
  );
}

export default RoutesList;
