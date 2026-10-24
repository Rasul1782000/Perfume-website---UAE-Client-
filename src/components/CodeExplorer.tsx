import React, { useState } from 'react';
import { Folder, FileCode, Copy, Check, Search, Terminal, Database, Smartphone, BookOpen, Layers } from 'lucide-react';
import { REPO_FILES, RepoFile } from '../data/repoFiles';

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<RepoFile>(REPO_FILES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'backend' | 'frontend' | 'docs'>('all');

  const filteredFiles = REPO_FILES.filter((file) => {
    const matchesCategory = filterCategory === 'all' || file.category === filterCategory;
    const matchesSearch =
      file.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'backend':
        return <Database className="w-3.5 h-3.5 text-blue-400" />;
      case 'frontend':
        return <Smartphone className="w-3.5 h-3.5 text-emerald-400" />;
      case 'docs':
        return <BookOpen className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-[#090c13] text-slate-200">
      {/* Left Sidebar: File Tree & Navigation */}
      <div className="w-full md:w-80 border-r border-slate-800 flex flex-col shrink-0 bg-[#0b0f17]">
        {/* Search & Filters */}
        <div className="p-3 border-b border-slate-800 space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter repository files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1 overflow-x-auto text-[11px]">
            {(
              [
                { id: 'all', label: 'All Files' },
                { id: 'backend', label: 'NestJS' },
                { id: 'frontend', label: 'Angular' },
                { id: 'docs', label: 'Docs' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id as any)}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-all ${
                  filterCategory === cat.id
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredFiles.map((file) => (
            <button
              key={file.path}
              onClick={() => setSelectedFile(file)}
              className={`w-full text-left p-2 rounded-lg flex items-start gap-2 text-xs transition-all ${
                selectedFile.path === file.path
                  ? 'bg-slate-800/90 text-white font-medium border border-slate-700/60'
                  : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
              }`}
            >
              <div className="mt-0.5 shrink-0">{getCategoryIcon(file.category)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[11px] truncate">{file.path}</p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{file.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-[10px] text-slate-500 flex items-center justify-between font-mono">
          <span>{REPO_FILES.length} Production Artifacts</span>
          <span className="text-emerald-500">Separated /frontend & /backend</span>
        </div>
      </div>

      {/* Right Content: Code Viewer */}
      <div className="flex-1 flex flex-col overflow-hidden bg-black/60">
        {/* File Header Bar */}
        <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-mono text-white truncate font-semibold">{selectedFile.path}</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
              {selectedFile.language}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy File Content</span>
              </>
            )}
          </button>
        </div>

        {/* Description Banner */}
        <div className="px-4 py-1.5 bg-slate-900/40 border-b border-slate-800/60 text-xs text-slate-400">
          {selectedFile.description}
        </div>

        {/* Code Content View */}
        <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 leading-relaxed select-text">
          <pre className="whitespace-pre">{selectedFile.content}</pre>
        </div>
      </div>
    </div>
  );
};
