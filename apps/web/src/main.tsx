import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css';
import '@fontsource-variable/inter';
import '@fontsource/jetbrains-mono';
import { Layout } from './app/Layout';

import { Login } from './features/auth/Login';
import { Dashboard } from './features/dashboard/Dashboard';
import { RecordsList } from './features/records/RecordsList';
import { RecordDetail } from './features/records/RecordDetail';
import { Vault } from './features/vault/Vault';
import { NewTestWizard } from './features/new-test/NewTestWizard';

const Placeholder = ({ name }: { name: string }) => (
  <div className="flex h-full flex-col items-center justify-center p-4">
    <h1 className="text-2xl font-bold mb-4">{name}</h1>
    <p className="text-muted">Placeholder page</p>
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-test" element={<NewTestWizard />} />
          <Route path="/records" element={<RecordsList />} />
          <Route path="/records/:id" element={<RecordDetail />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/verify" element={<Placeholder name="Verify" />} />
          <Route path="/verify/:recordId" element={<Placeholder name="Verify Record" />} />
          <Route path="/analytics" element={<Placeholder name="Analytics" />} />
          <Route path="/settings" element={<Placeholder name="Settings" />} />
          <Route path="/reference-card" element={<Placeholder name="Reference Card Print View" />} />
          <Route path="/operators" element={<Placeholder name="Operators (Admin)" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
