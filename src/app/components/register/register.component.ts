import { NgxUiLoaderService } from 'ngx-ui-loader';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  err!: string;
  responseValue: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private ngxService: NgxUiLoaderService
  ) {
    if (localStorage.getItem('currentUser') !== null) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.ngxService.start();
    if (this.registerForm.valid) {
      this.loading = true;
      this.userService.register(this.registerForm.value).subscribe(
        (data: any) => {
          this.responseValue = data;
          this.ngxService.stop();
          if (this.responseValue.result === 'error') {
            this.err = this.responseValue.message;
            this.loading = false;
          } else {
            this.router.navigate(['/login']);
          }
        },
        (error: any) => {
          this.ngxService.stop();
          this.err = 'Algo salío mal, intente nuevamente.';
          this.loading = false;
          console.log(error);
        }
      );
    }
  }
}
