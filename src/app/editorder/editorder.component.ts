import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import { ActivatedRoute } from "@angular/router";
import { GlobalService } from "../global.service";
import * as moment from "moment";
import { IntervalService } from "../interval.service";

@Component({
  selector: "app-editorder",
  templateUrl: "./editorder.component.html",
  styleUrls: ["./editorder.component.css"]
})
export class EditorderComponent implements OnInit {
  orderid: any = null;
  orderno: any = null;
  selectedprod: any = null;
  orderdt: any = null;
  selectedcust: any = null;
  quantity: any = null;
  allcustomers: any = null;
  allproducts: any = null;
  allconsignees: any = [];
  nocusterr: any = false;
  sendtoself: any = false;
  consigneename: any = null;
  remarks: any = null;
  consigneecontactperson: any = null;
  consigneecontactno: any = null;
  consigneeaddress: any = null;
  consigneecity: any = null;
  consigneestate: any = null;
  consigneequantity: any = null;
  successMsg: any = null;
  clientcities: any = null;
  clientstates: any = null;
  dateerror: boolean = false;

  constructor(
    private _rest: RESTService,
    private _route: ActivatedRoute,
    private _global: GlobalService,
    private _interval: IntervalService
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this._route.params.subscribe(Resp => {
      if (Resp) {
        this.orderid = Resp.orderid;
        this.getOrderDetails();
        this.getOrderConsignees();
      }
    });
    this.getAllProducts();
    this.getAllCustomers();
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
    this.allproducts = null;
    this._rest.getData("product.php", "getActiveProducts").subscribe(Resp => {
      if (Resp) {
        this.allproducts = Resp["data"];
      }
    });
  }

  getAllCustomers() {
    this.allcustomers = null;
    let geturl = "clienttype=2";
    this._rest
      .getData("client.php", "getAllClients", geturl)
      .subscribe(Resp => {
        if (Resp) {
          this.allcustomers = Resp["data"];
        }
      });
  }

  getOrderDetails() {
    let geturl = "orderid=" + this.orderid;
    this._rest
      .getData("order.php", "getOrdersDetails", geturl)
      .subscribe(Response => {
        if (Response) {
          let data = Response["data"];
          //console.log(data);
          this.orderno = data.orderno;
          this.selectedprod = data.prodid + "." + data.prodname;
          this.orderdt = moment(parseInt(data.orderdt)).format("DD-MM-YYYY");
          this.selectedcust = data.clientid + "." + data.name;
          this.quantity = data.quantity;
        }
      });
  }

  getOrderConsignees() {
    let geturl = "orderid=" + this.orderid;
    this._rest
      .getData("order.php", "getOrderConsignees", geturl)
      .subscribe(Response => {
        if (Response) {
          this.allconsignees = Response["data"];

          //console.log(Response["data"]);
        }
      });
  }

  autoFillDt() {
    if (!this.orderdt) return;

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

  sendOrderToSelf() {
    if (!this.selectedcust) {
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
        let custid = this.selectedcust.split(".")[0];
        if (custid == this.allcustomers[i].clientid) {
          cust = this.allcustomers[i];
          break;
        }
      }

      if (cust) {
        //console.log(cust);
        this.consigneename = cust.name;
        this.consigneecontactperson = cust.contactperson1;
        this.consigneecontactno = cust.contactno;
        this.consigneecity = cust.city;
        this.consigneestate = cust.state;
        this.consigneeaddress = cust.address;
        this.consigneequantity = this.quantity ? this.quantity : 0;
      }
    } else {
      this.consigneename = null;
      this.consigneecontactperson = null;
      this.consigneecontactno = null;
      this.consigneecity = null;
      this.consigneestate = null;
      this.consigneeaddress = null;
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
    this.sendtoself = false;
    this.consigneequantity = 0;
  }

  removeConsignee(index) {
    this.allconsignees.splice(index, 1);
  }

  updateOrderDetails() {
    let total = 0;
    for (const i in this.allconsignees) {
      total += parseFloat(this.allconsignees[i].quantity);
    }
    if (total != parseFloat(this.quantity)) {
      console.log(total, parseFloat(this.quantity));
      alert("Order quantity mismatched with the total consignee quantity.");
      return;
    }

    window.scrollTo(0, 0);
    let myDate = moment(this.orderdt, "DD-MM-YYYY").format("MM-DD-YYYY");
    let orderObj = {
      orderid: this.orderid,
      orderdt: new Date(myDate).getTime(),
      custid: this.selectedcust.split(".")[0],
      prodid: this.selectedprod.split(".")[0],
      qty: this.quantity,
      consignees: this.allconsignees,
      remarks: this.remarks
    };
    console.log(orderObj);

    this._rest
      .postData("order.php", "updateOrderDetails", orderObj, null)
      .subscribe(Response => {
        if (Response) {
          window.scrollTo(0, 0);
          this.successMsg = true;
          this._interval.settimer(null).then(Resp => {
            this.resetForm();
            this.initialize();
          });
        }
      });
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
    this.selectedcust = null;
    this.selectedprod = null;
    this.orderdt = null;
    this.orderno = null;
    this.quantity = null;
    this.remarks = null;
    this.sendtoself = false;
    this.nocusterr = false;
    this.allconsignees = new Array();
    this.allcustomers = null;
    this.dateerror = false;
  }
}
