/// <reference types="cypress" />
// const { indexOfMax } = require('C:/Users/durak/E2E-Test-Cypress/cypress/utilities/common.js')
import { indexOfMax } from'C:/Users/durak/E2E-Test-Cypress/cypress/utilities/common.js'

describe('Buy item', () => {

    //Login Functionality

    beforeEach(() => {
        cy.session('user', () => {
            cy.login()
        }, {
            validate() {
                cy.document()
                    .its('cookie')
                    .should('contain', 'session-username')
            }
        })

        // Log in with ready login commands 
        cy.login()

    })

    // Buy Functionality 
    it('TC-001 Buy the highest price item without using the sort feature', () => {
        // Get the price of the highest price item 
        let prices = []
        cy.get('.inventory_item_price').each(item => {
            cy.get(item).invoke('prop', 'textContent').then(el => {
                let arr = el.split('$')
                let price = arr[1]
                prices.push(parseFloat(price))
            })

        }).then(() => {
            console.log(indexOfMax(prices))
            cy.wrap(indexOfMax(prices)).as('highestPriceItemIndex')
        })

        // Add the highest price item to the cart
        cy.get('@highestPriceItemIndex').then(highestPriceItemIndex => {
            cy.get('.inventory_item_price').eq(highestPriceItemIndex).invoke('prop', 'textContent').then(itemPrice => {
                let arr = itemPrice.split('$')
                itemPrice = parseFloat(arr[1])
                console.log
                cy.wrap(itemPrice).as('itemPrice')
                cy.get('[data-test^="add-to-cart"]').eq(highestPriceItemIndex).click()
            })
        })

        // Click the cart icon to navigate your cart
        cy.get('.shopping_cart_link').click()

        // Click the checkout button
        cy.get('#checkout').click()

        // Enter a name
        cy.get('#first-name').type('Tester')

        // Enter a lastname
        cy.get('#last-name').type('SDET')

        // Enter a postal code
        cy.get('#postal-code').type('35663')

        // Click the continue button to navigate your overview
        cy.get('#continue').click()

        // Get tax cost
        cy.get('.summary_tax_label').invoke('prop', 'textContent').then(tax => {
            let arr = tax.split('$')
            tax = parseFloat(arr[1])
            cy.wrap(tax).as('tax')
        })

        // Get actual price
        cy.get('.summary_total_label').invoke('prop', 'textContent').then(actualTotalPrice => {
            let arr = actualTotalPrice.split('$')
            actualTotalPrice = parseFloat(arr[1])
            cy.wrap(actualTotalPrice).as('actualTotalPrice')
        })

        // Click the finish button to buy item
        cy.get('#finish').click()

        // Verify that the user can able to buy item and "Thank you for your order" message is displayed
        cy.get('.complete-header').should('have.text', 'Thank you for your order!')

        // Verify that the total price is as expected

        cy.get('@actualTotalPrice').then(actualTotalPrice => {
            cy.get('@tax').then(tax => {
                cy.get('@itemPrice').then(itemPrice => {
                    let expectedPrice = tax + itemPrice
                    expect(expectedPrice).to.eq(actualTotalPrice)
                })
            })
        })
    })
})

