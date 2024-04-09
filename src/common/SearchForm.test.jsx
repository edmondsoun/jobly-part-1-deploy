import React from "react";
import { fireEvent, render } from "@testing-library/react";
import SearchForm from "./SearchForm";

import { 
  it, 
  expect, 
  vi,} from "vitest";

const mockSearchFor = vi.fn();

it("matches snapshot", function () {
  const { asFragment } = render(<SearchForm />);
  expect(asFragment()).toMatchSnapshot();
});

it("works when you type in the search bar", function () {
  const { container } = render(<SearchForm />);

  const searchBar = container.querySelector("input");

  fireEvent.change(searchBar, { target: { value: "testing" } });
  expect(searchBar.value).toEqual("testing");
  expect(searchBar).toContainHTML("testing");
});

it("works calls function passed as props on submit", function () {
  const { container } = render(<SearchForm searchFor={mockSearchFor} />);

  expect(mockSearchFor).toHaveBeenCalledTimes(0);

  const searchBar = container.querySelector("input");
  fireEvent.change(searchBar, { target: { value: "testing" } });

  fireEvent.submit(container.querySelector("form"));
  expect(mockSearchFor).toHaveBeenCalledTimes(1);
});
