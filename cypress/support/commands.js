// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Login Command
Cypress.Commands.add("login", () => {
  // Assign the userdata as user
  cy.fixture("userdata").as("user");

  // Navigate the login page and verify the title is 'Swag Labs'

  cy.visit("").title().should("eq", "Swag Labs");
  cy.get("@user").then((user) => {
    cy.get("#user-name").should("be.visible").type(user.username);
    cy.get("#password").should("be.visible").type(user.password);
    cy.get("#login-button").should("be.visible").click();
  });

  // Verify that the user can able to log in successfully
  cy.url().should("eq", "https://www.saucedemo.com/inventory.html");
});
