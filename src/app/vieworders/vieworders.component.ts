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
  allorders: any = null;
  masterorders: any = null;
  selectedorderconsignees: any = null;
  selectedorder: any = null;
  spinnerflag: any = null;
  dispatchbatches: any = false;
  dispatchdetails: any = null;
  viewdispatcheddate: any = null;
  monthlabel: string = "Full year";
  fromdt: any = null;
  todt: any = null;
  customfrom: any = null;
  customto: any = null;

  errorMsg: any = false;
  totalquantity: any = 0;
  selectedstatus: any = "all";
  @ViewChild('salespayhistory', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;

  constructor(
    private _rest: RESTService,
    private _global: GlobalService,
    private _interval: IntervalService,
    private resolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    let finanyr = this._global.getCurrentFinancialYear();
    this.getOrdersFromToDate(finanyr.fromdt, finanyr.todt);
  }

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
          this.allorders = Response["data"];
          this.masterorders = JSON.parse(JSON.stringify(this.allorders));

          for (let j=0; j<this.allorders.length;j++) {
            if(this.allorders[j].status == 'cancelled'){
              this.allorders.splice(j,1);
              j--;
            }
          }

          let totqty = 0;
          for (const i in this.allorders) {
            totqty += parseFloat(this.allorders[i].quantity);
          }

          this.totalquantity = totqty;
        }
      });
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
      
      if(orderstatus == "all"){
        for (let j=0; j<this.allorders.length;j++) {
          if(this.allorders[j].status == 'cancelled'){
            console.log(this.allorders)
            this.allorders.splice(j,1);
            j--;
          }
        }
      }

      for (let i = 0; i < this.allorders.length; i++) {
        totqty += parseFloat(this.allorders[i].quantity);
      }
    }
    this.totalquantity = totqty;
  }

  autofillfromdt() {
    this.fromdt = this._global.getAutofillFormattedDt(this.fromdt);
  }

  autofilltodt() {
    this.todt = this._global.getAutofillFormattedDt(this.todt);
  }

  filterData() {
    this.selectedstatus = "all";
    let myfromdate = moment(this.fromdt, "DD-MM-YYYY").format("MM-DD-YYYY");
    let fromtm = new Date(myfromdate).getTime();
    this.customfrom = fromtm;
    let mytodate = moment(this.todt, "DD-MM-YYYY").format("MM-DD-YYYY");
    let totm = new Date(mytodate).getTime();
    this.customto = totm;
    this.getOrdersFromToDate(fromtm, totm);
  }
}