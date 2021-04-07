import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import * as moment from "moment";
import { GlobalService } from "../global.service";
import { IntervalService } from "../interval.service";

@Component({
  selector: "app-taxinvoice",
  templateUrl: "./taxinvoice.component.html",
  styleUrls: ["./taxinvoice.component.css"],
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
  dcdetails: any = null;
  successmsg: boolean = false;
  disablesavebtn: boolean = false;
  discountremarks: string = null;

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
      .subscribe((Response) => {
        //console.log(Response);
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
      .subscribe((Response) => {
        console.log(Response["data"]);
        if (Response) {
          this.openorders = Response["data"];
        }
      });
  }

  selectOrder() {
    for (let i in this.openorders) {
      if (this.selectedorder == this.openorders[i].orderid) {
        this.orderdetails = this.openorders[i];
        let dcdate = moment(parseInt(this.orderdetails.dispatchdate)).format(
          "DD-MM-YYYY"
        );
        this.dcdetails = this.orderdetails.dcno + " Dated: " + dcdate;
        break;
      }
    }
  }

  getOrderConsignees() {
    this.allconsignees = null;
    let urldata = "orderid=" + this.orderdetails.orderid;
    this._rest
      .getData("order.php", "getOrderConsignees", urldata)
      .subscribe((Response) => {
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
    this.rate = parseFloat(parseFloat(this.rate).toFixed(2));
    let amount = parseFloat(
      (parseFloat(qty) * parseFloat(this.rate)).toFixed(2)
    );
    let discount = parseFloat(parseFloat(this.discount).toFixed(2));
    let netamt = amount - discount;
    let cgst = (this.cgstinr =
      this.cgst == "0"
        ? 0
        : parseFloat(((parseFloat(this.cgst) / 100) * netamt).toFixed(2)));
    let sgst = (this.sgstinr =
      this.sgst == "0"
        ? 0
        : parseFloat(((parseFloat(this.sgst) / 100) * netamt).toFixed(2)));
    let igst = (this.igstinr =
      this.igst == "0"
        ? 0
        : parseFloat(((parseFloat(this.igst) / 100) * netamt).toFixed(2)));
    let rawtotalamt =
      parseFloat(netamt.toFixed(2)) +
      parseFloat(cgst.toFixed(2)) +
      parseFloat(sgst.toFixed(2)) +
      parseFloat(igst.toFixed(2)) +
      parseFloat(parseFloat(this.roundoff).toFixed(2));
    //console.log(rawtotalamt, netamt, cgst, sgst, igst);
    if (this.cgst && !this.sgst) {
      this.sgst = this.cgst;
      this.sgstinr = this.cgstinr;
      rawtotalamt += parseFloat(parseFloat(this.sgstinr).toFixed(2));
    }
    if (this.sgst && !this.cgst) {
      this.cgst = this.sgst;
      this.cgstinr = this.sgstinr;
      rawtotalamt += parseFloat(parseFloat(this.cgstinr).toFixed(2));
    }
    if (this.rate) {
      this.amount = amount;
      this.amtbeforegst = netamt;
      this.totalamount = parseFloat(rawtotalamt.toFixed(2));
    }
  }

  saveBillDetails() {
    this.disablesavebtn = true;
    //console.log(this.orderdetails);
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
      totalamount: this.totalamount,
      discountremarks: this.discountremarks,
    };

    this._rest
      .postData("taxinvoice.php", "saveBillDetails", tmpobj)
      .subscribe((Response) => {
        if (Response) {
          this.successmsg = true;
          this.resetForm();
          this._interval.settimer().then((Resp) => {
            this.successmsg = false;
            this.disablesavebtn = false;
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
    this.orderdetails = null;
    this.initialize();
  }
}
