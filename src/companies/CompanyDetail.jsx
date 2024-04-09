import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import JoblyApi from "../api/api";
import JobCardList from "../jobs/JobCardList";
import LoadingSpinner from "../common/LoadingSpinner";
import "./CompanyDetail.css";

/** Company Detail page.
 *
 * Renders information about company, along with the jobs at that company.
 *
 * Routed at /companies/:handle
 *
 * Routes -> CompanyDetail -> JobCardList
 */

function CompanyDetail() {
  const { handle } = useParams();
  console.debug("CompanyDetail", "handle=", handle);

  const [company, setCompany] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(function getCompanyAndJobsForUser() {
    async function getCompany() {
      try {
        const foundCompany = await JoblyApi.getCompany(handle);
        setCompany(foundCompany);
      } catch(errs) {
        setErrors(errs);
      }
    }

    getCompany();
  }, [handle]);

  if (errors.length) return <div> 404 Company Not Found </div>
  if (!company) return <LoadingSpinner />;

  return (
    <div className="CompanyDetail col-md-8 offset-md-2">
      <h4 className="CompanyDetail">{company.name}</h4>
      <p className="CompanyDetail">{company.description}</p>
      <JobCardList jobs={company.jobs} />
    </div>
  );
}

export default CompanyDetail;
