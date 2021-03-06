$(document).ready(() => {
    const mapboxURL = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

    const dark = L.tileLayer(mapboxURL, {
        maxZoom: 18,
        minZoom: 1,
        attribution: attribution,
        id: 'mapbox/dark-v10',         // 'mapbox/satellite-streets-v11',     // 'mapbox/streets-v11', //  'mapbox/satellite-v9',
        tileSize: 512,
        zoomOffset: -1
    });

    const sat = L.tileLayer(mapboxURL, {
        maxZoom: 18,
        minZoom: 1,
        attribution: attribution,
        id: 'mapbox/satellite-streets-v11',     // 'mapbox/streets-v11', //  'mapbox/satellite-v9',
        tileSize: 512,
        zoomOffset: -1
    });

    const light = L.tileLayer(mapboxURL, {
        maxZoom: 18,
        minZoom: 1,
        attribution: attribution,
        id: 'mapbox/light-v10',
        tileSize: 512,
        zoomOffset: -1
    });

    const map = L.map('mapid', {
        center: [0, 0],
        /*
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 0.0,
        */
        worldCopyJump: true,
        zoom: 2,
        scrollWheelZoom: false,
        layers: [dark, sat, light]
    });

    const baseMapLayers = {
        "Dark": dark,
        "Light": light,
        "Satellite": sat
    }
    // Add controls to the map
    L.control.layers(baseMapLayers).addTo(map);

    const issIcon = L.icon({
        iconUrl: './assets/iss2.png',
        iconSize: [51.2, 51.2],
        popupAnchor: [0, -20],
    });

    const iss = L.marker([0, 0], { icon: issIcon }).addTo(map).bindPopup("<b>Hello there!</b>");

    const moveISS = (lat, long) => {
        iss.setLatLng([lat, long]);
        map.panTo([lat, long], animate = true);
    };

    const updateISS = () => {
        $.ajax('https://api.wheretheiss.at/v1/satellites/25544')
            .done(s => {
                let lat = s.latitude;
                let long = s.longitude;
                let t = s.timestamp;
                moveISS(lat, long);
                saveToLocalStorage(t, lat, long);
            })
            .fail(e => console.log('error', e));
        setTimeout(updateISS, 8000);            // update ISS position every 8 seconds
    };

    const createPeopleInSpace = (s) => {
        let names = [];
        for (let i = 0, l = s.people.length; i < l; i++) {
            const name = s.people[i].name;
            names.push($(`<li>${name}</li>`));
        }
        const namesContainer = $('<ul></ul>').append(names);
        crewContainer.append(namesContainer);
    };

    const getPeopleInSpace = () => {
        $.ajax('http://api.open-notify.org/astros.json')
            .done(s => createPeopleInSpace(s)).then(() => sp2.detach());
    };

    const makeSpinner = () => {
        return $(`<div class="loadingio-spinner-radio-vt9tc1ouupc">
                <div class="ldio-eet66rbatu7">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>`);
    };

    const addSpinnerTo = (container, spinner) => {
        container.append(spinner);
    }

    const saveToLocalStorage = (time, lat, long) => {
        let p = getFromLocalStorage();
        p[time] = { lat, long }
        p = JSON.stringify(p);
        try {
            window.localStorage.setItem(KEY, p);
        } catch (e) {
            //setItem() may throw an exception if the storage is full
            console.log(e);
            return false;
        }
        return true;
    };

    const getFromLocalStorage = () => {
        const item = window.localStorage.getItem(KEY);
        return item ? JSON.parse(item) : {};
    };

    const createCircle = (lat, long) => {
        return L.circle([lat, long], {
            color: 'red',
            radius: 1,
        });
    };

    const markPosition = (map, lat, long) => {
        createCircle(lat, long).addTo(map);
    };

    const showOldPositions = () => {
        const pos = getFromLocalStorage();
        Object.keys(pos).forEach(k => {
            const c = pos[k];
            markPosition(map, c.lat, c.long);
        });
    }

    const KEY = 'ISS';
    const crewContainer = $('#people');
    const sp1 = makeSpinner();
    const sp2 = makeSpinner();

    addSpinnerTo(crewContainer, sp2);

    updateISS();
    showOldPositions();
    getPeopleInSpace();
});
