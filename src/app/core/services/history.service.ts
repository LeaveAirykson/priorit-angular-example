import { Injectable } from '@angular/core';

interface HistoryOptions {
  strategy: 'push' | 'replace'
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  setParam(param: string | { key: string, value: any }[], value?: any | HistoryOptions, opts?: HistoryOptions): void {
    const params = new URLSearchParams(window.location.search);

    if (typeof param == 'string') {
      param = [{ key: param, value: value }];
    } else {
      opts = value ?? opts;
    }

    for (const para of param) {
      if (typeof para.value == 'undefined') {
        params.delete(para.key);
      } else {
        params.set(para.key, String(para.value));
      }
    }

    this.write(params, opts);
  }

  deleteParam(param: string | string[], opts?: HistoryOptions): void {
    const params = new URLSearchParams(window.location.search);

    if (typeof param == 'string') {
      param = [param];
    }

    for (const para of param) {
      params.delete(para);
    }

    this.write(params, opts);
  }

  getParam(param: string) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  }

  private write(params: URLSearchParams, opts?: HistoryOptions) {
    const path = params.toString() ? '?' + params.toString() : '';
    const cmd = opts?.strategy == 'replace' ? 'replaceState' : 'pushState';

    history[cmd](null, '', window.location.pathname + path);
  }
}
