const obtenerCarritoLS = () => JSON.parse(localStorage.getItem("carrito")) || []

principal()

async function principal() {

    const response = await fetch("./data.json")
    const productos = await response.json()

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

function finalizarCompra() {
    Swal.fire({
        title: 'Gracias por comprar!',
        text: 'para continuar',
        icon: 'success',
        confirmButtonText: 'Ok'
    })
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

        tarjetaProductoCarrito.innerHTML = `
        <p>${producto.nombre}</p>
        <p>${producto.precioUnitario}</p>
        <div class=unidades>
         <button id=restar${producto.id}>-</button>
         <p>${producto.unidades}</p>
         <button id=sumar${producto.id}>+</button>
        </div>
        <p>${"$" + producto.subtotal}</p>
        <button id=eliminar${producto.id}>Eliminar</button>
        `
        contenedorCarrito.appendChild(tarjetaProductoCarrito)

        let botonRestarUnidad = document.getElementById(`restar${producto.id}`)
        botonRestarUnidad.addEventListener("click", restarUnidad)

        let botonSumarUnidad = document.getElementById(`sumar${producto.id}`)
        botonSumarUnidad.addEventListener("click", (e) => sumarUnidad(e, producto.id))

        let botonEliminar = document.getElementById(`eliminar${producto.id}`)
        botonEliminar.addEventListener("click", eliminarProductoDeCarrito)

    })
}

function restarUnidad(e) {
    let carrito = obtenerCarritoLS()
    let id = Number(e.target.id.substring(6))
    let posicionProductoEnCarrito = carrito.findIndex(producto => producto.id === id)

    if (carrito[posicionProductoEnCarrito].unidades > 1) {
        carrito[posicionProductoEnCarrito].unidades--
        carrito[posicionProductoEnCarrito].subtotal = carrito[posicionProductoEnCarrito].unidades * carrito[posicionProductoEnCarrito].precioUnitario
        localStorage.setItem("carrito", JSON.stringify(carrito))
        renderizarCarrito()
    } else {
        eliminarProductoDeCarrito(e)
    }
}

function sumarUnidad(e, id) {
    let carrito = obtenerCarritoLS()
    let posicionProductoEnCarrito = carrito.findIndex(producto => producto.id === id)
    let productos = obtenerProductos()
    let productoOriginal = productos.find(producto => producto.id === id)

    if (carrito[posicionProductoEnCarrito].unidades < productoOriginal.stock) {
        carrito[posicionProductoEnCarrito].unidades++
        carrito[posicionProductoEnCarrito].subtotal = carrito[posicionProductoEnCarrito].unidades * carrito[posicionProductoEnCarrito].precioUnitario
        localStorage.setItem("carrito", JSON.stringify(carrito))
        renderizarCarrito()
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No hay suficiente stock!",
        });
    }
}

function eliminarProductoDeCarrito(e) {
    let carrito = obtenerCarritoLS()
    let id = Number(e.target.id.substring(8))
    carrito = carrito.filter(producto => producto.id !== id)
    localStorage.setItem("carrito", JSON.stringify(carrito))
    e.target.parentElement.remove()
}

function eliminarProductoDeCarrito(e) {
    let carrito = obtenerCarritoLS()
    let id = Number(e.target.id.substring(8))
    carrito = carrito.filter(producto => producto.id !== id)
    localStorage.setItem("carrito", JSON.stringify(carrito))
    renderizarCarrito()
}

function obtenerProductos() {
    return [
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
}

async function pedirInfo() {
    try {
        const response = await fetch("./data.json")
        const productos = await response.json()
        return productos
    } catch (error) {
        console.log("algo falló")
    }
}
