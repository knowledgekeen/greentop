import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { RESTService } from "../rest.service";
import { GlobalService } from "../global.service";

@Component({
  selector: "app-viewtrucks",
  templateUrl: "./viewtrucks.component.html",
  styleUrls: ["./viewtrucks.component.css"]
})
export class ViewtrucksComponent implements OnInit {
  alltrucks: any = null;
  searchtxt: any = null;
  @Output() parentMethod = new EventEmitter<any>();

  constructor(private _rest: RESTService, private _global: GlobalService) { }

  ngOnInit() {
    this.getAllTrucks();
    this._global.active_trucks.subscribe(
      Response => (this.alltrucks = Response)
    );
  }

  getAllTrucks() {
    this._rest
      .getData("transport.php", "getTransportTrucks", null)
      .subscribe(Response => {
        console.log(Response);
        if (Response) {
          this._global.updateTrucksData(Response["data"]);
        }
      });
  }

  editTrucks(truck) {
    this.parentMethod.emit(truck);
  }
}
