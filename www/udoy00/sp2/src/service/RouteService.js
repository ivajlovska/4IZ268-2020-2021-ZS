import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'https://api.skypicker.com',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

//partner for kiwi API (use 'picky' for testing)
const partner = 'picky';

const limitOfResults = 10;

export default {

    //fly_from and fly_to requires IATA code of city/airport/country
    async getFlights(fly_from, fly_to, date_from, date_to, max_stopovers, stopover_from) {
        let routeService = this;
        return apiClient.get('/flights', {
            params: {
                fly_from: fly_from,
                fly_to: fly_to,
                date_from: this.reformatDate(date_from),
                date_to: this.reformatDate(date_to),
                partner: partner,
                limit: limitOfResults,
                max_stopovers: max_stopovers,
                stopover_from: stopover_from + ":00"
            }
        }).then(function (response) {
            return routeService.getRoutes(response);
        }).catch(function (error) {
            console.log(error);
        });
    },

    //city_from and city_to requires city name
    async getGroundRoutes(city_from, city_to, date_from, date_to, max_stopovers, stopover_from) {
        let routeService = this;
        return apiClient.get('/flights', {
            params: {
                fly_from: await this.getCityId(city_from),
                fly_to: await this.getCityId(city_to),
                date_from: this.reformatDate(date_from),
                date_to: this.reformatDate(date_to),
                v: 3,
                vehicle_type: "train,bus",
                partner: partner,
                limit: limitOfResults,
                max_stopovers: max_stopovers,
                stopover_from: stopover_from + ":00"
            }
        }).then(function (response) {
            return routeService.getRoutes(response);
        }).catch(function (error) {
            console.log(error);
        });
    },

    //requires city name or IATA code
    async getCityId(city) {
        return apiClient.get('/locations', {
            params: {
                term: city,
                locations_type: "station, bus_station"
            }
        }).then(function (response) {
            return response.data.locations[0].id;
        }).catch(function (error) {
            console.log(error);
        });
    },

    //requires date in format from input type=date
    reformatDate(date) {
        return date.toString().slice(8,10) + '/' + date.toString().slice(5,7) + '/' + date.toString().slice(0,4)
    },

    //returns routes from response of https://api.skypicker.com/flights call
    getRoutes(response) {
        let routes = [];
        for (let i = 0; i < response.data.data.length; i++) {
            let route = {};
            route.transfers = [];
            route.travelTipId = 1;
            route.itemNumber = i;
            route.stopoverHours = 0;
            route.stopoverTolerance = 0;
            route.description = response.data.data[i].route[0].vehicle_type;
            if (route.description === "aircraft")
                route.id = i;
            else
                route.id = i+10;
            if (response.data.data[i].route.length === 1) {
                let data = response.data.data[i].route[0];
                let transfer = {};
                transfer.id = 0;
                transfer.itineraryItemId = route.id;
                transfer.dateFrom = route.fromDate = data.dTimeUTC;
                route.fromLatitude = data.latFrom;
                route.fromLongitude = data.lngFrom;
                transfer.dateTo = route.toDate = data.aTimeUTC;
                route.toLatitude = data.latTo;
                route.toLongitude = data.lngTo;
                route.fromPlace = data.cityFrom;
                route.toPlace = data.cityTo;
                transfer.cityFrom = route.fromPlace;
                transfer.cityTo = route.toPlace;
                route.transfers.push(transfer);
            } else {
                for (let j = 0; j < response.data.data[i].route.length; j++) {
                    let data = response.data.data[i].route[j];
                    let transfer = {};
                    transfer.id = j;
                    transfer.itineraryItemId = route.id;
                    transfer.dateFrom = data.dTimeUTC;
                    transfer.dateTo = data.aTimeUTC;
                    transfer.latitudeFrom = data.latFrom;
                    transfer.longitudeFrom = data.lngFrom;
                    transfer.latitudeTo = data.latTo;
                    transfer.longitudeTo = data.lngTo;
                    transfer.cityFrom = data.cityFrom;
                    transfer.cityTo = data.cityTo;
                    transfer.airline = data.airline;
                    if (route.description === "aircraft")
                        transfer.type = "flight";
                    else {
                        transfer.stationFrom = data.stationFrom;
                        transfer.stationTo = data.stationTo;
                        transfer.type = data.vehicle_type;
                    }
                    if (j === response.data.data[i].route.length-1) {
                        route.toLatitude = data.latTo;
                        route.toLongitude = data.lngTo;
                    } else if (j === 0) {
                        route.fromLatitude = data.latFrom;
                        route.fromLongitude = data.lngFrom;
                    }
                    route.transfers.push(transfer);
                }
                route.fromDate = route.transfers[0].dateFrom;
                route.toDate = route.transfers[response.data.data[i].route.length-1].dateTo;
                route.fromPlace = route.transfers[0].cityFrom;
                route.toPlace = route.transfers[response.data.data[i].route.length-1].cityTo;
            }
            routes.push(route);
        }
        return routes
    },

    //returns duration of walking in minutes
    getWalkDuration(lat1, lon1, lat2, lon2) {
        return (this.getDistance(lat1, lon1, lat2, lon2) / 3.8) * 60
    },

    //returns distance in kilometres
    getDistance(latitudeFrom, longitudeFrom, latitudeTo, longitudeTo) {
        if (latitudeFrom === latitudeTo && longitudeFrom === longitudeTo)
            return 0;
        else {
            let radlat1 = Math.PI * latitudeFrom / 180;
            let radlat2 = Math.PI * latitudeTo / 180;
            let theta = longitudeFrom - longitudeTo;
            let radtheta = Math.PI * theta / 180;
            let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1)
                dist = 1;
            return (Math.acos(dist) * 180 / Math.PI) * 60 * 1.1515 * 1.609344;
        }
    }
}
