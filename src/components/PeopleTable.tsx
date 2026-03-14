/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';
import { Person } from '../types';
import PersonLink from './PersonLink';
import { useSearchParams } from 'react-router-dom';
import { SearchParams } from '../utils/searchHelper';
import cn from 'classnames';
import { SearchLink } from './SearchLink';

interface Props {
  people: Person[];
  selectedSlug?: string;
}

export const PeopleTable: FC<Props> = ({ people, selectedSlug }) => {
  const [searchParams] = useSearchParams();
  const activeSort = searchParams.get('sort');
  const activeOrder = searchParams.get('order') || 'asc';

  const getParent = (parentName: string | null) => {
    if (!parentName) {
      return '-';
    }

    const parent = people.find(p => p.name === parentName);

    return parent ? <PersonLink person={parent} /> : parentName;
  };

  const getSortLinkParams = (field: string): SearchParams => {
    switch (true) {
      case activeSort !== field:
        return { sort: field, order: null };
      case activeSort === field && activeOrder === 'asc':
        return { sort: field, order: 'desc' };
      default:
        return { sort: null, order: null };
    }
  };

  const getSortIconClass = (field: string) =>
    cn('fas', {
      'fa-sort': activeSort !== field,
      'fa-sort-up': activeSort === field && activeOrder === 'asc',
      'fa-sort-down': activeSort === field && activeOrder === 'desc',
    });

  return (
    <table
      data-cy="peopleTable"
      className="table is-striped is-hoverable is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          {['name', 'sex', 'born', 'died'].map(field => (
            <th key={field}>
              <span className="is-flex is-flex-wrap-nowrap">
                {field.charAt(0).toUpperCase() + field.slice(1)}
                <SearchLink params={getSortLinkParams(field)}>
                  <span className="icon">
                    <i className={getSortIconClass(field)} />
                  </span>
                </SearchLink>
              </span>
            </th>
          ))}
          <th>Mother</th>
          <th>Father</th>
        </tr>
      </thead>

      <tbody>
        {people.map(person => (
          <tr
            key={person.slug}
            data-cy="person"
            className={
              selectedSlug === person.slug ? 'has-background-warning' : ''
            }
          >
            <td>
              <PersonLink person={person} />
            </td>
            <td>{person.sex}</td>
            <td>{person.born}</td>
            <td>{person.died}</td>
            <td>{getParent(person.motherName)}</td>
            <td>{getParent(person.fatherName)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
