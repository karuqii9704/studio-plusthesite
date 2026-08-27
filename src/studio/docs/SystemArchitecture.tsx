
export const SystemArchitecture = () => (
  <div className="flex h-full flex-col">
    <div className="mb-6 text-center">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
        System Architecture (Class Diagram)
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Representasi visual struktur data inti.
      </p>
    </div>
    <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-slate-900/50">
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>
        <line
          x1="50%"
          y1="180"
          x2="30%"
          y2="350"
          stroke="#64748b"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        <line
          x1="50%"
          y1="180"
          x2="70%"
          y2="350"
          stroke="#64748b"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        <line
          x1="70%"
          y1="450"
          x2="70%"
          y2="520"
          stroke="#64748b"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
      </svg>

      <div className="relative flex h-[600px] w-full max-w-4xl flex-col items-center justify-between py-10">
        <div className="z-10 w-64 rounded-lg border-2 border-sky-500 bg-white shadow-[0_0_20px_rgba(255,255,255,0.25)] dark:bg-slate-800">
          <div className="border-b border-sky-500 bg-sky-100 p-2 text-center text-sm font-bold text-sky-700 dark:bg-sky-500/30 dark:text-white">
            UserController
          </div>
          <div className="space-y-1 p-3 font-mono text-xs text-slate-600 dark:text-slate-300">
            <p>+ userId: String</p>
            <p>+ email: String</p>
            <hr className="my-1 border-slate-300 dark:border-slate-600" />
            <p>+ createCampaign()</p>
            <p>+ generateContent()</p>
          </div>
        </div>

        <div className="flex w-full justify-between px-20">
          <div className="z-10 w-64 rounded-lg border border-sky-500 bg-white shadow-lg dark:bg-slate-800">
            <div className="border-b border-sky-500 bg-sky-100 p-2 text-center text-sm font-bold text-sky-800 dark:bg-sky-500/20 dark:text-white">
              PlannerModule
            </div>
            <div className="space-y-1 p-3 font-mono text-xs text-slate-600 dark:text-slate-300">
              <p>+ campaignId: UUID</p>
              <p>+ startDate: Date</p>
              <hr className="my-1 border-slate-300 dark:border-slate-600" />
              <p>+ generateSchedule()</p>
            </div>
          </div>

          <div className="z-10 w-64 rounded-lg border border-cyan-500 bg-white shadow-lg dark:bg-slate-800">
            <div className="border-b border-cyan-500 bg-cyan-100 p-2 text-center text-sm font-bold text-cyan-800 dark:bg-cyan-500/20 dark:text-white">
              AIService
            </div>
            <div className="space-y-1 p-3 font-mono text-xs text-slate-600 dark:text-slate-300">
              <p>+ model: Gemini-Flash</p>
              <p>+ apiKey: SecureString</p>
              <hr className="my-1 border-slate-300 dark:border-slate-600" />
              <p>+ callTextAPI(prompt)</p>
              <p>+ callImageAPI(prompt)</p>
            </div>
          </div>
        </div>

        <div className="z-10 mt-auto w-64 rounded-lg border border-green-500 bg-white shadow-lg dark:bg-slate-800">
          <div className="border-b border-green-500 bg-green-100 p-2 text-center text-sm font-bold text-green-900 dark:bg-green-500/20 dark:text-white">
            GoogleCloudPlatform
          </div>
          <div className="space-y-1 p-3 font-mono text-xs text-slate-600 dark:text-slate-300">
            <p>+ Vertex AI</p>
            <p>+ Cloud Storage</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
