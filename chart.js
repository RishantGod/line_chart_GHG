async function lineChart() {
    // 1. Fetch data
    const yearFormat = d3.timeParse('%Y');
    const tempData = await d3.csv('temp.csv');
    const coData = await d3.csv('co2.csv');
    const xAccessor = d => yearFormat(d.Year);
    const yAccessor1 = d => +d.temp;
    const yAccessor2 = d => +d.co2;
  
    // 2. Create chart dimensions
    let dimensions = {
      width: 400,
      height: 350,
      margin: {
        top: 15,
        right: 50,
        bottom: 40,
        left: 60,
      }
    };
    dimensions.innerWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
    dimensions.innerHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
  
    // Create scales (shared by both charts)
    const xScale = d3.scaleTime()
      .domain(d3.extent(tempData, d => xAccessor(d)))
      .range([0, dimensions.innerWidth]);
    const tempScale = d3.scaleLinear()
      .domain(d3.extent(tempData, d => yAccessor1(d)))
      .range([dimensions.innerHeight, 0])
      .nice();
    const coScale = d3.scaleLinear()
      .domain(d3.extent(coData, d => yAccessor2(d)))
      .range([dimensions.innerHeight, 0])
      .nice();
  
    // Create line generators
    const tempLineGenerator = d3.line()
      .x(d => xScale(xAccessor(d)))
      .y(d => tempScale(yAccessor1(d)));
    const coLineGenerator = d3.line()
      .x(d => xScale(xAccessor(d)))
      .y(d => coScale(yAccessor2(d)));
  
    // Create temperature chart in its own container (#temp-container)
    const tempChart = d3.select("#temp-container")
      .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);
    const tempInner = tempChart.append("g")
      .attr("transform", `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);
    tempInner.append("path")
      .attr("d", tempLineGenerator(tempData))
      .attr("fill", "none")
      .attr("stroke", "#19394E")
      .attr("stroke-width", "1.5px");
    const tempXAxis = d3.axisBottom(xScale)
      .ticks(7)
      .tickSize(-dimensions.innerHeight)
      .tickPadding(10)   
      .tickFormat(d3.timeFormat("%Y"));
    const tempXAxisGroup = tempInner.append("g")
      .call(tempXAxis)
      .attr("transform", `translate(0, ${dimensions.innerHeight})`);
    tempXAxisGroup.append("text")
      .attr("x", dimensions.innerWidth / 2)
      .attr("y", dimensions.margin.bottom - 5)
      .attr("fill", "black")
      .text("Years");
    const tempYAxis = d3.axisLeft(tempScale)
      .tickPadding(10)
      .tickSize(-dimensions.innerWidth);
    const tempYAxisGroup = tempInner.append("g")
      .call(tempYAxis);
      
    tempYAxisGroup.append("text")
      .attr("x", -dimensions.innerHeight / 2)
      .attr("y", -dimensions.margin.left + 15)
      .attr("fill", "black")
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Temperature Anomaly (°C)");
  
    // Temperature tooltip interaction
    tempInner.append("rect")
      .attr("class", "listening-rect")
      .attr("width", dimensions.innerWidth)
      .attr("height", dimensions.innerHeight)
      .attr("fill", "transparent")
      .on("mousemove", onMouseMoveTemp)
      .on("mouseleave", onMouseLeaveTemp);
    const tooltip = d3.select("#tooltipTemp");
    const tooltipline = tempInner.append("line")
      .attr("class", "tooltip-line")
      .attr("y1", 0)
      .attr("y2", dimensions.innerHeight)
      .attr("stroke", "#19394E")
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", 2)
      .style("opacity", 0);
    const tooltipCircle = tempInner.append("circle")
      .attr("class", "tooltip-circle")
      .attr("r", 3)
      .attr("stroke", "#19394E")
      .attr("fill", "white")
      .attr("stroke-width", 1)
      .style("opacity", 0);
  
    // Create CO2 chart in its own container (#co2-container)
    const coChart = d3.select("#co2-container")
      .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);
    
      const coInner = coChart.append("g")
      .attr("transform", `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);
    
      coInner.append("path")
      .attr("d", coLineGenerator(coData))
      .attr("fill", "none")
      .attr("stroke", "#A2C5DC")
      .attr("stroke-width", 2);

    const coXAxis = d3.axisBottom(xScale)
      .ticks(6)
      .tickFormat(d3.timeFormat("%Y"))
      .tickPadding(10)
      .tickSize(-dimensions.innerHeight)

    const coXAxisGroup = coInner.append("g")
      .call(coXAxis)
      .attr("transform", `translate(0, ${dimensions.innerHeight})`);

    coXAxisGroup.append("text")
      .attr("x", dimensions.innerWidth / 2)
      .attr("y", dimensions.margin.bottom - 5)
      .attr("fill", "black")
      .text("Years");

    const coYAxis = d3.axisLeft(coScale)
      .ticks(6)
      .tickPadding(10)
      .tickSize(-dimensions.innerWidth);

    const coYAxisGroup = coInner.append("g")
      .call(coYAxis);
    coYAxisGroup.append("text")
      .attr("x", -dimensions.innerHeight / 2)
      .attr("y", -dimensions.margin.left + 15)
      .attr("fill", "black")
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Carbon Dioxide (ppm)");
  
    // CO2 tooltip interaction
    coInner.append("rect")
      .attr("class", "listening-rect")
      .attr("width", dimensions.innerWidth)
      .attr("height", dimensions.innerHeight)
      .attr("fill", "transparent")
      .on("mousemove", onMouseMoveCo)
      .on("mouseleave", onMouseLeaveCo);
    const tooltipco2 = d3.select("#tooltipCO2");
    const tooltiplineCo = coInner.append("line")
      .attr("class", "tooltip-line")
      .attr("y1", 0)
      .attr("y2", dimensions.innerHeight)
      .attr("stroke", "#A2C5DC")
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", 2)
      .style("opacity", 0);
    const tooltipCircleCo = coInner.append("circle")
      .attr("class", "tooltip-circle")
      .attr("r", 3)
      .attr("stroke", "#A2C5DC")
      .attr("fill", "white")
      .attr("stroke-width", 1)
      .style("opacity", 0);
  
    // Temperature tooltip functions
    function onMouseMoveTemp(e) {
      const mousePosition = d3.pointer(e);
      const hoveredDate = xScale.invert(mousePosition[0]);
      const getDistance = d => Math.abs(xAccessor(d) - hoveredDate);
      const closestIndex = d3.leastIndex(tempData, (a, b) => getDistance(a) - getDistance(b));
      const closestData = tempData[closestIndex];
      const xVal = xAccessor(closestData);
      const yVal = yAccessor1(closestData);
      const formatDate = d3.timeFormat("%Y");
  
      tooltip.select("#temp-date")
        .text(formatDate(xVal));
      const formatTemperature = d => `${d3.format(".1f")(d)}°C`;
      tooltip.select("#temperature")
        .html(formatTemperature(yVal));
      const xPos = xScale(xVal);
      const yPos = tempScale(yVal);
      tooltip.style("transform", `translate(calc(-15% + ${xPos}px), calc(-150% + ${yPos}px))`)
        .style("opacity", 1);
      tooltipline.attr("x1", xPos)
        .attr("x2", xPos)
        .style("opacity", 1);
      tooltipCircle.attr("cx", xPos)
        .attr("cy", yPos)
        .style("opacity", 1);
    }
  
    function onMouseLeaveTemp() {
      tooltip.style("opacity", 0);
      tooltipline.style("opacity", 0);
      tooltipCircle.style("opacity", 0);
    }
  
    // CO2 tooltip functions
    function onMouseMoveCo(e) {
      const mousePosition = d3.pointer(e);
      const hoveredDate = xScale.invert(mousePosition[0]);
      const getDistance = d => Math.abs(xAccessor(d) - hoveredDate);
      const closestIndex = d3.leastIndex(coData, (a, b) => getDistance(a) - getDistance(b));
      const closestData = coData[closestIndex];
      const xVal = xAccessor(closestData);
      const yVal = yAccessor2(closestData);
      const formatDate = d3.timeFormat("%Y");
  
      tooltipco2.select("#co2-date")
        .text(formatDate(xVal));
      tooltipco2.select("#co2")
        .html(`${d3.format(".0f")(yVal)} ppm`);
      const xPos = xScale(xVal);
      const yPos = coScale(yVal);
      tooltipco2.style("transform", `translate(calc(-22% + ${xPos}px), calc(-150% + ${yPos}px))`)
        .style("opacity", 1);
      tooltiplineCo.attr("x1", xPos)
        .attr("x2", xPos)
        .style("opacity", 1);
      tooltipCircleCo.attr("cx", xPos)
        .attr("cy", yPos)
        .style("opacity", 1);
    }
  
    function onMouseLeaveCo() {
      tooltipco2.style("opacity", 0);
      tooltiplineCo.style("opacity", 0);
      tooltipCircleCo.style("opacity", 0);
    }
  }
  
  lineChart();