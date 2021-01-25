const Todo = function () {
    const state = {
        theme: localStorage.getItem('theme') ? localStorage.getItem('theme') : 'dark',
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
        state,
    }
}

const App = function () {
    const DOMS = {
        btnTheme: document.querySelector('.theme-switcher'),
        dark: document.querySelectorAll('.dr'),
        app: document.querySelector('.th'),
        themeIcon: document.querySelector('.theme-switcher img')
    }
    const currentTheme = theme => {
        DOMS.app.classList.add(`theme-${theme}`);
        if (theme === 'dark') {
            DOMS.dark.forEach(el => el.classList.add('dark'))
        }
        else {
            DOMS.dark.forEach(el => el.classList.add('light'))
        }
    }
    const reflectTheme = theme => {
        const themeIcon = theme === 'dark' ? DOMS.themeIcon.src = './images/icon-sun.svg' : DOMS.themeIcon.src = './images/icon-moon.svg'
        if (theme === 'dark') {
            DOMS.app.classList.replace('theme-light', 'theme-dark')
            DOMS.dark.forEach(el => el.classList.replace('light','dark'))
        } else {
            DOMS.app.classList.replace('theme-dark', 'theme-light')
            DOMS.dark.forEach(el => el.classList.replace('dark', 'light'))
        }
    }
    return {
        Element: DOMS,
        reflectTheme,
        currentTheme
    }
}

const Controller = (function (Todo, App) {
    // App state
    let state = Todo().state;
    // Html Element
    const element = App().Element;
    // Theme Switcher
    element.btnTheme.addEventListener('click', eve => {
        const prevTheme = state.theme === 'dark' ? 'light' : 'dark';
        const setTheme = Todo().setState('theme', prevTheme);
        Todo().changeTheme(setTheme.theme);
        state = setTheme;
        App().reflectTheme(state.theme)
    })

    return {
        theme:()=> App().currentTheme(state.theme)
    }
})(Todo, App);

Controller.theme()

