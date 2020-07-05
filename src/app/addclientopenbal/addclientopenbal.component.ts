import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RESTService } from "../rest.service";
import { GlobalService } from "../global.service";
import * as moment from "moment";
import { IntervalService } from "../interval.service";

@Component({
  selector: "app-addclientopenbal",
  templateUrl: "./addclientopenbal.component.html",
  styleUrls: ["./addclientopenbal.component.css"]
})
export class AddclientopenbalComponent implements OnInit {
  ctype: any = null;
  allclients: any = null;
  ctypenm: string = null;
  client: string = null;
  openbaldata: any = null;
  openbal: string = null;
  openbaldt: string = null;
  successmsg: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _rest: RESTService,
    private _global: GlobalService,
    private _interval: IntervalService
  ) {}

  ngOnInit() {
    this._route.params.subscribe(Response => {
      if (Response) {
        if (Response["ctype"]) {
          this.ctype = Response["ctype"];

          if (this.ctype == "1") {
            this.ctypenm = "Supplier";
          } else {
            this.ctypenm = "Customer";
          }

          this.getAllClients();
          let finanyr = this._global.getCurrentFinancialYear();

          let myDate = moment(finanyr.fromdt).format("DD-MM-YYYY");
          this.openbaldt = myDate;
        }
      }
    });
  }

  getAllClients() {
    let urldata = "clienttype=" + this.ctype;
    this._rest
      .getData("client.php", "getAllClients", urldata)
      .subscribe(Response => {
        if (Response) {
          this.allclients = Response["data"];
        }
      });
  }

  getClientOpenBal() {
    let finanyr = this._global.getCurrentFinancialYear();
    let dt = new Date();
    dt.setFullYear(dt.getFullYear() - 1);

    let prevyr = this._global.getSpecificFinancialYear(dt.getTime());
    let geturl =
      "fromdt=" +
      finanyr.fromdt +
      "&todt=" +
      finanyr.todt +
      "&clientid=" +
      this.client.split(".")[0] +
      "&prevfromdt=" +
      prevyr.fromdt +
      "&prevtodt=" +
      prevyr.todt;
    //console.log(geturl);
    if (this.ctype == "1") {
      this._rest
        .getData("client.php", "getClientPurchaseOpeningBal", geturl)
        .subscribe(Response => {
          //console.log(Response);
          if (Response) {
            this.openbal = Response["data"].openingbal;
            let myDate = moment(parseInt(Response["data"].baldate)).format(
              "DD-MM-YYYY"
            );
            this.openbaldt = myDate;
            this.openbaldata = Response["data"];
          }
        });
    } else {
      this._rest
        .getData("client.php", "getClientSaleOpeningBal", geturl)
        .subscribe(Response => {
          //console.log(Response);
          if (Response) {
            this.openbal = Response["data"].openingbal;
            this.openbaldata = Response["data"];
            let myDate = moment(parseInt(Response["data"].baldate)).format(
              "DD-MM-YYYY"
            );
            this.openbaldt = myDate;
          }
        });
    }
  }

  autoFillDt() {
    if (!this.openbaldt) return;
    this.openbaldt = this._global.getAutofillFormattedDt(this.openbaldt);
  }

  updateClientOpeningBalance() {
    let myDate = moment(this.openbaldt, "DD-MM-YYYY").format("MM-DD-YYYY");
    let cldata = {
      openbalid: this.openbaldata.openbalid,
      clientid: this.client.split(".")[0],
      openbal: this.openbal,
      baldate: new Date(myDate).getTime()
    };
    this._rest
      .postData("client.php", "updateClientOpeningBalance", cldata)
      .subscribe(Response => {
        if (Response) {
            this.successmsg = true;
            this.client = null;
            this.openbal = "0";
            this.openbaldt = null;
            this._interval.settimer().then(Resp => {
              this.successmsg = false;
            });
        }
      });
    //console.log(cldata);
  }
}
