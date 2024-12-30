import LayoutWithNav from '@/components/LayoutWithNav/LayoutWithNav';
import { WebSocketProvider } from '../home/page';

const Profile = () => {
  return (
    <WebSocketProvider>
      <LayoutWithNav>
        <h1>Search</h1>
      </LayoutWithNav>
    </WebSocketProvider>
  );
};

export default Profile;
