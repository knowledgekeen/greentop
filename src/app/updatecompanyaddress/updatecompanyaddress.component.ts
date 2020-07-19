import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { RESTService } from '../rest.service';
import { IntervalService } from '../interval.service';

@Component({
  selector: 'app-updatecompanyaddress',
  templateUrl: './updatecompanyaddress.component.html',
  styleUrls: ['./updatecompanyaddress.component.css']
})
export class UpdatecompanyaddressComponent implements OnInit {
  address: any = null;
  userdets: any = null;
  successmsg: any = null;

  constructor(private _session: SessionService, private _rest: RESTService, private _interval: IntervalService) { }

  ngOnInit() {
    this._session.getData("userkey").then(Response => {
      this.userdets = Response;
      this.address = Response[0].address;
    });
  }

  updateCompanyAddress() {
    let userdata = {
      userid: this.userdets[0].userid,
      address: this.address
    };
    this._rest.postData("users.php", "updateCompanyAddress", userdata)
      .subscribe(Response => {
        if (Response) {
          this.successmsg = true;
          this.userdets[0].address = this.address;
          this._session.setData("userkey", this.userdets).then(Respo => { });
          this._interval.settimer().then(Resp => {
            this.successmsg = null;
          });
        }
      });
  }

}
