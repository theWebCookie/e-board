import LayoutWithNav from '@/components/LayoutWithNav/LayoutWithNav';
import { MainLayout } from '@/components/MainLayout/MainLayout';
import { NotificationList } from '@/components/Notification/NotificationList';

const Notification = () => {
  return (
    <LayoutWithNav>
      <MainLayout title='Powiadomienia'>
        <NotificationList />
      </MainLayout>
    </LayoutWithNav>
  );
};

export default Notification;
