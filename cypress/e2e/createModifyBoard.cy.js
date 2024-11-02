/**
 * The test plan for this suite is described in cypress/test/createModifyBoard.json 
 */
describe("createModifyBoard", () => {
    beforeEach(() => {
        // Open a clean session before starting the execution of each test
        cy.visit("/")
    });

    it("add-board", () => {

        const boardSelectionDropdown = "#board-selection-dropdown";
        const boardSelectionDropdownPlaceholder = "Select A Board To View";
        const createBoard = "#create-board";
        const addBoardInput = "#create-board-input";
        const addBoardButton = "#create-board-button";

        // Assert for the board-selector-dropdown on the navbar is visible and not active
        cy.get(boardSelectionDropdown).should("be.visible");
        cy.get(boardSelectionDropdown).should("not.have.class", "is-active");
        cy.get(boardSelectionDropdown).find(".dropdown-menu").should("not.be.visible");

        // Assert that the user is not able to add a new board
        cy.get(createBoard).should("not.be.visible");

        // Assert that the dropdown display must read the prompt "Select A Board To View"
        cy.getDropdownDisplayElement(boardSelectionDropdown).should("contain.text", boardSelectionDropdownPlaceholder);

        // Step 2: Click on the board selector dropdown
        cy.get(boardSelectionDropdown).click();

        // Assert for the board-selector-dropdown on the navbar is visible and active
        cy.get(boardSelectionDropdown).should("be.visible");
        cy.get(boardSelectionDropdown).should("have.class", "is-active");
        
        // Assert that the user is able to add a new board
        cy.get(createBoard).should("be.visible");
        
        // Assert the number of boards currently in the project as 0
        cy.getDropdownSelectableItems(boardSelectionDropdown).should("have.length", 0);
        
        // Step 3: Try adding an empty board
        cy.get(addBoardButton).click();

        // Assert that no board is added
        cy.getDropdownSelectableItems(boardSelectionDropdown).should("have.length", 0);

        // Assert that the input is in error state
        cy.get(addBoardInput).should("have.class", "is-danger");

        // Step 4: Add a space character to new board name input
        cy.get(addBoardInput).type(" ");

        // Assert that the input is not in error state
        cy.get(addBoardInput).should("not.have.class", "is-danger");

        // Step 5: Try adding the board
        cy.get(addBoardButton).click();

        // Assert that no board is added
        cy.getDropdownSelectableItems(boardSelectionDropdown).should("have.length", 0);

        // Assert that the input is in error state
        cy.get(addBoardInput).should("have.class", "is-danger");

        // Step 6: Add a board with the name test
        cy.get(addBoardInput).type("test");
        cy.get(addBoardButton).click();

        // Assert that the board-selector-dropdown on the navbar must be visible and active
        cy.get(boardSelectionDropdown).should("be.visible");
        cy.get(boardSelectionDropdown).should("have.class", "is-active");

        // Assert that the board-selector-dropdown-menu must be visible
        cy.get(boardSelectionDropdown).find(".dropdown-menu").should("be.visible");

        // Assert that the new board input is empty and not in error
        cy.get(addBoardInput).should("be.visible");
        cy.get(addBoardInput).should("not.have.class", "is-danger");
        cy.get(addBoardInput).should("have.value", "");

        // Assert that the number of boards in the project is one
        cy.getDropdownSelectableItems(boardSelectionDropdown).should("have.length", 1);

        // Step 7: Add two more boards with names other than test
        cy.get(addBoardInput).type("boom");
        cy.get(addBoardButton).click();

        cy.get(addBoardInput).type("a board");
        cy.get(addBoardButton).click();

        // Assert that only three boards must be visible for the user to select
        cy.getDropdownSelectableItems(boardSelectionDropdown).should("have.length", 3);

        // Assert that test is the first board on the list
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().should("contain.text", "test");

        // Step 8: Try adding a board with the name test
        cy.get(addBoardInput).type("test");
        cy.get(addBoardButton).click();

        // Assert that no board is added
        cy.getDropdownSelectableItems(boardSelectionDropdown).should("have.length", 3);
        
        // Assert that the input is in error state
        cy.get(addBoardInput).should("have.class", "is-danger");

        // Step 9: Remove the character "t" from test making the board name now tes
        cy.get(addBoardInput).type("{backspace}");

        // Assert that the input is no longer in error state
        cy.get(addBoardInput).should("not.have.class", "is-danger");

        // Step 10: Hit the add button
        cy.get(addBoardButton).click();

        // Assert that the board-selector-dropdown on the navbar must be visible and active
        cy.get(boardSelectionDropdown).should("be.visible");
        cy.get(boardSelectionDropdown).should("have.class", "is-active");

        // Assert that the board-selector-dropdown-menu must be visible
        cy.get(boardSelectionDropdown).find(".dropdown-menu").should("be.visible");

        // Assert that the new board input is empty and not in error
        cy.get(addBoardInput).should("be.visible");
        cy.get(addBoardInput).should("not.have.class", "is-danger");
        cy.get(addBoardInput).should("have.value", "");

        // Assert that only three boards must be visible for the user to select
        cy.getDropdownSelectableItems(boardSelectionDropdown).should("have.length", 4);

        // Assert that tes is the last board on the list
        cy.getDropdownSelectableItems(boardSelectionDropdown).last().should("contain.text", "tes");

        // Step 11: Click on the board selector drop down
        cy.get(boardSelectionDropdown).click();

        // Assert for the board-selector-dropdown on the navbar is visible and not active
        cy.get(boardSelectionDropdown).should("be.visible");
        cy.get(boardSelectionDropdown).should("not.have.class", "is-active");
        cy.get(boardSelectionDropdown).find(".dropdown-menu").should("not.be.visible");

        // Assert that the dropdown display must read the prompt "Select A Board To View"
        cy.getDropdownDisplayElement(boardSelectionDropdown).should("contain.text", boardSelectionDropdownPlaceholder);
    });
})