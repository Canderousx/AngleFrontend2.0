import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Report} from "../models/report";
import {environment} from "../../environments/environment.development";
import {serverResponse} from "../../app/app.component";
import {Page} from '../models/page';
import {ReportSolution} from '../models/reportSolution';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  backendUrl: string = environment.backendUrl+"/api/reports-manager";

  constructor(private http: HttpClient) { }

  getUnresolved(page: number, pageSize: number, category?: string,ascending?: boolean,sortBy?:string) {
    const params = new URLSearchParams;
    params.set('page',page.toString())
    params.set('pageSize',pageSize.toString())
    if(category){
      params.set('category',category)
    }
    if(ascending){
      params.set('ascending',String(ascending));
    }
    if(sortBy){
      params.set('sortBy',sortBy);
    }
    const url = `${this.backendUrl}/reports/getUnresolved?${params.toString()}`;
    return this.http.get<Page<Report>>(url);
  }

  getResolved(page: number, pageSize: number, category?: string, adminId?: string,ascending?: boolean,sortBy?:string) {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('pageSize', pageSize.toString());

    if (category) {
      params.set('category', category);
    }
    if (adminId) {
      params.set('adminId', adminId);
    }
    if(ascending){
      params.set('ascending',String(ascending));
    }
    if(sortBy){
      params.set('sortBy',sortBy);
    }
    const url = `${this.backendUrl}/reports/getResolved?${params.toString()}`;
    return this.http.get<Page<Report>>(url);
  }

  getByCategory(page: number, pageSize: number, category: string,adminId?: string,resolved?: boolean,ascending?: boolean,sortBy?:string) {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('pageSize', pageSize.toString());
    if (adminId) {
      params.set('adminId', adminId);
    }
    if(category){
      params.set('category', category);
    }
    if (resolved !== undefined) {
      params.set('solved',String(resolved))
    }
    if(ascending){
      params.set('ascending',String(ascending));
    }
    if(sortBy){
      params.set('sortBy',sortBy);
    }
    const url = `${this.backendUrl}/reports/getByCategory?${params.toString()}`;
    return this.http.get<Page<Report>>(url);
  }

  getByReportedId(page: number, pageSize: number, id:string, solution?:string,ascending?: boolean,sortBy?:string) {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('pageSize', pageSize.toString());
    params.set('id',id)
    if(solution){
      params.set('solution',solution);
    }
    if(ascending){
      params.set('ascending',String(ascending));
    }
    if(sortBy){
      params.set('sortBy',sortBy);
    }
    const url = `${this.backendUrl}/reports/getByReportedId?${params.toString()}`;
    return this.http.get<Page<Report>>(url);
  }

  getMyCases(page:number, pageSize:number,ascending?: boolean,sortBy?:string) {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('pageSize', pageSize.toString());
    if(ascending){
      params.set('ascending',String(ascending));
    }
    if(sortBy){
      params.set('sortBy',sortBy);
    }
    const url = `${this.backendUrl}/reports/getMyCases?${params.toString()}`;
    return this.http.get<Page<Report>>(url);
  }

  getCategories(){
    return this.http.get<string[]>(this.backendUrl+"/newReport/getCategories");
  }

  sendReport(reportData: Report){
    return this.http.post<serverResponse>(this.backendUrl+"/newReport",reportData)
  }

  solveReport(reportSolution: ReportSolution){
    return this.http.post<serverResponse>(this.backendUrl+"/admin/solveReport",reportSolution)
  }



}
