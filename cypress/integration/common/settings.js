import { When, Then } from 'cypress-cucumber-preprocessor/steps'

/* global cy */

let aboutMeText
let myLocation

const matchNameInUserMenu = name => {
  cy.get('.avatar-menu').click() // open
  cy.get('.avatar-menu-popover').contains(name)
  cy.get('.avatar-menu').click() // close again
}

When('I save {string} as my new name', name => {
  cy.get('input[id=name]')
    .clear()
    .type(name)
  cy.get('[type=submit]')
    .click()
    .not('[disabled]')
})

When('I save {string} as my location', location => {
  cy.get('input[id=city]').type(location)
  cy.get('.ds-select-option')
    .contains(location)
    .click()
  cy.get('[type=submit]')
    .click()
    .not('[disabled]')
  myLocation = location
})

When('I have the following self-description:', text => {
  cy.get('textarea[id=bio]')
    .clear()
    .type(text)
  cy.get('[type=submit]')
    .click()
    .not('[disabled]')
  aboutMeText = text
})

When('people visit my profile page', url => {
  cy.openPage('/profile/peter-pan')
})

When('they can see the text in the info box below my avatar', () => {
  cy.contains(aboutMeText)
})

Then('they can see the location in the info box below my avatar', () => {
  cy.contains(myLocation)
})

Then('the name {string} is still there', name => {
  matchNameInUserMenu(name)
})

Then(
  'I can see my new name {string} when I click on my profile picture in the top right',
  name => matchNameInUserMenu(name)
)

When('I click on the {string} link', link => {
  cy.get('a')
    .contains(link)
    .click()
})

Then('I should be on the {string} page', page => {
  cy.location()
    .should(loc => {
      expect(loc.pathname).to.eq(page)
    })
    .get('h3')
    .should('contain', 'Social media')
})

Then('I add a social media link', () => {
  cy.get("input[name='social-media']")
    .type('https://freeradical.zone/peter-pan')
    .get('button')
    .contains('Add link')
    .click()
})

Then('it gets saved successfully', () => {
  cy.get('.iziToast-message')
    .should('contain', 'Updated user')
})

Then('the new social media link shows up on the page', () => {
  cy.get('a[href="https://freeradical.zone/peter-pan"]')
    .should('have.length', 1)
})

Given('I have added a social media link', () => {
  cy.openPage('/settings/my-social-media')
    .get("input[name='social-media']")
    .type('https://freeradical.zone/peter-pan')
    .get('button')
    .contains('Add link')
    .click()
})

Then('they should be able to see my social media links', () => {
  cy.get('.ds-card-content')
    .contains('Where else can I find Peter Pan?')
    .get('a[href="https://freeradical.zone/peter-pan"]')
    .should('have.length', 1)
})
