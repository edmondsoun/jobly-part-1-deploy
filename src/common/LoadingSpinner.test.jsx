import { render } from "@testing-library/react";
import LoadingSpinner from "./LoadingSpinner";

import { 
  it, 
  expect, } from "vitest";

it("matches snapshot", function () {
  const { asFragment } = render(<LoadingSpinner />);
  expect(asFragment()).toMatchSnapshot();
});

it("Renders a loading message", function () {
  const { container } = render(<LoadingSpinner />);

  const loading = container.querySelector(".LoadingSpinner");
  expect(loading).toBeInTheDocument();
  expect(loading).toContainHTML("Loading ...");
});
