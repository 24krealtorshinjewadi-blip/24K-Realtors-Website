// ═══════════════════════════════════════════════════════════════════════════
// 24K REALTORS — Company Desk & Legal Subpages Modal Component
// Full Indian Real Estate Law (MahaRERA A051262603190, DPDP Act 2023, IT Act 2000, CPC 1908) Compliance
// Subpages:
//   1. About 24K Realtors
//   2. Contact Locality Advisor
//   3. Careers at 24K Group
//   4. Terms & Conditions
//   5. Privacy Policy Registry
//   6. Grievance Redressal Officer
//   7. Summons & Safety Guide
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  X, Shield, Building2, MapPin, Phone, Mail, FileText, CheckCircle2,
  AlertTriangle, Briefcase, Lock, Gavel, Award, ChevronRight, UserCheck, ExternalLink
} from 'lucide-react';

const GOLD = '#D4AF37';

export default function CompanyDeskModal({ isOpen, onClose, initialTab = 'about' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'about', label: 'About 24K Realtors', icon: Building2 },
    { id: 'advisor', label: 'Contact Locality Advisor', icon: MapPin },
    { id: 'careers', label: 'Careers at 24K Group', icon: Briefcase },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy Registry', icon: Lock },
    { id: 'grievance', label: 'Grievance Redressal Officer', icon: Shield },
    { id: 'summons', label: 'Summons & Safety Guide', icon: Gavel },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 99999,
      background: 'rgba(3, 7, 18, 0.92)',
      backdropFilter: 'blur(14px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px',
      boxSizing: 'border-box'
    }}>
      <div className="company-desk-modal-container" style={{
        width: '1000px',
        maxWidth: '100%',
        height: '90vh',
        maxHeight: '780px',
        background: '#070F1E',
        border: `1px solid rgba(212,175,55,0.35)`,
        borderRadius: '16px',
        boxShadow: `0 25px 80px rgba(0,0,0,0.9), 0 0 40px rgba(212,175,55,0.12)`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>

        {/* ── MODAL HEADER ── */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(90deg, #0A1224 0%, #060C17 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'rgba(212,175,55,0.12)', border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Building2 size={20} color={GOLD} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFF', letterSpacing: '0.02em' }}>
                24K REALTORS <span style={{ fontSize: '0.7rem', color: GOLD, fontWeight: 700 }}>• Company Desk</span>
              </div>
              <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>
                MahaRERA: <strong style={{ color: GOLD }}>A051262603190</strong> | Indian Law Compliant
              </div>
            </div>
          </div>

          <button onClick={onClose} style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>

        {/* ── MODAL BODY (RESPONSIVE FLEX / STACK) ── */}
        <div className="company-desk-modal-body" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* LEFT SIDEBAR / TOP MOBILE TABS */}
          <div className="company-desk-tabs-bar" style={{
            width: '260px',
            minWidth: '260px',
            background: 'rgba(10, 18, 36, 0.95)',
            borderRight: '1px solid rgba(255,255,255,0.07)',
            padding: '14px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            overflowY: 'auto'
          }}>
            {tabs.map((tab) => {
              const IconC = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: isActive ? `1px solid ${GOLD}40` : '1px solid transparent',
                    background: isActive ? 'linear-gradient(90deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.02) 100%)' : 'transparent',
                    color: isActive ? GOLD : 'rgba(255,255,255,0.65)',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 800 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <IconC size={15} color={isActive ? GOLD : 'rgba(255,255,255,0.4)'} />
                  <span style={{ flex: 1 }}>{tab.label}</span>
                </button>
              );
            })}

            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
              Official MahaRERA Portal:<br/>
              <a href="https://maharera.maharashtra.gov.in" target="_blank" rel="noreferrer" style={{ color: GOLD, textDecoration: 'underline', fontWeight: 700 }}>maharera.maharashtra.gov.in</a>
            </div>
          </div>

          {/* RIGHT CONTENT PANEL */}
          <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto', background: '#050A14', fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>

            {/* TAB 1: ABOUT 24K REALTORS */}
            {activeTab === 'about' && (
              <div>
                <h2 style={{ fontSize: '1.3rem', color: '#FFF', fontWeight: 900, marginBottom: '14px', fontFamily: "'Cinzel', serif" }}>About 24K Realtors</h2>
                <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(212,175,55,0.08)', border: `1px solid ${GOLD}30`, marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: GOLD }}>24K REALTORS — FIND YOUR SELF AT HOME</div>
                  <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                    MahaRERA Agent License: <strong style={{ color: '#FFF' }}>A051262603190</strong> | Headquartered in Pune, Maharashtra.
                  </div>
                </div>

                <p>
                  <strong>24K Realtors</strong> is a premier luxury real estate advisory and mandate management firm headquartered in Pune, Maharashtra. We specialize in prime residential properties, gated township clusters, commercial IT parks, and off-market luxury penthouses across Pune's prime growth corridors.
                </p>

                <h3 style={{ fontSize: '0.96rem', color: GOLD, marginTop: '20px', marginBottom: '8px' }}>Key Operational Hubs:</h3>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  <li><strong>Hinjewadi Phase 1, 2 &amp; 3</strong> — IT Hub &amp; High-Growth Residential Clusters</li>
                  <li><strong>Wakad &amp; Tathawade</strong> — Premium 2 &amp; 3 BHK Gated Residential Townships</li>
                  <li><strong>Baner &amp; Balewadi Link Road</strong> — High-End Luxury Residencies &amp; Balewadi High Street Commercials</li>
                  <li><strong>Kharadi &amp; Viman Nagar</strong> — East Pune IT Corridors &amp; Commercial Parks</li>
                  <li><strong>Punawale &amp; Ravet</strong> — Rapid Growth Affordable &amp; Mid-Segment Housing</li>
                </ul>

                <h3 style={{ fontSize: '0.96rem', color: GOLD, marginTop: '20px', marginBottom: '8px' }}>Corporate Headquarters:</h3>
                <p style={{ margin: 0 }}>
                  📍 Office No. 19, Ground Floor, Prem Mairah, Hinjewadi Phase 1, Pune, Maharashtra – 411057<br/>
                  📞 Phone: +91 96730 00053<br/>
                  ✉️ Email: 24krealtorspune@gmail.com
                </p>
              </div>
            )}

            {/* TAB 2: CONTACT LOCALITY ADVISOR */}
            {activeTab === 'advisor' && (
              <div>
                <h2 style={{ fontSize: '1.3rem', color: '#FFF', fontWeight: 900, marginBottom: '14px', fontFamily: "'Cinzel', serif" }}>Contact Locality Advisor</h2>
                <p>
                  Speak directly with our dedicated micro-market locality specialists who possess deep insights into Pune's infrastructure developments, upcoming metro corridors, price appreciation trends, and builder delivery track records.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                  <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: GOLD }}>Hinjewadi &amp; Wakad Desk</div>
                    <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>Senior Advisor: Manish Rai</div>
                    <div style={{ fontSize: '0.74rem', color: '#FFF', fontWeight: 700, marginTop: '8px' }}>📞 +91 96730 00053</div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Speaks: English, Hindi, Marathi</div>
                  </div>

                  <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: GOLD }}>Baner &amp; Balewadi Desk</div>
                    <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>Senior Advisor: Jyoti Dhale</div>
                    <div style={{ fontSize: '0.74rem', color: '#FFF', fontWeight: 700, marginTop: '8px' }}>📞 +91 888 24 24 24</div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Speaks: English, Hindi, Marathi</div>
                  </div>
                </div>

                <div style={{ marginTop: '20px', padding: '14px', borderRadius: '10px', background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#25D366' }}>Instant WhatsApp Locality Consultation</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>Get instant price index, floor plans, and brochures on WhatsApp.</div>
                  </div>
                  <a href="https://wa.me/919673000053?text=Hi%2C%20I%20need%20a%20locality%20advisor%20for%20Pune%20properties" target="_blank" rel="noreferrer" style={{ padding: '8px 16px', borderRadius: '6px', background: '#25D366', color: '#000', fontSize: '0.74rem', fontWeight: 800, textDecoration: 'none' }}>
                    Chat Now
                  </a>
                </div>
              </div>
            )}

            {/* TAB 3: CAREERS AT 24K GROUP */}
            {activeTab === 'careers' && (
              <div>
                <h2 style={{ fontSize: '1.3rem', color: '#FFF', fontWeight: 900, marginBottom: '14px', fontFamily: "'Cinzel', serif" }}>Careers at 24K Group</h2>
                <p>
                  Join Western Maharashtra's fastest-growing luxury real estate consultancy. We offer competitive compensation, high-ticket commission splits, and structured career growth.
                </p>

                <h3 style={{ fontSize: '0.96rem', color: GOLD, marginTop: '16px', marginBottom: '10px' }}>Current Openings (Pune HQ):</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { title: 'Senior Relationship Manager (RM)', exp: '2-5 Years', dept: 'Sales', loc: 'Hinjewadi / Baner', salary: '₹ 4.5L - ₹ 8.0L LPA + Commission' },
                    { title: 'Locality & Site Tour Specialist', exp: '1-3 Years', dept: 'Operations', loc: 'Wakad / Hinjewadi', salary: '₹ 3.2L - ₹ 5.0L LPA + Incentives' },
                    { title: 'Property Legal & RERA Documentation Executive', exp: '2+ Years', dept: 'Legal & Compliance', loc: 'Hinjewadi HQ', salary: '₹ 4.0L - ₹ 6.5L LPA' },
                    { title: 'Digital Marketing & Lead Gen Executive', exp: '1-3 Years', dept: 'Marketing', loc: 'Hinjewadi HQ', salary: '₹ 3.5L - ₹ 5.5L LPA' },
                  ].map((job, i) => (
                    <div key={i} style={{ padding: '12px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>{job.title}</div>
                        <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>Experience: {job.exp} | Dept: {job.dept} | Location: {job.loc}</div>
                        <div style={{ fontSize: '0.7rem', color: GOLD, fontWeight: 700, marginTop: '2px' }}>{job.salary}</div>
                      </div>
                      <a href="mailto:careers@24krealtors.com?subject=Application%20for%20Career%20Position" style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(212,175,55,0.15)', border: `1px solid ${GOLD}40`, color: GOLD, fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none' }}>
                        Apply Now
                      </a>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '16px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>
                  Send your CV to <strong style={{ color: '#FFF' }}>careers@24krealtors.com</strong> or WhatsApp HR desk at <strong>+91 96730 00053</strong>.
                </div>
              </div>
            )}

            {/* TAB 4: TERMS & CONDITIONS */}
            {activeTab === 'terms' && (
              <div>
                <h2 style={{ fontSize: '1.3rem', color: '#FFF', fontWeight: 900, marginBottom: '14px', fontFamily: "'Cinzel', serif" }}>Terms &amp; Conditions</h2>
                
                <div style={{ fontSize: '0.74rem', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '14px' }}>
                  Last Updated: <strong>28 July 2026</strong> | Compliant with <strong>Real Estate (Regulation and Development) Act, 2016 (RERA)</strong> &amp; <strong>Maharashtra Real Estate Regulatory Authority (MahaRERA)</strong>.
                </div>

                <h3 style={{ fontSize: '0.9rem', color: GOLD, margin: '14px 0 6px 0' }}>1. MahaRERA Agent Mandate</h3>
                <p style={{ margin: 0 }}>
                  24K Realtors acts as a licensed Real Estate Agent under MahaRERA License Registration Number: <strong>A051262603190</strong>. All developer marketing, property listings, and site visits comply with MahaRERA guidelines.
                </p>

                <h3 style={{ fontSize: '0.9rem', color: GOLD, margin: '14px 0 6px 0' }}>2. Advisory &amp; Service Fee Policy</h3>
                <ul style={{ paddingLeft: '18px', margin: '4px 0' }}>
                  <li><strong>Direct Developer Bookings (Primary Market):</strong> No advisory fee charged to property buyers.</li>
                  <li><strong>Resale Transactions (Secondary Market):</strong> Standard professional advisory fee + GST charged upon sale deed execution.</li>
                  <li><strong>Rental / Lease Transactions:</strong> Standard 1 month rent + GST charged to lessor and lessee upon agreement registration.</li>
                </ul>

                <h3 style={{ fontSize: '0.9rem', color: GOLD, margin: '14px 0 6px 0' }}>3. Jurisdiction</h3>
                <p style={{ margin: 0 }}>
                  Any legal dispute or claim arising from advisory services rendered by 24K Realtors shall be governed under Indian Law and subject strictly to the exclusive jurisdiction of <strong>Courts at Pune, Maharashtra, India</strong>.
                </p>
              </div>
            )}

            {/* TAB 5: PRIVACY POLICY REGISTRY */}
            {activeTab === 'privacy' && (
              <div>
                <h2 style={{ fontSize: '1.3rem', color: '#FFF', fontWeight: 900, marginBottom: '14px', fontFamily: "'Cinzel', serif" }}>Privacy Policy Registry</h2>
                
                <div style={{ fontSize: '0.74rem', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '14px' }}>
                  Compliant with <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> &amp; <strong>Section 43A of Information Technology Act, 2000</strong>.
                </div>

                <p>
                  24K Realtors respects your personal data privacy. We collect client contact information (Name, Phone Number, Email, Property Requirement, Budget) solely for property matching, scheduling site visits, and sending requested brochures.
                </p>

                <h3 style={{ fontSize: '0.9rem', color: GOLD, margin: '14px 0 6px 0' }}>Data Retention &amp; Non-Disclosure:</h3>
                <ul style={{ paddingLeft: '18px', margin: '4px 0' }}>
                  <li>We <strong>NEVER sell or share</strong> client contact information to unauthorized 3rd-party telecallers or marketing databases.</li>
                  <li>All user credentials and enquiry data are encrypted at rest using AES-256 in secure Indian data center server nodes.</li>
                  <li>Users have the right to request full data erasure by emailing <strong>privacy@24krealtors.com</strong>.</li>
                </ul>
              </div>
            )}

            {/* TAB 6: GRIEVANCE REDRESSAL OFFICER */}
            {activeTab === 'grievance' && (
              <div>
                <h2 style={{ fontSize: '1.3rem', color: '#FFF', fontWeight: 900, marginBottom: '14px', fontFamily: "'Cinzel', serif" }}>Grievance Redressal Officer</h2>
                
                <p>
                  In accordance with Rule 3(11) of the Information Technology (Intermediaries Guidelines and Digital Media Ethics Code) Rules, 2021 and MahaRERA consumer grievance directives, the details of our Grievance Officer are provided below:
                </p>

                <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${GOLD}40`, marginTop: '16px' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: GOLD }}>Legal &amp; Grievance Redressal Cell — 24K Realtors</div>
                  <div style={{ fontSize: '0.78rem', color: '#FFF', marginTop: '6px' }}><strong>Designated Officer:</strong> Legal Officer, Compliance Division</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                    📍 Office No. 19, Ground Floor, Prem Mairah, Hinjewadi Phase 1, Pune – 411057, Maharashtra
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                    ✉️ Grievance Email: <strong style={{ color: GOLD }}>grievance@24krealtors.com</strong> / <strong style={{ color: GOLD }}>contact@24krealestate.com</strong>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                    📞 Telephone: +91 96730 00053 (Attn: Legal Cell)
                  </div>
                </div>

                <h3 style={{ fontSize: '0.9rem', color: GOLD, marginTop: '18px', marginBottom: '6px' }}>Resolution Timelines:</h3>
                <ul style={{ paddingLeft: '18px', margin: 0 }}>
                  <li><strong>Acknowledgment SLA:</strong> Within 48 hours of ticket receipt.</li>
                  <li><strong>Final Investigation &amp; Redressal:</strong> Resolved within 15 working days.</li>
                </ul>
              </div>
            )}

            {/* TAB 7: SUMMONS & SAFETY GUIDE */}
            {activeTab === 'summons' && (
              <div>
                <h2 style={{ fontSize: '1.3rem', color: '#FFF', fontWeight: 900, marginBottom: '14px', fontFamily: "'Cinzel', serif" }}>Summons &amp; Homebuyer Safety Guide</h2>
                
                <h3 style={{ fontSize: '0.96rem', color: GOLD, marginBottom: '8px' }}>Official Address for Service of Summons &amp; Legal Notices:</h3>
                <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#FFF', fontSize: '0.76rem', marginBottom: '18px' }}>
                  <strong>Service Address under Code of Civil Procedure (CPC) 1908:</strong><br/>
                  Legal Cell, 24K Realtors HQ, Office No. 19, Ground Floor, Prem Mairah, Hinjewadi Phase 1, Pune – 411057, Maharashtra, India.<br/>
                  Electronic Legal Service Email: <strong>legal@24krealtors.com</strong>
                </div>

                <h3 style={{ fontSize: '0.96rem', color: GOLD, marginBottom: '10px' }}>Homebuyer Legal Safety Checklist (MahaRERA Compliant):</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { step: '1. Verify MahaRERA Number', desc: 'Always check project RERA ID on maharera.maharashtra.gov.in before signing any booking application.' },
                    { step: '2. Insist on RERA Escrow Cheque/NEFT', desc: 'Never pay cash tokens. All booking payments must strictly go to developer RERA designated Escrow Bank Account.' },
                    { step: '3. Verify Title Deed & 7/12 Extract', desc: 'Check Search Report & Index-II for clear legal title and encumbrance-free land status.' },
                    { step: '4. Check OC & CC Status', desc: 'Ensure builder possesses valid Commencement Certificate (CC) for under-construction or Occupancy Certificate (OC) for ready units.' },
                  ].map((guide, i) => (
                    <div key={i} style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: GOLD }}>{guide.step}</div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>{guide.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
