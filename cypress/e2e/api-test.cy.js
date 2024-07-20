/// <reference types ="cypress" />
import { todayDate } from "/cypress/utilities/common.js";

describe("Api test", () => {
  it("TC-001 GET and verify user 2 details", () => {
    cy.request({
      method: "GET",
      url: "https://reqres.in/api/users/2",
    }).then((response) => {
      const body = response.body;
      expect(response.status).to.eq(200);
      expect(body.data.id).to.eq(2);
      expect(body.data.first_name).to.eq("Janet");
      expect(body.data.last_name).to.eq("Weaver");
      expect(body.data.email).to.eq("janet.weaver@reqres.in");
    });
  });

  it("TC-002 create an user, get created user details to validate ,and delete the related user", () => {
    // create a new user
    cy.request({
      method: "POST",
      url: "https://reqres.in/api/users/",
      body: {
        name: "alex",
        jobs: "QA Manager",
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.createdAt).contains(todayDate());
      expect(response.body.name).to.eq("alex");
      expect(response.body.jobs).to.eq("QA Manager");
      cy.wrap(response.body.id).as("id");
    });
    // get new user details
    cy.get("@id").then((id) => {
      cy.request({
        method: "GET",
        url: `https://reqres.in/api/users/${id}`,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200 || response.status === 201) {
          expect(response.status).to.eq(200);
          expect(response.body.data.id).to.eq(id);
          expect(response.body.data.name).to.eq("alex");
          expect(response.body.data.jobs).to.eq("QA Manager");
          expect(response.body.data.createdAt).to.eq(todayDate());
        } else {
          expect(response.status).to.eq(404);
        }
      });
    });
    // delete the new user
    cy.get("@id").then((id) => {
      cy.request({
        method: "DELETE",
        url: `https://reqres.in/api/users/${id}`,
      }).then((response) => {
        expect(response.status).to.eq(204);
      });
    });
  });
});
