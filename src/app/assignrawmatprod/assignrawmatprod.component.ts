import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import { IntervalService } from "../interval.service";
import * as moment from "moment";
import { GlobalService } from '../global.service';

@Component({
  selector: "app-assignrawmatprod",
  templateUrl: "./assignrawmatprod.component.html",
  styleUrls: ["./assignrawmatprod.component.css"]
})
export class AssignrawmatprodComponent implements OnInit {
  allratmats: any;
  allproducts: any;
  product: any;
  rawmat: any;
  defqty: any;
  moddate: any;
  rawmatnm: any;
  editqtyrem: any = false;
  successMsg: any = false;
  selected_prod: any = null;
  prod_rawmats: any = [];
  productadded: boolean = false;
  spinner: boolean = true;
  disablesubmitbtn: boolean = false;
  disableeditsubmitbtn: boolean = false;
  assignhistdata: any = null;

  constructor(private _rest: RESTService, private _interval: IntervalService, private _global: GlobalService) { }

  ngOnInit() {
    this.moddate = moment(new Date()).format("DD-MM-YYYY");
    this.getActiveProducts();
    this.getRawMaterials();
  }

  getRawMaterials() {
    this._rest
      .getData("rawmaterial.php", "getRawMaterials", null)
      .subscribe(Response => {
        if (Response) {
          this.allratmats = Response["data"];
        }
      });
  }

  getActiveProducts() {
    this._rest
      .getData("product.php", "getActiveProducts", null)
      .subscribe(Response => {
        if (Response) {
          this.allproducts = Response["data"];
        }
      });
  }

  getAllProdRawmats() {
    //this.selected_prod = this.product;
    this.prod_rawmats = null;

    this.allproducts.filter(Resp => {
      if (Resp.prodid == this.product) {
        this.selected_prod = Resp;
      }
    });

    if (this.selected_prod) {
      let urldata = "prodid=" + this.selected_prod.prodid;
      this._rest
        .getData("production.php", "getAllProdRawmats", urldata)
        .subscribe(Response => {
          //console.log(Response);
          if (Response) {
            this.prod_rawmats = Response["data"];
          }
        });
    }
  }

  addProdRawMaterial() {
    this.disablesubmitbtn = true;
    let myDate = moment(this.moddate, "DD-MM-YYYY").format("MM-DD-YYYY");
    let tmpObj = {
      prodid: this.selected_prod.prodid,
      rawmatid: this.rawmat,
      defqty: this.defqty,
      moddate: new Date(myDate).getTime()
    };

    let flag = false;
    for (let i in this.prod_rawmats) {
      if (this.rawmat == this.prod_rawmats[i].rawmatid) {
        flag = true;
        break;
      }
    }

    if (flag == false) {
      this._rest
        .postData("production.php", "addProdRawMaterial", tmpObj, null)
        .subscribe(Response => {
          if (Response) {
            this.disablesubmitbtn = false;
            this.successMsg = "Raw material assigned successfully";
            let prod = this.product;
            this.product = null;
            this.selected_prod = null;
            this.rawmat = null;
            this.defqty = null;
            this._interval.settimer(100).then(Response => {
              this.product = prod;
              this.getAllProdRawmats();
            });
            this._interval.settimer().then(Response => {
              this.successMsg = null;
            });
          }
        });
    } else {
      console.log("Error, already added");
      this.productadded = true;
      this._interval.settimer(null).then(Response => {
        this.productadded = false;
      });
    }
  }

  editQuantityRem(rawmat) {
    this.editqtyrem = true;
    this.rawmatnm = rawmat.rawmatid + "." + rawmat.name;
    this.defqty = rawmat.defquantity;
    this.disableeditsubmitbtn = false;
    console.log(this.product, this.rawmat, this.defqty, this.disableeditsubmitbtn)
  }

  saveEditRawMaterial() {
    this.disableeditsubmitbtn = true;
    let myDate = moment(this.moddate, "DD-MM-YYYY").format("MM-DD-YYYY");
    let tmpObj = {
      prodid: this.selected_prod.prodid,
      rawmatid: this.rawmatnm.split(".")[0],
      defqty: this.defqty,
      moddate: new Date(myDate).getTime()
    };
    //console.log(tmpObj);
    this._rest
      .postData("production.php", "saveEditRawMaterial", tmpObj, null)
      .subscribe(Response => {
        if (Response) {
          this.disableeditsubmitbtn = false;
          this.successMsg = "Raw material quantity updated successfully";
          let prod = this.product;
          this.product = null;
          this.selected_prod = null;
          this.rawmat = null;
          this.defqty = null;
          this.rawmatnm = null;
          this.editqtyrem = false;
          this._interval.settimer(100).then(Resp => {
            this.product = prod;
            this.getAllProdRawmats();
          });
          this._interval.settimer().then(Response => {
            this.successMsg = null;
          });
        }
      });
  }

  deassignRawMaterial(rawmat) {
    let tmpObj = {
      prodrawid: rawmat.prodrawid,
      prodid: this.selected_prod.prodid,
      rawmatid: rawmat.rawmatid,
      defqty: 0,
      moddate: new Date().getTime()
    };
    this._rest
      .postData("production.php", "deassignRawMaterial", tmpObj)
      .subscribe(Response => {
        if (Response) {
          this.successMsg = "Raw material removed successfully";
          let prod = this.product;
          this.product = null;
          this.selected_prod = null;
          this.rawmat = null;
          this.defqty = null;
          this._interval.settimer(100).then(Resp => {
            this.product = prod;
            this.getAllProdRawmats();
          });
          this._interval.settimer().then(Response => {
            this.successMsg = null;
          });
        }
      });
  }

  changeDate() {
    this.moddate = this._global.getAutofillFormattedDt(this.moddate);
  }

  getRawMatAssignmentHist() {
    this.assignhistdata = null;
    this.spinner = true;
    let geturl = "prodid=" + this.selected_prod.prodid;
    this._rest
      .getData("production.php", "getRawMatAssignmentHist", geturl)
      .subscribe(Response => {
        if (Response) {
          this.spinner = false;
          this.assignhistdata = Response["data"];

          for (let i = 0; i < this.assignhistdata.length; i++) {
            for (let j = i + 1; j < this.assignhistdata.length; j++) {
              if (this.assignhistdata[i].rawmatid != this.assignhistdata[j].rawmatid) {
                this.assignhistdata[i].highlightrow = true;
                break;
              }
              else {
                this.assignhistdata[i].highlightrow = false;
                break;
              }
            }
          }

          this.assignhistdata[this.assignhistdata.length - 1].highlightrow = true;
          console.log(this.assignhistdata);
        }
      })
  }
}
