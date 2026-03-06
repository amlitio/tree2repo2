import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import JSZip from 'jszip';
import { Terminal, Zap, ArrowRight, Download, Github, CheckCircle2, Layout, Shield } from 'lucide-react';

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
      depth = (prefix.length / 4) + 1;
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
      const content = await zip.generateAsync({ type: 'blob' });
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
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-sans selection:bg-[#00FF85]/30 scroll-smooth relative">
      <Head>
        <title>Tree2Repo | ASCII to Folder Structure Synthesizer</title>
        <meta name="description" content="Instantly convert ASCII directory trees into downloadable repository packages. The ultimate developer utility for project scaffolding." />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Aave-Style Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#00FF85]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-emerald-900/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00FF85] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,255,133,0.4)]">
              <Terminal className="text-black w-5 h-5" />
            </div>
            <span className="text-white font-bold tracking-tight text-lg">Tree2Repo</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="https://github.com/amlitio/tree2repo" className="text-zinc-500 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#tool" className="bg-[#00FF85] px-4 py-2 rounded-lg text-black text-xs font-bold hover:bg-emerald-400 transition-all">Launch App</a>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* ================= HERO SECTION ================= */}
        <section className="px-6 pt-32 pb-24 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF85]/10 border border-[#00FF85]/20 text-[#00FF85] text-[10px] uppercase tracking-widest font-bold mb-6">
            <Zap className="w-3 h-3 fill-current" /> Instant Scaffolding
          </div>
          <h1 className="text-5xl md:text-8xl font-extrabold text-white tracking-tighter leading-[0.9] mb-8">
            Visualize. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF85] via-emerald-400 to-[#00FF85]">
              Synthesize.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop the manual directory grind. Tree2Repo takes your visual ASCII diagrams and turns them into ready-to-code local repositories in one click.
          </p>
          <a href="#tool" className="px-10 py-5 bg-[#00FF85] text-black font-black text-lg rounded-2xl shadow-[0_0_40px_rgba(0,255,133,0.3)] hover:shadow-[0_0_60px_rgba(0,255,133,0.5)] transition-all hover:-translate-y-1 inline-flex items-center gap-2">
            Build Your Repo For Free <ArrowRight className="w-5 h-5" />
          </a>
        </section>

        {/* ================= TOOL SECTION ================= */}
        <section id="tool" className="px-6 py-20 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Synthesizer Engine</h2>
            <select
              onChange={(e) => setTreeText(TEMPLATES[e.target.value] |

| '')}
              className="bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-sm text-zinc-300 outline-none focus:border-[#00FF85] transition-all cursor-pointer"
              defaultValue="python"
            >
              <option value="python">Python Template</option>
              <option value="react">React Starter</option>
              <option value="node">Node API</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Glassy Editor */}
            <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-3xl shadow-2xl flex flex-col group transition-all hover:border-[#00FF85]/20">
              <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Input Architecture</span>
              </div>
              <textarea
                className="w-full h-[400px] lg:h-[500px] bg-transparent p-6 font-mono text-sm text-[#00FF85] outline-none resize-none leading-relaxed"
                value={treeText}
                onChange={(e) => setTreeText(e.target.value)}
                spellCheck={false}
              />
            </div>

            {/* Glassy Preview */}
            <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-3xl shadow-2xl flex flex-col group transition-all hover:border-[#00FF85]/20 relative">
              <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Live Synthesis Preview</span>
              </div>
              <div className="p-8 h-[400px] lg:h-[500px] overflow-y-auto font-mono text-xs md:text-sm space-y-2 custom-scroll">
                {preview.map((item, i) => (
                  <div key={i} style={{ paddingLeft: `${item.depth * 24}px` }} className="flex items-center gap-3 transition-all">
                    <span className="text-zinc-600">{item.isFolder? '📁' : '📄'}</span>
                    <span className={item.isFolder? 'text-[#00FF85] font-bold' : 'text-zinc-300'}>{item.name}</span>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-black/40 backdrop-blur-xl border-t border-white/5">
                <button
                  onClick={generateZip}
                  disabled={status === 'processing'}
                  className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    status === 'processing'? 'bg-zinc-800 text-zinc-500' : 
                    status === 'success'? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 
                    'bg-[#00FF85] hover:bg-emerald-400 text-black shadow-lg'
                  }`}
                >
                  <Download className="w-5 h-5" />
                  {status === 'processing'? 'SYNTHESIZING...' : status === 'success'? 'DOWNLOADED' : 'GENERATE REPOSITORY'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES SECTION ================= */}
        <section className="px-6 py-32 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="p-8 bg-white/[0.02] border border-white/10 rounded-3xl space-y-4">
              <Shield className="text-[#00FF85]" />
              <h3 className="text-white font-bold">Privacy-First</h3>
              <p className="text-sm text-zinc-500">Your architecture stays in your browser. Synthesis happens entirely client-side using JSZip.</p>
           </div>
           <div className="p-8 bg-white/[0.02] border border-white/10 rounded-3xl space-y-4">
              <Layout className="text-[#00FF85]" />
              <h3 className="text-white font-bold">Deep Nesting</h3>
              <p className="text-sm text-zinc-500">Our stack-based depth engine handles complex 10+ level deep structures with zero error.</p>
           </div>
           <div className="p-8 bg-white/[0.02] border border-white/10 rounded-3xl space-y-4">
              <Zap className="text-[#00FF85]" />
              <h3 className="text-white font-bold">Boilerplate Killer</h3>
              <p className="text-sm text-zinc-500">Skip the manual `mkdir` loop. Paste from your favorite tutorial and start coding immediately.</p>
           </div>
        </section>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0c0c0c] border border-white/10 p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-[#00FF85]/10 text-[#00FF85] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#00FF85]/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Build Ready</h3>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed">Synthesis complete. Check your <b>Downloads</b> folder for your new structure.</p>
            <button onClick={() => setShowModal(false)} className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-widest">Dismiss</button>
          </div>
        </div>
      )}
    </div>
  );
}