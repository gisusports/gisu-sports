import React, { useState } from 'react';
import { IdCardRecord } from '../types';
import { generateAccreditationEmail, generateMailtoLink, AccreditationEmailData } from '../utils/emailNotification';
import { 
  Mail, 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Printer, 
  ShieldCheck, 
  FileText,
  Eye
} from 'lucide-react';

interface EmailNotificationModalProps {
  card?: IdCardRecord;
  customEmailData?: AccreditationEmailData;
  title?: string;
  onClose: () => void;
}

export const EmailNotificationModal: React.FC<EmailNotificationModalProps> = ({ 
  card, 
  customEmailData, 
  title, 
  onClose 
}) => {
  const emailData = customEmailData || (card ? generateAccreditationEmail(card) : null);
  
  if (!emailData) {
    return null;
  }

  const mailtoLink = card
    ? generateMailtoLink(card)
    : `mailto:${encodeURIComponent(emailData.toEmail)}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.bodyText)}`;

  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'formatted' | 'text'>('formatted');

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(emailData.bodyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const displayTitle = title || (card ? 'Official Accreditation Email Dispatch' : 'Official Great Ife Sports Dispatch');
  const recipientDisplay = card 
    ? `${card.fullName} <${card.email}>`
    : `${emailData.toName} <${emailData.toEmail}>`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto">
      <div className="relative max-w-4xl w-full rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-200 text-left">
        
        {/* Top Titlebar - Executive & Institutional */}
        <div className="px-5 sm:px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#071E10] text-[#86EFAC] flex items-center justify-center shadow-xs shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900">
                  {displayTitle}
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Official Dispatch</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Reference Code: <span className="font-mono font-semibold text-slate-700">{emailData.trackingId}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Close preview window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Executive Email Metadata Header Panel */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50/80 border-b border-slate-200 space-y-2 text-sm text-slate-700 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider w-24 shrink-0">From:</span>
              <span className="font-semibold text-slate-900 text-sm">
                {emailData.fromName || 'Office of the Director of Sports'}
                <span className="text-slate-500 font-normal ml-1.5">
                  &lt;<strong className="text-emerald-800 font-semibold">{emailData.fromEmail || 'gisusports@gmail.com'}</strong>&gt;
                </span>
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium sm:text-right">
              {emailData.timestamp}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider w-24 shrink-0">To:</span>
              <span className="font-medium text-slate-800 text-sm">
                {recipientDisplay}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 pt-1 border-t border-slate-200/60">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider w-24 shrink-0">Subject:</span>
            <span className="font-bold text-slate-900 text-sm sm:text-base">
              {emailData.subject}
            </span>
          </div>
        </div>

        {/* View Switcher & Action Bar */}
        <div className="px-5 sm:px-6 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setViewMode('formatted')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'formatted'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-4 h-4 text-emerald-700" />
              <span>Document Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('text')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'text'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Plain Text Transcript</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={mailtoLink}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
              title="Open pre-filled email in default email application (Gmail, Outlook, Apple Mail)"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Open in Mail Client</span>
              <span className="sm:hidden">Mail App</span>
            </a>

            <button
              type="button"
              onClick={handleCopyText}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Print Document</span>
            </button>
          </div>
        </div>

        {/* Document Canvas Viewport */}
        <div className="p-3 sm:p-6 bg-slate-100/90 flex flex-col items-center overflow-y-auto flex-1">
          {viewMode === 'formatted' ? (
            <div className="w-full max-w-3xl h-[60vh] min-h-[460px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-white">
              <iframe
                title="Official Communiqué Preview"
                srcDoc={emailData.bodyHtml}
                className="w-full h-full border-0"
                sandbox="allow-same-origin allow-popups"
              />
            </div>
          ) : (
            <div className="w-full max-w-3xl h-[60vh] min-h-[460px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-white p-6 overflow-y-auto">
              <pre className="text-xs sm:text-sm font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                {emailData.bodyText}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-600 shrink-0">
          <span className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Official Directorate Dispatch &bull; Great Ife Students' Union Secretariat, OAU</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#071E10] hover:bg-[#0F351C] text-white font-bold text-sm transition-colors cursor-pointer shadow-xs"
          >
            Close Preview
          </button>
        </div>

      </div>
    </div>
  );
};
