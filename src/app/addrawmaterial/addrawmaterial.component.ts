import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import { IntervalService } from "../interval.service";
import { GlobalService } from "../global.service";
import * as moment from "moment";

@Component({
  selector: "app-addrawmaterial",
  templateUrl: "./addrawmaterial.component.html",
  styleUrls: ["./addrawmaterial.component.css"]
})
export class AddrawmaterialComponent implements OnInit {
  successMsg: any = null;
  allrawmats: any = null;
  rawmatnm: string = null;
  selectedrawmat: any = null;
  openbal: string = "0";
  openbaldt: any = null;
  hsncode: string = null;
  editstockbal: any = null;
  openbalfound: boolean = false;

  constructor(
    private _rest: RESTService,
    private _interval: IntervalService,
    private _global: GlobalService
  ) {}

  ngOnInit() {
    this.getRawMaterials();
  }

  addRawMaterial() {
    if (isNaN(parseFloat(this.openbal))) {
      alert("Opening stock must be a number");
      return;
    }
    let rawmatObj = {
      name: this.rawmatnm,
      hsncode: this.hsncode
    };

    this._rest
      .postData("rawmaterial.php", "addRawMaterial", rawmatObj, null)
      .subscribe(Response => {
        console.log(Response);
        if (Response) {
          this.successMsg = "Raw Material Added Successfully";
          this.rawmatnm = null;
          this.getRawMaterials();

          let balDate = moment(this.openbaldt, "DD-MM-YYYY").format(
            "MM-DD-YYYY"
          );
          let objStock = {
            rawmatid: Response["data"],
            moddt: new Date().getTime(),
            openbal: this.openbal,
            openbaldt: new Date(balDate).getTime()
          };
          this._rest
            .postData("stock.php", "newRawMaterialInStock", objStock, null)
            .subscribe(RespStock => {
              console.log(RespStock);
              this.openbal = "0";
              this.hsncode = null;
              this.openbaldt = null;
            });

          this._interval
            .settimer(null)
            .then(Intver => (this.successMsg = false));
        }
      });
  }

  getRawMaterials() {
    this._rest
      .getData("rawmaterial.php", "getRawMaterials", null)
      .subscribe(Response => {
        if (Response) {
          this.allrawmats = Response["data"];
        }
      });
  }

  selectRawMaterial(mat) {
    this.openbalfound = false;
    this.selectedrawmat = Object.assign(mat, []);
    console.log(this.selectedrawmat);
    let finanyr = this._global.getCurrentFinancialYear();
    let rawmaturl =
      "rawmatid=" +
      this.selectedrawmat.rawmatid +
      "&fromdt=" +
      finanyr.fromdt +
      "&todt=" +
      finanyr.todt;
    this.editstockbal = null;
    this._rest
      .getData("stock.php", "getRawMatOpeningStock", rawmaturl)
      .subscribe(Response => {
        if (Response) {
          console.log(Response["data"]);
          if (Response["data"].quantity) {
            this.editstockbal = Response["data"];
          } else {
            this.editstockbal = { quantity: "0" };
          }
          this.openbalfound = true;
        } else {
          this.openbalfound = false;
          this.editstockbal = { quantity: "0" };
        }

        let dt = new Date();
        if (!this.openbalfound) {
          let geturl = "rawmatid=" + this.selectedrawmat.rawmatid;
          this._rest
            .getData("stock.php", "getRawMatStock", geturl)
            .subscribe(Respstk => {
              if (Respstk) {
                this.editstockbal.stockid = Respstk["data"].stockid;
                this.editstockbal.quantity = Respstk["data"].quantity;
              }
            });
          this.editstockbal.date = dt.getTime();
        }
        dt.setTime(parseInt(this.editstockbal.date));
        this.editstockbal.date = moment(
          parseInt(this.editstockbal.date)
        ).format("DD-MM-YYYY");
      });
  }

  updateRawMaterial() {
    this._rest
      .postData(
        "rawmaterial.php",
        "updateRawMaterial",
        this.selectedrawmat,
        null
      )
      .subscribe(
        Response => {
          if (Response) {
            let balDate = moment(this.editstockbal.date, "DD-MM-YYYY").format(
              "MM-DD-YYYY"
            );
            let uptstk = {
              stockid: this.editstockbal.stockid,
              quantity: this.editstockbal.quantity,
              stkdt: new Date().getTime(),
              openbaldt: new Date(balDate).getTime()
            };
            console.log(uptstk);
            this._rest
              .postData("stock.php", "updateOpeningStock", uptstk, null)
              .subscribe(Resp => {
                console.log(Resp);
                this.successMsg = "Raw Material Updated Successfully";
                this.rawmatnm = null;
                this.selectedrawmat = null;
                this.editstockbal = null;
                this._interval.settimer(null).then(Inter => {
                  this.successMsg = false;
                });
              });
          } else {
            alert(
              "There is some problem updating Product, Kindly try again later and if the issue persists please contact administrator"
            );
          }
        },
        error => {
          console.log(error);
          alert(
            "There is some problem updating Product, Kindly try again later and if the issue persists please contact administrator"
          );
        }
      );
  }

  autoFillOpendt() {
    if (!this.openbaldt) {
      return;
    }
    this.openbaldt = this._global.getAutofillFormattedDt(this.openbaldt);
  }
}
