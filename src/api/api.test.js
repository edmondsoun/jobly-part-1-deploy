import fetchMock from "fetch-mock";

import { 
  describe, 
  test, 
  expect,
  afterEach,
  beforeEach, } from "vitest";

import JoblyApi, { BASE_URL } from "./api";

/**
 * A Guide to FetchMock
 *
 * fetchMock takes up to 3 parameters and has a lot of ways in which you can
 * use it. The possible function signatures looks like so:
 *
 * fetchMock.mock(url: string, response: object, options:object)
 *
 * fetchMock.mock(matcher: object)
 *
 * Where matcher must contain:
 * {
 *    url: string
 *    response: object
 *    method: string
 * }
 *
 * The latter function signature is what we will be using for these tests. There
 * are numerous other configurations you can supply to the matcher object
 * including headers, query and more.
 *
 */

afterEach(function () {
  // after we've finished with these tests, restore fetchMock to remove
  // existing configurations
  fetchMock.restore();
});

describe("companies routes", function () {
  let allCompaniesResponse;
  let filteredCompaniesResponse;
  let singleCompanyResponse;

  beforeEach(function () {
    allCompaniesResponse = {
      companies: [
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
      ],
    };

    filteredCompaniesResponse = {
      companies: [
        {
          handle: "c1",
          name: "C1",
          description: "Desc1",
          numEmployees: 1,
          logo: "http://c1.img",
        },
      ],
    };

    singleCompanyResponse = {
      company: {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        numEmployees: 1,
        logo: "http://c1.img",
      },
    };
  });

  test("getCompanies, no filter", async function () {
    const getCompaniesURL = `${BASE_URL}/companies`;
    const mockResponse = allCompaniesResponse;

    const getCompaniesMock = {
      url: getCompaniesURL,
      response: mockResponse,
    };
    fetchMock.get(getCompaniesMock);

    const companies = await JoblyApi.getCompanies();

    expect(companies.length).toEqual(2);
    expect(companies).toEqual(allCompaniesResponse.companies);
  });

  test("getCompanies, with filter", async function () {
    const getCompaniesURL = `${BASE_URL}/companies`;
    const mockResponse = filteredCompaniesResponse;

    const companyFilterMock = {
      url: getCompaniesURL,
      query: {
        nameLike: "c1",
      },
      response: mockResponse,
    };
    fetchMock.get(companyFilterMock);

    const companies = await JoblyApi.getCompanies("c1");

    expect(companies.length).toEqual(1);
    expect(companies).toEqual(filteredCompaniesResponse.companies);
  });

  test("getCompanies, filter finds no matches", async function () {
    const getCompaniesURL = `${BASE_URL}/companies`;
    const mockResponse = {
      companies: [],
    };

    const companyFilterMock = {
      url: getCompaniesURL,
      query: {
        nameLike: "c1",
      },
      response: mockResponse,
    };
    fetchMock.get(companyFilterMock);

    const companies = await JoblyApi.getCompanies("c1");

    expect(companies.length).toEqual(0);
    expect(companies).toEqual([]);
  });

  test("getCompany", async function () {
    const getCompanyURL = `${BASE_URL}/companies/c1`;
    const mockResponse = singleCompanyResponse;

    const companyFilterMock = {
      url: getCompanyURL,
      response: mockResponse,
    };
    fetchMock.get(companyFilterMock);

    const company = await JoblyApi.getCompany("c1");
    expect(company).toEqual({
      handle: "c1",
      name: "C1",
      description: "Desc1",
      numEmployees: 1,
      logo: "http://c1.img",
    });
  });
});

describe("jobs routes", function () {
  let allJobsResponse;
  let filteredJobsResponse;
  let singleJobResponse;

  beforeEach(function () {
    allJobsResponse = {
      jobs: [
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
      ],
    };

    filteredJobsResponse = {
      jobs: [
        {
          id: 101,
          title: "J1",
          salary: 1000,
          equity: "0.1",
          companyHandle: "c1",
          companyName: "C1",
        },
      ],
    };

    singleJobResponse = {
      job: {
        id: 101,
        title: "J1",
        salary: 1000,
        equity: "0.1",
        company: {
          handle: "c1",
          name: "C1",
          description: "Desc1",
          numEmployees: 1,
          logoUrl: "http://c1.img",
        },
      }
    }
  });

  test("getJobs", async function () {
    const getJobsURL = `${BASE_URL}/jobs`;
    const mockResponse = allJobsResponse;

    const jobsMock = {
      url: getJobsURL,
      response: mockResponse,
    };
    fetchMock.get(jobsMock);

    const jobs = await JoblyApi.getJobs();
    console.log("jobsResponse", jobs);
    expect(jobs.length).toEqual(3);
    expect(jobs).toEqual(allJobsResponse.jobs);
  });

  test("getJobs filters by title properly", async function () {
    const getJobsURL = `${BASE_URL}/jobs`;
    const mockResponse = filteredJobsResponse;

    const jobsMock = {
      url: getJobsURL,
      response: mockResponse,
      query: {
        title: 1,
      },
    };
    fetchMock.get(jobsMock);

    const jobs = await JoblyApi.getJobs("1");
    expect(jobs.length).toEqual(1);
    expect(jobs).toEqual([
      {
        id: 101,
        title: "J1",
        salary: 1000,
        equity: "0.1",
        companyHandle: "c1",
        companyName: "C1",
      },
    ]);
  });

  test("getJobs: empty array if no jobs matching filter", async function () {
    const getJobsURL = `${BASE_URL}/jobs`;
    const mockResponse = { jobs: [] };

    const jobsMock = {
      url: getJobsURL,
      response: mockResponse,
      query: {
        title: "None",
      },
    };
    fetchMock.get(jobsMock);

    const jobs = await JoblyApi.getJobs("None");
    expect(jobs.length).toEqual(0);
    expect(jobs).toEqual([]);
  });
});

// // TODO: Add pessimisstic tests
