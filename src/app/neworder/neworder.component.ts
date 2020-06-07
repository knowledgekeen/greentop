import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import * as moment from "moment";
import { IntervalService } from "../interval.service";
import { GlobalService } from "../global.service";

@Component({
  selector: "app-neworder",
  templateUrl: "./neworder.component.html",
  styleUrls: ["./neworder.component.css"]
})
export class NeworderComponent implements OnInit {
  orderno: any = null;
  btndisabled: any = false;
  orderdt: any = null;
  allcustomers: any = null;
  allproducts: any = null;
  allconsignees: any = new Array();
  selectcust: any = null;
  selectprod: any = null;
  remarks: any = null;
  successMsg: any = false;
  sendtoself: boolean = false;
  nocusterr: boolean = false;
  quantity: any = null;
  consigneename: any = null;
  consigneecontactperson: any = null;
  consigneequantity: any = 0;
  consigneecontactno: any = null;
  consigneecity: any = null;
  consigneestate: any = null;
  consigneeaddress: any = null;
  clientcities: any = null;
  clientstates: any = null;
  dateerror: boolean = false;
  ordernopresent: boolean = false;
  deliveryperson: string = null;
  deliveryaddress: string = null;

  constructor(
    private _rest: RESTService,
    private _interval: IntervalService,
    private _global: GlobalService
  ) { }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    //let now = moment().format("DD-MM-YYYY");
    //this.orderdt = now;
    //this.orderno.nativeElement.focus();
    this.getLastOrderId();
    this.getAllCustomers();
    this.getAllProducts();
    this.getClientCities();
    this.getClientStates();
  }

  getClientCities() {
    this._rest.getData("client.php", "getClientCities").subscribe(Response => {
      if (Response) {
        this.clientcities = Response["data"];
      }
    });
  }

  getClientStates() {
    this._rest.getData("client.php", "getClientStates").subscribe(Response => {
      if (Response) {
        this.clientstates = Response["data"];
      }
    });
  }

  getAllProducts() {
    this._rest
      .getData("product.php", "getActiveProducts", null)
      .subscribe(Response => {
        //console.log(Response);
        if (Response) {
          this.allproducts = Response["data"];
        }
      });
  }

  getLastOrderId() {
    this._rest
      .getData("order.php", "getLastOrderId", null)
      .subscribe(Response => {
        //console.log(Response);
        if (Response) {
          if (Response["data"]) {
            this.orderno = "GTO-" + (parseInt(Response["data"]) + 1);
          } else {
            this.orderno = "GTO-1";
          }
        } else {
          this.orderno = "GTO-1";
        }

        this.checkIfOrderNoPresent().then(Resp => {
          //Order no isn't present, so everything is fine
        }, elsecode => {
          //Order no already present so try and increment it with 1;
          this.orderno = "GTO-" + (parseInt(this.orderno.split("-")[1]) + 1);
          this.ordernopresent = false;
        });
      });
  }

  getAllCustomers() {
    this.allcustomers = null;
    let suppdata = "clienttype=2";
    this._rest
      .getData("client.php", "getAllClients", suppdata)
      .subscribe(Response => {
        if (Response) {
          this.allcustomers = Response["data"];
          //console.log(this.allcustomers);
        }
      });
  }

  sendOrderToSelf() {
    if (!this.selectcust) {
      this.nocusterr = true;
      this._interval.settimer(null).then(Resp => {
        this.nocusterr = false;
        this.sendtoself = false;
      });
      return;
    }
    if (this.sendtoself == true) {
      let cust = null;
      for (let i in this.allcustomers) {
        let custid = this.selectcust.split(".")[0];
        if (custid == this.allcustomers[i].clientid) {
          cust = this.allcustomers[i];
          break;
        }
      }

      if (cust) {
        //console.log(cust);
        this.consigneename = cust.name;
        this.consigneecontactperson = cust.contactperson1;
        this.deliveryperson = cust.contactperson1;
        this.consigneecontactno = cust.contactno;
        this.consigneecity = cust.city;
        this.consigneestate = cust.state;
        this.consigneeaddress = cust.address;
        this.deliveryaddress = cust.address;
        this.consigneequantity = this.quantity ? this.quantity : 0;
      }
    } else {
      this.consigneename = null;
      this.consigneecontactperson = null;
      this.consigneecontactno = null;
      this.consigneecity = null;
      this.consigneestate = null;
      this.consigneeaddress = null;
      this.deliveryperson = null;
      this.deliveryaddress = null;
      this.consigneequantity = 0;
    }
  }

  addConsignee() {
    if (this.consigneequantity == "0" || !this.consigneequantity) {
      alert("Consignee quantity cannot be empty or 0");
      return;
    }
    let consignee = {
      consigneename: this.consigneename,
      contactperson: this.consigneecontactperson,
      contactno: this.consigneecontactno,
      city: this.consigneecity,
      state: this.consigneestate,
      address: this.consigneeaddress,
      quantity: this.consigneequantity,
      deliveryperson: this.deliveryperson,
      deliveryaddress: this.deliveryaddress,
      remarks: null
    };
    if (this.sendtoself == true) {
      this.remarks = "SELF";
    } else {
      this.remarks = "CONSIGNEE";
    }
    consignee.remarks = this.remarks;
    this.allconsignees.push(consignee);
    this.consigneename = null;
    this.consigneecontactperson = null;
    this.consigneecontactno = null;
    this.consigneecity = null;
    this.consigneestate = null;
    this.consigneeaddress = null;
    this.consigneequantity = 0;
    this.deliveryperson = null;
    this.deliveryaddress = null;
    this.sendtoself = false;
    setTimeout(function () {
      window.scrollTo(0, document.body.scrollHeight);
    }, 100);
  }

  createNewOrder() {
    this.btndisabled = true;
    let tmpqty = 0;
    for (let i in this.allconsignees) {
      tmpqty += parseFloat(this.allconsignees[i].quantity);
    }
    if (tmpqty != parseFloat(this.quantity)) {
      alert("Order quantity mismatched with the total consignee quantity.");
      this.btndisabled = false;
      return;
    }

    this.checkIfOrderNoPresent().then(Resp => {
      let myDate = moment(this.orderdt, "DD-MM-YYYY").format("MM-DD-YYYY");
      let orderObj = {
        orderid: this.orderno,
        orderdt: new Date(myDate).getTime(),
        custid: this.selectcust.split(".")[0],
        prodid: this.selectprod.split(".")[0],
        qty: this.quantity,
        consignees: this.allconsignees,
        remarks: this.remarks
      };

      this._rest
        .postData("order.php", "createNewOrder", orderObj, null)
        .subscribe(Response => {
          2
          if (Response) {
            window.scrollTo(0, 0);
            this.successMsg = true;
            this._interval.settimer(null).then(Resp => {
              this.resetForm();
              this.initialize();
            });
          }
        });
    }, error => {
      console.log("Order No already present");
      this.btndisabled = false;
    });
    //console.log(orderObj);
  }

  resetForm() {
    this.successMsg = false;
    this.consigneename = null;
    this.consigneecontactperson = null;
    this.consigneequantity = 0;
    this.consigneecontactno = null;
    this.consigneecity = null;
    this.consigneestate = null;
    this.consigneeaddress = null;
    this.selectcust = null;
    this.selectprod = null;
    this.orderdt = null;
    this.orderno = null;
    this.quantity = null;
    this.remarks = null;
    this.sendtoself = false;
    this.nocusterr = false;
    this.allconsignees = new Array();
    this.allcustomers = null;
    this.dateerror = false;
    this.btndisabled = false;
  }

  autoFillDt() {
    if (!this.orderdt) {
      return;
    }

    this.orderdt = this._global.getAutofillFormattedDt(this.orderdt);
    let myDate = moment(this.orderdt, "DD-MM-YYYY").format("MM-DD-YYYY");
    let seldt = new Date(myDate).getTime();
    let dt = new Date().getTime();

    if (seldt > dt) {
      this.dateerror = true;
    } else {
      this.dateerror = false;
    }
  }

  removeConsignee(index) {
    this.allconsignees.splice(index, 1);
  }

  checkIfOrderNoPresent() {
    if (this.orderno) {
      let promise = new Promise((resolve, reject) => {
        let geturl = "orderno=" + this.orderno;
        this._rest.getData("order.php", "checkIfOrderNoPresent", geturl)
          .subscribe(Response => {
            if (Response) {
              window.scrollTo(0, 0);
              this.ordernopresent = true;
              reject(true);
            }
            else {
              this.ordernopresent = false;
              resolve(false);
            }
          });
      });
      return promise;
    }
  }
}
