import { O } from 'src/app/core/models/generics.interface';
import { SearchOrRule } from '../models/search-or-rule.interface';
import { SearchRule } from '../models/search-rule.interface';
import { Book } from '../models/book.class';

/**
 * Transforms book filter data to a set of SearchRules
 *
 * @param  {O} [data]
 *
 * @return {SearchRule[]}
 */
export function createSearchRule(data?: O) {
  const rules: Array<SearchRule | SearchOrRule> = [];

  if (!data || !Object.keys(data).length) {
    return rules;
  }

  // first handle the specific operator
  // based fields and add it as a search rule
  ['year', 'pagecount', 'remuneration'].map((key) => {
    if (key in data && data?.[key] !== 'all') {
      rules.push({
        property: key as keyof Book,
        operator: data[key],
        value: (key + 'Start') in data ? Number(data[key + 'Start']) : null,
        value2: (key + 'End') in data ? Number(data[key + 'End']) : null,
      });
    }
  });

  // convert string to array
  if ('language' in data && typeof data['language'] == 'string') {
    data['language'] = [data['language']];
  }

  // languages need to be added as an or-rule
  if ('language' in data && !data?.['language']?.includes('all')) {
    const rule: SearchRule[] = [];

    data['language'].map((l: string) => {
      rule.push({
        property: 'language',
        value: l
      });
    });

    rules.push({ or: rule });
  }

  // ddc rules need to be added as an or-rule
  if ('ddc' in data) {
    const ddcstr = data['ddc'].replace(/[^0-9.,]/gm, '');
    const ddcarr = ddcstr.split(',').filter((f: string) => f);

    ddcarr.map((val: string) => {
      rules.push({
        property: 'ddc',
        value: val
      });
    });
  }

  return rules;
}
