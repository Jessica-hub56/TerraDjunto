import React from 'react';

const months = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];
const participationPerMonth = [
  30, 45, 60, 80, 120, 150, 200, 180, 160, 140, 100, 60
];

const max = Math.max(...participationPerMonth, 1);

function getBarColor(idx: number, total: number) {
  const hue = 180 + (idx * 180 / total);
  return `hsl(${hue}, 60%, 45%)`;
}

const ParticipationBarChart: React.FC = () => {
  // Layout dinâmico para garantir visibilidade de todos os meses
  const width = 600; // viewBox width
  const height = 240; // viewBox height com margem inferior maior
  const margin = { top: 10, right: 20, bottom: 40, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom - 20; // espaço para valores acima das barras

  const count = months.length;
  const step = innerWidth / count; // espaço reservado por mês
  const barWidth = Math.max(12, Math.min(32, step * 0.6));

  return (
    <div className="h-64 flex flex-col justify-end items-center">
      <div className="w-full max-w-[720px]">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* Eixo Y */}
        <line x1={margin.left - 5} y1={margin.top} x2={margin.left - 5} y2={margin.top + innerHeight} stroke="#bbb" strokeWidth="1" />
        {/* Eixo X */}
        <line x1={margin.left - 5} y1={margin.top + innerHeight} x2={margin.left + innerWidth} y2={margin.top + innerHeight} stroke="#bbb" strokeWidth="1" />

        {participationPerMonth.map((value, idx) => {
          const xCenter = margin.left + idx * step + step / 2;
          const barHeight = (value / max) * (innerHeight - 20);
          const barX = xCenter - barWidth / 2;
          const barY = margin.top + innerHeight - barHeight;
          return (
            <g key={idx}>
              <rect
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={getBarColor(idx, participationPerMonth.length)}
                rx={4}
              />
              {/* Valor acima da barra */}
              <text
                x={xCenter}
                y={barY - 6}
                textAnchor="middle"
                fontSize="11"
                fill="#2c7873"
                fontWeight="bold"
              >
                {value}
              </text>
              {/* Rótulo do mês */}
              <text
                x={xCenter}
                y={margin.top + innerHeight + 16}
                textAnchor="middle"
                fontSize="12"
                fill="#555"
              >
                {months[idx]}
              </text>
            </g>
          );
        })}
      </svg>
      </div>
      <div className="text-xs text-gray-500 text-center mt-2">Dados simulados dos últimos 12 meses</div>
    </div>
  );
};

export default ParticipationBarChart;
