    let todoList = document.querySelector(".todo-list");
    let input = document.getElementById("input");
    todoList.addEventListener("dblclick", editTask);
    
    let btn = document.getElementById("btn");
    btn.addEventListener("click", function() {
      addTask();
      input.value = "";
    });

    input.addEventListener("keydown", function(event) {
      if (event.key === 'Enter') {
      addTask();
      input.value = "";
      }
    });

      let delAllBtn = document.getElementById("clear");
      delAllBtn.addEventListener("click", function() {
      todoList.innerHTML = "";
      save();
      });

    function gettaskText() {
      return document.getElementById("input").value;
    };

    function createTaskElement(text, done = false) {
     let div = document.createElement("div");
     div.className = "task-div";

      div.classList.add(done ? 'done' : 'todo');

     let span = document.createElement("span");
     span.className = "task-span";
     span.textContent = text;
     div.append(span);

     if (done) {
      let undoBtn = document.createElement("button");
      undoBtn.classList.add('undo-btn');
      undoBtn.innerText ='Вернуть';
      div.append(undoBtn);

      let deleteBtn = document.createElement("button");
      deleteBtn.classList.add('delete-btn');
      deleteBtn.innerText = "Удалить";
      div.append(deleteBtn);

      undoBtn.addEventListener('click', undoTask);
      deleteBtn.addEventListener('click', deleteTask);
     } else {

     let doneBtn = document.createElement("button");
     doneBtn.innerText = "Завершить";
     doneBtn.classList.add("done-btn")
     div.append(doneBtn);
     doneBtn.addEventListener("click", doTask);
     }
      return div;
     } 

    function addTask() {
        let inputText = gettaskText();
        if (!inputText.trim()) return;
        todoList.append(createTaskElement(inputText));
        save();
      }
  
    function doTask(event) {
      let doneBtn = event.target;
      let div = event.target.closest('.task-div');
      div.classList.add('done');
      div.classList.remove('todo');
      doneBtn.remove();

      let undoBtn = document.createElement("button");
      undoBtn.classList.add('undo-btn');
      undoBtn.innerText = "Вернуть";
      div.append(undoBtn);

      let deleteBtn = document.createElement("button");
      deleteBtn.classList.add('delete-btn');
      deleteBtn.innerText = "Удалить";
      div.append(deleteBtn);

      undoBtn.addEventListener("click", undoTask);
      deleteBtn.addEventListener("click", deleteTask);
      save();
     }
     
    function undoTask(event) {
      let undoBtn = event.target;
      let div = event.target.closest('.task-div');
      div.classList.add('todo');
      div.classList.remove('done');
      undoBtn.remove();
      let deleteBtn = div.querySelector('.delete-btn');
      deleteBtn.remove();
      
      let doneBtn = document.createElement("button");
      doneBtn.classList.add("done-btn")
      doneBtn.innerText = "Завершить";
      div.append(doneBtn);
      doneBtn.addEventListener("click", doTask);
      save();
    }

    function deleteTask(event) {
      let deleteBtn = event.target;
      let div = event.target.closest('.task-div');
      div.remove();
      save();
    }

    function save() {
      let tasksArray = [];
      let divs = document.querySelectorAll(".task-div");
      for (let div of divs) {
        let text = div.querySelector('span').textContent;
        let status = div.classList.contains('done');
        tasksArray.push({text: text, done: status});
      }
       localStorage.setItem('tasks', JSON.stringify(tasksArray));
    }

    function load() {
      let tasks = localStorage.getItem('tasks');
      if (tasks) {
        let parsed = JSON.parse(tasks);
          for (let task of parsed) {
            let loaded = createTaskElement(task.text, task.done);
              todoList.append(loaded);
       }
      }
    }

    function editTask(event) {
      if (event.target.tagName === "SPAN" && event.target.classList.contains("task-span")) {
        function createRedactedSpan(text) {
          let redactedSpan = document.createElement('span');
          redactedSpan.classList.add('task-span');
          redactedSpan.innerText = text;
          return redactedSpan;
        }

        let taskSpan = event.target;
        let input = document.createElement("input");
        let oldText = taskSpan.textContent;
        input.classList.add('input-redact');
        input.value = taskSpan.textContent;
        taskSpan.parentNode.replaceChild(input, taskSpan);
        input.focus();
        

        let replaced = false;
        
        input.addEventListener("blur", function(){ 
          if (replaced) return;
          replaced = true;
          let redactedSpan = createRedactedSpan(input.value)
          input.parentNode.replaceChild(redactedSpan, input);
          save();
        });

        input.addEventListener("keyup", function(event) {

          if (event.key === 'Enter' && !replaced) {
            replaced = true;
            let redactedSpan = createRedactedSpan(input.value);
            input.parentNode.replaceChild(redactedSpan, input);
            save();
          }
        });

        input.addEventListener("keyup", function(event) {
          if (event.key === "Escape" && !replaced) {
            replaced = true;
            let redactedSpan = createRedactedSpan(oldText);
            input.parentNode.replaceChild(redactedSpan, input);
          }

        });
      }
    }


  load();

