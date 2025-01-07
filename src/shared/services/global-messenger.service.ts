import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GlobalMessengerService {

  toastMessage:Subject<string[]> = new Subject(); //0 to styl alertu (np. alert-primary) a 1 to wiadomość
  constructor() { }
}
