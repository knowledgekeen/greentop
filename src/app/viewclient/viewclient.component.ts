import { Component, OnInit, Input } from "@angular/core";
import { RESTService } from "../rest.service";
import { IntervalService } from '../interval.service';

@Component({
  selector: "app-viewclient",
  templateUrl: "./viewclient.component.html",
  styleUrls: ["./viewclient.component.css"]
})
export class ViewclientComponent implements OnInit {
  @Input() clienttype: string;
  allclients: any;
  visibleclients: any = null;
  searchbox: any = null;
  selectedclient: any;
  delete_client: any;
  pagecount: number = 0;
  pageno: number = 0;
  pagelimit: number = 10;
  disableprevbtn: boolean = true;
  disablenextbtn: boolean = false;
  successflag: boolean = false;

  constructor(private _rest: RESTService, private _interval: IntervalService) { }

  ngOnInit() {
    this.getAllClients();
  }

  getAllClients() {
    let strObj = "clienttype=" + this.clienttype;
    this._rest
      .getData("client.php", "getAllClients", strObj)
      .subscribe(Response => {
        if (Response) {
          this.allclients = Response["data"];
          this.createNavigation();
        }
      });
  }

  selectClient(client) {
    this.selectedclient = client;
  }

  createNavigation() {
    this.pagecount = Math.ceil(this.allclients.length / this.pagelimit);
    let allclientscopy = JSON.parse(JSON.stringify(this.allclients));
    let cnt = 0;
    let tmparr = [];
    for (let i = 0; i < this.pagecount; i++) {
      tmparr.push(allclientscopy.splice(0, this.pagelimit));
    }
    this.visibleclients = tmparr;
  }

  goToPage(index) {
    this.pageno = index;
    if (this.pageno == 0) {
      this.disableprevbtn = true;
    } else {
      this.disableprevbtn = false;
    }
    if (this.pageno == this.pagecount - 1) {
      this.disablenextbtn = true;
    } else {
      this.disablenextbtn = false;
    }
  }

  goToPrevPage() {
    if (this.disableprevbtn) return;
    let pageno = this.pageno - 1;
    this.goToPage(pageno);
  }

  goToNextPage() {
    if (this.disablenextbtn) return;

    let pageno = this.pageno + 1;
    this.goToPage(pageno);
  }

  toConfirmDelete(client) {
    this.delete_client = client
    console.log(client)
  }

  deleteClient() {
    let geturl = "clientid=" + this.delete_client.clientid;

    this._rest.getData("client.php", 'deleteClient', geturl)
      .subscribe(Response => {
        if (Response) {
          this.successflag = true;
          this.getAllClients();
          this._interval.settimer().then(resp => {
            this.successflag = false;
          })
        }
      }, error => {
        console.log(error);
        alert("The is some error processing your request, please try again later.");
      })
  }
}
