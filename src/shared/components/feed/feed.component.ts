import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {NgClass, NgForOf} from "@angular/common";
import {RowcutPipe} from "../../pipes/rowcut.pipe";
import {DateFormatPipe} from "../../pipes/date-format.pipe";
import {MatTooltip} from "@angular/material/tooltip";
import {SimpleDatePipe} from "../../pipes/simple-date.pipe";
import {Video} from "../../models/video";
import {environment} from '../../../environments/environment.development';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    NgForOf,
    RowcutPipe,
    DateFormatPipe,
    MatTooltip,
    SimpleDatePipe,
    NgClass,
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent {

  constructor(private router: Router) {
  }

  @Input() videosList!: Video[];
  @Input() flexDirection!: string;
  @Input() mainClass!:string;

  watch(id: string){
    this.router.navigate(["/watch"],{queryParams: {v: id}})
  }

  protected readonly environment = environment;
}
