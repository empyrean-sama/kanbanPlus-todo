// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands

Cypress.Commands.add("getDropdownSelectableItems", (cssSelector) => cy.get(cssSelector).find('.dropdown-content').find('a'));
Cypress.Commands.add("getDropdownDisplayElement", (cssSelector) => cy.get(cssSelector).find('.dropdown-trigger').find('span'));