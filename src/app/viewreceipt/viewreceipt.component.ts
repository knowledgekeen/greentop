import { Component, OnInit } from '@angular/core';
import { RESTService } from '../rest.service';
import * as moment from "moment";
import { IntervalService } from '../interval.service';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-viewreceipt',
  templateUrl: './viewreceipt.component.html',
  styleUrls: ['./viewreceipt.component.css']
})
export class ViewreceiptComponent implements OnInit {
  allaccheads: any = null;
  selectedstatus: any = 1;
  allreceipts: any = null;
  totalamount: number = 0;
  selectedreceipt: any = null;
  masterreceipt: any = null;
  editdate: any = null;
  editreceipttype: any = null;
  editaccounthead: any = null;
  editparticulars: any = null;
  editamount: any = null;
  successmsg: any = null;
  filteraccheadnm: any = null;

  constructor(private _rest: RESTService, private _interval: IntervalService, private _global: GlobalService) { }

  ngOnInit() {
    this.getAllAccountHeads();
    this.getReceiptsFromTo();
  }

  getAllAccountHeads() {
    this.allaccheads = null;
    this._rest.getData("expenditure.php", "getAllAccountHeads")
      .subscribe(Response => {
        if (Response) {
          this.allaccheads = Response["data"];
        }
      });
  }

  getReceiptsFromTo() {
    let currfinanyr = this._global.getCurrentFinancialYear();
    let getobj = "fromdt=" + currfinanyr.fromdt + "&todt=" + currfinanyr.todt;
    this.totalamount = 0;
    this._rest.getData("expenditure.php", "getReceiptsFromTo", getobj)
      .subscribe(Response => {
        if (Response) {
          this.allreceipts = Response["data"];
          this.masterreceipt = JSON.parse(JSON.stringify(Response["data"]));
          let vm = this;
          this.allreceipts.filter(function (value) {
            vm.totalamount += parseFloat(value.amount);
          });
        }
        else {
          this.allreceipts = false;
        }
      });
  }

  filterReceipts(index) {
    this.filteraccheadnm = null;
    this.selectedstatus = index + 1;
    this.totalamount = 0;
    this.allreceipts = JSON.parse(JSON.stringify(this.masterreceipt));
    if (index == 0) {
      let vm = this;
      this.allreceipts.filter(function (value) {
        vm.totalamount += parseFloat(value.amount);
      });
      return;
    }
    this.allreceipts = this.allreceipts.filter(function (number) {
      return number.receipttype == index;
    });
    let vm = this;
    this.allreceipts.filter(function (value) {
      vm.totalamount += parseFloat(value.amount);
    });
  }

  filterByAccountHead() {
    this.allreceipts = JSON.parse(JSON.stringify(this.masterreceipt));
    this.selectedstatus = 4;
    this.totalamount = 0;
    let vm = this;
    this.allreceipts = this.allreceipts.filter(function (number) {
      return number.accheadnm == vm.filteraccheadnm;
    });
    this.allreceipts.filter(function (value) {
      vm.totalamount += parseFloat(value.amount);
    });
  }

  editReceipt(exp) {
    console.log(exp)
    this.selectedreceipt = exp;
    this.editdate = moment(parseInt(this.selectedreceipt.receiptdate)).format("DD-MM-YYYY");;
    this.editreceipttype = this.selectedreceipt.receipttype;
    this.editaccounthead = this.selectedreceipt.accheadid + "." + this.selectedreceipt.accheadnm;
    this.editparticulars = this.selectedreceipt.particulars;
    this.editamount = this.selectedreceipt.amount;
  }

  updateReceipt() {
    let mydate = moment(this.editdate, "DD-MM-YYYY").format("MM-DD-YYYY");
    let expobj = {
      receiptid: this.selectedreceipt.receiptid,
      receiptdate: new Date(mydate).getTime(),
      receipttype: this.editreceipttype,
      acchead: this.editaccounthead.split(".")[0],
      particulars: this.editparticulars,
      amount: this.editamount
    };
    this._rest.postData("expenditure.php", "updateReceipt", expobj)
      .subscribe(Response => {
        if (Response) {
          this.getReceiptsFromTo();
          this.selectedreceipt = null;
          this.successmsg = "Receipt updated successfully";
          this._interval.settimer().then(Resp => {
            this.successmsg = null;
          })
        }
      })
  }

  deleteReceipt() {
    let geturl = "receiptid=" + this.selectedreceipt.receiptid;
    this._rest.getData("expenditure.php", "deleteReceipt", geturl)
      .subscribe(Response => {
        if (Response) {
          this.selectedreceipt = null;
          this.successmsg = "Receipt deleted successfully.";
          this.getReceiptsFromTo();
          this._interval.settimer().then(Resp => {
            this.successmsg = null;
          });
        }
      });
  }
}
