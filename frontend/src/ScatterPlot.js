//Visualization(Scatter Plot) between various Attributes

function ScatterPlot({
  players,
  width,
  height,
  selectedPlayer,
  selectedX,
  selectedY,
}) {
  const padding = 60; // Space for axes and labels
  const borderPadding = 10; // Additional padding for the border

  // Calculate the extents of the data
  const xExtent = [
    Math.min(...players.map((p) => p[selectedX])),
    Math.max(...players.map((p) => p[selectedX])),
  ];
  const yExtent = [
    Math.min(...players.map((p) => p[selectedY])),
    Math.max(...players.map((p) => p[selectedY])),
  ];

  // Function to adjust start and end of the range to rounded values
  const adjustStart = (minValue, interval) =>
    Math.floor(minValue / interval) * interval;
  const adjustEnd = (maxValue, interval) =>
    Math.ceil(maxValue / interval) * interval;

  //Get start and end point for each axis
  const xStart = adjustStart(xExtent[0], 5);
  const xEnd = adjustEnd(xExtent[1], 5);
  const yStart = adjustStart(yExtent[0], 5);
  const yEnd = adjustEnd(yExtent[1], 5);

  // Scale functions for the data points
  const scaleX = (d) =>
    ((d - xStart) / (xEnd - xStart)) * (width - 2 * padding) + padding;

  const scaleY = (d) =>
    height -
    padding -
    ((d - yStart) / (yEnd - yStart)) * (height - 2 * padding);

  // Generate ticks for the axes
  const generateTicks = (start, end, numTicks) => {
    const step = (end - start) / numTicks;
    return Array.from({ length: numTicks + 1 }, (_, i) => start + i * step);
  };

  const xTicks = generateTicks(xStart, xEnd, 5);
  const yTicks = generateTicks(yStart, yEnd, 5);

  return (
    <svg width={width + borderPadding * 2} height={height + borderPadding * 2}>
      {/* Border around the plot */}
      <rect
        x={borderPadding}
        y={borderPadding}
        width={width}
        height={height}
        fill="none"
        stroke="black"
      />

      {/* Plot Title */}
      <text
        x={width / 2 + borderPadding}
        y={borderPadding + 20}
        textAnchor="middle"
        fontWeight="bold"
      >
        {selectedX} vs {selectedY}
      </text>

      {/* Shift the entire plot content by borderPadding */}
      <g transform={`translate(${borderPadding}, ${borderPadding})`}>

        {/* Render the points */}
        {players.map((player) => (
          <>
            <circle
              cx={scaleX(player[selectedX])}
              cy={scaleY(player[selectedY])}
              r={selectedPlayer && player.Name === selectedPlayer.Name ? 15 : 5} // Larger radius if selected
              fill={
                selectedPlayer && player.Name === selectedPlayer.Name
                  ? "#f5d2ba"
                  : "#9ef0b7"
              } // Change color if selected
              opacity={
                selectedPlayer && player.Name !== selectedPlayer.Name ? 0.4 : 1
              } // Change opacity if selected
              key={player.Name}
            />
            {selectedPlayer && player.Name === selectedPlayer.Name && (
              <text
                x={scaleX(player[selectedX])}
                y={scaleY(player[selectedY]) - 10}
                dy="-10"
                textAnchor="middle"
              >
                {player.Name}
              </text>
            )}
          </>
        ))}

        {/* Axes */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="black"
        />
        <line
          x1={padding}
          y1={height - padding}
          x2={padding}
          y2={padding}
          stroke="black"
        />

        {/* X-axis Ticks and Labels */}
        {xTicks.map((tick, index) => (
          <g key={index}>
            <line
              x1={scaleX(tick)}
              y1={height - padding}
              x2={scaleX(tick)}
              y2={height - padding + 5}
              stroke="black"
            />
            <text
              x={scaleX(tick)}
              y={height - padding + 20}
              textAnchor="middle"
            >
              {tick.toFixed(0)}
            </text>
          </g>
        ))}

        {/* Y-axis Ticks and Labels */}
        {yTicks.map((tick, index) => (
          <g key={index}>
            <line
              x1={padding - 5}
              y1={scaleY(tick)}
              x2={padding}
              y2={scaleY(tick)}
              stroke="black"
            />
            <text x={padding - 10} y={scaleY(tick) + 5} textAnchor="end">
              {tick.toFixed(0)}
            </text>
          </g>
        ))}

        {/* Axis Titles */}
        <text x={width / 2} y={height - 10} textAnchor="middle">
          {selectedX}
        </text>
        <text
          x={20}
          y={height / 2}
          textAnchor="middle"
          transform={`rotate(-90 20,${height / 2})`}
        >
          {selectedY}
        </text>
      </g>
    </svg>
  );
}
export default ScatterPlot;
