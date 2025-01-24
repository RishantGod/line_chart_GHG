async function lineChart(){

    //1. Fetch data
    const yearFormat = d3.timeParse('%Y') 


    const tempData = await d3.csv('temp.csv')
    const coData = await d3.csv('co2.csv')

    const xAccessor = d => yearFormat(d.Year)
    const yAccessor1 = d => +d.temp

    const yAccessor2 = d => +d.co2

    //2. Create chart dimensions

    //1. DEFINING DIMENSIONS (FOR OUTER & INNER BOX)

let dimensions = {
    width: 700,
    height: 400,
    margin: {
        top: 15,
        right: 15,
        bottom: 40,
        left: 60,
    },
}

dimensions.innerWidth = dimensions.width
- dimensions.margin.left
- dimensions.margin.right

dimensions.innerHeight = dimensions.height
- dimensions.margin.top
- dimensions.margin.bottom

// 2. OUTER BOX
const outer = d3.select("#chart")
        .append("svg")
                .attr("width", dimensions.width)
                .attr("height", dimensions.height)
                
// 3. INNER BOX

const inner = outer.append("g")
    .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

//3. Create scales

const xScale = d3.scaleTime()
    .domain(d3.extent(tempData, d => xAccessor(d)))
    .range([0, dimensions.innerWidth])

const tempScale = d3.scaleLinear()
    .domain(d3.extent(tempData, d => yAccessor1(d)))
    .range([dimensions.innerHeight, 0])

const coScale = d3.scaleLinear()
    .domain(d3.extent(coData, d => yAccessor2(d)))
    .range([dimensions.innerHeight, 0])


//4. Draw data

const tempLineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => tempScale(yAccessor1(d)))

const coLineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => coScale(yAccessor2(d)))


const coLine = inner.append('path')
    .attr('d', coLineGenerator(coData))
    .attr('fill', 'none')
    .attr('stroke', 'blue')
    .attr('stroke-width', 2)


const tempLine = inner.append('path')
    .attr('d', tempLineGenerator(tempData))
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)

//5. Draw peripherals

const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat('%Y'))

const xAxisGroup = inner.append('g')
    .call(xAxis)
    .style('transform', `translateY(${dimensions.innerHeight}px)`)

const xAxisLabel = xAxisGroup.append('text')
    .attr('x', dimensions.innerWidth / 2)
    .attr('y', dimensions.margin.bottom - 10)
    .html('Years')


const yAxis = d3.axisLeft(tempScale)

const yAxisGroup = inner.append('g')
    .call(yAxis)






} 

lineChart();