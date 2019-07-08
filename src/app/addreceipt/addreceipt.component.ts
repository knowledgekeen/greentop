import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { RESTService } from '../rest.service';
import * as moment from "moment";
import { IntervalService } from '../interval.service';
import { GlobalService } from '../global.service';
import { ViewreceiptComponent } from '../viewreceipt/viewreceipt.component';

@Component({
  selector: 'app-addreceipt',
  templateUrl: './addreceipt.component.html',
  styleUrls: ['./addreceipt.component.css']
})
export class AddreceiptComponent implements OnInit {
  allaccheads: any = null;
  receiptdate: any = null;
  receipttype: any = null;
  dirindirexp: any = null;
  acchead: any = null;
  particulars: any = null;
  amount: any = null;
  disablebtn: any = false;
  successmsg: any = null;
  @ViewChild('viewReceipt', { read: ViewContainerRef }) entry: ViewContainerRef;

  constructor(private _rest: RESTService, private _interval: IntervalService, private resolver: ComponentFactoryResolver, private _global: GlobalService) { }

  ngOnInit() {
    this.receiptdate = moment(new Date().getTime()).format("DD-MM-YYYY");
    this.getAllAccountHeads();
    this.loadViewReceipt();
  }

  loadViewReceipt() {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(ViewreceiptComponent);
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

  autofilldt() {
    this.receiptdate = this._global.getAutofillFormattedDt(this.receiptdate);
  }

  addReceipt() {
    if (this.acchead && this.acchead.split(".").length >= 2) {
      let mydate = moment(this.receiptdate, "DD-MM-YYYY").format("MM-DD-YYYY");
      let expobj = {
        receiptdate: new Date(mydate).getTime(),
        receipttype: this.receipttype,
        acchead: this.acchead.split(".")[0],
        particulars: this.particulars,
        amount: this.amount
      };
      this._rest.postData("expenditure.php", "addReceipt", expobj)
        .subscribe(Response => {
          if (Response) {
            this.loadViewReceipt();
            this.successmsg = "Receipt added successfully";
            this.receipttype = null;
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

}
