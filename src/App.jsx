import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';
import { EmptyState } from '@/components/EmptyState';
import { Spinner } from '@/components/ui/spinner';

// Each page is its own chunk, so the first paint only downloads the shell and the page you land on.
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const CampaignsPage = lazy(() => import('@/features/campaigns/CampaignsPage'));
const CampaignDetailPage = lazy(() => import('@/features/campaigns/CampaignDetailPage'));
const SubmissionsPage = lazy(() => import('@/features/submissions/SubmissionsPage'));
const SubmissionFormPage = lazy(() => import('@/features/submissions/SubmissionFormPage'));
const ExpensesPage = lazy(() => import('@/features/expenses/ExpensesPage'));
const AmbassadorsPage = lazy(() => import('@/features/ambassadors/AmbassadorsPage'));
const InboxPage = lazy(() => import('@/features/inbox/InboxPage'));

const PageFallback = () => (
  <div className="flex justify-center py-24">
    <Spinner size="lg" className="text-slate-300" />
  </div>
);

// HashRouter keeps every route working on a plain static host (no server rewrite rules needed),
// which is what lets this demo be dropped onto any portfolio site.
export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="campaigns/:code" element={<CampaignDetailPage />} />
            <Route path="submissions" element={<SubmissionsPage />} />
            <Route path="submissions/new" element={<SubmissionFormPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="ambassadors" element={<AmbassadorsPage />} />
            <Route path="inbox" element={<InboxPage />} />
            <Route
              path="*"
              element={<EmptyState title="Page not found" description="That page does not exist in the demo." />}
            />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
