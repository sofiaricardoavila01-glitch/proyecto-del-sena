let carrito = JSON.parse(localStorage.getItem('carritoRestaurante')) || [];
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
    const formPedido = document.getElementById('form-pedido');
    if (formPedido) {
        formPedido.addEventListener('submit', (e) => {
            e.preventDefault();
            if (carrito.length === 0) {
                alert('Tu carrito está vacío. Agrega platos antes de continuar.');
                return;
            }
            alert('¡Pedido realizado con éxito! Tu carrito ha sido procesado.');
            vaciarCarrito();
        });
    }
});