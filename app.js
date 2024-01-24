// app.js

const apiEndpoint = 'https://fewd-todolist-api.onrender.com/tasks';
const apiKey = '1152'; // Replace with your actual API key

function fetchTasks() {
    $.ajax({
        url: `${apiEndpoint}?api_key=${apiKey}`,
        method: 'GET',
        success: function (tasks) {
            updateTaskList(tasks);
        }
    });
}

function updateTaskList(response) {
    const taskList = $('#taskList');
    taskList.empty();

    // Check if response contains a tasks property
    if (response && response.tasks && Array.isArray(response.tasks)) {
        const tasks = response.tasks;

        tasks.forEach(task => {
            const taskItem = $(`<li>${task.content}</li>`);
            const removeButton = $('<button>Remove</button>');
            const markButton = $('<button>Mark Complete/Active</button>');

            removeButton.on('click', function () {
                removeTask(task.id);
            });

            markButton.on('click', function () {
                markTask(task.id, !task.completed);
            });

            taskItem.append(removeButton, markButton);
            taskList.append(taskItem);
        });
    } else {
        // Handle the case where the response structure is unexpected
        console.error('Unexpected response format:', response);
    }
}



function removeTask(taskId) {
    $.ajax({
        url: `${apiEndpoint}/${taskId}?api_key=${apiKey}`,
        method: 'DELETE',
        success: function () {
            fetchTasks();
        }
    });
}

function markTask(taskId, isComplete) {
    const action = isComplete ? 'mark_complete' : 'mark_active';

    $.ajax({
        url: `${apiEndpoint}/${taskId}/${action}?api_key=${apiKey}`,
        method: 'PUT',
        success: function () {
            fetchTasks();
        }
    });
}

$('#addTask').on('click', function () {
    const taskInput = $('#taskInput');
    const newTask = taskInput.val().trim();

    if (newTask !== '') {
        $.ajax({
            url: `${apiEndpoint}?api_key=${apiKey}`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ content: newTask, due: new Date().toISOString() }),
            success: function () {
                fetchTasks();
                taskInput.val('');
            }
        });
    }
});

fetchTasks();
