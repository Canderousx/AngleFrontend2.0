import {Component, OnInit} from '@angular/core';
import {Report} from "../../../shared/models/report";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {ReportTableComponent} from "../report-table/report-table.component";
import {ReportService} from "../../../shared/services/report.service";

@Component({
  selector: 'app-own-cases',
  standalone: true,
  imports: [
    ReportTableComponent
  ],
  templateUrl: './own-cases.component.html',
  styleUrl: './own-cases.component.css'
})
export class OwnCasesComponent implements OnInit{

  constructor(private reportService: ReportService) {
  }

  reports!: Report[];
  pageSize = 10;
  allReports!: number;
  pageIndex = 0;
  ascending = false;
  sortBy = "dateResolved"

  changePage(page: number[]){
    this.pageIndex=page[0];
    this.pageSize = page[1];
    this.getPage();

  }

  changeSortOrder(sortBy: string){
    this.sortBy = sortBy;
    this.ascending = !this.ascending;
    this.getPage();
  }

  refresh(event: any){
    this.getPage();
  }

  getPage(){
      this.reportService.getMyCases(this.pageIndex,this.pageSize,this.ascending).subscribe({
        next: value => {
          this.allReports = value.totalElements
          this.reports = value.content;
        }
      })
  }

  ngOnInit() {
    this.getPage();
  }

}
