import { ChartConfiguration } from 'chart.js';
import { Book } from './book.class';
import { SortDirection } from 'src/app/core/models/sort-direction.type';
import { O } from 'src/app/core/models/generics.interface';

/**
 * Wrapper class for chart.js to dynamically parse and change
 * configurations for charts.
 */
export class BookModChart {

  /**
   * The configuration passed to chart.js
   */
  config: ChartConfiguration = {
    type: 'bar',
    data: { datasets: [] },
    options: {
      maintainAspectRatio: false,
      plugins: {
        title: { display: true },
        legend: { display: false }
      },
      scales: {
        y: {
          title: { display: true, text: 'Vergütungswert (€)' }
        }
      }
    }
  };

  /**
   * Options respected by .parse() to possibly alter
   * construction of configuration
   */
  opts: { [key: string]: any } = {
    dimension: 'year',
    sortDirection: 'asc'
  }

  /**
   * Labels/titles for the different dimensions
   */
  titles: { [key: string]: string } = {
    ddc: 'Verteilung nach Sachgruppe (erste Ebene)',
    year: 'Verteilung nach Jahren',
    language: 'Verteilung nach Sprachen'
  };

  /**
   * Parses input data and options to restructure
   * data and recreate configuration based on it.
   *
   * @param  {Book[]} input
   * @param  {O}      [opts]
   *
   * @return {this}
   */
  parse(input: Book[], opts?: O): this {
    input = JSON.parse(JSON.stringify(input));

    if (opts) {
      this.opts = { ...this.opts, ...opts };
    }

    const sortDirection: SortDirection = this.opts?.['sortDirection'] ?? 'asc';
    const dimension: keyof Book = this.opts?.['dimension'] ?? 'year';
    const values: { key: string; value: number }[] = [];
    const labels: string[] = [];
    const data: any[] = [];

    // set title based on dimension
    this.config.options!.plugins!.title!.text = this.titles[dimension];

    // build value array
    input.map((entry) => {
      let key = String(entry[dimension]);

      if (dimension == 'ddc') {
        key = entry.ddc?.slice(0, 3);
      }

      // find entry by key
      const register = values.find((f) => f.key === key);

      // if entry exists update its value
      if (register) {
        register.value += entry.remuneration;
        return;
      }

      // otherwise push new entry
      values.push({ key: key, value: entry.remuneration });
    });

    // sort data by its dimension value
    values.sort((a, b) => {
      if (sortDirection == 'asc') {
        return a.key < b.key ? -1 : 1;
      } else {
        return a.key < b.key ? 1 : -1;
      }
    });

    // extract labels and values
    values.map((value) => {
      labels.push(value.key);
      data.push(value.value);
    });

    // update config data
    this.config.data = {
      labels: labels,
      datasets: [{ data: data }]
    };

    return this;
  }
};
