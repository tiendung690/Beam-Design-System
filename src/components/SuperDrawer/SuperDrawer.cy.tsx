/// <reference types="Cypress" />
import { mount } from "@cypress/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./SuperDrawer.stories";

const { Open } = composeStories(stories);

describe("SuperDrawer", () => {
  it("should mount", () => {
    mount(<Open />);

    cy.get('[data-testid="superDrawer"]');
  });
});
