const input = document.getElementById('newTodo');
    const errorMsg = document.getElementById('inputError');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const tabs = document.querySelectorAll('.tabs button');
    const deleteDoneBtn = document.querySelector('.delete-done');
    const deleteAllBtn = document.querySelector('.delete-all');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(filter = currentFilter) {
      currentFilter = filter;
      taskList.innerHTML = '';

   
      tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.filter === filter);
      });

      tasks.forEach((task, index) => {
        if (filter === 'done' && !task.done) return;
        if (filter === 'todo' && task.done) return;

        const taskDiv = document.createElement('div');
        taskDiv.className = 'task' + (task.done ? ' done' : '');

        const text = document.createElement('span');
        text.textContent = task.text;

        const actions = document.createElement('div');
        actions.classList = 'actions';

        const toggle = document.createElement('i');
        toggle.className = task.done ? 'far fa-check-square' : 'far fa-square';
        toggle.title = 'Mark done';
        toggle.onclick = () => {
          task.done = !task.done;
          saveTasks();
          renderTasks();
        };
const edit = document.createElement('i');
        edit.className = 'fas fa-pen';
        edit.title = 'Edit task';
        edit.onclick = () => {
          const newText = prompt('Edit your task:', task.text);
          if (newText !== null) {
            const trimmed = newText.trim();
            const validation = validateInput(trimmed);
            if (validation) {
              alert(validation);
            } else {
              task.text = trimmed;
              saveTasks();
              renderTasks();
            }
          }
        };
 const remove = document.createElement('i');
        remove.className = 'fas fa-trash';
        remove.title = 'Delete task';
        remove.onclick = () => {
          tasks.splice(index, 1);
          saveTasks();
          renderTasks();
        };
        actions.appendChild(toggle);
        actions.appendChild(edit);
        actions.appendChild(remove);

        taskDiv.appendChild(text);
        taskDiv.appendChild(actions);
        taskList.appendChild(taskDiv);
      });
    }
function validateInput(text) {
      if (!text) return 'Task cannot be empty';
      if (!isNaN(text.charAt(0))) return 'Task must not start with a number';
      if (text.length < 5) return 'Task must be at least 5 characters';
      return '';
    }

    function addTask() {
      const text = input.value.trim();
      const validation = validateInput(text);
      errorMsg.textContent = validation;
      if (validation) return;
      tasks.push({ text, done: false });
      input.value = '';
      saveTasks();
      renderTasks();
    }
function deleteDoneTasks() {
      if (!tasks.some(task => task.done)) {
        alert('No done tasks to delete.');
        return;
      }
      tasks = tasks.filter(task => !task.done);
      saveTasks();
      renderTasks();
    }

    function deleteAllTasks() {
      if (!tasks.length) {
        alert('No tasks to delete.');
        return;
      }
      tasks = [];
      saveTasks();
      renderTasks();
    }
  tabs.forEach(tab => {
      tab.addEventListener('click', () => renderTasks(tab.dataset.filter));
    });

    addBtn.addEventListener('click', addTask);
    deleteDoneBtn.addEventListener('click', deleteDoneTasks);
    deleteAllBtn.addEventListener('click', deleteAllTasks);

    window.onload = () => renderTasks();

