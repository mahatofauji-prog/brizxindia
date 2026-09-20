const fs = require('fs');
let code = fs.readFileSync('src/context/DataContext.tsx', 'utf8');

if (!code.includes("import { useAuth }")) {
  code = code.replace("import React, { createContext, useContext, useState, useEffect } from 'react';", "import React, { createContext, useContext, useState, useEffect } from 'react';\nimport { useAuth } from './AuthContext';");
}

if (!code.includes("const { user } = useAuth();")) {
  code = code.replace("export function DataProvider({ children }: { children: React.ReactNode }) {", "export function DataProvider({ children }: { children: React.ReactNode }) {\n  const { user } = useAuth();");
}

const filterLogic = `
  const isBrandOwner = user?.role === 'BRAND_OWNER';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const currentUserId = user?.id;

  const filteredBrands = brands.map(b => {
    if (isSuperAdmin || (isBrandOwner && b.id === currentUserId)) return b;
    // Strip private fields for others
    const { unlockedLeads, billingDetails, subscriptionTier, savedSeekers, ...publicBrandInfo } = b;
    return publicBrandInfo as Brand;
  });

  const filteredCrmNotes = crmNotes.filter(n => isSuperAdmin || n.brandId === currentUserId);
  const filteredMeetings = meetings.filter(m => isSuperAdmin || m.brandId === currentUserId || m.seekerId === currentUserId);
  const filteredSubscriptions = subscriptions.filter(s => isSuperAdmin || s.brandId === currentUserId);
  const filteredVerificationRequests = verificationRequests.filter(v => isSuperAdmin || v.brandId === currentUserId || v.seekerId === currentUserId);
  const filteredNotifications = notifications.filter(n => isSuperAdmin || n.userId === currentUserId);
  const filteredLeadStages = leadStages.filter(l => isSuperAdmin || l.brandId === currentUserId);
  const filteredCrmTasks = crmTasks.filter(t => isSuperAdmin || t.brandId === currentUserId);
  const filteredInvoices = invoices.filter(i => isSuperAdmin || i.brandId === currentUserId);
  const filteredConnectionRequests = connectionRequests.filter(c => isSuperAdmin || c.brandId === currentUserId || c.seekerId === currentUserId);
  const filteredApplications = applications.filter(a => isSuperAdmin || a.brandId === currentUserId || a.assignedBrandOwnerId === currentUserId);
  const filteredAnalyticsEvents = analyticsEvents.filter(a => isSuperAdmin || a.brandId === currentUserId);

  return (
    <DataContext.Provider value={{
      seekers, 
      brands: filteredBrands, 
      crmNotes: filteredCrmNotes, 
      meetings: filteredMeetings, 
      auditLogs: [], 
      subscriptions: filteredSubscriptions, 
      verificationRequests: filteredVerificationRequests, 
      verificationDocuments, 
      verificationChecks, 
      verificationAuditLogs, 
      legalAdvisorQuestions,
      notifications: filteredNotifications, 
      leadStages: filteredLeadStages, 
      crmTasks: filteredCrmTasks, 
      invoices: filteredInvoices, 
      connectionRequests: filteredConnectionRequests, 
      applications: filteredApplications,
      emailLogs, 
      simulateEmailFailure, 
      setSimulateEmailFailure, 
      clearEmailLogs,
      analyticsEvents: filteredAnalyticsEvents, 
      logAnalyticsEvent, 
      recordLeadContactAction,
      updateSeeker, updateBrand, addCRMNote, unlockLead, toggleSaveLeadForBrand, updateLeadStage, addCRMTask, toggleCRMTask,
      scheduleMeeting, cancelMeeting, updateMeetingStatus, addMeetingAuditLog: () => {}, verifySeeker, toggleSaveBrand, 
      addVerificationRequest, updateVerificationRequest, uploadVerificationDocument, reviewVerificationDocument, updateVerificationCheck,
      askLegalAdvisor, answerLegalAdvisor,
      markNotificationRead,
      markNotificationAsRead: markNotificationRead,
      deleteNotification,
      clearNotification: deleteNotification,
      clearAllNotifications,
      updateBrandProfile: updateBrand,
      updateBrandBillingDetails,
      upgradeSeekerToPremium, renewSubscription,
      buyCreditPackPayment, processSubscriptionPayment, requestInvoiceRefund,
      addConnectionRequest, updateConnectionStatus, hasConnectionRequest,
      markConnectionReadByOwner, addConnectionInternalNote,
      addApplication, updateApplicationStatus, getApplicationsForBrand
    }}>
      {children}
    </DataContext.Provider>
  );
`;

const returnBlockStart = code.indexOf('return (');
const endOfProvider = code.indexOf('</DataContext.Provider>', returnBlockStart) + '</DataContext.Provider>'.length + 4; // plus some extra spacing

code = code.substring(0, returnBlockStart) + filterLogic + code.substring(endOfProvider);

fs.writeFileSync('src/context/DataContext.tsx', code);
