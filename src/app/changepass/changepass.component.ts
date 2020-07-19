import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import { EncDecService } from "../enc-dec.service";
import { IntervalService } from "../interval.service";

@Component({
  selector: "app-changepass",
  templateUrl: "./changepass.component.html",
  styleUrls: ["./changepass.component.css"]
})
export class ChangepassComponent implements OnInit {
  oldpass: string = null;
  newpass: string = null;
  confirmpass: string = null;
  userdets: any = null;
  errorflag: any = null;
  successflag: any = null;
  oldpasserr: any = null;

  constructor(
    private _rest: RESTService,
    private _enddec: EncDecService,
    private _interval: IntervalService
  ) {}

  ngOnInit() {
    this.userdets = this._enddec.decrypt(sessionStorage.getItem("userkey"))[0];
    //console.log(this.userdets.userid);
  }

  checkOldPass() {
    if (!this.oldpass) {
      return;
    }
    let userObj = {
      uid: this.userdets.userid,
      oldpass: this.oldpass
    };
    this._rest
      .postData("users.php", "checkOldPass", userObj, null)
      .subscribe(Response => {
        if (Response) {
          if (!Response["data"]) {
            this.errorflag = "Old Password is incorrect.";
            this.oldpasserr = true;
          } else {
            this.errorflag = false;
            this.oldpasserr = false;
          }
        }
      });
  }

  checkPassword() {
    if (!this.newpass || !this.confirmpass) {
      return;
    }
    if (this.newpass == this.confirmpass) {
      this.errorflag = false;
      if (this.oldpasserr) {
        this.errorflag = "Old Password is incorrect.";
      }
    } else {
      this.errorflag = "New Password and Confirm Password mismatch.";
    }
  }

  changePassword() {
    let userObj = {
      uid: this.userdets.userid,
      newpass: this.newpass
    };
    this._rest
      .postData("users.php", "changePassword", userObj, null)
      .subscribe(Response => {
        if (Response) {
          this.successflag = true;
          this.oldpass = null;
          this.newpass = null;
          this.confirmpass = null;
          this._interval.settimer(null).then(respo => {
            this.successflag = false;
          });
        }
      });
  }
}
