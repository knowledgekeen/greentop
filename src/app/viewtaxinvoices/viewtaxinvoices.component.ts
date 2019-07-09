import { Component, OnInit } from "@angular/core";
import { IntervalService } from "../interval.service";
import { RESTService } from "../rest.service";
import * as moment from "moment";
import { GlobalService } from "../global.service";

@Component({
  selector: "app-viewtaxinvoices",
  templateUrl: "./viewtaxinvoices.component.html",
  styleUrls: ["./viewtaxinvoices.component.css"]
})
export class ViewtaxinvoicesComponent implements OnInit {
  selectedinvoice: any = new Date();
  errorMsg: any = false;
  allinvoices: any = null;
  billdetails: any = null;
  orderdetails: any = null;
  allconsignees: any = null;
  billno: any = 0;
  billdt: any = 0;
  rate: any = 0;
  amount: any = 0;
  discount: any = 0;
  amtbeforegst: any = 0;
  cgst: any = 0;
  sgst: any = 0;
  igst: any = 0;
  cgstinr: any = 0;
  sgstinr: any = 0;
  igstinr: any = 0;
  roundoff: any = 0;
  totalamount: any = 0;
  autocalc: boolean = true;
  successmsg: boolean = false;
  disableupdatebtn: boolean = false;
  totalmonthamt: any = 0;
  totalmonthqty: any = 0;
  monthlabel: string = "Full year";
  fromdt: any = null;
  todt: any = null;
  customfrom: any = null;
  customto: any = null;

  constructor(
    private _interval: IntervalService,
    private _rest: RESTService,
    private _global: GlobalService
  ) { }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    let finanyr = this._global.getCurrentFinancialYear();
    this.getInvoicesFromToDt(finanyr.fromdt, finanyr.todt);
  }

  getInvoicesFromToDt(fromdt, todt) {
    this.allinvoices = null;
    let amt = 0;
    let qty = 0;
    let geturl = "fromdt=" + fromdt + "&todt=" + todt;
    this._rest
      .getData("taxinvoice.php", "getInvoicesFromToDt", geturl)
      .subscribe(Response => {
        if (Response) {
          this.allinvoices = Response["data"];
          for (let i in this.allinvoices) {
            amt += parseFloat(this.allinvoices[i].totalamount);
            qty += parseFloat(this.allinvoices[i].quantity);
          }
          this.totalmonthamt = amt;
          this.totalmonthqty = qty;
        } else {
          this.totalmonthamt = 0;
          this.totalmonthqty = 0;
        }
      });
  }

  getOrderDetails(bill) {
    console.log(bill);
    this.selectedinvoice = bill;
    this.orderdetails = null;
    this.allconsignees = null;
    let urldata = "orderid=" + bill.orderid;
    this._rest
      .getData("order.php", "getOrdersDetails", urldata)
      .subscribe(Response => {
        //console.log(Response);
        if (Response) {
          this.orderdetails = Response["data"];
          this._rest
            .getData("order.php", "getOrderConsignees", urldata)
            .subscribe(Resp => {
              if (Resp) {
                this.allconsignees = Resp["data"];
              }
            });
        }
      });
  }

  getBillDetails(billdet) {
    //console.log(billdet);
    this.billdetails = billdet;
    this.billno = billdet.billno;
    this.billdt = moment(parseInt(billdet.billdt)).format("DD-MM-YYYY");

    this.amount = billdet.amount;
    this.rate = billdet.rate;
    this.discount = billdet.discount;
    let netamt = parseFloat(this.amount) - parseFloat(this.discount);
    this.amtbeforegst = netamt;
    this.cgst = billdet.cgst;
    this.sgst = billdet.sgst;
    this.igst = billdet.igst;
    this.roundoff = billdet.roundoff;
    this.totalamount = billdet.totalamount;
    this.cgstinr =
      this.cgst == "0" ? 0 : (parseFloat(this.cgst) / 100) * netamt;
    this.sgstinr =
      this.sgst == "0" ? 0 : (parseFloat(this.cgst) / 100) * netamt;
    this.igstinr =
      this.igst == "0" ? 0 : (parseFloat(this.cgst) / 100) * netamt;
  }

  autoFillDt() {
    if (!this.billdt) return;

    this.billdt = this._global.getAutofillFormattedDt(this.billdt);
  }

  calculateAmt() {
    if (!this.autocalc) {
      return false;
    }
    let qty = this.billdetails.quantity;
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

  updateBillDetails() {
    this.disableupdatebtn = true;
    let billdt = moment(this.billdt, "DD-MM-YYYY").format("MM-DD-YYYY");
    let tmpobj = {
      otaxinvoiceid: this.billdetails.otaxinvoiceid,
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
      .postData("taxinvoice.php", "updateBillDetails", tmpobj)
      .subscribe(Response => {
        if (Response) {
          this.successmsg = true;
          this.initialize();
          this._interval.settimer().then(Resp => {
            this.successmsg = false;
            this.disableupdatebtn = false;
          });
        }
      });
  }

  autofillfromdt() {
    this.fromdt = this._global.getAutofillFormattedDt(this.fromdt);
  }

  autofilltodt() {
    this.todt = this._global.getAutofillFormattedDt(this.todt);
  }

  filterData() {
    let myfromdate = moment(this.fromdt, "DD-MM-YYYY").format("MM-DD-YYYY");
    let fromtm = new Date(myfromdate).getTime();
    this.customfrom = fromtm;
    let mytodate = moment(this.todt, "DD-MM-YYYY").format("MM-DD-YYYY");
    let totm = new Date(mytodate).getTime();
    this.customto = totm;
    this.getInvoicesFromToDt(fromtm, totm);
  }
}
