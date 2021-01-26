const Todo = function () {
    const state = {
        theme: getItem('theme') ? getItem('theme') : 'dark',
        todoItem: getItem('todo') ? JSON.parse(getItem('todo')) : []
    }
    function getItem(key) {
        return localStorage.getItem(key);
    }
    const TodoItem = function (id, name, isComplete) {
        this.id = id;
        this.name = name;
        this.isComplete = isComplete;
        return () => {
            if (this.id && this.name) {
                return {
                    id: this.id,
                    name: this.name,
                    isComplete: this.isComplete
                }
            }
            return false;
        }
    }
    const addTodo = (obj) => {
        const storage = getItem('todo') ? JSON.parse(getItem('todo')) : [];
        const id = storage.length > 0 ? parseInt(storage[storage.length - 1].id) + 1: 1;
        const todo = new TodoItem(id, obj.name, obj.isComplete);
        if (todo()) {
            storage.push(todo());
            localStorage.setItem('todo', JSON.stringify(storage));
            state.todoItem = storage;
            return JSON.parse(getItem('todo'))
        }
        else {
            console.log('Faild to add todo');
            return false;
        }
    }
    const deleteTodo = (id) => {
        const todoItem = JSON.parse(getItem('todo'));
        const updatedTodo = [];
        todoItem.forEach(el => Number(el.id) !== Number(id) ? updatedTodo.push(el) : null);
        localStorage.setItem('todo', JSON.stringify(updatedTodo));
        state.todoItem = updatedTodo;
        return updatedTodo;
    }
    const markedComplete = id => {
        const todoList = state.todoItem;
        const marked = todoList.map(el => {
            if (parseInt(el.id) === parseInt(id)) {
                el.isComplete = true;
            }
            return el;
        });
        localStorage.setItem('todo', JSON.stringify(marked));
        state.todoItem = marked;
        return marked;
    }

    const selectTodoGroup = which => {
        const todoItem = state.todoItem;
        switch (which) {
            case 'all':
                const all = todoItem.map(el => el);
                return all;
            case 'active':
                const active = [];
                todoItem.forEach(el => {
                    if (!el.isComplete) {
                        active.push(el)
                    }
                });
                return active;
            case 'completed':
                const completed = [];
                todoItem.forEach(el => {
                    if (el.isComplete) {
                        completed.push(el)
                    }
                })
                return completed;
           
        }
    }
    const clearCompletedItem = () => {
        const todoItem = state.todoItem;
        const newTodo = [];
        todoItem.forEach(el => {
            if (!el.isComplete) {
                newTodo.push(el)
            }
        })
        localStorage.setItem('todo', JSON.stringify(newTodo));
        state.todoItem = newTodo;
        return newTodo;
    }
    return {
        setState: (name, value) => {
            state[name] = value;
            return state;
        },
        changeTheme: (theme) => {
            localStorage.setItem('theme', theme);
            state.theme = theme;
        },
        addTodo,
        deleteTodo,
        markedComplete,
        selectTodoGroup,
        clearCompletedItem,
        state,
    }
}

const App = function () {
    const DOMS = {
        btnTheme: document.querySelector('.theme-switcher'),
        dark: document.querySelectorAll('.dr'),
        app: document.querySelector('.th'),
        themeIcon: document.querySelector('.theme-switcher img'),
        input: document.querySelector('.input-todo'),
        iconEnter: document.querySelector('.icon-enter'),
        todoAddWrp: document.querySelector('.todo-add'),
        todoListWrp: document.querySelector('.item-list'),
        todoCount: document.querySelector('.todo-count'),
        btnAllAcCom: document.querySelectorAll('.act-attach button'),
        btnClearCompleted: document.querySelector('.btn-clear-completed')
    }
    const changeThemeIcon = theme => {
        theme === 'dark' ?
            DOMS.themeIcon.src = './images/icon-sun.svg'
            :
            DOMS.themeIcon.src = './images/icon-moon.svg'
    }
    const currentTheme = theme => {
        DOMS.app.classList.add(`theme-${theme}`);
        changeThemeIcon(theme)
        if (theme === 'dark') {
            DOMS.dark.forEach(el => el.classList.add('dark'))
        }
        else {
            DOMS.dark.forEach(el => el.classList.add('light'))
        }
    }
    const htmlMarkup = (props) =>{
        const markUp = `
        <li class="flex todo-${props.isComplete ? 'complete' : 'uncomplete'}" draggable="true" data-id=${props.id}>
        <div class="check-wrapper">
          <label for="todo-check">
            <input type="checkbox" name="checkmark" checked=${props.isComplete}>
            <span class="custome-check" data-id=${props.id}></span>
          </label>
        </div>
        <span>
            <p class="todo-title">${props.name}</p>
            <button class="btn-delete border-less"><img src="./images/icon-cross.svg" class="icon-delete" data-id=${props.id} alt="delete todo" /></button>
        </span>
      </li>`;
        return markUp;
    }
    const renderList = (arr) => {
        DOMS.todoListWrp.innerHTML = '';
        console.log(arr)
        if (!arr.length) {
            DOMS.todoListWrp.innerHTML = `<h1 class="first-time">You can add your task clicking above typing box.🙂💙❤</h1>`;
            DOMS.input.focus();
        }
        arr.forEach(el => {
            DOMS.todoListWrp.insertAdjacentHTML('beforeend', htmlMarkup(el));
        })
    }
    const reflectTheme = theme => {
        changeThemeIcon(theme)
        if (theme === 'dark') {
            DOMS.app.classList.replace('theme-light', 'theme-dark')
            DOMS.dark.forEach(el => el.classList.replace('light','dark'))
        } else {
            DOMS.app.classList.replace('theme-dark', 'theme-light')
            DOMS.dark.forEach(el => el.classList.replace('dark', 'light'))
        }
    }
    const alertMsg = (msg, type, where) =>{
        const markUp = `<div class=${type}>${msg}</div>`;
        const parent = where.insertAdjacentHTML('beforeend', markUp);
        setTimeout(() => { where.removeChild(where.lastChild)}, 5000);
        return parent;
    }

    return {
        Element: DOMS,
        reflectTheme,
        currentTheme,
        alertMsg,
        renderList,
    }
}

const Controller = (function (Todo, App) {
    // App state
    let state = Todo().state;
    // Html Element
    const element = App().Element;
    // Theme Switcher
    element.btnTheme.addEventListener('click', () => {
        const prevTheme = state.theme === 'dark' ? 'light' : 'dark';
        const setTheme = Todo().setState('theme', prevTheme);
        Todo().changeTheme(setTheme.theme);
        state = setTheme;
        App().reflectTheme(state.theme)
    });
    const getInput = () => {
        return {
            name: element.input.value,
            isComplete: false
        }
    }

    const addTodo = () => {
        const addTodo = Todo().addTodo(getInput())
        clearInput();
        state.todoItem = addTodo;
        App().renderList(state.todoItem)
        countTodo();
        console.log('Todo is added')
    }
    // When user press enter button
    element.input.addEventListener('keyup', eve => {
        element.todoAddWrp.querySelector('.danger') ? element.todoAddWrp.removeChild(element.todoAddWrp.lastChild) : null;
        if (eve.keyCode === 13) {
            if (eve.target.value) {
                addTodo()
            }
            else {
                App().alertMsg('Please enter todo name', 'danger', element.todoAddWrp);
                return;
            }
        }
        return;
    })
    // when user click right arrow
    element.iconEnter.addEventListener('click', () => {
        const value = element.input.value;
        if (value) {
            addTodo()
        }
        return;
    })

    // Delete Todo item
    element.todoListWrp.addEventListener('click', eve => {
        if (eve.target.classList.contains('icon-delete')) {
            const newTodo = Todo().deleteTodo(eve.target.dataset.id);
            state.todoItem = newTodo;
            App().renderList(state.todoItem);
            countTodo()
        }
    })

    // Marked Completed;
    element.todoListWrp.addEventListener('click', eve => {
        if (eve.target.classList.contains('custome-check')) {
            const id = eve.target.dataset.id;
            const marked = Todo().markedComplete(id);
            state.todoItem = marked;
            App().renderList(state.todoItem);
            countTodo();
        }
    })

    // All, Active, Completed Todo
    element.btnAllAcCom.forEach(el => {
        el.addEventListener('click', eve => {
            const label = eve.target.dataset.label;
            const getTodo = Todo().selectTodoGroup(label);
            const current = document.querySelector('.act-attach .active');
            current.classList.remove('active');
            el.classList.add('active')
            if (getTodo.length > 0) {
                App().renderList(getTodo);
            }
            else {
                App().alertMsg('0 item found', 'info', document.querySelector('.user-info'));
            }
        });
    })

    // Clear Completed Todo
    element.btnClearCompleted.addEventListener('click', () => {
        const newTodo = Todo().clearCompletedItem();
        state.todoItem = newTodo;
        App().renderList(state.todoItem);
    })
    //count active todo
    function countTodo(){
        let count = 0;
        if (state.todoItem) {
            state.todoItem.forEach(el => {
                if (!el.isComplete) {
                    count++;
                }
            })
        }
        element.todoCount.innerHTML = `${count} item${count > 1 ? 's' : ''} left`;
    }
    // Clear input
    function clearInput() {
        element.input.value = '';
    }
    
    // Drag and Drop
    window.addEventListener('DOMContentLoaded', () => {
        let dragged, where, parent;
        const dr = []
        element.todoListWrp.querySelectorAll('.flex').forEach(el => {
            dr.push(el)
        })
        dr.forEach(el => {
            el.addEventListener('dragstart', eve => {
                dragged = eve.target;
            })
        })
        element.todoListWrp.addEventListener('dragover', eve => {
            eve.preventDefault();
            where = eve.target;
        })
        element.todoListWrp.addEventListener('drag', eve => {
            eve.preventDefault();
            parent = eve.currentTarget;
        })
        element.todoListWrp.addEventListener('dragend', eve => {
            eve.preventDefault();
            const rs = [];
            parent.querySelectorAll('.flex').forEach(el => rs.push(el))
            const index = rs.findIndex(el => el.dataset.id === where.dataset.id);
            element.todoListWrp.insertBefore(dragged, element.todoListWrp.children[index])
            dragged = '', where = '', parent = '';
        })
        
    })

    return {
        init: () => {
            App().currentTheme(state.theme)
            countTodo()
            App().renderList(state.todoItem)
        } 
    }
})(Todo, App);

Controller.init()

