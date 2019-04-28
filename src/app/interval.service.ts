import { Injectable } from "@angular/core";
import { interval, timer } from "rxjs";
import { takeUntil, map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class IntervalService {
  constructor() {}

  settimer(secs: number = null) {
    let promise = new Promise((resolve, reject) => {
      let secval = 2000;
      if (secs) {
        secval = secs;
      }
      const source = interval(secval);
      const timer$ = timer(secval * 2);
      source
        .pipe(
          map(x => {
            return x;
          }),
          takeUntil(timer$)
        )
        .subscribe(x => {
          resolve();
        });
    });
    return promise;
  }
}
