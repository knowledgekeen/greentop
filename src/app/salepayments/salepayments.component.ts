import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, ComponentFactory } from "@angular/core";
import { RESTService } from "../rest.service";
import { GlobalService } from "../global.service";
import { IntervalService } from "../interval.service";
import * as moment from "moment";
import { SalespayhistoryComponent } from '../salespayhistory/salespayhistory.component';

@Component({
  selector: "app-salepayments",
  templateUrl: "./salepayments.component.html",
  styleUrls: ["./salepayments.component.css"]
})
export class SalepaymentsComponent implements OnInit {
  currfinanyr: any = null;
  allcustomers: any = null;
  paydt: string = null;
  customer: string = null;
  paymode: string = null;
  allpaymodes: any = null;
  particulars: string = null;
  amtpaid: string = "0";
  successmsg: any = false;
  custpaysuccessmsg: any = false;
  errormsg: any = false;
  payhistory: any = null;
  disableaddbtn: boolean = false;
  totalamt: any = null;
  showhideform: boolean = false;
  showmakepay: boolean = false;
  // Make Customer Pay fields
  custpaydate: string =  null; 
  customeramtpaid: string = "0"; 

  @ViewChild('salespayhistory', { read: ViewContainerRef }) entry: ViewContainerRef;

  constructor(
    private _rest: RESTService,
    private _global: GlobalService,
    private _interval: IntervalService,
    private resolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    this.currfinanyr = this._global.getCurrentFinancialYear();
    this.getAllCustomers();
    this.getAllPayModes();
  }

  loadSalesPaymentHistory(customer) {
    this.entry.clear();
    let flag = false;
    for (const i in this.allcustomers) {
      if ((this.allcustomers[i].clientid+"."+this.allcustomers[i].name) == customer) {
        flag = true;
        break;
      }
    }
    if(flag === false){
      return;
    }
    const factory = this.resolver.resolveComponentFactory(SalespayhistoryComponent);
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.customer = customer;
    componentRef.instance.iseditable = true;
  }

  getAllCustomers() {
    let suppdata = "clienttype=2";
    this._rest
      .getData("client.php", "getAllClients", suppdata)
      .subscribe(Response => {
        if (Response) {
          //console.log(Response["data"]);
          this.allcustomers = Response["data"];
        }
      });
  }

  getAllPayModes() {
    this._rest
      .getData("payments_common.php", "getAllPayModes", null)
      .subscribe(Response => {
        if (Response) {
          //console.log(Response["data"]);
          this.allpaymodes = Response["data"];
        }
      });
  }

  autofillPayDt() {
    if (this.paydt)
    this.paydt = this._global.getAutofillFormattedDt(this.paydt);
    if (this.custpaydate)
    this.custpaydate = this._global.getAutofillFormattedDt(this.custpaydate);
  }

  addPayment() {
    if (parseFloat(this.amtpaid) == 0) {
      this.errormsg = "Amount received cannot be '0'";
      this._interval.settimer(null).then(resp => {
        this.errormsg = null;
      });
      return;
    }
    let myDate = moment(this.paydt, "DD-MM-YYYY").format("MM-DD-YYYY");
    let tmpObj = {
      paydt: new Date(myDate).getTime(),
      custid: this.customer.split(".")[0],
      amtpaid: this.amtpaid,
      paymode: this.paymode,
      particulars: this.particulars
    };
    this.disableaddbtn = true;
    console.log(tmpObj);
    //return;
    this._rest
      .postData("sales_payments.php", "addSalesPayment", tmpObj, null)
      .subscribe(Response => {
        //console.log(Response);
        this.loadSalesPaymentHistory(this.customer);
        if (Response) {
          this.successmsg = "Payment done successfully";
          this._interval.settimer(null).then(resp => {
            this.resetForm();
          });
        }
      });
  }

  resetForm() {
    this.successmsg = null;
    this.custpaysuccessmsg = null;
    this.disableaddbtn = false;
    this.paydt = null;
    this.amtpaid = "0";
    this.paymode = null;
    this.particulars = null;
    this.payhistory = null;
    this.custpaydate = null;
    this.customeramtpaid="0";
  }

  setAutoPayMode() {
    for (let i in this.allpaymodes) {
      if (this.paymode == this.allpaymodes[i].paymodeid) {
        this.particulars = this.allpaymodes[i].paymode;
        break;
      }
    }
  }

  
  makeCustomerPayment() {
    if (parseFloat(this.customeramtpaid) == 0) {
      this.errormsg = "Amount paid cannot be '0'";
      this._interval.settimer(null).then(resp => {
        this.errormsg = null;
      });
      return;
    }
    let myDate = moment(this.custpaydate, "DD-MM-YYYY").format("MM-DD-YYYY");
    let tmpObj = {
      custpaydate: new Date(myDate).getTime(),
      custid: this.customer.split(".")[0],
      customeramtpaid: this.customeramtpaid,
      paymode: this.paymode,
      particulars: this.particulars
    };
    this.disableaddbtn = true;
    this._rest
      .postData("sales_payments.php", "makeCustomerPayments", tmpObj)
      .subscribe(Response => {
        this.loadSalesPaymentHistory(this.customer);
        if (Response) {
          this.custpaysuccessmsg = "Payment done successfully";
          this._interval.settimer(null).then(resp => {
            this.resetForm();
          });
        }
      });
  }
}
