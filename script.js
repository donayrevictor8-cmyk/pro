/* ================= COMPONENTES ================= */

function abrirComponente(elemento) {

  elemento.classList.toggle("activo");

}


/* ================= REGISTROS ================= */

const STORAGE =
  "ecotrampa_registros";


function obtenerRegistros() {

  return JSON.parse(
    localStorage.getItem(STORAGE) || "[]"
  );

}


function guardarRegistros(registros) {

  localStorage.setItem(
    STORAGE,
    JSON.stringify(registros)
  );

}


document
  .getElementById("formulario")
  .addEventListener("submit", function(event) {

    event.preventDefault();


    const registro = {

      fecha:
        document.getElementById("fecha").value,

      cultivo:
        document.getElementById("cultivo").value,

      puntuacion:
        document.getElementById("puntuacion").value,

      mosca:
        document.getElementById("moscaBlanca").value,

      trampa:
        document.getElementById("estadoTrampa").value,

      observaciones:
        document.getElementById("observaciones").value

    };


    const registros =
      obtenerRegistros();


    registros.push(registro);


    guardarRegistros(registros);


    this.reset();


    mostrarRegistros();


    alert(
      "¡Registro guardado correctamente! 🌱"
    );

  });


/* ================= MOSTRAR REGISTROS ================= */

function mostrarRegistros() {

  const registros =
    obtenerRegistros();


  const tabla =
    document.getElementById("tabla");


  const mensaje =
    document.getElementById("mensaje");


  tabla.innerHTML = "";


  if (registros.length === 0) {

    mensaje.style.display = "block";

    dibujarGrafico([]);

    return;

  }


  mensaje.style.display = "none";


  registros
    .sort((a,b) =>
      a.fecha.localeCompare(b.fecha)
    )
    .forEach(function(registro) {

      const fila =
        document.createElement("tr");


      fila.innerHTML = `

        <td>
          ${registro.fecha}
        </td>

        <td>
          ${registro.cultivo}
        </td>

        <td>
          ${registro.puntuacion}/5
        </td>

        <td>
          ${registro.mosca}
        </td>

        <td>
          ${registro.trampa}
        </td>

        <td>
          ${registro.observaciones || "—"}
        </td>

      `;


      tabla.appendChild(fila);

    });


  dibujarGrafico(registros);

}


/* ================= BORRAR ================= */

function borrarTodo() {

  if (
    confirm(
      "¿Seguro que quieres borrar todos los registros?"
    )
  ) {

    localStorage.removeItem(STORAGE);

    mostrarRegistros();

  }

}


/* ================= EXPORTAR ================= */

function exportarCSV() {

  const registros =
    obtenerRegistros();


  if (registros.length === 0) {

    alert(
      "Primero agrega un registro."
    );

    return;

  }


  const encabezados = [

    "Fecha",
    "Cultivo",
    "Estado",
    "Mosca blanca",
    "Estado Eco-Trampa",
    "Observaciones"

  ];


  const filas =
    registros.map(r => [

      r.fecha,
      r.cultivo,
      r.puntuacion,
      r.mosca,
      r.trampa,
      r.observaciones

    ]);


  const csv = [

    encabezados,
    ...filas

  ]

  .map(
    fila =>
      fila
        .map(
          dato =>
            `"${String(dato || "")
            .replace(/"/g,'""')}"`
        )
        .join(",")
  )

  .join("\n");


  const archivo =
    new Blob(
      ["\ufeff" + csv],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );


  const url =
    URL.createObjectURL(archivo);


  const enlace =
    document.createElement("a");


  enlace.href = url;

  enlace.download =
    "registros-ecotrampa.csv";


  enlace.click();


  URL.revokeObjectURL(url);

}


/* ================= GRÁFICO ================= */

function dibujarGrafico(registros) {

  const canvas =
    document.getElementById("grafico");


  const ctx =
    canvas.getContext("2d");


  const ancho =
    canvas.width =
    canvas.offsetWidth * 2;


  const alto =
    canvas.height = 540;


  ctx.clearRect(
    0,
    0,
    ancho,
    alto
  );


  const margen = {

    izquierda: 80,
    derecha: 30,
    arriba: 35,
    abajo: 75

  };


  const anchoGrafico =
    ancho -
    margen.izquierda -
    margen.derecha;


  const altoGrafico =
    alto -
    margen.arriba -
    margen.abajo;


  ctx.font = "25px Arial";


  ctx.strokeStyle =
    "#dce8df";


  ctx.lineWidth = 2;


  for (
    let valor = 1;
    valor <= 3;
    valor++
  ) {

    const y =
      margen.arriba +
      altoGrafico -
      ((valor - 1) / 2) *
      altoGrafico;


    ctx.beginPath();

    ctx.moveTo(
      margen.izquierda,
      y
    );

    ctx.lineTo(
      ancho -
      margen.derecha,
      y
    );

    ctx.stroke();


    ctx.fillStyle =
      "#60736a";


    const texto =
      valor === 1
        ? "Baja"
        : valor === 2
        ? "Media"
        : "Alta";


    ctx.fillText(
      texto,
      10,
      y + 8
    );

  }


  if (
    registros.length === 0
  ) return;


  const valores =
    registros.map(
      registro => {

        if (
          registro.mosca === "Baja"
        ) return 1;

        if (
          registro.mosca === "Media"
        ) return 2;

        return 3;

      }
    );


  const pasoX =
    valores.length === 1
      ? 0
      : anchoGrafico /
        (valores.length - 1);


  ctx.strokeStyle =
    "#176b45";


  ctx.lineWidth = 7;


  ctx.beginPath();


  valores.forEach(
    (valor,index) => {

      const x =
        margen.izquierda +
        index * pasoX;


      const y =
        margen.arriba +
        altoGrafico -
        ((valor - 1) / 2) *
        altoGrafico;


      if(index === 0) {

        ctx.moveTo(x,y);

      } else {

        ctx.lineTo(x,y);

      }

    }
  );


  ctx.stroke();


  valores.forEach(
    (valor,index) => {

      const x =
        margen.izquierda +
        index * pasoX;


      const y =
        margen.arriba +
        altoGrafico -
        ((valor - 1) / 2) *
        altoGrafico;


      ctx.fillStyle =
        "#176b45";


      ctx.beginPath();


      ctx.arc(
        x,
        y,
        11,
        0,
        Math.PI * 2
      );


      ctx.fill();


      ctx.fillStyle =
        "#60736a";


      ctx.fillText(
        registros[index].fecha,
        x - 45,
        alto - 25
      );

    }
  );

}


/* ================= ANIMACIONES ================= */

const observador =
  new IntersectionObserver(
    function(entradas) {

      entradas.forEach(
        function(entrada) {

          if (
            entrada.isIntersecting
          ) {

            entrada.target
              .classList
              .add("visible");

          }

        }
      );

    },
    {
      threshold: .12
    }
  );


document
  .querySelectorAll(".animar")
  .forEach(
    elemento =>
      observador.observe(elemento)
  );


/* ================= INICIO ================= */

document
  .getElementById("fecha")
  .valueAsDate =
  new Date();


mostrarRegistros();
