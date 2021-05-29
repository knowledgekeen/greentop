import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AccountOpenbalComponent } from "../account-openbal/account-openbal.component";
import { CreatepersonalaccComponent } from "../createpersonalacc/createpersonalacc.component";
import { PersonalaccledgerComponent } from "../personalaccledger/personalaccledger.component";
import { BankaccledgerComponent } from "../bankaccledger/bankaccledger.component";
import { GraphexpenditureComponent } from "../graphexpenditure/graphexpenditure.component";
import { CashaccledgerComponent } from "../cashaccledger/cashaccledger.component";
import { PersonalaccadjustmentsComponent } from "../personalaccadjustments/personalaccadjustments.component";
import { AccheadledgerComponent } from "../accheadledger/accheadledger.component";

const accountsRoutes: Routes = [
  { path: "accounts/openingbal", component: AccountOpenbalComponent },
  { path: "accounts/createpersonalacc", component: CreatepersonalaccComponent },
  { path: "accounts/bankaccledger", component: BankaccledgerComponent },
  { path: "accounts/personalaccledger", component: PersonalaccledgerComponent },
  { path: "accounts/graphexpenditure", component: GraphexpenditureComponent },
  { path: "accounts/cashaccledger", component: CashaccledgerComponent },
  { path: "accounts/accheadledger", component: AccheadledgerComponent },
  {
    path: "accounts/personalaccadjustment",
    component: PersonalaccadjustmentsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(accountsRoutes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
