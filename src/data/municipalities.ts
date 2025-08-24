export interface Municipality {
  name: string;
  neighborhoods: string[];
}

export const municipalities: Record<string, string[]> = {
  // Santiago
  'Praia': [
    'Achada Santo António',
    'Achada Grande Frente',
    'Achada Grande Trás',
    'Palmarejo',
    'Prainha',
    'Várzea',
    'Plateau',
    'Fazenda',
    'Tira Chapéu',
    'Safende'
  ],
  'Santa Catarina': [
    'Assomada Centro',
    'Chão de Tanque',
    'Figueira das Naus',
    'Picos',
    'Rincão',
    'João Teves',
    'Fundura',
    'Boa Entrada'
  ],
  'Tarrafal': [
    'Tarrafal Centro',
    'Chão Bom',
    'Porto Formoso',
    'Baía',
    'Monte Trigo'
  ],
  'São Domingos': [
    'São Domingos Centro',
    'Rui Vaz',
    'Praia Baixo',
    'Achada Falcão'
  ],
  'São Miguel': [
    'Calheta de São Miguel',
    'Flamengos',
    'Principal',
    'Ribeira Principal'
  ],
  'Ribeira Grande de Santiago': [
    'Cidade Velha',
    'São Jorginho',
    'Trindade',
    'Águas Santas'
  ],
  'São Lourenço dos Órgãos': [
    'João Teves',
    'Pico',
    'Órgãos',
    'Ribeira da Prata'
  ],
  'Santa Cruz': [
    'Pedra Badejo',
    'Achada Leitão',
    'Calheta de São Miguel',
    'Principal'
  ],

  // São Vicente
  'São Vicente': [
    'Mindelo Centro',
    'Laginha',
    'São Pedro',
    'Monte Sossego',
    'Baía das Gatas',
    'Ribeira de Julião',
    'Madeiral',
    'Fonte Francês'
  ],

  // Sal
  'Sal': [
    'Santa Maria',
    'Espargos',
    'Murdeira',
    'Palmeira',
    'Pedra de Lume',
    'Fontona',
    'Feijoal'
  ],

  // Boa Vista
  'Boa Vista': [
    'Sal Rei',
    'Rabil',
    'Funda',
    'Cabeço dos Tarafes',
    'Povoação Velha',
    'João Galego',
    'Bofarreira'
  ],

  // Fogo
  'Santa Catarina do Fogo': [
    'Cova Figueira',
    'Figueira Pavão',
    'Achada Furna',
    'Relva'
  ],
  'São Filipe': [
    'São Filipe Centro',
    'Patim',
    'Luzia Nunes',
    'Chã das Caldeiras'
  ],
  'Mosteiros': [
    'Mosteiros Centro',
    'Fajã de Baixo',
    'Fajã de Cima',
    'Ribeira Ilhéu'
  ],

  // Maio
  'Maio': [
    'Vila do Maio',
    'Morro',
    'Calheta',
    'Pedro Vaz'
  ],

  // Brava
  'Brava': [
    'Nova Sintra',
    'Fajã de Água',
    'Furna',
    'Nossa Senhora do Monte'
  ],

  // Santo Antão
  'Ribeira Grande': [
    'Ribeira Grande Centro',
    'Ponta do Sol',
    'Fontainhas',
    'Coculi',
    'Boca de Pistola'
  ],
  'Paul': [
    'Pombas',
    'Vila das Pombas',
    'Cabo da Ribeira',
    'Eito'
  ],
  'Porto Novo': [
    'Porto Novo Centro',
    'Ribeira das Patas',
    'Monte Trigo',
    'Tarrafal de Monte Trigo'
  ],

  // São Nicolau
  'São Nicolau': [
    'Ribeira Brava',
    'Tarrafal de São Nicolau',
    'Vila da Ribeira Brava',
    'Carriçal',
    'Juncalinho'
  ]
};

export const getAllMunicipalities = (): string[] => {
  return Object.keys(municipalities).sort();
};

export const getNeighborhoods = (municipality: string): string[] => {
  return municipalities[municipality] || [];
};