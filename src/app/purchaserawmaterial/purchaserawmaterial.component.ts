import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import { IntervalService } from "../interval.service";
import * as moment from "moment";
import { GlobalService } from "../global.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-purchaserawmaterial",
  templateUrl: "./purchaserawmaterial.component.html",
  styleUrls: ["./purchaserawmaterial.component.css"]
})
export class PurchaserawmaterialComponent implements OnInit {
  allrawmats: any = null;
  allsuppliers: any = null;
  alltrucks: any = null;
  qty: any = null;
  totalamt: any = 0;
  totaldiscount: any = 0;
  totalnetamount: any = 0;
  rate: any = 0;
  amount: any = 0;
  netamount: any = 0;
  cgst: any = 0;
  sgst: any = 0;
  igst: any = 0;
  roundoff: any = 0;
  cgstinr: any = null;
  sgstinr: any = null;
  igstinr: any = null;
  discount: any = 0;
  rawmattotalamt: any = 0;
  totalsuppamount: any = 0;
  product: string = null;
  supplier: string = null;
  vehicalno: string = null;
  dcno: string = null;
  billdt: string = null;
  arrivaldt: string = null;
  billno: string = null;
  product_mismatch_err: any = false;
  client_mismatch_err: any = false;
  successMsg: any = false;
  added_materials: any = [];
  autocalc: boolean = true;
  purcmastid: any = false;
  showaddmaterial: boolean = true;
  editpurchasedata: any = null;

  constructor(
    private _rest: RESTService,
    private _interval: IntervalService,
    private _global: GlobalService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit() {
    this.getRawMaterials();
    this.getAllSuppliers();
    this.getAllTrucks();
    //Check Routing Params and call edit code is moved in getRawMaterials method as there is a dependancy for raw materials.
  }

  getRawMaterials() {
    this._rest
      .getData("rawmaterial.php", "getRawMaterials", null)
      .subscribe(Response => {
        if (Response) {
          this.allrawmats = Response["data"];
          this._route.params.subscribe(Resp => {
            if (Resp) {
              if (Resp.purcmastid != 0) {
                this.purcmastid = Resp.purcmastid;
                this.getPurchaseDetails();
              }
            }
          });
        }
      });
  }

  getAllTrucks() {
    this._rest
      .getData("transport.php", "getAllTrucks", null)
      .subscribe(Response => {
        if (Response) {
          this.alltrucks = Response["data"];
        }
      });
  }

  getAllSuppliers() {
    let suppdata = "clienttype=1";
    this._rest
      .getData("client.php", "getAllClients", suppdata)
      .subscribe(Response => {
        if (Response) {
          this.allsuppliers = Response["data"];
          //console.log(this.allsuppliers);
        }
      });
  }

  checkProduct() {
    if (this.product_mismatch_err == null) {
      return;
    }
    if (this.product) {
      let flag = false;
      for (let i in this.allrawmats) {
        let str = this.allrawmats[i].rawmatid + "." + this.allrawmats[i].name;
        if (this.product == str) {
          flag = true;
          break;
        }
      }

      if (flag == true) {
        this.product_mismatch_err = false;
      } else {
        this.product_mismatch_err = true;
      }
    }
  }

  checkClient() {
    if (this.client_mismatch_err == null) {
      return;
    }
    if (this.supplier) {
      let flag = false;
      for (let i in this.allsuppliers) {
        let str =
          this.allsuppliers[i].clientid + "." + this.allsuppliers[i].name;
        if (this.supplier == str) {
          flag = true;
          break;
        }
      }

      if (flag == true) {
        this.client_mismatch_err = false;
      } else {
        this.client_mismatch_err = true;
      }
    }
  }

  purchaseRawMaterial() {
    let myDate = moment(this.billdt, "DD-MM-YYYY").format("MM-DD-YYYY");
    let ariDate = moment(this.arrivaldt, "DD-MM-YYYY").format("MM-DD-YYYY");

    let rawObj = {
      arrivaldt: new Date(ariDate).getTime(),
      billdt: new Date(myDate).getTime(),
      clientid: this.supplier.split(".")[0],
      vehicalno: this.vehicalno,
      dcno: this.dcno,
      billno: this.billno,
      totaldiscount: this.totaldiscount,
      totalamt: this.totalsuppamount,
      addedmaterials: this.added_materials
    };

    let stkObj = {
      billdt: new Date(myDate).getTime(),
      addedmaterials: this.added_materials,
      remark: "Purchase Raw Material"
    };

    //console.log(rawObj, stkObj);
    /**
     * Before Purchase check if there is any opening balance available for current financial year.
     */
    let finanyr = this._global.getCurrentFinancialYear();
    let geturl =
      "rawmatid=" +
      this.added_materials[0].rawmatid +
      "&fromdt=" +
      finanyr.fromdt +
      "&todt=" +
      finanyr.todt;
    this._rest
      .getData("stock.php", "checkRawMatOpenStockForCrntFinanYear", geturl)
      .subscribe(Resp => {
        if (!Resp) {
          //There is no opening bal for current year, so get latest stock for raw material
          let newgeturl = "rawmatid=" + this.added_materials[0].rawmatid;
          this._rest
            .getData("stock.php", "getRawMatStock", newgeturl)
            .subscribe(RespStk => {
              console.log(RespStk);
              if (RespStk) {
                //Once stock value fetched update Opening Stock for Raw Material
                let postobj = {
                  stockid: RespStk["data"].stockid,
                  quantity: RespStk["data"].quantity,
                  stkdt: new Date().getTime(),
                  openbaldt: new Date().getTime()
                };
                this._rest
                  .postData("stock.php", "updateOpeningStock", postobj, null)
                  .subscribe(RespOpenBal => {
                    console.log(RespOpenBal);
                  });
              }
            });
        }

        //Irrespective Opening stock available or not, create purchase request. both requests will work simultaneously
        this._rest
          .postData("rawmaterial.php", "purchaseRawMaterial", rawObj, null)
          .subscribe(Response => {
            if (Response) {
              this._rest
                .postData("stock.php", "updateStockRawMaterial", stkObj, null)
                .subscribe(RespStk => {
                  if (RespStk) {
                    //console.log(RespStk);
                    window.scrollTo(0, 0);
                    this.successMsg = "Raw Material Purchased Successfully";
                    this._interval.settimer(null).then(Resp => {
                      this.successMsg = false;
                      window.location.reload();
                    });
                  }
                });
            }
          });
      });
  }

  addRawMaterial() {
    let qty = this.qty;
    let amount = parseFloat(this.qty) * parseFloat(this.rate);
    let discount = parseFloat(this.discount);
    let netamt = amount - discount;
    let cgst = (this.cgstinr =
      this.cgst == "0" ? 0 : (parseFloat(this.cgst) / 100) * netamt);
    let sgst = (this.sgstinr =
      this.sgst == "0" ? 0 : (parseFloat(this.sgst) / 100) * netamt);
    let igst = (this.igstinr =
      this.igst == "0" ? 0 : (parseFloat(this.igst) / 100) * netamt);
    let rawtotalamt = netamt + cgst + sgst + igst + parseFloat(this.roundoff);
    let totalgst =
      parseFloat(this.cgst) + parseFloat(this.sgst) + parseFloat(this.igst);

    let tmpObj = {
      rawmatid: this.product.split(".")[0],
      rawmatnm: this.product.split(".")[1],
      qty: qty,
      rate: this.rate,
      cgstinr: cgst,
      sgstinr: sgst,
      igstinr: igst,
      cgst: this.cgst,
      sgst: this.sgst,
      igst: this.igst,
      totalgst: totalgst,
      amount: amount,
      roundoff: this.roundoff,
      netamt: netamt,
      rawtotalamt: rawtotalamt,
      discount: discount
    };

    this.added_materials.push(tmpObj);
    this.totalamt = parseFloat(this.totalamt) + amount;
    this.totalnetamount = parseFloat(this.totalnetamount) + netamt;
    this.totaldiscount = parseFloat(this.totaldiscount) + discount;
    this.totalsuppamount = parseFloat(this.totalsuppamount) + rawtotalamt;
    this.product = null;
    this.qty = null;
    this.cgst = 0;
    this.sgst = 0;
    this.igst = 0;
    this.rate = 0;
    this.discount = 0;
    this.netamount = 0;
    this.amount = 0;
    this.netamount = 0;
    this.rawmattotalamt = 0;
    this.cgstinr = this.sgstinr = this.igstinr = null;
    this.showaddmaterial = false;
  }

  calculateAmt() {
    if (!this.autocalc) {
      return false;
    }
    let qty = this.qty;
    let amount = parseFloat(this.qty) * parseFloat(this.rate);
    let discount = parseFloat(this.discount);
    let netamt = amount - discount;
    let cgst = (this.cgstinr =
      this.cgst == "0" ? 0 : (parseFloat(this.cgst) / 100) * netamt);
    let sgst = (this.sgstinr =
      this.sgst == "0" ? 0 : (parseFloat(this.sgst) / 100) * netamt);
    let igst = (this.igstinr =
      this.igst == "0" ? 0 : (parseFloat(this.igst) / 100) * netamt);
    let rawtotalamt = netamt + cgst + sgst + igst + parseFloat(this.roundoff);
    //console.log(rawtotalamt, netamt, cgst, sgst, igst);
    if (this.cgst && !this.sgst) {
      this.sgst = this.cgst;
      this.sgstinr = this.cgstinr;
      rawtotalamt += parseFloat(this.sgstinr);
    }
    if (this.sgst && !this.cgst) {
      this.cgst = this.sgst;
      this.cgstinr = this.sgstinr;
      rawtotalamt += parseFloat(this.cgstinr);
    }
    if (qty) {
      this.amount = amount;
      this.netamount = netamt;
      this.rawmattotalamt = rawtotalamt;
    }
  }

  autoFillArivDt() {
    if (!this.arrivaldt) {
      return;
    }
    this.arrivaldt = this._global.getAutofillFormattedDt(this.arrivaldt);
  }

  autoFillBillDt() {
    if (!this.billdt) {
      return;
    }

    this.billdt = this._global.getAutofillFormattedDt(this.billdt);
  }

  editAddedMaterial(mat, index) {
    //console.log(mat, index);
    this.totalsuppamount -= parseFloat(mat.rawtotalamt);
    this.totalnetamount -= parseFloat(mat.netamt);
    this.totaldiscount -= parseFloat(mat.discount);
    this.totalamt -= parseFloat(mat.rate) * parseFloat(mat.qty);
    this.product = mat.rawmatid + "." + mat.rawmatnm;
    this.qty = mat.qty;
    this.rate = mat.rate;
    this.amount = mat.amount;
    this.discount = mat.discount;
    this.netamount = mat.netamt;
    this.cgst = mat.cgst;
    this.sgst = mat.sgst;
    this.igst = mat.igst;
    this.rawmattotalamt = mat.rawtotalamt;
    this.roundoff = mat.roundoff;
    this.added_materials.splice(index, 1);
    this.showaddmaterial = true;
  } //close editAddedMaterial

  getPurchaseDetails() {
    //console.log("purcmastid", this.purcmastid);
    let geturl = "purcmastid=" + this.purcmastid;
    this._rest
      .getData("rawmaterial.php", "getPurchaseDetails", geturl)
      .subscribe(Response => {
        //console.log(Response["data"][0]);
        if (Response) {
          this.reenterPurchaseDetails(Response["data"][0]);
        }
      });
  }

  reenterPurchaseDetails(data) {
    this.editpurchasedata = data;
    this.arrivaldt = moment(parseInt(data.arrivaldt)).format("DD-MM-YYYY");
    this.billdt = moment(parseInt(data.billdt)).format("DD-MM-YYYY");
    this.dcno = data.dcno;
    this.billno = data.billno;
    this.vehicalno = data.vehicalno;
    this.supplier = data.clientid + "." + data.name;
    this.totaldiscount = data.totaldiscount;
    this.totalamt = 0;
    this.amount = data.amount;
    this.totalnetamount = 0;
    this.netamount = parseFloat(data.amount) - parseFloat(data.totaldiscount);
    this.cgst = data.cgst;
    this.sgst = data.sgst;
    this.igst = data.igst;
    this.roundoff = data.roundoff;

    let cgst = (this.cgstinr =
      this.cgst == "0"
        ? 0
        : (parseFloat(this.cgst) / 100) * parseFloat(this.netamount));
    let sgst = (this.sgstinr =
      this.sgst == "0"
        ? 0
        : (parseFloat(this.sgst) / 100) * parseFloat(this.netamount));
    let igst = (this.igstinr =
      this.igst == "0"
        ? 0
        : (parseFloat(this.igst) / 100) * parseFloat(this.netamount));
    let rawtotalamt =
      parseFloat(this.netamount) +
      cgst +
      sgst +
      igst +
      parseFloat(this.roundoff);
    this.rawmattotalamt = rawtotalamt;
    this.totalsuppamount = 0;
    this.qty = data.quantity;
    this.rate = data.rate;
    this.discount = data.discount;

    //get Raw Mat
    let rawmatstr = null;
    //console.log(this.allrawmats);
    for (let i in this.allrawmats) {
      if (data.rawmatid == this.allrawmats[i].rawmatid) {
        rawmatstr = data.rawmatid + "." + this.allrawmats[i].name;
        break;
      }
    }
    this.product = rawmatstr;
    //this.calculateAmt();
  }

  cancelEditing() {
    this._router.navigate(["/viewpurchases"]);
  }

  updatePurchasesRawMaterial() {
    //Update code to write yet
    let myDate = moment(this.billdt, "DD-MM-YYYY").format("MM-DD-YYYY");
    let ariDate = moment(this.arrivaldt, "DD-MM-YYYY").format("MM-DD-YYYY");

    let rawObj = {
      purcmastid: this.purcmastid,
      arrivaldt: new Date(ariDate).getTime(),
      billdt: new Date(myDate).getTime(),
      clientid: this.supplier.split(".")[0],
      vehicalno: this.vehicalno,
      dcno: this.dcno,
      billno: this.billno,
      totaldiscount: this.totaldiscount,
      totalamt: this.totalsuppamount,
      addedmaterials: this.added_materials
    };

    let tmpaddedrawmat = JSON.parse(JSON.stringify(this.added_materials));
    tmpaddedrawmat[0].qty -= parseFloat(this.editpurchasedata.quantity);
    let stkObj = {
      billdt: new Date(myDate).getTime(),
      addedmaterials: tmpaddedrawmat,
      remark: "Update Purchase Raw Material"
    };

    //console.log(rawObj, stkObj);
    this._rest
      .postData("rawmaterial.php", "updatePurchasesRawMaterial", rawObj, null)
      .subscribe(Response => {
        if (Response) {
          this._rest
            .postData("stock.php", "updateStockRawMaterial", stkObj, null)
            .subscribe(RespStk => {
              if (RespStk) {
                //console.log(RespStk);
                window.scrollTo(0, 0);
                this.successMsg = "Purchase Updated Successfully";
                this._interval.settimer(null).then(Resp => {
                  this.successMsg = false;
                  this._router.navigate(["/viewpurchases"]);
                });
              }
            });
        }
      });
  }
}
