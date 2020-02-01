// Define SVG area
    // -------------------------------------------------------------------------------------------
    var svgWidth = 960;
    var svgHeight = 500;

    // define Margin of the chart
    var margin = {
        top: 20,
        right: 40,
        bottom: 100,
        left: 100
    };

    // calculate the width and height of the chart area
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart,

    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append an SVG group, and shift the latter by left and top margins.
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // End of Define SVG area....................................................................................................

    
// xScale() -------------------------------------------------------------------------------------------
// function for xLinearScale
// function used for updating x-scale var upon click on axis label
function xScale(dataSet, chosenX) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(dataSet, d => d[chosenX]) * 0.8,
        d3.max(dataSet, d => d[chosenX]) * 1.1
        ])
        .range([0, width]);

    return xLinearScale;
}
// End xScale() ....................................................................................................

// xScale() -------------------------------------------------------------------------------------------
// function for yLinearScale
// function used for updating y-scale var upon click on axis label
function yScale(dataSet, chosenY) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(dataSet, d => d[chosenY]) * 0.8,
        d3.max(dataSet, d => d[chosenY]) * 1.1
        ])
        .range([height, 0]);

    return yLinearScale;
}


// xRenderAxes() -------------------------------------------------------------------------------------------
// function used for updating xAxis var upon click on axis label
function xRenderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}
// End xRenderAxes() ....................................................................................................



// yRenderAxes() -------------------------------------------------------------------------------------------
// function used for updating yAxis var upon click on axis label
function yRenderAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}
// End yRenderAxes() ....................................................................................................



// renderCircles() -------------------------------------------------------------------------------------------
// function used for updating circles group with a transition to
// new circles
function renderCircles(newXScale, chosenXAxis, newYScale, chosenYAxis, circlesGroup, stateGroup) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    stateGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));

    return [circlesGroup, stateGroup];
}
// End renderCircles() ....................................................................................................



// updateToolTip() -------------------------------------------------------------------------------------------
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, xToolTipLabel, yToolTipLabel) {
    console.log("update tool tip");
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([5, 0])
        .html(function (d) {
            return (`${d.state}<br>${xToolTipLabel.tipLabel}: ${xToolTipLabel.tipPrefix}${d[chosenXAxis]}${xToolTipLabel.tipSuffix}<br>${chosenYAxis}: ${d[chosenYAxis]}%`);
        });


    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}
// End updateToolTip() ....................................................................................................



// d3.csv -------------------------------------------------------------------------------------------
// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function (riskData, err) {
    if (err) throw err;

    

    // Parse Data/Cast as numbers
    // parse the data as number using unary (+) operator
    riskData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;
    });

    // Initial Params
    var chosenXAxis = "poverty";
    var chosenYAxis = "healthcareLow";

    //create a label list for creating the x axis label
    var xLabelDictList = [
        { "value": "poverty", "text": "In Poverty %", "tipLabel": "Poverty", "tipPrefix": "", "tipSuffix": "%" },
        { "value": "age", "text": "Age (Median)", "tipLabel": "Age", "tipPrefix": "", "tipSuffix": "" },
        { "value": "income", "text": "Household Income (Median)", "tipLabel": "Age", "tipPrefix": "$", "tipSuffix": "" }
    ];

    //create a label list for creating the y axis label
    var yLabelDictList = [
        { "value": "healthcareLow", "text": "Lacks Healthcare %", "tipLabel": "HealthCare", "tipPrefix": "", "tipSuffix": "%" },
        { "value": "smokes", "text": "Smokes %", "tipLabel": "Smokes", "tipPrefix": "", "tipSuffix": "%" },
        { "value": "obesity", "text": "Obese %", "tipLabel": "Obesity", "tipPrefix": "", "tipSuffix": "%" }
    ];

    // get Linear Scale
    // ==============================
    var xLinearScale = xScale(riskData, chosenXAxis);
    var yLinearScale = yScale(riskData, chosenYAxis);

    // Append Axes to the chart
    // ==============================
    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("xaxis", true)
        .attr("transform", `translate(0, ${height})`);

    xAxis = xRenderAxes(xLinearScale, xAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("yaxis", true);

    yAxis = yRenderAxes(yLinearScale, yAxis);

    // Create state text
    // ==============================
    var stateGroup = chartGroup.selectAll(".stateText")
        .data(riskData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("dy", ".4em")
        .classed("stateText", true)
        .attr("font-size", "12")
        .text(d => d.abbr);

    // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(riskData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", "12")
        .classed("stateCircle", true);

    // Step 6: Initialize tool tip
    // ==============================
    var xToolTipLabel = xLabelDictList.filter(d => d.value == chosenXAxis)
    var yToolTipLabel = yLabelDictList.filter(d => d.value == chosenYAxis)
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, xToolTipLabel[0], yToolTipLabel[0]);
    //Additional xLabels for xAxis
    var yShift = 0
    xLabelDictList.forEach(function (xLabelData) {

        xLabelData.classGeneral = "axText"; //class for axis label

        //class for axis label , according to choosen axis
        if (xLabelData.value == chosenXAxis) {
            xLabelData.ClassActive = "xActive";
        }
        else {
            xLabelData.ClassActive = "xInActive";
        }

        //position of the each label
        xLabelData.yShift = yShift
        yShift = yShift + 20
    });

    // Create group for  2 x- axis labels, and setting the position where the label starts
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 30})`);

    xLabelsGroup.selectAll("text")
        .data(xLabelDictList)
        .enter()
        .append("text")
        .attr("x", 0)
        .attr("y", d => d.yShift)
        .attr("value", d => d.value) // value to grab for event listener
        // .classed(d => d.classGeneral, true)
        // .classed(d => d.ClassActive, true)
        .attr("class", d => d.classGeneral + " " + d.ClassActive)
        .text(d => d.text);


    //Additional yLabels for YAxis
    yShift = 0 - margin.left + 60
    yLabelDictList.forEach(function (yLabelData) {
        yLabelData.classGeneral = "ayText"; //class for axis label

        //class for axis label , according to choosen axis
        if (yLabelData.value == chosenYAxis) {
            yLabelData.ClassActive = "yActive";
        }
        else {
            yLabelData.ClassActive = "yInActive";
        }

        //position of the each label
        yLabelData.yShift = yShift
        yShift = yShift - 20
    });

    // Create group for  y x- axis labels, and setting the position where the label starts
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")

    yLabelsGroup.selectAll("text")
        .data(yLabelDictList)
        .enter()
        .append("text")
        .attr("y", d => d.yShift)
        .attr("x", 0 - (height / 2))
        .attr("value", d => d.value) // value to grab for event listener
        .attr("dy", "1em")
        .attr("class", d => d.classGeneral + " " + d.ClassActive)
        .text(d => d.text);

    // x axis labels event listener
    var xEvent = xLabelsGroup.selectAll(".axText");

    xEvent.on("click", function () {
        // get value of selection
        var selectedLabel = d3.select(this)
        var selectedValue = selectedLabel.attr("value");

        if (selectedValue !== chosenXAxis) {
            // replaces chosenXAxis with value
            chosenXAxis = selectedValue;
            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(riskData, chosenXAxis);

            // updates x axis with transition
            xAxis = xRenderAxes(xLinearScale, xAxis);

            // updates circles with new x values
            [circlesGroup, stateGroup] = renderCircles(xLinearScale, chosenXAxis, yLinearScale, chosenYAxis, circlesGroup, stateGroup);

            // updates tooltips with new info
            xToolTipLabel = xLabelDictList.filter(d => d.value == chosenXAxis)
            yToolTipLabel = yLabelDictList.filter(d => d.value == chosenYAxis)
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, xToolTipLabel[0], yToolTipLabel[0]);


            xEvent.each(function () {
                eachLabel = d3.select(this)
                if (eachLabel.attr("value") == chosenXAxis) {
                    eachLabel
                        .classed("xActive", true)
                        .classed("xInActive", false)
                }
                else {
                    eachLabel
                        .classed("xActive", false)
                        .classed("xInActive", true)
                }
            });
        }
    });


    // y axis labels event listener
    var yEvent = yLabelsGroup.selectAll(".ayText");

    yEvent.on("click", function () {
        // get value of selection
        var selectedLabel = d3.select(this)
        var selectedValue = selectedLabel.attr("value");

        if (selectedValue !== chosenYAxis) {
            // replaces chosenXAxis with value
            chosenYAxis = selectedValue;
            // functions here found above csv import
            // updates y scale for new data
            yLinearScale = yScale(riskData, chosenYAxis);

            // updates x axis with transition
            yAxis = yRenderAxes(yLinearScale, yAxis);

            // updates circles with new x values
            [circlesGroup, stateGroup] = renderCircles(xLinearScale, chosenXAxis, yLinearScale, chosenYAxis, circlesGroup, stateGroup);

            // updates tooltips with new info
            xToolTipLabel = xLabelDictList.filter(d => d.value == chosenXAxis)
            yToolTipLabel = yLabelDictList.filter(d => d.value == chosenYAxis)
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, xToolTipLabel[0], yToolTipLabel[0]);

            yEvent.each(function () {
                eachLabel = d3.select(this)
                if (eachLabel.attr("value") == chosenYAxis) {
                    eachLabel
                        .classed("yActive", true)
                        .classed("yInActive", false)
                }
                else {
                    eachLabel
                        .classed("yActive", false)
                        .classed("yInActive", true)
                }
            });
        }
    });


}).catch(function (error) {
    console.log(error);
});
// End d3.csv() ....................................................................................................


