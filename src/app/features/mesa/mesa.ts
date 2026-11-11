import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mesa',
  imports: [RouterLink],
  templateUrl: './mesa.html',
})
export class Mesa {
  readonly sectors = [
    ['Gobierno municipal', 'Coordina, convoca y acompaña el programa.'],
    ['Instituciones educativas', 'Aportan formación, talento y conocimiento.'],
    ['Sector privado', 'Genera empleo, innovación y oportunidades.'],
    ['Organizaciones de la comunidad', 'Representan necesidades y propuestas de los vecinos.'],
  ];

  readonly offers = [
    ['Formación y capacidades', 'Talleres, charlas y espacios de formación para estudiantes, docentes, emprendedores y equipos municipales.'],
    ['Articulación', 'Conexión con instituciones educativas, empresas y organizaciones para desarrollar proyectos conjuntos.'],
    ['Visibilidad', 'Difusión de iniciativas, experiencias y resultados en el sitio y en los canales del programa.'],
    ['Acceso a RIL', 'Participación en encuentros, metodologías y experiencias de otras ciudades de la Red de Innovación Local.'],
    ['Información y acompañamiento', 'Orientación para identificar oportunidades, requisitos y actores relevantes.'],
    ['Participación en la Mesa', 'Priorizar temas, proponer proyectos y hacer seguimiento de los compromisos.'],
  ];

  readonly steps = [
    ['Conocé el programa', 'Leé las secciones de esta página y las novedades.'],
    ['Identificá tu sector', 'Gobierno, educación, sector privado o comunidad.'],
    ['Completá el formulario', 'Contanos quién sos y qué te interesa aportar.'],
    ['Sumate a la Mesa', 'Te contactamos para el próximo encuentro.'],
    ['Participá de los proyectos', 'Formá parte de las iniciativas y del seguimiento.'],
  ];
}
