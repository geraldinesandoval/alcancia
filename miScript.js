const LS_MOVIMIENTOS = 'alcanciaMovimientos';
const saldoTotalElemento = document.getElementById('saldoTotal');
const listaMovimientosElemento = document.getElementById('listaMovimientos');
const mensajeErrorElemento = document.getElementById('mensajeError');

function obtenerMovimientos() {
    const movimientosJSON = localStorage.getItem(LS_MOVIMIENTOS);
    return movimientosJSON ? JSON.parse(movimientosJSON) : [];
}
 
function guardarMovimientos(movimientos) {
    localStorage.setItem(LS_MOVIMIENTOS, JSON.stringify(movimientos));
}

function actualizarInterfaz() {
    const movimientos = obtenerMovimientos();
    const saldoTotal = movimientos.reduce((total, movimiento) => {
        return total + movimiento.monto;
    }, 0)

    saldoTotalElemento.textContent = saldoTotal.toFixed(2);
    mostrarHistorial(movimientos);
    mensajeErrorElemento.textContent = '';
    return saldoTotal;
}

function mostrarHistorial(movimientos) {
    listaMovimientosElemento.innerHTML = ''; 
    movimientos.forEach(mov => {
        const fila = document.createElement('tr');
        const tipoClase = mov.tipo === 'ahorro' ? 'ahorro' : 'retiro';
        const tipoTexto = mov.tipo === 'ahorro' ? 'Ahorro (+)' : 'Retiro (-)';
        fila.innerHTML = `
            <td class="${tipoClase}">${tipoTexto}</td>
            <td class="${tipoClase}">$${Math.abs(mov.monto).toFixed(2)}</td>
            <td>${new Date(mov.fecha).toLocaleString()}</td>
        `;

        listaMovimientosElemento.appendChild(fila);
    });
}

function realizarAhorro() {
    const montoSeleccionado = document.getElementById('montoAhorrar').value;
    const monto = parseFloat(montoSeleccionado);
    
    if (isNaN(monto) || monto <= 0) {
        alert('Por favor, selecciona un monto valido para ahorrar.');
        return;
    }

    const movimientos = obtenerMovimientos();
    const nuevoMovimiento = {
        tipo: 'ahorro',
        monto: monto, 
        fecha: new Date().toISOString()
    };

    movimientos.push(nuevoMovimiento);
    guardarMovimientos(movimientos);
    actualizarInterfaz();         
    document.getElementById('montoAhorrar').selectedIndex = 0;
}

function realizarRetiro() {
    const montoInput = document.getElementById('montoRetirar');
    const monto = parseFloat(montoInput.value);

    if (isNaN(monto) || monto <= 0) {
        mensajeErrorElemento.textContent = 'Ingresa una cantidad valida y positiva para retirar.';
        return;
    }

    const saldoActual = actualizarInterfaz(); 
    if (saldoActual < monto) {
        mensajeErrorElemento.textContent = `Error: Saldo insuficiente. Solo tienes $${saldoActual.toFixed(2)}.`;
        return;
    }
    const movimientos = obtenerMovimientos();
    
    const nuevoMovimiento = {
        tipo: 'retiro',
        monto: -monto, 
        fecha: new Date().toISOString()
    };

    movimientos.push(nuevoMovimiento);
    guardarMovimientos(movimientos); 
    actualizarInterfaz();       
    montoInput.value = '';
    mensajeErrorElemento.textContent = '';
}

document.addEventListener('DOMContentLoaded', actualizarInterfaz);