/* =====================================================
   LANDSLIDE AI DASHBOARD
===================================================== */


/* =====================================================
   API
===================================================== */

const API = "http://127.0.0.1:8000";


/* =====================================================
   HELPERS
===================================================== */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

}


/* =====================================================
   DASHBOARD
===================================================== */

function loadDashboard() {

    fetch(API + "/dashboard")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Dashboard API error"
                );

            }

            return response.json();

        })

        .then(data => {

            setText(
                "locations",
                data.locations
            );

            setText(
                "landslides",
                data.historical_landslides
            );

            setText(
                "alerts",
                data.active_alerts
            );

        })

        .catch(error => {

            console.error(
                "Dashboard error:",
                error
            );

        });

}


/* =====================================================
   LOCATIONS
===================================================== */

function loadLocations() {

    fetch(API + "/locations")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Location API error"
                );

            }

            return response.json();

        })

        .then(data => {

            if (
                !data.locations ||
                data.locations.length === 0
            ) {

                return;

            }


            /*
                PostgreSQL row:

                [0] location_id
                [1] location_name
                [2] district
                [3] state
                [4] latitude
                [5] longitude
                [6] elevation
            */

            const location =
                data.locations[0];


            setText(
                "locationName",
                location[1]
            );

            setText(
                "district",
                "District: " + location[2]
            );

            setText(
                "state",
                location[3]
            );

            setText(
                "latitude",
                Number(location[4]).toFixed(4)
            );

            setText(
                "longitude",
                Number(location[5]).toFixed(4)
            );

            setText(
                "elevation",
                location[6] + " m"
            );

            setText(
                "mapLocation",
                location[1]
            );

            setText(
                "mapCoordinates",
                Number(location[4]).toFixed(4)
                + ", "
                + Number(location[5]).toFixed(4)
            );

        })

        .catch(error => {

            console.error(
                "Location error:",
                error
            );

        });

}


/* =====================================================
   RAINFALL
===================================================== */

function loadRainfall() {

    fetch(API + "/rainfall")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Rainfall API error"
                );

            }

            return response.json();

        })

        .then(data => {

            if (
                !data.rainfall ||
                data.rainfall.length === 0
            ) {

                return;

            }


            /*
                PostgreSQL row:

                [0] rainfall_id
                [1] location_id
                [2] recorded_at
                [3] rainfall_mm
                [4] rainfall_24h_mm
                [5] rainfall_7day_mm
            */

            const rainfall =
                data.rainfall[0];


            const rainfall24 =
                Number(
                    rainfall[4]
                );

            const rainfall7 =
                Number(
                    rainfall[5]
                );


            setText(
                "rainfall24",
                rainfall24.toFixed(2)
                + " mm"
            );

            setText(
                "rainfall7",
                rainfall7.toFixed(2)
                + " mm"
            );

            setText(
                "factorRainfall",
                rainfall24.toFixed(2)
                + " mm"
            );


            /*
                UI visualization only.
                This is not an official hazard threshold.
            */

            const rainfallBar =
                document.querySelector(
                    ".rainfall .metric-line > div"
                );

            const weeklyBar =
                document.querySelector(
                    ".weekly .metric-line > div"
                );

            if (rainfallBar) {

                const width =
                    Math.min(
                        rainfall24,
                        100
                    );

                rainfallBar.style.width =
                    width + "%";

            }

            if (weeklyBar) {

                const width =
                    Math.min(
                        rainfall7 / 2,
                        100
                    );

                weeklyBar.style.width =
                    width + "%";

            }

        })

        .catch(error => {

            console.error(
                "Rainfall error:",
                error
            );

        });

}


/* =====================================================
   SOIL MOISTURE
===================================================== */

function loadSoilMoisture() {

    fetch(API + "/soil-moisture")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Soil moisture API error"
                );

            }

            return response.json();

        })

        .then(data => {

            if (
                !data.soil_moisture ||
                data.soil_moisture.length === 0
            ) {

                return;

            }


            /*
                PostgreSQL row:

                [0] soil_moisture_id
                [1] location_id
                [2] recorded_at
                [3] moisture_percent
                [4] soil_temperature
                [5] soil_type
            */

            const soil =
                data.soil_moisture[0];


            const moisture =
                Number(
                    soil[3]
                );


            const temperature =
                Number(
                    soil[4]
                );


            setText(
                "soilMoisture",
                moisture.toFixed(2)
                + " %"
            );


            setText(
                "soilInfo",

                soil[5]
                + " • "
                + temperature.toFixed(1)
                + "°C soil temperature"
            );


            setText(
                "factorSoil",
                moisture.toFixed(2)
                + "%"
            );


            const soilBar =
                document.getElementById(
                    "soilBar"
                );

            if (soilBar) {

                soilBar.style.width =
                    Math.min(
                        moisture,
                        100
                    ) + "%";

            }

        })

        .catch(error => {

            console.error(
                "Soil moisture error:",
                error
            );

        });

}


/* =====================================================
   ALERTS
===================================================== */

function loadAlerts() {

    fetch(API + "/alerts")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Alert API error"
                );

            }

            return response.json();

        })

        .then(data => {

            if (
                !data.alerts ||
                data.alerts.length === 0
            ) {

                setText(
                    "alertLevel",
                    "NO ACTIVE ALERT"
                );

                setText(
                    "alertMessage",
                    "No active landslide warning."
                );

                setText(
                    "alertTime",
                    "--"
                );

                return;

            }


            /*
                PostgreSQL row:

                [0] alert_id
                [1] location_id
                [2] prediction_id
                [3] alert_level
                [4] alert_message
                [5] created_at
                [6] is_active
            */

            const alert =
                data.alerts[0];


            const level =
                String(
                    alert[3]
                ).toUpperCase();


            setText(
                "alertLevel",
                level + " RISK"
            );


            setText(
                "alertMessage",
                alert[4]
            );


            const date =
                new Date(
                    alert[5]
                );


            setText(
                "alertTime",
                date.toLocaleString()
            );


            const badge =
                document.getElementById(
                    "alertBadge"
                );

            if (badge) {

                if (
                    alert[6] === true
                ) {

                    badge.textContent =
                        "ACTIVE";

                }

                else {

                    badge.textContent =
                        "CLOSED";

                }

            }

        })

        .catch(error => {

            console.error(
                "Alert error:",
                error
            );

        });

}


/* =====================================================
   DEMO RISK
===================================================== */

function loadRiskPrediction() {

    /*
        CURRENT STATUS

        These values come from the demo
        prediction we inserted earlier.

        Later:
        GET /risk-prediction

        will replace these hard-coded values.
    */


    const riskScore =
        78.50;

    const confidence =
        85;


    setText(
        "riskScore",
        riskScore.toFixed(2)
    );


    setText(
        "confidenceValue",
        confidence + "%"
    );


    setText(
        "riskUpdated",
        new Date().toLocaleTimeString()
    );


    const confidenceBar =
        document.getElementById(
            "confidenceBar"
        );


    if (confidenceBar) {

        confidenceBar.style.width =
            confidence + "%";

    }


    if (riskScore >= 70) {

        setText(
            "riskLevel",
            "HIGH RISK"
        );

        setText(
            "riskTitle",
            "Elevated Landslide Risk"
        );

    }

    else if (riskScore >= 40) {

        setText(
            "riskLevel",
            "MEDIUM RISK"
        );

        setText(
            "riskTitle",
            "Moderate Landslide Risk"
        );

    }

    else {

        setText(
            "riskLevel",
            "LOW RISK"
        );

        setText(
            "riskTitle",
            "Low Landslide Risk"
        );

    }

}


/* =====================================================
   CLOCK
===================================================== */

function updateClock() {

    const now =
        new Date();


    setText(
        "currentTime",
        now.toLocaleTimeString()
    );

}


/* =====================================================
   DATA LOAD
===================================================== */

function loadAllData() {

    loadDashboard();

    loadLocations();

    loadRainfall();

    loadSoilMoisture();

    loadAlerts();

    loadRiskPrediction();

    updateClock();

}


/* =====================================================
   NAVIGATION
===================================================== */

document
    .querySelectorAll(".nav-item")
    .forEach(item => {

        item.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(
                        ".nav-item"
                    )
                    .forEach(
                        nav =>
                            nav.classList
                                .remove(
                                    "active"
                                )
                    );

                this.classList.add(
                    "active"
                );

            }
        );

    });


/* =====================================================
   START
===================================================== */

loadAllData();


/* =====================================================
   REFRESH CLOCK
===================================================== */

setInterval(
    updateClock,
    1000
);


/* =====================================================
   AUTO REFRESH
===================================================== */

setInterval(
    function () {

        loadDashboard();

        loadLocations();

        loadRainfall();

        loadSoilMoisture();

        loadAlerts();

        loadRiskPrediction();

        showToast(
            "Dashboard data refreshed"
        );

    },
    30000
);


/* =====================================================
   INITIAL MESSAGE
===================================================== */

setTimeout(
    function () {

        showToast(
            "Monitoring dashboard connected"
        );

    },
    800
);