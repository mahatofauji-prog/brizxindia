import React, { useState, useEffect } from 'react';
import { 
  Mail, Send, CheckCircle2, AlertCircle, Clock, Eye, FileText, 
  User, RefreshCw, ShieldCheck, ChevronDown, Check, Sparkles, MessageSquare
} from 'lucide-react';
import { EmailLog, RegistrationStatus, RejectionCategory } from '../../types';
import { 
  BRAND_EMAIL_TEMPLATES, 
  SEEKER_EMAIL_TEMPLATES, 
  EmailTemplateType, 
  generateEmailContent 
} from '../../utils/emailTemplates';

interface EmailNotificationSectionProps {
  applicationId: string;
  userId?: string;
  applicationType: 'BRAND' | 'SEEKER';
  applicantName: string;
  brandName?: string;
  recipientEmail: string;
  currentStatus: RegistrationStatus | string;
  rejectionCategory?: RejectionCategory | string;
  rejectionReason?: string;
  rejectionDetails?: string;
  industry?: string;
  investment?: number | string;
  city?: string;
  emailHistory: EmailLog[];
  onSendEmail: (emailPayload: Omit<EmailLog, 'id' | 'sentAt'>) => Promise<boolean>;
}

export const EmailNotificationSection: React.FC<EmailNotificationSectionProps> = ({
  applicationId,
  userId,
  applicationType,
  applicantName,
  brandName,
  recipientEmail,
  currentStatus,
  rejectionCategory,
  rejectionReason,
  rejectionDetails,
  industry,
  investment,
  city,
  emailHistory,
  onSendEmail
}) => {
  const templates = applicationType === 'BRAND' ? BRAND_EMAIL_TEMPLATES : SEEKER_EMAIL_TEMPLATES;

  // Determine initial template based on current application status
  const getInitialTemplateId = (status: string): EmailTemplateType => {
    switch (status) {
      case 'APPROVED': return 'APPROVED';
      case 'REJECTED': return 'REJECTED';
      case 'UNDER_REVIEW': return 'APPLICATION_UNDER_REVIEW';
      case 'PENDING_REVIEW': return 'APPLICATION_RECEIVED';
      default: return 'APPLICATION_RECEIVED';
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateType>(() => getInitialTemplateId(currentStatus));
  const [recipient, setRecipient] = useState<string>(recipientEmail || '');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [viewingLog, setViewingLog] = useState<EmailLog | null>(null);

  // Sync state when props or template change
  useEffect(() => {
    setRecipient(recipientEmail || '');
  }, [recipientEmail]);

  useEffect(() => {
    const content = generateEmailContent({
      templateType: selectedTemplate,
      applicationType,
      applicantName,
      brandName,
      applicationId,
      status: currentStatus,
      rejectionCategory,
      rejectionReason,
      rejectionDetails,
      industry,
      investment,
      city
    });
    setSubject(content.subject);
    setMessage(content.message);
  }, [
    selectedTemplate, applicationType, applicantName, brandName, applicationId, 
    currentStatus, rejectionCategory, rejectionReason, rejectionDetails, industry, investment, city
  ]);

  const handleTemplateChange = (tmplId: EmailTemplateType) => {
    setSelectedTemplate(tmplId);
    setFeedback(null);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !recipient.trim()) {
      setFeedback({ type: 'error', text: 'Please enter a valid recipient email address.' });
      return;
    }
    if (!subject.trim() || !message.trim()) {
      setFeedback({ type: 'error', text: 'Subject and Message content cannot be empty.' });
      return;
    }

    setIsSending(true);
    setFeedback(null);

    try {
      const success = await onSendEmail({
        applicationId,
        userId: userId || applicationId,
        recipient: recipient.trim(),
        applicantName,
        applicationType,
        emailType: selectedTemplate,
        subject: subject.trim(),
        message: message.trim(),
        body: message.trim(),
        sentByAdmin: 'Super Admin',
        status: 'SUCCESS',
        deliveryStatus: 'DELIVERED'
      });

      if (success) {
        setFeedback({ 
          type: 'success', 
          text: `Email successfully dispatched to ${recipient.trim()} via real Express backend API!` 
        });
      } else {
        setFeedback({ 
          type: 'error', 
          text: 'Failed to dispatch email. Please verify backend connection.' 
        });
      }
    } catch (err: any) {
      setFeedback({ 
        type: 'error', 
        text: err.message || 'An error occurred while sending email.' 
      });
    } finally {
      setIsSending(false);
    }
  };

  // Filter email logs for this application
  const appLogs = emailHistory.filter(log => log.applicationId === applicationId || log.recipient === recipientEmail);

  return (
    <div className="space-y-6">
      
      {/* EMAIL COMPOSITION PANEL */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-xl">
              <Mail size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider font-heading">
                Email Notification Center
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Send real-time updates directly to the applicant via server email dispatch
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 uppercase">
            {applicationType} APPLICATION
          </span>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between animate-fadeIn ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}>
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> : <AlertCircle size={16} className="text-rose-600 shrink-0" />}
              <span>{feedback.text}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-4 text-xs">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Recipient Email */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                Recipient Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="applicant@example.com"
              />
            </div>

            {/* Applicant Name */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                Applicant Name / Entity
              </label>
              <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700 truncate">
                {brandName ? `${brandName} (${applicantName})` : applicantName}
              </div>
            </div>

            {/* Application Status */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                Current Application Status
              </label>
              <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-black text-slate-800 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  currentStatus === 'APPROVED' ? 'bg-emerald-500' :
                  currentStatus === 'REJECTED' ? 'bg-rose-500' :
                  currentStatus === 'UNDER_REVIEW' ? 'bg-purple-500' : 'bg-amber-500'
                }`} />
                <span>{String(currentStatus).replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Email Template Dropdown */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
              Select Email Template
            </label>
            <div className="relative">
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value as EmailTemplateType)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 appearance-none outline-none focus:border-blue-500 cursor-pointer pr-8"
              >
                {templates.map(tmpl => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Subject Field */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
              Email Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter subject..."
            />
          </div>

          {/* Message Body Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-extrabold uppercase text-slate-500">
                Email Message Body (Pre-filled & Editable)
              </label>
              <button
                type="button"
                onClick={() => handleTemplateChange(selectedTemplate)}
                className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <RefreshCw size={10} /> Reset Template Text
              </button>
            </div>
            <textarea
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full bg-white border border-slate-300 rounded-xl p-3 font-mono text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed"
              placeholder="Write your email body here..."
            />
          </div>

          {/* Send Button */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium">
              * Email is sent via secure server-side API proxy with audit logging.
            </span>
            <button
              type="submit"
              disabled={isSending}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 text-white transition-all shadow-md cursor-pointer ${
                isSending ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-98'
              }`}
            >
              {isSending ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Dispatching...
                </>
              ) : (
                <>
                  <Send size={14} /> Send Email Now
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* EMAIL HISTORY SECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-slate-500" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Email History Log ({appLogs.length})
            </h4>
          </div>
          <span className="text-[10px] text-slate-400">Recorded audit events</span>
        </div>

        {appLogs.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
            <Mail size={24} className="mx-auto mb-2 opacity-50" />
            No previous email notifications recorded for this application yet.
          </div>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {appLogs.map((log) => (
              <div 
                key={log.id} 
                className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs hover:bg-blue-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">{log.subject}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                        {log.emailType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      To: {log.recipient} • Sent by: {log.sentByAdmin || 'Super Admin'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-400">
                    {new Date(log.sentAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, {new Date(log.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    onClick={() => setViewingLog(log)}
                    className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg cursor-pointer"
                    title="View Sent Message"
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sent Message Detail Modal */}
      {viewingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 relative">
            <button 
              onClick={() => setViewingLog(null)} 
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
            >
              ×
            </button>
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">Email Audit Detail</span>
              <h3 className="font-black text-slate-900 text-base mt-0.5">{viewingLog.subject}</h3>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-600">
              <div><strong className="text-slate-800">Recipient:</strong> {viewingLog.recipient}</div>
              <div><strong className="text-slate-800">Sent By:</strong> {viewingLog.sentByAdmin}</div>
              <div><strong className="text-slate-800">Date:</strong> {new Date(viewingLog.sentAt).toLocaleString()}</div>
              <div><strong className="text-slate-800">Status:</strong> <span className="text-emerald-700 font-bold">{viewingLog.deliveryStatus || viewingLog.status}</span></div>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
              {viewingLog.message || viewingLog.body}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingLog(null)}
                className="px-5 py-2 bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmailNotificationSection;
