import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getPeople } from '../api';
import { Loader } from '../components/Loader/Loader';
import { PeopleTable } from '../components/PeopleTable';
import { Person } from '../types/Person';
import { PeopleFilters } from '../components/PeopleFilters';
import { useFilteredAndSortedPeople } from '../utils/useFilteredSortedPeople';

const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const { slug } = useParams();
  const filteredAndSortedPeople = useFilteredAndSortedPeople(people);

  useEffect(() => {
    setLoading(true);
    getPeople()
      .then(resPeople => setPeople(resPeople))
      .catch(() => setLoadingError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <h1 className="title">People Page</h1>
        <div className="block">
          <div className="box table-container">
            <Loader />
          </div>
        </div>
      </>
    );
  }

  if (loadingError) {
    return (
      <>
        <h1 className="title">People Page</h1>
        <div className="block">
          <div className="box table-container">
            <p data-cy="peopleLoadingError" className="has-text-danger">
              Something went wrong
            </p>
          </div>
        </div>
      </>
    );
  }

  if (people.length === 0) {
    return (
      <>
        <h1 className="title">People Page</h1>
        <div className="block">
          <div className="box table-container">
            <p data-cy="noPeopleMessage">There are no people on the server</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="columns is-desktop is-flex-direction-row-reverse">
          <div className="column is-7-tablet is-narrow-desktop">
            <PeopleFilters />
          </div>

          <div className="column">
            <div className="box table-container">
              {filteredAndSortedPeople.length === 0 ? (
                <p>There are no people matching the current search criteria</p>
              ) : (
                <PeopleTable
                  people={filteredAndSortedPeople}
                  selectedSlug={slug}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PeoplePage;
