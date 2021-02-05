import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  public isLoading: boolean = false;
  public isLogin: boolean = true;

  constructor(
    private loadingController: LoadingController,
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

    console.log(email, password);

    if (this.isLogin) {

    } else {

    }
  }

  public onLogin(): void {
    this.isLoading = true;

    this.loadingController.create({
      keyboardClose: true,
      message: 'Logging in...',
    })
      .then((loading) => {
        loading.present();

        setTimeout(() => {
          this.authService.login();

          this.isLoading = false;

          loading.dismiss();
        }, 1500);
      });
  }

}
