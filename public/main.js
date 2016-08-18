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
var changeId = 0;

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

// Post
function createTodo(title, callback) {
    fetch("/api/todo", {
        method: "post",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            title: title
        })
    }).then(function(response) {
          if (response.status !== 201) {
              error.textContent = "Failed to create item. Server returned " +
              response.status + " - " + response.statusText;
              return;
          }
          changeId++;
          callback();
      }).catch(function (error) {
          console.log("Request failed", error);
      });
}

// Get
function getTodoList(callback) {
    fetch("/api/todo").then(
        function(response) {
            if (response.status !== 200) {
                error.textContent = "Failed to get list. Server returned " +
                response.status + " - " + response.statusText;
                return;
            }
            response.json().then(function(data) {
                callback(data);
            });
        }).catch(function(err) {
        console.log("Fetch error - " + err);
    });
}

function deleteTodo() {
    var path = this.id.replace("delete_", "/api/todo/");
    sendDeleteRequest(path);
}

// Put
function completeTodo() {
    var complete = true;
    var path = this.id.replace("complete_", "/api/todo/");
    fetch(path, {
        method: "put",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            isComplete : complete
        })
    }).then(function(response) {
          if (response.status !== 200) {
              error.textContent = "Failed to update item. Server returned " +
              response.status + " - " + response.statusText;
              return;
          }
          changeId++;
          reloadTodoList();
      }).catch(function (error) {
          console.log("Request failed", error);
      });
}

function clearComplete() {
    var path = "/api/todo/complete";
    sendDeleteRequest(path);
}

// Delete
function sendDeleteRequest(path) {
    fetch(path, {
        method: "delete"
    }).then(function(response) {
              if (response.status !== 200) {
                  error.textContent = "Failed to delete list item. Server returned " +
                  response.status + " - " + response.statusText;
                  return;
              }
              changeId++;
              reloadTodoList();
          }).catch(function (error) {
              console.log("Request failed", error);
          });
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

function getLatestChangeId() {
    fetch("/api/changed").then(
        function(response) {
            response.json().then(function(data) {
                if (parseInt(data) !== changeId && changeId !== 0) {
                    reloadTodoList();
                }
                changeId = parseInt(data);
            });
        }).catch(function(err) {
        console.log("Fetch error - " + err);
    });
}

createButtons();
reloadTodoList();
var id = setInterval(getLatestChangeId, 10000);
