import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CameraResultType, CameraSource, Capacitor, Plugins } from '@capacitor/core';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @Input() public showPreview: boolean = false;
  @Output() private imagePick = new EventEmitter<string>();

  public selectedImage: string;

  constructor() { }

  ngOnInit(): void {
  }

  public onPickImage(): void {
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }

    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 600,
      resultType: CameraResultType.DataUrl
    }).then((image) => {
      this.selectedImage = image.dataUrl;

      this.imagePick.emit(image.dataUrl);
    }).catch((error) => {
      console.log(error);

      return;
    });
  }

}
