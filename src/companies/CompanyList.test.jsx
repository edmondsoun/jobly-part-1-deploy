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
JoblyApi.getCompanies = vi.fn();

import CompanyList from "./CompanyList";

//reset our mock after each test to ensure we know exactly
//how many times the mock has been called
afterEach(function(){
  JoblyApi.getCompanies.mockReset();
})

it("matches snapshot", function () {
  const { asFragment } = render(<CompanyList />);
  expect(asFragment()).toMatchSnapshot();
});

it("renders all companies", async function () {
  // mock api call
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

  // render CompanyList
  const { container } = render(
    <MemoryRouter>
      <CompanyList />
    </MemoryRouter>
  );

  // Ensure loading message is shown on first render
  expect(container.querySelector(".LoadingSpinner")).toBeInTheDocument();

  // Wait for useEffect to run and trigger second render,
  // where the loading message will disappear
  await waitForElementToBeRemoved(() => screen.getByText("Loading ..."));

  expect(screen.queryByText("Loading ...")).toBeNull();
  expect(container.querySelector(".SearchForm")).toBeInTheDocument();

  const companies = container.querySelectorAll(".CompanyCard");
  expect(companies.length).toEqual(2);
  expect(companies[0]).toContainHTML("Desc1");
  expect(companies[1]).toContainHTML("Desc2");
});

it("displays message when no companies match filter", async function () {
  JoblyApi.getCompanies.mockReturnValue([]);

  const { container } = render(
    <MemoryRouter>
      <CompanyList />
    </MemoryRouter>
  );

  expect(container.querySelector(".LoadingSpinner")).toBeInTheDocument();

  await waitForElementToBeRemoved(() => screen.getByText("Loading ..."));

  expect(container.querySelector(".SearchForm")).toBeInTheDocument();
  expect(container).toContainHTML("Sorry, no results were found!");
});

// Integration test: can we use the search bar?
it("filters companies when using the search bar", async function () {
  JoblyApi.getCompanies
    .mockReturnValueOnce([
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
    ])
    .mockReturnValueOnce([
      {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        numEmployees: 1,
        logo: "http://c1.img",
      },
    ]);

  const { container } = render(
    <MemoryRouter>
      <CompanyList />
    </MemoryRouter>
  );

  await waitForElementToBeRemoved(() => screen.getByText("Loading ..."));

  expect(JoblyApi.getCompanies).toHaveBeenCalledTimes(1);

  let companies = container.querySelectorAll(".CompanyCard");
  expect(companies.length).toEqual(2);

  // user types something into search bar and presses submit
  const searchBar = container.querySelector("input[name='searchTerm']");
  fireEvent.change(searchBar, { target: { value: "1" } });
  fireEvent.submit(container.querySelector("form"));

  await waitForElementToBeRemoved(() => screen.getAllByText("Desc2"));
  expect(JoblyApi.getCompanies).toHaveBeenCalledTimes(2);
  expect(container.querySelectorAll(".CompanyCard").length).toEqual(1);
});
