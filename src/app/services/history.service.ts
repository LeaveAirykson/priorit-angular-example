import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  setParam(param: string | { key: string, value: any }[], value?: any): void {
    const params = new URLSearchParams(window.location.search);

    if (typeof param == 'string') {
      param = [{ key: param, value: value }];
    }

    for (const para of param) {
      params.set(para.key, String(para.value));
    }

    this.write(params);
  }

  removeParam(param: string | string[]): void {
    const params = new URLSearchParams(window.location.search);

    if (typeof param == 'string') {
      param = [param];
    }

    for (const para of param) {
      params.delete(para);
    }

    this.write(params);
  }

  getParam(param: string) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  }

  private write(params: URLSearchParams) {
    const path = params.toString() ? '?' + params.toString() : '';
    history.pushState(null, '', window.location.pathname + path);
  }
}
