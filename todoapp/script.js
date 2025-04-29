const todoForm = document.querySelector('form');
const input = document.getElementById('todo-input');
const todoListUl = document.getElementById('todo-list');
const overlayMedia = document.querySelector('.chatbot-overlay');


var  state = [];
let selectedDate = null; 
const phrases = [
    "Add a new task...",
    "What do you need to do?",
    "Type your todo here...",
    "Don't forget to check it off!",
    "Make your day productive!"
];

let currentPhraseIndex = 0;
let currentCharIndex = 0;
let typingInterval;
let deletingInterval;


todoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addTodo();
});

function loadStateFromHardDisk() {
    const savedState = localStorage.getItem('state');
    if (savedState) {
        state = JSON.parse(savedState);
    }
    return state;
}

function saveStateHardDisk() {
    localStorage.setItem('state', JSON.stringify(state));
    renderCalendar(currentDate);
}

loadStateFromHardDisk();

function addTodo() {
    const text = input.value.trim();
    if (text) {
        const newId = Math.random();
        const newTodo = {
            id: newId,
            done: false,
            text: text,
            dueDate: null 
        };
        state.push(newTodo);
        saveStateHardDisk();
        BuildTheDom(state);
        checkDates();
        input.value = '';
    }
}

function createTodo(todotext, checked, id, dueDate) {
    const todoLi = document.createElement('li');
    todoLi.className = "todo";
    todoLi.id = id;
    todoLi.draggable = true;

    if (checked) {
        todoLi.classList.add('completed');
    }

    const checkboxElement = document.createElement('input');
    checkboxElement.type = 'checkbox';
    checkboxElement.checked = checked;
    checkboxElement.id = `checkbox-${id}`;

    const label = document.createElement('label');
    label.className = "custom-checkbox";
    label.setAttribute("for", `checkbox-${id}`);
    label.innerHTML = `
        <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
        </svg>
    `;

    checkboxElement.addEventListener("change", function () {
        const index = state.findIndex(item => item.id === id);

        if (index != -1) {
            state[index].done = this.checked;
            saveStateHardDisk();
            checkDates();
        }
    });

    const textLabel = document.createElement('label');
    textLabel.className = 'todo-text';
    textLabel.textContent = todotext;

    const dueDateContainer = document.createElement('div');
    dueDateContainer.className = 'due-date';
    if (dueDate) {
        const date = new Date(dueDate);
        dueDateContainer.textContent = `Due: ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;

        const marker = document.createElement('span');
        marker.className = 'has-todo-marker';

        dueDateContainer.appendChild(marker);
    }


    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerHTML = `
        <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>
    `;

    deleteButton.onclick = function () {
        deleteLi(id);
    };

    const addButton = document.createElement('button');
    const icon = document.createElement('span');
    icon.classList.add('material-symbols-outlined');
    addButton.className = 'addBtn';
    icon.textContent = 'add';
    addButton.appendChild(icon);

    addButton.onclick = function (e) {
        e.stopPropagation();
        selectedDate = {
            id: id,
            text: todotext
        };

        const style = window.getComputedStyle(document.getElementById('calendar'));
        if(style.display === 'block'){
            alert('Select a due date!');
        }
        
        calendarContainer.style.display = 'block';
        
    };

    
    if (dueDate) {
        const date = new Date(dueDate);
        const dayDivs = document.querySelectorAll('.days div');
        dayDivs.forEach(dayDiv => {
            if (parseInt(dayDiv.textContent) === date.getDate() && 
                date.getMonth() === new Date().getMonth() && 
                date.getFullYear() === date.getFullYear()) {
                dayDiv.classList.add('highlight');
            }
        });
        checkDates();
    }

    todoLi.appendChild(checkboxElement);
    todoLi.appendChild(label);
    todoLi.appendChild(textLabel);
    todoLi.appendChild(dueDateContainer);
    todoLi.appendChild(addButton);
    todoLi.appendChild(deleteButton);

    return todoLi;
}

function deleteLi(id) {
    const element = document.getElementById(id);
    if (!element) return;

    element.style.transition = 'transform 0.3s ease, opacity 0.3s ease-out';
    element.style.transform = 'translateX(100%)';
    element.style.opacity = '0';

    element.addEventListener('transitionend', function() {
        const index = state.findIndex(e => e.id === id);
        if (index !== -1) {
            state.splice(index, 1);
            saveStateHardDisk();

            setTimeout(() => {
                BuildTheDom(state);
            }, 100); 

            checkDates();
        }

        
    }, { once: true });
}

function getToDoListFromDOM() {
    return document.getElementById('todo-list');
}

function BuildTheDom(state) {
    
    const ulInDOM = getToDoListFromDOM();

    ulInDOM.replaceChildren()

    for (let todo of state) {
        const liElement = createTodo(todo.text, todo.done, todo.id, todo.dueDate);
        ulInDOM.appendChild(liElement);
    }
    checkDates();
    
}

const calendarBtn = document.getElementById('calendar-btn');
const calendarContainer = document.getElementById('calendar');
const menu = document.getElementById("sidebar");
const overlay = document.querySelector('.overlay');


calendarBtn.addEventListener('click', function () {

    calendarContainer.style.display = 'block';
    menu.classList.remove('active');

    overlay.classList.remove('active');
});

const focusBtn = document.getElementById('focus-btn');

focusBtn.addEventListener('click', () =>{
    window.location.href = 'pomodoro/pomodoro.html';
});

const removeBtn = document.getElementById('remove-all-btn');
removeBtn.addEventListener('click', () =>{
    state.forEach(item =>{
        deleteLi(item.id);
    });
    menu.classList.remove('active');
    overlay.classList.remove('active');
})

const quoteOverlay = document.getElementById('quote-overlay');
const quoteBox = document.getElementById('quote-box');
const quoteBtn = document.getElementById('motivation-btn');

const quotes = [
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Don't wait for the perfect moment. Take the moment and make it perfect.", author: "Zoey Sayward" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Hard work beats talent when talent doesn’t work hard.", author: "Tim Notke" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { text: "Your time is limited, so don’t waste it living someone else’s life.", author: "Steve Jobs" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" }
];  

function getRandomQuote() {
    const randIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randIndex];
    document.getElementById('quote-text').textContent = `'${randomQuote.text}'`;
    document.getElementById('author').textContent = `'${randomQuote.author}'`;

}

quoteBtn.addEventListener('click', () => {
    menu.classList.remove('active');
    overlay.classList.remove('active');
    getRandomQuote();

    setTimeout(() => {
        quoteBox.style.display = 'block';
        quoteOverlay.classList.add('active');
        quoteOverlay.style.display = 'block';
    },250);
        
})

const quoteClose = document.getElementById('close-quote');
quoteClose.addEventListener('click', () => {
    quoteBox.style.display = 'none';
    quoteOverlay.classList.remove('active');
    quoteOverlay.style.display = 'none';
});

function toggleSidebar() {
    menu.classList.toggle("active");
    overlay.classList.toggle("active");
    calendarContainer.style.display = 'none';
    quoteBox.style.display = 'none';
    quoteOverlay.classList.remove('active');
    quoteOverlay.style.display = 'none';
}


overlay.addEventListener('click', () => {
    menu.classList.remove('active');
    calendarContainer.style.display = 'none';
    overlay.classList.remove('active');
});


const monthYear = document.getElementById('month-year');
const daysContainer = document.getElementById('days');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const closeButton = document.getElementById('close');
const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
];
const weekdays = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];
let currentDate = new Date();
let today = new Date();

document.addEventListener('DOMContentLoaded', function () {

    prevButton.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextButton.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    closeButton.addEventListener('click', ()=>{
        calendarContainer.style.display = 'none';
    });

    renderCalendar(currentDate);
});

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const adjustedFirstDay = (firstDay === 0) ? 6 : firstDay - 1;

    monthYear.textContent = `${months[month]} ${year}`;
    daysContainer.innerHTML = '';

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = adjustedFirstDay; i > 0; i--) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = prevMonthLastDay - i + 1;
        dayDiv.classList.add('fade');
        daysContainer.appendChild(dayDiv);
    }

    
    for (let i = 1; i <= lastDay; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = i;

        const hasTodo = state.some(todo => {
            if (!todo.dueDate) return false;
            const todoDate = new Date(todo.dueDate);
            return todoDate.getDate() === i && 
                   todoDate.getMonth() === month && 
                   todoDate.getFullYear() === year;
        });
        
        if (hasTodo) {
            dayDiv.classList.add('has-todo');
            dayDiv.style.setProperty('--accent-color', '#4285f4');
        }


        
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayDiv.classList.add('today');
        }

        state.forEach(todo => {
            if (todo.dueDate) {
                const todoDate = new Date(todo.dueDate);
                if (todoDate.getDate() === i && 
                    todoDate.getMonth() === month && 
                    todoDate.getFullYear() === year) {
                }
            }
        });


        dayDiv.addEventListener('click', function () {
            if (selectedDate) {
                
                const index = state.findIndex(todo => todo.id === selectedDate.id);
                if (index !== -1) {
                    state[index].dueDate = new Date(year, month, i).toISOString();
                    saveStateHardDisk();
                    BuildTheDom(state);
                    checkDates();
                    calendarContainer.style.display = 'none';
                }
            }
        });

        daysContainer.appendChild(dayDiv);
    }

    const nextMonthStartDay = 7 - new Date(year, month + 1, 0).getDay();
    for (let i = 1; i <= nextMonthStartDay; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = i;
        dayDiv.classList.add('fade');
        daysContainer.appendChild(dayDiv);
    }
}

function typePhrase() {
    const input = document.getElementById('todo-input');
    const phrase = phrases[currentPhraseIndex];

    typingInterval = setInterval(() => {
        if (currentCharIndex < phrase.length) {
            input.placeholder += phrase.charAt(currentCharIndex);
            currentCharIndex++;
        } else {
            clearInterval(typingInterval);
            setTimeout(deletePhrase, 30000); 
        }
    }, 100);
}

function deletePhrase() {
    const input = document.getElementById('todo-input');

    deletingInterval = setInterval(() => {
        if (currentCharIndex > 0) {
            input.placeholder = input.placeholder.slice(0, -1);
            currentCharIndex--;
        } else {
            clearInterval(deletingInterval);
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length; 
            setTimeout(typePhrase, 500);
        }
    }, 50); 
}


document.addEventListener('DOMContentLoaded', () => {
    typePhrase();
});

function checkDates(){
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    state.forEach(todo => {
        if (!todo.dueDate) return;

        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        const todoElement = document.getElementById(todo.id);
        if(!todoElement) return;
        
        if (todo.done) {
            todoElement.style.border = '2px solid transparent'; 
            return;
        }
        if(dueDate < now){
            todoElement.style.border = '2px solid red';
        }else if(dueDate.getTime() === now.getTime()){
            todoElement.style.border = '2px solid orange';
        }
    });
}


function showAllTodos() {
    state.forEach(todo => {
        const el = document.getElementById(todo.id);
        if (el) el.style.display = 'flex';
    });
}

const nowBtn = document.getElementById('now');
const overBtn = document.getElementById('over');

function toggleFilter(button, conditionFn) {
    const isActive = button.classList.contains('active');

    nowBtn.classList.remove('active');
    overBtn.classList.remove('active');


    showAllTodos();


    if (!isActive) {
        button.classList.add('active');
        state.forEach(todo => {
            const el = document.getElementById(todo.id);
            if(!el ) return;
            if(todo.dueDate === null) {
                el.style.display = 'none';
                return;
            }

            const dueDate = new Date(todo.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            const now = new Date();
            now.setHours(0, 0, 0, 0);

            if (!conditionFn(dueDate, now)) {
                el.style.display = 'none';
            }
        });
    }
    checkDates();
}

nowBtn.addEventListener('click', function () {
    toggleFilter(this, (dueDate, now) => dueDate.getTime() === now.getTime());
});

overBtn.addEventListener('click', function () {
    toggleFilter(this, (dueDate, now) => dueDate < now);
});
quoteBox.style.display = 'none';

document.addEventListener('click', function (e) {
    setTimeout(() => {
        if (!nowBtn.contains(e.target) && !overBtn.contains(e.target)) {
            if (nowBtn.classList.contains('active') || overBtn.classList.contains('active')) {
                nowBtn.classList.remove('active');
                overBtn.classList.remove('active');
                showAllTodos();
                checkDates();
            }
        }
    
    }, 0);
    
});

const sortBtn = document.getElementById('sort');
const FAR_FUTURE = new Date('9999-12-31');

sortBtn.addEventListener('click', () =>{
    state.sort((a, b) =>{
        const dateA = a.dueDate ? new Date(a.dueDate) : FAR_FUTURE;
        const dateB = b.dueDate ? new Date(b.dueDate) : FAR_FUTURE;
        return dateA - dateB;
    });

    checkDates();
    BuildTheDom(state);
    saveStateHardDisk();
    
    
});

function convertToCSV(state) {
    const header = ['Text', 'Done', 'Due Date'];
    const rows = state.map(todo => [
        todo.text,
        (todo.done === true) ? 'Done' : 'Not done',
        todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : ''
    ]);

    
    const csvContent = [header.join(','), ...rows.map(row => row.join(','))].join('\n');

    return csvContent;
}

function downloadCSV(state) {
    const csvContent = convertToCSV(state);

    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {  
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'todo_data_' + new Date().toJSON().slice(0, 10) + '.csv'); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

document.getElementById('download').addEventListener('click', () =>{
    if(state.length === 0) {
        alert(`The To Do List is empty!`);
    }
    else{
        downloadCSV(state);
    }
})



const fileInput = document.getElementById('csvFile');
document.getElementById('upload').addEventListener('click', () =>{
    fileInput.click();
})

fileInput.addEventListener('change', () =>{
    if(!fileInput.files[0]) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result.trim();
        const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim()));

        const exceptedHeader = ['Text', 'Done', 'Due Date'];
        let lastValidDate = null;

        const hasHeader = exceptedHeader.every((value, index) => rows[0][index] === value);

        const dataRows = hasHeader ? rows.slice(1) : rows;
    
        dataRows.forEach((row, index) => {
            const cells = row.map(cell => cell.trim());
    
            if (cells.length !== 3) {
                alert(`Error in ${index + 1}. row!`);
                return;
            }
    
            const [todoText, doneRow, dateRow] = cells;
            let text = todoText;
            let done = doneRow.toLowerCase() === 'done';
            let date = dateRow ? new Date(dateRow) : null;
    
            if (date && !isNaN(date.getTime())) {
                lastValidDate = new Date(date); 
            }

            const dueDate = date && !isNaN(date.getTime()) ? date.toISOString() : null;

            const alreadyExist = state.some(todo => todo.text.toLowerCase() === text.toLowerCase() && todo.dueDate === dueDate);

            if(alreadyExist){
                alert(`Duplicate found, skipping: '${text}'`);
                return;
            }

            const newTodo = {
                id: Math.random(),
                done: done,
                text: text,
                dueDate: dueDate
            };
    
            state.push(newTodo);
        });
    
        saveStateHardDisk();
        BuildTheDom(state);
        checkDates();
    
        
        if (lastValidDate) {
            currentDate = lastValidDate;
        }
    
        renderCalendar(currentDate);
    };
    

    reader.readAsText(fileInput.files[0]);
    fileInput.value = '';
})



document.addEventListener('DOMContentLoaded', () => {
    loadStateFromHardDisk();
    BuildTheDom(state);
    checkDates();
});