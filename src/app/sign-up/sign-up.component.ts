import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {ageValidator} from "../../shared/validators/ageValidator";
import {fadeInOut} from "../../shared/animations/fadeInOut";
import {MaterialModule} from "../../shared/modules/material/material.module";
import {GlobalMessengerService} from "../../shared/services/global-messenger.service";
import {Router} from "@angular/router";
import {UsernameValidatorService} from "../../shared/validators/UsernameValidatorService";
import {Title} from "@angular/platform-browser";
import {AuthenticationService} from "../../shared/services/authentication.service";
import {ToastrService} from 'ngx-toastr';

export interface signUpReq{
  username: string,
  password: string,
  email: string;
  birthDate: Date,
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  animations: [fadeInOut],
  imports: [
    FormsModule,
    MatInput,
    NgIf,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit{
  constructor(private router: Router,
              private authService: AuthenticationService,
              private usernameValidator: UsernameValidatorService,
              private titleService: Title,
              private toast: ToastrService) {
  }
  signForm!: FormGroup;

  //LIFECYCLE HOOKS:

  ngOnInit() {
    this.titleService.setTitle("Sign Up to Angle!")
    this.signForm =  new FormGroup({
      username: new FormControl("", {
        validators: [Validators.required, Validators.minLength(4)],
        asyncValidators: [this.usernameValidator.usernameExists()],
        updateOn: 'blur'
      }),
      password: new FormControl("",Validators.compose([Validators.required,Validators.minLength(8)])),
      email: new FormControl("",{
        validators: [Validators.required,Validators.email],
        asyncValidators: [this.usernameValidator.emailExists()],
        updateOn: 'blur'
      }),
      birthDate: new FormControl("",Validators.compose([Validators.required,ageValidator]))
    })
  }

  //ACTIONS:
  submit(){
    let account = {username: this.signForm.controls['username'].value!,
      password: this.signForm.controls['password'].value!,
      email: this.signForm.controls['email'].value!,
      birthDate: this.signForm.controls['birthDate'].value!.toString()}
    this.authService.signup(account).subscribe({
      next: value => {
        this.toast.info(value.message)
        this.router.navigate([""]);
      },
      error: err => {
        let errMsg: string  = err.error();
        this.toast.error(errMsg)
      }
    })

  }


  //UI:
  get usernameControl(): FormControl {
    return this.signForm.get('username') as FormControl;
  }

  get emailControl(): FormControl {
    return this.signForm.get('email') as FormControl;
  }

  get birthDateControl(): FormControl {
    return this.signForm.get('birthDate') as FormControl;
  }

  get passwordControl(): FormControl{
    return this.signForm.get('password') as FormControl;
  }





}
