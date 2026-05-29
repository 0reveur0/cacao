import React from 'react';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-rich-chocolate text-milk-cream font-sans">
      {/* Sidebar - Café Menu */}
      <aside className="w-64 bg-dark-cacao p-8 flex flex-col justify-between">
        <div>
          <div className="mb-12 text-center">
            <h1 className="font-serif text-3xl text-milk-cream">Cacao</h1>
            <p className="text-sm text-milk-cream/60">Your Study Café</p>
          </div>
          <nav>
            <ul>
              <li className="mb-4">
                <a href="#" className="flex items-center p-3 rounded-lg bg-rich-chocolate/50 hover:bg-caramel-accent/20 transition-colors duration-300">
                  <span className="text-lg">️</span>
                  <span className="ml-4 font-bold">Study Café Board</span>
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="flex items-center p-3 rounded-lg hover:bg-caramel-accent/20 transition-colors duration-300">
                  <span className="text-lg"></span>
                  <span className="ml-4">Courses</span>
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="flex items-center p-3 rounded-lg hover:bg-caramel-accent/20 transition-colors duration-300">
                  <span className="text-lg"></span>
                  <span className="ml-4">Assignments</span>
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="flex items-center p-3 rounded-lg hover:bg-caramel-accent/20 transition-colors duration-300">
                  <span className="text-lg"></span>
                  <span className="ml-4">Notes</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="text-center">
          <p className="text-sm text-milk-cream/60">Caco the Mascot</p>
        </div>
      </aside>

      {/* Main Content - Study Café Board */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-12">
          <h1 className="font-serif text-5xl text-milk-cream">Study Café Board</h1>
          <p className="text-lg text-milk-cream/80 mt-2">Welcome to your personal learning space.</p>
        </header>

        {/* Floating Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Example Card 1 */}
          <div className="bg-dark-cacao/80 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
            <h2 className="font-serif text-2xl text-caramel-accent mb-4">Course In Progress</h2>
            <p className="text-milk-cream/90">The Art of Chocolate Making</p>
            <div className="w-full bg-rich-chocolate rounded-full h-2.5 mt-4">
              <div className="bg-caramel-accent h-2.5 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>

          {/* Example Card 2 */}
          <div className="bg-dark-cacao/80 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
            <h2 className="font-serif text-2xl text-caramel-accent mb-4">Upcoming Assignment</h2>
            <p className="text-milk-cream/90">Lesson 3: Tempering Chocolate</p>
            <p className="text-sm text-milk-cream/60 mt-2">Due: Tomorrow</p>
          </div>

          {/* Example Card 3 */}
          <div className="bg-dark-cacao/80 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
            <h2 className="font-serif text-2xl text-caramel-accent mb-4">Cacao Notes</h2>
            <p className="font-handwriting text-lg text-milk-cream/90">Remember to practice the seeding method for tempering...</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
