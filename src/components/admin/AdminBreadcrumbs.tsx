import React from 'react';
import { Link, useLocation } from 'react-router';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

export function AdminBreadcrumbs({ items }: { items?: BreadcrumbItem[] }) {
  const location = useLocation();

  const getDefaultItems = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Super Admin', path: '/admin' }];

    if (pathSegments.length > 1) {
      const currentSegment = pathSegments[1];
      const formattedLabel = currentSegment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
      breadcrumbs.push({ label: formattedLabel });
    }

    return breadcrumbs;
  };

  const breadcrumbsToRender = items || getDefaultItems();

  return (
    <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4 bg-white/60 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200/60 w-fit shadow-xs">
      <Link to="/admin" className="flex items-center gap-1 hover:text-blue-700 transition-colors">
        <Home size={14} className="text-slate-400" />
      </Link>
      {breadcrumbsToRender.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={12} className="text-slate-300" />
          {item.path && index < breadcrumbsToRender.length - 1 ? (
            <Link to={item.path} className="hover:text-blue-700 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-indigo-950 font-bold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
