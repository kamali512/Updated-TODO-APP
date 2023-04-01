let tasksList = [];
let isEditable = false;
let activeId = -1;
let taskId = 0;

const list = document.querySelector(".tasks-list");
const userInput = document.getElementById("user-input");
const selectAll = document.getElementById("select-all");
const filtersDropdown = document.getElementById("filters-dropdown");

const kerPressListener = (event) => {
    const { value } = document.getElementById("user-input");

    if (event.key === "Enter") {
        if (value === "") {
            alert("Please enter some text.");
            return;
        }
        const task = tasksList.find((t) => t.title === value);
        if (task) {
            alert("This item already exists.");
            return;
        }
        if (!isEditable) {
            addTask(value);
        } else {
            updateText(value);
        }
    }
};

document.addEventListener("keypress", kerPressListener)

const addTask = (taskText) => {
    const obj = {
        id: ++taskId,
        title: taskText,
        isCompleted: false,
        createAt: new Date().toLocaleDateString(),
    }
    tasksList.push(obj);
    setTaskItemUI(obj);
    resetInputField();
};



const updateTask = (id) => {
    const currentTask = tasksList.find((t) => t.id === id);

    userInput.value = currentTask.title;
    isEditable = true;
    activeId = id;
};

const updateText = (taskText) => {
    const currentTask = tasksList.find((t) => t.id === activeId);
    currentTask.title = taskText;
    const activeSpan = document.querySelector(`#item_${activeId} span`);
    activeSpan.innerText = taskText;
    isEditable = false;
    resetInputField();
}

const markAsComplete = (id) => {
    const currentTask = tasksList.find((t) => t.id === id);
    currentTask.isCompleted = !currentTask.isCompleted;
    const activeCheckbox = document.querySelector(`#item_${id} .checkbox`);
    activeCheckbox.classList.toggle("checkbox-filled");
    const currentTaskItem = document.querySelector(`#item_${id}`);
    currentTaskItem.classList.toggle("completed");
};

const deleteTask = (id) => {
    const isAllowed = confirm("Are you sure you want to delete this task?");
    if (!isAllowed) {
        return;
    }
    const index = tasksList.findIndex((t) => t.id === id);
    tasksList.splice(index, 1);
    const currentTaskItem = document.querySelector(`#item_${id}`);
    currentTaskItem.remove();
};




const resetInputField = () => {
    userInput.value = "";
}




const setTaskItemUI = (obj) => {
    const currentId = obj.id;
    const taskItem = document.createElement("li");
    taskItem.classList = "task-item";
    taskItem.id = `item_${currentId}`;
    taskItem.innerHTML = `<div class="checkbox" onclick="markAsComplete(${currentId})"></div>
    <span>${obj.title}
    </span>
    <button id="edit_${currentId}" onclick="updateTask(${currentId})">Edit</button>
    <button onclick="deleteTask(${currentId})">Delete</button>`;

    list.appendChild(taskItem);
}

const handleSelectAllChange = (event) => {
    const {checked} = event.target
    // console.log(checked);
    tasksList.forEach((t) => {
        t.isCompleted = checked;
        const activeCheckbox = document.querySelector(`#item_${t.id} .checkbox`);
        const currentTaskItem = document.querySelector(`#item_${t.id}`);

        checked
        ? activeCheckbox.classList.add("checkbox-filled")
        : activeCheckbox.classList.remove("checkbox-filled");

        checked
        ? currentTaskItem.classList.add("completed")
        :currentTaskItem.classList.remove("completed");
    });
};

selectAll.addEventListener("change",handleSelectAllChange);

const markItemAsComplete = (id) => {
    const activeCheckbox = document.querySelector(`#item_${id} .checkbox`);
    const currentTaskItem = document.querySelector(`#item_${id}`);

    activeCheckbox.classList.add("checkbox-filled");
    currentTaskItem.classList.add("completed");
};

const markItemAsInComplete = (id) => {
    const activeCheckbox = document.querySelector(`#item_${id} .checkbox`);
    const currentTaskItem = document.querySelector(`#item_${id}`);

    activeCheckbox.classList.remove("checkbox-filled");
    currentTaskItem.classList.remove("remove");

};

const handleFiltersChange = (e) => {
    const {value} = e.target;

    switch (value) {
        case "all":
            list.innerHTML = "";
            tasksList.forEach((t) => {
                setTaskItemUI(t);
                if (t.isCompleted) {
                    markItemAsComplete(t.id);
                } else {
                    markItemAsInComplete(t.id);
                }
            });
            break;

            case "completed":
                const completedTasks =tasksList.filter((t) => t.isCompleted === true);
                list.innerHTML = "";

                completedTasks.forEach((t) => {
                    setTaskItemUI(t);
                   markItemAsComplete(t.id);
                });
                if (completedTasks.length === 0) {
                    list.innerHTML = "<p><i>There are no Completed Tasks</i></p>"
                }

                break;

                case "pending":
                    const pendingTasks =tasksList.filter((t) => t.isCompleted === false);
                    list.innerHTML = "";
    
                    pendingTasks.forEach((t) => {
                        setTaskItemUI(t);
                       markItemAsInComplete(t.id);
                    });
                    if (pendingTasks.length === 0) {
                        list.innerHTML = "<p><i>There are no Completed Tasks</i></p>"
                    }
                    
                    break;

                    default:
                        console.log("all");
                        break;
    }
}

filtersDropdown.addEventListener("change",handleFiltersChange)