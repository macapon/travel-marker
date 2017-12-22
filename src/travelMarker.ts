// declare var google: any;

import { TravelMarkerOptions } from './travelMarkerOptions';
import { Marker, MarkerOptions, google } from './google-map-types';
import { DefaultMarker } from './defaultMarker';
import { CustomOverlayMarker } from './customOverlayMarker';
import { MapsEventListener } from './google-map-types';

export class TravelMarker {

  private defaultOptions: TravelMarkerOptions = {
    map: null,
    speed: 35,
    interval: 20,
    markerType: 'default',
    markerOptions: {
      position: { lat: 0, lng: 0 }
    },
    overlayOptions: {
      offsetX: 0,
      offsetY: 0,
      offsetAngle: 0,
      imageUrl: 'https://i.stack.imgur.com/lDrin.png',
      imageWidth: 36,
      imageHeight: 58
    },
    rotation: false,
    line: null
  };
  private defaultMarkerOptions = {
    draggable: false,
    // optimized: false
  };

  private options: TravelMarkerOptions;
  private path: any[] = [];
  private marker: DefaultMarker | CustomOverlayMarker = null;
  public playing = false;
  private numDelta = 0;
  private delta = null;
  private index = 0;
  private deltaIndex = 0;
  private deltaCurr = null;
  private deltaLast = null;
  private angle = 0;

  constructor(options: TravelMarkerOptions) {
    if (options.map === null) {
      console.log('map cannot be null');
      return;
    }
    options = Object.assign(this.defaultOptions, options);
    options.markerOptions = Object.assign(options.markerOptions, this.defaultMarkerOptions);
    options.markerOptions.map = options.map;
    // check all parmas
    if (this.isValidOptions) {
      this.options = options;
    } else {
      console.error('Invalid options');
    }
    return this;
  }

  private isValidOptions(options: TravelMarkerOptions): boolean {
    return !isNaN(options.speed) && !isNaN(options.interval) &&
     (options.markerType === 'default' || options.markerType === 'symbol' || options.markerType === 'overlay') &&
      typeof options.line === 'object';
  }

  addLocation(locationArray: any[] = []) {
    locationArray.forEach(location => {
      if (location.lat && location.lng) {
        this.path.push(location);
      }
    });
    if (!this.marker && this.path.length) {
      if (this.options.markerType === 'default') {
        const markerOptions = Object.assign(this.options.markerOptions, { position: { lat: this.path[0].lat(), lng: this.path[0].lng() } });
        this.marker = new DefaultMarker(markerOptions, this.options.speed, this.options.interval, this.path);
      } else if (this.options.markerType === 'overlay') {
        this.marker = new CustomOverlayMarker(this.options.map, this.options.overlayOptions,
           this.options.speed, this.options.interval, this.path);
      } else {

      }
    } else if (this.marker) {
      this.marker.addLocation(locationArray);
    } else {
      return 'Please insert valid location Array';
    }
  }

  play() {
    this.playing = true;
    this.marker.play();
  }

  pause() {
    this.playing = false;
    this.marker.pause();
  }

  addListener(eventName: string, handler: Function): any {
    this.marker.addListener(eventName, handler);
  }

}