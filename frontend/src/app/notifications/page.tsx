import LayoutWithNav from '@/components/LayoutWithNav/LayoutWithNav';
import { MainLayout } from '@/components/MainLayout/MainLayout';
import { NotificationList } from '@/components/Notification/NotificationList';
import { Toaster } from '@/components/ui/toaster';
import { WebSocketProvider } from '../home/page';

const Notification = () => {
  return (
    <WebSocketProvider>
      <LayoutWithNav>
        <MainLayout title='Powiadomienia'>
          <NotificationList />
          <Toaster />
        </MainLayout>
      </LayoutWithNav>
    </WebSocketProvider>
  );
};

export default Notification;
