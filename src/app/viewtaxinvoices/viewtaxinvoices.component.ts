import { Component, OnInit } from "@angular/core";
import { IntervalService } from "../interval.service";
import { RESTService } from "../rest.service";
import * as moment from "moment";
import { GlobalService } from "../global.service";

@Component({
  selector: "app-viewtaxinvoices",
  templateUrl: "./viewtaxinvoices.component.html",
  styleUrls: ["./viewtaxinvoices.component.css"],
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
  ) {}

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
      .subscribe((Response) => {
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
      .subscribe((Response) => {
        //console.log(Response);
        if (Response) {
          this.orderdetails = Response["data"];
          this._rest
            .getData("order.php", "getOrderConsignees", urldata)
            .subscribe((Resp) => {
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

    this.amount = parseFloat(parseFloat(billdet.amount).toFixed(2));
    this.rate = parseFloat(parseFloat(billdet.rate).toFixed(2));
    this.discount = parseFloat(parseFloat(billdet.discount).toFixed(2));
    let netamt = parseFloat(this.amount) - parseFloat(this.discount);
    this.amtbeforegst = netamt;
    this.cgst = parseFloat(parseFloat(billdet.cgst).toFixed(2));
    this.sgst = parseFloat(parseFloat(billdet.sgst).toFixed(2));
    this.igst = parseFloat(parseFloat(billdet.igst).toFixed(2));
    this.roundoff = parseFloat(parseFloat(billdet.roundoff).toFixed(2));
    this.totalamount = parseFloat(parseFloat(billdet.totalamount).toFixed(2));
    this.cgstinr =
      this.cgst == "0"
        ? 0
        : parseFloat(((parseFloat(this.cgst) / 100) * netamt).toFixed(2));
    this.sgstinr =
      this.sgst == "0"
        ? 0
        : parseFloat(((parseFloat(this.cgst) / 100) * netamt).toFixed(2));
    this.igstinr =
      this.igst == "0"
        ? 0
        : parseFloat(((parseFloat(this.cgst) / 100) * netamt).toFixed(2));
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
    this.rate = parseFloat(parseFloat(this.rate).toFixed(2));
    let amount = parseFloat(qty) * parseFloat(this.rate);
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
      totalamount: this.totalamount,
    };
    this._rest
      .postData("taxinvoice.php", "updateBillDetails", tmpobj)
      .subscribe((Response) => {
        if (Response) {
          this.successmsg = true;
          this.initialize();
          this._interval.settimer().then((Resp) => {
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
