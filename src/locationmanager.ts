import ScalpsCoreRestApi = require('scalps_core_rest_api');
import { Manager } from './manager';

export class LocationManager {
    manager: Manager;

    private geoId;

    constructor(manager: Manager) {
        this.init(manager);
    }

    private init(manager) {
        this.manager = manager;
    }

    public startUpdatingLocation() {
        if (navigator.geolocation) {
            this.geoId = navigator.geolocation.watchPosition((loc) => { this.onLocationReceived(loc) }, this.onError);
        } else {
            throw new Error("Geolocation is not supported in this browser/app")
        }
    }

    public stopUpdatingLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.clearWatch(this.geoId);
        } else {
            throw new Error("Geolocation is not supported in this browser/app")
        }
    }

    private onLocationReceived(loc) {
        let latitude, longitude, altitude;
        if (loc.coords.latitude)
            latitude = loc.coords.latitude;
        else
            throw new Error("Location did not contain any latitude: " + JSON.stringify(loc));
        if (loc.coords.longitude)
            longitude = loc.coords.longitude;
        else
            throw new Error("Location did not contain any longitude: " + JSON.stringify(loc));
        if (loc.coords.altitude)
            altitude = loc.coords.altitude;
        else
            altitude = 0; // Default value, TODO: use an altitude API
        this.manager.updateLocation(latitude, longitude, altitude);
    }

    private onError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                throw new Error("User denied the request for Geolocation.");
            case error.POSITION_UNAVAILABLE:
                throw new Error("Location information is unavailable.");
            case error.TIMEOUT:
                throw new Error("The request to get user location timed out.");
            case error.UNKNOWN_ERROR:
                throw new Error("An unknown error occurred.");
        }
    }
}

