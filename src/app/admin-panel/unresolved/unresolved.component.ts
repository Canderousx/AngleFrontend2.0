import {Component, OnInit} from '@angular/core';
import {ReportTableComponent} from "../report-table/report-table.component";
import {MaterialModule} from "../../../shared/modules/material/material.module";
import {NgIf} from "@angular/common";
import {Report} from "../../../shared/models/report";
import {ReportService} from '../../../shared/services/report.service';

@Component({
  selector: 'app-unresolved',
  standalone: true,
  imports: [
    ReportTableComponent,
    MaterialModule,
    NgIf,
  ],
  templateUrl: './unresolved.component.html',
  styleUrl: './unresolved.component.css'
})
export class UnresolvedComponent implements OnInit{

  constructor(private reportService: ReportService,
              ) {
  }
  reports!: Report[];
  pageSize = 10;
  allReports!: number;
  pageIndex = 0;
  category!: string
  ascending = false;
  sortBy = 'datePublished';

  changePage(page: number[]){
    this.pageIndex=page[0];
    this.pageSize = page[1];
    this.getPage();

  }
  changeSortBy(sortBy: string){
    this.sortBy = sortBy;
    this.ascending = !this.ascending;
    this.getPage();
  }

  refresh(event: any){
    this.getPage();
  }

  getPage(){
    this.reportService.getUnresolved(this.pageIndex,this.pageSize,this.category,this.ascending,this.sortBy).subscribe({
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
