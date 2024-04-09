import React from "react";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { 
  it, 
  expect, 
  vi,} from "vitest";

import JoblyApi from "./api/api";
JoblyApi.getJobs = vi.fn();
JoblyApi.getCompanies = vi.fn();
JoblyApi.getCompany = vi.fn();

import App from "./App";


it("renders without crashing", function () {
  render(<App />);
});

it("matches the screenshot", function () {
  const { asFragment } = render(<App />);
  expect(asFragment()).toMatchSnapshot();
});

it("renders homepage and navbar", function () {
  const { container } = render(<App />);

  expect(container.querySelector(".App")).toBeInTheDocument();
  expect(container.querySelector(".Navigation")).toBeInTheDocument();
  expect(container.querySelector(".Homepage")).toBeInTheDocument();
});

it("can navigate around site", async function () {
  JoblyApi.getCompanies.mockReturnValue([
    {
      handle: "c1",
      name: "C1",
      description: "Desc1",
      numEmployees: 1,
      logo: "http://c1.img",
    },
    {
      handle: "c2",
      name: "C2",
      description: "Desc2",
      numEmployees: 2,
      logoUrl: "http://c2.img",
    },
  ]);

  JoblyApi.getCompany.mockReturnValue({
    handle: "c1",
    name: "C1",
    description: "Desc1",
    numEmployees: 1,
    logo: "http://c1.img",
    jobs: [
      {
        id: 1,
        title: "jtitle1",
        salary: 100000,
        equity: 0.05,
        companyName: "C1",
      },
    ],
  });

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

  const { container } = render(<App />);
  const user = userEvent.setup();

  // navigate to companies page
  await user.click(screen.getByText("Companies"));

  const companies = container.querySelectorAll(".CompanyCard");
  expect(companies.length).toEqual(2);
  expect(companies[0]).toContainHTML("Desc1");
  expect(companies[0].getAttribute("href")).toEqual("/companies/c1");

  // navigate to company detail page
  await user.click(companies[0]);
  expect(container.querySelectorAll(".CompanyCard").length).toEqual(0);

  const company = container.querySelector(".CompanyDetail");
  expect(company).toBeInTheDocument();
  expect(company).toContainHTML("Desc1");

  expect(container.querySelector(".JobCardList")).toBeInTheDocument();
  const jobs = container.querySelectorAll(".JobCard");
  expect(jobs.length).toEqual(1);
  expect(jobs[0]).toContainHTML("jtitle1");

  // navigate to jobs page
  await user.click(container.getElementsByClassName("nav-link")[1]);
  expect(container.querySelectorAll(".CompanyDetail").length).toEqual(0);
  expect(container.querySelectorAll(".JobCard").length).toEqual(3);
  expect(container.querySelectorAll(".JobCard")[1]).toContainHTML("$10,000");
  expect(container.querySelectorAll(".JobCard")[2]).toContainHTML("$100,000");

  // navigate to homepage
  await user.click(container.getElementsByClassName("navbar-brand")[0]);
  expect(container.querySelectorAll(".JobCard").length).toEqual(0);
  expect(container).toContainHTML("All the jobs in one, convenient place");
});
