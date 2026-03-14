import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Person } from '../types/Person';
import { SexFilter, SortField, SortOrder } from '../types/enums';

export function useFilteredAndSortedPeople(people: Person[]) {
  const [searchParams] = useSearchParams();

  const query = (searchParams.get('query') || '').trim().toLowerCase();
  const sex = (searchParams.get('sex') || 'all') as SexFilter;
  const sortField = (searchParams.get('sort') || null) as SortField | null;
  const sortOrder = (searchParams.get('order') || 'asc') as SortOrder;

  return useMemo(() => {
    let filtered = people.filter(person => {
      const centuries = searchParams.getAll('centuries') || [];

      switch (true) {
        case !!query &&
          ![person.name, person.motherName, person.fatherName].some(field =>
            field?.trim().toLowerCase().includes(query),
          ):
          return false;

        case sex !== SexFilter.All && person.sex !== sex:
          return false;

        case centuries.length > 0:
          const birthCentury = Math.floor(person.born / 100) + 1;

          if (!centuries.includes(birthCentury.toString())) {
            return false;
          }

          return true;

        default:
          return true;
      }
    });

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue == null || bValue == null) {
          return 0;
        }

        switch (typeof aValue) {
          case 'number':
            return sortOrder === SortOrder.Asc
              ? (aValue as number) - (bValue as number)
              : (bValue as number) - (aValue as number);

          case 'string':
            const aStr = String(aValue).toLowerCase();
            const bStr = String(bValue).toLowerCase();

            if (aStr < bStr) {
              return sortOrder === SortOrder.Asc ? -1 : 1;
            }

            if (aStr > bStr) {
              return sortOrder === SortOrder.Asc ? 1 : -1;
            }

            return 0;

          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [people, query, sex, sortField, sortOrder, searchParams]);
}
