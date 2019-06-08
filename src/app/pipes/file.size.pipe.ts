import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'fileSize'})
export class FileSizePipe implements PipeTransform {
  transform(value, args: string[]): any {
    // no value
    if (!value){
      return `0 kB`;
    }
    // bytes
    else if (value < 1024){
      return `${value} B`;
    }
    // kilo bytes
    else if (value >= 1024 && value < 1024 * 1024){
      return `${Math.round(value / 1024 * 100) / 100} kB`;
    }
    // mega bytes
    else if (value >= 1024 * 1024 && value < 1024 * 1024 * 1024){
      return `${Math.round(value / (1024 * 1024) * 100) / 100} MB`;
    }
    // giga bytes
    else{
      return `${Math.round(value / (1024 * 1024 * 1024) * 100) / 100} GB`;
    }
  }
}
