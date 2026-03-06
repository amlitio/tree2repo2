import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import JSZip from 'jszip';

const TEMPLATES = {
  python: `weather-pro-repo/
├── .gitignore
├── LICENSE
├── README.md
├── pyproject.toml
├── src/
│   └── weather_pro/
│       ├── __init__.py
│       └── converter.py
└── tests/
    └── test_converter.py`,
  react: `my-react-app/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── Header.jsx
│   ├── App.js
│   └── index.js
├── .gitignore
├── package.json
└── README.md`,
  node: `node-api-server/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── app.js
├── .env
├── package.json
└── README.md`,
};

function parseTree(treeText) {
  const lines = treeText.split('\n');
  const structure = [];
  const pathStack = [];

  for (const rawLine of lines) {
    if (!rawLine.trim()) continue;

    const cleanLine = rawLine.split('<--')[0].replace(/\t/g, '    ');
    if (!cleanLine.trim()) continue;

    const hasConnector = /[├└│]/.test(cleanLine);
    let depth = 0;
    let name = cleanLine.trim();

    if (hasConnector) {
      const connectorMatch = cleanLine.match(/^((?:│\s{3}|\s{4})*)(?:├── |└── )(.*)$/);
      if (!connectorMatch) continue;

      const prefix = connectorMatch[1] || '';
      name = (connectorMatch[2] || '').trim();
      depth = prefix.length / 4 + 1;
    }

    if (!name) continue;

    const isFolder = name.endsWith('/');
    const normalizedName = isFolder ? name.slice(0, -1) : name;

    while (pathStack.length > depth) {
      pathStack.pop();
    }

    const parentPath = pathStack.length > 0 ? pathStack[pathStack.length - 1] : '';
    const fullPath = parentPath ? `${parentPath}/${normalizedName}` : normalizedName;

    structure.push({
      name,
      normalizedName,
      isFolder,
      depth,
      fullPath,
    });

    if (isFolder) {
      pathStack[depth] = fullPath;
      pathStack.length = depth + 1;
    }
  }

  return structure;
}

export default function TreeToRepo() {
  const [showModal, setShowModal] = useState(false);
  const [treeText, setTreeText] = useState(TEMPLATES.python);
  const [preview, setPreview] = useState([]);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    setPreview(parseTree(treeText));
  }, [treeText]);

  const generateZip = async () => {
    setStatus('processing');

    try {
      const zip = new JSZip();
      const structure = parseTree(treeText);

      for (const item of structure) {
        if (item.isFolder) {
          zip.folder(item.fullPath);
        } else {
          zip.file(item.fullPath, '');
        }
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
      console.error('ZIP generation failed:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-300 font-sans relative overflow-hidden selection:bg-green-500/30">
      <Head>
        <title>Tree2Repo | ASCII to Repository</title>
        <meta
          name="description"
          content="Paste an ASCII tree and generate a downloadable project ZIP."
        />
      </Head>

      <div className="fixed top-[-20%] left-[-10%] w-[70vh] h-[70vh] rounded-full bg-green-500/10 blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[70vh] h-[70vh] rounded-full bg-emerald-700/10 blur-[150px] pointer-events-none z-0" />

      <div className="relative z-10">
        <section className="flex flex-col items-center justify-center min-h-screen px-4 text-center pb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-green-400 text-sm mb-8 backdrop-blur-md shadow-2xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Tree2Repo v2.0 is Live
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-white mb-6 drop-shadow-lg">
            Visualize. <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              Synthesize.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
            Stop manually creating boilerplate folders. Paste your ASCII directory tree from any
            tutorial or docs, and instantly generate a ready-to-code repository package.
          </p>

          <a
            href="#tool"
            className="px-8 py-4 bg-[#00FF85] hover:bg-[#00e678] text-black text-lg font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(0,255,133,0.3)] hover:shadow-[0_0_50px_rgba(0,255,133,0.5)] hover:-translate-y-1"
          >
            Start Building for Free
          </a>
        </section>

        <section id="tool" className="max-w-7xl mx-auto px-4 md:px-10 pb-32 pt-10 min-h-screen">
          <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white">Project Generator</h2>
              <p className="text-zinc-500 text-sm mt-1">
                Configure your structure and download.
              </p>
            </div>

            <select
              onChange={(e) => setTreeText(TEMPLATES[e.target.value] || '')}
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 text-zinc-300 backdrop-blur-md cursor-pointer transition-colors hover:bg-white/5"
              defaultValue="python"
            >
              <option value="python">Load Python Template</option>
              <option value="react">Load React Template</option>
              <option value="node">Load Node Template</option>
            </select>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <div className="bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all hover:bg-white/[0.04]">
                <div className="bg-black/20 px-6 py-4 border-b border-white/5 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs font-mono uppercase tracking-widest text-zinc-500">
                    ASCII Input
                  </span>
                </div>

                <textarea
                  className="w-full h-[450px] bg-transparent p-6 font-mono text-sm text-[#00FF85] outline-none resize-none leading-relaxed"
                  value={treeText}
                  onChange={(e) => setTreeText(e.target.value)}
                  spellCheck={false}
                />
              </div>

              <button
                onClick={generateZip}
                disabled={status === 'processing'}
                className={`w-full py-5 rounded-xl font-bold text-lg transition-all ${
                  status === 'processing'
                    ? 'bg-white/5 border border-white/10 text-zinc-500 cursor-not-allowed'
                    : status === 'success'
                      ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(22,163,74,0.4)]'
                      : status === 'error'
                        ? 'bg-red-600 text-white'
                        : 'bg-[#00FF85] hover:bg-[#00e678] text-black shadow-[0_0_30px_rgba(0,255,133,0.2)] hover:shadow-[0_0_40px_rgba(0,255,133,0.4)]'
                }`}
              >
                {status === 'processing'
                  ? 'Compiling...'
                  : status === 'success'
                    ? '✓ Downloaded Successfully'
                    : status === 'error'
                      ? 'Failed — Check Syntax'
                      : 'Download Project ZIP'}
              </button>
            </div>

            <div className="bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all hover:bg-white/[0.04]">
              <div className="bg-black/20 px-6 py-4 border-b border-white/5">
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                  Live Architecture Preview
                </span>
              </div>

              <div className="p-6 overflow-y-auto h-[450px] font-mono text-sm space-y-2">
                {preview.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                    No valid structure detected.
                  </div>
                ) : (
                  preview.map((item, i) => (
                    <div
                      key={`${item.fullPath}-${i}`}
                      style={{ paddingLeft: `${item.depth * 24}px` }}
                      className="flex items-center gap-3 group"
                    >
                      <span className="text-zinc-500 drop-shadow-md">
                        {item.isFolder ? '📁' : '📄'}
                      </span>
                      <span
                        className={
                          item.isFolder ? 'text-[#00FF85] font-semibold' : 'text-zinc-300'
                        }
                      >
                        {item.name}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-[#121212]/90 border border-white/10 backdrop-blur-xl p-10 rounded-3xl max-w-sm w-full text-center shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 bg-green-500/10 text-[#00FF85] rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(0,255,133,0.15)]">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">System Ready</h3>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                Your repository architecture has been synthesized. Please check your{' '}
                <b>Downloads</b> folder for the completed build.
              </p>

              <button
                onClick={() => setShowModal(false)}
                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-bold transition-all"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
