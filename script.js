// Retrieve from local storage or Initialize an empty array
let todo = JSON.parse(localStorage.getItem("todo")) || [];
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const addButton = document.getElementById("addButton");
const deleteButton = document.getElementById("deleteButton");

// Let us Begin
document.addEventListener("DOMContentLoaded", function () {
    addButton.addEventListener("click", addTask);
    todoInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addTask();
        }
    });
    deleteButton.addEventListener("click", deleteAllTasks);
    displayTasks();
});

function addTask() {
    const newTask = todoInput.value.trim();
    if (newTask !== "") {
        // Add the new task at the top of the array
        todo.unshift({
            text: newTask,
            disabled: false,
            status: "Pending"
        });
        saveToLocalStorage();
        todoInput.value = "";
        displayTasks();
    }
}

function deleteAllTasks() {
    todo = [];
    saveToLocalStorage();
    displayTasks();
}

function deleteTask(index) {
    todo.splice(index, 1);
    saveToLocalStorage();
    displayTasks();
}

function displayTasks() {
    // Clear the task list first
    todoList.innerHTML = "";

    // Iterate in reverse to show the newest tasks at the top
    for (let index = 0; index < todo.length; index++) {
        const item = todo[index];

        const tr = document.createElement("tr");

        const tdCheckbox = document.createElement("td");
        tdCheckbox.innerHTML = `
            <input type="checkbox" class="todo-checkbox" 
            id="input-${index}" ${item.disabled ? "checked" : ""}>
            <span id="todo-${index}" class="${item.disabled ? "disabled" : ""}"
            onclick="editTask(${index})">${item.text}</span>
        `;
        tdCheckbox.querySelector(".todo-checkbox").addEventListener("change", () => {
            toggleTask(index);
        });

        const tdStatus = document.createElement("td");
        tdStatus.innerHTML = `<span class="status">${item.status}</span>`;

        const tdDelete = document.createElement("td");
        tdDelete.innerHTML = `<button class="delete-btn" onclick="deleteTask(${index})">&times;</button>`;

        tr.appendChild(tdCheckbox);
        tr.appendChild(tdStatus);
        tr.appendChild(tdDelete);

        // Add each row to the top of the table
        todoList.appendChild(tr);
    }
}

function editTask(index) {
    const todoItem = document.getElementById(`todo-${index}`);
    const existingText = todo[index].text;
    const inputElement = document.createElement("input");

    inputElement.value = existingText;
    inputElement.classList.add('form-control');
    inputElement.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const updatedText = inputElement.value.trim();
            if (updatedText) {
                todo[index].text = updatedText;
                saveToLocalStorage();
                displayTasks();
            }
        }
    });

    todoItem.replaceWith(inputElement);
    inputElement.focus();

    inputElement.addEventListener("blur", function () {
        const updatedText = inputElement.value.trim();
        if (updatedText) {
            todo[index].text = updatedText;
            saveToLocalStorage();
        }
        displayTasks();
    });
}

function toggleTask(index) {
    todo[index].disabled = !todo[index].disabled;
    todo[index].status = todo[index].disabled ? "Completed" : "Pending";

    // Move completed tasks to the bottom
    const task = todo.splice(index, 1)[0];
    if (task.disabled) {
        todo.push(task);
    } else {
        todo.unshift(task);
    }

    saveToLocalStorage();
    displayTasks();
}

function saveToLocalStorage() {
    localStorage.setItem("todo", JSON.stringify(todo));
}
