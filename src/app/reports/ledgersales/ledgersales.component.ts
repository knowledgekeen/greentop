import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, ComponentFactory } from '@angular/core';
import { RESTService } from 'src/app/rest.service';
import { SalespayhistoryComponent } from 'src/app/salespayhistory/salespayhistory.component';

@Component({
  selector: 'app-ledgersales',
  templateUrl: './ledgersales.component.html',
  styleUrls: ['./ledgersales.component.css']
})
export class LedgersalesComponent implements OnInit {
  allcustomers: any = null;
  filtercust: any = null;
  @ViewChild('salespayhistory', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;

  constructor(private _rest:RESTService, private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.getAllCustomers();
  }

  getAllCustomers() {
    this.allcustomers = null;
    let strObj = "clienttype=2";
    this._rest
      .getData("client.php", "getAllClients", strObj)
      .subscribe(Response => {
        if (Response) {
          this.allcustomers = Response["data"];
        }
        else{
          this.allcustomers = [];
        }
      });
  }

  loadSalesPaymentHistory(custid, custname) {
    const customer = custid + "." + custname;
    this.entry.clear();
    let flag = false;
    for (const i in this.allcustomers) {
      if ((this.allcustomers[i].clientid+"."+this.allcustomers[i].name) == customer) {
        flag = true;
        break;
      }
    }
    if(flag === false){
      return;
    }
    const factory = this.resolver.resolveComponentFactory(SalespayhistoryComponent);
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.customer = customer;
    componentRef.instance.iseditable = true;
  }
}
