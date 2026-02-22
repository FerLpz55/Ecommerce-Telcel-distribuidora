import { Component } from '@angular/core';

@Component({
  selector: 'app-location',
  standalone: true,
  templateUrl: './location.html',
  styleUrls: ['./location.scss']
})
export class Location {
  // Keep coordinates available if needed elsewhere
  lat = 17.545;
  lon = -99.364;
}
