import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss']
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map', { static: false }) public mapElementRef: ElementRef;
  @Input() public center = { lat: -34.397, lng: 150.644 };
  @Input() public selectable: boolean = true;
  @Input() public closeButtonText: string = 'Cancel';
  @Input() public title: string = 'Pick Location';

  public clickListener: any;
  public googleMaps: any;

  constructor(
    private renderer2: Renderer2,
    private modalController: ModalController
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.getGoogleMaps()
      .then((googleMaps) => {
        this.googleMaps = googleMaps;

        const mapEl = this.mapElementRef.nativeElement;

        const map = new googleMaps.Map(mapEl, {
          center: this.center,
          zoom: 16
        });

        this.googleMaps.event.addListenerOnce(map, 'idle', () => {
          this.renderer2.addClass(mapEl, 'visible');
        });

        if (this.selectable) {
          this.clickListener = map.addListener('click', event => {
            const selectedCoords = {
              lat: event.latLng.lat(),
              long: event.latLng.lng()
            };

            this.modalController.dismiss(selectedCoords);
          });
        } else {
          const marker = new googleMaps.Marker({
            position: this.center,
            map: map,
            title: 'Picked Location'
          });

          marker.setMap(map);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.googleMaps.event.removeListener(this.clickListener);
    }
  }

  public onCancel(): void {
    this.modalController.dismiss();
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;

    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');

      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        environment.googleMapsAPIKey;

      script.async = true;
      script.defer = true;

      document.body.appendChild(script);

      script.onload = () => {
        const loadedGoogleModule = win.google;

        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available.');
        }
      };
    });
  }
}
