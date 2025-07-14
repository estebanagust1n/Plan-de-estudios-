let materiasAprobadas = JSON.parse(localStorage.getItem('aprobadas')) || [];

fetch('materias.json')
  .then(res => res.json())
  .then(materias => {
    const tramo1 = document.getElementById('tramo1');
    const tramo2 = document.getElementById('tramo2');
    const profesional = document.getElementById('profesional');
    const resumen = document.getElementById('resumen');

    function actualizarVista() {
      tramo1.innerHTML = '';
      tramo2.innerHTML = '';
      profesional.innerHTML = '';

      materias.forEach(materia => {
        const div = document.createElement('div');
        div.className = 'materia';

        const cumplidas = materia.requisitos.every(cor => materiasAprobadas.includes(cor));
        const aprobada = materiasAprobadas.includes(materia.codigo);

        if (aprobada) {
          div.style.backgroundColor = '#b9f6ca'; // verde claro
        } else if (cumplidas) {
          div.style.backgroundColor = '#fff59d'; // amarillo
        } else {
          div.style.backgroundColor = '#eeeeee'; // gris
        }

        div.innerHTML = `
          <div class="codigo">${materia.codigo}</div>
          <div>${materia.nombre}</div>
          <div>${materia.carga_horaria}</div>
          <div class="vinculo">${materia.requisitos.length > 0 ? 'Req: ' + materia.requisitos.join(', ') : 'Sin correlativas'}</div>
        `;

        if (cumplidas || aprobada) {
          div.addEventListener('click', (e) => {
  if (e.target.tagName === 'INPUT') return; // no disparar si clic en input
            if (aprobada) {
              materiasAprobadas = materiasAprobadas.filter(c => c !== materia.codigo);
              localStorage.removeItem(`nota-${materia.codigo}`);
            } else {
              materiasAprobadas.push(materia.codigo);
            }
            localStorage.setItem('aprobadas', JSON.stringify(materiasAprobadas));
            actualizarVista();
          });
        }

        if (aprobada) {
          const nota = localStorage.getItem(`nota-${materia.codigo}`) || '';
          const input = document.createElement('input');
          input.type = 'number';
          input.min = 4;
          input.max = 10;
          input.value = nota;
          input.placeholder = 'Nota';
          input.addEventListener('change', () => {
            localStorage.setItem(`nota-${materia.codigo}`, input.value);
          });
          div.appendChild(input);
        }

        if (materia.tramo === "Primer tramo") tramo1.appendChild(div);
        else if (materia.tramo === "Segundo tramo") tramo2.appendChild(div);
        else profesional.appendChild(div);
      });

      const total = materias.length;
      const aprobadas = materiasAprobadas.length;
      const porcentaje = ((aprobadas / total) * 100).toFixed(1);

      document.getElementById('stats-text').innerHTML = `
  <p><strong>${aprobadas}</strong> materias aprobadas de <strong>${total}</strong> – Avance: <strong>${porcentaje}%</strong></p>
`;
document.getElementById('barra-progreso').style.width = `${porcentaje}%`;
    }

    actualizarVista();
  });
function exportarPDF() {
  const resumen = document.getElementById('resumen');
  const ventana = window.open('', '', 'width=800,height=600');
  ventana.document.write('<html><head><title>Resumen</title></head><body>');
  ventana.document.write('<h1>Resumen de la Carrera</h1>');
  ventana.document.write(document.getElementById('stats-text').innerHTML);

  const notas = materiasAprobadas.map(codigo => {
    const nota = localStorage.getItem(`nota-${codigo}`) || 'Sin nota';
    return `<p>${codigo}: ${nota}</p>`;
  }).join('');

  ventana.document.write('<h2>Notas:</h2>');
  ventana.document.write(notas);
  ventana.document.write('</body></html>');
  ventana.document.close();
  ventana.print();
}
