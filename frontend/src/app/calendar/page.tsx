import LayoutWithNav from '@/components/LayoutWithNav/LayoutWithNav';
import { WebSocketProvider } from '../home/page';

const Profile = () => {
  return (
    <WebSocketProvider>
      <LayoutWithNav>
        <h1>Calendar</h1>
      </LayoutWithNav>
    </WebSocketProvider>
  );
};

export default Profile;
