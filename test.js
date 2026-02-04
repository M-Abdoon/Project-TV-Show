// Visualization Script
// Visualization Script
var template = `
<canvas id="ratingsChart" height="400"></canvas>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script>
<script>
    var ctx = document.getElementById("ratingsChart");
    var ratingsChart = new Chart(ctx, {
        type: "horizontalBar",
        data: {
            labels: [],
            datasets: [{
                label: "Average Rating",
                backgroundColor: "rgba(54, 162, 235, 0.7)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                data: []
            }]
        },
        options: {
            legend: { display: false },
            title: {
                display: true,
                text: "Top 20 TV Shows by Average Rating"
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: "Average Rating"
                    },
                    ticks: {
                        beginAtZero: true,
                        max: 10
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: "Show Name"
                    }
                }]
            }
        }
    });

    pm.getData(function (err, value) {
        ratingsChart.data.labels = value.shows.map(function(show) { return show.name; });
        ratingsChart.data.datasets[0].data = value.shows.map(function(show) { return show.rating; });
        ratingsChart.update();
    });
</script>`;

function constructVisualizerPayload() {
    var response = pm.response.json();
    
    // Extract shows with their ratings, handling null/missing values
    var showsWithRatings = response.map(function(show) {
        return {
            name: show.name || "Unknown",
            rating: (show.rating && show.rating.average !== null) ? show.rating.average : 0
        };
    });
    
    // Sort by rating descending and take top 20
    var top20Shows = showsWithRatings
        .sort(function(a, b) { return b.rating - a.rating; })
        .slice(0, 20);
    
    return { shows: top20Shows };
}

pm.visualizer.set(template, constructVisualizerPayload());