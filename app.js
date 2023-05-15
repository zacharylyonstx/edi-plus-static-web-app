
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = e.target.result;
        const parsedData = parseCSV(data);
        window.parsedData = parsedData; // Store the parsed data in a global variable
        plotData(parsedData);
    };
    reader.readAsText(file);
}


function toggleLightMode(event) {
    if (event.target.checked) {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }

    // If data has been uploaded, update the graph style
    if (typeof window.parsedData !== 'undefined') {
        plotData(window.parsedData);
    }
}

function parseCSV(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');

    const parsedData = {
        time: [],
        EMF: [],
        temperature: [],
        humidity: [],
        pressure: [],
        geophone: [],
        mark: [],
    };

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length !== headers.length) continue;

        parsedData.time.push(values[0]);
        parsedData.EMF.push(parseFloat(values[1]));
        parsedData.temperature.push(parseFloat(values[2]));
        parsedData.humidity.push(parseFloat(values[3]));
        parsedData.pressure.push(parseFloat(values[4]));
        parsedData.geophone.push(parseFloat(values[5]));
        parsedData.mark.push(parseInt(values[6]));
    }

    return parsedData;
}
function plotData(data) {
    const traceEMF = {
        x: data.time,
        y: data.EMF,
        mode: 'lines',
        name: 'EMF',
    };

    const traceTemperature = {
        x: data.time,
        y: data.temperature,
        mode: 'lines',
        name: 'Temperature',
    };

    const traceHumidity = {
        x: data.time,
        y: data.humidity,
        mode: 'lines',
        name: 'Humidity',
    };

    const tracePressure = {
        x: data.time,
        y: data.pressure,
        mode: 'lines',
        name: 'Pressure',
    };

    const traceGeophone = {
        x: data.time,
        y: data.geophone,
        mode: 'lines',
        name: 'Geophone',
    };

    const traceMark = {
        x: data.time.filter((_, i) => data.mark[i] === 1),
        y: Array(data.mark.filter(val => val === 1).length).fill(0),
        mode: 'markers',
        name: 'Mark',
        text: 'Mark',
        marker: { size: 8 },
    };

    const chartData = [traceEMF, traceTemperature, traceHumidity, tracePressure, traceGeophone, traceMark];

    const isLightMode = document.body.classList.contains('light-mode');

    const layout = {
        title: 'Graph',
        xaxis: {
            title: 'Time',
            color: isLightMode ? '#333' : '#f4f4f4',
        },
        yaxis: {
            color: isLightMode ? '#333' : '#f4f4f4',
        },
        plot_bgcolor: isLightMode ? '#f4f4f4' : '#333',
        paper_bgcolor: isLightMode ? '#f4f4f4' : '#333',
        font: {
            color: isLightMode ? '#333' : '#f4f4f4',
        },
    };

    Plotly.newPlot('chart', chartData, layout);
}