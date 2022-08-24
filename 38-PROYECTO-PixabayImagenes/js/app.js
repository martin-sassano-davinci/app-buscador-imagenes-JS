const form = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const divPaginador = document.querySelector('#paginacion');
const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = ()=>{
    form.addEventListener('submit', validarForm);
}

function validarForm(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if (terminoBusqueda === '') {
        
        mostrarAlerta('Debe completar el campo termino busqueda');
        
    } else {
        buscarImagenes();
    }
}

function buscarImagenes() {
    const busqueda = document.querySelector('#termino').value;
    const key = '28700725-8a731976a7a9c5279c5b12afe';
    const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(url)
    .then(response  => response.json())
    .then(result => {  
        totalPaginas = calcularPaginas(result.totalHits);     
        mostrarImagenes(result.hits);
    });
}
function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPorPagina)); 
}
function mostrarImagenes(imagenes) {

    
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    imagenes.forEach( imagen => {

    const {largeImageURL, likes, views, previewURL} = imagen;
    resultado.innerHTML += `
    <div class="w-1/2 md:w-1/3 lg:w-1/4 mb-4 p-3">
    <div class="bg-white ">
        <img class="w-full" src=${previewURL} alt={tags} />
        <div class="p-4">
            <p class="card-text">${likes} Me Gusta</p>
            <p class="card-text">${views} Vistas </p>

            <a href=${largeImageURL} 
            rel="noopener noreferrer" 
            target="_blank" class="bg-blue-800 w-full p-1 block mt-5 rounded text-center font-bold uppercase hover:bg-blue-500 text-white">Ver Imagen</a>
        </div>
    </div>
</div>
    `
    while (divPaginador.firstChild) {
        divPaginador.removeChild(divPaginador.firstChild);
    }
    imprimirPaginador();
    })}
function *crearPaginador(total){
    for (let i = 1; i <= total;  i++) 
       yield i;
}
function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);
    while (true) {
        const {value, done} = iterador.next();
    if (done) return;

    const boton = document.createElement('a');
    boton.href = '#';
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded' );

    boton.onclick = ()=>{
        paginaActual = value;
        buscarImagenes();
    }
    divPaginador.appendChild(boton);
        
    }
}
function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('.bg-red-100');
    
    if (!existeAlerta) {

        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
        <strong class='font-bold'>Error!</strong>
        <span class='block sm:inline'>${mensaje}</span>
        `;
    
        form.appendChild(alerta);
        setTimeout(() => {
            
            alerta.remove();
        }, 3000);
    }
}