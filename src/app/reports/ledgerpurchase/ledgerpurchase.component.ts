import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, ComponentFactory } from '@angular/core';
import { RESTService } from 'src/app/rest.service';
import { PurchasepayhistoryComponent } from 'src/app/purchasepayhistory/purchasepayhistory.component';

@Component({
  selector: 'app-ledgerpurchase',
  templateUrl: './ledgerpurchase.component.html',
  styleUrls: ['./ledgerpurchase.component.css']
})
export class LedgerpurchaseComponent implements OnInit {
  allsuppliers: any = null;
  filtersupp: any = null;
  @ViewChild('purchasepayhistory', { read: ViewContainerRef }) entry: ViewContainerRef;

  constructor(private _rest:RESTService, private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.getAllSuppliers();
  }

  getAllSuppliers() {
    this.allsuppliers = null;
    let strObj = "clienttype=1";
    this._rest
      .getData("client.php", "getAllClients", strObj)
      .subscribe(Response => {
        if (Response) {
          this.allsuppliers = Response["data"];
          console.log(this.allsuppliers)
        }
        else{
          this.allsuppliers = [];
        }
      });
  }

  loadPurchasePaymentHistory(suppid, suppname) {
    const supplier = suppid + "." + suppname;
    this.entry.clear();
    let flag = false;
    for (const i in this.allsuppliers) {
      if ((this.allsuppliers[i].clientid+"."+this.allsuppliers[i].name) == supplier) {
        flag = true;
        break;
      }
    }
    if(flag === false){
      return;
    }
    const factory = this.resolver.resolveComponentFactory(PurchasepayhistoryComponent);
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.supplier = supplier;
    componentRef.instance.isEditable = true;
  }
}
