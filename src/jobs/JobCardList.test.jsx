import React from "react";
import { render } from "@testing-library/react";

import JobCardList from "./JobCardList";
import { MemoryRouter } from "react-router-dom";

import {  
  it, 
  expect,  } from "vitest";

it("matches snapshot", function () {
  const jobs = [
    {
      id: 1,
      title: "test-title",
      salary: 10,
      equity: 0.1,
      companyName: "company-test",
    },
  ];

  const { asFragment } = render(<JobCardList jobs={jobs} />);
  expect(asFragment()).toMatchSnapshot();
});

it("renders job cards", async function () {
  const jobs = [
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
  ];

  const {container} = render(
    <MemoryRouter>
      <JobCardList jobs={jobs} />
    </MemoryRouter>
  )

  const jobCards = container.querySelectorAll(".JobCard");
  expect(jobCards.length).toEqual(3);
  expect(jobCards[0]).toContainHTML("J1");
  expect(jobCards[0]).toContainHTML("$1,000");
  
  expect(jobCards[1]).toContainHTML("J2");
  expect(jobCards[1]).toContainHTML("$10,000");
  
  expect(jobCards[2]).toContainHTML("J3");
  expect(jobCards[2]).toContainHTML("$100,000");

});

it("renders no cards when no jobs passed", function () {
  const {container} = render(
    <MemoryRouter>
      <JobCardList jobs={[]} />
    </MemoryRouter>
  )

  const jobCards = container.querySelectorAll(".JobCard");
  expect(jobCards.length).toEqual(0);
})
