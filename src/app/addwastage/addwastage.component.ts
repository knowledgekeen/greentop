import { Component, OnInit } from "@angular/core";
import { GlobalService } from "../global.service";
import { RESTService } from "../rest.service";
import * as moment from "moment";
import { IntervalService } from "../interval.service";

@Component({
  selector: "app-addwastage",
  templateUrl: "./addwastage.component.html",
  styleUrls: ["./addwastage.component.css"],
})
export class AddwastageComponent implements OnInit {
  rawmat: any = null;
  quantity: any = null;
  wastagedt: any = null;
  allrawmats: any = null;
  successmsg: any = null;
  allwastages: any = null;
  totalwaste: any = null;
  rawmatavailstk: any = null;
  finanyr: any = null;
  totalFinanyrs: any = null;

  constructor(
    private _global: GlobalService,
    private _rest: RESTService,
    private _interval: IntervalService
  ) {}

  ngOnInit() {
    this.finanyr = this._global.getCurrentFinancialYear();
    this.getAllFinancialYears();
    this.getWastageFromTo();
    this.getRawMaterials();
  }

  getAllFinancialYears() {
    this._rest.getData("sales_payments.php", "getAllFinancialYears").subscribe(
      (Response: any) => {
        // console.log(Response.data);
        this.totalFinanyrs = Response ? Response.data : null;
        for (let index in this.totalFinanyrs) {
          this.totalFinanyrs[index].finanyr =
            this._global.getSpecificFinancialYear(
              parseInt(this.totalFinanyrs[index].finanyr)
            );
        }
        // console.log(this.totalFinanyrs);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  changeFinancialyrs(finanyrs) {
    // console.log("change finanyrs", finanyrs);
    this.finanyr = this._global.getSpecificFinancialYear(
      parseInt(finanyrs.fromdt)
    );
    // console.log(this.finanyr);
    this.getWastageFromTo();
  }

  getRawMaterials() {
    this.allrawmats = null;
    this._rest
      .getData("rawmaterial.php", "getRawMaterials", null)
      .subscribe((Response) => {
        if (Response) {
          this.allrawmats = Response["data"];
        }
      });
  }

  autoFillDt() {
    if (!this.wastagedt) return;

    this.wastagedt = this._global.getAutofillFormattedDt(this.wastagedt);
  }

  addWastage() {
    let myDate = moment(this.wastagedt, "DD-MM-YYYY").format("MM-DD-YYYY");

    let tmpobj = {
      rawmatid: this.rawmat.split(".")[0],
      quantity: this.quantity,
      wastagedt: new Date(myDate).getTime(),
    };
    this._rest
      .postData("wastage.php", "addWastage", tmpobj)
      .subscribe((Response) => {
        if (Response) {
          this.successmsg = "Wastage added successfully";
          this._interval.settimer().then((Resp) => {
            this.successmsg = null;
            this.rawmat = null;
            this.quantity = null;
            this.wastagedt = null;
            this.rawmatavailstk = null;
            this.totalwaste = null;
            this.getWastageFromTo();
          });
        }
      });
  }

  getWastageFromTo() {
    let urldata =
      "fromdt=" + this.finanyr.fromdt + "&todt=" + this.finanyr.todt;
    let totalstk = {
      rawmat: 0,
      bags: 0,
    };
    this._rest
      .getData("wastage.php", "getWastageFromTo", urldata)
      .subscribe((Response) => {
        if (Response && Response["data"]) {
          //console.log(Response);
          this.allwastages = Response["data"];
          for (const i in this.allwastages) {
            if (this.allwastages[i].name.toLowerCase().indexOf("bag") > -1) {
              totalstk.bags += parseFloat(this.allwastages[i].quantity);
            } else {
              totalstk.rawmat += parseFloat(this.allwastages[i].quantity);
            }
          }
          //console.log(totalstk);
          this.totalwaste = totalstk;
        } else {
          this.totalwaste = null;
          this.allwastages = null;
        }
      });
  }

  getRawMatStock() {
    if (!this.rawmat) {
      this.rawmatavailstk = null;
      return;
    }
    let geturl = "rawmatid=" + this.rawmat.split(".")[0];
    this._rest
      .getData("stock.php", "getRawMatStock", geturl)
      .subscribe((Response) => {
        console.log(Response);
        if (Response) {
          this.rawmatavailstk = Response["data"];
        }
      });
  }

  // This method is not in use as deleting a wastage will effect in stock
  deleteWastage(waste) {
    console.log(waste);
    this.successmsg = null;
    let geturl = "wastageid=" + waste.wastageid;
    this._rest
      .getData("wastage.php", "deleteWastage", geturl)
      .subscribe((Response) => {
        if (Response) {
          this.successmsg = "Wastage deleted successfully";
          this.getWastageFromTo();
          this._interval.settimer().then((Resp) => {
            this.successmsg = null;
          });
        }
      });
  }
}
