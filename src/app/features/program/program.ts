import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-program',
  imports: [RouterLink],
  templateUrl: './program.html',
})
export class Program {
  readonly objectives = [
    'Fortalecer la articulación institucional.',
    'Ampliar las oportunidades de formación.',
    'Vincular la formación con el trabajo.',
    'Impulsar la innovación y los emprendimientos.',
    'Mejorar la gestión y los servicios municipales.',
    'Sostener y evaluar el programa.',
  ];

  readonly values = [
    ['Inclusión y equidad', 'Ampliar el acceso a la formación y a las oportunidades, considerando las barreras económicas, territoriales, generacionales y de accesibilidad.'],
    ['Colaboración', 'Construir acuerdos y responsabilidades compartidas entre municipio, instituciones educativas, empresas y comunidad.'],
    ['Identidad y compromiso local', 'Orientar el conocimiento hacia las necesidades de Libertador y su vinculación con el departamento Ledesma.'],
    ['Aprendizaje e innovación', 'Valorar los saberes existentes, incorporar nuevas capacidades y aprender de las experiencias.'],
    ['Transparencia y responsabilidad', 'Definir criterios claros, utilizar responsablemente los recursos y comunicar avances y resultados.'],
    ['Sostenibilidad', 'Considerar los efectos sociales, económicos y ambientales de los proyectos y su continuidad en el tiempo.'],
  ];

  readonly steps = [
    ['Diagnosticar', 'Reconocer necesidades, capacidades y actores.'],
    ['Articular actores', 'Conectar instituciones, empresas, gobierno y comunidad.'],
    ['Definir proyectos', 'Acordar prioridades y una agenda compartida.'],
    ['Medir resultados', 'Definir indicadores y hacer seguimiento.'],
    ['Mejorar', 'Ajustar lo que no funciona y sostener lo que sí.'],
  ];
}
