//Constructores
function Seguro(marca, year, tipo) {
  this.marca = marca;
  this.year = year;
  this.tipo = tipo;
}
Seguro.prototype.cotizarSeguro = function () {
  /*
    1 = Americano 1.15
    2 = Asiatico 1.05
    3 = Europeo 1.35
    */
  let cantidad;
  const base = 2000;
  switch (this.marca) {
    case '1':
      cantidad = base * 1.15;
      break;
    case '2':
      cantidad = base * 1.05;
      break;
    case '3':
      cantidad = base * 1.35;
      break;
    default:
      break;
  }
  //leer el año
  const diferencia = new Date().getFullYear() - this.year;
  //Cada año que la diferencia es mayor el costo del seguro se reduce un 3%
  cantidad -= (diferencia * 3 * cantidad) / 100;

  /*
    Si el seguro es basico se multiplica por un 30% mas
    Si el seguro es completo se multiplica por un 50% mas
  */
  if (this.tipo === 'básico') {
    cantidad *= 1.3;
  } else {
    cantidad *= 1.5;
  }
  return cantidad;
};
function UI() {}
UI.prototype.mostrarResultado = (seguro, total) => {
  const {marca, year, tipo} = seguro;
  let textoMarca;
  switch (marca) {
    case '1':
      textoMarca = 'Americano';
      break;
    case '2':
      textoMarca = 'Asiatico';
      break;
    case '3':
      textoMarca = 'Europeo';
      break;
    default:
      break;
  }
  //crear el resultado
  const div = document.createElement('div');
  div.classList.add('mt-10');
  div.innerHTML = `
    <p class="header">Tu resumen</p>
    <p class="font-bold">Total: $${total}</p>
    <p class="font-bold">Marca: ${textoMarca}</p>
    <p class="font-bold">Año: ${year}</p>
    <p class="font-bold capitalize">Tipo: ${tipo}</p>
 
  `;
  const reusltadoDiv = document.querySelector('#resultado');

  //Mostrar el Spinner
  const spinner = document.querySelector('#cargando');
  spinner.style.display = 'block';
  setTimeout(() => {
    spinner.style.display = 'none';
    reusltadoDiv.appendChild(div);
  }, 3000);
};
//llena la opciones de los años
UI.prototype.llenarOpciones = () => {
  const max = new Date().getFullYear(),
    min = max - 20;
  const selectYear = document.querySelector('#selectYear');
  for (let i = max; i > min; i--) {
    let option = document.createElement('option');
    option.value = i;
    option.text = i;
    selectYear.appendChild(option);
  }
};
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
  const div = document.createElement('div');
  div.classList.add('mensaje', 'mt-10');
  div.textContent = mensaje;
  if (tipo === 'error') {
    div.classList.add('error');
  } else {
    div.classList.add('correcto');
  }
  //insertar en HTML
  const formulario = document.querySelector('#cotizar-seguro');
  formulario.insertBefore(div, document.querySelector('#resultado'));
  setTimeout(() => {
    div.remove();
  }, 3000);
};
//instanciar UI
const ui = new UI();
document.addEventListener('DOMContentLoaded', () => {
  ui.llenarOpciones();
});
eventListeners();
function eventListeners() {
  const formulario = document.querySelector('#cotizar-seguro');
  formulario.addEventListener('submit', cotizarSeguro);
}
function cotizarSeguro(e) {
  e.preventDefault();
  //Leer la marca seleccionada
  const marca = document.querySelector('#marca').value;
  //leer el año
  const year = document.querySelector('#selectYear').value;
  //Leer tipo de cobertura
  const tipo = document.querySelector('input[name="tipo"]:checked').value;
  if (marca === '' || year === '' || tipo === '') {
    ui.mostrarMensaje('Debes llenar todos los campos', 'error');
    return;
  }
  ui.mostrarMensaje('Cotizando', 'exito');
  //Ocultar cotizaciones previas
  const resultados = document.querySelector('#resultado div');
  if (resultados != null) {
    resultados.remove();
  }
  //instanciar el seguro
  const seguro = new Seguro(marca, year, tipo);
  const total = seguro.cotizarSeguro(marca, year, tipo);
  //utilizar el prototype que va a cotizar
  ui.mostrarResultado(seguro, total);
}
