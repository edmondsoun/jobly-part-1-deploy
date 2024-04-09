import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Home from "./Homepage";

import { 
  it, 
  expect, } from "vitest";

it("matches snapshot", function () {
  const { asFragment } = render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("renders the hompage", function () {
  const { container } = render(<Home />);

  expect(container.querySelector(".Homepage").toBeInTheDocument);
  expect(container).toContainHTML("All the jobs in one, convenient place.");
});
