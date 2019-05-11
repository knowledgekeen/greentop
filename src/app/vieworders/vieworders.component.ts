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

  ngOnInit() {}

  getOpenOrdersFromToDate(fromdt, todt) {
    this.allorders = null;
    let geturl = "fromdt=" + fromdt + "&todt=" + todt;
    let totqty = 0;
    this._rest
      .getData("order.php", "getOpenOrdersFromToDate", geturl)
      .subscribe(Response => {
        if (Response) {
          this.allorders = Response["data"];

          for (const i in this.allorders) {
            totqty += parseFloat(this.allorders[i].quantity);
          }

          this.totalquantity = totqty;
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
        fromdt.setHours(0, 0, 0, 0);
        fromdt = fromdt.getTime();
        let todt = new Date();
        let lastdt = new Date(
          todt.getFullYear(),
          todt.getMonth() + 1,
          0
        ).getTime();

        //If month from future show details of current month
        this.getOpenOrdersFromToDate(fromdt, lastdt);
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
        let fromdate = new Date(parseInt(this.selecteddate.getTime()));
        fromdate.setDate(1);
        fromdate.setHours(0, 0, 0, 0);
        let fromdt = fromdate.getTime();
        let lastdt = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getTime();
        console.log(fromdt, lastdt);
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
          //console.log(Response);
          this.selectedorderconsignees = Response["data"];
        }
      });
  }
}
