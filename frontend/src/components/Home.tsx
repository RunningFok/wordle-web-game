import { MenuTabs } from './MenuTabs';

export const Home = () => {
  return (
    <div className="App">
      <header className="App-header">
        <div className="App-title">Wordle!</div>
      </header>
      <main className="homepage-container">
        <MenuTabs />
      </main>
    </div>
  );
};