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
  allpersonalaccs: any = null;
  receiptdate: any = null;
  receipttype: any = 2;
  dirindirexp: any = null;
  acchead: any = null;
  particulars: any = null;
  amount: any = null;
  disablebtn: any = false;
  successmsg: any = null;
  personalacc: any = null;

  @ViewChild('viewReceipt', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;

  constructor(private _rest: RESTService, private _interval: IntervalService, private resolver: ComponentFactoryResolver, private _global: GlobalService) { }

  ngOnInit() {
    this.receiptdate = moment(new Date().getTime()).format("DD-MM-YYYY");
    this.getAllAccountHeads();
    this.getAllPersonalAccounts();
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
    const personalaccount = this.personalacc ? this.allpersonalaccs.filter(res=>{ return res.personalaccnm === this.personalacc}) : null; 
    const personalaccid = personalaccount && personalaccount.length>0 ? personalaccount[0].personalaccid : 0;
    if (this.acchead && this.acchead.split(".").length >= 2) {
      let mydate = moment(this.receiptdate, "DD-MM-YYYY").format("MM-DD-YYYY");
      let expobj = {
        receiptdate: new Date(mydate).getTime(),
        receipttype: this.receipttype,
        acchead: this.acchead.split(".")[0],
        personalaccid: personalaccid,
        particulars: this.particulars,
        amount: this.amount
      };
      this._rest.postData("expenditure.php", "addReceipt", expobj)
        .subscribe(Response => {
          if (Response) {
            this.loadViewReceipt();
            this.successmsg = "Receipt added successfully";
            this.receipttype = 2;
            this.acchead = null;
            this.personalacc = null;
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

  getAllPersonalAccounts(){
    this.allpersonalaccs = null;
    this._rest.getData("accounts.php", "getAllPersonalAccounts")
      .subscribe(Response=>{
        this.allpersonalaccs = Response && Response["data"] ? Response["data"] : null;
      });
  }

}
