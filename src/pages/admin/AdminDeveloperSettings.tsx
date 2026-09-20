import React, { useState } from 'react';
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs';
import { Code, Key, Webhook, Terminal, Save, Copy, RefreshCw, Server, Database } from 'lucide-react';

export default function AdminDeveloperSettings() {
  const [activeTab, setActiveTab] = useState<'API' | 'WEBHOOKS' | 'ENVIRONMENT'>('API');

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      <AdminBreadcrumbs items={[{ label: 'Super Admin', path: '/admin' }, { label: 'Developer Settings' }]} />
      
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 font-heading">Developer Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage API keys, webhooks, and advanced platform configurations.</p>
        </div>
        <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer flex items-center gap-2">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        <div className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('API')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'API' ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Key size={18} /> API Keys
          </button>
          <button 
            onClick={() => setActiveTab('WEBHOOKS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'WEBHOOKS' ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Webhook size={18} /> Webhooks
          </button>
          <button 
            onClick={() => setActiveTab('ENVIRONMENT')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'ENVIRONMENT' ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Server size={18} /> Environment
          </button>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 h-full">
            {activeTab === 'API' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">API Credentials</h3>
                  <p className="text-sm text-slate-500 mb-6">Manage authentication keys for external integrations.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Live Secret Key</label>
                    <div className="flex gap-2">
                      <input 
                        type="password" 
                        value="sk_live_51M..." 
                        readOnly
                        className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 font-mono text-sm text-slate-900 dark:text-white"
                      />
                      <button className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 transition-colors">
                        <Copy size={18} />
                      </button>
                      <button className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 transition-colors">
                        <RefreshCw size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Test Secret Key</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value="sk_test_51M..." 
                        readOnly
                        className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 font-mono text-sm text-slate-900 dark:text-white"
                      />
                      <button className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 transition-colors">
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'WEBHOOKS' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Webhook Endpoints</h3>
                    <p className="text-sm text-slate-500">Configure URLs to receive event notifications.</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 font-bold text-xs uppercase rounded-lg hover:bg-blue-100">
                    Add Endpoint
                  </button>
                </div>
                
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                      <tr>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">URL</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Events</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      <tr>
                        <td className="px-4 py-3 text-sm font-mono text-slate-700 dark:text-slate-300">https://api.brizx.com/v1/webhook</td>
                        <td className="px-4 py-3 text-sm text-slate-500">payment.success, user.created</td>
                        <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">Active</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'ENVIRONMENT' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Environment Variables</h3>
                  <p className="text-sm text-slate-500 mb-6">Manage system configuration and external service endpoints.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Database URI</label>
                    <input type="text" defaultValue="postgresql://admin:***@db.brizx.com:5432/main" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Redis Cache</label>
                    <input type="text" defaultValue="redis://cache.brizx.com:6379" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">AI Model Endpoint</label>
                    <input type="text" defaultValue="https://api.openai.com/v1" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
