import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Commands from "@/pages/Commands";
import Configuration from "@/pages/Configuration";
import ErrorLogs from "@/pages/ErrorLogs";
import Documentation from "@/pages/Documentation";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/commands" component={Commands} />
      <Route path="/configuration" component={Configuration} />
      <Route path="/logs" component={ErrorLogs} />
      <Route path="/docs" component={Documentation} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Router />
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
