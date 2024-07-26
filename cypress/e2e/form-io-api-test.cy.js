/// <reference types="cypress" />
import { faker } from "@faker-js/faker";

describe("Form.io api test", () => {
  it("TC-001 POST - Create a new account / POST - Login to Form.io / GET - Get the current user / GET - Logout of Form.io", () => {
    let userToken;
    let name = "user" + faker.number.int({ min: 1000, max: 9999 });
    let email = faker.internet.email().toLowerCase();
    const password = "CHANGEME";

    // POST - Create a new account
    cy.request({
      method: "POST",
      url: "/user/register",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        data: {
          name: name,
          email: email,
          password: password,
        },
      },
      failOnStatusCode: false,
    }).then((response) => {
      const body = response.body;
      expect(response.status).to.eq(201);
      expect(body.data.name).to.have.lengthOf.at.least(7);
      expect(body.data.name).contains("user");
      expect(body.data.email).contains("@");
      const header = response.headers;
      expect(header["content-type"]).to.eq("application/json; charset=utf-8");
    });

    // POST - Login to Form.io
    cy.request({
      method: "POST",
      url: "/user/login",
      body: {
        data: {
          email: email,
          password: password,
        },
      },
      failOnStatusCode: false,
    }).then((response) => {
      const body = response.body;
      expect(response.status).to.eq(200);
      expect(body.data.name).to.eq(name);
      expect(body.data.email).to.eq(email);
      const header = response.headers;
      expect(header["content-type"]).to.eq("application/json; charset=utf-8");
      userToken = header["x-jwt-token"];

      // GET - Get the current user
      cy.request({
        method: "GET",
        url: "/current",
        failOnStatusCode: false,
        headers: {
          "Content-Type": "application/json",
          "x-jwt-token": userToken,
        },
        failOnStatusCode: false,
      }).then((response) => {
        console.log("userToken2: " + userToken);
        const body = response.body;
        expect(response.status).to.eq(200);
        expect(body.data.name).to.eq(name);
        expect(body.data.email).to.eq(email);
        const header = response.headers;
        expect(header["content-type"]).to.eq("application/json; charset=utf-8");
      });

      // GET - Logout of Form.io
      cy.request({
        method: "GET",
        url: "https://formio.form.io/logout",
        headers: {
          "x-jwt-token": userToken,
        },
        failOnStatusCode: false,
      }).then((response) => {
        const body = response.body;
        expect(response.status).to.eq(200);
        expect(body).to.eq("OK");
        const header = response.headers;
        expect(header["content-type"]).to.eq("text/plain; charset=utf-8");
      });
    });
  });

  it("TC-002 POST - Unable to create a new account", () => {
    cy.request({
      method: "POST",
      url: "/user/register",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        data: {
          name: "test",
          email: "test.test.com",
          password: "INVALID",
        },
      },
      failOnStatusCode: false,
    }).as("response");
    cy.get("@response").its("status").should("eq", 400);
    cy.get("@response")
      .its("body.details[0].message")
      .should("eq", "Email must be a valid email.");
    cy.request({
      method: "POST",
      url: "/user/register",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        data: {
          name: "test",
          email: "test@test.com",
          password: "INVALID",
        },
      },
      failOnStatusCode: false,
    }).as("response");
    cy.get("@response").its("status").should("eq", 400);
    cy.get("@response")
      .its("body.details[0].message")
      .should("eq", "Username must be unique");
    cy.get("@response")
      .its("body.details[1].message")
      .should("eq", "Password must have at least 8 characters.");
  });
});
