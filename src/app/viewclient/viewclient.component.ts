import { Component, OnInit, Input } from "@angular/core";
import { RESTService } from "../rest.service";

@Component({
  selector: "app-viewclient",
  templateUrl: "./viewclient.component.html",
  styleUrls: ["./viewclient.component.css"]
})
export class ViewclientComponent implements OnInit {
  @Input() clienttype: string;
  allclients: any;
  searchbox: any = null;
  selectedclient: any;

  constructor(private _rest: RESTService) {}

  ngOnInit() {
    let strObj = "clienttype=" + this.clienttype;
    this._rest
      .getData("client.php", "getAllClients", strObj)
      .subscribe(Response => {
        if (Response) {
          this.allclients = Response["data"];
        }
      });
  }

  selectClient(client) {
    this.selectedclient = client;
  }
}
