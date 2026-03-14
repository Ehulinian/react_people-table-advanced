import { Link, useSearchParams } from 'react-router-dom';
import { Person } from '../types/Person';

interface PersonLinkProps {
  person: Person;
}

const PersonLink: React.FC<PersonLinkProps> = ({ person }) => {
  const [searchParams] = useSearchParams();

  return (
    <Link
      className={person.sex === 'f' ? 'has-text-danger' : ''}
      to={{
        pathname: `/people/${person.slug}`,
        search: searchParams.toString(),
      }}
    >
      {person.name}
    </Link>
  );
};

export default PersonLink;
