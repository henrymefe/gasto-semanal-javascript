//Variables y selecotores
const formulario = document.querySelector('#agregar-gasto')
const gastoListado = document.querySelector('#gastos ul')

//Valor Dummy
const dummyValue = 500 


//Eventos
eventListeners()
function eventListeners() {
document.addEventListener('DOMContentLoaded', preguntarPresupuesto)
formulario.addEventListener('submit', agregarGastos)
}


//Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto)
        this.restante = Number (presupuesto)
        this.gastos = []

    }
    
    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto]
        this.calcularRestante()
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) =>  total + gasto.cantidad, 0)
        this.restante = this.presupuesto - gastado

    }

    elmininarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id)
        this.calcularRestante() 
    }



}

class UI {
    insertarPresupuesto ( cantidad ) {
        //Extrayendo los valores 
        const { presupuesto, restante } = cantidad
        //Agregamos al HTML
        document.querySelector('#total').textContent = presupuesto
        document.querySelector('#restante').textContent = restante

    }

    imprimirAlerta(mensaje, tipo) {
        //crear el div
        const divAlerta = document.createElement('div')
        divAlerta.classList.add('text-center', 'alert')

        if(tipo === 'error') {
            divAlerta.classList.add('alert-danger')
        } else {
            divAlerta.classList.add('alert-success')
        }

        //mensaje de error
        divAlerta.textContent = mensaje
        //Insertamos en el html, insertBefore (TOMA DOS, ARGUMENTOS)
        document.querySelector('.primario').insertBefore( divAlerta, formulario )
        //Quitar el HTML
        setTimeout(() => {
            divAlerta.remove()
        }, 3000);




    }


    mostrarGastos(gastos) {
        this.limpiarHTML() //Elimina el HTML previo

        //ierar sobre los gastos
        gastos.forEach( gasto => {
            const { cantidad, nombre, id } = gasto

            //Crear un LI
            const nuevoGasto = document.createElement('li')
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-item-center'
            nuevoGasto.dataset.id = id
            //Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span> `
            //Boton para borrar el gasto
            const btnBorrar = document.createElement('button')
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')
            btnBorrar.innerHTML = 'Borrar &times'
            nuevoGasto.appendChild(btnBorrar)
            btnBorrar.onclick = () => {
                elmininarGasto(id)
            }
            //Agregar al HTML
            gastoListado.appendChild(nuevoGasto)
        });

    }


    limpiarHTML() {
        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj
        const restanteDiv = document.querySelector('.restante')

        //Comprobar 25%
        if( (presupuesto / 4) > restante ) {
            restanteDiv.classList.remove('alert-success', 'alert-warning')
            restanteDiv.classList.add('alert-danger')
        } else if( (presupuesto / 2) > restante ) {
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-warning')
        } else {
            restanteDiv.classList.remove('alert-danger','alert-warning')
            restanteDiv.classList.add('alert-success')

        }

        //Si el total es 0 o menor
        if(restante <= 0) {
            ui.imprimirAlerta('Saldo insuficiente', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true
        } else if (restante >= 1) {
            // ui.imprimirAlerta('Saldo insuficiente', 'error');
            formulario.querySelector('button[type="submit"]').disabled = false
        }

        }


    }



const ui = new UI()
let presupuesto;

//Funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('Cual es tu presupuesto?')

    // console.log( Number(presupuestoUsuario));

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload()
    }

    //Presupuesto valido
    presupuesto =  new Presupuesto(presupuestoUsuario)
    console.log(presupuesto);


    ui.insertarPresupuesto(presupuesto)
}



//Anade gastos
function agregarGastos(el) {
    //Es un submit
    el.preventDefault()

    //leer fatos del formmulario
    const nombre = document.querySelector('#gasto').value
    const cantidad = Number(document.querySelector('#cantidad').value)


    //validar formulario
    if(nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error')
        return
    } else if( cantidad <= 0 || isNaN(cantidad) ) {
        ui.imprimirAlerta('Cantidad no valida', 'error')
        return

    }


    //Generar un objeto con el gasto
    // const { nombre, cantidad } = gastos //Esto extrae nombre y cantidad de gasto
    const gasto = { nombre, cantidad, id: Date.now() } //esta sintaxis une nombre y cantidad a gastos
   
   
    //Anade un nuevo gasto
    presupuesto.nuevoGasto(gasto)



    //Mensaje de verificacion - exitoso
    ui.imprimirAlerta('Gasto agregado Correctamente')


    //Imprimir los gastos
    const { gastos, restante } = presupuesto 
    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto)


    //Reinicia el formulario
    formulario.reset()

}


function elmininarGasto(id) {
    //Elimina del objeto
    presupuesto.elmininarGasto(id)
    const { gastos, restante } = presupuesto
    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto)

}