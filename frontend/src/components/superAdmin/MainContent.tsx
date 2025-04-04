import { ReactNode } from 'react';

type MainContentProps = {
  children: ReactNode;
};

const MainContent = ({ children }: MainContentProps) => {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 min-h-[calc(100vh-8rem)] border border-green-100">
        {children}
      </div>
    </main>
  );
};

export default MainContent;