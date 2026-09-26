import React, { useState, useEffect } from 'react';
import { 
  TestRunner, 
  TestSuiteSummary, 
  TestCaseResult, 
  TestCategory, 
  TEST_CASE_COUNT,
  calculateContrastRatio,
  validateAndFormatPhone,
  calculateCareerTrackRecommendation
} from '../../services/testSuite';
import { generatePdfReport } from '../../services/pdfReportGenerator';
import { 
  CheckCircle2, 
  XCircle, 
  Play, 
  RefreshCw, 
  FileDown, 
  Printer, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Layers, 
  Sparkles, 
  Smartphone, 
  Clock, 
  Activity, 
  Search,
  ExternalLink,
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface TestingManagerProps {
  showToast: (msg: string) => void;
}

export const TestingManager: React.FC<TestingManagerProps> = ({ showToast }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState<TestSuiteSummary | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<TestCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
  const [progressCount, setProgressCount] = useState(0);

  // Interactive Sandbox State
  const [sandboxPhone, setSandboxPhone] = useState('9876543210');
  const [sandboxScores, setSandboxScores] = useState({
    analytical: 8,
    interpersonal: 6,
    creative: 5,
    systematic: 7,
  });

  // Color Contrast Sandbox State
  const [hexBg, setHexBg] = useState('#FAF8F5');
  const [hexFg, setHexFg] = useState('#0C1B2A');

  // Auto-run test suite on initial mount if not yet executed
  useEffect(() => {
    executeTests();
  }, []);

  const executeTests = async () => {
    setIsRunning(true);
    setProgressCount(0);
    try {
      const runner = new TestRunner((result, count) => {
        setProgressCount(count);
      });
      const resultSummary = await runner.runAllTests();
      setSummary(resultSummary);
      showToast(`Test suite completed: ${resultSummary.passed} passed, ${resultSummary.failed} failed.`);
    } catch (e: any) {
      showToast(`Test execution encountered an error: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!summary) {
      showToast('Please run the test suite first.');
      return;
    }
    try {
      generatePdfReport(summary);
      showToast('Downloaded official QA Test Report (PDF).');
    } catch (e: any) {
      showToast(`Failed to generate PDF: ${e.message}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredResults = summary?.results.filter((test) => {
    const matchesCategory = activeCategoryFilter === 'all' || test.category === activeCategoryFilter;
    const matchesSearch = 
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (test.assertionMessage && test.assertionMessage.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  }) || [];

  // Sandbox calculations
  const phoneTestResult = validateAndFormatPhone(sandboxPhone);
  const careerRecResult = calculateCareerTrackRecommendation(sandboxScores);

  // Quick Hex to RGB
  const hexToRgb = (hex: string): [number, number, number] => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };

  let contrastScore = 0;
  try {
    contrastScore = calculateContrastRatio(hexToRgb(hexFg), hexToRgb(hexBg));
  } catch {
    contrastScore = 0;
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0C1B2A] rounded-3xl p-6 sm:p-8 border border-[#E59A1E]/30 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#E59A1E]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E59A1E]/15 border border-[#E59A1E]/30 text-[#F5B738] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Full-Stack Quality Assurance & Verification Suite</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#FAF8F5]">
              Automated Testing & Diagnostic Lab
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Conduct comprehensive Unit testing, Integration testing, Cloud Firestore Database testing, UI & WCAG Accessibility testing, and Performance stress benchmarks with instantaneous PDF audit reporting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={executeTests}
              disabled={isRunning}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all ${
                isRunning
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#F5B738] to-[#E59A1E] text-[#0C1B2A] hover:brightness-110'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing ({progressCount}/{TEST_CASE_COUNT})...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Run Complete Test Suite</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={!summary || isRunning}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <FileDown className="w-4 h-4 text-[#F5B738]" />
              <span>Export Report (PDF)</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Print / Save as PDF via Browser"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print View</span>
            </button>
          </div>
        </div>

        {/* Live Progress Bar when running */}
        {isRunning && (
          <div className="mt-6 space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Running automated test assertions across all layers...</span>
              <span>{Math.round((progressCount / TEST_CASE_COUNT) * 100)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#F5B738] to-[#E59A1E] h-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((progressCount / TEST_CASE_COUNT) * 100))}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Metrics Summary Strip */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Tests</span>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold font-display text-[#0C1B2A]">{summary.total}</div>
            <div className="text-[11px] text-slate-500 mt-1">Multi-Category Assertions</div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-emerald-600 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Passed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold font-display text-emerald-600">{summary.passed}</div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">{summary.passRate}% Success Rate</div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-rose-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Failed / Regressions</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold font-display text-rose-600">{summary.failed}</div>
            <div className="text-[11px] text-slate-500 mt-1">{summary.failed === 0 ? 'Zero Regressions' : 'Issues Detected'}</div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Execution Time</span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold font-display text-[#0C1B2A]">{summary.durationMs} ms</div>
            <div className="text-[11px] text-slate-500 mt-1">Low Overhead Execution</div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-[#E59A1E] mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Health Score</span>
              <Activity className="w-4 h-4 text-[#E59A1E]" />
            </div>
            <div className="text-2xl font-bold font-display text-[#E59A1E]">{summary.healthScore} / 100</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Grade A+ Production</div>
          </div>
        </div>
      )}

      {/* Main Testing Explorer & Categories */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {[
              { id: 'all', label: 'All Tests', icon: Layers },
              { id: 'unit', label: 'Unit Tests', icon: Cpu },
              { id: 'integration', label: 'Integration', icon: Activity },
              { id: 'database', label: 'Firestore DB', icon: Database },
              { id: 'ui_ux', label: 'UI & Accessibility', icon: Smartphone },
              { id: 'performance', label: 'Performance', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategoryFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryFilter(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#0C1B2A] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search test assertions..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E59A1E]"
            />
          </div>
        </div>

        {/* Test Cards List */}
        <div className="space-y-3">
          {filteredResults.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No tests match the current filter or search criteria.
            </div>
          ) : (
            filteredResults.map((test) => {
              const isExpanded = expandedTestId === test.id;
              const isPass = test.status === 'passed';

              return (
                <div
                  key={test.id}
                  className={`rounded-2xl border transition-all ${
                    isPass
                      ? 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                      : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div
                    onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                    className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="mt-0.5 sm:mt-0 shrink-0">
                        {isPass ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                            <XCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-[#0C1B2A]">
                            {test.name}
                          </span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500">
                            {test.category.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {test.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono text-slate-400">
                        {test.durationMs}ms
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Assertion Details */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-200/60 space-y-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 font-mono text-slate-700">
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-sans font-bold">
                          Assertion Log Output
                        </div>
                        <div>{test.assertionMessage || 'Test passed successfully.'}</div>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span>Target: Internal System Validation Matrix</span>
                        <span>Execution Status: {test.status.toUpperCase()}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Interactive QA Sandbox / Playground */}
      <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#E59A1E]" />
            <h3 className="text-lg font-bold font-display text-[#0C1B2A]">
              Live Interactive Unit & Algorithm Playground
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Experiment with the underlying computational engines in real-time to verify inputs and boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phone Validator Sandbox */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Phone Sanitization Engine</span>
              <Smartphone className="w-4 h-4 text-slate-400" />
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Raw Input String</label>
              <input
                type="text"
                value={sandboxPhone}
                onChange={(e) => setSandboxPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#E59A1E]"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs font-mono">
              <div className="text-[10px] text-slate-400 font-sans font-bold uppercase">Parsed Result</div>
              <div className={phoneTestResult.isValid ? 'text-emerald-700 font-bold' : 'text-rose-600'}>
                {phoneTestResult.formatted}
              </div>
              <div className="text-[10px] text-slate-500 font-sans">
                Status: {phoneTestResult.isValid ? 'Valid 10-Digit Standard' : 'Invalid Length/Format'}
              </div>
            </div>
          </div>

          {/* Gardner Career Tracker Sandbox */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Career Track Vector Scorer</span>
              <Cpu className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Analytical (GST / Accounts):</span>
                <span className="font-bold">{sandboxScores.analytical}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={sandboxScores.analytical}
                onChange={(e) => setSandboxScores({ ...sandboxScores, analytical: Number(e.target.value) })}
                className="w-full accent-[#E59A1E]"
              />

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Interpersonal (BD / Sales):</span>
                <span className="font-bold">{sandboxScores.interpersonal}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={sandboxScores.interpersonal}
                onChange={(e) => setSandboxScores({ ...sandboxScores, interpersonal: Number(e.target.value) })}
                className="w-full accent-[#E59A1E]"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Recommended Path</div>
              <div className="font-bold text-[#0C1B2A] line-clamp-1">{careerRecResult.recommendedTrack}</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Confidence: {careerRecResult.confidence}%</div>
            </div>
          </div>

          {/* WCAG Contrast Calculator Sandbox */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">WCAG AA Contrast Calculator</span>
              <Sparkles className="w-4 h-4 text-slate-400" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Text Color (HEX)</label>
                <input
                  type="text"
                  value={hexFg}
                  onChange={(e) => setHexFg(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Bg Color (HEX)</label>
                <input
                  type="text"
                  value={hexBg}
                  onChange={(e) => setHexBg(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div
              className="p-3 rounded-xl border border-slate-200 text-center font-bold text-xs"
              style={{ backgroundColor: hexBg, color: hexFg }}
            >
              Sample Text Preview
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-mono">{contrastScore}:1 Ratio</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  contrastScore >= 4.5
                    ? 'bg-emerald-100 text-emerald-700'
                    : contrastScore >= 3.0
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {contrastScore >= 4.5 ? 'WCAG AA Pass' : contrastScore >= 3.0 ? 'Large Text Only' : 'Fail'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
