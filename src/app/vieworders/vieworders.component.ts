import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import { GlobalService } from "../global.service";
import { IntervalService } from "../interval.service";

@Component({
  selector: "app-vieworders",
  templateUrl: "./vieworders.component.html",
  styleUrls: ["./vieworders.component.css"]
})
export class ViewordersComponent implements OnInit {
  selecteddate: any = new Date();
  opendtp: boolean = false;
  allorders: any = null;
  selectedorderconsignees: any = null;
  selectedorder: any = null;
  errorMsg: any = false;
  totalquantity: any = 0;

  constructor(
    private _rest: RESTService,
    private _global: GlobalService,
    private _interval: IntervalService
  ) {}

  ngOnInit() {
    let fromdt = new Date();
    let todt = new Date();
    fromdt.setDate(1);
    fromdt.setHours(0, 0, 0, 0);
    let lastday: any = new Date(
      todt.getFullYear(),
      todt.getMonth() + 1,
      0
    ).getDate();
    todt.setDate(lastday);
    todt.setHours(23, 59, 59, 999);

    this.getOpenOrdersFromToDate(fromdt.getTime(), todt.getTime());
  }

  getOpenOrdersFromToDate(fromdt, todt) {
    this.allorders = null;
    this.totalquantity = 0;
    let geturl = "fromdt=" + fromdt + "&todt=" + todt;
    this._rest
      .getData("order.php", "getOpenOrdersFromToDate", geturl)
      .subscribe(Response => {
        if (Response) {
          this.allorders = Response["data"];

          for (const i in this.allorders) {
            this.totalquantity += parseFloat(this.allorders[i].quantity);
          }
        }
      });
  }

  toggleDTP() {
    this.opendtp = !this.opendtp;
  }

  changeDate() {
    if (this.selecteddate) {
      //console.log(this.selecteddate.getTime());
      let todaydt = new Date().getTime();
      if (this.selecteddate.getTime() > todaydt) {
        let fromdt: any = new Date();
        fromdt.setDate(1);
        fromdt = fromdt.getTime();
        let todt = new Date().getTime();
        //If month from future show details of current month
        this.getOpenOrdersFromToDate(fromdt, todt);
        this.errorMsg = "Month cannot be from future.";
        this.selecteddate.setTime(todaydt);
        this.opendtp = !this.opendtp;
        this._interval.settimer(null).then(Resp => {
          this.errorMsg = false;
        });
        return;
      } else {
        let dt = new Date();
        dt.setTime(this.selecteddate);
        let fromdt = this.selecteddate.getTime();
        let lastdt = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getTime();
        //console.log(fromdt, lastdt);
        this.getOpenOrdersFromToDate(fromdt, lastdt);
        this.opendtp = !this.opendtp;
        return;
      }
    }
  }

  selectOrder(order) {
    this.selectedorder = order;
    this.getOrderConsignees(order.orderid);
  }

  getOrderConsignees(oid) {
    let geturl = "orderid=" + oid;
    this._rest
      .getData("order.php", "getOrderConsignees", geturl)
      .subscribe(Response => {
        if (Response) {
          console.log(Response);
          this.selectedorderconsignees = Response["data"];
        }
      });
  }
}
