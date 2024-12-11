import { ReactNode, FC } from 'react';

interface IMainLayout {
  title: string;
  isButtonVisible?: boolean;
  children: ReactNode;
  buttonComponent?: ReactNode;
}

export const MainLayout: FC<IMainLayout> = ({ title, isButtonVisible, children, buttonComponent }) => {
  return (
    <div className='max-w-3xl p-4 mx-auto mt-8'>
      <div className='w-full flex items-center justify-between'>
        <h1 className='font-bold flex-grow'>{title}</h1>
        {isButtonVisible && buttonComponent}
      </div>
      {children}
    </div>
  );
};
