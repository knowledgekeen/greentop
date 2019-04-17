import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import { IntervalService } from "../interval.service";

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
  rawmatnm: any;
  editqtyrem: any = false;
  successMsg: any = false;
  selected_prod: any = null;
  prod_rawmats: any = [];
  productadded: boolean = false;

  constructor(private _rest: RESTService, private _interval: IntervalService) {}

  ngOnInit() {
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
          console.log(Response);
          if (Response) {
            this.prod_rawmats = Response["data"];
          }
        });
    }
  }

  addProdRawMaterial() {
    let tmpObj = {
      prodid: this.selected_prod.prodid,
      rawmatid: this.rawmat,
      defqty: this.defqty
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
            this.successMsg = "Raw material assigned successfully";
            //this.getAllProdRawmats();
            this._interval.settimer(null).then(Response => {
              //console.log(Response);
              this.successMsg = null;
              this.product = null;
              this.selected_prod = null;
              this.rawmat = null;
              this.defqty = null;
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
  }

  saveEditRawMaterial() {
    let tmpObj = {
      prodid: this.selected_prod.prodid,
      rawmatid: this.rawmatnm.split(".")[0],
      defqty: this.defqty
    };
    console.log(tmpObj);
    this._rest
      .postData("production.php", "saveEditRawMaterial", tmpObj, null)
      .subscribe(Response => {
        if (Response) {
          this.successMsg = "Raw material quantity updated successfully";
          this._interval.settimer(null).then(Resp => {
            this.successMsg = null;
            this.product = null;
            this.selected_prod = null;
            this.rawmat = null;
            this.defqty = null;
            this.rawmatnm = null;
            this.editqtyrem = false;
          });
        }
      });
  }

  deassignRawMaterial(rawmat) {
    console.log(rawmat);
    let urlData = "prodrawid=" + rawmat.prodrawid;
    this._rest
      .getData("production.php", "deassignRawMaterial", urlData)
      .subscribe(Response => {
        if (Response) {
          this.successMsg = "Raw material removed successfully";
          this._interval.settimer(null).then(Resp => {
            this.successMsg = null;
            this.product = null;
            this.selected_prod = null;
            this.rawmat = null;
            this.defqty = null;
          });
        }
      });
  }
}
