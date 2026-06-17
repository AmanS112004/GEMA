import { Navbar } from './components/Navbar/Navbar';
import { ThreeBackground } from './components/Background/ThreeBackground';
import { Hero } from './components/Hero/Hero';
import { WorkshopDetails } from './components/WorkshopDetails/WorkshopDetails';
import { WhyUs } from './components/WorkshopDetails/WhyUs';
import { LearningOutcomes } from './components/LearningOutcomes/LearningOutcomes';
import { FAQ } from './components/FAQ/FAQ';
import { Registration } from './components/Registration/Registration';
import { Footer } from './components/Footer/Footer';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="relative min-h-screen">
      {/* Dynamic particles interactive background */}
      <ThreeBackground />
      
      {/* Navigation Header */}
      <Navbar />

      {/* Main page content sections */}
      <main>
        <Hero />
        <WorkshopDetails />
        <WhyUs />
        <LearningOutcomes />
        <FAQ />
        <Registration />
      </main>

      {/* Footer policy markers */}
      <Footer />

      {/* Global alert toaster */}
      <Toaster 
        position="bottom-right" 
        toastOptions={{ 
          duration: 5000,
          style: {
            background: '#ffffff',
            color: '#2C3E28',
            borderRadius: '16px',
            border: '1px solid rgba(74, 100, 68, 0.1)',
            boxShadow: '0 10px 30px -10px rgba(74, 100, 68, 0.15)',
            fontSize: '14px',
            padding: '12px 20px',
          }
        }} 
      />
    </div>
  );
}

export default App;
