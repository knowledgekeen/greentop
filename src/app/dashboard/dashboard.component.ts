import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import { IntervalService } from "../interval.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  hover: boolean = false;
  successmsg: boolean = false;
  dbsettings: any = null;
  btnsetting: any = [];
  disabledall: boolean = false;
  constructor(private _rest: RESTService, private _interval: IntervalService) { }

  ngOnInit() {
    this.getDBSettings();
  }

  getDBSettings() {
    this._rest.getData("accounts.php", "getDBSettings").subscribe(Response => {
      if (Response) {
        this.dbsettings = Response["data"];
        this.checkAllSettings();
        for (const i in this.dbsettings) {
          if (this.dbsettings[i].state == 1) {
            this.btnsetting.push(true);
          } else {
            this.btnsetting.push(false);
          }
        }
      }
    });
  }

  changeState(setting, index) {
    //console.log(setting);
    setting.state = setting.state == 1 ? 0 : 1;
    this._rest
      .postData("accounts.php", "updateDBSettings", setting)
      .subscribe(Response => {
        if (Response) {
          this.successmsg = true;
          this._interval.settimer().then(Resp => {
            this.successmsg = false;
            if (setting.state == 1) {
              this.btnsetting[index] = true;
            } else {
              this.btnsetting[index] = false;
            }
            this.checkAllSettings();
          });
        }
      });
  }

  checkAllSettings() {
    let flag = false;
    for (const i in this.dbsettings) {
      if (this.dbsettings[i].state == 1) {
        flag = true;
        break;
      }
    }
    this.disabledall = !flag;
  }
}
