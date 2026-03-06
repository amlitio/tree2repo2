import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import JSZip from 'jszip';
import { 
  Terminal, 
  Zap, 
  ArrowRight, 
  Download, 
  Github, 
  CheckCircle2, 
  Code2, 
  Cpu, 
  Layers,
  ChevronRight
} from 'lucide-react';

const TEMPLATES = {
  python: `weather-pro-repo/\n├──.gitignore\n├── LICENSE\n├── README.md\n├── pyproject.toml\n├── src/\n│   └── weather_pro/\n│       ├── __init__.py\n│       └── converter.py\n└── tests/\n    └── test_converter.py`,
  react: `my-react-app/\n├── public/\n│   ├── index.html\n│   └── favicon.ico\n├── src/\n│   ├── components/\n│   │   └── Header.jsx\n│   ├── App.js\n│   └── index.js\n├──.gitignore\n├── package.json\n└── README.md`,
  node: `node-api-server/\n├── src/\n│   ├── controllers/\n│   ├── models/\n│   ├── routes/\n│   └── app.js\n├──.env\n├── package.json\n└── README.md`
};

function parseTree(treeText) {
  const lines = treeText.split('\n');
  const structure =;
  const pathStack =;

  for (const rawLine of lines) {
    if (!rawLine.trim()) continue;
    const cleanLine = rawLine.split('<--').replace(/\t/g, '    ');
    if (!cleanLine.trim()) continue;

    const hasConnector = /[├└│]/.test(cleanLine);
    let depth = 0;
    let name = cleanLine.trim();

    if (hasConnector) {
      const connectorMatch = cleanLine.match(/^((?:│ | )*)(?:├── |└── )(.*)$/);
      if (!connectorMatch) continue;
      const prefix = connectorMatch[1] |

| '';
      name = (connectorMatch[2] |

| '').trim();
      depth = Math.floor(prefix.length / 4) + 1;
    }

    if (!name) continue;
    const isFolder = name.endsWith('/');
    const normalizedName = isFolder? name.slice(0, -1) : name;

    while (pathStack.length > depth) {
      pathStack.pop();
    }

    const parentPath = pathStack.length > 0? pathStack : '';
    const fullPath = parentPath? `${parentPath}/${normalizedName}` : normalizedName;

    structure.push({ name, normalizedName, isFolder, depth, fullPath });

    if (isFolder) {
      pathStack[depth] = fullPath;
      pathStack.length = depth + 1;
    }
  }
  return structure;
}

export default function Tree2Repo() {
  const = useState(false);
  const = useState(TEMPLATES.python);
  const [preview, setPreview] = useState();
  const = useState('idle');

  useEffect(() => {
    setPreview(parseTree(treeText));
  },);

  const generateZip = async () => {
    setStatus('processing');
    try {
      const zip = new JSZip();
      const structure = parseTree(treeText);
      for (const item of structure) {
        if (item.isFolder) { zip.folder(item.fullPath); } 
        else { zip.file(item.fullPath, ''); }
      }
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'project-structure.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setShowModal(true);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-sans selection:bg-[#00FF85]/30 scroll-smooth relative overflow-x-hidden">
      <Head>
        <title>Tree2Repo | Visual Scaffolding Engine</title>
        <meta name="description" content="Synthesize visual ASCII diagrams into downloadable repository structures instantly." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Aave-Style Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#00FF85]/5 blur-[120px] rounded-full pointer-events-none z-0 opacity-40"></div>
      <div className="fixed bottom-0 right-[-5%] w-[500px] h-[500px] bg-emerald-900/10 blur-[100px] rounded-full pointer-events-none z-0 opacity-30"></div>

      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/70 backdrop-blur-xl px-6">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#00FF85] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,133,0.4)]">
              <Terminal className="text-black w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-white font-bold tracking-tighter text-xl">Tree2Repo</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
             <a href="#tool" className="bg-[#00FF85] px-5 py-2.5 rounded-xl text-black text-xs font-black hover:bg-emerald-400 transition-all shadow-lg shadow-[#00FF85]/10">Launch Engine</a>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* LANDING PAGE HERO */}
        <section className="px-6 pt-40 pb-32 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00FF85]/10 border border-[#00FF85]/20 text-[#00FF85] text-[10px] uppercase tracking-widest font-black mb-8">
            <Zap className="w-3.5 h-3.5 fill-current" /> Build Better Repos
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-10">
            Visualize. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF85] via-emerald-400 to-[#00FF85]">
              Synthesize.
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-zinc-500 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            Stop manually creating boilerplate folders. Tree2Repo instantly converts visual diagrams into structured, ready-to-code local repositories.
          </p>
          <a href="#tool" className="px-10 py-5 bg-[#00FF85] text-black font-black text-xl rounded-2xl shadow-[0_0_40px_rgba(0,255,133,0.3)] hover:shadow-[0_0_60px_rgba(0,255,133,0.5)] transition-all hover:-translate-y-1 inline-flex items-center gap-3">
            Start Building For Free <ArrowRight className="w-6 h-6 stroke-[3]" />
          </a>
        </section>

        {/* GENERATOR TOOL */}
        <section id="tool" className="px-6 py-24 max-w-7xl mx-auto border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="text-left">
              <h2 className="text-3xl font-black text-white tracking-tight">Synthesizer Engine</h2>
              <p className="text-zinc-500 text-sm mt-1 italic opacity-80">Design your architecture. Download the package.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto bg-white/5 p-1.5 rounded-2xl border border-white/5">
               {['python', 'react', 'node'].map((t) => (
                 <button 
                  key={t}
                  onClick={() => setTreeText(TEMPLATES[t])}
                  className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:text-white ${treeText === TEMPLATES[t]? 'bg-white/10 text-[#00FF85]' : 'text-zinc-500'}`}
                 >
                   {t}
                 </button>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full text-left">
            <div className="bg-[#0c0c0c] border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl flex flex-col group transition-all hover:border-[#00FF85]/30">
              <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                Input Diagram
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00FF85]/40"></div>
                </div>
              </div>
              <textarea
                className="w-full h-[450px] lg:h-[550px] bg-transparent p-8 font-mono text-sm text-[#00FF85] outline-none resize-none leading-loose"
                value={treeText}
                onChange={(e) => setTreeText(e.target.value)}
                spellCheck={false}
              />
            </div>

            <div className="bg-[#0c0c0c] border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl flex flex-col group transition-all hover:border-[#00FF85]/30 relative">
              <div className="px-8 py-5 border-b border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                Live Synthesis Preview
              </div>
              <div className="p-8 h-[450px] lg:h-[550px] overflow-y-auto font-mono text-sm space-y-2.5 custom-scroll">
                {preview.length === 0? (
                  <div className="text-zinc-800 italic text-center pt-20">Awaiting visual input...</div>
                ) : (
                  preview.map((item, i) => (
                    <div key={i} style={{ paddingLeft: `${item.depth * 28}px` }} className="flex items-center gap-4 transition-all hover:translate-x-1">
                      <span className="text-zinc-600 text-lg opacity-60">{item.isFolder? '📁' : '📄'}</span>
                      <span className={item.isFolder? 'text-[#00FF85] font-black' : 'text-zinc-200 font-medium'}>{item.name}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="p-8 bg-black/60 backdrop-blur-2xl border-t border-white/5">
                <button
                  onClick={generateZip}
                  disabled={status === 'processing'}
                  className={`w-full py-5 rounded-2xl font-black text-sm tracking-[0.1em] transition-all flex items-center justify-center gap-3 ${
                    status === 'processing'? 'bg-zinc-800 text-zinc-600' : 
                    status === 'success'? 'bg-emerald-600 text-white shadow-lg' : 
                    'bg-[#00FF85] hover:bg-[#00e678] text-black shadow-xl shadow-[#00FF85]/20'
                  }`}
                >
                  <Download className="w-6 h-6 stroke-[2.5]" />
                  {status === 'processing'? 'SYNTESIZING...' : status === 'success'? 'DOWNLOAD COMPLETE' : 'GENERATE REPOSITORY'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="px-6 py-32 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
           <div className="p-10 bg-white/[0.02] border border-white/10 rounded-[2.5rem] space-y-6 hover:bg-white/[0.04] transition-all">
              <Code2 className="text-[#00FF85] w-10 h-10" />
              <h3 className="text-white font-black text-xl tracking-tight">Advanced Parsing</h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-medium">Handles pipes, tabs, and box-drawing characters natively. Strips inline comments automatically.</p>
           </div>
           <div className="p-10 bg-white/[0.02] border border-white/10 rounded-[2.5rem] space-y-6 hover:bg-white/[0.04] transition-all">
              <Layers className="text-[#00FF85] w-10 h-10" />
              <h3 className="text-white font-black text-xl tracking-tight">Deep Nesting</h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-medium">Our stack-based depth engine handles 20+ levels of directory complexity with zero fragmentation.</p>
           </div>
           <div className="p-10 bg-white/[0.02] border border-white/10 rounded-[2.5rem] space-y-6 hover:bg-white/[0.04] transition-all">
              <Cpu className="text-[#00FF85] w-10 h-10" />
              <h3 className="text-white font-black text-xl tracking-tight">Client-Side Blob</h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-medium">Synthesis happens in your browser's RAM using JSZip for total privacy and speed.</p>
           </div>
        </section>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0a] border border-white/10 p-12 rounded-[3rem] max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-24 h-24 bg-[#00FF85]/10 text-[#00FF85] rounded-full flex items-center justify-center mx-auto mb-8 border border-[#00FF85]/20 shadow-[0_0_30px_rgba(0,255,133,0.15)]">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>
            <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">System Ready</h3>
            <p className="text-zinc-500 font-medium mb-10 leading-relaxed text-sm">Synthesis complete. Check your <b>Downloads</b> folder for the ZIP file.</p>
            <button onClick={() => setShowModal(false)} className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">Close System</button>
          </div>
        </div>
      )}

      <footer className="px-6 py-16 border-t border-white/5 text-center text-[10px] text-zinc-700 font-black tracking-[0.4em] uppercase">
        &copy; 2026 Tree2Repo &bull; Optimized for Vercel
      </footer>
    </div>
  );
}