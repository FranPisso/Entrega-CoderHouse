let listaProductos = [
    { id: 2, nombre: "Air jordan 1", marca: "jordan", precio: 220, stock: 2, rutaImagen: "airman.webp", },
    { id: 6, nombre: "Jordan 6", marca: "jordan", precio: 226, stock: 5, rutaImagen: "jordannnnn.webp", },
    { id: 67, nombre: "Dunk", marca: "nike", precio: 500, stock: 11, rutaImagen: "airform.webp", },
    { id: 22, nombre: "Dunk BnW", marca: "nike", precio: 600, stock: 33, rutaImagen: "panda.webp", },
    { id: 29, nombre: "Travis low", marca: "jordan", precio: 700, stock: 45, rutaImagen: "travisssss.webp", },
    { id: 33, nombre: "Jordan 4 green", marca: "jordan", precio: 150, stock: 64, rutaImagen: "nabueno.webp", },
    { id: 12, nombre: "jordan 4 mid", marca: "jordan", precio: 200, stock: 23, rutaImagen: "lambo.webp", },
    { id: 66, nombre: "Jordan 5 high", marca: "jordan", precio: 700, stock: 12, rutaImagen: "jrdn.webp", },
    { id: 99, nombre: "Exotic Nike", marca: "nike", precio: 650, stock: 12, rutaImagen: "exotic.webp", }
]

principal(listaProductos)

function principal(productos) {
    let carrito = obtenerCarritoLS()
    renderizarCarrito()

    let botonMostrarOcultar = document.getElementById("mostrarOcultar")
    botonMostrarOcultar.addEventListener("click", mostrarOcultar)

    let botonBuscar = document.getElementById("botonBuscar")
    botonBuscar.addEventListener("click", () => filtrarYRenderizar(productos))
    renderizarProductos(productos)

    let botonComprar = document.getElementById("botonComprar")
    botonComprar.addEventListener("click", finalizarCompra)
}

function obtenerCarritoLS() {
    let carrito = []
    let carritoLS = JSON.parse(localStorage.getItem("carrito"))
    if (carritoLS) {
        carrito = carritoLS
    }
    return carrito
}

function finalizarCompra() {
    localStorage.removeItem("carrito")
    renderizarCarrito([])
}

function mostrarOcultar(e) {
    let contenedorCarrito = document.getElementById("contenedorCarrito")
    let contenedorProductos = document.getElementById("contenedorProductos")
    let botonComprar = document.getElementById("botonComprar")

    contenedorCarrito.classList.toggle("oculto")
    contenedorProductos.classList.toggle("oculto")
    botonComprar.classList.toggle("oculto")

    if (e.target.innerText === "Ir al Carrito") {
        e.target.innerText = "Ir a Productos"
    } else {
        e.target.innerText = "Ir al Carrito"
    }
}

function filtrarYRenderizar(productos) {
    let productosFiltrados = filtrarProductos(productos)
    renderizarProductos(productosFiltrados)
}

function filtrarProductos(productos) {
    let inputBusqueda = document.getElementById("inputBusqueda")
    return productos.filter(producto => producto.nombre.includes(inputBusqueda.value) || producto.marca.includes(inputBusqueda.value))

}

function renderizarProductos(productos) {
    let carrito = obtenerCarritoLS()
    let contenedorProductos = document.getElementById("contenedorProductos")
    contenedorProductos.innerHTML = ""

    productos.forEach(producto => {
        let tarjetaProducto = document.createElement("div")
        tarjetaProducto.className = "tarjetaProducto"

        let mensaje
        mensaje = "Unidades: " + producto.stock

        if (producto.stock > 5) {
            tarjetaProducto.className = "tarjetaProducto"

        } else {
            tarjetaProducto.className = "tarjetaProductoPocoStock"
        }

        tarjetaProducto.innerHTML = `
        <h2>${producto.nombre}</h2>
        <img src = ./img/${producto.rutaImagen}></img >
        <h3>$${producto.precio}</h3>
        <p>${mensaje}</p>
        <button id=botonCarrito${producto.id}>Agregar al carrito</button>
        `
        contenedorProductos.appendChild(tarjetaProducto)

        let botonAgregarAlCarrito = document.getElementById("botonCarrito" + producto.id)

        botonAgregarAlCarrito.addEventListener("click", (e) => agregarProductoAlCarrito(e, productos))
    });

}

function agregarProductoAlCarrito(e, productos) {
    let carrito = obtenerCarritoLS()
    let idDelProducto = Number(e.target.id.substring(12))
    console.log(idDelProducto)

    let posicionProductoEnCarrito = carrito.findIndex(producto => producto.id === idDelProducto)
    let productoBuscado = productos.find(producto => producto.id === idDelProducto)

    if (posicionProductoEnCarrito !== -1) {
        carrito[posicionProductoEnCarrito].unidades++
        carrito[posicionProductoEnCarrito].subtotal = carrito[posicionProductoEnCarrito].precioUnitario * carrito[posicionProductoEnCarrito].unidades
    } else {
        carrito.push({
            id: productoBuscado.id,
            nombre: productoBuscado.nombre,
            precioUnitario: productoBuscado.precio,
            unidades: 1,
            subtotal: productoBuscado.precio,
        })
    }
    localStorage.setItem("carrito", JSON.stringify(carrito))
    renderizarCarrito()
}

function renderizarCarrito() {
    let carrito = obtenerCarritoLS()
    let contenedorCarrito = document.getElementById("contenedorCarrito")
    contenedorCarrito.innerHTML = ""
    carrito.forEach(producto => {
        let tarjetaProductoCarrito = document.createElement("div")
        tarjetaProductoCarrito.className = "tarjetaProductoCarrito"
        tarjetaProductoCarrito.id = `tarjetaProductoCarrito${producto.id}`

        tarjetaProductoCarrito.innerHTML = 
        `
        <p>${producto.nombre}</p>
        <p>${producto.precioUnitario}</p>
        <p>${producto.unidades}</p>
        <p>${producto.subtotal}</p>
        <button id=eliminar${producto.id}>Eliminar</button>
        `
        contenedorCarrito.appendChild(tarjetaProductoCarrito)

        let botonEliminar = document.getElementById(`eliminar${producto.id}`)
        botonEliminar.addEventListener("click", eliminarProductoDeCarrito)

        function eliminarProductoDeCarrito(e) {
            e.target.parentElement.remove()
        }
    })
}

