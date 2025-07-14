let materiasAprobadas = JSON.parse(localStorage.getItem('aprobadas')) || [];

fetch('materias.json')
  .then(res => res.json())
  .then(materias => {
    const container = document.getElementById('malla');

    function actualizarVista() {
      container.innerHTML = ''; // Limpiar
      materias.forEach(materia => {
        const div = document.createElement('div');
        div.className = 'materia';

        const cumplidas = materia.requisitos.every(cor => materiasAprobadas.includes(cor));
        const aprobada = materiasAprobadas.includes(materia.codigo);

        // Estado visual
        if (aprobada) {
          div.style.backgroundColor = '#b9f6ca'; // Verde claro
        } else if (cumplidas) {
          div.style.backgroundColor = '#fff59d'; // Amarillo claro
        } else {
          div.style.backgroundColor = '#eeeeee'; // Gris
        }

        // HTML interno
        div.innerHTML = `
          <div class="codigo">${materia.codigo}</div>
          <div>${materia.nombre}</div>
          <div>${materia.carga_horaria}</div>
          <div class="vinculo">${materia.requisitos.length > 0 ? 'Req: ' + materia.requisitos.join(', ') : 'Sin correlativas'}</div>
        `;

        // Click: marcar como aprobada solo si se cumplen requisitos
        if (cumplidas || aprobada) {
          div.addEventListener('click', () => {
            if (aprobada) {
              // Si ya estaba aprobada, desmarcar
              materiasAprobadas = materiasAprobadas.filter(c => c !== materia.codigo);
            } else {
              materiasAprobadas.push(materia.codigo);
            }
            localStorage.setItem('aprobadas', JSON.stringify(materiasAprobadas));
            actualizarVista();
          });
        }

        container.appendChild(div);
      });
    }

    actualizarVista();
  });
