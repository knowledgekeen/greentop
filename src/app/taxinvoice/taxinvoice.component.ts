import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import * as moment from "moment";
import { GlobalService } from "../global.service";
import { IntervalService } from "../interval.service";

@Component({
  selector: "app-taxinvoice",
  templateUrl: "./taxinvoice.component.html",
  styleUrls: ["./taxinvoice.component.css"]
})
export class TaxinvoiceComponent implements OnInit {
  selectedorder: any = null;
  orderdetails: any = null;
  openorders: any = null;
  allconsignees: any = null;
  autocalc: boolean = true;
  billno: string = null;
  billdate: string = null;
  rate: any = 0;
  roundoff: any = 0;
  amount: any = 0;
  discount: any = 0;
  amtbeforegst: any = 0;
  cgst: any = 0;
  sgst: any = 0;
  igst: any = 0;
  cgstinr: any = 0;
  sgstinr: any = 0;
  igstinr: any = 0;
  totalamount: any = 0;
  successmsg: boolean = false;

  constructor(
    private _rest: RESTService,
    private _global: GlobalService,
    private _interval: IntervalService
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.getLastBillId();
    this.getDispatchedOrders();
  }

  getLastBillId() {
    this._rest
      .getData("taxinvoice.php", "getLastBillId")
      .subscribe(Response => {
        console.log(Response);
        if (Response) {
          this.billno = JSON.stringify(parseFloat(Response["data"]) + 1);
        } else {
          this.billno = "1";
        }
      });
  }

  getDispatchedOrders() {
    this.openorders = null;
    this._rest
      .getData("order.php", "getDispatchedOrders", null)
      .subscribe(Response => {
        //console.log(Response);
        if (Response) {
          this.openorders = Response["data"];
        }
      });
  }

  selectOrder() {
    for (let i in this.openorders) {
      if (this.selectedorder == this.openorders[i].orderid) {
        this.orderdetails = this.openorders[i];
        break;
      }
    }
  }

  getOrderConsignees() {
    this.allconsignees = null;
    let urldata = "orderid=" + this.orderdetails.orderid;
    this._rest
      .getData("order.php", "getOrderConsignees", urldata)
      .subscribe(Response => {
        //console.log(Response);
        if (Response) {
          this.allconsignees = Response["data"];
        }
      });
  }

  autoFillDate() {
    if (!this.billdate) return;

    this.billdate = this._global.getAutofillFormattedDt(this.billdate);
  }

  calculateAmt() {
    if (!this.autocalc) {
      return false;
    }
    let qty = this.orderdetails.quantity;
    let amount = parseFloat(qty) * parseFloat(this.rate);
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
    if (this.rate) {
      this.amount = amount;
      this.amtbeforegst = netamt;
      this.totalamount = rawtotalamt;
    }
  }

  saveBillDetails() {
    console.log(this.orderdetails);
    let billdt = moment(this.billdate, "DD-MM-YYYY").format("MM-DD-YYYY");
    let tmpobj = {
      orderid: this.orderdetails.orderid,
      clientid: this.orderdetails.clientid,
      billno: this.billno,
      billdt: new Date(billdt).getTime(),
      amount: this.amount,
      discount: this.discount,
      rate: this.rate,
      cgst: this.cgst,
      sgst: this.sgst,
      igst: this.igst,
      roundoff: this.roundoff,
      totalamount: this.totalamount
    };

    this._rest
      .postData("taxinvoice.php", "saveBillDetails", tmpobj)
      .subscribe(Response => {
        if (Response) {
          this.successmsg = true;
          this.resetForm();
          this._interval.settimer().then(Resp => {
            this.successmsg = false;
          });
        }
      });
  }

  resetForm() {
    this.selectedorder = null;
    this.autocalc = true;
    this.billno = null;
    this.billdate = null;
    this.rate = 0;
    this.roundoff = 0;
    this.amount = 0;
    this.discount = 0;
    this.amtbeforegst = 0;
    this.cgst = 0;
    this.sgst = 0;
    this.igst = 0;
    this.cgstinr = 0;
    this.sgstinr = 0;
    this.igstinr = 0;
    this.totalamount = 0;
    this.initialize();
  }
}
