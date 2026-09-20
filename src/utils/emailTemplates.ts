import { RejectionCategory, RegistrationStatus } from '../types';

export type EmailTemplateType =
  | 'APPLICATION_RECEIVED'
  | 'APPLICATION_UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'DOCUMENTS_REQUIRED'
  | 'PROFILE_UPDATE_REQUIRED';

export interface EmailTemplateOption {
  id: EmailTemplateType;
  label: string;
  defaultSubject: string;
}

export const BRAND_EMAIL_TEMPLATES: EmailTemplateOption[] = [
  { id: 'APPLICATION_RECEIVED', label: '1. Application Received', defaultSubject: 'Application Received - BrizX India Brand Registration' },
  { id: 'APPLICATION_UNDER_REVIEW', label: '2. Application Under Review', defaultSubject: 'Your BrizX India Brand Application is Now Under Review' },
  { id: 'APPROVED', label: '3. Brand Approved', defaultSubject: 'Your Brand Has Been Successfully Listed on BrizX India' },
  { id: 'REJECTED', label: '4. Brand Rejected', defaultSubject: 'Update Regarding Your BrizX India Application' },
  { id: 'DOCUMENTS_REQUIRED', label: '5. Documents Required', defaultSubject: 'Action Required: Additional Business Documents Needed for BrizX Verification' },
  { id: 'PROFILE_UPDATE_REQUIRED', label: '6. Profile Update Required', defaultSubject: 'Action Required: Please Update Your Brand Profile Information' },
];

export const SEEKER_EMAIL_TEMPLATES: EmailTemplateOption[] = [
  { id: 'APPLICATION_RECEIVED', label: '1. Application Received', defaultSubject: 'Application Received - BrizX India Investor Registration' },
  { id: 'APPLICATION_UNDER_REVIEW', label: '2. Application Under Review', defaultSubject: 'Your BrizX India Seeker Profile is Now Under Review' },
  { id: 'APPROVED', label: '3. Seeker Approved', defaultSubject: 'Your Franchise Seeker Profile Has Been Approved on BrizX India' },
  { id: 'REJECTED', label: '4. Seeker Rejected', defaultSubject: 'Update Regarding Your BrizX India Application' },
  { id: 'DOCUMENTS_REQUIRED', label: '5. Documents Required', defaultSubject: 'Action Required: Verification Documents Needed for BrizX Seeker Profile' },
  { id: 'PROFILE_UPDATE_REQUIRED', label: '6. Profile Update Required', defaultSubject: 'Action Required: Update Your Franchise Investment Preferences' },
];

export interface EmailBuildParams {
  templateType: EmailTemplateType;
  applicationType: 'BRAND' | 'SEEKER';
  applicantName: string;
  brandName?: string;
  applicationId: string;
  status: RegistrationStatus | string;
  rejectionCategory?: RejectionCategory | string;
  rejectionReason?: string;
  rejectionDetails?: string;
  industry?: string;
  investment?: number | string;
  city?: string;
}

export function generateEmailContent(params: EmailBuildParams): { subject: string; message: string } {
  const {
    templateType, applicationType, applicantName, brandName, applicationId,
    status, rejectionCategory, rejectionReason, rejectionDetails, industry, investment, city
  } = params;

  if (applicationType === 'BRAND') {
    const brandDisplay = brandName || applicantName || 'Your Brand';
    switch (templateType) {
      case 'APPLICATION_RECEIVED':
        return {
          subject: 'Application Received - BrizX India Brand Registration',
          message: `Hello ${applicantName},

Thank you for submitting your brand application for ${brandDisplay} to BrizX India.

We have received your registration details and submitted credentials. Our audit team is currently preparing your file for business verification.

Application ID: ${applicationId}
Brand Name: ${brandDisplay}
Current Status: PENDING REVIEW

You will receive further updates as our verification team evaluates your listing information.

Regards,
BrizX India Verification Desk
Support: support@brizxindia.com | Toll-Free: 1800-BRIZX-IN`
        };

      case 'APPLICATION_UNDER_REVIEW':
        return {
          subject: 'Your BrizX India Brand Application is Now Under Review',
          message: `Hello ${applicantName},

Your brand application for ${brandDisplay} (Application ID: ${applicationId}) is now actively UNDER REVIEW by the BrizX Corporate Audit Team.

Our legal and compliance specialists are inspecting your business filings, trademark status, and unit economics model.

Current Status: UNDER REVIEW

No further action is required from you at this moment. We will notify you once our evaluation is complete.

Regards,
BrizX India Verification Desk
Support: support@brizxindia.com`
        };

      case 'APPROVED':
        return {
          subject: 'Your Brand Has Been Successfully Listed on BrizX India',
          message: `Hello ${applicantName},

We are pleased to inform you that your brand, ${brandDisplay}, has been APPROVED and is now officially listed on BrizX India!

Approval & Listing Summary:
- Brand Name: ${brandDisplay}
- Applicant Name: ${applicantName}
- Application ID: ${applicationId}
- Listing Status: ACTIVE & PUBLICLY LISTED
- Verification Badge: ISSUED

Your franchise opportunity is now visible to thousands of verified franchise investors across India. You can access your Brand Dashboard to view incoming lead matches, manage inquiry unlocks, and schedule investor meetings.

Brand Dashboard Access: https://brizxindia.com/brand/dashboard

Thank you for choosing BrizX India as your expansion partner.

Regards,
BrizX India Onboarding Team
Support: support@brizxindia.com | Toll-Free: 1800-BRIZX-IN`
        };

      case 'REJECTED':
        return {
          subject: 'Update Regarding Your BrizX India Application',
          message: `Hello ${applicantName},

Thank you for submitting your application for ${brandDisplay} to BrizX India.

After reviewing your submitted information, we are unable to approve your application at this time.

Application ID: ${applicationId}
Application Status: REJECTED
Reason Category: ${rejectionCategory || 'Incomplete Information'}
Reason Details: ${rejectionReason || 'Details submitted require further validation.'}

Additional Details & Next Steps:
${rejectionDetails || 'Please verify that all business registration certificates, GST documents, and contact details are accurate and resubmit.'}

You may update the required information/documents and resubmit your application where applicable.

Regards,
BrizX India Verification Team
Support: support@brizxindia.com`
        };

      case 'DOCUMENTS_REQUIRED':
        return {
          subject: 'Action Required: Additional Business Documents Needed for BrizX Verification',
          message: `Hello ${applicantName},

During our review of ${brandDisplay} (Application ID: ${applicationId}), our compliance team noted that certain mandatory business verification documents are missing or require updating.

Required Documents:
- GST Registration Certificate
- Certificate of Incorporation / Partnership Deed
- Audited Financial Statements or FDD

Action Required:
Please log in to your BrizX Brand Portal and upload the required verification documents.

Portal Link: https://brizxindia.com/brand/dashboard

Regards,
BrizX India Compliance Team
Support: support@brizxindia.com`
        };

      case 'PROFILE_UPDATE_REQUIRED':
        return {
          subject: 'Action Required: Please Update Your Brand Profile Information',
          message: `Hello ${applicantName},

To complete your BrizX India listing review for ${brandDisplay} (Application ID: ${applicationId}), please update your profile details (such as investment range, space requirements, or franchise fee structure).

Portal Link: https://brizxindia.com/brand/dashboard

Regards,
BrizX India Verification Desk
Support: support@brizxindia.com`
        };

      default:
        return {
          subject: `Update Regarding Your BrizX India Brand Application (${brandDisplay})`,
          message: `Hello ${applicantName},\n\nWe are sharing an update regarding your application for ${brandDisplay} (ID: ${applicationId}).\n\nStatus: ${status}\n\nRegards,\nBrizX India Team`
        };
    }
  } else {
    // SEEKER
    switch (templateType) {
      case 'APPLICATION_RECEIVED':
        return {
          subject: 'Application Received - BrizX India Investor Registration',
          message: `Hello ${applicantName},

Thank you for registering as a Franchise Seeker on BrizX India.

We have received your investment profile details (Target Sector: ${industry || 'Franchise Business'}, Budget: ₹${investment || '15-25'} Lakhs). Our verification desk is reviewing your profile.

Application ID: ${applicationId}
Status: PENDING REVIEW

You will receive notification once your investor profile is verified.

Regards,
BrizX India Investor Desk
Support: support@brizxindia.com`
        };

      case 'APPLICATION_UNDER_REVIEW':
        return {
          subject: 'Your BrizX India Seeker Profile is Now Under Review',
          message: `Hello ${applicantName},

Your BrizX Franchise Seeker profile (Application ID: ${applicationId}) is currently UNDER REVIEW.

Our team is verifying your investment capacity and location preferences to pair you with high-matching verified franchise brands.

Status: UNDER REVIEW

Regards,
BrizX India Investor Desk
Support: support@brizxindia.com`
        };

      case 'APPROVED':
        return {
          subject: 'Your Franchise Seeker Profile Has Been Approved on BrizX India',
          message: `Hello ${applicantName},

Congratulations! Your Franchise Seeker Profile (Application ID: ${applicationId}) has been APPROVED and verified on BrizX India.

Investor Profile Summary:
- Applicant Name: ${applicantName}
- Status: VERIFIED INVESTOR
- Target Industry: ${industry || 'Multi-Sector'}
- Investment Capacity: ₹${investment || '20+'} Lakhs
- Preferred Territory: ${city || 'Pan-India'}

You are now eligible for Smart Matching algorithms and direct inquiry connections with 500+ top franchise brands.

Seeker Dashboard Access: https://brizxindia.com/seeker/dashboard

Regards,
BrizX India Onboarding Team
Support: support@brizxindia.com | Toll-Free: 1800-BRIZX-IN`
        };

      case 'REJECTED':
        return {
          subject: 'Update Regarding Your BrizX India Application',
          message: `Hello ${applicantName},

Thank you for submitting your application to BrizX India.

After reviewing your submitted information (Application ID: ${applicationId}), we are unable to approve your application at this time.

Application Status: REJECTED
Reason Category: ${rejectionCategory || 'Incomplete Information'}
Reason Details: ${rejectionReason || 'Submitted investor details require further verification.'}

Additional Details & Next Steps:
${rejectionDetails || 'Please verify your contact details and capital availability limits and resubmit.'}

You may update your profile information and resubmit your application where applicable.

Regards,
BrizX India Verification Team
Support: support@brizxindia.com`
        };

      case 'DOCUMENTS_REQUIRED':
        return {
          subject: 'Action Required: Verification Documents Needed for BrizX Seeker Profile',
          message: `Hello ${applicantName},

To complete your BrizX Investor verification (Application ID: ${applicationId}), please upload your identity proof and background documentation.

Seeker Dashboard: https://brizxindia.com/seeker/dashboard

Regards,
BrizX India Verification Desk`
        };

      case 'PROFILE_UPDATE_REQUIRED':
        return {
          subject: 'Action Required: Update Your Franchise Investment Preferences',
          message: `Hello ${applicantName},

Please update your preferred investment range, territory cities, and business experience details to help us complete your profile approval (Application ID: ${applicationId}).

Dashboard: https://brizxindia.com/seeker/dashboard

Regards,
BrizX India Team`
        };

      default:
        return {
          subject: `Update Regarding Your BrizX India Investor Profile`,
          message: `Hello ${applicantName},\n\nWe are sharing an update regarding your BrizX Investor profile (ID: ${applicationId}).\n\nStatus: ${status}\n\nRegards,\nBrizX India Team`
        };
    }
  }
}
