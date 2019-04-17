import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import { IntervalService } from "../interval.service";
import { GlobalService } from "../global.service";
import * as moment from "moment";

@Component({
  selector: "app-addproduct",
  templateUrl: "./addproduct.component.html",
  styleUrls: ["./addproduct.component.css"]
})
export class AddproductComponent implements OnInit {
  productnm: string = null;
  successMsg: boolean = false;
  openbal: string = "0";
  openbaldt: any = null;
  hsncode: string = null;

  constructor(
    private _rest: RESTService,
    private _interval: IntervalService,
    private _global: GlobalService
  ) {}

  ngOnInit() {}

  addProduct() {
    //console.log(this.productnm);
    if (isNaN(parseFloat(this.openbal))) {
      alert("Opening stock must be a number");
      return;
    }
    let tmpObj = {
      pname: this.productnm,
      hsncode: this.hsncode
    };
    this._rest
      .postData("product.php", "addProduct", tmpObj, null)
      .subscribe(Response => {
        if (Response) {
          this.successMsg = true;
          this.productnm = null;
          //console.log(Response);

          let balDate = moment(this.openbaldt, "DD-MM-YYYY").format(
            "MM-DD-YYYY"
          );
          let objStock = {
            prodid: Response["data"],
            moddt: new Date().getTime(),
            openbal: this.openbal,
            openbaldt: new Date(balDate).getTime()
          };

          this._rest
            .postData("stock.php", "newProductInStock", objStock, null)
            .subscribe(RespStock => {
              //console.log(RespStock);
              this.openbal = "0";
              this.hsncode = null;
              this.openbaldt = null;
            });

          this._interval.settimer(null).then(resp => {
            this.successMsg = false;
            this.getActiveProducts();
          });
        } else {
          alert("Product not added, Kindly contact system administrator");
        }
      });
  }

  getActiveProducts() {
    //this.allproducts = null;
    this._rest
      .getData("product.php", "getActiveProducts", null)
      .subscribe(Response => {
        //console.log(Response);
        if (Response) {
          this._global.updateData(Response["data"]);
        }
      });
  }

  autoFillDt() {
    if (!this.openbaldt) {
      return;
    }
    this.openbaldt = this._global.getAutofillFormattedDt(this.openbaldt);
  }
}
