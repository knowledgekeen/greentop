import { Component, OnInit } from "@angular/core";
import { RESTService } from "src/app/rest.service";

@Component({
  selector: "app-alloforms",
  templateUrl: "./alloforms.component.html",
  styleUrls: ["./alloforms.component.css"],
})
export class AlloformsComponent implements OnInit {
  alloforms: any = null;

  constructor(private _rest: RESTService) {}

  ngOnInit(): void {
    this.getAllOForms();
  }

  getAllOForms() {
    this.alloforms = null;
    this._rest.getData("oform.php", "getAllOForms").subscribe((Response) => {
      this.alloforms = Response && Response["data"] ? Response["data"] : null;
    });
  }

  deleteOForm(oform) {
    const urldata = `oformid=${oform.oformid}`;
    const confirmbox = confirm(
      `Are you sure to delete form "O" of ${oform.name}`
    );

    if (confirmbox) {
      this._rest.getData("oform.php", "deleteOForm", urldata).subscribe(
        (Resp) => {
          alert(`Form "O" deleted successfully of ${oform.name}`);
          this.getAllOForms();
        },
        (err) => {
          alert('Form "O" cannot be deleted as of now, kindly try again later');
        }
      );
    }
  }
}
