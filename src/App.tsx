import { lazy, Suspense, useEffect } from "react";
import { Route, Router, Switch, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { AuthProvider } from "./lib/auth";
import { PrefsProvider } from "./lib/prefs";
import { useStudyTimer } from "./lib/useStudyTimer";
import Home from "./pages/Home";
import LessonPage from "./pages/LessonPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// The tools pages carry the question bank, the simulator and the labs; load them when first opened.
const Exam = lazy(() => import("./pages/Exam"));
const Flashcards = lazy(() => import("./pages/Flashcards"));
const LabPage = lazy(() => import("./pages/LabPage"));
const Labs = lazy(() => import("./pages/Labs"));
const Plan = lazy(() => import("./pages/Plan"));
const Practice = lazy(() => import("./pages/Practice"));
const Progress = lazy(() => import("./pages/Progress"));
const Reference = lazy(() => import("./pages/Reference"));
const Settings = lazy(() => import("./pages/Settings"));
const SceneList = lazy(() =>
  import("./pages/ScenePreview").then(m => ({ default: m.SceneList }))
);
const ScenePreview = lazy(() =>
  import("./pages/ScenePreview").then(m => ({ default: m.ScenePreview }))
);

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location]);
  return null;
}

function StudyTimer() {
  useStudyTimer();
  return null;
}

export default function App() {
  return (
    <PrefsProvider>
      <AuthProvider>
        <Router hook={useHashLocation}>
          <ScrollToTop />
          <StudyTimer />
          <Suspense fallback={<div className="page-loading" />}>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/lesson/:slug">
                {p => <LessonPage key={p.slug} slug={p.slug} />}
              </Route>
              <Route path="/plan" component={Plan} />
              <Route path="/practice" component={Practice} />
              <Route path="/exam" component={Exam} />
              <Route path="/labs" component={Labs} />
              <Route path="/lab/:id">{p => <LabPage id={p.id} />}</Route>
              <Route path="/flashcards" component={Flashcards} />
              <Route path="/progress" component={Progress} />
              <Route path="/reference" component={Reference} />
              <Route path="/settings" component={Settings} />
              <Route path="/login" component={Login} />
              <Route path="/scenes" component={SceneList} />
              <Route path="/scene/:id/:step">
                {p => <ScenePreview id={p.id} step={p.step} />}
              </Route>
              <Route path="/scene/:id">{p => <ScenePreview id={p.id} />}</Route>
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </Router>
      </AuthProvider>
    </PrefsProvider>
  );
}
