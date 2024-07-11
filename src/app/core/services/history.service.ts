import { Injectable } from '@angular/core';
import { HistoryOptions } from '../models/history-options.interface';

/**
 * Service to change browser history data. Used to change params without
 * the need to change/trigger routing.
 */
@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  /**
   * Set either a single param or an array of params.
   *
   * @param {string | O[] }        param   either a string (single-set) or an array of objects (multi-set)
   * @param {any | HistoryOptions} [value] value (single-set) or additional options in (multi-set)
   * @param {HistoryOptions} [opts] Additional options (single-set)
   *
   * @return {void}
   */
  setParam(
    param: string | { key: string, value: any }[],
    value?: any | HistoryOptions,
    opts?: HistoryOptions): void {
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

  /**
   * Deletes one or more params from current url
   *
   * @param  {string | string[]} param
   * @param {HistoryOptions}     [opts] additional options
   *
   * @return {void}
   */
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

  /**
   * Retrieve a single param
   *
   * @param  {string} param
   *
   * @return {string | null}
   */
  getParam(param: string): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  }

  /**
   * Creates new browser history entry.
   *
   * @param  {URLSearchParams} params
   * @param  {HistoryOptions}  [opts]
   *
   * @return {void}
   */
  private write(params: URLSearchParams, opts?: HistoryOptions): void {
    const path = params.toString() ? '?' + params.toString() : '';
    const cmd = opts?.strategy == 'replace' ? 'replaceState' : 'pushState';

    history[cmd](null, '', window.location.pathname + path);
  }
}
