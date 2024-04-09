import React from "react";
import { render } from "@testing-library/react";
import JobCard from "./JobCard";

const TEST_JOB_DATA = {
  id: 1,
  title: "CEO",
  salary: 1000000,
  equity: 10,
  companyName: "C1",
};

import { 
  it, 
  expect, } from "vitest";

it("matches snapshot", function () {
  const { asFragment } = render(
    <JobCard
      id={TEST_JOB_DATA.id}
      title={TEST_JOB_DATA.title}
      salary={TEST_JOB_DATA.salary}
      equity={TEST_JOB_DATA.equity}
      companyName={TEST_JOB_DATA.companyName}
    />
  );

  expect(asFragment()).toMatchSnapshot();
});

it("renders a job card", function () {
  const { container } = render(
    <JobCard
      id={TEST_JOB_DATA.id}
      title={TEST_JOB_DATA.title}
      salary={TEST_JOB_DATA.salary}
      equity={TEST_JOB_DATA.equity}
      companyName={TEST_JOB_DATA.companyName}
    />
  );

  const jobCard = container.querySelector(".JobCard");
  expect(jobCard).toBeInTheDocument();
  expect(jobCard).toContainHTML("CEO");
  expect(jobCard).toContainHTML("10");
});

it("formats salary correctly", function () {
  const { container } = render(
    <JobCard
      id={TEST_JOB_DATA.id}
      title={TEST_JOB_DATA.title}
      salary={TEST_JOB_DATA.salary}
      equity={TEST_JOB_DATA.equity}
      companyName={TEST_JOB_DATA.companyName}
    />
  );

  const jobCard = container.querySelector(".JobCard");
  expect(jobCard).toContainHTML("1,000,000");
});
