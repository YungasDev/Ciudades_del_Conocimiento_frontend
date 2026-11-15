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

  readonly coordination = [
    {
      area: 'Organismos provinciales y RIL',
      name: 'Marisa Espinosa',
      role: 'Subdirectora de Modernización y Estadísticas',
      detail:
        'Coordinación con áreas provinciales de conocimiento y modernización. Vínculo con RIL junto a Gerardo.',
      sector: 'provincial',
      status: '',
    },
    {
      area: 'Apoyo a la coordinación',
      name: 'David Cepeda',
      role: 'Reemplazo y comunicación',
      detail:
        'Reemplazo de Gerardo cuando lo disponga e información sobre avances del programa.',
      sector: 'apoyo',
      status: 'Posible Secretaría · a designar',
    },
  ];

  readonly areaLeads = [
    {
      area: 'Comunidad y participación estudiantil',
      name: 'Enzo Navarro',
      role: 'Director de Relaciones con la Comunidad',
      detail:
        'Coordinación con centros vecinales, clubes y organizaciones comunitarias. Acompaña el vínculo educativo junto a Atilio.',
      sector: 'comunidad',
    },
    {
      area: 'Sector privado',
      name: 'Mariana Solana',
      role: 'Contadora pública · Directora de Habilitaciones y Permisos',
      detail:
        'Vínculo con la Unión de Empresarios de Libertador, comercios, servicios, PyMEs y empresas.',
      sector: 'privado',
    },
    {
      area: 'Instituciones educativas',
      name: 'Atilio Cancino',
      role: 'Profesor de Computación y asesor del programa',
      detail:
        'Vínculo con la Técnica Ing. Herminio Arrieta, la Agrotécnica, la Secundaria N.º 65 y otras instituciones.',
      sector: 'educacion',
    },
    {
      area: 'Capacitación en programación',
      name: 'Hugo Rua',
      role: 'Apoyo técnico y pedagógico',
      detail:
        'Apoyo técnico y pedagógico para identificar necesidades formativas.',
      sector: 'capacitacion',
    },
  ];

  readonly operational = [
    ['Juan Gómez', 'Programador junior'],
    ['César Mercado', 'Programador junior'],
    ['Jesús Salazar', 'Programador junior'],
    ['Carla Muñoz', 'Capacitadora en Herramientas Digitales'],
  ];
}
