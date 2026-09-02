import React, { useState } from 'react';
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
import { 
  ShieldCheck, Lock, Plus, Save, CheckCircle, Users, Edit3, Trash2, KeyRound
} from 'lucide-react';

export default function AdminRolesPermissions() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const modules = [
    { id: 'm_seekers', name: 'Franchise Seekers' },
    { id: 'm_brands', name: 'Brand Management & Verification' },
    { id: 'm_plans', name: 'Subscription Plans & Pricing' },
    { id: 'm_payments', name: 'Payments, GST & Refunds' },
    { id: 'm_cms', name: 'CMS & Homepage Banners' },
    { id: 'm_reports', name: 'Business Intelligence & Reports' },
    { id: 'm_comm', name: 'Communication & Broadcasts' },
    { id: 'm_settings', name: 'System Settings & API Keys' }
  ];

  const [roles, setRoles] = useState([
    {
      id: 'role_super',
      name: 'Super Admin',
      description: 'Full root access to all modules, billing, and system API settings.',
      isSystem: true,
      permissions: {
        m_seekers: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
        m_brands: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
        m_plans: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
        m_payments: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
        m_cms: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
        m_reports: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
        m_comm: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
        m_settings: ['VIEW', 'CREATE', 'EDIT', 'DELETE']
      }
    },
    {
      id: 'role_ops',
      name: 'Operations Manager',
      description: 'Manages brand verification requests, seeker KYC approvals, and support.',
      isSystem: false,
      permissions: {
        m_seekers: ['VIEW', 'EDIT'],
        m_brands: ['VIEW', 'EDIT'],
        m_plans: ['VIEW'],
        m_payments: ['VIEW'],
        m_cms: ['VIEW', 'EDIT'],
        m_reports: ['VIEW'],
        m_comm: ['VIEW', 'CREATE'],
        m_settings: []
      }
    },
    {
      id: 'role_finance',
      name: 'Finance Specialist',
      description: 'Monitors transactions, handles GST invoices, and processes customer refunds.',
      isSystem: false,
      permissions: {
        m_seekers: ['VIEW'],
        m_brands: ['VIEW'],
        m_plans: ['VIEW', 'EDIT'],
        m_payments: ['VIEW', 'EDIT'],
        m_cms: [],
        m_reports: ['VIEW', 'CREATE'],
        m_comm: [],
        m_settings: []
      }
    }
  ]);

  const [selectedRoleId, setSelectedRoleId] = useState<string>('role_ops');

  const activeRole = roles.find(r => r.id === selectedRoleId) || roles[1];

  const togglePermission = (modId: string, perm: 'VIEW' | 'CREATE' | 'EDIT' | 'DELETE') => {
    if (activeRole.isSystem) {
      showToast('System Super Admin permissions cannot be modified.');
      return;
    }

    setRoles(prev => prev.map(r => {
      if (r.id !== selectedRoleId) return r;
      const currentPerms = (r.permissions as any)[modId] || [];
      const hasPerm = currentPerms.includes(perm);
      const updatedPerms = hasPerm ? currentPerms.filter((p: string) => p !== perm) : [...currentPerms, perm];

      return {
        ...r,
        permissions: {
          ...r.permissions,
          [modId]: updatedPerms
        }
      };
    }));
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-indigo-700 animate-in fade-in">
          <CheckCircle size={18} className="text-blue-500" />
          <span className="text-xs font-bold uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      <AdminBreadcrumbs items={[{ label: 'Super Admin', path: '/admin' }, { label: 'Roles & Permissions' }]} />

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 mb-2 font-heading flex items-center gap-3">
            <Lock size={32} className="text-blue-600" /> Access Control & RBAC Matrix
          </h1>
          <p className="text-slate-600">Configure administrative roles, granular module permissions, and staff privileges.</p>
        </div>

        <button 
          onClick={() => showToast('Saved updated Role Permission Matrix!')}
          className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-indigo-200 flex items-center gap-2 cursor-pointer"
        >
          <Save size={16} /> Save RBAC Matrix
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Role Selector Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-black text-indigo-950 font-heading">Defined Admin Roles</h3>
              <button 
                onClick={() => showToast('Created new custom role draft.')}
                className="p-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {roles.map((r) => (
                <div 
                  key={r.id} 
                  onClick={() => setSelectedRoleId(r.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedRoleId === r.id 
                      ? 'bg-blue-700 text-white border-indigo-900 shadow-md' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm">{r.name}</span>
                    {r.isSystem && (
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${selectedRoleId === r.id ? 'bg-indigo-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        System Core
                      </span>
                    )}
                  </div>
                  <p className={`text-xs font-medium ${selectedRoleId === r.id ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {r.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-indigo-950 font-heading">
                Permissions for <span className="text-blue-500">{activeRole.name}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">{activeRole.description}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase">Module Name</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase text-center">View</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase text-center">Create</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase text-center">Edit</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map((mod) => {
                    const perms = (activeRole.permissions as any)[mod.id] || [];
                    return (
                      <tr key={mod.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-bold text-xs text-indigo-950">{mod.name}</td>
                        {['VIEW', 'CREATE', 'EDIT', 'DELETE'].map((p) => {
                          const isChecked = perms.includes(p);
                          return (
                            <td key={p} className="py-3.5 px-4 text-center">
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                disabled={activeRole.isSystem}
                                onChange={() => togglePermission(mod.id, p as any)}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-40"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
