// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 70},
    width = 900 - margin.left - margin.right,
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

//Define the zoom
var zoom = d3.behavior.zoom();

//color category
var color = d3.scale.category20b();

// Adds the svg canvas
var svg = d3.select(".graph-container")
    // creates zoom behavior
    // .call(d3.behavior.zoom().on("zoom", function () {
    //     svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
    //   }))
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("js/uni_tuition.csv", function(error, data) {

    data.forEach(function(d) {
  		d.date = parseDate(d.date);
  		d.cost = +d.cost;
    });

    var extraInformation = function(d) {
      // builds content for qf
      var content = "";
      console.log(d);
      content += '<h4>' + (d.key).toUpperCase() + '</h4>';
      content += '<p><span class="bold">Cost in the 2004-05 school year: </span>$' + d.values[0].cost.toLocaleString() + '</p>';
      content += '<p><span class="bold">Cost in the 20015-16 school year: </span>$' + d.values[11].cost.toLocaleString() + '</p>';
      content += '<p><span class="bold">Percent of change: </span>' + (((d.values[11].cost - d.values[0].cost) / (d.values[0].cost))*100).toLocaleString() + '%</p>';
      return content;
    }

    //returns css with line color
    var colorLine = function(d) {
      var lineColor = d.key;
      return lineColor;
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
        // .attr("class", "line all")
        .attr("class", function() {
          switch (d.key) {
            case "ncsu": return "line ncsu"; break;
            case "unc": return "line unc"; break;
            case "ecu": return "line ecu"; break;
            case "ncat": return "line ncat"; break;
            case "uncc": return "line uncc"; break;
            case "uncg": return "line uncg"; break;
            case "uncp": return "line uncp"; break;
            case "unca": return "line unca"; break;
            case "ecsu": return "line ecsu"; break;
            case "wssu": return "line wssu"; break;
            case "asu": return "line asu"; break;
            case "fsu": return "line fsu"; break;
            case "nccu": return "line nccu"; break;
            case "uncw": return "line uncw"; break;
            case "wcu": return "line wcu"; break;
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
          //shows extra information
          d3.select('#extra-info')
            .html( extraInformation(d) );
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

});

//resets the initial extra info div on link click
function natAvg() {
  var nat = "";
  var year04 = 6253;
  var year16 = 9410;
  nat += '<h4>National Quickfacts</h4>';
  nat += '<p><span class="bold">Cost in the 2004-05 school year: </span>$' + year04.toLocaleString() + '</p>';
  nat += '<p><span class="bold">Cost in the 2015-16 school year: </span>$' + year16.toLocaleString() + '</p>';
  nat += '<p><span class="bold">Percent of change: </span>' + (((year16 - year04) / (year04))*100).toLocaleString() + '%</p>';
  document.getElementById("extra-info").innerHTML = nat;
}
