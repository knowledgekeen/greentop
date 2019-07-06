import { Component, OnInit } from '@angular/core';
import { RESTService } from '../rest.service';
import * as moment from "moment";
import { IntervalService } from '../interval.service';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-viewexpenditure',
  templateUrl: './viewexpenditure.component.html',
  styleUrls: ['./viewexpenditure.component.css']
})
export class ViewexpenditureComponent implements OnInit {
  allaccheads: any = null;
  selectedstatus: any = 1;
  allexpenditures: any = null;
  totalamount: number = 0;
  selectedexpenditure: any = null;
  masterexpenditure: any = null;
  editdate: any = null;
  editexptype: any = null;
  editaccounthead: any = null;
  editparticulars: any = null;
  editamount: any = null;
  successmsg: any = null;

  constructor(private _rest: RESTService, private _interval: IntervalService, private _global: GlobalService) { }

  ngOnInit() {
    this.getAllAccountHeads();
    this.getExpendituresFromTo();
  }

  getExpendituresFromTo() {
    let currfinanyr = this._global.getCurrentFinancialYear();
    let getobj = "fromdt=" + currfinanyr.fromdt + "&todt=" + currfinanyr.todt;
    this.totalamount = 0;
    this._rest.getData("expenditure.php", "getExpendituresFromTo", getobj)
      .subscribe(Response => {
        if (Response) {
          this.allexpenditures = Response["data"];
          this.masterexpenditure = JSON.parse(JSON.stringify(Response["data"]));
          let vm = this;
          this.allexpenditures.filter(function (value) {
            vm.totalamount += parseFloat(value.amount);
          });
        }
        else {
          this.allexpenditures = false;
        }
      });
  }

  filterExpenses(index) {
    this.selectedstatus = index + 1;
    this.totalamount = 0;
    console.log(this.allexpenditures, index);
    this.allexpenditures = JSON.parse(JSON.stringify(this.masterexpenditure));
    if (index == 0) {
      let vm = this;
      this.allexpenditures.filter(function (value) {
        vm.totalamount += parseFloat(value.amount);
      });
      return;
    }
    this.allexpenditures = this.allexpenditures.filter(function (number) {
      return number.exptype == index;
    });
    let vm = this;
    this.allexpenditures.filter(function (value) {
      vm.totalamount += parseFloat(value.amount);
    });
  }

  editExpenditure(exp) {
    this.selectedexpenditure = exp;
    this.editdate = moment(parseInt(this.selectedexpenditure.expdate)).format("DD-MM-YYYY");;
    this.editexptype = this.selectedexpenditure.exptype;
    this.editaccounthead = this.selectedexpenditure.accheadid + "." + this.selectedexpenditure.accheadnm;
    this.editparticulars = this.selectedexpenditure.particulars;
    this.editamount = this.selectedexpenditure.amount;
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

  updateExpenditure() {
    let mydate = moment(this.editdate, "DD-MM-YYYY").format("MM-DD-YYYY");
    let expobj = {
      expid: this.selectedexpenditure.expid,
      expdate: new Date(mydate).getTime(),
      exptype: this.editexptype,
      acchead: this.editaccounthead.split(".")[0],
      particulars: this.editparticulars,
      amount: this.editamount
    };
    this._rest.postData("expenditure.php", "updateExpenditure", expobj)
      .subscribe(Response => {
        if (Response) {
          this.getExpendituresFromTo();
          this.selectedexpenditure = null;
          this.successmsg = "Expenditure updated successfully";
          this._interval.settimer().then(Resp => {
            this.successmsg = null;
          })
        }
      })
  }

  deleteExpenditure() {
    let geturl = "expid=" + this.selectedexpenditure.expid;
    this._rest.getData("expenditure.php", "deleteExpenditure", geturl)
      .subscribe(Response => {
        if (Response) {
          this.selectedexpenditure = null;
          this.successmsg = "Expenditure deleted successfully.";
          this.getExpendituresFromTo();
          this._interval.settimer().then(Resp => {
            this.successmsg = null;
          });
        }
      });
  }
}