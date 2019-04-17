import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { GlobalService } from "./global.service";

@Injectable({
  providedIn: "root"
})
export class RESTService {
  constructor(private _http: HttpClient, private vars: GlobalService) {}

  getData(file: string, action: string, urldata: any) {
    if (urldata) {
      return this._http.get(
        this.vars.serverpath + file + "?action=" + action + "&" + urldata
      );
    } else {
      return this._http.get(this.vars.serverpath + file + "?action=" + action);
    }
  }

  postData(file: string, action: string, dataobj: any, urldata: any) {
    if (urldata) {
      return this._http.post(
        this.vars.serverpath +
          file +
          "?action=" +
          action +
          "&urldata=" +
          urldata,
        dataobj
      );
    } else {
      return this._http.post(
        this.vars.serverpath + file + "?action=" + action,
        dataobj
      );
    }
  }
}
