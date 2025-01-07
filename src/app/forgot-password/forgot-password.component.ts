import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {AuthenticationService} from "../../shared/services/authentication.service";
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FormsModule,
    MatInput,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  constructor(private authService: AuthenticationService,
              private toast: ToastrService) {}

  emailForm = new FormGroup({
    email: new FormControl('', Validators.compose([Validators.required,Validators.email])),
  })

  submit(){
    this.authService.passwordRecovery(this.emailForm.controls.email.value!).subscribe({
      next: value => {
        this.toast.info(value.message)
      }
    })
  }


}
