import React from "react";
import {
  render,
  waitForElementToBeRemoved,
  screen,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import fetchMock from "fetch-mock"

import JoblyApi, { BASE_URL } from "../api/api";

import { 
  it, 
  expect,
  vi, } from "vitest";

// Using spyOn to mock the function, so we can restore it to its original state
vi.spyOn(JoblyApi, "getCompany");

import CompanyDetail from "./CompanyDetail";

it("renders without crashing", function () {
  vi.mocked(JoblyApi.getCompany).mockImplementation(() => {
    console.log("THIS IS THE MOCKED VERSION");
    return {
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
    };
  });

  render(
    <MemoryRouter initialEntries={["/companies/c1"]}>
      <Routes>
        <Route path="/companies/:handle" element={<CompanyDetail />}></Route>
      </Routes>
    </MemoryRouter>
  );
});

it("matches snapshot", function () {
  vi.mocked(JoblyApi.getCompany).mockImplementation(() => {
    console.log("THIS IS THE MOCKED VERSION");
    return {
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
    };
  });

  const { asFragment } = render(
    <MemoryRouter initialEntries={["/companies/c1"]}>
      <Routes>
        <Route path="/companies/:handle" element={<CompanyDetail />}></Route>
      </Routes>
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("displays correct company info based on params", async function () {
  vi.mocked(JoblyApi.getCompany).mockImplementation(() => {
    return {
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
    };
  });

  const { container, debug } = render(
    <MemoryRouter initialEntries={["/companies/c1"]}>
      <Routes>
        <Route path="/companies/:handle" element={<CompanyDetail />}></Route>
      </Routes>
    </MemoryRouter>
  );

  expect(container.querySelector(".LoadingSpinner")).toBeInTheDocument();

  await waitForElementToBeRemoved(() => screen.getByText("Loading ..."));
  debug();
  expect(container.querySelector(".CompanyDetail")).toBeInTheDocument();
  expect(container.querySelector(".JobCardList")).toBeInTheDocument();
  expect(container.querySelectorAll(".JobCard").length).toEqual(1);
});

it("displays message if no such company", async function () {
  // restore getCompany to original state so we can  mock the axios call instead
  vi.mocked(JoblyApi.getCompany).mockRestore();

  const mockResponse = {
    body: {error: { message: "No company: none", status: 404 }},
    status: 404
  };

  const companyNotFoundMock = {
    url: `${BASE_URL}/companies/none`,
    response: mockResponse,
  }

  // mock the fetch call to return a 404 status code
  fetchMock.get(companyNotFoundMock);

  const { container } = render(
    <MemoryRouter initialEntries={["/companies/none"]}>
      <Routes>
        <Route path="/companies/:handle" element={<CompanyDetail />}></Route>
      </Routes>
    </MemoryRouter>
  );

  expect(container.querySelector(".LoadingSpinner")).toBeInTheDocument();
  const notFoundText = await screen.findByText('404 Company Not Found');
  screen.debug(notFoundText);

  expect(notFoundText).toBeVisible()
  
});
