document.addEventListener("DOMContentLoaded", function () {
  const modalAgregar = document.getElementById("modal-agregar");
  const modalInfo = document.getElementById("modal-info");
  const abrirModalBtn = document.getElementById("abrir-formulario");
  const cerrarModalBtns = document.querySelectorAll(".cerrar-modal");
  const formulario = document.getElementById("formulario-agregar");
  const infoContenedor = document.getElementById("info-contenedor");

  // Abrir modal de agregar
  abrirModalBtn.addEventListener("click", function () {
    modalAgregar.style.display = "flex";
  });

  // Cerrar modales
  cerrarModalBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      modalAgregar.style.display = "none";
      modalInfo.style.display = "none";
    });
  });

  // Cerrar modales al hacer clic fuera del contenido
  window.addEventListener("click", function (e) {
    if (e.target === modalAgregar || e.target === modalInfo) {
      modalAgregar.style.display = "none";
      modalInfo.style.display = "none";
    }
  });

  // Agregar nuevo contenedor
  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    const codigo = document.getElementById("codigo").value.trim();
    const numeroContenedor = document.getElementById("numero-contenedor").value.trim();
    const tipoContenedor = document.getElementById("tipo-contenedor").value;
    const tamanoContenedor = document.getElementById("tamano-contenedor").value.trim();
    const peso = document.getElementById("peso").value.trim();
    const descripcionMercancia = document.getElementById("descripcion-mercancia").value.trim();

    if (!codigo || !numeroContenedor || !tipoContenedor || !tamanoContenedor || !peso || !descripcionMercancia) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Enviar datos al backend
    fetch("http://localhost:3000/api/espacios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codigo,
        numero_contenedor: numeroContenedor,
        tipo_contenedor: tipoContenedor,
        tamano_contenedor: tamanoContenedor,
        peso,
        descripcion_mercancia: descripcionMercancia,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          // Recargar los contenedores después de agregar uno nuevo
          cargarContenedores();
          // Limpiar el formulario y cerrar el modal
          formulario.reset();
          modalAgregar.style.display = "none";
        }
      })
      .catch((error) => {
        console.error("Error al enviar los datos:", error);
        alert("Hubo un error al agregar el espacio.");
      });
  });

  // Función para cargar los contenedores desde la base de datos
  function cargarContenedores() {
    fetch("http://localhost:3000/api/espacios")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error al cargar los contenedores:", data.error);
        } else {
          // Limpiar las secciones antes de cargar los contenedores
          document.querySelectorAll(".bloques").forEach((seccion) => {
            seccion.innerHTML = "";
          });

          // Mostrar los contenedores en sus secciones correspondientes
          data.forEach((contenedor) => {
            const seccion = document.getElementById(contenedor.tipo_contenedor);
            if (seccion) {
              const nuevoBloque = document.createElement("div");
              nuevoBloque.classList.add("bloque");
              nuevoBloque.dataset.codigo = contenedor.codigo;
              nuevoBloque.dataset.tipo = contenedor.tipo_contenedor;
              nuevoBloque.textContent = contenedor.codigo;

              // Aplicar color según el tipo
              switch (contenedor.tipo_contenedor) {
                case "normal":
                  nuevoBloque.style.backgroundColor = "green";
                  nuevoBloque.style.color = "white";
                  break;
                case "peligroso":
                  nuevoBloque.style.backgroundColor = "red";
                  nuevoBloque.style.color = "white";
                  break;
                case "refrigerado":
                  nuevoBloque.style.backgroundColor = "skyblue";
                  nuevoBloque.style.color = "black";
                  break;
                case "vacío":
                  nuevoBloque.style.backgroundColor = "gray";
                  nuevoBloque.style.color = "white";
                  break;
              }

              // Agregar evento de clic para mostrar la información del contenedor
              nuevoBloque.addEventListener("click", function () {
                mostrarInformacionContenedor(contenedor);
              });

              seccion.appendChild(nuevoBloque);
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error al cargar los contenedores:", error);
      });
  }

  // Función para mostrar la información del contenedor
  function mostrarInformacionContenedor(contenedor) {
    // Mostrar la información en el modal
    infoContenedor.innerHTML = `
      <p><strong>Código:</strong> ${contenedor.codigo}</p>
      <p><strong>Número de Contenedor:</strong> ${contenedor.numero_contenedor}</p>
      <p><strong>Tipo de Contenedor:</strong> ${contenedor.tipo_contenedor}</p>
      <p><strong>Tamaño del Contenedor:</strong> ${contenedor.tamano_contenedor}</p>
      <p><strong>Peso:</strong> ${contenedor.peso} kg</p>
      <p><strong>Descripción de la Mercancía:</strong> ${contenedor.descripcion_mercancia}</p>
    `;

    // Mostrar el modal de información
    modalInfo.style.display = "flex";
  }
});