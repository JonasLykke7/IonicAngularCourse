import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

import { Place } from '../../models/place.model';
import { PlaceLocation } from '../../models/location.model';

const dummyPlaces: Place[] = [
  // new Place(
  //   'p1',
  //   'Manhattan Mansion',
  //   'In the heart of New York City.',
  //   'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
  //   149.99,
  //   new Date('2019-01-01'),
  //   new Date('2019-12-31'),
  //   'abc'
  // ),
  // new Place(
  //   'p2',
  //   'L\'Amour Toujours',
  //   'A romantic place in Paris!',
  //   'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg',
  //   189.99,
  //   new Date('2019-01-01'),
  //   new Date('2019-12-31'),
  //   'abc'
  // ),
  // new Place(
  //   'p3',
  //   'The Foggy Palace',
  //   'Not your average city trip!',
  //   'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
  //   99.99,
  //   new Date('2019-01-01'),
  //   new Date('2019-12-31'),
  //   'abc'
  // )
];

interface IPlaceData {
  title: string;
  description: string;
  imageURL: string;
  price: number;
  availableFrom: string;
  availableTo: string;
  userID: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _firebaseDatabaseURL: string = environment.firebaseDatabaseURL;
  private _offeredPlacesURL: string = environment.offeredPlacesURL;

  private _places: BehaviorSubject<Place[]> = new BehaviorSubject<Place[]>([]);

  public get places(): Observable<Place[]> {
    return this._places.asObservable();
  }

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) { }

  public fetchPlaces() {
    return this.httpClient.get<{ [key: string]: IPlaceData }>(`${this._firebaseDatabaseURL}${this._offeredPlacesURL}.json`)
      .pipe(map((response) => {
        const places = [];

        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            places.push(new Place(key, response[key].title, response[key].description, response[key].imageURL, response[key].price, new Date(response[key].availableFrom), new Date(response[key].availableTo), response[key].userID, response[key].location));
          }
        }

        return places;
      }),
        tap((places: Place[]) => {
          this._places.next(places);
        })
      );
  }

  public getPlace(id: string) {
    return this.httpClient.get(`${this._firebaseDatabaseURL}${this._offeredPlacesURL}/${id}.json`)
      .pipe(
        map((place: any) => {
          return new Place(id, place.title, place.description, place.imageURL, place.price, new Date(place.availableFrom), new Date(place.availableTo), place.userID, place.location);
        })
      );
  }

  public uploadImage(image: File) {
    const uploadData = new FormData();

    uploadData.append('image', image);

    return this.httpClient.post<{ imageUrl: string, imagePath: string }>('https://us-central1-ionicangularcourse-f9b9b.cloudfunctions.net/storeImage', uploadData);
  }

  public addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date, location: PlaceLocation, imageURL: string): Observable<Place[]> {
    let generatedID: string;

    const place: Place = new Place(Math.random().toString(), title, description, imageURL, price, dateFrom, dateTo, this.authService.userID, location);

    return this.httpClient.post<{ name: string }>(`${this._firebaseDatabaseURL}${this._offeredPlacesURL}.json`, { ...place, id: null })
      .pipe(
        switchMap((response) => {
          generatedID = response.name;

          return this.places;
        }),
        take(1),
        tap((places: Place[]) => {
          place.id = generatedID;
          this._places.next(places.concat(place));
        })
      );
  }

  public updatePlace(id: string, title: string, description: string) {
    let updatedPlaces: Place[];

    return this.places.pipe(
      take(1),
      switchMap((places: Place[]) => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap((places: Place[]) => {
        const updatedPlaceIndex: number = places.findIndex(place => place.id === id);
        updatedPlaces = [...places];

        const oldPlace: Place = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(oldPlace.id, title, description, oldPlace.imageURL, oldPlace.price, oldPlace.availableFrom, oldPlace.availableTo, oldPlace.userID, oldPlace.location);

        return this.httpClient.put(`${this._firebaseDatabaseURL}${this._offeredPlacesURL}/${id}.json`, { ...updatedPlaces[updatedPlaceIndex], id: null });
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
