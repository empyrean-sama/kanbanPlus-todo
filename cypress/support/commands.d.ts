declare namespace Cypress {
    interface Chainable<any> {
        /**
         * Utility method to help get all the selectable items from a dropdown component
         * @param cssSelector: The css selector string which can reliably get a dropdown react component. (component is a div which will always have class dropdown)
         */
        getDropdownSelectableItems(cssSelector: string): Chainable<any>

        /**
         * Utility method to get the span element containing display text of the dropdown 
         * @param cssSelector: The css selector string which can reliably get a dropdown react component. (component is a div which will always have class dropdown) 
         */
        getDropdownDisplayElement(cssSelector: string): Chainable<any>
    }
}