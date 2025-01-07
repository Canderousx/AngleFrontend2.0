import {Injectable, TemplateRef} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() {
  }

  openModal: Subject<boolean> = new Subject<boolean>();


}
