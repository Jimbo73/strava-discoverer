
function initMap() {
    const directionsService = new google.maps.DirectionsService();
    const directionsService2 = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({ polylineOptions: { strokeColor: '#FF0000' }, suppressMarkers: true });
    const directionsRenderer2 = new google.maps.DirectionsRenderer({ polylineOptions: { strokeColor: '#FF0000' }, suppressMarkers: true });
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        //center: { lat: 39.027788, lng: -94.575829 },
    });
    const map2 = new google.maps.Map(document.getElementById("map2"), {
        zoom: 13,
        //center: { lat: 39.027788, lng: -94.575829 },
    });
    directionsRenderer.setMap(map);
    directionsRenderer2.setMap(map2);

    const perimeterCoordinates = [ 
        {
            lat:  42.528722, lng: -70.915543
        },
        {
            lat:  42.526319, lng: -70.886017
        },
        {
            lat:  42.506268, lng: -70.903889
        },
    ]

    function getRandomWaypoints(numWaypoints) {
        const random = new Random();
        const waypoints = [];
        const sortedLats = perimeterCoordinates.map(c => c.lat).sort();
        const minLatWithinPerimeter = sortedLats[0]
        const maxLatWithinPerimeter = sortedLats[sortedLats.length - 1];
        const sortedLngs = perimeterCoordinates.map(c => c.lng).sort();
        const minLngWithinPerimeter = sortedLngs[0]
        const maxLngWithinPerimeter = sortedLngs[sortedLngs.length - 1];
        for (let i = 0; i < numWaypoints; i++) {
            const lat = Number(random.real(minLatWithinPerimeter, maxLatWithinPerimeter).toFixed(14))
            const lng = Number(random.real(minLngWithinPerimeter, maxLngWithinPerimeter).toFixed(14))
            waypoints.push({
                location: {lat, lng},
                stopover: true
            })
        }
        return waypoints;
    }

    const routePromises = [];
    // for (let i = 0; i < 5; i++) {
    //     routePromises.push(calculateAndDisplayRoute(directionsService, directionsRenderer, getRandomWaypoints(8), i));
    // }
    
    routePromises.push(calculateAndDisplayRoute(directionsService, directionsRenderer, getRandomWaypoints(8), 'map'));
    routePromises.push(calculateAndDisplayRoute(directionsService2, directionsRenderer2, getRandomWaypoints(8), 'map2'));

    //Promise.all(routePromises).then(res => console.log(res))
}

function calculateAndDisplayRoute(directionsService, directionsRenderer, waypoints, divId) {
    const [origin, destination, ...rest] = waypoints;
    const r = directionsService.route(
        {
            origin: origin.location,
            destination: destination.location,
            waypoints: rest,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
            if (status === "OK" && response) {
                directionsRenderer.setDirections(response);
            } else {
                window.alert("Directions request failed due to " + status);
            }
        }
    ).then(() => {
        //console.log(canvas.toDataURL())
        setTimeout(() => {
            html2canvas(document.getElementById(divId), {
                useCORS: true, //switch to true and delay 1k for map background
            }).then((canvas) => {
                 //document.body.appendChild(canvas)
                console.log(canvas.toDataURL());
            })
        }, 1000)

    })
}
