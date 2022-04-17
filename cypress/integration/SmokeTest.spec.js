/// <reference types="Cypress" />


context('Buy item', () => {

    //Login Functionality

    beforeEach(() => {

    // Assign the userdata as user 
        cy.fixture('userdata').as('user')

    // Navigate the login page and verify the title is 'Swag Labs'
        cy.visit('').title().should('eq','Swag Labs')

    // Log in with ready login commands 
        cy.get('@user').then((user) =>{
            cy.login(user.username,user.password)
        })

    // Verify that the user can able to log in successfully and landen on the inventory page
        cy.url().should('eq',"https://www.saucedemo.com/inventory.html")

     })

     // Buy Functionality 
    it('Buys item from the site', () => {
       
    // Get the item price
        cy.get('.inventory_item_price').first().invoke('prop','textContent').then(($itemPrice) =>{
            let arr = $itemPrice.split('$')
            let itemPrice = parseFloat(arr[1])
            cy.wrap(itemPrice).as('itemPrice')
        })
        
          
    // Add the item to the cart
        cy.get('#add-to-cart-sauce-labs-backpack').click()

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
        cy.get('.summary_tax_label').invoke('prop','textContent').then(($tax) => {
            let arr = $tax.split('$')
            let tax = parseFloat(arr[1])
            cy.wrap(tax).as('tax')
        })
        
    // Get actual price
        cy.get('.summary_total_label').invoke('prop','textContent').then(($actualTotalPrice) => {
            let arr = $actualTotalPrice.split('$')
            let actualTotalPrice = parseFloat(arr[1])
            cy.wrap(actualTotalPrice).as('actualTotalPrice')
        })
        
    // Click the finish button to buy item
        cy.get('#finish').click()

    // Verify that the user can able to buy item and "THANK YOU FOR YOUR ORDER" message displayed
        cy.get('.complete-header').invoke('text').should((actualMessage) =>{
                expect(actualMessage).to.eq('THANK YOU FOR YOUR ORDER')
            })
    
    // Verify that the total price is as expected
        cy.get('@actualTotalPrice').then(($actualTotalPrice) =>{
            cy.get('@tax').then(($tax) => {
                cy.get('@itemPrice').then(($itemPrice)=>{
                    let expectedPrice = $tax + $itemPrice
                    expect(expectedPrice).to.eq($actualTotalPrice)
                })
            })
        })
    })
})

