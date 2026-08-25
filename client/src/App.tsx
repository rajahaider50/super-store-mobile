/* Quiet Commerce reminder: warm porcelain canvas, ink graphite hierarchy, Signal Mint actions, calm editorial commerce rhythm. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";

function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster position="top-center" richColors />
        <Home />
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;
