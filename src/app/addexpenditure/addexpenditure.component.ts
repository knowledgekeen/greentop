import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { RESTService } from '../rest.service';
import * as moment from "moment";
import { IntervalService } from '../interval.service';
import { ViewexpenditureComponent } from '../viewexpenditure/viewexpenditure.component';
import { GlobalService } from '../global.service';


@Component({
  selector: 'app-addexpenditure',
  templateUrl: './addexpenditure.component.html',
  styleUrls: ['./addexpenditure.component.css']
})
export class AddexpenditureComponent implements OnInit {
  allaccheads: any = null;
  expensedate: any = null;
  expensetype: any = null;
  dirindirexp: any = null;
  acchead: any = null;
  particulars: any = null;
  amount: any = null;
  disablebtn: any = false;
  successmsg: any = null;
  @ViewChild('viewExpenditure', { read: ViewContainerRef }) entry: ViewContainerRef;

  constructor(private _rest: RESTService, private _interval: IntervalService, private resolver: ComponentFactoryResolver, private _global: GlobalService) { }

  ngOnInit() {
    this.expensedate = moment(new Date().getTime()).format("DD-MM-YYYY");
    this.getAllAccountHeads();
    this.loadPurchasePaymentHistory();
  }

  loadPurchasePaymentHistory() {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(ViewexpenditureComponent);
    const componentRef = this.entry.createComponent(factory)
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

  addExpenditure() {
    if (this.acchead && this.acchead.split(".").length >= 2) {
      let mydate = moment(this.expensedate, "DD-MM-YYYY").format("MM-DD-YYYY");
      let expobj = {
        expdate: new Date(mydate).getTime(),
        exptype: this.expensetype,
        acchead: this.acchead.split(".")[0],
        particulars: this.particulars,
        amount: this.amount
      };
      this._rest.postData("expenditure.php", "addExpenditure", expobj)
        .subscribe(Response => {
          if (Response) {
            this.loadPurchasePaymentHistory();
            this.successmsg = "Expenditure added successfully";
            this.expensetype = null;
            this.acchead = null;
            this.particulars = null;
            this.amount = null;
            this._interval.settimer().then(Resp => {
              this.successmsg = null;
            });
          }
        }, error => {
          alert("There is some error, please try again later");
        });
      console.log(expobj);
    }
    else {
      alert("Invalid Accound Head, please enter correct account head");
    }
  }

  autofilldt() {
    this.expensedate = this._global.getAutofillFormattedDt(this.expensedate);
  }
}
