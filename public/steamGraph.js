// steamGraph.js
console.log("steamGraph.js loaded");

d3.json('data/readings.json').then(function(data) {
    const keys = ["rco2", "tvoc_index", "nox_index"];
    data = data.readings.map(d => ({
        time: new Date(d.time),
        rco2: d.message.rco2,
        tvoc_index: d.message.tvoc_index,
        nox_index: d.message.nox_index
    }));

    console.log("Data loaded for steam graph:", data);

    const width = 928;
    const height = 500;
    const margin = {top: 20, right: 30, bottom: 50, left: 50};

    const n = 3; // number of layers
    const m = data.length; // number of samples per layer
    const k = 10; // number of bumps per layer

    const x = d3.scaleLinear([0, m - 1], [0, width]);
    const y = d3.scaleLinear([0, 1], [height, 0]);
    const z = d3.interpolateCool;

    const area = d3.area()
        .x((d, i) => x(i))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]));

    const stack = d3.stack()
        .keys(d3.range(n))
        .offset(d3.stackOffsetWiggle)
        .order(d3.stackOrderNone);

    function randomize() {
        const layers = stack(d3.transpose(Array.from({length: n}, () => bumps(m, k))));
        y.domain([
            d3.min(layers, l => d3.min(l, d => d[0])),
            d3.max(layers, l => d3.max(l, d => d[1]))
        ]);
        return layers;
    }

    function bumps(n, m) {
        const values = Array.from({length: n}, () => 0.1 + Math.random() / 2);
        for (let i = 0; i < m; ++i) bump(values, n);
        return values;
    }

    function bump(values, n) {
        const x = 1 / (0.1 + Math.random());
        const y = 2 * Math.random() - 0.5;
        const z = 10 / (0.1 + Math.random());
        for (let i = 0; i < n; ++i) {
            const w = (i / n - y) * z;
            values[i] += x * Math.exp(-w * w);
        }
    }

    const svg = d3.select("#steamGraph").append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto;");

    const path = svg.selectAll("path")
        .data(randomize)
        .join("path")
        .attr("d", area)
        .attr("fill", () => z(Math.random()));

    async function transition() {
        while (true) {
            await path.data(randomize)
                .transition()
                .delay(1000)
                .duration(1500)
                .attr("d", area)
                .end();
        }
    }

    transition();
}).catch(function(error) {
    console.error("Error loading data for steam graph:", error);
});
