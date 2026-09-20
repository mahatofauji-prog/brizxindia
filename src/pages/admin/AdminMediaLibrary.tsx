import React, { useState } from 'react';
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs';
import { Image, Video, File, Search, Filter, Upload, Trash2, Folder, Grid, List, MoreVertical, X } from 'lucide-react';

export default function AdminMediaLibrary() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'ALL' | 'IMAGES' | 'VIDEOS' | 'DOCUMENTS'>('ALL');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const mediaFiles = [
    { id: '1', name: 'hero-banner-main.jpg', type: 'image', size: '2.4 MB', date: '2026-08-01', url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80' },
    { id: '2', name: 'brand-logo-dominos.png', type: 'image', size: '450 KB', date: '2026-08-02', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
    { id: '3', name: 'franchise-agreement-template.pdf', type: 'document', size: '1.2 MB', date: '2026-08-03', url: '' },
    { id: '4', name: 'platform-promo-video.mp4', type: 'video', size: '24.5 MB', date: '2026-08-04', url: '' },
    { id: '5', name: 'about-us-team.jpg', type: 'image', size: '3.1 MB', date: '2026-08-05', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80' },
  ];

  const filteredMedia = mediaFiles.filter(m => activeTab === 'ALL' || m.type.toUpperCase() === activeTab.slice(0, -1));

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      <AdminBreadcrumbs items={[{ label: 'Super Admin', path: '/admin' }, { label: 'Media Library' }]} />
      
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 font-heading">Media Library</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage images, videos, and documents used across the BrizX India platform.</p>
        </div>
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer flex items-center gap-2"
        >
          <Upload size={16} /> Upload Media
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col flex-1">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2">
            {['ALL', 'IMAGES', 'VIDEOS', 'DOCUMENTS'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search files..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm focus:border-blue-500 outline-none text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 shrink-0">
              <button onClick={() => setView('grid')} className={`p-1.5 rounded-md ${view === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500'}`}><Grid size={16}/></button>
              <button onClick={() => setView('list')} className={`p-1.5 rounded-md ${view === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500'}`}><List size={16}/></button>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          {view === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map(file => (
                <div key={file.id} className="group relative bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-blue-500 transition-colors cursor-pointer">
                  <div className="aspect-square bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
                    {file.type === 'image' ? (
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover rounded-lg" />
                    ) : file.type === 'video' ? (
                      <Video size={48} className="text-blue-500/50" />
                    ) : (
                      <File size={48} className="text-slate-400" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{file.size} • {file.date}</p>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                    <button className="p-1.5 bg-white dark:bg-slate-700 rounded-md shadow-sm text-red-600 hover:bg-red-50"><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">File Name</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Type</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Size</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Date Added</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedia.map(file => (
                  <tr key={file.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                          {file.type === 'image' ? <img src={file.url} className="w-full h-full object-cover" /> : file.type === 'video' ? <Video size={16} className="text-blue-500" /> : <File size={16} className="text-slate-400" />}
                        </div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{file.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500 capitalize">{file.type}</td>
                    <td className="py-3 px-4 text-sm text-slate-500">{file.size}</td>
                    <td className="py-3 px-4 text-sm text-slate-500">{file.date}</td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-slate-400 hover:text-red-600 p-1"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative border border-slate-200 dark:border-slate-700">
            <button onClick={() => setIsUploadOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X size={20} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Upload Media</h3>
            <p className="text-xs text-slate-500 mb-6">Upload images, documents, or videos to the media library.</p>
            
            <div className="border-2 border-dashed border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-10 text-center mb-6 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <Upload size={48} className="text-blue-500 mb-4" />
              <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-500">SVG, PNG, JPG, PDF or MP4 (max. 50MB)</p>
            </div>
            
            <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button onClick={() => setIsUploadOpen(false)} className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase rounded-xl">Cancel</button>
              <button onClick={() => setIsUploadOpen(false)} className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs uppercase rounded-xl">Upload Files</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
