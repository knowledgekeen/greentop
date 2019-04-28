import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";

@Component({
  selector: "app-vieworders",
  templateUrl: "./vieworders.component.html",
  styleUrls: ["./vieworders.component.css"]
})
export class ViewordersComponent implements OnInit {
  selectedDate: any = new Date();
  opendtp: boolean = false;
  allorders: any = null;

  constructor(private _rest: RESTService) {}

  ngOnInit() {
    this._rest.getData("order.php", "getOpenOrders").subscribe(Response => {
      if (Response) {
        console.log(Response["data"]);
      }
    });
  }

  toggleDTP() {
    this.opendtp = !this.opendtp;
  }

  changeDate() {}
}
