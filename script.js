const taskForm = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const count = document.getElementById("task-count");
const statusMessage = document.getElementById("status-message");
const filterBtns = document.querySelectorAll(".filter-button");
const clearCompletedBtn = document.getElementById("clear-completed");
const formMessage = document.getElementById("form-message");
const tasks = [];

/**Filtering***/
// Global filter state
// Tracks which filter is active ("all", "active", or "completed").
let currentFilter = "all";

// handle form submition
taskForm.addEventListener("submit", (e) => {
  e.preventDefault(); //Prevents the browser from refreshing the page.

  const inputTask = input.value.trim(); //Removes unnecessary whitespace.

  if (!inputTask) {
    //if value is empty
    formMessage.textContent = "Please Enter a Task";
    return;
  }

  //task object
  const task = {
    id: Math.floor(e.timeStamp),
    taskToDo: inputTask,
    completed: false,
  };
  //added to Tasks array
  tasks.push(task);
  renderTasks();

  // clear field after submission
  input.value = "";
  formMessage.textContent = "Task Submitted ✅";
  setTimeout(() => {
    formMessage.textContent = "";
  }, 2000);
});

// Rendering Tasks
function renderTasks() {
  // clears current content
  list.innerHTML = "";
  // Create filtered collection based on currentFilter
  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === "active") {
      return !task.completed;
    }
    if (currentFilter === "completed") {
      return task.completed;
    }
    return true; // "all"
  });

  // Loop over filtered collection
  filteredTasks.forEach((task) => {
    let listItem = document.createElement("li");

    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", task.id);
    if (task.completed === true) {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }

    let label = document.createElement("label");
    label.htmlFor = task.id;
    label.textContent = task.taskToDo;

    listItem.append(checkbox);
    listItem.append(label);
    list.append(listItem);

    // checkbox change listener
    checkbox.addEventListener("change", (e) => {
      const checkboxTarget = e.target; // clicked checkbox
      const taskId = Number(checkboxTarget.id); // task ID
      const task = tasks.find((item) => item.id === taskId); // find matching task by ID
      if (task) {
        task.completed = checkboxTarget.checked; // reads the state of the checkbox and set that boolean to .completed
        renderTasks();
      }
    });
  });
  //tasks count
  count.textContent = `${filteredTasks.length} ${filteredTasks.length === 1 ? "Task" : "Tasks"}`;
}

//filter buttons listener
filterBtns.forEach((button) => {
  button.addEventListener("click", function () {
    const dataFilter = button.getAttribute("data-filter");
    currentFilter = dataFilter;
    filterBtns.forEach((button) => {
      button.classList.remove("is-active");
      button.ariaPressed = false;
    });
    button.classList.add("is-active");
    button.ariaPressed = true;
    renderTasks();
  });
});
