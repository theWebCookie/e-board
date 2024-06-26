import Nav from '../Nav/Nav';

interface LayoutWithNavProps {
  children: React.ReactNode;
}

const LayoutWithNav: React.FC<LayoutWithNavProps> = ({ children }) => {
  return (
    <div>
      <Nav />
      <main className='p-4'>{children}</main>
    </div>
  );
};

export default LayoutWithNav;
