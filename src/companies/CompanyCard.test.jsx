import React from "react";
import { render } from "@testing-library/react";
import CompanyCard from "./CompanyCard";
import { MemoryRouter } from "react-router";

import { 
  it, 
  expect, } from "vitest";

it("matches snapshot with logo", function () {
  const { asFragment } = render(
    <MemoryRouter>
      <CompanyCard
        handle="rithm"
        name="Rithm School"
        description="Become an exceptional developer in 16 weeks."
        logo_url="https://pbs.twimg.com/profile_images/770491761412173826/ZUeIa4tw_400x400.jpg"
      />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("matches snapshot without logo", function () {
  const { asFragment } = render(
    <MemoryRouter>
      <CompanyCard
        handle="algo"
        name="Algo School"
        description="Become a mediocre developer in 160 weeks."
      />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("displays the correct title, link, and logo", function () {
  const { container, debug } = render(
    <MemoryRouter>
      <CompanyCard
        handle="rithm"
        name="Rithm School"
        description="Become an exceptional developer in 16 weeks."
        logoUrl="https://pbs.twimg.com/profile_images/770491761412173826/ZUeIa4tw_400x400.jpg"
      />
    </MemoryRouter>
  );

  debug();
  const link = container.querySelector("a");
  expect(link.getAttribute("href")).toContain("rithm");

  const descr = container.querySelector("small");
  expect(descr.textContent).toContain("exceptional");

  const logo = container.querySelector("img");
  expect(logo.getAttribute("src")).toContain("ZUeIa4tw_400x400.jpg");
});

it("displays title, link, no img if logo not provided", function () {
  const { container, debug } = render(
    <MemoryRouter>
      <CompanyCard
        handle="rithm"
        name="Rithm School"
        description="Become an exceptional developer in 16 weeks."
      />
    </MemoryRouter>
  );

  debug();
  const link = container.querySelector("a");
  expect(link.getAttribute("href")).toContain("rithm");

  const descr = container.querySelector("small");
  expect(descr.textContent).toContain("exceptional");

  expect(container.querySelectorAll("img").length).toEqual(0);
});
