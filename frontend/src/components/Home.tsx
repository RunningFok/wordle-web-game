import { MenuTabs } from './MenuTabs';
import { TypewriterTitle } from './TypeWriterTitle';

export const Home = () => {
  return (
    <div className="App">
      <header className="App-header">
        <TypewriterTitle />
      </header>
      <main className="homepage-container">
        <MenuTabs />
      </main>
    </div>
  );
};