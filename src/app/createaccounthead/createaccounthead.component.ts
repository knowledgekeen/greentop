import { Component, OnInit } from '@angular/core';
import { RESTService } from '../rest.service';
import { IntervalService } from '../interval.service';

@Component({
  selector: 'app-createaccounthead',
  templateUrl: './createaccounthead.component.html',
  styleUrls: ['./createaccounthead.component.css']
})
export class CreateaccountheadComponent implements OnInit {
  accheadnm: any = null;
  allaccheads: any = null;
  successmsg: any = null;
  selectedacchead: any = null;
  disablebtn: boolean = false;

  constructor(private _rest: RESTService, private _interval: IntervalService) { }

  ngOnInit() {
    this.getAllAccountHeads();
  }

  createAccountHead() {
    this.disablebtn = true;
    let flag = new Array();
    let vm = this;
    if (this.allaccheads) {
      flag = this.allaccheads.filter(function (value) {
        if (vm.accheadnm == value.accheadnm) {
          return true;
        }
      });
    }

    if (flag.length <= 0) {
      this.successmsg = null;
      let tmpobj = {
        accheadnm: this.accheadnm
      };
      this._rest.postData("expenditure.php", "createAccountHead", tmpobj)
        .subscribe(Response => {
          if (Response) {
            this.successmsg = "Account head created successfully.";
            this.accheadnm = null;
            this.disablebtn = false;
            this.getAllAccountHeads();
            this._interval.settimer().then(Resp => {
              this.successmsg = null;
            });
          }
        });
    }
    else {
      alert("Account head already present");
      this.disablebtn = false;
    }
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

  editAccountHead(acchead) {
    this.selectedacchead = acchead;
    this.accheadnm = this.selectedacchead.accheadnm;
  }

  updateAccountHead() {
    this.disablebtn = true;
    this.allaccheads = null;
    let postobj = {
      "accheadid": this.selectedacchead.accheadid,
      "accheadnm": this.accheadnm
    };
    console.log(postobj);
    this.successmsg = null;
    this._rest.postData("expenditure.php", "editAccountHead", postobj)
      .subscribe(Response => {
        this.successmsg = "Account head updated successfully.";
        this.disablebtn = false;
        this.selectedacchead = null;
        this.accheadnm = null;
        this.getAllAccountHeads();
        this._interval.settimer().then(Resp => {
          this.successmsg = null;
        });
      });
  }

  deleteAccountHead() {
    this.allaccheads = null;
    let geturl = "accheadid=" + this.selectedacchead.accheadid;
    this.successmsg = null;
    this._rest.getData("expenditure.php", "deleteAccountHead", geturl)
      .subscribe(Response => {
        this.selectedacchead = null;
        this.successmsg = "Account head removed successfully.";
        this.getAllAccountHeads();
        this._interval.settimer().then(Resp => {
          this.successmsg = null;
          this.accheadnm = null;
        });
      });
  }
}
