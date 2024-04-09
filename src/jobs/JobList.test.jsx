import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { 
  it, 
  expect,
  afterEach,
  vi } from "vitest";

import JoblyApi from "../api/api";
JoblyApi.getJobs = vi.fn();

import Jobs from "./JobList";
import JobList from "./JobList";

//reset our mock after each test to ensure we know exactly
//how many times the mock has been called
afterEach(function(){
  JoblyApi.getJobs.mockReset();
})

it("renders without crashing", function () {
  render(<Jobs />);
});

it("matches snapshot with no jobs", function () {
  const { asFragment } = render(<Jobs />);
  expect(asFragment()).toMatchSnapshot();
});

it("lists all jobs", async function () {
  JoblyApi.getJobs.mockReturnValue([
    {
      id: 101,
      title: "J1",
      salary: 1000,
      equity: "0.1",
      companyHandle: "c1",
      companyName: "C1",
    },
    {
      id: 102,
      title: "J2",
      salary: 10000,
      equity: "0.2",
      companyHandle: "c1",
      companyName: "C1",
    },
    {
      id: 103,
      title: "J3",
      salary: 100000,
      equity: null,
      companyHandle: "c1",
      companyName: "C1",
    },
  ]);

  const { container } = render(
    <MemoryRouter>
      <JobList />
    </MemoryRouter>
  );

  expect(container.querySelector(".LoadingSpinner")).toBeInTheDocument();

  await waitForElementToBeRemoved(() => screen.getByText("Loading ..."));
  expect(container.querySelector(".SearchForm")).toBeInTheDocument();
  
  const jobs = container.querySelectorAll(".JobCard");
  expect(jobs.length).toEqual(3);
  expect(jobs[0]).toContainHTML("J1");
  expect(jobs[1]).toContainHTML("J2");
  expect(jobs[2]).toContainHTML("J3");
});

it("displays message when no jobs match the filter", async function () {
  JoblyApi.getJobs.mockReturnValue([]);

  const { container } = render(
    <MemoryRouter>
      <JobList />
    </MemoryRouter>
  );

  expect(container.querySelector(".LoadingSpinner")).toBeInTheDocument();

  await waitForElementToBeRemoved(() => screen.getByText("Loading ..."));
  expect(container.querySelector(".SearchForm")).toBeInTheDocument();

  const jobs = container.querySelectorAll(".JobCard");
  expect(jobs.length).toEqual(0);
  expect(container).toContainHTML("Sorry, no results were found!");
});

it("filters jobs when using the search bar", async function () {
  JoblyApi.getJobs
    .mockReturnValueOnce([
      {
        id: 101,
        title: "J1",
        salary: 1000,
        equity: "0.1",
        companyHandle: "c1",
        companyName: "C1",
      },
      {
        id: 102,
        title: "J2",
        salary: 10000,
        equity: "0.2",
        companyHandle: "c1",
        companyName: "C1",
      },
      {
        id: 103,
        title: "J3",
        salary: 100000,
        equity: null,
        companyHandle: "c1",
        companyName: "C1",
      },
    ])
    .mockReturnValueOnce([
      {
        id: 102,
        title: "J2",
        salary: 10000,
        equity: "0.2",
        companyHandle: "c1",
        companyName: "C1",
      },
    ]);

  const { container } = render(
    <MemoryRouter>
      <JobList />
    </MemoryRouter>
  );

  await waitForElementToBeRemoved(() => screen.getByText("Loading ..."));
  expect(JoblyApi.getJobs).toHaveBeenCalledTimes(1);

  let jobs = container.querySelectorAll(".JobCard");
  expect(jobs.length).toEqual(3);

  const searchBar = container.querySelector("input[name='searchTerm']");

  fireEvent.change(searchBar, { target: { value: "2" } });
  fireEvent.submit(container.querySelector("form"));

  await waitForElementToBeRemoved(() => screen.getAllByText("J1"));
  expect(JoblyApi.getJobs).toHaveBeenCalledTimes(2);

  const jobsAfterSearch = container.querySelectorAll(".JobCard");
  expect(jobsAfterSearch.length).toEqual(1);
  expect(jobsAfterSearch[0]).toContainHTML("J2");
});
