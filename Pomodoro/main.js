// vamos a crear una const tasks, que contiene un array vacío donde se agregan mis tareas 
const tasks = [];

// Una variable time, va a llevar la cuenta regresiva, inicializaremos con valor 0
let time = 0;

// a timer le vamos a agregar una función llamada setInterval, que nos ejecuta
// una parte del código cada una cierta cantidad de tiempo. Ahora le asignamos null
let timer = null;

// otra variable para los 5 minutos de descanso
let timerBreak = null;

// La variable "current" nos va a indicar cual es la tarea que se está llevando a cabo
let current = null;

// establecemos las const para referenciar a nuestros id's del html
const badd = document.querySelector('#badd');
const itTask = document.querySelector('#itTask');
const form = document.querySelector('#form');
const taskName = document.querySelector('#time #taskName');

// Para mostrar nuestro contador al principio.
renderTime();
renderTasks();

// Definimos nuestros eventos

// Función que determina lo que pasa cuando se ejecuta "submit"
// agregamos "e" para prevenir el evento por default y que no se recargue la página.
form.addEventListener('submit', e => {
    e.preventDefault();
    // si itTask.value es diferente a un string vacío, crea nuestra tarea
    if(itTask.value != ""){
        createTask(itTask.value);
    // una vez que ingresa nuestra tarea, eliminamos el texto de nuestro input
    itTask.value = "";
    // hacemos el llamado a nuestra función que llamamos más abajo, para poder mostrar
    // nuestras nuevas tasks en nuestro DOM (no directamente en nuestro html)
    renderTasks();
    }
})

// Creamos nuestra función que creará la tarea
function createTask(value){
// Vamos a inyectar un objeto con nuestra nueva tarea con 3 propiedades
    const newTask = {
        // id dinámico con Math.random para un valor aleatorio
        // multiplicamos por 100, que nos va a dar un valor pero con decimal
        // ese valor decimal lo podemos transformar con .toString(36) redix x cuestiones binarias
        // .slice(3) para que nos elimine los 3 primeros caracteres.
        id: (Math.random()*100).toString(36).slice(3),
        title: value,
        completed: false,
    };
    //por último lo incluimos dentro de nuestro array
    tasks.unshift(newTask);
}

// para poder tomar cada una de nuestras tareas y renderizarlas ó "mostrarlas" en nuestro html
// tenemos que primero generar un objeto para luego inyectarlo mediante el DOM
function renderTasks(){
    // vamos a mapear o iterar (map()) nuestro array y por cada elemento que encuentra, realice una
    // operación
    // luego vamos a devolver un array nuevo con cada elemento con su correspondiente
    // operación, para eso vamos a "transformar" cada uno de los nuevos objetos en html
    const html = tasks.map(task =>{
        // la primera parte de nuestro objeto se va a llamar "completed", donde mostraremos ó un botón
        // o un texto que indique si la tarea esta completada, sino aparece el botón. El ternario lo usamos
        // para dividir esa condicional en una sola linea. En caso de que no está completada la tarea
        // va a figurar el botón con el texto "start" y le vamos a colocar una propiedad llamada "data-id",
        // con el id de esa tarea.
        return `
        <div class="task">
            <div class="completed">${task.completed ? `<span class="done">Done</span>`: `<button class="start-button" data-id="${task.id}"> Start </button>`}</div>
            <div class="title">${task.title}</div>
        </div>
        `;
    });

    const tasksContainer = document.querySelector("#tasks");
    // El método .map nos va a devolver un arreglo de strings con cada uno de nnuestros
    // elementos creados y para poder transformarlos en un sólo string utilizamos el método .join y
    // que estos elementos los separe con un espacio vacío (" ").
    tasksContainer.innerHTML = html.join("");
    
    // Agregamos una constante para los botones de incio .start-button, pero primero debemos acceder
    // por medio de su contenedor padre .task
    const startButtons = document.querySelectorAll('.task .start-button');

    // Luego creamos una función anónima donde decimos que por cada (forEach) startButtons, mediante el evento (addEventListener)
    // 'click' (preveemos el evento por default con "e")

    startButtons.forEach(button => {
        button.addEventListener('click', e =>{
            // En caso de que hagamos click, debemos saber si existe alguna activad
            // en proceso
            if(!timer){
                const id = button.getAttribute("data-id");
                startButtonHandler(id);
                button.textContent = "In progres...";
            }
        });
    });

}

// a través de la función startButtonHandler, vamos a calcular los 25 min. de la actividad.
function startButtonHandler(id){
    time = 25 * 60;
    current = id;
    // vamos a iterar nuestro id y cuando coincida el id, con id parámetro de la función
    // nos va almacenar el index
    const taskIndex = tasks.findIndex(task => task.id === id);
    renderTime();
    taskName.textContent = tasks[taskIndex].title;
    // Ahora vamos a darle el formato al timepo, por medio de setInterval(), vamos a ejecutar
    // una función de forma indefinida, hasta que nosotros la detengamos. setTimeOut() sólo una función en un tiempo determinado.
    timer = setInterval(() => {
        timeHandler(id);
    // establecemos cómo segundo parámetro el número mil, debido a que setInterval maneja milisegundos,
    // y nosotros queremos que la función se ejecute cada 1 segundo.
    }, 1000);
}

    function timeHandler(id){
        time--;
        // cada vez que restemos 1 a time, debemos reenderizarlo, para eso definimos la función renderTime()
        renderTime();
        // Cuando el tiempo sea igual a 0, vamos a detener el setInterval alojado dentro de timer.
        if(time === 0){
            // utilizamos la función clearInterval con la variable de "timer" como parametro
            clearInterval(timer);
            // vamos a declarar una función que cuando el contador llegue a 0, nos indique que la tarea está completa
            // cómo parámetro vamos a pasarle el "id"
            markCompleted(id);
            timer = null;
            renderTasks();
            // Una vez realizada nuestra función clearInterval, markCompleted() y renderTasks(), vamos a llamar a una función,
            // que, una vez realizado el tiempo de la tarea, dé incio al tiempo de descanso, la llamaremos startBreak
            startBreak();
        }
    }

    function startBreak(){
        //definimos el timepo
        time = 5 * 60;
        taskName.textContent = 'break';
        // Renderizamos el tiempo para que se vean los 5 minutos.
        renderTime();
        timerBreak = setInterval(() => {
        // cómo tenemos una función timeHandler, vamos a tener una función, timerBreakHandler, que controlará el tiempo
        // de nuestros "break"
            timerBreakHandler();
        }, 1000);
    }

    function timerBreakHandler(){
        // cómo hicimos anteriormente lo primero que vamos a hacer es decrementar el tiempo
        time--;
        // nuevamente renderizamos el tiempo (lo presentamos), con la función renderTime()
        renderTime();
        // si el tiempo es igual a 0, detemos el setInterval úbicado dentro de timerBrak
        if(time === 0){
            clearInterval(timerBreak);
            current = null;
            timerBreak = null;
            taskName.textContent = "";
            renderTasks();
        }
    }

    // Esta función nos va a permitir darle formato a un número, ej:
    // si en 1 minuto hay 60 segundos. si yo divido 60/60 = 1 (1 minuto)
    // pero si yo hago el residuo de una división 60%60 = 0 (el restante de la división)
    // si unimos las dos operaciones anteriores vamos a tener que 60 segundos es 1 minuto, con 0 segundos.
    // Pero que pasa si hacemos esto 65/60 = 1,083333... no nos sirve, por la cantidad de decimales, pero de acá vamos a usar el 1 para el minuto.
    // Ahora si hacemos el residuo de 65%60 = 5, quiere decir que es 1 minuto con 5 segundos. y de acá el residuo para los segundos.
    function renderTime(){
    const timeDiv = document.querySelector('#time #value');
    // luego establecemos una variable "minutes", para minutos.. que será igual a parseInt, esto nos va a brindar un número entero, de la división
    // de (time/60)
    const minutes = parseInt(time / 60);
    // La variable "seconds" del resiudo de la operación (time % 60), para los segundos..
    const seconds = parseInt(time % 60);

    // Por último establecemos la estructura que se presentará en el html
    // En el caso de que nuestros segundos o minutos sean menores que 10, no se nos van a presentar 00 ó 09, para eso
    // establecemos que si {minutes ó seconds < 10 ? '0' : ''}
    timeDiv.textContent = `${minutes < 10 ? '0' : ''} ${minutes} : ${seconds < 10 ? '0' : ''} ${seconds}`;
}

// con esta función vamos a buscar la actividad actual y cambiar el status de completed a "true"
function markCompleted(id){
    const taskIndex = tasks.findIndex((task) => task.id === id);
    tasks[taskIndex].completed = true;
}