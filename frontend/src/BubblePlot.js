//Visualization(Bubble Plot) between Technical and Physical Skills

function BubblePlot({ players, width, height, selectedPlayer }) {
  const padding = 60; // Space for axes and labels
  const borderPadding = 10; // Additional padding for the border

  // Function to calculate average technical and physical skills
  const calculateAverageSkills = (player) => {
    const technicalSkills = [
      player.Ball_Control,
      player.Dribbling,
      player.Short_Pass,
      player.Long_Pass,
      player.Vision,
    ];
    const physicalSkills = [
      player.Acceleration,
      player.Speed,
      player.Stamina,
      player.Strength,
      player.Balance,
    ];
    return {
      averageTechnical:
        technicalSkills.reduce((a, b) => a + b, 0) / technicalSkills.length,
      averagePhysical:
        physicalSkills.reduce((a, b) => a + b, 0) / physicalSkills.length,
      rating: player.Rating,
      Name: player.Name,
    };
  };

  // Techincal and Physical Skills
  const technicalSkillsText =
    "Technical Skills: Ball Control, Dribbling, Short Pass, Long Pass, Vision";
  const physicalSkillsText =
    "Physcial Skills : Acceleration, Speed, Stamina, Strength, Balance";

  const playerSkills = players.map(calculateAverageSkills);

  // Calculate extents for scales
  const technicalExtent = [
    Math.min(...playerSkills.map((p) => p.averageTechnical)),
    Math.max(...playerSkills.map((p) => p.averageTechnical)),
  ];
  const physicalExtent = [
    Math.min(...playerSkills.map((p) => p.averagePhysical)),
    Math.max(...playerSkills.map((p) => p.averagePhysical)),
  ];

  // Function to adjust start and end of the range to rounded values
  const adjustStart = (minValue, interval) =>
    Math.floor(minValue / interval) * interval;
  const adjustEnd = (maxValue, interval) =>
    Math.ceil(maxValue / interval) * interval;

  //Get start and end point for each axis
  const technicalStart = adjustStart(technicalExtent[0], 10);
  const technicalEnd = adjustEnd(technicalExtent[1], 5);
  const physicalStart = adjustStart(physicalExtent[0], 5);
  const physicalEnd = adjustEnd(physicalExtent[1], 5);

  // Scale functions for the data points
  const scaleX = (d) =>
    ((d - technicalStart) / (technicalEnd - technicalStart)) *
      (width - 2 * padding) +
    padding;
  const scaleY = (d) =>
    height -
    padding -
    ((d - physicalStart) / (physicalEnd - physicalStart)) *
      (height - 2 * padding);
  const scaleSize = (d) =>
    ((d - Math.min(...playerSkills.map((p) => p.rating))) /
      (Math.max(...playerSkills.map((p) => p.rating)) -
        Math.min(...playerSkills.map((p) => p.rating)))) *
      20 +
    5;

  // Generate ticks for the axes
  const generateTicks = (start, end, numTicks) => {
    const step = (end - start) / numTicks;
    return Array.from({ length: numTicks + 1 }, (_, i) => start + i * step);
  };

  const xTicks = generateTicks(technicalStart, technicalEnd, 5);
  const yTicks = generateTicks(physicalStart, physicalEnd, 5);

  // Positioning for the skills text
  const skillsTextX = padding;
  const skillsTextY1 = height - 450; // Position for the first line
  const skillsTextY2 = height - 430; // Position for the second line

  return (
    <svg width={width + borderPadding * 2} height={height + borderPadding * 2}>
      {/* Technical Skills Text */}
      <text
        x={50 + skillsTextX}
        y={skillsTextY1}
        fontSize="10" // Smaller font size
        fill="black"
      >
        {technicalSkillsText}
      </text>

      {/* Physical Skills Text */}
      <text
        x={skillsTextX + 340}
        y={skillsTextY2}
        fontSize="10"
        fill="black"
        textAnchor="end" // Align text to the right
      >
        {physicalSkillsText}
      </text>
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
        Technical vs Physical Skill
      </text>
      {/* Shift the entire plot content by borderPadding */}
      <g transform={`translate(${borderPadding}, ${borderPadding})`}>
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
          Average Technical Skill
        </text>
        <text
          x={20}
          y={height / 2}
          textAnchor="middle"
          transform={`rotate(-90 20,${height / 2})`}
        >
          Average Physical Skill
        </text>

        {/* Render the bubbles */}
        {playerSkills.map((player, index) => {
          const isSelected =
            selectedPlayer && player.Name === selectedPlayer.Name;
          return (
            <>
              <circle
                cx={scaleX(player.averageTechnical)}
                cy={scaleY(player.averagePhysical)}
                r={
                  selectedPlayer && player.Name === selectedPlayer.Name
                    ? scaleSize(player.rating) + 3
                    : scaleSize(player.rating)
                } // Increase size if selected
                fill={
                  selectedPlayer && player.Name === selectedPlayer.Name
                    ? "#34ebbd"
                    : "#f589d4"
                } // Change color if selected
                opacity={
                  selectedPlayer && player.Name !== selectedPlayer.Name
                    ? 0.4
                    : 1
                } // Change opacity if selected
                key={index}
              />
              {isSelected && (
                <text
                  x={scaleX(player.averageTechnical)} // Position text next to the circle
                  y={scaleY(player.averagePhysical) - 18}
                  dy="-10"
                  textAnchor="middle"
                >
                  {player.Name}
                </text>
              )}
            </>
          );
        })}
      </g>
    </svg>
  );
}

export default BubblePlot;
