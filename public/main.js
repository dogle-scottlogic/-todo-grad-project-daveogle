var filter = "All";
var todoList = document.getElementById("todo-list");
var todoListPlaceholder = document.getElementById("todo-list-placeholder");
var form = document.getElementById("todo-form");
var todoTitle = document.getElementById("new-todo");
var error = document.getElementById("error");
var countLabel = document.getElementById("count-label");
var filterButtons = document.getElementById("filter_buttons");
var filterBar = document.getElementById("filter_bar");
var clearCompleteButton;
var filterAllButton;
var filterActiveButton;
var filterCompleteButton;

form.onsubmit = function(event) {
    var title = todoTitle.value;
    createTodo(title, function() {
        reloadTodoList();
    });
    todoTitle.value = "";
    event.preventDefault();
};

function createButtons() {
    clearCompleteButton = createButton("clearCompleteButton", "Clear Complete", "button");
    filterAllButton = createButton("All", "All", "button_selected");
    filterActiveButton = createButton("Active", "Active", "button");
    filterCompleteButton = createButton("Complete", "Complete", "button");

    filterButtons.appendChild(filterAllButton);
    filterButtons.appendChild(filterActiveButton);
    filterButtons.appendChild(filterCompleteButton);

    clearCompleteButton.onclick = clearComplete;
    filterActiveButton.onclick = filterList;
    filterCompleteButton.onclick = filterList;
    filterAllButton.onclick = filterList;
}

function filterList() {
    filter = this.id;
    filterAllButton.className = "button";
    filterActiveButton.className = "button";
    filterCompleteButton.className = "button";
    this.className = "button_selected";
    reloadTodoList();
}

function createTodo(title, callback) {
    var createRequest = new XMLHttpRequest();
    createRequest.open("POST", "/api/todo");
    createRequest.setRequestHeader("Content-type", "application/json");
    createRequest.send(JSON.stringify({
        title: title
    }));
    createRequest.onload = function() {
        if (this.status === 201) {
            callback();
        } else {
            error.textContent = "Failed to create item. Server returned " + this.status + " - " + this.responseText;
        }
    };
}

function getTodoList(callback) {
    var createRequest = new XMLHttpRequest();
    createRequest.open("GET", "/api/todo");
    createRequest.onload = function() {
        if (this.status === 200) {
            callback(JSON.parse(this.responseText));
        } else {
            error.textContent = "Failed to get list. Server returned " + this.status + " - " + this.responseText;
        }
    };
    createRequest.send();
}

function deleteTodo() {
    var path = this.id.replace("delete_", "/api/todo/");
    sendDeleteRequest(path);
}

function completeTodo() {
    var complete = true;
    var createRequest = new XMLHttpRequest();
    var path = this.id.replace("complete_", "/api/todo/");
    createRequest.open("PUT", path);
    createRequest.setRequestHeader("Content-type", "application/json");
    createRequest.send(JSON.stringify({
        isComplete : complete
    }));
    createRequest.onload = function() {
        if (this.status === 200) {
            reloadTodoList();
        } else {
            error.textContent = "Failed to update list item. Server returned " + this.status;
            error.textContent += " - " + this.responseText;
        }
    };
}

function clearComplete() {
    var path = "/api/todo/complete";
    sendDeleteRequest(path);
}

function sendDeleteRequest(path) {
    var createRequest = new XMLHttpRequest();
    createRequest.open("DELETE", path);
    createRequest.onload = function() {
        if (this.status === 200) {
            reloadTodoList();
        } else {
            error.textContent = "Failed to delete list item. Server returned " + this.status;
            error.textContent += " - " + this.responseText;
        }
    };
    createRequest.send();
}

function createListItem(todo) {
    if (filter === "All" || todo.isComplete && filter === "Complete" || !todo.isComplete && filter === "Active") {
        var listItem = document.createElement("li");
        listItem.textContent = todo.title;
        var deleteButton = createButton("delete_" + todo.id, "Delete", "button");
        var completeButton = createButton("complete_" + todo.id, "Complete", "button");
        deleteButton.onclick = deleteTodo;
        completeButton.onclick = completeTodo;
        listItem.appendChild(deleteButton);
        listItem.appendChild(completeButton);
        return listItem;
    }
    return null;
}

function reloadTodoList() {

    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }
    todoListPlaceholder.style.display = "block";
    getTodoList(function(todos) {
        var leftTodo = parseInt(todos.length);
        if (leftTodo > 0) {
            filterBar.style.display = "";
        } else {
            filterBar.style.display = "none";
        }
        todoListPlaceholder.style.display = "none";

        todos.forEach(function(todo) {
            var listItem = createListItem(todo);
            if (listItem !== null) {
                if (todo.isComplete) {
                    listItem.className = "todo_item_complete";
                    leftTodo --;
                }
                else {
                    listItem.className = "todo_item_incomplete";
                }
                todoList.appendChild(listItem);
            }
        });

        countLabel.textContent = "You have " + leftTodo + " tasks left to do!";
        if (leftTodo < todos.length) {
            todoList.appendChild(clearCompleteButton);
        }
    });
}

function createButton(id, text, className) {
    var button = document.createElement("button");
    button.innerHTML = text;
    button.setAttribute("id", id);
    button.className = className;
    return button;
}

createButtons();
reloadTodoList();
