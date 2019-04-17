import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import * as moment from "moment";

@Injectable({
  providedIn: "root"
})
export class GlobalService {
  serverpath: string = null;
  constructor() {
    if (window.location.hostname == "localhost") {
      if (window.location.port != "4200") {
        // For Xampp n All
        this.serverpath = "./assets/db/";
      } else {
        this.serverpath =
          "http://localhost/Projects/Assasa_Projects/greentop/src/assets/db/";
      }
    } else {
      this.serverpath = "./assets/db/";
    }
  }

  private master_active_products = new BehaviorSubject(false);
  active_prods = this.master_active_products.asObservable();

  private master_transport = new BehaviorSubject(false);
  active_transport = this.master_transport.asObservable();

  private master_trucks = new BehaviorSubject(false);
  active_trucks = this.master_trucks.asObservable();

  updateData(data: any) {
    this.master_active_products.next(data);
  }

  updateTransportData(data: any) {
    this.master_transport.next(data);
  }

  updateTrucksData(data: any) {
    this.master_trucks.next(data);
  }

  getCurrentFinancialYear() {
    let dt = new Date();
    //dt.getFullYear => Considering Current year is 2019
    if (dt.getMonth() > 2) {
      //2019-2020
      let fromdt: any = new Date(),
        todt: any = new Date();
      fromdt = moment(fromdt.getFullYear() + "-04-01 00:00");
      //console.log(fromdt.unix() * 1000, todt.getTime());
      return {
        fromdt: fromdt.unix() * 1000,
        todt: todt.getTime()
      };
    } else {
      //2018-2019
      let fromdt: any = new Date(),
        todt: any = new Date();
      fromdt = moment(fromdt.getFullYear() - 1 + "-04-01 00:00");
      //console.log(fromdt.unix() * 1000, todt.getTime());
      return {
        fromdt: fromdt.unix() * 1000,
        todt: todt.getTime()
      };
    }
  }

  getAutofillFormattedDt(dt) {
    let aridt = dt;
    let day = null;
    let mnth = null;
    let len = -1;
    if (aridt.split("/").length == 2) {
      len = 2;
      day =
        parseInt(aridt.split("/")[0]) < 10
          ? "0" + parseInt(aridt.split("/")[0])
          : parseInt(aridt.split("/")[0]);
      mnth =
        parseInt(aridt.split("/")[1]) < 10
          ? "0" + parseInt(aridt.split("/")[1])
          : parseInt(aridt.split("/")[1]);
    }

    if (aridt.split("-").length == 2) {
      len = 2;
      day =
        parseInt(aridt.split("-")[0]) < 10
          ? "0" + parseInt(aridt.split("-")[0])
          : parseInt(aridt.split("-")[0]);
      mnth =
        parseInt(aridt.split("-")[1]) < 10
          ? "0" + parseInt(aridt.split("-")[1])
          : parseInt(aridt.split("-")[1]);
    }
    if (len == 2) {
      let calcdt = new Date();
      let dtstr = day + "-" + mnth + "-" + calcdt.getFullYear();

      if (mnth <= 12) {
        calcdt.setMonth(parseInt(mnth) - 1);
        let lastdt = new Date(
          calcdt.getFullYear(),
          calcdt.getMonth() + 1,
          0
        ).getDate();

        if (day == 0 || mnth == 0) {
          return dt;
        }
        if (day <= lastdt) {
          return dtstr;
        } else {
          return dt;
        }
      } else {
        return dt;
      }
      //let lastdt = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getTime();
    } else {
      return dt;
    }
  }
}
