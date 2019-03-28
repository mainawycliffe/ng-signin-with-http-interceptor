import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.sass']
})
export class LoginPageComponent implements OnInit {
  public frmLogin: FormGroup = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  buildForm(): FormGroup {
    return this.fb.group({
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.frmLogin = this.buildForm();
  }

  submit() {
    // convert the angular form model to form data
    // this ensure data is sent as formdata and not an array
    // some backends are versatile enought to process the array form but not all
    const fd = new FormData();
    fd.append('username', this.frmLogin.value.username);
    fd.append('password', this.frmLogin.value.password);

    this.authService.login(fd).subscribe(
      () => {
        // login was successfull
        // redirect to homepage
      },
      error => {
        console.log(error);
        // show error message
      }
    );
  }
}
