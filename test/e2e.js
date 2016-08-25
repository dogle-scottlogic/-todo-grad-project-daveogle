var testing = require("selenium-webdriver/testing");
var assert = require("chai").assert;
var helpers = require("./e2eHelpers");

testing.describe("end to end", function() {
    this.timeout(20000);
    testing.before(helpers.setupDriver);
    testing.beforeEach(helpers.setupServer);
    testing.afterEach(helpers.teardownServer);
    testing.after(function() {
        helpers.teardownDriver();
        //helpers.reportCoverage();
    });

    // Page load
    testing.describe.only("on page load", function() {
        testing.it("displays TODO title", function() {
            helpers.navigateToSite();
            helpers.getTitleText().then(function(text) {
                assert.equal(text, "TODO List");
            });
        });
        testing.it("displays empty TODO list", function() {
            helpers.navigateToSite();
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 0);
            });
        });
        testing.it("displays an error if the request fails", function() {
            helpers.setupErrorRoute("get", "/api/todo");
            helpers.navigateToSite();
            helpers.getErrorText().then(function(text) {
                assert.equal(text, "Failed to get list. Server returned 500 - Internal Server Error");
            });
        });
    });

    // Create
    testing.describe("on create todo item", function() {
        testing.it("clears the input field", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.getInputText().then(function(value) {
                assert.equal(value, "");
            });
        });
        testing.it("adds the todo item to the list", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 1);
            });
        });
        testing.it("displays an error if the request fails", function() {
            helpers.setupErrorRoute("post", "/api/todo");
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.getErrorText().then(function(text) {
                assert.equal(text, "Failed to create item. Server returned 500 - Internal Server Error");
            });
        });
        testing.it("can be done multiple times", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.addTodo("Another new todo item");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 2);
            });
        });
    });

    //Delete
    testing.describe("on delete todo item", function() {
        testing.it("deletes the todo item from the list", function() {
            helpers.navigateToSite();
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 0);
            });
            helpers.addTodo("New todo item");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 1);
            });
            helpers.deleteTodo("delete_0");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 0);
            });
        });
        testing.it("displays an error if the request fails", function() {
            helpers.setupErrorRoute("delete", "/api/todo/0");
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 1);
            });
            helpers.deleteTodo("delete_0");
            helpers.getErrorText().then(function(text) {
                assert.equal(text, "Failed to delete list item. Server returned 500 - Internal Server Error");
            });
        });
        testing.it("can delete multiple items", function() {
            helpers.navigateToSite();
            for (var i = 0; i < 11; i++) {
                helpers.addTodo("New todo item" + i);
            }
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 11);
            });
            helpers.deleteTodo("delete_10");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 10);
            });
            helpers.deleteTodo("delete_0");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 9);
            });
        });
        testing.it("can delete one item from a list", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.addTodo("Another new todo item");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 2);
            });
            helpers.deleteTodo("delete_0");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 1);
            });
            helpers.elementExistsById("delete_0").then(function(result) {
                assert.isFalse(result);
            });
            helpers.elementExistsById("delete_1").then(function(result) {
                assert.isTrue(result);
            });
        });
    });

    // Update
    testing.describe("on complete todo item", function() {
        testing.it("changes the formating of the list item when complete is clicked", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 1);
            });
            helpers.getTodoList().then(function(elements) {
                helpers.getElementClass(elements[0]).then(function(className) {
                    assert.equal(className, "todo_item_incomplete");
                });
            });
            helpers.completeTodo("complete_0");
            helpers.getTodoList().then(function(elements) {
                helpers.getElementClass(elements[0]).then(function(className) {
                    assert.equal(className, "todo_item_complete");
                });
            });
        });
        testing.it("does not change the formating of the list item when complete is not clicked", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.addTodo("New todo item");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 2);
            });
            helpers.getTodoList().then(function(elements) {
                helpers.getElementClass(elements[0]).then(function(className) {
                    assert.equal(className, "todo_item_incomplete");
                });
            });
            helpers.completeTodo("complete_1");
            helpers.getTodoList().then(function(elements) {
                helpers.getElementClass(elements[0]).then(function(className) {
                    assert.equal(className, "todo_item_incomplete");
                });
            });
        });
    });

    //Count Display
    testing.describe("On updating incomplete counter message", function() {
        testing.it("should start at 0", function() {
            helpers.navigateToSite();
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 0);
            });
            helpers.getCounterMessage().then(function(message) {
                assert.equal(message, "You have 0 tasks left to do!");
            });
        });
        testing.it("should increment with each task added", function() {
            helpers.navigateToSite();
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 0);
            });
            for (var i = 0; i < 10; i++) {
                helpers.addTodo("New todo " + i);
            }
            helpers.getCounterMessage().then(function(message) {
                assert.equal(message, "You have 10 tasks left to do!");
            });
        });
        testing.it("should decrement with each incomplete task removed", function() {
            helpers.navigateToSite();
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 0);
            });
            for (var i = 0; i < 10; i++) {
                helpers.addTodo("New todo " + i);
            }
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 10);
            });
            helpers.deleteTodo("delete_9");
            helpers.getCounterMessage().then(function(message) {
                assert.equal(message, "You have 9 tasks left to do!");
            });
            helpers.deleteTodo("delete_8");
            helpers.getCounterMessage().then(function(message) {
                assert.equal(message, "You have 8 tasks left to do!");
            });
        });
        testing.it("should decrement with each task completed", function() {
            helpers.navigateToSite();
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 0);
            });
            for (var i = 0; i < 10; i++) {
                helpers.addTodo("New todo " + i);
            }
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 10);
            });
            helpers.completeTodo("complete_9");
            helpers.getCounterMessage().then(function(message) {
                assert.equal(message, "You have 9 tasks left to do!");
            });
            helpers.completeTodo("complete_8");
            helpers.getCounterMessage().then(function(message) {
                assert.equal(message, "You have 8 tasks left to do!");
            });
        });
        testing.it("should not decrement with each complete task removed", function() {
            helpers.navigateToSite();
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 0);
            });
            for (var i = 0; i < 10; i++) {
                helpers.addTodo("New todo " + i);
            }
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 10);
            });
            helpers.deleteTodo("delete_9");
            helpers.getCounterMessage().then(function(message) {
                assert.equal(message, "You have 9 tasks left to do!");
            });
            helpers.completeTodo("complete_8");
            helpers.getCounterMessage().then(function(message) {
                assert.equal(message, "You have 8 tasks left to do!");
            });
            helpers.deleteTodo("delete_8");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 8);
            });
            helpers.getCounterMessage().then(function(message) {
                assert.equal(message, "You have 8 tasks left to do!");
            });
        });
    });

    // Delete all completed tasks
    testing.describe("On deleting completed tasks", function() {
        testing.it("delete completed button should not exist when no tasks are complete", function() {
            helpers.navigateToSite();
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 0);
            });
            helpers.elementExistsById("clearCompleteButton").then(function(result) {
                assert.isFalse(result);
            });
            for (var i = 0; i < 10; i++) {
                helpers.addTodo("New todo " + i);
            }
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 10);
            });
            helpers.elementExistsById("clearCompleteButton").then(function(result) {
                assert.isFalse(result);
            });
        });
        testing.it("delete completed button should exist when one or more task is complete", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo 1");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 1);
            });
            helpers.completeTodo("complete_0");
            helpers.pauseTest(500).then(function () {
                helpers.elementExistsById("clearCompleteButton").then(function(result) {
                    assert.isTrue(result);
                });
            });
            helpers.addTodo("New todo 2");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 2);
            });
            helpers.completeTodo("complete_1");
            helpers.pauseTest(500).then(function () {
                helpers.elementExistsById("clearCompleteButton").then(function(result) {
                    assert.isTrue(result);
                });
            });
        });
        testing.it("delete completed button should disapear when complete tasks are removed", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo 1");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 1);
            });
            helpers.completeTodo("complete_0");
            helpers.pauseTest(500).then(function () {
                helpers.deleteTodo("delete_0");
                helpers.getTodoList().then(function(elements) {
                        assert.equal(elements.length, 0);
                    });
                helpers.elementExistsById("clearCompleteButton").then(function(result) {
                    assert.isFalse(result);
                });
            });
        });
        testing.it("Tasks should be removed when dc buttons is pressed, leaving incomplete tasks", function() {
            helpers.navigateToSite();
            for (var i = 0; i < 10; i++) {
                helpers.addTodo("New todo " + i);
            }
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 10);
            });
            helpers.completeTodo("complete_0");
            helpers.pauseTest(500).then(function() {
                helpers.completeTodo("complete_1");
            });
            helpers.pauseTest(500).then(function () {
                helpers.deleteCompleted();
            });
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 8);
            });
        });
        testing.it("All tasks should be removed when dc buttons is pressed and all tasks complete", function() {
            helpers.navigateToSite();
            for (var i = 0; i < 10; i++) {
                helpers.addTodo("New todo " + i);
            }
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 10);
            });
            helpers.completeTodo("complete_0");
            helpers.pauseTest(500).then(function() {
                helpers.completeTodo("complete_1");
            });
            helpers.pauseTest(500).then(function() {
                helpers.completeTodo("complete_2");
            });
            helpers.pauseTest(500).then(function() {
                helpers.completeTodo("complete_3");
            });
            helpers.pauseTest(500).then(function() {
                helpers.completeTodo("complete_4");
            });
            helpers.pauseTest(500).then(function() {
                helpers.completeTodo("complete_5");
            });
            helpers.pauseTest(500).then(function() {
                helpers.completeTodo("complete_6");
            });
            helpers.pauseTest(500).then(function() {
                helpers.completeTodo("complete_7");
            });
            helpers.pauseTest(500).then(function() {
                helpers.completeTodo("complete_8");
            });
            helpers.pauseTest(500).then(function() {
                helpers.completeTodo("complete_9");
            });
            helpers.pauseTest(500).then(function () {
                helpers.deleteCompleted();
            });
            helpers.pauseTest(500).then(function() {
                helpers.getTodoList().then(function(elements) {
                    assert.equal(elements.length, 0);
                });
            });
        });
    });

    // Filter buttons
    testing.describe("On selecting a filter", function() {
        testing.it("no filter option should be visable with no todo items", function() {
            helpers.navigateToSite();
            helpers.elementExistsById("filter_bar").then(function(exist) {
                assert.isFalse(exist);
            });
        });
        testing.it("all filter options should be visable with one or more todo item", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo");
            helpers.getElementStyleById("filter_bar").then(function(style) {
                assert.equal(style, "");
            });
        });
        testing.it("'All' filter option should be selected by default", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo");
            helpers.getSelectedFilterButton().then(function(selected) {
                assert.equal(selected, "All");
            });
        });
        testing.it("'All' filter option should show complete and active todos", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo 0");
            helpers.addTodo("New todo 1");
            helpers.addTodo("New todo 2");
            helpers.addTodo("New todo 3");
            helpers.pauseTest(500).then(function() {
                helpers.completeTodo("complete_0");
            });
            helpers.pauseTest(500).then(function() {
                helpers.completeTodo("complete_1");
            });
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 4);
            });
            helpers.filterAll();
            helpers.pauseTest(500).then(function() {
                helpers.getTodoList().then(function(elements) {
                    assert.equal(elements.length, 4);
                });
            });
        });
        testing.it("'Active' filter should be selected when pressed and All should be deselected", function () {
            helpers.navigateToSite();
            helpers.addTodo("New todo 0");
            helpers.getSelectedFilterButton().then(function(selected) {
                assert.equal(selected, "All");
            });
            helpers.filterActive();
            helpers.getSelectedFilterButton().then(function(selected) {
                assert.equal(selected, "Active");
            });
        });
        testing.it("'Active' option with some Complete removes all Complete and clear complete button", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo 0");
            helpers.addTodo("New todo 1");
            helpers.addTodo("New todo 2");
            helpers.addTodo("New todo 3");
            helpers.pauseTest(500).then(function() {
                helpers.completeTodo("complete_0");
            });
            helpers.pauseTest(500).then(function() {
                helpers.completeTodo("complete_1");
            });
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 4);
            });
            helpers.filterActive();
            helpers.pauseTest(500).then(function() {
                helpers.getTodoList().then(function(elements) {
                    assert.equal(elements.length, 2); // Assert that two items were removed
                    helpers.getElementClass(elements[0]).then(function(className) {
                        // Assert that the remaining todos are incomplete
                        assert.equal(className, "todo_item_incomplete");
                    });
                });
                helpers.elementExistsById("clearCompleteButton").then(function(result) {
                    assert.isFalse(result); // Assert that the clear complete button has been removed
                });
            });
        });
        testing.it("'Active' filter option with all complete removes all todos and clear complete button", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo 0");
            helpers.addTodo("New todo 1");
            helpers.addTodo("New todo 2");
            helpers.addTodo("New todo 3");
            helpers.pauseTest(500).then(function() {
                helpers.completeTodo("complete_0");
            });
            helpers.pauseTest(500).then(function() {
                helpers.completeTodo("complete_1");
            });
            helpers.pauseTest(500).then(function() {
                helpers.completeTodo("complete_2");
            });
            helpers.pauseTest(500).then(function() {
                helpers.completeTodo("complete_3");
            });
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 4);
            });
            helpers.filterActive();
            helpers.pauseTest(500).then(function() {
                helpers.getTodoList().then(function(elements) {
                    assert.equal(elements.length, 0); // Assert that two items were removed
                });
                helpers.elementExistsById("clearCompleteButton").then(function(result) {
                    assert.isFalse(result); // Assert that the clear complete button has been removed
                });
            });
        });
        testing.it("'Complete' filter should be selected when pressed and All should be deselected", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo 0");
            helpers.getSelectedFilterButton().then(function(selected) {
                assert.equal(selected, "All");
            });
            helpers.filterComplete();
            helpers.getSelectedFilterButton().then(function(selected) {
                assert.equal(selected, "Complete");
            });
        });
        testing.it("'Complete' filter option should remove all Active todos and not clear complete button", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo 0");
            helpers.addTodo("New todo 1");
            helpers.addTodo("New todo 2");
            helpers.addTodo("New todo 3");
            helpers.pauseTest(500).then(function() {
                helpers.completeTodo("complete_0");
            });
            helpers.pauseTest(500).then(function() {
                helpers.completeTodo("complete_1");
            });
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 4);
            });
            helpers.filterComplete();
            helpers.pauseTest(500).then(function() {
                helpers.getTodoList().then(function(elements) {
                    assert.equal(elements.length, 2); // Assert that two items were removed
                    helpers.getElementClass(elements[0]).then(function(className) {
                        // Assert that the remaining todos are complete
                        assert.equal(className, "todo_item_complete");
                    });
                });
                helpers.elementExistsById("clearCompleteButton").then(function(result) {
                    assert.isTrue(result); // Assert that the clear complete button has been removed
                });
            });
        });
        testing.it("'Complete' filter option should remove all todos if all are active", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo 0");
            helpers.addTodo("New todo 1");
            helpers.addTodo("New todo 2");
            helpers.addTodo("New todo 3");
            helpers.pauseTest(500).then(function() {
                helpers.filterComplete();
                helpers.pauseTest(500).then(function() {
                    helpers.getTodoList().then(function(elements) {
                        assert.equal(elements.length, 0); // Assert that two items were removed
                    });
                    helpers.elementExistsById("clearCompleteButton").then(function(result) {
                        assert.isFalse(result); // Assert that the clear complete button has been removed
                    });
                });
            });
        });
        testing.it("Pressing a filter twice should change nothing the second time", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo 0");
            helpers.filterAll();
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 1);
            });
            helpers.filterActive();
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 1);
            });
            helpers.filterActive();
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 1);
            });
            helpers.filterComplete();
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 0);
            });
            helpers.filterComplete();
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 0);
            });
        });
    });
});
