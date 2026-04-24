import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnalysisProvider } from './services/AnalysisContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Explorer } from './pages/Explorer';
import { Analysis } from './pages/Analysis';
import { Ranking } from './pages/Ranking';
import { Visualization } from './pages/Visualization';
import { Comparison } from './pages/Comparison';
import { CarePlan } from './pages/CarePlan';
import { Methodology } from './pages/Methodology';
import { ApiInfo } from './pages/ApiInfo';

export default function App() {
  return (
    <AnalysisProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/visualization" element={<Visualization />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/care-plan" element={<CarePlan />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/api" element={<ApiInfo />} />
          </Route>
        </Routes>
      </Router>
    </AnalysisProvider>
  );
}
