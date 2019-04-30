import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "searchclient"
})
export class SearchclientPipe implements PipeTransform {
  transform(itemArray: any[], searchText?: any, originalarray?: any[]): any {
    if (!itemArray) {
      return [];
    }
    if (!searchText) {
      return itemArray;
    }
    if (!originalarray) {
      return itemArray;
    }
    if (originalarray && searchText) {
      return originalarray.filter(it => {
        return it.name.toLowerCase().includes(searchText);
      });
    }
  }
}
