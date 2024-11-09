/// <reference path="../support/commands.d.ts" /> 

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

    it("modify-board", () => {

        const boardSelectionDropdown = "#board-selection-dropdown";
        const boardSelectionDropdownPlaceholder = "Select A Board To View";
        const createBoard = "#create-board";
        const addBoardInput = "#create-board-input";
        const addBoardButton = "#create-board-button";

        // Step 2: Click on the board selector dropdown
        cy.get(boardSelectionDropdown).click();

        // Number of boards currently in the project must be zero
        cy.getDropdownSelectableItems(boardSelectionDropdown).should("have.length", 0);

        // board-selector-dropdown's display must read 'Select A Board To View'
        cy.getDropdownDisplayElement(boardSelectionDropdown).should("contain.text", boardSelectionDropdownPlaceholder);

        // Step 3: "Add a board by the name 'Test'"
        cy.get(addBoardInput).type("Test");
        cy.get(addBoardButton).click();

        // Number of boards currently in the project must be one and that board should be of name 'Test'
        cy.getDropdownSelectableItems(boardSelectionDropdown).should("have.length", 1);
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().should("contain.text", "Test");

        // The board Test should not be selected
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().should("not.have.class", "is-active");

        // board-selector-dropdown's display must read 'Select A Board To View'
        cy.getDropdownDisplayElement(boardSelectionDropdown).should("contain.text", boardSelectionDropdownPlaceholder);

        // Step 4: Click the selectable item 'Test' on the dropdown
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().click();

        // "board-selector-dropdown's display must read 'Test'"
        cy.getDropdownDisplayElement(boardSelectionDropdown).should("contain.text", 'Test');

        // The board-selector-dropdown on the navbar must be visible and not active
        cy.get(boardSelectionDropdown).should("be.visible");
        cy.get(boardSelectionDropdown).should("not.have.class", "is-active");
        cy.get(boardSelectionDropdown).find(".dropdown-menu").should("not.be.visible");

        // board-selector-dropdown's display must read 'Test'
        cy.getDropdownDisplayElement(boardSelectionDropdown).should("contain.text", 'Test');

        // Step 5: Click on the board selector dropdown
        cy.get(boardSelectionDropdown).click();

        // The item 'Test' must be selected
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().should("have.class", "is-active");

        // board-selector-dropdown's display must read 'Test'
        cy.getDropdownDisplayElement(boardSelectionDropdown).should("contain.text", 'Test');

        // Step 6: Click on edit name button
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().find('[data-test="edit-button"]').click();

        // The board name must be editable
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().should("contain.html", "input");

        // Step 7: modify the name to Boom!
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().find("input").focus().type('{selectAll}{del}Boom!');

        // The new name must be the value of the editable box
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().find("input").should("contain.value", "Boom!");

        // The item at large must still be selected
        cy.getDropdownSelectableItems(boardSelectionDropdown).should("have.length", 1);
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().should("have.class", "is-active");

        // Step 8: Hit the reset button
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().find("[data-test='edit-button']").click();

        // The value of the editable box must come back to 'Test'
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().find("input").should("contain.value", "Test");

        // Step 9: Hit finish
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().find("[data-test='action-button']").click();

        // The 'Test' item must still be selected
        cy.getDropdownSelectableItems(boardSelectionDropdown).should("have.length", 1);
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().should("have.class", "is-active");

        // The 'Test' value must no longer be editable
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().should("not.contain.html", "input");

        // Step 10: Create a new board 'kanban', select it and open the dropdown back up
        cy.get(addBoardInput).type("kanban");
        cy.get(addBoardButton).click();
        cy.getDropdownSelectableItems(boardSelectionDropdown).last().should("contain.text", "kanban");
        cy.getDropdownSelectableItems(boardSelectionDropdown).last().click();
        cy.get(boardSelectionDropdown).click();

        // The 'kanban' board must be selected
        cy.getDropdownSelectableItems(boardSelectionDropdown).filter(".is-active").should("contain.text", 'kanban');

        // board-selector-dropdown's display must read 'kanban'
        cy.getDropdownDisplayElement(boardSelectionDropdown).should("contain.text", "kanban");
        
        // Step 11: Hit the edit button again on the 'Test' item
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().find('[data-test="edit-button"]').click();

        // The text on the 'Test' item must be editable
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().should("contain.html", "input");

        // The 'Test' item must not be selected
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().should("not.have.class", "is-active");

        // board-selector-dropdown's display must read 'kanban'
        cy.getDropdownDisplayElement(boardSelectionDropdown).should("contain.text", "kanban");

        // Step 12: Change the name to something else
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().find("input").focus().type('{selectAll}{del}Boom!');

        // The new name must be the value of the editable box
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().find("input").should("contain.value", "Boom!");

        // The selected item must be 'kanban'
        cy.getDropdownSelectableItems(boardSelectionDropdown).filter(".is-active").should("contain.text", "kanban");

        // Step 13: Hit the reset button
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().find("[data-test='edit-button']").click();

        // The value of the editable box must come back to 'Test'
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().find("input").should("contain.value", "Test");

        // The 'kanban' item must still be selected
        cy.getDropdownSelectableItems(boardSelectionDropdown).filter(".is-active").should("contain.text", "kanban");

        // Step 14: Hit the finish button
        cy.getDropdownSelectableItems(boardSelectionDropdown).first().find("[data-test='action-button']").click();

        // The 'kanban' item must still be selected
        cy.getDropdownSelectableItems(boardSelectionDropdown).filter(".is-active").should("contain.text", "kanban");

        // board-selector-dropdown's display must read 'kanban'
        cy.getDropdownDisplayElement(boardSelectionDropdown).should("contain.text", "kanban");

        // Step 15: Hit the edit button again on the 'kanban' item
        cy.getDropdownSelectableItems(boardSelectionDropdown).filter(".is-active").find("[data-test='edit-button']").click();

        // The selected item must be 'kanban'
        cy.getDropdownSelectableItems(boardSelectionDropdown).filter(".is-active").find("input").should("contain.value", "kanban");

        // Step 16: Change the name to kanban plus todo and hit finish
        cy.getDropdownSelectableItems(boardSelectionDropdown).filter('.is-active').find("input").focus().type('{selectAll}{del}kanban plus todo');
        cy.getDropdownSelectableItems(boardSelectionDropdown).filter('.is-active').find("[data-test='action-button']").click();

        // The item kanban plus todo must be selected
        cy.getDropdownSelectableItems(boardSelectionDropdown).filter('.is-active').should("contain.text", "kanban plus todo");

        // The dropdown display must read 'kanban plus todo'
        cy.getDropdownDisplayElement(boardSelectionDropdown).should("contain.text", "kanban plus todo");
    });
})