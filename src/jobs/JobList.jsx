import React, { useState, useEffect } from "react";
import Search from "../common/SearchForm";
import JoblyApi from "../api/api";
import JobCardList from "./JobCardList";
import LoadingSpinner from "../common/LoadingSpinner";
import "./JobList.css";

/** Show page with list of jobs.
 *
 * On mount, loads jobs from API.
 * Re-loads filtered jobs on submit from search form.
 *
 * JobList -> JobCardList -> JobCard
 *
 * This is routed to at /jobs
 */

function JobList() {
  console.debug("JobList");

  const [jobs, setJobs] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(function getAllJobsOnMount() {
    console.debug("JobList useEffect getAllJobsOnMount");
    search();
  }, []);

  /** Triggered by search form submit; reloads jobs. */
  async function search(title) {
    let jobs = await JoblyApi.getJobs(title);
    setJobs(jobs);
    setSearchTerm(title);
  }

  if (!jobs) return <LoadingSpinner />;

  return (
    <div className="JobList col-md-8 offset-md-2">
      <Search searchFor={search} />

      {searchTerm 
        ? <h1>{`Search Results for '${searchTerm}'`}</h1>
        : <h1>All Jobs</h1>
      }

      {jobs.length
        ? <JobCardList jobs={jobs} />
        : <p className="lead">Sorry, no results were found!</p>
      }
    </div>
  );
}

export default JobList;
