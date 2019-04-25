import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { GlobalService } from "../global.service";
import { RESTService } from "../rest.service";

@Component({
  selector: "app-viewtransport",
  templateUrl: "./viewtransport.component.html",
  styleUrls: ["./viewtransport.component.css"]
})
export class ViewtransportComponent implements OnInit {
  alltransport: any = null;
  @Output() parentMethod = new EventEmitter<any>();

  constructor(private _rest: RESTService, private _global: GlobalService) {}

  ngOnInit() {
    this.getActiveTransport();
    this._global.active_transport.subscribe(Response => {
      //console.log(Response);
      this.alltransport = Response;
    });
  }

  getActiveTransport() {
    this._rest
      .getData("transport.php", "getActiveTransport", null)
      .subscribe(Response => {
        //console.log(Response);
        if (Response) {
          this._global.updateTransportData(Response["data"]);
        }
      });
  }

  editTransport(transport) {
    this.parentMethod.emit(transport);
  }
}
