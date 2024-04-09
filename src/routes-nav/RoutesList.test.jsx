import React from "react";
import { render } from "@testing-library/react";
import RoutesList from "./RoutesList";
import { MemoryRouter } from "react-router";

import { 
  it, 
  expect, } from "vitest";

it("renders without crashing", function () {
  render(
    <MemoryRouter>
      <RoutesList />
    </MemoryRouter>,
  );
});

it("matches snapshot", function () {
  const { asFragment } = render(
    <MemoryRouter>
      <RoutesList />
    </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});
