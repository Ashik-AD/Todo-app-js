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
        const id = storage.length + 1;
        const todo = new TodoItem(id, obj.name, obj.isComplete);
        if (todo()) {
            storage.push(todo());
            localStorage.setItem('todo', JSON.stringify(storage));
            todoItem = storage;
            return JSON.parse(getItem('todo'))
        }
        else {
            console.log('Faild to add todo');
            return false;
        }
    }
    const deleteTodo = (id) => {
        console.log(id)
        const todoItem = JSON.parse(getItem('todo'));
        const updatedTodo = [];
        todoItem.forEach(el => Number(el.id) !== Number(id) ? updatedTodo.push(el) : null);
        localStorage.setItem('todo', JSON.stringify(updatedTodo));
        return updatedTodo;
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
        todoCount: document.querySelector('.todo-count')
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
        <li class="flex todo-${props.isComplete}">
        <div class="check-wrapper">
          <label for="todo-check">
            <input type="checkbox" name="checkmark">
            <span class="custome-check"></span>
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
    })
    const getInput = () => {
        return {
            name: element.input.value,
            isComplete: false
        }
    }
    // When user press enter button
    element.input.addEventListener('keyup', eve => {
        element.todoAddWrp.querySelector('.danger') ? element.todoAddWrp.removeChild(element.todoAddWrp.lastChild) : null;
        if (eve.keyCode === 13) {
            if (eve.target.value) {
                const addTodo = Todo().addTodo(getInput())
                clearInput();
                state.todoItem = addTodo;
                App().renderList(state.todoItem)
                console.log('Todo is added')
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
            Todo().addTodo(getInput())
            clearInput()
            console.log('Todo is added')
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

    //count activ todo
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
    return {
        init: () => {
            App().currentTheme(state.theme)
            countTodo()
            App().renderList(state.todoItem)
        } 
    }
})(Todo, App);

Controller.init()

