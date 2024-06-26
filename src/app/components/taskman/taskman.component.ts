import { Component, Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { ReturnType } from 'util';

interface CustomPositionInterface extends GeolocationPosition {
  isPaused: boolean;
}

class CustomPosition implements CustomPosition {
  readonly timestamp: number;
  readonly coords: GeolocationCoordinates;
  readonly isPaused: boolean;

  constructor(position: GeolocationPosition, isPaused: boolean) {
    const positionCopy = { ...position }; // Object.assign használata a legfelsőbb szintű tulajdonságok másolásához
    Object.assign(positionCopy, { coords: position.coords, timestamp: position.timestamp }); // Expliciten másolja a coords tulajdonságot
    this.timestamp = positionCopy.timestamp;
    this.coords = positionCopy.coords;
    this.isPaused = isPaused;
  }

  getTimestamp() {
    return this.timestamp;
  }
  getCoords() {
    return this.coords;
  }
  getAccuracy() {
    return this.coords.accuracy;
  }
  getLatitude() {
    return this.coords.latitude;
  }
  getLongitude() {
    return this.coords.longitude;
  }
  getIsPaused() {
    return this.isPaused;
  }
  getAll() {
    return {
      timestamp: this.timestamp,
      accuracy: this.coords.accuracy,
      latitude: this.coords.latitude,
      longitude: this.coords.longitude,
      isPaused: this.isPaused
    }
  }
  // További metódusok definiálása itt
}

@Component({
  selector: 'app-taskman',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './taskman.component.html',
  styleUrl: './taskman.component.scss'
})
export class TaskmanComponent {

  paused = true;
  timer: number = 0;
  latest_geo_time: number = 0;
  timeout: number = 15000;
  last_timeout: number = 0;
  distSum: number = 0;
  dist: number = 0;
  speed: number = 0;
  avg_speed: number = 0;
  pace: number = 0;
  avg_pace: number = 0;
  latitude: number = 0;
  longitude: number = 0;
  time_prev: number = 0;
  lat_prev: number = 0;
  long_prev: number = 0;
  data: Array<CustomPosition> = [];
  data_string: string = '';
  intervalId: any;
  geoMessage: string = '';
  lastPosition: any = null;
  watchId: any;
  //array = ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚'];

  constructor(private renderer: Renderer2, private el: ElementRef) {
    setInterval(() => {
      this.clock();
    }, 1000);
  }


  /*clock(): string {
    //array = ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚'];
    if(!this.paused){
      const seconds = new Date().getSeconds();
      const index = seconds % this.array.length;
      let returned = this.array[index]
      //index % 2 == 0 ? returned = `.${this.array[index]}.` : returned = `:${this.array[index]}:`
      return returned
    }else{
      return this.array[0]
    }
  }*/


  /**
 * Updates the clock display with a rotating hour hand.
 * The clock hand rotates based on the current second of the minute.
 * The rotation is animated using CSS variables and transformations.
 */
clock(): void {
    // Create a new span element for the clock hand
  //  let returned = this.renderer.createElement('span');
    // Set the text content of the span element to a clock face icon
    //this.renderer.setProperty(returned, 'innerText', '🕛');
  //  this.renderer.setProperty(returned, 'innerHTML', '<img src="../../assets/clock1.svg">');
    // Add a CSS class to the span element for styling
  //  this.renderer.addClass(returned, 'clock2');
    // Get the clock container element from the DOM
    let clockImg = this.el.nativeElement.querySelector('.clock > img');
    clockImg.style.setProperty('height', `var(--clock-size)`);
    //clockImg.style.setProperty('transform', `scale(var(--clock-size),var(--clock-size))`);
    // Check if the timer is not paused
    if (!this.paused) {
      // Calculate the degree of rotation based on the current second
      const seconds = new Date().getSeconds();
      let deg = (seconds % 12) * 30;
      // Set the CSS variable for the rotation degree
      clockImg.style.setProperty('--clockrot', `${deg}deg`);
      // Clear the clock container and append the new span element
    //  clockContainer.innerHTML = '';
    //  this.renderer.appendChild(clockContainer, returned);
    } else {
      // If the timer is paused, clear the clock container
    //  clockContainer.innerHTML = '';
    //  this.renderer.appendChild(clockContainer, returned);
    }
  }

  stop(): void {
    if (confirm("Really?")) {
      //this.started = false;
      //this.time = 0;
      this.paused = true
      this.latest_geo_time = 0;
      this.timeout = 15000;
      this.last_timeout = 0;
      this.distSum = 0;
      this.dist = 0;
      this.speed = 0;
      this.avg_speed = 0;
      this.pace = 0;
      this.avg_pace = 0;
      this.latitude = 0;
      this.longitude = 0;
      this.time_prev = 0;
      this.lat_prev = 0;
      this.long_prev = 0;
      this.data = [];
      this.intervalId;
      this.lastPosition = null;

      //this.toggleTimer()
      this.timer = 0;
      console.log('stopped timer')
      if (this.watchId) {
        navigator.geolocation.clearWatch(this.watchId);
      }
      this.log('RESET BUTTON PRESSED');
    } else {

    }
  }

  get hours() {
    return Math.floor(this.timer / 3600);
  }

  get minutes() {
    return Math.floor(this.timer / 60) % 60;
  }

  get seconds() {
    return this.timer % 60;
  }

  pace_minutes(minperkm: number) {
    return Math.floor(minperkm);
  }

  pace_seconds(minperkm: number) {
    return (minperkm - Math.floor(minperkm)) * 60;
  }

  dist_km(dist: number) {
    return Math.floor(dist);
  }
  dist_m(dist: number) {
    return (dist - this.dist_km(dist)) * 1000;;
  }

  startWatchPosition(timeout: number) {
    // ha paused, itt töröljük a lastposition-t, hogy ha visszatér, ne egy régi adat alapján számoljon tovább
    if(this.paused){this.lastPosition = null}
    this.paused = !this.paused;
    this.paused ? this.log('------------- PAUSE BUTTON PRESSED') : this.log('------------- START/RESUME BUTTON PRESSED');
    ;

    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }

    if ("geolocation" in navigator) {
      this.watchId = navigator.geolocation.watchPosition((position) => {
        this.log('------------- watchPosition start')

        // success

        let lastPaused: boolean|null

        if(this.data.length > 0){
          lastPaused = (this.data[this.data.length - 1] as CustomPosition).isPaused;
        }else{
          lastPaused = null;
        }

        if (this.lastPosition && !this.paused) {
          // distance in km, three decimals
          this.dist = Math.round(this.calculateDistance(this.lastPosition.coords.latitude, this.lastPosition.coords.longitude, position.coords.latitude, position.coords.longitude) * 1000) / 1000;
          //this.log(`dist: ${this.dist}`)
          this.distSum += this.dist
          //this.log(`distSum: ${this.distSum}`)
          // measuring time difference in seconds
          this.time_prev = Math.round((position.timestamp - this.lastPosition.timestamp) / 1000); // s
          //this.log(`time_prev: ${this.time_prev}`)
          this.timer += this.time_prev
          if (position.coords.speed !== null) {
            // m/s
            //this.show_geoMessage(`! speed ${position.coords.speed} m/s`)
            this.speed = position.coords.speed * 3.6
            //this.log(`!speed: ${position.coords.speed} m/s = ${this.speed} km/h`)
            // km/h
          } else {
            //1 km/s = 3600 km/h
            this.speed = (this.dist / this.time_prev) * 3600
          }
          this.pace = 60 / this.speed // min/km

          let new_timeout = this.calc_timeout(this.speed)
          if (Math.abs(new_timeout - this.timeout) > 2) {
            this.timeout = new_timeout

            //must restart
            if (this.watchId) {
              navigator.geolocation.clearWatch(this.watchId);
            }
            this.startWatchPosition(timeout)

          }
          //1 km/s = 3600 km/h
          this.avg_speed = this.distSum / this.timer * 3600

          this.avg_pace = 60 / this.avg_speed // min/km

          this.lastPosition = position;

        }else if( this.lastPosition && this.paused) { // 
          //first position
          this.lastPosition = position;

          /*
          if (lastPaused === null){this.log('NO DATA2')}else{this.log('LASTPAUSED' + lastPaused.toString())}
          */

        } else if( !this.lastPosition) { // 
          //first position
          this.lastPosition = position;

          /*
          if (lastPaused === null){this.log('NO DATA3')}else{this.log('LASTPAUSED' + lastPaused.toString())}
          */
        }

        // Always save position for further processing, 
        // (only one position saved during pausing...)

        function createCustomPosition(position: GeolocationPosition, isPaused: boolean): CustomPosition {
          let returned: CustomPosition = new CustomPosition(position, isPaused); // CustomPosition2 osztály használata
          return returned;
        }

        /*
        if (!this.paused){this.log('1NOT PAUSED')}else{this.log('1PAUSED')}
        if (this.data.length == 0){this.log('1NO DATA')}else{this.log('1HAVE DATA')}
        if (lastPaused === null){this.log('1NO DATA2')}else{this.log('1LASTPAUSED' + lastPaused.toString())}
        */

        if (/*!this.paused && */this.data.length == 0) {
          this.log('first saved data')
          pushPosition(position, this.paused, this.data)
          this.logLastSaved()
        }
        if (/*!this.paused && */lastPaused === false) {
          this.log('save when last was not paused - ' + lastPaused)
          pushPosition(position, this.paused, this.data)
          this.logLastSaved()
        }
        if (/*this.paused && */lastPaused === true) {
          if(this.paused === true) {
          this.log('NOT save when last was paused - ' + lastPaused)
          }
          else if(this.paused === false) {
            pushPosition(position, this.paused, this.data)
          }
        }

        /*
        if (!this.paused){this.log('2NOT PAUSED')}else{this.log('2PAUSED')}
        if (this.data.length == 0){this.log('2NO DATA')}else{this.log('2HAVE DATA')}
        if (lastPaused === null){this.log('2NO DATA2')}else{this.log('2LASTPAUSED' + lastPaused.toString())}
        */

        function pushPosition(position: GeolocationPosition, paused:boolean, targetArray:Array<CustomPosition>):void{
          const customPosition = createCustomPosition(position, paused);
          targetArray.push(customPosition);
        }
        

        this.data_string = this.datatoString(this.data);
        this.log('------------- watchPosition end')
      }, (error) => {
        console.error('Error getting location:', error);
        this.log(`Error: ${error}`)
      }, {
        enableHighAccuracy: true,
        timeout: this.timeout,
        maximumAge: 12000
      });

    } else {
      /* geolocation IS NOT available */
    }
  }



  next_geo_time() {
    return this.latest_geo_time + this.timeout;
  }

  two_decimal(num: number) {
    return Math.round(num * 100) / 100
  }
  round(num: number) {
    return Math.round(num)
  }


  degreesToRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const earthRadiusKm = 6371; // Föld átlagos sugara km-ben

    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);

    const φ1 = this.degreesToRadians(lat1);
    const φ2 = this.degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadiusKm * c; // távolság km-ben

    return distance;
  }

  calc_timeout(speed: number): number {
    if (speed < 3) {
      return 15000;
    } else if (speed < 16) {
      return Math.abs(Math.round(speed) - 18) * 1000
    } else {
      return 3000;
    }
  }

  show_geoMessage(message: string) {
    this.geoMessage = message
    setTimeout(() => {
      this.geoMessage = '...';
    }, 3000)
  }
  log(message: string): void {
    let log = this.el.nativeElement.querySelector('#log');
    let content = this.renderer.createElement('p');
    this.renderer.setProperty(content, 'innerText', message);
    this.renderer.insertBefore(log, content, log.firstChild);
  }
  logLastSaved(){
    let x = []
    x[0] = this.data[this.data.length - 1]
    this.log('SAVED: ' + this.paused + ' '+ this.datatoString(x))
  }

  datatoString(data: Array<CustomPosition>) {
    let data_string = '';
    for (let i = 0; i < data.length; i++) {
      console.log(data[i])
      console.log(data[i].coords)
      let coordsCopy = { ...data[i].coords }
      Object.assign(coordsCopy, { accuracy: data[i].coords.accuracy, altitude: data[i].coords.altitude, altitudeAccuracy: data[i].coords.altitudeAccuracy, heading: data[i].coords.heading, latitude: data[i].coords.latitude, longitude: data[i].coords.longitude, speed: data[i].coords.speed });
      console.log(coordsCopy)
      console.log(JSON.stringify(coordsCopy))
      let iteratedarr = JSON.stringify(data[i]).split('{}')
      let append = ''
      iteratedarr[2] = iteratedarr[1]
      iteratedarr[1] = JSON.stringify(coordsCopy)
      let iterated = iteratedarr.join('')
      console.log(iterated)
      data_string += iterated;
    }
    return data_string;
  }
}

/*getPosition(){
  if ("geolocation" in navigator) {
    // geolocation is available 
    navigator.geolocation.watchPosition((position) => {
      // success
      if (this.lastPosition) {
        this.dist = this.calculateDistance(this.lastPosition.coords.latitude, this.lastPosition.coords.longitude,position.coords.latitude,position.coords.longitude);
        this.distSum += this.dist
        this.time_prev = Math.round((position.timestamp - this.lastPosition.timestamp) / 1000); // Másodpercekben
        this.timer += this.time_prev
        if(position.coords.speed !== null){
          this.show_geoMessage(`! speed ${position.coords.speed} m/s`)
          this.speed = position.coords.speed
        }else{
          this.speed = this.dist / this.time_prev; // km/s
        }
        let new_geo_interval = this.calc_geo_interval(this.speed)
        if(Math.abs(new_geo_interval - this.geo_interval) > 2){

        }
        this.geo_interval = this.calc_geo_interval(this.speed)
        this.avg_speed = this.distSum/(this.timer/3600)
 
      }else{
        this.lastPosition = position;
      }


        console.log(position)
        this.show_geoMessage('get location')
        this.latest_geo_time = this.timer
        if(this.lat_prev === 0 && this.long_prev === 0){
          console.log('starting position')
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.lat_prev = position.coords.latitude;
          this.long_prev = position.coords.longitude;
          //starting position
          this.dist = 0;
        }else if(position.coords.latitude !==this.lat_prev || position.coords.longitude !== this.long_prev){
          console.log('maybe we moving')
          this.lat_prev = this.latitude;
          this.long_prev = this.longitude;

          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          //calculate distance
          this.dist = this.calculateDistance(this.latitude, this.longitude, this.lat_prev, this.long_prev);
          this.distSum += this.dist;
          //calculate speed
          this.speed = this.dist/(this.geo_interval/3600)

          this.last_geo_interval = this.geo_interval
          //geo interval by speed
          this.geo_interval = this.calc_geo_interval(this.speed)
          this.avg_speed = this.distSum/(this.timer/3600)
          //(sec/km) = time (sec) / distance (km)
          this.pace = this.last_geo_interval / this.dist
          this.avg_pace = this.timer/this.distSum
        }else{
          console.log('just staying')
          this.show_geoMessage('no change')
          //if old and new position is equal
          this.dist = 0;
        }
      },
      function error(msg) {
        alert('Please enable your GPS position feature.');
      },{
        enableHighAccuracy: true
      });
  } else {
    // geolocation IS NOT available
  }
}*/

/*toggleTimer() {
if(this.started){
 this.getPosition()
 this.intervalId = setInterval(() => {
  this.timer++;
  if(this.timer === this.latest_geo_time + this.timeout){
    console.log('get the position');
    this.getPosition()
  }
}, 1000);
}else{
    clearInterval(this.intervalId);
}
}*/

/*toggleStarted(): void {
  this.started = !this.started
  this.toggleTimer();


  if(this.started === true){
    if(this.timer === 0 && 
      this.time_prev === 0 && 
      this.latitude === 0 &&
      this.lat_prev === 0 &&  
      this.longitude=== 0 &&
    this.long_prev === 0 ){ // new measuring
      console.log('new measuring')
    }else{ // return to paused measuring
      console.log('return to paused measuring')
    }
  }else{
    console.log('paused')
  }
}*/