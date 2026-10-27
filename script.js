let carrito = JSON.parse(localStorage.getItem('carritoRestaurante')) || [];

// Función para reproducir un sonido alegre al hacer clic en un plato
function reproducirSonidoClick() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // Nota musical
        oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
        // Ignorar si el navegador bloquea audio automático por políticas de seguridad
    }
}

function actualizarCarritoUI() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalPrecioElemento = document.getElementById('total-precio');
    if (!listaCarrito || !totalPrecioElemento) return;
    listaCarrito.innerHTML = '';
    let totalAcumulado = 0;
    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<li>El carrito está vacío. ¡Agrega tus platos preferidos!</li>';
    } else {
        carrito.forEach((producto, indice) => {
            const subtotal = producto.precio * producto.cantidad;
            totalAcumulado += subtotal;
            const elementoLista = document.createElement('li');
            elementoLista.innerHTML = `
                ${producto.cantidad}x <strong>${producto.nombre}</strong> - $${subtotal.toLocaleString('es-CO')} COP 
                <button type="button" class="btn-eliminar" data-indice="${indice}">❌ Eliminar</button>
            `;
            listaCarrito.appendChild(elementoLista);
        });
    }
    totalPrecioElemento.textContent = totalAcumulado.toLocaleString('es-CO');
    localStorage.setItem('carritoRestaurante', JSON.stringify(carrito));
}

function agregarAlCarrito(nombre, precio, idInputCantidad) {
    const inputCantidad = document.getElementById(idInputCantidad);
    const cantidad = inputCantidad ? parseInt(inputCantidad.value) || 1 : 1;
    const productoExistente = carrito.find(item => item.nombre === nombre);
    if (productoExistente) {
        productoExistente.cantidad += cantidad;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: cantidad
        });
    }
    actualizarCarritoUI();
    alert(`¡Se agregaron ${cantidad} unidad(es) de ${nombre} al carrito!`);
}

function eliminarProducto(indice) {
    carrito.splice(indice, 1);
    actualizarCarritoUI();
}

function vaciarCarrito() {
    carrito = [];
    actualizarCarritoUI();
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarCarritoUI();
    document.querySelectorAll('.btn-agregar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            reproducirSonidoClick(); // 🔊 ¡Aquí suena el plato al seleccionarlo!
            const nombre = e.target.getAttribute('data-nombre');
            const precio = parseInt(e.target.getAttribute('data-precio'));
            const idInput = e.target.getAttribute('data-input');           
            agregarAlCarrito(nombre, precio, idInput);
        });
    });
    
    const listaCarrito = document.getElementById('lista-carrito');
    if (listaCarrito) {
        listaCarrito.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-eliminar')) {
                const indice = parseInt(e.target.getAttribute('data-indice'));
                eliminarProducto(indice);
            }
        });
    }
    
    const btnVaciar = document.getElementById('btn-vaciar');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', vaciarCarrito);
    }
});
