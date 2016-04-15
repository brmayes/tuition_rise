// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 700 - margin.left - margin.right,
    height = (270 - margin.top - margin.bottom)*2.3;

// Parse the date / time
var parseDate = d3.time.format("%b %Y").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(20);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(8).tickFormat(function(d) { return "$" + d} );

// Define the line
var costline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.cost); });

// Adds the svg canvas
var svg = d3.select(".graph-container")
    // .call(d3.behavior.zoom().on("zoom", function () {
    //     svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
    //   }))
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

var colors =
[["nccu", "#CC0000"],
["unc", "#7BAFD4"],
["ecu", "#592A8A"],
["ncat", "#004684"],
["uncc", "#00703C"],
["uncg", "#003366"],
["app", "#ffcc00"],
["fsu", "#0067B1"],
["nccu", "#8b2331"],
["uncp", "#BFA656"],
["uncw", "#006666"],
["wcu", "#592C88"],
["wssu", "#ED174F"],
["unca", "#003C77"],
["ecsu", "#0039A6"]];

console.log(colors);
// Get the data
d3.csv("js/uni_tuition.csv", function(error, data) {

    data.forEach(function(d) {
  		d.date = parseDate(d.date);
  		d.cost = +d.cost;
    });

    var extraInformation = function(d) {
      var content = '<h1>' + (d.key).toUpperCase() + '</h1><p>This is information about this uni.</p>';
      return content;
    }

    var activeLine = function() {
      if (natLine == true) {
        show = true;
      } else if (natLine == false) {
        show = false;
      }
    }

    var opacity = function() {
      if (show == true) {
        newOpacity = 1;
      } else if (show == false) {
        newOpacity = 0;
      }
      return newOpacity;
    }

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([2000, d3.max(data, function(d) { return d.cost; })]);

    // Nest the entries by university
    var dataNest = d3.nest()
        .key(function(d) {return d.uni;})
        .entries(data);

    // Loop through each university
    dataNest.forEach(function(d) {
      svg.append("path")
        .attr("class", function() {
          if (d.key == "nat") {
            return "line nat";
          } else {
            return "line all";
          }
        })
        .attr("id", function() {
          if (d.key == "nat") {
            return "#natLine";
          }
        })
        .attr("d", costline(d.values))
        .on('mouseover', function() {
          d3.select(d3.event.target)
        })
        .on("mouseout", function() {
          d3.select(d3.event.target)
            .attr('stroke-width', '1.5px')
        })
        .on("click", function() {
          d3.select('.extra-info')
            .html( extraInformation(d) );
        });

        // Add the red line title
        svg.append("text")
          .attr("x", 0)
          .attr("y", margin.top + 30)
          .attr("class", "legend")
          .style("fill", "red")
          .on("mousein", function(){
            d3.select(d3.event.target)
            .text( "hi" );
          })

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

});
