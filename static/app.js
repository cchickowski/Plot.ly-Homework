// Function for plotting
function plotting(sampleID) {

    // Get data for app from samples.json
    d3.json("samples.json").then(function (data) {
        
        // Filter the data
        let sampleData = data.samples.filter(i => i.id == sampleID)[0];
  
        // bar plot parameters
        let trace1 = {
            x: sampleData.sample_values.slice(0, 10).reverse(),
            y: sampleData.otu_ids.slice(0, 10).map(otu_id => `OTU #${otu_id}`).reverse(),
            text: sampleData.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };

        let dataBar = [trace1];

        let layoutBar = { title: "<b>Top 10 OTUs for the Selected Subject ID</b>" ,
         width: 480, height: 640
        };

        // Bar plot creation
        Plotly.newPlot("bar", dataBar, layoutBar);

        // bubble plot parameters
        let trace2 = {
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            mode: "markers",
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids,
                colorscale: "Earth"
            },
            text: sampleData.otu_labels,
            
        };

        let dataBubble = [trace2];

        let layoutBubble = { title: "<b>Sample Bubble Chart</b>",
            xaxis: {title: "<b>OTU ID</b>"},
            height: 600,
            width: 1200
    };

        // Bubble plot creation
        Plotly.newPlot("bubble", dataBubble, layoutBubble);

    });
};


// Demographic info
function demographicInfo(sampleID) {
    let boxData = d3.select("#sample-metadata");
    d3.json("samples.json").then(function (data) {
        let boxData = data.metadata.filter(x => x.id == sampleID)[0];
        d3.select("#sample-metadata").html("");
        Object.entries(boxData).forEach(element => {
            d3.select("#sample-metadata").append("h6").text(`${element[0]}: ${element[1]}`)
        });

    });
}


// Function to update the plots specific selected ID
function optionChanged(sampleID) {
    plotting(sampleID);
    demographicInfo(sampleID);
    gaugePlot(sampleID)
};

// Dropdown info
function dropDown() {
    let dropdown = d3.select("#selDataset");
    d3.json("samples.json").then(function (data) {
        let IDs = data.names;
        IDs.forEach(ID => {
            dropdown.append("option").text(ID).property("value", ID)
        });
    });
};

// Populate the plots
function createPlots() {

    d3.json("samples.json").then(function (data) {
        let IDs = data.names[0];
        plotting(IDs);
        demographicInfo(IDs);
        dropDown();
    });
};

createPlots();