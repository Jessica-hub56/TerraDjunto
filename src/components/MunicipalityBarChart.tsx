import React from 'react';
import { getAllMunicipalities } from '../data/municipalities';

// Gera dados simulados para todos os municípios
const municipalities = getAllMunicipalities();
const data = municipalities.map((m) => ({ municipio: m, valor: Math.max(5, Math.round(200 * Math.random())) }));

const max = Math.max(...data.map(d => d.valor), 1);

function getBarColor(idx: number, total: number) {
  // Gera cores HSL variando o matiz
  const hue = 220 + (idx * 120 / total);
  return `hsl(${hue}, 65%, 50%)`;
}

const MunicipalityBarChart: React.FC = () => {
  // Layout com rotação e maior margem inferior para evitar sobreposição de rótulos
  const width = 700; // aumentar a largura do viewBox para mais barras
  const height = 320; // mais altura para rótulos em 2 linhas
  const margin = { top: 10, right: 24, bottom: 80, left: 48 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom - 20;

  const count = data.length;
  const step = innerWidth / count;
  const barWidth = Math.max(10, Math.min(24, step * 0.6));

  return (
    <div className="h-80 flex flex-col justify-end items-center">
              <div className="w-full max-w-[880px] mx-auto">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* Eixo Y */}
        <line x1={margin.left - 5} y1={margin.top} x2={margin.left - 5} y2={margin.top + innerHeight} stroke="#bbb" strokeWidth="1" />
        {/* Eixo X */}
        <line x1={margin.left - 5} y1={margin.top + innerHeight} x2={margin.left + innerWidth} y2={margin.top + innerHeight} stroke="#bbb" strokeWidth="1" />

        {data.map((item, idx) => {
          const xCenter = margin.left + idx * step + step / 2;
          const barHeight = (item.valor / max) * (innerHeight - 20);
          const barX = xCenter - barWidth / 2;
          const barY = margin.top + innerHeight - barHeight;
          return (
            <g key={idx}>
              <rect
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={getBarColor(idx, data.length)}
                rx={3}
              />
              {/* Valor acima da barra */}
              <text
                x={xCenter}
                y={barY - 6}
                textAnchor="middle"
                fontSize="10"
                fill="#2c7873"
                fontWeight="bold"
              >
                {item.valor}
              </text>
              {/* Rótulo do município com rotação e quebra condicional */}
              <g transform={`translate(${xCenter}, ${margin.top + innerHeight + 16}) rotate(-35)`}>
                <text
                  textAnchor="end"
                  fontSize="10"
                  fill="#555"
                >
                  {item.municipio}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
      </div>
      <div className="text-xs text-gray-500 text-center mt-2">Participação simulada por município (22 municípios)</div>
    </div>
  );
};

export default MunicipalityBarChart;
