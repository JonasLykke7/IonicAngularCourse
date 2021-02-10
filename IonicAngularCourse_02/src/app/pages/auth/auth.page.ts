import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { AuthService, IAuthResponseData } from '../../services/auth/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  public isLoading: boolean = false;
  public isLogin: boolean = true;

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  public onSwitchAuthMode(): void {
    this.isLogin = !this.isLogin;
  }

  public onSubmit(ngForm: NgForm) {
    if (!ngForm.valid) {
      return;
    }

    const email: string = ngForm.value.email;
    const password: string = ngForm.value.password;

    this.authenticate(email, password);
    ngForm.resetForm();
  }

  private authenticate(email: string, password: string): void {
    this.isLoading = true;

    this.loadingController.create({
      keyboardClose: true,
      message: 'Logging in...',
    })
      .then((loading) => {
        loading.present();

        let authObservable: Observable<IAuthResponseData>;

        if (this.isLogin) {
          authObservable = this.authService.login(email, password);
        } else {
          authObservable = this.authService.signup(email, password);
        }

        authObservable.subscribe((response) => {
          this.isLoading = false;

          loading.dismiss();

          this.router.navigateByUrl('/places/tabs/discover');
        }, (error) => {
          const code: string = error.error.error.message;

          let message: string = 'Could not sign you up, pleace try again.';

          if (code === 'EMAIL_EXISTS') {
            message = 'This email address exists already!';
          } else if (code === 'EMAIL_NOT_FOUND') {
            message = 'Email could not be found!';
          } else if (code === 'INVALID_PASSWORD') {
            message = 'This password is not correct.';
          }

          loading.dismiss();

          this.showAlert(message);
        });
      });
  }

  private showAlert(message: string) {
    this.alertController.create({
      header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    }).then((alert) => {
      alert.present();
    });
  }

}
