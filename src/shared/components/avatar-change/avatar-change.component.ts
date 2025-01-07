import {Component, EventEmitter, Injectable, Input, Output} from '@angular/core';
import {MaterialModule} from "../../modules/material/material.module";
import {serverResponse} from "../../../app/app.component";
import {AvatarChangerService} from "../../services/avatar-changer.service";
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-avatar-change',
  standalone: true,
  imports: [
    MaterialModule
  ],
  templateUrl: './avatar-change.component.html',
  styleUrl: './avatar-change.component.css'
})
export class AvatarChangeComponent {

  @Input() userId!: string;
  @Output() close = new EventEmitter<any>;
  selectedFile!: File;

  constructor(private avatarService: AvatarChangerService,
              private toast: ToastrService,) {
  }

  closeSettings(){
    this.close.emit();
  }

  handleInput(event: Event){
    const input = event.target as HTMLInputElement;
    if(input.files){
      if(input.files[0].type.startsWith("image/")){
        this.selectedFile = input.files[0];
        console.log("Selected file: "+this.selectedFile.name)
        this.uploadAvatar();
      }else{
        this.toast.error("Selected file's extension is not supported!")
      }

    }

  }

  uploadAvatar(){
    const formData = new FormData();
    formData.append('avatar',this.selectedFile,this.selectedFile.name)
    this.avatarService.changeAvatar(formData)
      .subscribe({
        next: value => {
          this.toast.info(value.message)
          this.closeSettings();

        },
        error: err => {
          let msg: serverResponse = err.error;
          this.toast.error(msg.message)
        }
      })

  }

}
