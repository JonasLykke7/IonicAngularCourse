export interface Coordinates {
  lat: number;
  long: number;
}

export interface PlaceLocation extends Coordinates {
  address: string;
  staticMapImageURL: string;
}
