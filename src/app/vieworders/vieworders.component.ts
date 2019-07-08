import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from "@angular/core";
import { RESTService } from "../rest.service";
import { GlobalService } from "../global.service";
import { IntervalService } from "../interval.service";
import { SalespayhistoryComponent } from '../salespayhistory/salespayhistory.component';
import * as moment from "moment";

@Component({
  selector: "app-vieworders",
  templateUrl: "./vieworders.component.html",
  styleUrls: ["./vieworders.component.css"]
})
export class ViewordersComponent implements OnInit {
  selecteddate: any = new Date();
  opendtp: boolean = false;
  allorders: any = null;
  masterorders: any = null;
  selectedorderconsignees: any = null;
  selectedorder: any = null;
  spinnerflag: any = null;
  dispatchbatches: any = false;
  dispatchdetails: any = null;
  viewdispatcheddate: any = null;

  errorMsg: any = false;
  totalquantity: any = 0;
  selectedstatus: any = "all";
  @ViewChild('salespayhistory', { read: ViewContainerRef }) entry: ViewContainerRef;

  constructor(
    private _rest: RESTService,
    private _global: GlobalService,
    private _interval: IntervalService,
    private resolver: ComponentFactoryResolver
  ) { }

  ngOnInit() { }

  loadSalesPaymentHistory(customer) {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(SalespayhistoryComponent);
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.customer = customer;
  }

  openSaleHistoryModal(order) {
    this.loadSalesPaymentHistory(order.clientid + "." + order.name);
  }

  getOrdersFromToDate(fromdt, todt) {
    this.allorders = null;
    let geturl = "fromdt=" + fromdt + "&todt=" + todt;
    this._rest
      .getData("order.php", "getOrdersFromToDate", geturl)
      .subscribe(Response => {
        if (Response) {
          //console.log(Response)
          this.allorders = Response["data"];
          this.masterorders = JSON.parse(JSON.stringify(this.allorders));

          let totqty = 0;
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
    this.selectedstatus = "all";
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
        this.getOrdersFromToDate(fromdt, lastdt);
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
        this.getOrdersFromToDate(fromdt, lastdt);
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
    this.dispatchbatches = false;
    this.dispatchdetails = null;
    this.selectedorderconsignees = null;
    let geturl = "orderid=" + oid;
    this._rest
      .getData("order.php", "getOrderConsignees", geturl)
      .subscribe(Response => {
        //console.log(Response)
        if (Response) {
          this.selectedorderconsignees = Response["data"];

          if (this.selectedorder.status != "open") {
            this._rest.getData("dispatch.php", "getDispatchDetails", geturl)
              .subscribe(RespDisp => {
                //console.log(RespDisp)
                if (RespDisp) {
                  this.dispatchdetails = RespDisp["data"];
                  let mydate = moment(parseInt(this.dispatchdetails.dispatchdate)).format("DD-MM-YYYY");
                  this.viewdispatcheddate = mydate;
                  let dispurl = "dispatchid=" + this.dispatchdetails.dispatchid;
                  this._rest.getData("dispatch.php", "getDispatchBatches", dispurl)
                    .subscribe(Resp => {
                      //console.log(Resp)
                      if (Resp) {
                        this.dispatchbatches = Resp["data"];
                      }
                      else {
                        this.dispatchbatches = null;
                      }
                    });
                }
              })
          } else {
            this.dispatchbatches = null;
          }
        }
      });
  }

  filterOrders(orderstatus) {
    this.selectedstatus = orderstatus;
    this.allorders = JSON.parse(JSON.stringify(this.masterorders));
    if (orderstatus != "all" && this.allorders) {
      for (let i = 0; i < this.allorders.length; i++) {
        if (this.allorders[i].status != orderstatus) {
          this.allorders.splice(i, 1);
          i--;
        }
      }
    }

    let totqty = 0;
    if (this.allorders) {
      for (let i = 0; i < this.allorders.length; i++) {
        totqty += parseFloat(this.allorders[i].quantity);
      }
    }
    this.totalquantity = totqty;
  }
}