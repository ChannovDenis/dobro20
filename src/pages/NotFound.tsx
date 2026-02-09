import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">Страница не найдена</p>
        <a 
          href="/feed" 
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-glow"
        >
          Вернуться на главную
        </a>
      </div>
    </div>
  );
};

export default NotFound;
