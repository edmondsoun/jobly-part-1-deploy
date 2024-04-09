import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Navigation from "./Navigation";

import { 
  it, 
  expect,} from "vitest";

it("renders without crashing", function () {
  render(
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  );
});

it("matches snapshot", function () {
  const { asFragment } = render(
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("renders the correct nav links", function () {
  const { container } = render(
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  );

  const links = container.querySelectorAll("a");
  expect(links.length).toEqual(3);
  expect(links[0]).toContainHTML("Jobly");
  expect(links[0].getAttribute("href")).toEqual("/");
  expect(links[1]).toContainHTML("Companies");
  expect(links[1].getAttribute("href")).toEqual("/companies");
  expect(links[2]).toContainHTML("Jobs");
  expect(links[2].getAttribute("href")).toEqual("/jobs");
});
