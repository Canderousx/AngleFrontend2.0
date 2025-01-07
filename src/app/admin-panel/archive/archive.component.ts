import { Component } from '@angular/core';
import {ReportTableComponent} from "../report-table/report-table.component";
import {HttpClient} from "@angular/common/http";
import {Report} from "../../../shared/models/report";
import {environment} from "../../../environments/environment.development";
import {ReportService} from "../../../shared/services/report.service";

@Component({
  selector: 'app-archive',
  standalone: true,
    imports: [
        ReportTableComponent
    ],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.css'
})
export class ArchiveComponent {
  constructor(private reportService: ReportService) {
  }

  reports!: Report[];
  pageSize = 10;
  allReports!: number;
  pageIndex = 0;
  ascending = false;
  category!: string
  sortBy = "dateResolved"


  changePage(page: number[]){
    this.pageIndex=page[0];
    this.pageSize = page[1];
    this.getPage();

  }

  changeSortBy(sortBy: string){
    this.ascending = !this.ascending;
    this.sortBy = sortBy;
    this.getPage();
  }

  refresh(event: any){
    this.getPage();
  }

  getPage(){
      this.reportService.getByCategory(this.pageIndex,this.pageSize,this.category,undefined,true,this.ascending,this.sortBy).subscribe({
        next: value => {
          this.reports = value.content;
          this.allReports = value.totalElements;
        }
      })
  }

  ngOnInit() {
    this.getPage();
  }

}
