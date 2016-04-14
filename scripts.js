// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = (270 - margin.top - margin.bottom)*2;

// Parse the date / time
var parseDate = d3.time.format("%b %Y").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(11);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(8);

// Define the line
var costline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.cost); });

// Adds the svg canvas
var svg = d3.select(".container")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("uni_tuition.csv", function(error, data) {
    data.forEach(function(d) {
  		d.date = parseDate(d.date);
  		d.cost = +d.cost;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.cost; })]);

    // Nest the entries by university
    var dataNest = d3.nest()
        .key(function(d) {return d.uni;})
        .entries(data);

    // Loop through each university
    dataNest.forEach(function(d) {
        svg.append("path")
            .attr("class", "line")
            .attr("stroke", "steelblue")
            .attr("stroke-width", "1.5px")
            .attr("fill", "none")
            .attr("d", costline(d.values))
            .on('mouseover', function() {
              d3.select(d3.event.target)
                .attr("stroke", "black")
                .attr("stroke-width", "3px");

              d3.select('h1')
                .html(d.key);
            })
            .on("mouseout", function(d) {
              d3.select(d3.event.target)
                .attr('stroke-width', '1.5px')
                .attr("stroke", "steelblue");
            });
    });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);


        var zoom = d3.behavior.zoom();
        //selection.call(zoom);

});
