export interface LegislationItem {
  id: string;
  title: string;
  reference: string;
  description: string;
  date: string;
  category: 'ordenamento' | 'residuos';
  fullText?: string;
  tags: string[];
}

export const legislationDatabase: LegislationItem[] = [
  // Ordenamento do Território
  {
    id: '1',
    title: 'Lei de Bases do Ordenamento do Território',
    reference: 'Lei nº 44/VIII/2018',
    description: 'Estabelece as bases gerais da política de ordenamento do território em Cabo Verde, definindo princípios, objetivos e instrumentos de gestão territorial.',
    date: 'Publicada em 12 de Março de 2018',
    category: 'ordenamento',
    fullText: `CAPÍTULO I - DISPOSIÇÕES GERAIS

Artigo 1º - Objeto
A presente lei estabelece as bases gerais da política de ordenamento do território em Cabo Verde, definindo os princípios, objetivos e instrumentos fundamentais para a gestão territorial sustentável.

Artigo 2º - Princípios fundamentais
O ordenamento do território rege-se pelos seguintes princípios:
a) Sustentabilidade ambiental e desenvolvimento equilibrado;
b) Participação pública e transparência nos processos de decisão;
c) Coordenação entre os diferentes níveis de administração;
d) Proteção e valorização do património natural e cultural;
e) Promoção da coesão territorial e social.

CAPÍTULO II - INSTRUMENTOS DE GESTÃO TERRITORIAL

Artigo 3º - Instrumentos de planeamento
São instrumentos de gestão territorial:
a) Esquema Regional de Ordenamento do Território (EROT);
b) Plano Diretor Municipal (PDM);
c) Plano de Urbanização (PU);
d) Plano de Pormenor (PP).

Artigo 4º - Participação pública
Todos os instrumentos de gestão territorial devem ser submetidos a consulta pública, garantindo a participação efetiva dos cidadãos e das organizações representativas dos interesses em causa.`,
    tags: ['ordenamento', 'território', 'política', 'gestão']
  },
  {
    id: '2',
    title: 'Regime Jurídico dos Instrumentos de Gestão Territorial',
    reference: 'Decreto-Lei nº 53/2019',
    description: 'Define os instrumentos de gestão territorial e o respetivo regime jurídico, incluindo planos diretores municipais e esquemas regionais.',
    date: 'Publicado em 5 de Agosto de 2019',
    category: 'ordenamento',
    fullText: `CAPÍTULO I - DISPOSIÇÕES GERAIS

Artigo 1º - Objeto e âmbito
O presente decreto-lei define o regime jurídico dos instrumentos de gestão territorial, estabelecendo as normas relativas à sua elaboração, aprovação, execução, avaliação e revisão.

Artigo 2º - Instrumentos de gestão territorial
Os instrumentos de gestão territorial compreendem:
a) Instrumentos de desenvolvimento territorial;
b) Instrumentos de planeamento territorial;
c) Instrumentos de política sectorial.

CAPÍTULO II - PLANOS DIRETORES MUNICIPAIS

Artigo 3º - Natureza e objeto
O Plano Diretor Municipal é o instrumento de planeamento que estabelece a estratégia de desenvolvimento territorial do município, definindo o modelo de organização espacial do território municipal.

Artigo 4º - Conteúdo material
O PDM deve conter:
a) Caracterização e diagnóstico do território;
b) Definição dos objetivos estratégicos;
c) Modelo de organização territorial;
d) Normas regulamentares.`,
    tags: ['instrumentos', 'gestão', 'planos', 'municipal']
  },
  {
    id: '3',
    title: 'Regime de Avaliação de Impacto Ambiental',
    reference: 'Decreto-Lei nº 30/2017',
    description: 'Define o regime de avaliação de impacto ambiental de projetos e atividades suscetíveis de afetar o ambiente.',
    date: 'Publicado em 15 de Junho de 2017',
    category: 'ordenamento',
    fullText: `CAPÍTULO I - DISPOSIÇÕES GERAIS

Artigo 1º - Objeto
O presente decreto-lei estabelece o regime jurídico de avaliação de impacto ambiental (AIA) de projetos públicos e privados suscetíveis de produzirem efeitos significativos no ambiente.

Artigo 2º - Objetivos
A avaliação de impacto ambiental tem por objetivos:
a) Assegurar que os efeitos ambientais dos projetos sejam identificados e avaliados;
b) Garantir a participação do público no processo de decisão;
c) Integrar as considerações ambientais no processo de autorização.

CAPÍTULO II - ÂMBITO DE APLICAÇÃO

Artigo 3º - Projetos sujeitos a AIA
Estão sujeitos a avaliação de impacto ambiental os projetos constantes dos anexos I e II do presente decreto-lei.

Artigo 4º - Procedimento de AIA
O procedimento de AIA compreende as seguintes fases:
a) Definição do âmbito;
b) Elaboração do estudo de impacto ambiental;
c) Consulta pública;
d) Avaliação técnica;
e) Decisão.`,
    tags: ['impacto', 'ambiental', 'projetos', 'avaliação']
  },
  {
    id: '4',
    title: 'Regulamento de Licenciamento de Operações Urbanísticas',
    reference: 'Decreto-Lei nº 28/2020',
    description: 'Estabelece o regime de licenciamento de operações urbanísticas e de utilização dos solos.',
    date: 'Publicado em 10 de Abril de 2020',
    category: 'ordenamento',
    fullText: `CAPÍTULO I - DISPOSIÇÕES GERAIS

Artigo 1º - Objeto
O presente decreto-lei estabelece o regime jurídico da urbanização e edificação, definindo os procedimentos de controlo prévio das operações urbanísticas.

Artigo 2º - Operações urbanísticas
Consideram-se operações urbanísticas:
a) Obras de urbanização;
b) Obras de edificação;
c) Obras de demolição;
d) Trabalhos de remodelação de terrenos.

CAPÍTULO II - LICENCIAMENTO

Artigo 3º - Competência
Compete às câmaras municipais o licenciamento das operações urbanísticas, sem prejuízo das competências de outras entidades.

Artigo 4º - Procedimento
O procedimento de licenciamento compreende:
a) Apresentação do pedido;
b) Análise técnica;
c) Consulta pública, quando aplicável;
d) Decisão.`,
    tags: ['licenciamento', 'urbanísticas', 'solos', 'construção']
  },
  {
    id: '5',
    title: 'Lei das Áreas Protegidas',
    reference: 'Lei nº 3/III/93',
    description: 'Define o regime jurídico das áreas protegidas em Cabo Verde, estabelecendo categorias e medidas de proteção.',
    date: 'Publicada em 13 de Janeiro de 1993',
    category: 'ordenamento',
    fullText: `CAPÍTULO I - DISPOSIÇÕES GERAIS

Artigo 1º - Objeto
A presente lei define o regime jurídico das áreas protegidas em Cabo Verde, estabelecendo as bases para a sua criação, gestão e proteção.

Artigo 2º - Objetivos
As áreas protegidas têm por objetivos:
a) Conservar a diversidade biológica;
b) Proteger os ecossistemas naturais;
c) Preservar o património paisagístico e cultural;
d) Promover a investigação científica;
e) Desenvolver atividades de educação ambiental.

CAPÍTULO II - CATEGORIAS DE ÁREAS PROTEGIDAS

Artigo 3º - Categorias
As áreas protegidas classificam-se nas seguintes categorias:
a) Parque Nacional;
b) Reserva Natural;
c) Monumento Natural;
d) Paisagem Protegida.

Artigo 4º - Parque Nacional
O Parque Nacional destina-se à proteção de ecossistemas naturais de grande valor científico e educativo.`,
    tags: ['áreas protegidas', 'conservação', 'biodiversidade', 'proteção']
  },

  // Resíduos Sólidos
  {
    id: '6',
    title: 'Regulamento de Gestão de Resíduos Sólidos',
    reference: 'Decreto-Lei nº 12/2020',
    description: 'Estabelece normas para a gestão integrada de resíduos sólidos em Cabo Verde, incluindo recolha, tratamento e eliminação.',
    date: 'Publicado em 20 de Janeiro de 2020',
    category: 'residuos',
    fullText: `CAPÍTULO I - DISPOSIÇÕES GERAIS

Artigo 1º - Objeto
O presente decreto-lei estabelece o regime jurídico da gestão de resíduos sólidos, definindo princípios e normas aplicáveis à sua prevenção, reutilização, reciclagem e eliminação.

Artigo 2º - Princípios
A gestão de resíduos sólidos rege-se pelos seguintes princípios:
a) Prevenção da produção de resíduos;
b) Responsabilidade do produtor;
c) Proximidade e autossuficiência;
d) Hierarquia de gestão de resíduos.

CAPÍTULO II - GESTÃO DE RESÍDUOS

Artigo 3º - Hierarquia de gestão
A gestão de resíduos obedece à seguinte hierarquia:
a) Prevenção;
b) Preparação para reutilização;
c) Reciclagem;
d) Outros tipos de valorização;
e) Eliminação.

Artigo 4º - Responsabilidades
Compete aos municípios assegurar a recolha, transporte, tratamento e eliminação dos resíduos urbanos produzidos na sua área de jurisdição.`,
    tags: ['resíduos', 'gestão', 'recolha', 'tratamento']
  },
  {
    id: '7',
    title: 'Regime de Gestão de Resíduos Perigosos',
    reference: 'Decreto-Lei nº 45/2019',
    description: 'Define o regime específico para a gestão de resíduos perigosos, incluindo hospitalares e industriais.',
    date: 'Publicado em 22 de Julho de 2019',
    category: 'residuos',
    fullText: `CAPÍTULO I - DISPOSIÇÕES GERAIS

Artigo 1º - Objeto e âmbito
O presente decreto-lei estabelece o regime jurídico aplicável à gestão de resíduos perigosos, incluindo os resíduos hospitalares e industriais.

Artigo 2º - Definições
Para efeitos do presente decreto-lei, entende-se por:
a) Resíduos perigosos: resíduos que apresentem características de perigosidade;
b) Resíduos hospitalares: resíduos resultantes de atividades de cuidados de saúde;
c) Produtor: pessoa singular ou coletiva cuja atividade produza resíduos perigosos.

CAPÍTULO II - OBRIGAÇÕES DOS PRODUTORES

Artigo 3º - Registo
Os produtores de resíduos perigosos devem registar-se junto da autoridade competente.

Artigo 4º - Caracterização
Os produtores devem proceder à caracterização dos resíduos perigosos que produzem, de acordo com a Lista Europeia de Resíduos.`,
    tags: ['resíduos perigosos', 'hospitalares', 'industriais', 'segurança']
  },
  {
    id: '8',
    title: 'Regulamento de Reciclagem e Valorização',
    reference: 'Decreto-Lei nº 18/2021',
    description: 'Estabelece normas para a reciclagem e valorização de resíduos, promovendo a economia circular.',
    date: 'Publicado em 8 de Março de 2021',
    category: 'residuos',
    fullText: `CAPÍTULO I - DISPOSIÇÕES GERAIS

Artigo 1º - Objeto
O presente decreto-lei estabelece o regime jurídico da reciclagem e valorização de resíduos, promovendo a transição para uma economia circular.

Artigo 2º - Objetivos
São objetivos do presente decreto-lei:
a) Promover a reciclagem de resíduos;
b) Incentivar a valorização energética;
c) Reduzir a deposição em aterro;
d) Desenvolver mercados para materiais reciclados.

CAPÍTULO II - RECICLAGEM

Artigo 3º - Metas de reciclagem
São estabelecidas as seguintes metas de reciclagem:
a) 50% dos resíduos urbanos até 2025;
b) 55% dos resíduos urbanos até 2030;
c) 65% dos resíduos urbanos até 2035.

Artigo 4º - Recolha seletiva
Os municípios devem implementar sistemas de recolha seletiva para os principais fluxos de resíduos recicláveis.`,
    tags: ['reciclagem', 'valorização', 'economia circular', 'sustentabilidade']
  },
  {
    id: '9',
    title: 'Taxa de Gestão de Resíduos',
    reference: 'Lei nº 67/VIII/2019',
    description: 'Institui a taxa de gestão de resíduos sólidos urbanos e define os critérios de cobrança.',
    date: 'Publicada em 15 de Outubro de 2019',
    category: 'residuos',
    fullText: `CAPÍTULO I - DISPOSIÇÕES GERAIS

Artigo 1º - Objeto
A presente lei institui a taxa de gestão de resíduos sólidos urbanos, definindo os critérios para a sua cobrança e aplicação.

Artigo 2º - Facto gerador
Constitui facto gerador da taxa a prestação, efetiva ou potencial, dos serviços de recolha, transporte, tratamento e eliminação de resíduos sólidos urbanos.

CAPÍTULO II - INCIDÊNCIA E SUJEITOS PASSIVOS

Artigo 3º - Incidência
A taxa incide sobre os prédios urbanos servidos pelos sistemas públicos de gestão de resíduos sólidos urbanos.

Artigo 4º - Sujeitos passivos
São sujeitos passivos da taxa:
a) Os proprietários dos prédios;
b) Os usufrutuários;
c) Os superficiários;
d) Os enfiteutas.

Artigo 5º - Cálculo da taxa
A taxa é calculada com base no consumo de água ou, na sua falta, na tipologia e área do prédio.`,
    tags: ['taxa', 'cobrança', 'financiamento', 'urbanos']
  },
  {
    id: '10',
    title: 'Regulamento de Compostagem',
    reference: 'Decreto-Lei nº 33/2021',
    description: 'Define normas para a compostagem de resíduos orgânicos e a utilização do composto produzido.',
    date: 'Publicado em 25 de Maio de 2021',
    category: 'residuos',
    fullText: `CAPÍTULO I - DISPOSIÇÕES GERAIS

Artigo 1º - Objeto
O presente decreto-lei estabelece o regime jurídico da compostagem de resíduos orgânicos e da utilização do composto produzido.

Artigo 2º - Definições
Para efeitos do presente decreto-lei, entende-se por:
a) Compostagem: processo biológico de decomposição de matéria orgânica;
b) Composto: produto estabilizado resultante da compostagem;
c) Resíduos orgânicos: resíduos biodegradáveis de origem vegetal ou animal.

CAPÍTULO II - COMPOSTAGEM

Artigo 3º - Tipos de compostagem
A compostagem pode ser:
a) Doméstica: realizada em habitações unifamiliares;
b) Comunitária: realizada por grupos de cidadãos;
c) Industrial: realizada em instalações especializadas.

Artigo 4º - Requisitos técnicos
As instalações de compostagem devem cumprir os requisitos técnicos definidos em regulamentação específica.`,
    tags: ['compostagem', 'orgânicos', 'fertilizante', 'agricultura']
  }
];