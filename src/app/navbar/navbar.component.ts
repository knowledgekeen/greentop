import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import { SessionService } from "../session.service";
import { Router, NavigationEnd } from "@angular/router";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  email: string = null;
  password: string = null;
  userdets: any = null;
  spinnerflag: any = false;

  constructor(
    private _rest: RESTService,
    private _session: SessionService,
    private _router: Router
  ) {
    this._router.events.subscribe((val: any) => {
      if (val instanceof NavigationEnd) {
        if (sessionStorage.getItem("userkey")) {
          this._session.getData("userkey").then(Response => {
            let dt = new Date().setHours(0, 0, 0, 0);
            if (Response[0].sessiontime != dt) {
              this.logout();
            }
          });
        } else {
          this._router.navigate(["/index"]);
        }
      }
    });
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this._session
      .getData("userkey")
      .then(Response => {
        this.userdets = Response[0];
      })
      .catch(err => { });
  }

  checkLogin() {
    this.spinnerflag = true;
    let tmpObj = {
      email: this.email,
      passwd: this.password
    };
    this._rest
      .postData("accounts.php", "checkLogin", tmpObj, null)
      .subscribe(Response => {
        this.spinnerflag = false;
        if (Response) {
          tmpObj = null;
          Response["data"][0].sessiontime = new Date(Response["data"][0].sessiontime).setHours(0, 0, 0, 0);
          this.userdets = Response["data"][0];
          this._session.setData("userkey", Response["data"]).then(Resp => {
            this._router.navigate(["/dashboard"]);
            this.email = null;
            this.password = null;
          });
        } else {
          alert("Invalid credentials, try again");
        }
      }, error => {
        this.spinnerflag = false;
        console.log("error", error);
        alert("Having some trouble logging you in, please try again later.");
      });
  }

  clickPwd(evt) {
    if (evt.key == "Enter") {
      if (this.email && this.password && this.password.length >= 6) {
        this.checkLogin();
      }
    }
  }

  logout() {
    sessionStorage.clear();
    this.userdets = null;
    this._router.navigate(["/index"]);
  }
}
