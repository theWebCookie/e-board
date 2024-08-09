import { CardDescription } from '../ui/card';

interface IDashboardCardDescriptionProps {
  numOfUsers: number;
}

const DashboardCardDescription: React.FC<IDashboardCardDescriptionProps> = ({ numOfUsers }) => {
  if (numOfUsers != 1) {
    return <CardDescription>{numOfUsers} uczestniów</CardDescription>;
  }

  return <CardDescription>{numOfUsers} uczestnik</CardDescription>;
};

export default DashboardCardDescription;
