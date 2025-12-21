-- =========================================
-- Legmint Expanded Template Library
-- =========================================
-- Expands from 15 to 70+ professional legal templates
-- Organized by category with multi-jurisdiction support

-- =========================================
-- STARTUP TEMPLATES (20 total)
-- =========================================

-- Formation & Structure
INSERT INTO templates (code, title, category, jurisdictions, languages, description, render_engine, price_cents, is_active, is_featured)
VALUES
    ('articles-of-incorporation', 'Articles of Incorporation', 'startup', ARRAY['US-DE', 'US-CA', 'UK'], ARRAY['en'], 'Official document to legally form a corporation, including company name, purpose, stock structure, and registered agent.', 'html', 3500, true, true),
    ('bylaws', 'Corporate Bylaws', 'startup', ARRAY['US-DE', 'US-CA', 'UK'], ARRAY['en'], 'Internal rules governing corporation management, board meetings, officer duties, and shareholder rights.', 'html', 2900, true, false),
    ('operating-agreement-llc', 'LLC Operating Agreement', 'startup', ARRAY['US-DE', 'US-CA', 'UK'], ARRAY['en'], 'Governs LLC member rights, profit distribution, management structure, and decision-making procedures.', 'html', 3500, true, true),
    ('partnership-agreement', 'Partnership Agreement', 'startup', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Defines partner contributions, profit sharing, roles, and dissolution terms for general partnerships.', 'html', 3200, true, false),
    ('board-resolution', 'Board Resolution', 'startup', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Formal document recording decisions made by a company board of directors.', 'html', 1500, true, false),
    ('shareholder-resolution', 'Shareholder Resolution', 'startup', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Formal record of decisions made by company shareholders at meetings.', 'html', 1500, true, false),
    ('minutes-of-meeting', 'Meeting Minutes Template', 'startup', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Standard format for recording board or shareholder meeting discussions and decisions.', 'html', 1200, true, false)
ON CONFLICT (code) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    jurisdictions = EXCLUDED.jurisdictions,
    price_cents = EXCLUDED.price_cents,
    is_featured = EXCLUDED.is_featured,
    updated_at = CURRENT_TIMESTAMP;

-- Equity & Investment
INSERT INTO templates (code, title, category, jurisdictions, languages, description, render_engine, price_cents, is_active, is_featured)
VALUES
    ('stock-option-plan', 'Employee Stock Option Plan (ESOP)', 'startup', ARRAY['US-DE', 'US-CA', 'UK', 'DE'], ARRAY['en'], 'Framework for granting stock options to employees, including vesting schedules and exercise terms.', 'html', 4500, true, true),
    ('stock-option-agreement', 'Stock Option Agreement', 'startup', ARRAY['US-DE', 'US-CA', 'UK', 'DE'], ARRAY['en'], 'Individual agreement granting stock options to an employee or contractor.', 'html', 2500, true, false),
    ('restricted-stock-agreement', 'Restricted Stock Agreement', 'startup', ARRAY['US-DE', 'US-CA', 'UK'], ARRAY['en'], 'Agreement for issuing restricted stock units (RSUs) with vesting conditions.', 'html', 2900, true, false),
    ('stock-purchase-agreement', 'Stock Purchase Agreement', 'startup', ARRAY['US-DE', 'US-CA', 'UK', 'DE'], ARRAY['en'], 'Agreement for buying or selling company shares between parties.', 'html', 3500, true, false),
    ('term-sheet', 'Investment Term Sheet', 'startup', ARRAY['US-DE', 'US-CA', 'UK', 'DE'], ARRAY['en'], 'Non-binding outline of key investment terms before formal documentation.', 'html', 2900, true, true),
    ('subscription-agreement-equity', 'Equity Subscription Agreement', 'startup', ARRAY['US-DE', 'US-CA', 'UK'], ARRAY['en'], 'Agreement for investors subscribing to purchase company shares.', 'html', 3200, true, false),
    ('cap-table-template', 'Cap Table Template', 'startup', ARRAY['US-DE', 'US-CA', 'UK', 'DE', 'CZ'], ARRAY['en'], 'Spreadsheet template tracking company ownership, shares, and equity dilution.', 'html', 1900, true, false),
    ('vesting-schedule', 'Vesting Schedule Agreement', 'startup', ARRAY['US-DE', 'US-CA', 'UK', 'DE'], ARRAY['en'], 'Document outlining equity vesting timeline, cliff periods, and acceleration triggers.', 'html', 1900, true, false)
ON CONFLICT (code) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    jurisdictions = EXCLUDED.jurisdictions,
    price_cents = EXCLUDED.price_cents,
    is_featured = EXCLUDED.is_featured,
    updated_at = CURRENT_TIMESTAMP;

-- =========================================
-- B2B TEMPLATES (25 total)
-- =========================================

-- Sales & Commercial
INSERT INTO templates (code, title, category, jurisdictions, languages, description, render_engine, price_cents, is_active, is_featured)
VALUES
    ('master-service-agreement', 'Master Service Agreement (MSA)', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Umbrella agreement establishing terms for ongoing business relationship and future work orders.', 'html', 3900, true, true),
    ('statement-of-work', 'Statement of Work (SOW)', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Detailed project scope, deliverables, timeline, and payment terms under an MSA.', 'html', 2500, true, true),
    ('purchase-order', 'Purchase Order Template', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Commercial document for ordering goods or services with specific terms.', 'html', 1500, true, false),
    ('sales-agreement', 'Sales Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Contract for sale of goods between businesses, including warranties and delivery terms.', 'html', 2900, true, false),
    ('distribution-agreement', 'Distribution Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Agreement appointing a distributor to sell products in specific territories.', 'html', 3500, true, false),
    ('reseller-agreement', 'Reseller Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Contract authorizing a company to resell products or services.', 'html', 3200, true, true),
    ('agency-agreement', 'Agency Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Agreement appointing an agent to act on behalf of a principal in business dealings.', 'html', 2900, true, false),
    ('referral-agreement', 'Referral Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Terms for paying referral fees or commissions for business introductions.', 'html', 2200, true, false),
    ('supply-agreement', 'Supply Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Long-term agreement for supply of goods or materials between businesses.', 'html', 3200, true, false),
    ('manufacturing-agreement', 'Manufacturing Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Contract for manufacturing products according to specifications.', 'html', 3900, true, false)
ON CONFLICT (code) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    jurisdictions = EXCLUDED.jurisdictions,
    price_cents = EXCLUDED.price_cents,
    is_featured = EXCLUDED.is_featured,
    updated_at = CURRENT_TIMESTAMP;

-- Technology & Software
INSERT INTO templates (code, title, category, jurisdictions, languages, description, render_engine, price_cents, is_active, is_featured)
VALUES
    ('saas-agreement', 'SaaS Subscription Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Software-as-a-Service agreement covering access, usage, data handling, and support.', 'html', 3500, true, true),
    ('software-license-agreement', 'Software License Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'License terms for software use, including restrictions, warranties, and support.', 'html', 3200, true, true),
    ('api-license-agreement', 'API License Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Terms for accessing and using an application programming interface.', 'html', 2900, true, false),
    ('software-development-agreement', 'Software Development Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Custom software development contract covering scope, milestones, and IP ownership.', 'html', 3900, true, true),
    ('technology-partnership', 'Technology Partnership Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Strategic partnership for technology collaboration, integration, or co-development.', 'html', 3500, true, false),
    ('white-label-agreement', 'White Label Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Agreement to rebrand and resell another company products or services.', 'html', 3200, true, false),
    ('data-sharing-agreement', 'Data Sharing Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Terms for sharing data between organizations, including permitted uses and security.', 'html', 2900, true, false)
ON CONFLICT (code) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    jurisdictions = EXCLUDED.jurisdictions,
    price_cents = EXCLUDED.price_cents,
    is_featured = EXCLUDED.is_featured,
    updated_at = CURRENT_TIMESTAMP;

-- Employment & HR
INSERT INTO templates (code, title, category, jurisdictions, languages, description, render_engine, price_cents, is_active, is_featured)
VALUES
    ('offer-letter', 'Employment Offer Letter', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Formal job offer including position, compensation, benefits, and start date.', 'html', 1900, true, true),
    ('employee-handbook', 'Employee Handbook Template', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Comprehensive guide to company policies, benefits, and workplace conduct.', 'html', 4500, true, true),
    ('non-compete-agreement', 'Non-Compete Agreement', 'b2b', ARRAY['UK', 'DE', 'US-CA', 'CZ'], ARRAY['en'], 'Restricts employee from working for competitors for specified period after leaving.', 'html', 2500, true, false),
    ('non-solicitation-agreement', 'Non-Solicitation Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Prevents soliciting company clients or employees after employment ends.', 'html', 2200, true, false),
    ('severance-agreement', 'Severance Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Terms for employee separation including severance pay, benefits, and release of claims.', 'html', 2900, true, false),
    ('internship-agreement', 'Internship Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Terms for internship including duration, responsibilities, compensation, and learning objectives.', 'html', 1900, true, false),
    ('remote-work-agreement', 'Remote Work Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Policy for remote work arrangements including equipment, hours, and communication.', 'html', 1900, true, true),
    ('employee-invention-assignment', 'Employee Invention Assignment', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Agreement assigning employee inventions and IP created during employment to company.', 'html', 2200, true, false)
ON CONFLICT (code) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    jurisdictions = EXCLUDED.jurisdictions,
    price_cents = EXCLUDED.price_cents,
    is_featured = EXCLUDED.is_featured,
    updated_at = CURRENT_TIMESTAMP;

-- =========================================
-- B2C TEMPLATES (15 total)
-- =========================================

INSERT INTO templates (code, title, category, jurisdictions, languages, description, render_engine, price_cents, is_active, is_featured)
VALUES
    ('website-terms', 'Website Terms and Conditions', 'b2c', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'General terms governing use of a website, including acceptable use and disclaimers.', 'html', 2500, true, false),
    ('mobile-app-terms', 'Mobile App Terms of Service', 'b2c', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Terms specific to mobile application usage, in-app purchases, and app store compliance.', 'html', 2900, true, true),
    ('ecommerce-terms', 'E-commerce Terms and Conditions', 'b2c', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Terms for online stores covering orders, payments, shipping, and returns.', 'html', 3200, true, true),
    ('saas-terms-b2c', 'SaaS Terms of Service (Consumer)', 'b2c', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Consumer-facing terms for SaaS products with subscription billing.', 'html', 2900, true, true),
    ('cookie-policy', 'Cookie Policy', 'b2c', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Disclosure of website cookie usage, types, and user consent mechanisms.', 'html', 1500, true, false),
    ('gdpr-privacy-policy', 'GDPR Privacy Policy', 'b2c', ARRAY['UK', 'DE', 'CZ'], ARRAY['en'], 'Privacy policy fully compliant with EU GDPR requirements.', 'html', 2900, true, true),
    ('ccpa-privacy-policy', 'CCPA Privacy Policy', 'b2c', ARRAY['US-CA'], ARRAY['en'], 'Privacy policy compliant with California Consumer Privacy Act.', 'html', 2900, true, false),
    ('refund-policy', 'Refund and Cancellation Policy', 'b2c', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Policy covering refunds, returns, exchanges, and subscription cancellations.', 'html', 1500, true, false),
    ('shipping-policy', 'Shipping and Delivery Policy', 'b2c', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Terms covering shipping methods, delivery times, and international shipping.', 'html', 1500, true, false),
    ('acceptable-use-policy', 'Acceptable Use Policy', 'b2c', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Rules governing acceptable behavior and prohibited activities on platform.', 'html', 1900, true, false),
    ('community-guidelines', 'Community Guidelines', 'b2c', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Standards for user behavior in online communities and social platforms.', 'html', 1900, true, false),
    ('content-license-user', 'User Content License Agreement', 'b2c', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Terms governing user-generated content, licensing, and platform rights.', 'html', 2200, true, false),
    ('subscription-terms', 'Subscription Service Terms', 'b2c', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Terms for recurring subscription services including billing and cancellation.', 'html', 2500, true, false),
    ('contest-rules', 'Contest and Sweepstakes Rules', 'b2c', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Official rules for promotions, contests, and giveaways.', 'html', 1900, true, false),
    ('influencer-disclosure', 'Influencer Disclosure Policy', 'b2c', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'FTC/ASA compliant disclosure requirements for sponsored content.', 'html', 1500, true, false)
ON CONFLICT (code) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    jurisdictions = EXCLUDED.jurisdictions,
    price_cents = EXCLUDED.price_cents,
    is_featured = EXCLUDED.is_featured,
    updated_at = CURRENT_TIMESTAMP;

-- =========================================
-- P2P / PERSONAL TEMPLATES (10 total)
-- =========================================

INSERT INTO templates (code, title, category, jurisdictions, languages, description, render_engine, price_cents, is_active, is_featured)
VALUES
    ('freelance-contract', 'Freelance Contract', 'p2p', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Agreement between freelancer and client covering project scope, payment, and deliverables.', 'html', 2500, true, true),
    ('influencer-agreement', 'Influencer Marketing Agreement', 'p2p', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Contract for sponsored content, brand collaborations, and influencer partnerships.', 'html', 2500, true, true),
    ('collaboration-agreement', 'Collaboration Agreement', 'p2p', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Terms for creative or business collaboration between individuals or small teams.', 'html', 2200, true, false),
    ('joint-venture-mou', 'Joint Venture MOU', 'p2p', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Memorandum of understanding for joint business ventures.', 'html', 2500, true, false),
    ('revenue-share-agreement', 'Revenue Share Agreement', 'p2p', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Agreement defining how revenue or profits are split between parties.', 'html', 2200, true, false),
    ('commission-agreement', 'Commission Agreement', 'p2p', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Terms for paying sales commissions or finder fees.', 'html', 1900, true, false),
    ('promissory-note', 'Promissory Note', 'p2p', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Written promise to pay a specific sum of money by a certain date.', 'html', 1500, true, false),
    ('equipment-rental', 'Equipment Rental Agreement', 'p2p', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Terms for renting equipment including condition, liability, and return.', 'html', 1900, true, false),
    ('photo-video-release', 'Photo/Video Release Form', 'p2p', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Consent form allowing use of person likeness in photos or videos.', 'html', 1200, true, false),
    ('model-release', 'Model Release Agreement', 'p2p', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Professional release for commercial use of model images.', 'html', 1500, true, false)
ON CONFLICT (code) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    jurisdictions = EXCLUDED.jurisdictions,
    price_cents = EXCLUDED.price_cents,
    is_featured = EXCLUDED.is_featured,
    updated_at = CURRENT_TIMESTAMP;

-- =========================================
-- INTELLECTUAL PROPERTY TEMPLATES (10 total)
-- =========================================

INSERT INTO templates (code, title, category, jurisdictions, languages, description, render_engine, price_cents, is_active, is_featured)
VALUES
    ('trademark-assignment', 'Trademark Assignment Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Transfer of trademark ownership from one party to another.', 'html', 2500, true, false),
    ('trademark-license', 'Trademark License Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'License to use a trademark under specified conditions.', 'html', 2500, true, false),
    ('copyright-assignment', 'Copyright Assignment Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Transfer of copyright ownership for creative works.', 'html', 2200, true, false),
    ('copyright-license', 'Copyright License Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'License to use copyrighted material under specified terms.', 'html', 2200, true, false),
    ('patent-license', 'Patent License Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA'], ARRAY['en'], 'License to use patented technology or invention.', 'html', 3500, true, false),
    ('work-for-hire', 'Work for Hire Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Agreement establishing that work created is owned by the hiring party.', 'html', 2500, true, true),
    ('content-license-commercial', 'Content License Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'License for commercial use of content, images, or media.', 'html', 2200, true, false),
    ('music-license', 'Music License Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'License for use of music in commercial projects or media.', 'html', 2500, true, false),
    ('brand-licensing', 'Brand Licensing Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'License to use brand assets, logos, and brand identity.', 'html', 3200, true, false),
    ('nda-intellectual-property', 'IP-Specific NDA', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'NDA specifically tailored for protecting intellectual property disclosures.', 'html', 2200, true, false)
ON CONFLICT (code) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    jurisdictions = EXCLUDED.jurisdictions,
    price_cents = EXCLUDED.price_cents,
    is_featured = EXCLUDED.is_featured,
    updated_at = CURRENT_TIMESTAMP;

-- =========================================
-- DATA PROTECTION & COMPLIANCE (8 total)
-- =========================================

INSERT INTO templates (code, title, category, jurisdictions, languages, description, render_engine, price_cents, is_active, is_featured)
VALUES
    ('dpa-gdpr', 'Data Processing Agreement (GDPR)', 'b2b', ARRAY['UK', 'DE', 'CZ'], ARRAY['en'], 'GDPR-compliant agreement for processing personal data on behalf of a controller.', 'html', 3500, true, true),
    ('dpa-ccpa', 'Data Processing Agreement (CCPA)', 'b2b', ARRAY['US-CA'], ARRAY['en'], 'CCPA-compliant agreement for service providers processing personal information.', 'html', 3200, true, false),
    ('standard-contractual-clauses', 'Standard Contractual Clauses (EU)', 'b2b', ARRAY['UK', 'DE', 'CZ'], ARRAY['en'], 'EU-approved clauses for international data transfers outside EEA.', 'html', 3500, true, true),
    ('data-retention-policy', 'Data Retention Policy', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Policy defining how long different types of data are retained.', 'html', 2200, true, false),
    ('breach-notification-template', 'Data Breach Notification Template', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Template for notifying authorities and individuals of data breaches.', 'html', 1900, true, false),
    ('dsar-response-template', 'Data Subject Access Request Response', 'b2b', ARRAY['UK', 'DE', 'CZ'], ARRAY['en'], 'Template for responding to GDPR data subject access requests.', 'html', 1900, true, false),
    ('consent-form-data', 'Data Processing Consent Form', 'b2c', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Form for obtaining valid consent for data processing activities.', 'html', 1500, true, false),
    ('privacy-impact-assessment', 'Privacy Impact Assessment Template', 'b2b', ARRAY['UK', 'DE', 'CZ'], ARRAY['en'], 'Template for conducting data protection impact assessments (DPIA).', 'html', 2900, true, false)
ON CONFLICT (code) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    jurisdictions = EXCLUDED.jurisdictions,
    price_cents = EXCLUDED.price_cents,
    is_featured = EXCLUDED.is_featured,
    updated_at = CURRENT_TIMESTAMP;

-- =========================================
-- REAL ESTATE & PROPERTY (5 total)
-- =========================================

INSERT INTO templates (code, title, category, jurisdictions, languages, description, render_engine, price_cents, is_active, is_featured)
VALUES
    ('commercial-lease', 'Commercial Lease Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Lease agreement for commercial property including offices, retail, or industrial space.', 'html', 3900, true, true),
    ('sublease-agreement', 'Sublease Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Agreement allowing tenant to sublease property to another party.', 'html', 2500, true, false),
    ('office-sharing-agreement', 'Office Sharing Agreement', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Terms for shared office or coworking space arrangements.', 'html', 2200, true, false),
    ('lease-amendment', 'Lease Amendment', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Modification to existing lease terms such as rent, term, or space.', 'html', 1500, true, false),
    ('letter-of-intent-lease', 'Letter of Intent (Lease)', 'b2b', ARRAY['UK', 'DE', 'US-DE', 'US-CA', 'CZ'], ARRAY['en'], 'Non-binding letter expressing intent to lease commercial property.', 'html', 1500, true, false)
ON CONFLICT (code) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    jurisdictions = EXCLUDED.jurisdictions,
    price_cents = EXCLUDED.price_cents,
    is_featured = EXCLUDED.is_featured,
    updated_at = CURRENT_TIMESTAMP;

-- =========================================
-- VERIFY AND REPORT
-- =========================================

-- Count templates by category
DO $$
DECLARE
    total_count INTEGER;
    startup_count INTEGER;
    b2b_count INTEGER;
    b2c_count INTEGER;
    p2p_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count FROM templates WHERE is_active = true;
    SELECT COUNT(*) INTO startup_count FROM templates WHERE is_active = true AND category = 'startup';
    SELECT COUNT(*) INTO b2b_count FROM templates WHERE is_active = true AND category = 'b2b';
    SELECT COUNT(*) INTO b2c_count FROM templates WHERE is_active = true AND category = 'b2c';
    SELECT COUNT(*) INTO p2p_count FROM templates WHERE is_active = true AND category = 'p2p';

    RAISE NOTICE 'Template Library Statistics:';
    RAISE NOTICE '  Total Templates: %', total_count;
    RAISE NOTICE '  Startup: %', startup_count;
    RAISE NOTICE '  B2B: %', b2b_count;
    RAISE NOTICE '  B2C: %', b2c_count;
    RAISE NOTICE '  P2P: %', p2p_count;
END $$;
