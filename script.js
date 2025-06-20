const modal = document.getElementById('modal');
const abrirBtn = document.getElementById('abrir_modal');
const cerrarBtn = document.getElementById('cerrar_modal');
const btnEnviar = document.querySelector('.guardar_usuario');
const form = document.getElementById('form_trabajador');
const listaTrabajadores = document.querySelector('.lista_trabajadores');
const contenedorInformacion = document.querySelector('.contenedor_informacion');
const footerEstado = document.querySelector('.contenedor_estado');
const selectorEstadoFooter = document.querySelector('.selector_estado');
const btnEnviarEstado = document.querySelector('.enviar_estado');

let usuarioSeleccionado = null;

// Array de estados y colores
const estados = [
  { id: 1, nombre: "Intervenido", color: "#FFB347" },   // Naranja
  { id: 2, nombre: "En proceso", color: "#4FC3F7" },    // Azul
  { id: 3, nombre: "Finalizado", color: "#81C784" },    // Verde
  { id: 4, nombre: "No iniciado", color: "#E57373" }    // Rojo
];

function getColorEstado(id) {
    const estado = estados.find(e => e.id === Number(id));
    return estado ? estado.color : "#D9D9D9"; // Color por defecto
}

function getNombreEstado(id) {
    const estado = estados.find(e => e.id === Number(id));
    return estado ? estado.nombre : "Desconocido";
}

// Rellena el selector de estados en el footer
function rellenarSelectorEstados() {
    if (!selectorEstadoFooter) return;
    selectorEstadoFooter.innerHTML = '<option value="" disabled selected>Seleccionar</option>';
    estados.forEach(e => {
        const option = document.createElement('option');
        option.value = e.id;
        option.textContent = e.nombre;
        selectorEstadoFooter.appendChild(option);
    });
}
rellenarSelectorEstados();

//FUNCION PARA MOSTRAR USUARIOS U OCULTAR INFORMACIÓN

// Mensaje cuando no hay usuario seleccionado
function mostrarMensajeSinUsuario() {
    if (contenedorInformacion) {
        contenedorInformacion.style.display = 'none';
    }
    if (footerEstado) {
        footerEstado.style.display = 'none';
    }
    let mensaje = document.getElementById('mensaje_sin_usuario');
    if (!mensaje) {
        mensaje = document.createElement('div');
        mensaje.id = 'mensaje_sin_usuario';
        mensaje.style.textAlign = 'center';
        mensaje.style.margin = '2rem';
        mensaje.textContent = 'No hay usuarios seleccionados actualmente.';
        // Insertar el mensaje antes del contenedor de información
        contenedorInformacion.parentNode.insertBefore(mensaje, contenedorInformacion);
    }
    mensaje.style.display = 'block';
}

// Oculta el mensaje cuando hay usuario seleccionado
function ocultarMensajeSinUsuario() {
    const mensaje = document.getElementById('mensaje_sin_usuario');
    if (mensaje) mensaje.style.display = 'none';
    if (contenedorInformacion) contenedorInformacion.style.display = '';
    if (footerEstado) footerEstado.style.display = '';
}

// Inicialmente oculta los paneles y muestra el mensaje
mostrarMensajeSinUsuario();

let usuarios = [];

usuarios.push({
    nombre: 'Karen Dayana',
    apellido: 'Espejo Mercado',
    edad: '40',
    genero: 'F',
    peso: '60',
    estatura: '1.74',
    alergias: 'Rinitis alérgica (al polvo o polen), alergia a los ácaros del polvo y alergia a la lactosa o proteínas de la leche.',
    motivo: 'Se ha detectado una baja variabilidad de la frecuencia cardíaca (HRV) mantenida por un tiempo prolongado, lo cual indica que tu cuerpo está sometido a un nivel de estrés elevado y sostenido. Esta condición puede afectar tu salud cardiovascular, aumentar la fatiga y disminuir tu capacidad de recuperación. Es importante tomar medidas para reducir la carga física o mental y evitar consecuencias más graves.',
    sugerencias: 'Se recomienda que el trabajador realice pausas activas durante la jornada laboral, mantenga una adecuada higiene del sueño (mínimo 7 horas por noche), evite el consumo excesivo de cafeína y se mantenga bien hidratado. Además, puede beneficiarse de practicar técnicas de respiración o relajación que contribuyan a normalizar la variabilidad de la frecuencia cardíaca (HRV) y reducir el impacto del estrés prolongado.',
    estado: 1
});
renderizarListaCompleta();

// Guardar usuario
btnEnviar.addEventListener('click', () => {
    const nuevoUsuario = {
        nombre: form.nombre.value,
        apellido: form.apellido.value,
        edad: form.edad.value,
        genero: form.genero.value,
        peso: form.peso.value,
        estatura: form.estatura.value,
        alergias: form.alergias.value,
        motivo: form.motivo.value,
        sugerencias: form.sugerencias.value,
        estado: form.estado.value
    };
    usuarios.push(nuevoUsuario);
    renderizarListaCompleta();
    form.reset();
    modal.style.display = 'none';
    btnEnviar.disabled = true;
});

// Renderiza toda la lista de usuarios
function renderizarListaCompleta() {
    listaTrabajadores.innerHTML = '';
    usuarios.forEach((usuario, idx) => {
        const colorEstado = getColorEstado(usuario.estado);
        const nombreEstado = getNombreEstado(usuario.estado);
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="card_info_trabajador">
                <h3>${usuario.nombre} ${usuario.apellido}</h3>
                <p>${usuario.motivo}</p>
            </div>
            <div class="estado" title="${nombreEstado}" style="background-color: ${colorEstado};"></div>
        `;
        li.dataset.idx = idx;
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => {
            mostrarInformacionUsuario(usuario);
        });
        listaTrabajadores.appendChild(li);
    });
}

// Muestra la información del usuario en el panel de información
function mostrarInformacionUsuario(usuario) {
    usuarioSeleccionado = usuario;
    ocultarMensajeSinUsuario();

    // Quitar selección previa
    document.querySelectorAll('.lista_trabajadores li').forEach(li => {
        li.classList.remove('seleccionado');
        const card = li.querySelector('.card_info_trabajador');
        if (card) card.classList.remove('seleccionado');
    });

    // Buscar y marcar el seleccionado
    document.querySelectorAll('.lista_trabajadores li').forEach(li => {
        const h3 = li.querySelector('h3');
        const p = li.querySelector('p');
        if (
            h3 && p &&
            h3.textContent.trim() === `${usuario.nombre} ${usuario.apellido}` &&
            p.textContent.trim() === usuario.motivo.trim()
        ) {
            li.classList.add('seleccionado');
            const card = li.querySelector('.card_info_trabajador');
            if (card) card.classList.add('seleccionado');
        }
    });

    // Actualiza el div .datos_trabajador
    const datosTrabajador = document.querySelector('.datos_trabajador');
    if (datosTrabajador) {
        datosTrabajador.innerHTML = `
            <h1>${usuario.nombre} ${usuario.apellido}</h1>
            <div class="datos_personales">
                <li>Edad: ${usuario.edad}</li>
                <li>Genero: ${usuario.genero}</li>
                <li>Peso: ${usuario.peso}kg</li>
                <li>Estatura: ${usuario.estatura}</li>
            </div>
        `;
    }

    // Actualiza el div .informacion_motivo
    const infoMotivo = document.querySelector('.informacion_motivo');
    if (infoMotivo) {
        infoMotivo.innerHTML = `
            <article>
                <h1>Alergias</h1>
                <p>${usuario.alergias}</p>
            </article>
            <article>
                <h1>Motivo</h1>
                <p>${usuario.motivo}</p>
            </article>
            <article>
                <h1>Sugerencias</h1>
                <p>${usuario.sugerencias}</p>
            </article>
        `;
    }
    // Actualiza el estado actual en el footer
    const estadoActual = document.querySelector('.estado_actual');
    if (estadoActual) {
        estadoActual.textContent = `Estado actual: ${getNombreEstado(usuario.estado)}`;
    }

    // Selecciona el estado actual en el selector del footer
    if (selectorEstadoFooter) {
        selectorEstadoFooter.value = usuario.estado;
    }

    if (contenedorInformacion) contenedorInformacion.style.display = '';
    if (footerEstado) footerEstado.style.display = '';
}

// Cambia el estado del usuario seleccionado desde el footer
btnEnviarEstado.addEventListener('click', () => {
    if (!usuarioSeleccionado) return;
    const nuevoEstado = selectorEstadoFooter.value;
    if (!nuevoEstado) return;

    usuarioSeleccionado.estado = nuevoEstado;
    renderizarListaCompleta();
    mostrarInformacionUsuario(usuarioSeleccionado);
});

// Asigna eventos a los li originales de la lista para mostrar información de ejemplo y pinta el estado
// document.querySelectorAll('.lista_trabajadores > li').forEach((li, i) => {
//     li.style.cursor = 'pointer';
//     const estadoId = ((i % estados.length) + 1);
//     const colorEstado = getColorEstado(estadoId);
//     const nombreEstado = getNombreEstado(estadoId);
//     const estadoDiv = li.querySelector('.estado');
//     if (estadoDiv) {
//         estadoDiv.style.backgroundColor = colorEstado;
//         estadoDiv.title = nombreEstado;
//     }
//     li.addEventListener('click', () => {
//         const usuarioEjemplo = {
//             nombre: 'Karen Dayana',
//             apellido: 'Espejo Mercado',
//             edad: '40',
//             genero: 'F',
//             peso: '60',
//             estatura: '1.74',
//             alergias: 'Rinitis alérgica (al polvo o polen), alergia a los ácaros del polvo y alergia a la lactosa o proteínas de la leche.',
//             motivo: 'Se ha detectado una baja variabilidad de la frecuencia cardíaca (HRV) mantenida por un tiempo prolongado, lo cual indica que tu cuerpo está sometido a un nivel de estrés elevado y sostenido. Esta condición puede afectar tu salud cardiovascular, aumentar la fatiga y disminuir tu capacidad de recuperación. Es importante tomar medidas para reducir la carga física o mental y evitar consecuencias más graves.',
//             sugerencias: 'Se recomienda que el trabajador realice pausas activas durante la jornada laboral, mantenga una adecuada higiene del sueño (mínimo 7 horas por noche), evite el consumo excesivo de cafeína y se mantenga bien hidratado. Además, puede beneficiarse de practicar técnicas de respiración o relajación que contribuyan a normalizar la variabilidad de la frecuencia cardíaca (HRV) y reducir el impacto del estrés prolongado.',
//             estado: estadoId
//         };
//         mostrarInformacionUsuario(usuarioEjemplo);
//     });
// });

// FUNCIONES DE LA MODAL

// Función para abrir la modal
abrirBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
    validarFormulario();
});

// Función para cerrar la modal
cerrarBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    form.reset();
    btnEnviar.disabled = true;
});

// Cierra la modal si el usuario hace clic fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        form.reset();
        btnEnviar.disabled = true;
    }
});

// FUNCIONES PARA GESTIONAR EL ESTADO DE LOS USUARIOS

function validarFormulario() {
    // Verifica todos los campos requeridos del formulario
    const campos = form.querySelectorAll('[required]');
    let completo = true;
    campos.forEach(campo => {
        if (!campo.value || (campo.tagName === "SELECT" && campo.value === "")) {
            completo = false;
        }
    });
    btnEnviar.disabled = !completo;
}

// Valida en cada cambio de los campos del formulario
form.addEventListener('input', validarFormulario);
// Valida también al abrir la modal
abrirBtn.addEventListener('click', validarFormulario);

// Inicializa el estado del botón al cargar la página
validarFormulario();