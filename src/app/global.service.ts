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
      todt = moment(todt.getFullYear() + 1 + "-03-31 23:59");
      //console.log(fromdt.unix() * 1000, todt.getTime());
      return {
        fromdt: fromdt.unix() * 1000,
        todt: todt.unix() * 1000
      };
    } else {
      //2018-2019
      let fromdt: any = new Date(),
        todt: any = new Date();
      fromdt = moment(fromdt.getFullYear() - 1 + "-04-01 00:00");
      todt = moment(todt.getFullYear() + "-03-31 23:59");
      //console.log(fromdt.unix() * 1000, todt.getTime());
      return {
        fromdt: fromdt.unix() * 1000,
        todt: todt.unix() * 1000
      };
    }
  }

  /**
   * Pass milliseconds from 1 April to 31 March of year and it will return financial year
   */
  getSpecificFinancialYear(ms: any = new Date()) {
    let dt = new Date(ms);
    if (dt.getMonth() > 2) {
      //2019-2020
      let fromdt: any = new Date(ms),
        todt: any = new Date(ms);
      fromdt = moment(fromdt.getFullYear() + "-04-01 00:00");
      todt = moment(todt.getFullYear() + 1 + "-03-31 23:59");
      //console.log(fromdt.unix() * 1000, todt.getTime());
      return {
        fromdt: fromdt.unix() * 1000,
        todt: todt.unix() * 1000
      };
    } else {
      //2018-2019
      let fromdt: any = new Date(ms),
        todt: any = new Date(ms);
      fromdt = moment(fromdt.getFullYear() - 1 + "-04-01 00:00");
      todt = moment(todt.getFullYear() + "-03-31 23:59");
      //console.log(fromdt.unix() * 1000, todt.getTime());
      return {
        fromdt: fromdt.unix() * 1000,
        todt: todt.unix() * 1000
      };
    }
  }

  getAutofillFormattedDt(dt) {
    if (!dt) { return }
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

  /**
   * *****************************************************************************
   * Function for dynamic sorting
   * *****************************************************************************
   * Examples:
   *  1.sortArr('key');
   *  2.sortArr('key', 'desc');
   *  3.sortArr('key2');
   */
  sortArr(key, order = "asc") {
    return function (a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order == "desc" ? comparison * -1 : comparison;
    };
  }

  formatVehicalNo(vehicalno) {
    if (vehicalno)
      return vehicalno.replace(/[^A-Z0-9]/ig, "");
  }
}
