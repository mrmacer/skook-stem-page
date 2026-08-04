#!/usr/bin/env python3
"""
build_dataset.py — Canonical source for the STEM@Skook29 EdTech & AI Resource Library.

ALL derived files (JSON, CSV, JS, collections, STATS.md) are generated from the
RECORDS and COLLECTIONS structures below. Never hand-edit files in dist/.

Verification honesty model:
  verificationMethod = "live-check"      -> page/documentation opened & verified on verifiedDate
  verificationMethod = "catalog-review"  -> included from curator knowledge of a stable, established
                                            resource; queued for first live verification
Records with catalog-review status carry verifiedDate = "pending-first-verification"
and appear in the STATS.md re-verification queue.

Run:  python3 build_dataset.py
"""

import csv
import io
import json
import os
import re
import subprocess
import sys
from collections import Counter

TODAY = "2026-07-24"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")

EVAL_NA = {
    "instructionalValue": "not-applicable", "easeOfUse": "not-applicable",
    "teacherControl": "not-applicable", "studentSafety": "not-applicable",
    "privacyTransparency": "not-applicable", "accessibility": "not-applicable",
    "costClarity": "not-applicable", "ageAppropriateness": "not-applicable",
    "evidenceQuality": "not-applicable", "districtReadiness": "not-applicable",
    "integrationSupport": "not-applicable", "protectsStudentThinking": "not-applicable",
}

RATING_VALUES = {"Strong", "Acceptable", "Mixed", "Concern", "Not enough information", "not-applicable"}
CONFIDENCE_VALUES = {"high", "medium", "low"}
ACCESS_VALUES = {"free", "freemium", "paid", "registration", "workshop", "planned"}


def R(id, title, organization, url, recordClass, description, categories, audiences,
      gradeBands, recommendedUse, confidence, verificationMethod, **kw):
    """Record factory. Guidance/document records inherit not-applicable tool fields."""
    rec = {
        "id": id,
        "title": title,
        "organization": organization,
        "url": url,
        "landingPage": kw.pop("landingPage", url),
        "recordClass": recordClass,
        "description": description,
        "categories": categories,
        "audiences": audiences,
        "gradeBands": gradeBands,
        "instructionalPurpose": kw.pop("instructionalPurpose", []),
        "classroomUseCase": kw.pop("classroomUseCase", ""),
        "districtUseCase": kw.pop("districtUseCase", ""),
        "access": kw.pop("access", "free"),
        "pricingSummary": kw.pop("pricingSummary", "Free to access."),
        "freeTierLimits": kw.pop("freeTierLimits", "not-applicable"),
        "accountRequired": kw.pop("accountRequired", False),
        "studentAccounts": kw.pop("studentAccounts", "not-applicable"),
        "minimumAge": kw.pop("minimumAge", "not-applicable"),
        "parentConsent": kw.pop("parentConsent", "not-applicable"),
        "teacherManaged": kw.pop("teacherManaged", "not-applicable"),
        "districtPlan": kw.pop("districtPlan", False),
        "integrations": kw.pop("integrations", []),
        "dpaAvailable": kw.pop("dpaAvailable", "not-applicable"),
        "privacySummary": kw.pop("privacySummary",
            "Informational resource; no student data exchange is required to use it."),
        "trainingDataSummary": kw.pop("trainingDataSummary", "not-applicable"),
        "retentionSummary": kw.pop("retentionSummary", "not-applicable"),
        "deletionOption": kw.pop("deletionOption", "not-applicable"),
        "accessibilityNotes": kw.pop("accessibilityNotes", ""),
        "languageSupport": kw.pop("languageSupport", ["English"]),
        "evidenceSummary": kw.pop("evidenceSummary", ""),
        "knownLimitations": kw.pop("knownLimitations", []),
        "riskNotes": kw.pop("riskNotes", []),
        "evaluation": {**EVAL_NA, **kw.pop("evaluation", {})},
        "recommendedUse": recommendedUse,
        "paSpecific": kw.pop("paSpecific", False),
        "featured": kw.pop("featured", False),
        "verifiedDate": kw.pop("verifiedDate",
            TODAY if verificationMethod == "live-check" else "pending-first-verification"),
        "verificationMethod": verificationMethod,
        "confidence": confidence,
        "curatorNote": kw.pop("curatorNote", ""),
        "relatedResources": kw.pop("relatedResources", []),
    }
    if kw:
        raise ValueError(f"Unknown fields on {id}: {sorted(kw)}")
    return rec


RECORDS = []

# =====================================================================
# 1. FRAMEWORKS AND OFFICIAL GUIDANCE
# =====================================================================

RECORDS += [
R("fw-pde-implementing-ai", "Implementing AI in Schools",
  "Pennsylvania Department of Education",
  "https://www.pa.gov/agencies/education/ai-digital-media-literacy/implementingaiinschools",
  "framework-guidance",
  "PDE guidance for Pennsylvania schools on AI adoption: reviewing vendor terms and data control, FERPA/COPPA compliance, transparent AI-use policies, equity of access, and baseline AI professional learning for educators.",
  ["Pennsylvania-Specific Resources", "District Policy and Governance", "AI Literacy Foundations", "Administrator Resources"],
  ["District Administrator", "Building Administrator", "Technology Director", "Curriculum Director", "School Board"],
  ["District / System Level", "Educator / Adult"],
  "Recommended for teacher use", "high", "live-check",
  districtUseCase="Anchor document for any IU29 member district drafting or updating AI policy; directly citable in board presentations.",
  evidenceSummary="Official state education agency guidance.",
  paSpecific=True, featured=True,
  curatorNote="The single most important PA anchor for this library. PDE guidance is recent; watch for expansion and possible AI endorsement standards for educator preparation."),

R("fw-used-ai-toolkit", "Empowering Education Leaders: A Toolkit for Safe, Ethical, and Equitable AI Integration",
  "U.S. Department of Education, Office of Educational Technology",
  "https://www.ed.gov/about/ed-overview/artificial-intelligence-ai-guidance",
  "framework-guidance",
  "Federal 10-module toolkit (Oct 2024) for district leaders covering risk mitigation, strategy, policy development, procurement, privacy, civil rights, and continuous evaluation of AI in K-12 systems.",
  ["District Policy and Governance", "Administrator Resources", "Technology Director Resources", "Privacy and Student Data"],
  ["District Administrator", "Building Administrator", "Technology Director", "School Board", "Data Privacy Officer"],
  ["District / System Level"],
  "Recommended for teacher use", "high", "live-check",
  districtUseCase="Structured backbone for a district AI readiness and policy process; pairs with the TeachAI toolkit.",
  evidenceSummary="Developed through engagement with educators, community members, and technology leaders under a federal mandate.",
  featured=True,
  curatorNote="Landing page verified; federal web reorganizations happen, so re-check the URL quarterly."),

R("fw-used-ocr-ai", "Avoiding the Discriminatory Use of Artificial Intelligence",
  "U.S. Department of Education, Office for Civil Rights",
  "https://www.ed.gov/about/ed-overview/artificial-intelligence-ai-guidance",
  "framework-guidance",
  "OCR resource explaining how AI use in schools intersects with civil rights law, including discriminatory impacts, deepfake non-consensual imagery as a Title IX issue, and obligations around protected student groups.",
  ["District Policy and Governance", "Privacy and Student Data", "Administrator Resources"],
  ["District Administrator", "Building Administrator", "Data Privacy Officer", "School Board"],
  ["District / System Level"],
  "Recommended for teacher use", "medium", "catalog-review",
  districtUseCase="Civil-rights lens for AI policy review; relevant to incident response planning for deepfake harassment.",
  curatorNote="Document reached via the ED AI guidance landing page; confirm the direct PDF link during first live verification."),

R("fw-used-dcl-2025", "Dear Colleague Letter: Responsible Integration of AI in Federally Funded Education Programs",
  "U.S. Department of Education",
  "https://www.ed.gov/media/document/opepd-ai-dear-colleague-letter-7222025-110427.pdf",
  "framework-guidance",
  "July 2025 guidance affirming that federal formula and discretionary grant funds may support responsible AI uses, including educator training and instructional enhancement, within existing statutory requirements.",
  ["District Policy and Governance", "Administrator Resources"],
  ["District Administrator", "Curriculum Director", "Technology Director"],
  ["District / System Level"],
  "Recommended for teacher use", "high", "live-check",
  districtUseCase="Funding-justification reference when districts braid federal funds (e.g., Title II/IV) into AI professional learning.",
  curatorNote="Useful in grant narratives, including STEMinPA-adjacent work."),

R("fw-teachai-toolkit", "AI Guidance for Schools Toolkit",
  "TeachAI (Code.org, ETS, ISTE, Khan Academy, WEF coalition)",
  "https://www.teachai.org/toolkit",
  "framework-guidance",
  "Widely adopted, CC-licensed toolkit (2025 update) with sample guidance language, staff/student communication templates, and policy considerations that education systems can adapt locally.",
  ["District Policy and Governance", "AI Literacy Foundations", "Administrator Resources"],
  ["District Administrator", "Building Administrator", "Curriculum Director", "Instructional Coach", "School Board"],
  ["District / System Level", "Educator / Adult"],
  "Recommended for teacher use", "high", "live-check",
  districtUseCase="Fastest path from no guidance to draft guidance; adaptable under a CC BY-NC-SA license.",
  evidenceSummary="Produced by a multi-organization coalition; cites RAND American Educator Panel adoption data.",
  featured=True),

R("fw-ai4k12", "AI4K12: Five Big Ideas in Artificial Intelligence",
  "AI4K12 Initiative (AAAI / CSTA, NSF-funded)",
  "https://ai4k12.org/",
  "framework-guidance",
  "The de facto national framework for K-12 AI literacy: five big ideas (perception, representation and reasoning, learning, natural interaction, societal impact) with grade-band progression charts and curated activities.",
  ["AI Literacy Foundations", "Understanding How AI Works", "Computational Thinking"],
  ["Classroom Teacher", "Curriculum Director", "Instructional Coach"],
  ["K-2", "3-5", "6-8", "9-12", "Educator / Adult"],
  "Recommended for teacher use", "high", "catalog-review",
  classroomUseCase="Backbone for scoping what AI literacy means at each grade band; grade-band charts translate directly into curriculum maps.",
  evidenceSummary="NSF-funded initiative of AAAI and CSTA; widely cited in state and national AI literacy work.",
  featured=True),

R("fw-unesco-students", "UNESCO AI Competency Framework for Students",
  "UNESCO",
  "https://www.unesco.org/en/articles/ai-competency-framework-students",
  "framework-guidance",
  "Global framework (2024) defining student AI competencies across a human-centered mindset, ethics of AI, AI techniques and applications, and AI system design, with progression levels.",
  ["AI Literacy Foundations", "Understanding How AI Works"],
  ["Curriculum Director", "Classroom Teacher", "District Administrator"],
  ["K-12 Adaptable", "Educator / Adult"],
  "Recommended for teacher use", "high", "catalog-review",
  curatorNote="Strong ethics-first counterweight to vendor-driven framings; pair with AI4K12 for U.S. classroom alignment."),

R("fw-unesco-teachers", "UNESCO AI Competency Framework for Teachers",
  "UNESCO",
  "https://www.unesco.org/en/articles/ai-competency-framework-teachers",
  "framework-guidance",
  "Companion framework (2024) defining what teachers need to know about AI across ethics, foundations, pedagogy, and professional learning, at acquisition/deepening/creation levels.",
  ["AI Literacy Foundations", "Professional Learning"],
  ["Instructional Coach", "Curriculum Director", "District Administrator", "Classroom Teacher"],
  ["Educator / Adult"],
  "Recommended for teacher use", "high", "catalog-review",
  districtUseCase="Design skeleton for a multi-year educator AI PD scope and sequence."),

R("fw-nist-ai-rmf", "NIST AI Risk Management Framework",
  "National Institute of Standards and Technology",
  "https://www.nist.gov/itl/ai-risk-management-framework",
  "framework-guidance",
  "Voluntary federal framework for identifying, measuring, and managing AI risk (govern/map/measure/manage), with a Generative AI Profile. The reference standard behind most serious district AI governance work.",
  ["District Policy and Governance", "Technology Director Resources", "Privacy and Student Data"],
  ["Technology Director", "District Administrator", "Data Privacy Officer"],
  ["District / System Level"],
  "Recommended for teacher use", "high", "catalog-review",
  districtUseCase="Vocabulary and structure for technology directors writing AI risk language into procurement and AUPs.",
  curatorNote="Not education-specific; best used by tech directors rather than classroom staff."),

R("fw-digitalpromise-ai-literacy", "Digital Promise AI Literacy: A Framework to Understand, Evaluate, and Use Emerging Technology",
  "Digital Promise",
  "https://digitalpromise.org/initiative/artificial-intelligence-in-education/",
  "framework-guidance",
  "Research-based AI literacy framework organized around Understand, Evaluate, and Use modes, plus a growing library of district case studies and educator resources.",
  ["AI Literacy Foundations", "Professional Learning", "Research and Evidence"],
  ["Curriculum Director", "Instructional Coach", "Classroom Teacher"],
  ["Educator / Adult", "K-12 Adaptable"],
  "Recommended for teacher use", "medium", "catalog-review",
  curatorNote="Verify the current canonical framework URL on first live check; Digital Promise reorganizes initiative pages periodically."),

R("fw-used-2023-report", "Artificial Intelligence and the Future of Teaching and Learning",
  "U.S. Department of Education, Office of Educational Technology",
  "https://www.ed.gov/about/ed-overview/artificial-intelligence-ai-guidance",
  "research-report",
  "Foundational May 2023 federal report framing AI in education around keeping humans in the loop, with recommendations on trust, teacher involvement, R&D, and guardrails. Predates the 2024 toolkit but remains conceptually strong.",
  ["Research and Evidence", "AI Literacy Foundations", "District Policy and Governance"],
  ["District Administrator", "Curriculum Director", "Technology Director"],
  ["District / System Level", "Educator / Adult"],
  "Recommended for teacher use", "medium", "catalog-review",
  curatorNote="Cite for the 'humans in the loop' framing; use the 2024 toolkit for operational decisions."),
]

# =====================================================================
# 2. AI LITERACY CURRICULA AND LESSON COLLECTIONS
# =====================================================================

RECORDS += [
R("cur-commonsense-ai", "Common Sense Education AI Literacy Lessons",
  "Common Sense Education",
  "https://www.commonsense.org/education/collections/ai-literacy-lessons-for-grades-6-12",
  "curriculum",
  "Free, classroom-ready AI literacy lessons (chatbots, how generative AI works, bias, deepfakes, responsible use) designed for grades 6-12, with slide decks and teacher guides requiring minimal prep.",
  ["AI Literacy Foundations", "Digital Citizenship", "Classroom Integration"],
  ["Classroom Teacher", "Middle School Teacher", "High School Teacher", "Instructional Coach"],
  ["6-8", "9-12"],
  "Recommended for teacher use", "high", "catalog-review",
  accountRequired=False,
  classroomUseCase="Genuine Monday-morning material: a teacher can deliver an AI literacy lesson tomorrow with no student accounts.",
  featured=True),

R("cur-codeorg-ai", "Code.org AI Curriculum (How AI Works, AI Foundations, Generative AI lessons)",
  "Code.org",
  "https://code.org/ai",
  "curriculum",
  "Free AI curriculum units and video series spanning elementary through high school, covering how AI and machine learning work, ethics, and hands-on activities inside Code.org's teacher-managed platform.",
  ["AI Literacy Foundations", "Understanding How AI Works", "Coding and Building AI", "Computational Thinking"],
  ["Classroom Teacher", "Elementary Teacher", "Middle School Teacher", "High School Teacher"],
  ["3-5", "6-8", "9-12"],
  "Recommended for teacher use", "high", "catalog-review",
  accountRequired=True, studentAccounts="yes", teacherManaged="yes",
  minimumAge="Under-13 student accounts supported with school/parent consent flows",
  parentConsent="Handled through Code.org's established school account model",
  privacySummary="Code.org is a nonprofit with a long-standing student privacy program; accounts are teacher-managed.",
  classroomUseCase="Structured multi-week AI units inside a platform many districts already trust for CS.",
  featured=True),

R("cur-dayofai", "Day of AI",
  "MIT RAISE (Responsible AI for Social Empowerment and Education)",
  "https://www.dayofai.org/",
  "curriculum",
  "Free K-12 AI literacy curriculum from MIT RAISE with facilitated lessons on generative AI, deepfakes, recommendation systems, and responsible design; built for teachers without CS backgrounds.",
  ["AI Literacy Foundations", "Understanding How AI Works", "Digital Citizenship"],
  ["Classroom Teacher", "Elementary Teacher", "Middle School Teacher", "High School Teacher"],
  ["K-2", "3-5", "6-8", "9-12"],
  "Recommended for teacher use", "high", "catalog-review",
  accountRequired=True,
  classroomUseCase="Turnkey AI literacy days or units; strong fit for makerspace and STEM-event programming.",
  curatorNote="Free educator registration required to download materials."),

R("cur-mit-daily", "DAILy Curriculum (Developing AI Literacy)",
  "MIT Media Lab / MIT RAISE",
  "https://raise.mit.edu/daily/",
  "curriculum",
  "Middle-school AI literacy curriculum weaving technical concepts, ethics, and career futures, developed and studied by MIT researchers; includes hands-on activities like training classifiers and examining bias.",
  ["AI Literacy Foundations", "Understanding How AI Works", "Computational Thinking"],
  ["Middle School Teacher", "Instructional Coach"],
  ["6-8"],
  "Recommended for teacher use", "medium", "catalog-review",
  evidenceSummary="Developed with NSF support and studied in published research on middle schoolers' AI learning.",
  curatorNote="Verify current hosting URL on first live check; MIT RAISE has reorganized project pages."),

R("cur-aiedu", "aiEDU: The AI Education Project",
  "aiEDU",
  "https://www.aiedu.org/",
  "curriculum",
  "Nonprofit AI readiness curriculum and teacher resources (foundations courses, project dossiers, discussion activities) targeting equitable access to AI literacy, particularly for under-resourced schools.",
  ["AI Literacy Foundations", "Classroom Integration", "Professional Learning"],
  ["Classroom Teacher", "High School Teacher", "Middle School Teacher", "Curriculum Director"],
  ["6-8", "9-12", "Educator / Adult"],
  "Recommended for teacher use", "medium", "catalog-review",
  curatorNote="Contributor to the TeachAI toolkit; equity framing aligns with the Skook29 access mission."),

R("cur-experience-ai", "Experience AI",
  "Raspberry Pi Foundation with Google DeepMind",
  "https://experience-ai.org/",
  "curriculum",
  "Free lesson sequences and teacher training on how machine learning works, built by the Raspberry Pi Foundation with DeepMind researchers; strong technical accuracy with no student accounts required.",
  ["Understanding How AI Works", "AI Literacy Foundations", "Computational Thinking"],
  ["Middle School Teacher", "High School Teacher", "Classroom Teacher"],
  ["6-8", "9-12"],
  "Recommended for teacher use", "high", "catalog-review",
  classroomUseCase="Technically rigorous ML lessons vetted by actual ML researchers; good spine for an 'under the hood' unit.",
  curatorNote="One of the few curricula reviewed by working ML researchers rather than only educators."),
]

# =====================================================================
# 3. DIGITAL CITIZENSHIP AND MEDIA LITERACY
# =====================================================================

RECORDS += [
R("dc-commonsense-digcit", "Common Sense Digital Citizenship Curriculum",
  "Common Sense Education",
  "https://www.commonsense.org/education/digital-citizenship/curriculum",
  "digcit-media",
  "The most widely used free K-12 digital citizenship curriculum in the U.S., covering media balance, privacy, digital footprint, communication, cyberbullying, and news/media literacy, with pacing by grade.",
  ["Digital Citizenship", "Media Literacy and Deepfakes", "Family and Community Resources"],
  ["Classroom Teacher", "Elementary Teacher", "Middle School Teacher", "High School Teacher", "Instructional Coach"],
  ["K-2", "3-5", "6-8", "9-12"],
  "Recommended for teacher use", "high", "catalog-review",
  classroomUseCase="The foundation layer the site philosophy calls for: digital citizenship before AI tools.",
  featured=True),

R("dc-checkology", "Checkology",
  "News Literacy Project",
  "https://get.checkology.org/",
  "digcit-media",
  "Free interactive e-learning platform teaching students to evaluate news, identify misinformation, and understand journalism standards; includes lessons relevant to AI-generated and manipulated media.",
  ["Media Literacy and Deepfakes", "Digital Citizenship"],
  ["Middle School Teacher", "High School Teacher", "Classroom Teacher"],
  ["6-8", "9-12"],
  "Recommended with district review", "high", "catalog-review",
  accountRequired=True, studentAccounts="yes", teacherManaged="yes",
  minimumAge="Designed for middle/high school; teacher-provisioned rosters",
  privacySummary="Nonprofit provider; free for educators. Review current privacy terms before rostering students.",
  classroomUseCase="Structured misinformation and source-evaluation lessons students complete under teacher management."),

R("dc-rumorguard", "RumorGuard",
  "News Literacy Project",
  "https://www.rumorguard.org/",
  "digcit-media",
  "Continuously updated library of debunked viral misinformation, each example annotated with the credibility factors it violates; excellent source of real, current classroom examples including AI-generated fakes.",
  ["Media Literacy and Deepfakes", "Digital Citizenship"],
  ["Classroom Teacher", "Middle School Teacher", "High School Teacher", "Family / Caregiver"],
  ["6-8", "9-12", "Educator / Adult"],
  "Recommended for teacher use", "medium", "catalog-review",
  classroomUseCase="Bell-ringer material: pull this week's viral fake and analyze it with the five factors."),

R("dc-cor", "Civic Online Reasoning",
  "Digital Inquiry Group (formerly Stanford History Education Group)",
  "https://cor.inquirygroup.org/",
  "digcit-media",
  "Research-backed curriculum teaching lateral reading and source evaluation, built from studies of how students actually judge online information; free lessons and assessments.",
  ["Media Literacy and Deepfakes", "Digital Citizenship", "Research and Evidence"],
  ["Middle School Teacher", "High School Teacher", "Instructional Coach"],
  ["6-8", "9-12"],
  "Recommended for teacher use", "high", "catalog-review",
  evidenceSummary="Grounded in peer-reviewed research on student evaluation of online sources; lateral reading has experimental support.",
  curatorNote="SHEG became the independent Digital Inquiry Group in 2024; old stanford.edu links redirect but should be updated."),

R("dc-mediawise", "MediaWise",
  "Poynter Institute",
  "https://www.poynter.org/mediawise/",
  "digcit-media",
  "Poynter's digital media literacy program with free fact-checking curricula, a Teen Fact-Checking Network, and courses for teens, adults, and older adults on spotting misinformation including AI-generated content.",
  ["Media Literacy and Deepfakes", "Family and Community Resources", "Digital Citizenship"],
  ["High School Teacher", "Family / Caregiver", "Community Partner"],
  ["9-12", "Educator / Adult"],
  "Recommended for teacher use", "medium", "catalog-review",
  curatorNote="The peer-to-peer Teen Fact-Checking Network videos land well with high schoolers."),

R("dc-cai", "Content Authenticity Initiative / Content Credentials",
  "Adobe-led coalition (CAI / C2PA)",
  "https://contentauthenticity.org/",
  "digcit-media",
  "Industry coalition behind Content Credentials, the emerging provenance standard for labeling how media was created or altered (including AI generation); explainers useful for teaching synthetic-media literacy.",
  ["Media Literacy and Deepfakes", "Understanding How AI Works"],
  ["High School Teacher", "Technology Director", "Classroom Teacher"],
  ["9-12", "Educator / Adult"],
  "Useful resource, not a classroom tool", "medium", "catalog-review",
  riskNotes=["Industry-led initiative; present as one provenance approach, not a solved problem. Absence of credentials does not prove authenticity."],
  classroomUseCase="Teach students to inspect Content Credentials on images as one verification habit among several."),
]

# =====================================================================
# 4. DISTRICT POLICY AND GOVERNANCE
# =====================================================================

RECORDS += [
R("pol-aifored-tracker", "State AI Guidance for Education Tracker",
  "AI for Education",
  "https://www.aiforeducation.io/ai-resources/state-ai-guidance",
  "policy-governance",
  "Continuously updated tracker and analysis of every state's K-12 AI guidance, summarizing what each framework prohibits, allows, and emphasizes; the fastest way to benchmark against other states.",
  ["District Policy and Governance", "Administrator Resources", "Pennsylvania-Specific Resources"],
  ["District Administrator", "Curriculum Director", "School Board", "Technology Director"],
  ["District / System Level"],
  "Recommended for teacher use", "high", "live-check",
  districtUseCase="Benchmarking source for PA districts writing policy while state-level guidance continues to evolve.",
  curatorNote="Commercial PD provider, but the tracker itself is a genuinely useful public good; treat their PD offerings as a separate purchasing decision."),

R("pol-cosn-ai", "CoSN AI in Education Resources",
  "Consortium for School Networking (CoSN)",
  "https://www.cosn.org/ai/",
  "policy-governance",
  "The K-12 technology leaders' association hub for AI governance: readiness resources, procurement guidance, and district case studies aimed squarely at CTOs and technology directors.",
  ["Technology Director Resources", "District Policy and Governance", "Privacy and Student Data"],
  ["Technology Director", "District Administrator", "Data Privacy Officer"],
  ["District / System Level"],
  "Recommended for teacher use", "medium", "catalog-review",
  districtUseCase="Primary professional home for the technology-director audience of this library."),

R("pol-cosn-cgcs-checklist", "K-12 Generative AI Readiness Checklist",
  "CoSN and the Council of the Great City Schools",
  "https://www.cosn.org/ai/",
  "policy-governance",
  "Practical district readiness checklist spanning executive leadership, operations, data, technical, and security readiness for generative AI adoption; designed to be worked through as a leadership team.",
  ["District Policy and Governance", "Technology Director Resources", "Administrator Resources"],
  ["District Administrator", "Technology Director", "School Board"],
  ["District / System Level"],
  "Recommended for teacher use", "medium", "catalog-review",
  districtUseCase="Concrete self-assessment an IU could facilitate with member district leadership teams in a single working session.",
  curatorNote="Locate the current direct download from the CoSN AI hub on first live verification."),

R("pol-sreb", "SREB Commission on Artificial Intelligence in Education",
  "Southern Regional Education Board",
  "https://www.sreb.org/artificial-intelligence",
  "policy-governance",
  "Multi-state commission producing recommendations for AI in teaching and learning, policy, and workforce alignment; useful as a cross-state policy reference even outside SREB states.",
  ["District Policy and Governance", "Research and Evidence", "Administrator Resources"],
  ["District Administrator", "School Board", "Curriculum Director"],
  ["District / System Level"],
  "Useful resource, not a classroom tool", "medium", "catalog-review"),

R("pol-psba", "PSBA Guidance and Policy Services on Artificial Intelligence",
  "Pennsylvania School Boards Association",
  "https://www.psba.org/",
  "policy-governance",
  "PSBA policy services and guidance supporting Pennsylvania school boards on AI-related policy adoption, aligned to PA's local-control context where each district sets its own AI policy.",
  ["Pennsylvania-Specific Resources", "District Policy and Governance"],
  ["School Board", "District Administrator"],
  ["District / System Level"],
  "Recommended with district review", "medium", "catalog-review",
  access="registration",
  pricingSummary="Some materials member-only; PSBA membership is near-universal among PA districts.",
  curatorNote="Verify current AI policy offerings and direct links with PSBA on first live check; policy service materials sit behind member access."),
]

# =====================================================================
# 5. PRIVACY, SECURITY, AND PROCUREMENT
# =====================================================================

RECORDS += [
R("priv-commonsense-privacy", "Common Sense Privacy Program",
  "Common Sense Media",
  "https://privacy.commonsense.org/",
  "privacy-security",
  "Independent, standardized privacy evaluations of hundreds of edtech products, scoring data collection, sharing, selling, advertising, and safety practices against a published rubric.",
  ["Privacy and Student Data", "Tool Evaluation", "Technology Director Resources"],
  ["Technology Director", "Data Privacy Officer", "District Administrator", "Classroom Teacher"],
  ["District / System Level", "Educator / Adult"],
  "Recommended for teacher use", "high", "catalog-review",
  districtUseCase="First stop before any tool pilot: check whether an independent evaluation already exists.",
  featured=True),

R("priv-sdpc", "Student Data Privacy Consortium and the PA Student Data Privacy Alliance",
  "A4L Community / SDPC",
  "https://privacy.a4l.org/",
  "privacy-security",
  "National consortium maintaining a searchable registry of signed student data privacy agreements (DPAs), including Pennsylvania's state alliance, so districts can find and piggyback on existing vendor agreements.",
  ["Privacy and Student Data", "Pennsylvania-Specific Resources", "Technology Director Resources"],
  ["Technology Director", "Data Privacy Officer", "District Administrator"],
  ["District / System Level"],
  "Recommended for teacher use", "high", "catalog-review",
  paSpecific=True,
  districtUseCase="Before signing anything, search the registry: another PA district may already have a DPA with the vendor that yours can join.",
  featured=True),

R("priv-fpf-compass", "Student Privacy Compass",
  "Future of Privacy Forum",
  "https://studentprivacycompass.org/",
  "privacy-security",
  "FPF's clearinghouse of student privacy explainers, training, and AI-specific privacy resources translating FERPA/COPPA/state law into plain language for educators and administrators.",
  ["Privacy and Student Data", "Professional Learning", "Technology Director Resources"],
  ["Data Privacy Officer", "Technology Director", "District Administrator", "Classroom Teacher"],
  ["District / System Level", "Educator / Adult"],
  "Recommended for teacher use", "high", "catalog-review"),

R("priv-ftc-coppa", "FTC Children's Online Privacy Protection Act (COPPA) Guidance",
  "Federal Trade Commission",
  "https://www.ftc.gov/business-guidance/privacy-security/childrens-privacy",
  "privacy-security",
  "The authoritative federal source on COPPA obligations, including how schools may consent on behalf of parents for educational services and what operators may do with children's data.",
  ["Privacy and Student Data", "District Policy and Governance"],
  ["Data Privacy Officer", "Technology Director", "District Administrator"],
  ["District / System Level"],
  "Recommended for teacher use", "high", "catalog-review",
  curatorNote="COPPA rule amendments finalized in 2025 affect edtech; confirm current effective requirements during live verification."),

R("priv-ptac", "Student Privacy at the U.S. Department of Education (PTAC)",
  "U.S. Department of Education, Student Privacy Policy Office",
  "https://studentprivacy.ed.gov/",
  "privacy-security",
  "Official FERPA guidance, training, and technical assistance, including resources on online services, vendor terms, and data governance directly applicable to AI tools handling education records.",
  ["Privacy and Student Data", "District Policy and Governance"],
  ["Data Privacy Officer", "Technology Director", "District Administrator"],
  ["District / System Level"],
  "Recommended for teacher use", "high", "catalog-review"),
]

# =====================================================================
# 6. TEACHER PRODUCTIVITY TOOLS AND ASSISTANTS  (live-verified block)
# =====================================================================

RECORDS += [
R("tool-magicschool", "MagicSchool AI",
  "Magic School, Inc.",
  "https://www.magicschool.ai/",
  "teacher-tool",
  "K-12-specific AI platform with 80+ pre-built educator tools (lesson planning, differentiation, rubrics, IEP drafting, communication) plus teacher-supervised student Rooms with monitoring and moderation.",
  ["Teacher Planning and Productivity", "Classroom Integration", "Differentiation and UDL", "Student Learning and Inquiry"],
  ["Classroom Teacher", "Special Education Teacher", "Instructional Coach", "District Administrator"],
  ["Educator / Adult", "K-12 Adaptable"],
  "Recommended with district review", "high", "live-check",
  access="freemium",
  pricingSummary="Free tier for individual teachers; Plus at $12.99/mo or $8.33/mo billed annually ($99.96/yr); Enterprise for schools/districts with volume pricing.",
  freeTierLimits="Free plan includes core tools with usage limits; Plus removes limits and adds output history, AI editing, and 1-click exports.",
  accountRequired=True, studentAccounts="yes", teacherManaged="yes",
  minimumAge="Student use occurs inside teacher-created Rooms; district terms govern student access",
  parentConsent="Governed by school consent model under district agreement; confirm locally",
  districtPlan=True,
  integrations=["Google Docs", "Google Classroom", "Canva", "Canvas"],
  dpaAvailable="yes",
  privacySummary="Vendor states FERPA/COPPA/GDPR alignment and SOC 2 Type 2 certification; privacy policy commits not to use Student Data to train or fine-tune AI models or permit third-party AI providers to do so. Common Sense Privacy has evaluated the product favorably.",
  trainingDataSummary="Vendor states student data is not used to train external AI models; zero-data-retention arrangements with model providers are claimed.",
  retentionSummary="Content stored to support access and oversight per vendor policy; district DPAs can specify retention terms.",
  deletionOption="Deletion supported under district agreements; confirm specifics in your DPA.",
  evidenceSummary="Vendor-reported time savings (7-10 hrs/week) are marketing claims, not independent research. Independent evidence of learning impact is not yet established.",
  knownLimitations=["Generative outputs require professional review, especially IEP and assessment content.",
                    "Free-tier limits shift over time; re-verify before PD sessions."],
  riskNotes=["Never enter student PII into free individual accounts; PII workflows belong under a district Enterprise agreement with a signed DPA."],
  evaluation={"instructionalValue": "Strong", "easeOfUse": "Strong", "teacherControl": "Strong",
              "studentSafety": "Acceptable", "privacyTransparency": "Strong", "accessibility": "Acceptable",
              "costClarity": "Strong", "ageAppropriateness": "Acceptable", "evidenceQuality": "Mixed",
              "districtReadiness": "Strong", "integrationSupport": "Strong", "protectsStudentThinking": "Mixed"},
  featured=True,
  curatorNote="The strongest all-around district-ready teacher platform reviewed. 'Protects student thinking' rated Mixed because pre-built generators make cognitive offloading easy without deliberate task design."),

R("tool-schoolai", "SchoolAI",
  "SchoolAI",
  "https://schoolai.com/",
  "teacher-tool",
  "Platform centered on teacher-created student 'Spaces' — guarded AI chat experiences students join by link — with a real-time Mission Control dashboard, safety alerts, and educator productivity tools.",
  ["Student Learning and Inquiry", "Classroom Integration", "Teacher Planning and Productivity", "Feedback and Formative Assessment"],
  ["Classroom Teacher", "Middle School Teacher", "High School Teacher", "Special Education Teacher"],
  ["K-12 Adaptable", "Educator / Adult"],
  "Recommended with district review", "high", "live-check",
  access="freemium",
  pricingSummary="Free for individual teachers; school/district tiers are quote-based (third-party reviews describe roughly per-student annual pricing; confirm directly).",
  freeTierLimits="Free tier includes pre-made Spaces, limited PowerUps, insight dashboard, and Chrome extension; session limits reported on free plans.",
  accountRequired=True, studentAccounts="yes", teacherManaged="yes",
  minimumAge="Students join teacher Spaces via link without self-created accounts; district terms govern",
  parentConsent="Under school consent model with district agreement; confirm locally",
  districtPlan=True,
  integrations=["Google Classroom", "Canvas", "PowerSchool", "Chrome extension"],
  dpaAvailable="unclear",
  privacySummary="Vendor states FERPA/COPPA alignment, SOC 2 certification, and direct agreements with model providers so student/educator data is not saved or used to train models. Common Sense Education has published an editorial review. Request current compliance documentation directly.",
  trainingDataSummary="Vendor states data is never used to train future models via direct provider agreements.",
  retentionSummary="Not clearly disclosed in the reviewed public documentation; request in procurement.",
  deletionOption="Not clearly disclosed in the reviewed public documentation; specify in DPA.",
  evidenceSummary="Common Sense editorial review notes engaging student Spaces but shallow chat depth without strong teacher design. No independent learning-outcome studies identified.",
  knownLimitations=["Chat quality depends heavily on how well the teacher scopes the Space.",
                    "Compliance documentation is less publicly detailed than MagicSchool's; procurement should request it."],
  riskNotes=["The monitoring dashboard is a strength but also a surveillance-adjacent feature; set clear classroom norms about what teachers see."],
  evaluation={"instructionalValue": "Acceptable", "easeOfUse": "Strong", "teacherControl": "Strong",
              "studentSafety": "Strong", "privacyTransparency": "Acceptable", "accessibility": "Acceptable",
              "costClarity": "Mixed", "ageAppropriateness": "Acceptable", "evidenceQuality": "Mixed",
              "districtReadiness": "Acceptable", "integrationSupport": "Strong", "protectsStudentThinking": "Acceptable"},
  curatorNote="Best-in-class teacher visibility and control over student AI interactions; the most defensible way reviewed to put AI in student hands."),

R("tool-brisk", "Brisk Teaching",
  "Brisk Teaching",
  "https://www.briskteaching.com/",
  "teacher-tool",
  "Chrome extension layering AI teacher tools over Google Docs, Slides, and the open web: instant lesson resources, leveled texts, feedback on student writing, and 'Boost' interactive activities.",
  ["Teacher Planning and Productivity", "Feedback and Formative Assessment", "Classroom Integration"],
  ["Classroom Teacher", "Instructional Coach"],
  ["Educator / Adult"],
  "Recommended with district review", "medium", "live-check",
  access="freemium",
  pricingSummary="Free tier; Educator Pro reported at $99.99/yr with unlimited 'Turbo' usage; custom school/district plans with DPAs.",
  freeTierLimits="Usage caps on the free tier; premium model access and some feedback features gated.",
  accountRequired=True, studentAccounts="no", teacherManaged="not-applicable",
  districtPlan=True,
  integrations=["Google Workspace", "Chrome extension", "Google Classroom"],
  dpaAvailable="yes",
  privacySummary="District plans advertise custom DPAs. Because the extension reads content in the teacher's browser context, districts should review its permissions model carefully.",
  trainingDataSummary="Not clearly disclosed in the reviewed public documentation; request in procurement.",
  retentionSummary="Not clearly disclosed in the reviewed public documentation.",
  deletionOption="Not clearly disclosed in the reviewed public documentation.",
  knownLimitations=["Includes an AI writing-detection feature; per this library's standards, detector output must never be treated as proof of misconduct."],
  riskNotes=["Browser-extension architecture means broad page access; technology directors should review extension permissions before fleet deployment."],
  evaluation={"instructionalValue": "Acceptable", "easeOfUse": "Strong", "teacherControl": "Acceptable",
              "studentSafety": "not-applicable", "privacyTransparency": "Mixed", "accessibility": "Acceptable",
              "costClarity": "Acceptable", "ageAppropriateness": "not-applicable", "evidenceQuality": "Not enough information",
              "districtReadiness": "Acceptable", "integrationSupport": "Strong", "protectsStudentThinking": "Mixed"},
  curatorNote="Genuinely useful for Google-centric teachers; flag the detector feature explicitly in any PD that introduces it."),

R("tool-diffit", "Diffit",
  "Diffit",
  "https://web.diffit.me/",
  "teacher-tool",
  "Differentiation-focused AI tool that turns any topic, text, or standard into leveled readings with vocabulary and comprehension questions across reading levels and languages. Teacher-facing only; no student accounts.",
  ["Differentiation and UDL", "Teacher Planning and Productivity", "Accessibility"],
  ["Classroom Teacher", "Special Education Teacher", "Elementary Teacher", "Middle School Teacher", "High School Teacher"],
  ["Educator / Adult"],
  "Recommended for teacher use", "high", "live-check",
  access="freemium",
  pricingSummary="Permanent free plan; individual premium $14.99/mo or $149.99/yr; school/district site licenses flat-rate by size; first-year teachers free; new accounts get a 60-day premium trial.",
  freeTierLimits="Free plan: unlimited leveled generation with PDF export; premium adds Google Classroom/Docs/Slides/Forms export, standards alignment, and additional formats.",
  accountRequired=True, studentAccounts="no",
  districtPlan=True,
  integrations=["Google Classroom", "Google Docs", "Google Slides", "Google Forms"],
  dpaAvailable="unclear",
  privacySummary="Teacher-facing design collects no student data in normal use, which simplifies the privacy posture considerably. Vendor states FERPA/COPPA alignment; confirm certification specifics directly.",
  trainingDataSummary="Not clearly disclosed in the reviewed public documentation.",
  retentionSummary="Teacher-created materials stored to account; details in vendor policy.",
  deletionOption="Account deletion available per vendor policy.",
  evidenceSummary="Vendor-run teacher surveys report strong satisfaction; no independent learning-outcome studies identified.",
  knownLimitations=["Generated passages need content-accuracy review like all generative text.",
                    "Free tier's PDF-only export is the main workflow friction."],
  evaluation={"instructionalValue": "Strong", "easeOfUse": "Strong", "teacherControl": "Strong",
              "studentSafety": "not-applicable", "privacyTransparency": "Acceptable", "accessibility": "Strong",
              "costClarity": "Strong", "ageAppropriateness": "not-applicable", "evidenceQuality": "Mixed",
              "districtReadiness": "Strong", "integrationSupport": "Acceptable", "protectsStudentThinking": "Strong"},
  featured=True,
  curatorNote="The cleanest recommendation in the tool set: high instructional value, teacher-only, minimal privacy surface. Strong UDL/ELL fit."),

R("tool-chatgpt-teachers", "ChatGPT for Teachers",
  "OpenAI",
  "https://chatgpt.com/k12-verification",
  "teacher-tool",
  "Secure ChatGPT workspace for verified U.S. K-12 educators and staff, free through June 2027, with education-grade data protections, admin controls, and support for working with classroom materials. Explicitly not for students.",
  ["Teacher Planning and Productivity", "Classroom Integration", "Prompt Literacy"],
  ["Classroom Teacher", "Building Administrator", "District Administrator", "Instructional Coach"],
  ["Educator / Adult"],
  "Recommended with district review", "high", "live-check",
  access="registration",
  pricingSummary="Free for verified U.S. K-12 educators through June 2027; verification via school/district email.",
  freeTierLimits="Program terms and post-2027 pricing not yet announced.",
  accountRequired=True, studentAccounts="no", minimumAge="18+ (educator program)",
  districtPlan=True,
  dpaAvailable="unclear",
  privacySummary="OpenAI states education-grade protections and compliance-supporting admin controls for this plan, distinct from consumer ChatGPT. Consumer ChatGPT terms (13+ with parental consent to 17) remain a separate product and are not a school deployment path.",
  trainingDataSummary="Vendor states workspace content is protected under education terms; confirm current training-exclusion language in the plan's terms during procurement.",
  retentionSummary="Workspace-level controls; confirm in current terms.",
  deletionOption="Workspace admin controls; confirm in current terms.",
  knownLimitations=["Free-through-2027 framing is a market-share strategy; plan for the pricing cliff.",
                    "No student path: any student-facing plan must use a different product."],
  riskNotes=["Do not let the free educator plan normalize consumer-ChatGPT student use by osmosis; the two have very different terms."],
  evaluation={"instructionalValue": "Strong", "easeOfUse": "Strong", "teacherControl": "Acceptable",
              "studentSafety": "not-applicable", "privacyTransparency": "Acceptable", "accessibility": "Acceptable",
              "costClarity": "Mixed", "ageAppropriateness": "not-applicable", "evidenceQuality": "Not enough information",
              "districtReadiness": "Acceptable", "integrationSupport": "Acceptable", "protectsStudentThinking": "Mixed"},
  curatorNote="Launched Nov 2025 with ~150k-educator district cohort. The 'free until June 2027' clock is the key procurement fact."),

R("tool-claude-teachers", "Claude for Teachers",
  "Anthropic",
  "https://claude.com/resources/tutorials/getting-started-with-claude-for-teachers",
  "teacher-tool",
  "Free professional Claude accounts for verified U.S. K-12 school staff (launched July 2026), with teaching skills, a Learning Commons connector mapped to all 50 states' standards, and K-12-specific data terms. 18+, no student accounts.",
  ["Teacher Planning and Productivity", "Classroom Integration", "Prompt Literacy"],
  ["Classroom Teacher", "Instructional Coach", "Curriculum Director", "Building Administrator"],
  ["Educator / Adult"],
  "Recommended with district review", "high", "live-check",
  access="registration",
  pricingSummary="Free for at least one year for verified U.S. K-12 staff who sign up by June 30, 2027; school/district version described as coming soon.",
  freeTierLimits="Post-free-year pricing not yet announced.",
  accountRequired=True, studentAccounts="no", minimumAge="18+ (enforced; users under 18 are prohibited from Claude)",
  districtPlan=False,
  integrations=["ASSISTments", "Brisk Teaching", "Canva Education", "Diffit", "MagicSchool", "Learning Commons standards connector"],
  dpaAvailable="yes",
  privacySummary="Vendor states teacher inputs are not used for model training under the program's K-12 terms, with a FERPA-aligned data processing agreement.",
  trainingDataSummary="Vendor states no model training on educator inputs under K-12 program terms.",
  retentionSummary="Governed by program terms; confirm current documentation.",
  deletionOption="Account-level controls per Anthropic policy.",
  evidenceSummary="A Detroit Public Schools pilot studying educator wellbeing and practice is underway; results not yet available.",
  knownLimitations=["Brand new (July 14, 2026): expect rapid iteration and verify details before district PD.",
                    "Individual-educator program today; district-wide administration is still 'coming soon.'"],
  evaluation={"instructionalValue": "Strong", "easeOfUse": "Strong", "teacherControl": "Acceptable",
              "studentSafety": "not-applicable", "privacyTransparency": "Strong", "accessibility": "Acceptable",
              "costClarity": "Mixed", "ageAppropriateness": "not-applicable", "evidenceQuality": "Not enough information",
              "districtReadiness": "Acceptable", "integrationSupport": "Strong", "protectsStudentThinking": "Mixed"},
  curatorNote="Disclosure: this catalog was compiled with Claude's assistance; the evaluation above applies the same rubric and skepticism as every other vendor record."),

R("tool-gemini-edu", "Gemini for Education (Google Workspace for Education)",
  "Google for Education",
  "https://edu.google.com/intl/ALL_us/ai/gemini-for-education/",
  "teacher-tool",
  "The Gemini app as a Core Service in all Google Workspace for Education editions, free of charge, available to users of all ages under admin control, with enterprise-grade data protection and a stricter under-18 experience.",
  ["Teacher Planning and Productivity", "Student Learning and Inquiry", "Classroom Integration"],
  ["Classroom Teacher", "Technology Director", "District Administrator", "Student"],
  ["K-12 Adaptable", "Educator / Adult", "District / System Level"],
  "Student use requires district approval", "high", "live-check",
  access="freemium",
  pricingSummary="Included free in all Workspace for Education editions; paid add-ons (e.g., Google AI Pro for Education) expand premium models and Gemini-in-apps features.",
  freeTierLimits="Premium model access, Gemini in Docs/Gmail/etc., and expanded NotebookLM limits require paid add-ons.",
  accountRequired=True, studentAccounts="yes", teacherManaged="yes",
  minimumAge="All ages within Workspace for Education, admin-enabled by organizational unit; under-18 users get stricter content policies",
  parentConsent="Handled under the district's existing Workspace for Education consent framework",
  districtPlan=True,
  integrations=["Google Classroom", "Google Workspace", "Gemini LTI (Schoology, Canvas)"],
  dpaAvailable="yes",
  privacySummary="As a Core Service, covered under existing Workspace for Education terms: Google states data is not human-reviewed or used to train AI models, supporting FERPA/COPPA compliance.",
  trainingDataSummary="Vendor states education-account data is not used to train models.",
  retentionSummary="Admin-configurable chat retention via Admin console; Vault search supported.",
  deletionOption="Admin and user controls under Workspace terms.",
  knownLimitations=["Default-ON rollout for core services means districts must make an active decision, not a passive one.",
                    "The all-ages availability is recent; age-appropriateness at K-5 deserves genuine local scrutiny, not vendor assurance."],
  riskNotes=["'Available to all ages' is an access fact, not a pedagogical endorsement; elementary deployment should be deliberate and narrow."],
  evaluation={"instructionalValue": "Strong", "easeOfUse": "Strong", "teacherControl": "Strong",
              "studentSafety": "Acceptable", "privacyTransparency": "Strong", "accessibility": "Strong",
              "costClarity": "Acceptable", "ageAppropriateness": "Mixed", "evidenceQuality": "Not enough information",
              "districtReadiness": "Strong", "integrationSupport": "Strong", "protectsStudentThinking": "Mixed"},
  featured=True,
  curatorNote="For the many Google districts in the IU29 footprint, this is the biggest single decision on the board: Gemini is now sitting inside the domain, on by default at the top OU for many configurations."),

R("tool-notebooklm", "NotebookLM (Workspace for Education)",
  "Google",
  "https://notebooklm.google.com/",
  "teacher-tool",
  "Source-grounded AI notebook: upload readings, notes, or standards and get summaries, study guides, and audio overviews grounded in those sources. Now a Workspace for Education Core Service available to all ages under admin control.",
  ["Student Learning and Inquiry", "Teacher Planning and Productivity", "Feedback and Formative Assessment"],
  ["Classroom Teacher", "High School Teacher", "Student", "Instructional Coach"],
  ["6-8", "9-12", "Educator / Adult"],
  "Student use requires district approval", "high", "live-check",
  access="freemium",
  pricingSummary="Included in Workspace for Education editions; NotebookLM Plus limits expand with Gemini Education add-ons.",
  freeTierLimits="Caps on notebooks, sources, queries, and audio overviews at the base tier.",
  accountRequired=True, studentAccounts="yes", teacherManaged="yes",
  minimumAge="All ages within Workspace for Education under admin control (previously 18+; expanded 2025-2026)",
  parentConsent="Under district Workspace consent framework",
  districtPlan=True,
  integrations=["Google Workspace", "Google Classroom (assigning notebooks)"],
  dpaAvailable="yes",
  privacySummary="Core Service under Workspace for Education terms; Google states data is not human-reviewed or used for model training.",
  trainingDataSummary="Vendor states education-account data is not used to train models.",
  retentionSummary="Governed by Workspace admin settings.",
  deletionOption="User/admin deletion under Workspace terms.",
  knownLimitations=["Source-grounding reduces but does not eliminate errors; summaries can flatten nuance.",
                    "Audio overviews are engaging but can substitute for reading if tasks aren't designed carefully."],
  evaluation={"instructionalValue": "Strong", "easeOfUse": "Strong", "teacherControl": "Acceptable",
              "studentSafety": "Acceptable", "privacyTransparency": "Strong", "accessibility": "Strong",
              "costClarity": "Acceptable", "ageAppropriateness": "Acceptable", "evidenceQuality": "Not enough information",
              "districtReadiness": "Strong", "integrationSupport": "Strong", "protectsStudentThinking": "Acceptable"},
  featured=True,
  curatorNote="Pedagogically the most interesting mainstream tool here: source-grounding models the exact 'AI anchored to real material' habit the site philosophy wants."),

R("tool-copilot-edu", "Microsoft Copilot for Education",
  "Microsoft",
  "https://www.microsoft.com/en-us/education/copilot",
  "teacher-tool",
  "Microsoft's AI assistant with enterprise data protection for education tenants, plus Copilot features in Microsoft 365 apps and educator resources through Microsoft Learn.",
  ["Teacher Planning and Productivity", "Classroom Integration"],
  ["Classroom Teacher", "Technology Director", "District Administrator"],
  ["Educator / Adult", "K-12 Adaptable"],
  "Recommended with district review", "medium", "catalog-review",
  access="freemium",
  pricingSummary="Copilot Chat with data protection included for education faculty tenants; Microsoft 365 Copilot is a paid per-user add-on.",
  freeTierLimits="Deep Microsoft 365 app integration requires the paid Copilot license.",
  accountRequired=True, studentAccounts="unclear",
  minimumAge="Faculty access broadly available; student age gates vary by service and license — verify current admin documentation",
  districtPlan=True,
  integrations=["Microsoft 365", "Teams for Education"],
  dpaAvailable="yes",
  privacySummary="Enterprise data protection for education tenants: vendor states prompts and responses are not used to train foundation models.",
  trainingDataSummary="Vendor states tenant data with enterprise data protection is not used for model training.",
  retentionSummary="Governed by Microsoft 365 tenant policies.",
  deletionOption="Tenant admin controls.",
  knownLimitations=["Student availability and age thresholds have shifted repeatedly; this record needs live verification before any student-facing recommendation."],
  evaluation={"instructionalValue": "Acceptable", "easeOfUse": "Acceptable", "teacherControl": "Acceptable",
              "studentSafety": "Not enough information", "privacyTransparency": "Acceptable", "accessibility": "Strong",
              "costClarity": "Mixed", "ageAppropriateness": "Not enough information", "evidenceQuality": "Not enough information",
              "districtReadiness": "Acceptable", "integrationSupport": "Strong", "protectsStudentThinking": "Mixed"},
  curatorNote="Included primarily for the Microsoft-shop districts; student-access facts are the least stable in this record set."),

R("tool-canva-edu", "Canva for Education",
  "Canva",
  "https://www.canva.com/education/",
  "teacher-tool",
  "Free design platform for verified K-12 teachers and their students with classroom management, template libraries, and AI features (Magic Write, image generation) that admins and teachers can control.",
  ["Content Creation", "Classroom Integration", "Teacher Planning and Productivity"],
  ["Classroom Teacher", "Elementary Teacher", "Middle School Teacher", "High School Teacher"],
  ["K-12 Adaptable", "Educator / Adult"],
  "Recommended with district review", "medium", "catalog-review",
  access="free",
  pricingSummary="Canva for Education is free for verified K-12 teachers and students; district-level deployment available.",
  freeTierLimits="Education tier includes premium features free; some AI feature quotas apply.",
  accountRequired=True, studentAccounts="yes", teacherManaged="yes",
  minimumAge="Student access via teacher/district-managed classes; under-13 supported within the education product's consent model",
  parentConsent="School consent model; confirm district process",
  districtPlan=True,
  integrations=["Google Classroom", "Canvas", "Schoology", "Microsoft Teams"],
  dpaAvailable="yes",
  privacySummary="Education-specific product with school data protections; vendor states education accounts have AI training controls. Verify current AI-feature data terms, which have changed as Canva expanded AI.",
  trainingDataSummary="Vendor provides education-account protections and AI controls; re-verify current terms on live check.",
  retentionSummary="Per education terms.",
  deletionOption="Per education terms.",
  knownLimitations=["AI image generation in student hands needs clear classroom norms; admins can restrict AI features."],
  evaluation={"instructionalValue": "Strong", "easeOfUse": "Strong", "teacherControl": "Strong",
              "studentSafety": "Acceptable", "privacyTransparency": "Acceptable", "accessibility": "Strong",
              "costClarity": "Strong", "ageAppropriateness": "Acceptable", "evidenceQuality": "Not enough information",
              "districtReadiness": "Strong", "integrationSupport": "Strong", "protectsStudentThinking": "Acceptable"}),

R("tool-adobe-express-edu", "Adobe Express for Education",
  "Adobe",
  "https://www.adobe.com/education/express/",
  "teacher-tool",
  "Free creation suite for K-12 with education-safe defaults: admin deployment, safe search, and generative AI (Firefly) features that schools can enable or disable; Firefly is trained on licensed/Adobe Stock content.",
  ["Content Creation", "Classroom Integration", "Media Literacy and Deepfakes"],
  ["Classroom Teacher", "Middle School Teacher", "High School Teacher", "Technology Director"],
  ["K-12 Adaptable", "Educator / Adult"],
  "Recommended with district review", "medium", "catalog-review",
  access="free",
  pricingSummary="Free for K-12 schools and districts with admin deployment.",
  accountRequired=True, studentAccounts="yes", teacherManaged="yes",
  minimumAge="K-12 deployment through district admin consoles with education safeguards",
  parentConsent="School consent model; confirm district process",
  districtPlan=True,
  integrations=["Google Classroom", "Adobe Admin Console", "Clever/ClassLink SSO"],
  dpaAvailable="yes",
  privacySummary="Education deployment includes district data agreements; vendor states education users' content is not used to train Firefly. Verify current terms.",
  trainingDataSummary="Vendor states Firefly trains on licensed content, not customer education content; re-verify on live check.",
  retentionSummary="Per education terms.",
  deletionOption="Per education terms.",
  curatorNote="The Content Credentials tie-in makes this a natural pairing with synthetic-media literacy lessons.",
  evaluation={"instructionalValue": "Strong", "easeOfUse": "Strong", "teacherControl": "Strong",
              "studentSafety": "Acceptable", "privacyTransparency": "Acceptable", "accessibility": "Strong",
              "costClarity": "Strong", "ageAppropriateness": "Acceptable", "evidenceQuality": "Not enough information",
              "districtReadiness": "Strong", "integrationSupport": "Strong", "protectsStudentThinking": "Acceptable"}),

R("tool-curipod", "Curipod",
  "Curipod",
  "https://curipod.com/",
  "teacher-tool",
  "AI-assisted interactive lesson builder: generates discussion-driven slide decks with polls, drawings, and word clouds that students join live with a code — engagement-first rather than answer-first.",
  ["Classroom Integration", "Feedback and Formative Assessment", "Teacher Planning and Productivity"],
  ["Classroom Teacher", "Elementary Teacher", "Middle School Teacher"],
  ["3-5", "6-8", "9-12", "Educator / Adult"],
  "Recommended with district review", "medium", "catalog-review",
  access="freemium",
  pricingSummary="Free tier for teachers; premium and school plans add features and limits — verify current tiers.",
  freeTierLimits="Generation and feature limits on the free tier.",
  accountRequired=True, studentAccounts="no", teacherManaged="yes",
  minimumAge="Students join live sessions by code without accounts",
  districtPlan=True,
  dpaAvailable="unclear",
  privacySummary="Join-by-code participation limits student data surface; verify current privacy documentation on live check.",
  trainingDataSummary="Not clearly disclosed in the reviewed public documentation.",
  retentionSummary="Not clearly disclosed in the reviewed public documentation.",
  deletionOption="Not clearly disclosed in the reviewed public documentation.",
  evaluation={"instructionalValue": "Acceptable", "easeOfUse": "Strong", "teacherControl": "Strong",
              "studentSafety": "Acceptable", "privacyTransparency": "Mixed", "accessibility": "Acceptable",
              "costClarity": "Mixed", "ageAppropriateness": "Acceptable", "evidenceQuality": "Not enough information",
              "districtReadiness": "Acceptable", "integrationSupport": "Acceptable", "protectsStudentThinking": "Acceptable"},
  curatorNote="The interaction model (students respond, AI scaffolds discussion) protects thinking better than pure generators."),

R("tool-eduaide", "Eduaide.ai",
  "Eduaide",
  "https://www.eduaide.ai/",
  "teacher-tool",
  "Teacher workspace with a large bank of resource generators plus a feedback assistant and assessment builder, organized around instructional planning workflows rather than open chat.",
  ["Teacher Planning and Productivity", "Feedback and Formative Assessment"],
  ["Classroom Teacher", "Instructional Coach"],
  ["Educator / Adult"],
  "Recommended with district review", "medium", "catalog-review",
  access="freemium",
  pricingSummary="Free tier with generation limits; Pro subscription and school plans — verify current pricing.",
  freeTierLimits="Monthly generation caps on free tier.",
  accountRequired=True, studentAccounts="no",
  districtPlan=True,
  dpaAvailable="unclear",
  privacySummary="Teacher-facing; verify current privacy documentation on live check.",
  trainingDataSummary="Not clearly disclosed in the reviewed public documentation.",
  retentionSummary="Not clearly disclosed in the reviewed public documentation.",
  deletionOption="Not clearly disclosed in the reviewed public documentation.",
  evaluation={"instructionalValue": "Acceptable", "easeOfUse": "Acceptable", "teacherControl": "Acceptable",
              "studentSafety": "not-applicable", "privacyTransparency": "Mixed", "accessibility": "Acceptable",
              "costClarity": "Mixed", "ageAppropriateness": "not-applicable", "evidenceQuality": "Not enough information",
              "districtReadiness": "Acceptable", "integrationSupport": "Acceptable", "protectsStudentThinking": "Mixed"}),
]

# =====================================================================
# 7. STUDENT-FACING LEARNING ENVIRONMENTS
# =====================================================================

RECORDS += [
R("stu-khanmigo", "Khanmigo",
  "Khan Academy",
  "https://www.khanmigo.ai/",
  "student-environment",
  "Khan Academy's AI tutor and teaching assistant using a Socratic, hint-first approach scoped to Khan content; free teacher tools for U.S. K-12 educators, low-cost learner/family plans, and district partnerships.",
  ["Student Learning and Inquiry", "Feedback and Formative Assessment", "Teacher Planning and Productivity"],
  ["Student", "Classroom Teacher", "Family / Caregiver", "District Administrator"],
  ["3-5", "6-8", "9-12", "Educator / Adult"],
  "Student use requires district approval", "high", "live-check",
  access="freemium",
  pricingSummary="Teacher tools free for U.S. K-12 educators; learner/family plan about $4/mo or $44/yr; district access via per-student partnership pricing (quotes required).",
  freeTierLimits="Free teacher access does not grant student access; student access requires family subscription or district partnership.",
  accountRequired=True, studentAccounts="yes", teacherManaged="yes",
  minimumAge="Child accounts supported under parent/school consent models within Khan Academy's established framework",
  parentConsent="Parent or school consent per Khan Academy account model",
  districtPlan=True,
  integrations=["Clever SecureSync", "ClassLink", "SSO"],
  dpaAvailable="yes",
  privacySummary="Nonprofit provider with a long-standing student privacy program; Common Sense has rated Khanmigo favorably relative to general chatbots for safety and learning design.",
  trainingDataSummary="Khan Academy states student data is not used to train models; confirm current terms in district agreements.",
  retentionSummary="Per Khan Academy privacy policy and district agreements.",
  deletionOption="Supported per policy/agreement.",
  evidenceSummary="Design draws on tutoring research; independent large-scale outcome evidence is still emerging, and engagement has proven harder than early hype suggested.",
  knownLimitations=["Strongest in math; humanities and creative writing support is thinner.",
                    "Socratic guardrails occasionally frustrate students who need direct instruction."],
  evaluation={"instructionalValue": "Strong", "easeOfUse": "Strong", "teacherControl": "Strong",
              "studentSafety": "Strong", "privacyTransparency": "Strong", "accessibility": "Acceptable",
              "costClarity": "Acceptable", "ageAppropriateness": "Strong", "evidenceQuality": "Mixed",
              "districtReadiness": "Strong", "integrationSupport": "Strong", "protectsStudentThinking": "Strong"},
  featured=True,
  curatorNote="The strongest example in the catalog of AI designed to protect student thinking: hint-first tutoring is the pattern to hold other student tools against."),

R("stu-assistments", "ASSISTments",
  "ASSISTments Foundation / Worcester Polytechnic Institute",
  "https://new.assistments.org/",
  "student-environment",
  "Free math practice and formative feedback platform with one of the strongest independent evidence bases in edtech (efficacy studies including an SRI randomized trial); increasingly incorporates AI-supported feedback for teachers.",
  ["Feedback and Formative Assessment", "Student Learning and Inquiry", "Research and Evidence"],
  ["Classroom Teacher", "Middle School Teacher", "Student"],
  ["6-8", "9-12"],
  "Recommended with district review", "medium", "catalog-review",
  access="free",
  pricingSummary="Free; nonprofit, research-funded.",
  accountRequired=True, studentAccounts="yes", teacherManaged="yes",
  minimumAge="Teacher-rostered classes under school consent model",
  parentConsent="School consent model",
  districtPlan=True,
  integrations=["Google Classroom", "Canvas"],
  dpaAvailable="yes",
  privacySummary="Nonprofit research provider with established school privacy practices.",
  evidenceSummary="A rare edtech product with a randomized controlled efficacy study showing math learning gains; ESSA-tier evidence.",
  evaluation={"instructionalValue": "Strong", "easeOfUse": "Acceptable", "teacherControl": "Strong",
              "studentSafety": "Strong", "privacyTransparency": "Strong", "accessibility": "Acceptable",
              "costClarity": "Strong", "ageAppropriateness": "Strong", "evidenceQuality": "Strong",
              "districtReadiness": "Acceptable", "integrationSupport": "Acceptable", "protectsStudentThinking": "Strong"},
  curatorNote="Include in every conversation where someone says edtech has no evidence base; this is what actual evidence looks like."),
]

# =====================================================================
# 8. COMPUTATIONAL THINKING AND AI CREATION
# =====================================================================

RECORDS += [
R("ct-teachable-machine", "Teachable Machine",
  "Google Creative Lab",
  "https://teachablemachine.withgoogle.com/",
  "ct-ai-creation",
  "Browser tool for training simple image, sound, and pose classifiers with your own examples in minutes — the single best hands-on demo of how machine learning actually learns, with no accounts required.",
  ["Understanding How AI Works", "Coding and Building AI", "Computational Thinking", "Classroom Integration"],
  ["Classroom Teacher", "Elementary Teacher", "Middle School Teacher", "High School Teacher", "Student"],
  ["3-5", "6-8", "9-12"],
  "Recommended for teacher use", "high", "catalog-review",
  accountRequired=False, studentAccounts="not-applicable", teacherManaged="yes",
  minimumAge="No accounts; models train in-browser. Camera/microphone use should follow local policy",
  privacySummary="Training happens in the browser; no account needed. Follow district policy for camera/mic use.",
  classroomUseCase="The makerspace staple: train a classifier live, then break it on purpose to teach bias and training data limits.",
  evaluation={"instructionalValue": "Strong", "easeOfUse": "Strong", "teacherControl": "Strong",
              "studentSafety": "Strong", "privacyTransparency": "Strong", "accessibility": "Acceptable",
              "costClarity": "Strong", "ageAppropriateness": "Strong", "evidenceQuality": "Acceptable",
              "districtReadiness": "Strong", "integrationSupport": "Acceptable", "protectsStudentThinking": "Strong"},
  featured=True),

R("ct-ml4kids", "Machine Learning for Kids",
  "Dale Lane (IBM engineer; independent project)",
  "https://machinelearningforkids.co.uk/",
  "ct-ai-creation",
  "Free platform where students train ML models (text, image, sound, numbers) and use them in Scratch, App Inventor, or Python projects, with an extensive library of tested lesson worksheets.",
  ["Coding and Building AI", "Understanding How AI Works", "Computational Thinking"],
  ["Classroom Teacher", "Middle School Teacher", "High School Teacher", "Student"],
  ["3-5", "6-8", "9-12"],
  "Recommended with district review", "high", "catalog-review",
  accountRequired=True, studentAccounts="yes", teacherManaged="yes",
  minimumAge="Teacher-managed class accounts; teacher controls student credentials",
  parentConsent="School consent model",
  integrations=["Scratch", "MIT App Inventor", "Python"],
  privacySummary="Long-running independent education project with teacher-managed accounts; review current hosting/data details for district use.",
  classroomUseCase="Bridges from 'AI as concept' to 'AI as material': students build ML-powered Scratch games with models they trained.",
  evaluation={"instructionalValue": "Strong", "easeOfUse": "Acceptable", "teacherControl": "Strong",
              "studentSafety": "Strong", "privacyTransparency": "Acceptable", "accessibility": "Acceptable",
              "costClarity": "Strong", "ageAppropriateness": "Strong", "evidenceQuality": "Acceptable",
              "districtReadiness": "Acceptable", "integrationSupport": "Strong", "protectsStudentThinking": "Strong"}),

R("ct-scratch", "Scratch",
  "Scratch Foundation / MIT",
  "https://scratch.mit.edu/",
  "ct-ai-creation",
  "The world's largest creative coding community for kids; the foundation layer for AI-creation work via extensions and companion tools (e.g., Machine Learning for Kids), and the computational-thinking on-ramp AI literacy builds on.",
  ["Computational Thinking", "Coding and Building AI", "Content Creation"],
  ["Elementary Teacher", "Middle School Teacher", "Classroom Teacher", "Student"],
  ["K-2", "3-5", "6-8"],
  "Recommended for teacher use", "high", "catalog-review",
  accountRequired=False, studentAccounts="yes", teacherManaged="yes",
  minimumAge="Usable without accounts; teacher accounts can manage student rosters; under-13 supported via Scratch's consent model",
  parentConsent="Scratch's established under-13 flow or teacher accounts",
  privacySummary="Nonprofit with a mature child-privacy posture.",
  curatorNote="CT is the OS, AI is the app: Scratch is the OS layer of this catalog.",
  evaluation={"instructionalValue": "Strong", "easeOfUse": "Strong", "teacherControl": "Strong",
              "studentSafety": "Strong", "privacyTransparency": "Strong", "accessibility": "Acceptable",
              "costClarity": "Strong", "ageAppropriateness": "Strong", "evidenceQuality": "Strong",
              "districtReadiness": "Strong", "integrationSupport": "Strong", "protectsStudentThinking": "Strong"}),

R("ct-appinventor", "MIT App Inventor (with AI extensions)",
  "MIT",
  "https://appinventor.mit.edu/",
  "ct-ai-creation",
  "Block-based mobile app builder with AI/ML extensions (image classification, chatbots, Teachable Machine model import) letting secondary students build real AI-powered apps.",
  ["Coding and Building AI", "Computational Thinking", "Understanding How AI Works"],
  ["Middle School Teacher", "High School Teacher", "Student"],
  ["6-8", "9-12"],
  "Recommended with district review", "medium", "catalog-review",
  accountRequired=True, studentAccounts="yes", teacherManaged="yes",
  minimumAge="Google or code-based login options; classroom setups documented for under-13 use",
  parentConsent="School consent model",
  integrations=["Teachable Machine model import"],
  privacySummary="MIT-run education project; review login model chosen for your classroom.",
  evaluation={"instructionalValue": "Strong", "easeOfUse": "Acceptable", "teacherControl": "Acceptable",
              "studentSafety": "Strong", "privacyTransparency": "Acceptable", "accessibility": "Acceptable",
              "costClarity": "Strong", "ageAppropriateness": "Strong", "evidenceQuality": "Acceptable",
              "districtReadiness": "Acceptable", "integrationSupport": "Acceptable", "protectsStudentThinking": "Strong"}),
]

# =====================================================================
# 9. ACCESSIBILITY AND UDL
# =====================================================================

RECORDS += [
R("acc-cast-udl", "CAST Universal Design for Learning Guidelines 3.0",
  "CAST",
  "https://udlguidelines.cast.org/",
  "accessibility-udl",
  "The canonical UDL framework (3.0, 2024) for designing learning with multiple means of engagement, representation, and action/expression — the pedagogical frame this library uses for judging AI differentiation tools.",
  ["Differentiation and UDL", "Accessibility", "AI Literacy Foundations"],
  ["Classroom Teacher", "Special Education Teacher", "Curriculum Director", "Instructional Coach"],
  ["Educator / Adult", "K-12 Adaptable"],
  "Recommended for teacher use", "high", "catalog-review",
  evidenceSummary="Grounded in learning-sciences research; the 3.0 revision reflects a decade of field feedback.",
  featured=True),

R("acc-aem", "National AEM Center at CAST",
  "CAST / U.S. Department of Education (OSEP-funded)",
  "https://aem.cast.org/",
  "accessibility-udl",
  "National center on Accessible Educational Materials: guidance on accessible formats, procurement language for accessibility, and quality indicators districts can write directly into edtech (and AI tool) purchasing.",
  ["Accessibility", "Technology Director Resources", "District Policy and Governance"],
  ["Technology Director", "Special Education Teacher", "District Administrator", "Data Privacy Officer"],
  ["District / System Level", "Educator / Adult"],
  "Recommended for teacher use", "high", "catalog-review",
  districtUseCase="Source of ready-made accessibility procurement language for AI tool contracts."),

R("acc-immersive-reader", "Microsoft Immersive Reader and Learning Tools",
  "Microsoft",
  "https://www.microsoft.com/en-us/education/products/learning-tools",
  "accessibility-udl",
  "Free, built-in reading accessibility layer (read-aloud, syllabification, translation, picture dictionary, line focus) embedded across Microsoft 365, many LMSs, and partner apps — assistive AI with a real evidence trail.",
  ["Accessibility", "Differentiation and UDL"],
  ["Classroom Teacher", "Special Education Teacher", "Student"],
  ["K-2", "3-5", "6-8", "9-12"],
  "Recommended for teacher use", "high", "catalog-review",
  accountRequired=False,
  integrations=["Microsoft 365", "OneNote", "Teams", "many third-party apps"],
  privacySummary="Operates within the host application's terms (typically the district Microsoft tenant).",
  evidenceSummary="One of the few AI-adjacent tools with published research on reading outcomes.",
  evaluation={"instructionalValue": "Strong", "easeOfUse": "Strong", "teacherControl": "Acceptable",
              "studentSafety": "Strong", "privacyTransparency": "Strong", "accessibility": "Strong",
              "costClarity": "Strong", "ageAppropriateness": "Strong", "evidenceQuality": "Strong",
              "districtReadiness": "Strong", "integrationSupport": "Strong", "protectsStudentThinking": "Strong"}),

R("acc-pattan", "PaTTAN (Pennsylvania Training and Technical Assistance Network)",
  "Pennsylvania Department of Education, Bureau of Special Education",
  "https://www.pattan.net/",
  "accessibility-udl",
  "Pennsylvania's special education technical assistance network: assistive technology resources, trainings, and consultation directly relevant to AI, accessibility, and IEP-related technology decisions in PA districts.",
  ["Pennsylvania-Specific Resources", "Accessibility", "Professional Learning", "Differentiation and UDL"],
  ["Special Education Teacher", "District Administrator", "Instructional Coach", "Technology Director"],
  ["District / System Level", "Educator / Adult"],
  "Recommended for teacher use", "high", "catalog-review",
  paSpecific=True,
  districtUseCase="First PA-specific stop for assistive technology and special-education-adjacent AI questions; natural partner for Living IEP-style work.",
  featured=True),

R("acc-ciddl", "CIDDL (Center for Innovation, Design, and Digital Learning)",
  "University of Kansas (OSEP-funded)",
  "https://ciddl.org/",
  "accessibility-udl",
  "Federally funded center on educational technology and AI in special education; its researchers advised the U.S. ED AI toolkit, and its briefs address AI for students with disabilities specifically.",
  ["Accessibility", "Research and Evidence", "Differentiation and UDL"],
  ["Special Education Teacher", "Curriculum Director", "Instructional Coach"],
  ["Educator / Adult", "District / System Level"],
  "Recommended for teacher use", "medium", "catalog-review",
  curatorNote="Fills the biggest content gap in most AI libraries: AI and students with disabilities, from actual researchers."),
]

# =====================================================================
# 10. ACADEMIC INTEGRITY AND ASSESSMENT REDESIGN
# =====================================================================

RECORDS += [
R("int-detector-research", "GPT Detectors Are Biased Against Non-Native English Writers (Liang et al., Patterns, 2023)",
  "Stanford University researchers / Cell Press Patterns (peer-reviewed)",
  "https://www.cell.com/patterns/fulltext/S2666-3899(23)00130-7",
  "research-report",
  "Peer-reviewed study showing AI-text detectors falsely flag non-native English writing at high rates — the citable evidence behind this library's rule that detector output is never proof of misconduct.",
  ["Academic Integrity", "Research and Evidence", "Tool Evaluation"],
  ["Building Administrator", "High School Teacher", "Curriculum Director", "District Administrator"],
  ["District / System Level", "Educator / Adult"],
  "Recommended for teacher use", "high", "catalog-review",
  evidenceSummary="Peer-reviewed; consistent with OpenAI's own withdrawal of its AI-text classifier for low accuracy.",
  riskNotes=["Districts using detector scores as primary evidence in discipline face both fairness and legal exposure; this record exists to stop that."],
  featured=True,
  curatorNote="Deliberately included as the anchor of a 'detectors: handle with care' stance rather than listing detector products."),

R("int-mla-cccc", "MLA-CCCC Joint Task Force on Writing and AI",
  "Modern Language Association and Conference on College Composition and Communication",
  "https://aiandwriting.hcommons.org/",
  "integrity-assessment",
  "Working papers and guidance from the major writing-studies organizations on generative AI and writing instruction: policy considerations, assessment design, and student guidance grounded in composition research.",
  ["Academic Integrity", "Assessment Redesign", "Research and Evidence"],
  ["High School Teacher", "Curriculum Director", "Instructional Coach"],
  ["9-12", "Educator / Adult"],
  "Recommended for teacher use", "medium", "catalog-review",
  curatorNote="Higher-ed-leaning but the most rigorous writing-instruction perspective available; translates well to HS English."),

R("int-aias", "The AI Assessment Scale (AIAS)",
  "Perkins, Furze, Roe, and MacVaugh (open framework)",
  "https://aiassessmentscale.com/",
  "integrity-assessment",
  "Simple five-level scale (from 'no AI' to 'full AI with human oversight') for declaring what AI use is permitted on each assessment — the most practical assessment-transparency tool currently in circulation.",
  ["Assessment Redesign", "Academic Integrity", "Classroom Integration"],
  ["Classroom Teacher", "High School Teacher", "Middle School Teacher", "Building Administrator"],
  ["6-8", "9-12", "Educator / Adult"],
  "Recommended for teacher use", "medium", "catalog-review",
  classroomUseCase="Print the scale, pick a level per assignment, tell students which level applies. Clarity beats detection.",
  evidenceSummary="Published in peer-reviewed venues and adopted internationally; classroom-level outcome evidence still developing.",
  featured=True),
]

# =====================================================================
# 11. PROFESSIONAL LEARNING
# =====================================================================

RECORDS += [
R("pd-google-genai-educators", "Generative AI for Educators",
  "Google with MIT RAISE",
  "https://grow.google/ai-for-educators/",
  "professional-learning",
  "Free self-paced course (about two hours, certificate included) introducing teachers to generative AI concepts, prompting, and classroom applications; co-developed with MIT RAISE.",
  ["Professional Learning", "AI Literacy Foundations", "Prompt Literacy"],
  ["Classroom Teacher", "Instructional Coach"],
  ["Educator / Adult"],
  "Recommended for teacher use", "high", "catalog-review",
  accountRequired=True,
  curatorNote="A reasonable pre-work assignment before an in-person PD day; vendor-produced, so pair with a neutral framework like AI4K12."),

R("pd-microsoft-ai-educators", "Microsoft Learn Educator Center: AI for Educators",
  "Microsoft",
  "https://learn.microsoft.com/en-us/training/educator-center/topics/ai-for-education",
  "professional-learning",
  "Free learning paths on AI foundations, classroom application, and responsible AI within the Microsoft ecosystem, with badges educators can document for Act 48-style PD hours where locally approved.",
  ["Professional Learning", "AI Literacy Foundations"],
  ["Classroom Teacher", "Instructional Coach", "Technology Director"],
  ["Educator / Adult"],
  "Recommended for teacher use", "medium", "catalog-review",
  accountRequired=True),

R("pd-iste-ai", "ISTE AI Resources and Courses",
  "ISTE+ASCD",
  "https://iste.org/ai",
  "professional-learning",
  "ISTE's AI hub: practitioner guides, standards alignment, and paid PD courses on artificial intelligence in education from the leading edtech professional organization.",
  ["Professional Learning", "AI Literacy Foundations", "Classroom Integration"],
  ["Classroom Teacher", "Instructional Coach", "Curriculum Director", "District Administrator"],
  ["Educator / Adult"],
  "Recommended for teacher use", "medium", "catalog-review",
  access="freemium",
  pricingSummary="Free guides and articles; courses and some resources paid or member-gated."),

R("pd-kti", "Keystone Technology Innovators (KTI)",
  "Pennsylvania educator community (PDE-connected)",
  "https://kti.pletw.org/",
  "professional-learning",
  "Pennsylvania's flagship educator technology leadership community and summit, developing teacher-leaders (KTI Stars) who drive edtech and AI practice across PA districts.",
  ["Pennsylvania-Specific Resources", "Professional Learning"],
  ["Classroom Teacher", "Instructional Coach"],
  ["Educator / Adult"],
  "Recommended for teacher use", "medium", "catalog-review",
  paSpecific=True,
  curatorNote="Curator affiliation disclosure: IU29's STEM supervisor serves as a KTI Lead Learner. Included because it is genuinely the strongest PA educator-technology community; verify current URL on live check."),
]

# =====================================================================
# 12. RESEARCH AND EVIDENCE
# =====================================================================

RECORDS += [
R("res-rand-ai", "RAND American Educator Panels: AI in Schools Reports",
  "RAND Corporation",
  "https://www.rand.org/education-and-labor/projects/aep.html",
  "research-report",
  "Nationally representative survey research on how teachers, principals, and districts are actually adopting AI — the adoption statistics most state and national guidance documents cite.",
  ["Research and Evidence", "Administrator Resources", "District Policy and Governance"],
  ["District Administrator", "Curriculum Director", "School Board", "Community Partner"],
  ["District / System Level"],
  "Recommended for teacher use", "high", "catalog-review",
  evidenceSummary="Representative panel surveys; the standard citation for adoption and guidance-gap statistics.",
  districtUseCase="Board-presentation statistics with a credible source line under them."),

R("res-pew-teens-ai", "Pew Research Center: Teens and AI/ChatGPT",
  "Pew Research Center",
  "https://www.pewresearch.org/internet/",
  "research-report",
  "Nationally representative survey data on teen awareness and use of ChatGPT and AI for schoolwork — the reality-check numbers for any 'students aren't really using this' conversation.",
  ["Research and Evidence", "Family and Community Resources", "Digital Citizenship"],
  ["District Administrator", "Family / Caregiver", "Classroom Teacher", "School Board"],
  ["District / System Level", "Educator / Adult"],
  "Recommended for teacher use", "high", "catalog-review",
  curatorNote="Link the topic hub rather than a single report; Pew refreshes these surveys."),

R("res-hai-index", "Stanford HAI Artificial Intelligence Index Report",
  "Stanford Institute for Human-Centered Artificial Intelligence",
  "https://aiindex.stanford.edu/",
  "research-report",
  "Annual, heavily sourced report tracking AI capability, adoption, policy, and education trends — the reference for keeping district conversations tethered to data rather than vibes.",
  ["Research and Evidence", "Understanding How AI Works"],
  ["Technology Director", "District Administrator", "Curriculum Director", "High School Teacher"],
  ["District / System Level", "Educator / Adult", "9-12"],
  "Recommended for teacher use", "high", "catalog-review"),
]

# =====================================================================
# 13. PROMPT LITERACY / EVALUATION / FAMILY
# =====================================================================

RECORDS += [
R("pr-aifored-prompts", "AI for Education Prompt Library",
  "AI for Education",
  "https://www.aiforeducation.io/prompt-library",
  "prompt-literacy",
  "Free, education-specific prompt library organized by educator task, useful both as a working resource and as teaching material for what effective prompting looks like.",
  ["Prompt Literacy", "Teacher Planning and Productivity", "Professional Learning"],
  ["Classroom Teacher", "Instructional Coach"],
  ["Educator / Adult"],
  "Recommended for teacher use", "medium", "catalog-review"),

R("eval-commonsense-ai-ratings", "Common Sense AI Ratings",
  "Common Sense Media",
  "https://www.commonsense.org/education/ai-ratings",
  "tool-evaluation",
  "Independent risk assessments of AI products against a published framework (trust, safety, privacy, fairness, kids' wellbeing) — the closest thing to an independent review layer for classroom AI.",
  ["Tool Evaluation", "Privacy and Student Data", "AI Literacy Foundations"],
  ["Technology Director", "District Administrator", "Classroom Teacher", "Data Privacy Officer"],
  ["District / System Level", "Educator / Adult"],
  "Recommended for teacher use", "high", "catalog-review",
  featured=True,
  districtUseCase="Standing agenda item for any tool-review committee: check whether an AI rating exists before local review."),

R("eval-1edtech-trusted", "1EdTech TrustEd Apps Program",
  "1EdTech Consortium",
  "https://www.1edtech.org/program/trustedapps",
  "tool-evaluation",
  "Standardized vetting rubric and directory for edtech applications covering data privacy, security, and accessibility, used by member districts to streamline app review.",
  ["Tool Evaluation", "Privacy and Student Data", "Technology Director Resources"],
  ["Technology Director", "Data Privacy Officer"],
  ["District / System Level"],
  "Recommended with district review", "medium", "catalog-review",
  access="registration",
  pricingSummary="Directory access tied to 1EdTech membership; rubric concepts publicly documented."),

R("fam-commonsense-family-ai", "Common Sense Media: AI Resources for Families",
  "Common Sense Media",
  "https://www.commonsense.org/education/articles/chatgpt-and-beyond-how-to-handle-ai-in-schools",
  "family-community",
  "Family-facing explainers, conversation guides, and AI product reviews helping caregivers understand what their kids are doing with AI and how to talk about it.",
  ["Family and Community Resources", "Digital Citizenship", "AI Literacy Foundations"],
  ["Family / Caregiver", "Community Partner", "Building Administrator"],
  ["Educator / Adult"],
  "Recommended for teacher use", "medium", "catalog-review",
  curatorNote="Point the library's family collection at the Common Sense family hub; refresh the deep link on live check as their articles rotate."),
]

# =====================================================================
# 14. PENNSYLVANIA ANCHORS
# =====================================================================

RECORDS += [
R("pa-sas-steels", "PDE Standards Aligned System (SAS) and the STEELS Hub",
  "Pennsylvania Department of Education",
  "https://www.pdesas.org/",
  "framework-guidance",
  "Pennsylvania's official standards portal, including STEELS (Science, Technology & Engineering, Environmental Literacy and Sustainability) resources — the standards backbone any PA AI-in-STEM work must align to.",
  ["Pennsylvania-Specific Resources", "Classroom Integration", "Computational Thinking"],
  ["Classroom Teacher", "Curriculum Director", "Instructional Coach"],
  ["K-12 Adaptable", "Educator / Adult"],
  "Recommended for teacher use", "high", "catalog-review",
  paSpecific=True,
  curatorNote="Deep-link the STEELS Hub page specifically during live verification; SAS navigation changes.",
  districtUseCase="Alignment target for the planned STEELS Lesson Hook Generator and all Skook29 STEM programming."),
]

# =====================================================================
# 15. IU29 ORIGINAL-CONTENT PLACEHOLDERS (clearly labeled; not external resources)
# =====================================================================

_IU_NOTE = "IU29 ORIGINAL-CONTENT OPPORTUNITY: placeholder record for a resource STEM@Skook29 should build, not a link to an existing external resource."

RECORDS += [
R("iu-ai-literacy-framework", "AI Literacy Framework for K-12 Educators (STEM@Skook29 original — planned)",
  "Schuylkill Intermediate Unit 29 / STEM@Skook29",
  "https://stemskook29.example/planned/ai-literacy-framework",
  "iu29-original",
  "Planned IU29 framework synthesizing AI4K12, UNESCO, and PDE guidance into a practical regional framework with grade-band 'what students should understand' statements and a Campfire-style PD arc.",
  ["AI Literacy Foundations", "Pennsylvania-Specific Resources", "Professional Learning"],
  ["Classroom Teacher", "Curriculum Director", "Instructional Coach"],
  ["Educator / Adult", "K-12 Adaptable"],
  "Useful resource, not a classroom tool", "high", "catalog-review",
  access="planned", pricingSummary="Planned original resource.",
  paSpecific=True, curatorNote=_IU_NOTE,
  relatedResources=["fw-ai4k12", "fw-unesco-teachers", "fw-pde-implementing-ai"]),

R("iu-genai-starter-kit", "Generative AI in the Classroom Starter Kit (STEM@Skook29 original — planned)",
  "Schuylkill Intermediate Unit 29 / STEM@Skook29",
  "https://stemskook29.example/planned/genai-starter-kit",
  "iu29-original",
  "Planned Monday-morning starter kit: one vetted tool path (Lumon Rule), three classroom-ready activities, disclosure language, and a red-flag checklist — the 'first 30 days' package for a teacher new to AI.",
  ["Classroom Integration", "AI Literacy Foundations", "Prompt Literacy"],
  ["Classroom Teacher"],
  ["Educator / Adult"],
  "Useful resource, not a classroom tool", "high", "catalog-review",
  access="planned", pricingSummary="Planned original resource.",
  paSpecific=True, curatorNote=_IU_NOTE,
  relatedResources=["cur-commonsense-ai", "tool-diffit", "pd-google-genai-educators"]),

R("iu-aup-template", "AI Acceptable Use Policy Template for PA Districts (STEM@Skook29 original — planned)",
  "Schuylkill Intermediate Unit 29 / STEM@Skook29",
  "https://stemskook29.example/planned/ai-aup-template",
  "iu29-original",
  "Planned adaptable AUP/policy template aligned to PDE guidance and the TeachAI toolkit, pre-localized for PA's local-control context and reviewable with solicitors.",
  ["District Policy and Governance", "Pennsylvania-Specific Resources"],
  ["District Administrator", "School Board", "Technology Director"],
  ["District / System Level"],
  "Useful resource, not a classroom tool", "high", "catalog-review",
  access="planned", pricingSummary="Planned original resource; recommend district-only distribution initially.",
  paSpecific=True, curatorNote=_IU_NOTE,
  relatedResources=["fw-pde-implementing-ai", "fw-teachai-toolkit", "pol-psba"]),

R("iu-steels-hook-generator", "STEELS Lesson Hook Generator (STEM@Skook29 original — planned)",
  "Schuylkill Intermediate Unit 29 / STEM@Skook29",
  "https://stemskook29.example/planned/steels-hook-generator",
  "iu29-original",
  "Planned phenomenon-first lesson hook tool grounded exclusively in STEELS standards and vetted library records — an applied demonstration of retrieval from curated data rather than open web generation.",
  ["Classroom Integration", "Pennsylvania-Specific Resources", "Computational Thinking"],
  ["Classroom Teacher", "Instructional Coach"],
  ["Educator / Adult"],
  "Useful resource, not a classroom tool", "high", "catalog-review",
  access="planned", pricingSummary="Planned original resource.",
  paSpecific=True, curatorNote=_IU_NOTE,
  relatedResources=["pa-sas-steels"]),

R("iu-edtech-concierge", "EdTech Concierge (STEM@Skook29 original — planned)",
  "Schuylkill Intermediate Unit 29 / STEM@Skook29",
  "https://stemskook29.example/planned/edtech-concierge",
  "iu29-original",
  "Planned advisory service (human + AI-assisted) that answers district and teacher tool questions using only this vetted library as its knowledge base, with escalation to human review for procurement questions.",
  ["Tool Evaluation", "Technology Director Resources", "Pennsylvania-Specific Resources"],
  ["Classroom Teacher", "Technology Director", "District Administrator"],
  ["Educator / Adult", "District / System Level"],
  "Useful resource, not a classroom tool", "high", "catalog-review",
  access="planned", pricingSummary="Planned original service.",
  paSpecific=True, curatorNote=_IU_NOTE,
  relatedResources=["eval-commonsense-ai-ratings", "priv-sdpc"]),
]

# =====================================================================
# FEATURED COLLECTIONS
# =====================================================================

COLLECTIONS = [
{"id": "col-new-to-ai", "title": "New to AI? Start Here",
 "description": "The shortest honest path from zero to informed: what AI is, what it is not, and one free course to build footing.",
 "audience": ["Classroom Teacher", "Building Administrator", "Family / Caregiver"],
 "resourceIds": ["fw-ai4k12", "pd-google-genai-educators", "cur-commonsense-ai", "fw-used-2023-report", "res-pew-teens-ai"]},

{"id": "col-start-here-teachers", "title": "Start Here for Teachers",
 "description": "The core five-resource stack for a teacher building an AI practice on solid ground.",
 "audience": ["Classroom Teacher", "Instructional Coach"],
 "resourceIds": ["cur-commonsense-ai", "tool-diffit", "fw-teachai-toolkit", "int-aias", "pr-aifored-prompts"]},

{"id": "col-monday-morning", "title": "Ready for Monday Morning",
 "description": "Free things a teacher can genuinely use tomorrow — no procurement meeting required.",
 "audience": ["Classroom Teacher"],
 "resourceIds": ["tool-diffit", "cur-commonsense-ai", "ct-teachable-machine", "dc-rumorguard", "tool-notebooklm", "cur-dayofai"]},

{"id": "col-no-student-accounts", "title": "No Student Accounts Required",
 "description": "Meaningful AI learning with zero student data surface: browser tools, join-by-code sessions, and unplugged-friendly lessons.",
 "audience": ["Classroom Teacher", "Technology Director"],
 "resourceIds": ["ct-teachable-machine", "cur-commonsense-ai", "cur-experience-ai", "tool-curipod", "dc-rumorguard"]},

{"id": "col-teacher-only-tools", "title": "Teacher-Only AI Tools",
 "description": "Assistants and generators scoped to adult educator use — the lowest-risk way to build staff fluency.",
 "audience": ["Classroom Teacher", "Instructional Coach", "Building Administrator"],
 "resourceIds": ["tool-chatgpt-teachers", "tool-claude-teachers", "tool-diffit", "tool-brisk", "tool-eduaide"]},

{"id": "col-student-facing", "title": "Student-Facing Tools (District Review Required)",
 "description": "Where students touch AI directly. Every record here requires a deliberate district decision, not a teacher-by-teacher one.",
 "audience": ["District Administrator", "Technology Director", "Classroom Teacher"],
 "resourceIds": ["stu-khanmigo", "tool-schoolai", "tool-magicschool", "tool-gemini-edu", "tool-notebooklm", "stu-assistments"]},

{"id": "col-policy-starter", "title": "District AI Policy Starter Pack",
 "description": "The document stack for going from no policy to board-ready policy, PA-flavored.",
 "audience": ["District Administrator", "School Board", "Technology Director"],
 "resourceIds": ["fw-pde-implementing-ai", "fw-used-ai-toolkit", "fw-teachai-toolkit", "pol-aifored-tracker", "pol-cosn-cgcs-checklist", "pol-psba", "iu-aup-template"]},

{"id": "col-privacy-data", "title": "Privacy and Student Data",
 "description": "The verification layer: independent privacy evaluations, DPA registries, and the actual federal rules.",
 "audience": ["Technology Director", "Data Privacy Officer", "District Administrator"],
 "resourceIds": ["priv-commonsense-privacy", "priv-sdpc", "priv-fpf-compass", "priv-ptac", "priv-ftc-coppa", "eval-1edtech-trusted"]},

{"id": "col-media-literacy", "title": "Media Literacy and Deepfakes",
 "description": "Teaching students to interrogate what they see — the digital citizenship core of AI literacy.",
 "audience": ["Classroom Teacher", "Middle School Teacher", "High School Teacher"],
 "resourceIds": ["dc-checkology", "dc-cor", "dc-rumorguard", "dc-mediawise", "dc-cai", "dc-commonsense-digcit"]},

{"id": "col-ai-literacy-lessons", "title": "AI Literacy Lesson Collections",
 "description": "Classroom-ready curricula for teaching how AI works and what it means, K-12.",
 "audience": ["Classroom Teacher", "Curriculum Director"],
 "resourceIds": ["cur-commonsense-ai", "cur-codeorg-ai", "cur-dayofai", "cur-mit-daily", "cur-experience-ai", "cur-aiedu"]},

{"id": "col-ct-creation", "title": "Computational Thinking and Building AI",
 "description": "Students as makers of AI, not just users — the makerspace-native collection.",
 "audience": ["Classroom Teacher", "Student"],
 "resourceIds": ["ct-teachable-machine", "ct-ml4kids", "ct-scratch", "ct-appinventor", "cur-codeorg-ai"]},

{"id": "col-accessibility-sped", "title": "Special Education and Accessibility",
 "description": "UDL foundations, accessible materials, and AI-and-disability expertise — with PA's own PaTTAN at the center.",
 "audience": ["Special Education Teacher", "Instructional Coach", "Technology Director"],
 "resourceIds": ["acc-cast-udl", "acc-aem", "acc-immersive-reader", "acc-pattan", "acc-ciddl", "tool-diffit"]},

{"id": "col-integrity-assessment", "title": "Academic Integrity and Assessment Redesign",
 "description": "Clarity over detection: declare allowed AI use, redesign tasks, and know why detector scores are not evidence.",
 "audience": ["High School Teacher", "Building Administrator", "Curriculum Director"],
 "resourceIds": ["int-aias", "int-detector-research", "int-mla-cccc", "fw-teachai-toolkit"]},

{"id": "col-pa-connections", "title": "Pennsylvania Connections",
 "description": "The PA-specific layer: state guidance, standards, special education support, privacy alliance, and educator community.",
 "audience": ["District Administrator", "Classroom Teacher", "Technology Director"],
 "resourceIds": ["fw-pde-implementing-ai", "pa-sas-steels", "acc-pattan", "priv-sdpc", "pd-kti", "pol-psba"]},

{"id": "col-admin-toolkit", "title": "Administrator Toolkit",
 "description": "Board-ready evidence, governance frameworks, and funding guidance for system leaders.",
 "audience": ["District Administrator", "Building Administrator", "School Board"],
 "resourceIds": ["fw-used-ai-toolkit", "fw-used-dcl-2025", "res-rand-ai", "pol-aifored-tracker", "pol-cosn-ai", "res-hai-index"]},
]

# =====================================================================
# EXCLUDED / REJECTED RESOURCES (published for transparency)
# =====================================================================

EXCLUDED = [
{"name": "Consumer ChatGPT / Claude.ai / Gemini consumer accounts as student tools",
 "reason": "Consumer terms (13+ with parental consent, or 18+) and consumer data handling are not a K-12 deployment path; the education-specific products above are the correct records."},
{"name": "Perplexity", "reason": "Capable research assistant, but no verified K-12-specific terms, student account model, or education data protections at review time; revisit if an education offering ships."},
{"name": "AI writing detectors as standalone records (GPTZero, Turnitin AI detection, etc.)",
 "reason": "Per exclusion rules, detectors are not presented as reliable proof of misconduct; the detector-bias research record (int-detector-research) carries the caution instead."},
{"name": "Character.AI and companion-style chatbots", "reason": "Entertainment companion design, documented safety incidents, and litigation history; no instructional rationale that survives the risk profile."},
{"name": "ISTE/GM AI Explorations hands-on guides", "reason": "Historically good, but aging content in a fast-moving field; superseded in this library by Experience AI, Day of AI, and Code.org."},
{"name": "EdTech Evidence Exchange", "reason": "Organization sunset; links unreliable. ASSISTments and RAND records carry the evidence torch."},
{"name": "Generic 'Top 100 AI Tools for Teachers' listicles", "reason": "Affiliate-driven, unvetted, and privacy-blind by construction; categorically excluded."},
{"name": "Snapchat My AI and similar in-app consumer assistants", "reason": "Consumer social product with no school controls; relevant to family digital-citizenship conversations only."},
{"name": "Deepfake/faceswap generators", "reason": "No instructional rationale sufficient to offset misuse risk in a public K-12 library; synthetic-media literacy is covered via CAI and media literacy records."},
]

# =====================================================================
# VALIDATION
# =====================================================================

REQUIRED_FIELDS = ["id", "title", "organization", "url", "recordClass", "description",
                   "categories", "audiences", "gradeBands", "recommendedUse",
                   "confidence", "verificationMethod", "access", "verifiedDate"]

RECOMMENDED_USE_VALUES = {
    "Recommended for teacher use", "Recommended with district review",
    "Recommended for limited pilot", "Student use requires district approval",
    "Useful resource, not a classroom tool", "Not recommended for public library inclusion",
}

def validate():
    errors = []
    ids = [r["id"] for r in RECORDS]
    dupes = [i for i, c in Counter(ids).items() if c > 1]
    if dupes:
        errors.append(f"Duplicate IDs: {dupes}")
    urls = [r["url"] for r in RECORDS]
    for u, c in Counter(urls).items():
        if c > 1:
            recs = [r["id"] for r in RECORDS if r["url"] == u]
            # ED AI guidance landing page intentionally shared by 3 federal records
            allowed_shared = {"fw-used-ai-toolkit", "fw-used-ocr-ai", "fw-used-2023-report",
                              "pol-cosn-ai", "pol-cosn-cgcs-checklist"}
            if set(recs) - allowed_shared:
                errors.append(f"Unexpected duplicate URL {u}: {recs}")
    for r in RECORDS:
        for f in REQUIRED_FIELDS:
            if r.get(f) in (None, "", []):
                errors.append(f"{r['id']}: missing required field '{f}'")
        if r["confidence"] not in CONFIDENCE_VALUES:
            errors.append(f"{r['id']}: bad confidence '{r['confidence']}'")
        if r["access"] not in ACCESS_VALUES:
            errors.append(f"{r['id']}: bad access '{r['access']}'")
        if r["recommendedUse"] not in RECOMMENDED_USE_VALUES:
            errors.append(f"{r['id']}: bad recommendedUse '{r['recommendedUse']}'")
        for k, v in r["evaluation"].items():
            if v not in RATING_VALUES:
                errors.append(f"{r['id']}: bad evaluation.{k} '{v}'")
        for rel in r["relatedResources"]:
            if rel not in ids:
                errors.append(f"{r['id']}: relatedResources references unknown id '{rel}'")
        if not re.match(r"^[a-z0-9][a-z0-9-]+$", r["id"]):
            errors.append(f"Bad id format: {r['id']}")
    cids = [c["id"] for c in COLLECTIONS]
    cdupes = [i for i, c in Counter(cids).items() if c > 1]
    if cdupes:
        errors.append(f"Duplicate collection IDs: {cdupes}")
    for c in COLLECTIONS:
        for rid in c["resourceIds"]:
            if rid not in ids:
                errors.append(f"Collection {c['id']} references unknown resource '{rid}'")
    return errors

# =====================================================================
# GENERATION
# =====================================================================

CSV_LIST_SEP = "; "

def to_csv_rows(records):
    base_fields = [k for k in records[0].keys() if k != "evaluation"]
    eval_fields = list(EVAL_NA.keys())
    header = base_fields + [f"eval_{k}" for k in eval_fields]
    rows = [header]
    for r in records:
        row = []
        for f in base_fields:
            v = r[f]
            if isinstance(v, list):
                row.append(CSV_LIST_SEP.join(str(x) for x in v))
            elif isinstance(v, bool):
                row.append("true" if v else "false")
            else:
                row.append(str(v))
        row += [r["evaluation"][k] for k in eval_fields]
        rows.append(row)
    return rows

def js_wrap(varname, data):
    body = json.dumps(data, indent=2, ensure_ascii=False)
    return (f"// GENERATED by build_dataset.py — do not hand-edit. Regenerate instead.\n"
            f"// Last generated: {TODAY}\n"
            f"const {varname} = {body};\n")

def build_stats():
    n = len(RECORDS)
    def count(fn):
        c = Counter()
        for r in RECORDS:
            v = fn(r)
            if isinstance(v, list):
                c.update(v)
            else:
                c[v] += 1
        return c
    def fmt(counter, title):
        lines = [f"## {title}", ""]
        for k, v in sorted(counter.items(), key=lambda kv: (-kv[1], kv[0])):
            lines.append(f"- {k}: {v}")
        lines.append("")
        return lines
    lines = ["# STATS — STEM@Skook29 EdTech & AI Resource Library",
             f"\nGenerated {TODAY} by build_dataset.py. Do not hand-edit.\n",
             f"**Total records: {n}**  |  **Collections: {len(COLLECTIONS)}**  |  **Excluded (documented): {len(EXCLUDED)}**\n"]
    lines += fmt(count(lambda r: r["recordClass"]), "Records by class")
    lines += fmt(count(lambda r: r["categories"]), "Records by category (multi-tag)")
    lines += fmt(count(lambda r: r["audiences"]), "Records by audience (multi-tag)")
    lines += fmt(count(lambda r: r["gradeBands"]), "Records by grade band (multi-tag)")
    lines += fmt(count(lambda r: r["access"]), "Records by access")
    lines += fmt(count(lambda r: r["confidence"]), "Records by confidence")
    lines += fmt(count(lambda r: r["verificationMethod"]), "Records by verification method")
    student_facing = [r["id"] for r in RECORDS if r["studentAccounts"] == "yes"]
    teacher_only = [r["id"] for r in RECORDS if r["studentAccounts"] == "no"]
    district_review = [r["id"] for r in RECORDS if r["recommendedUse"] in
                       ("Recommended with district review", "Student use requires district approval",
                        "Recommended for limited pilot")]
    dpa_yes = [r["id"] for r in RECORDS if r["dpaAvailable"] == "yes"]
    dpa_unclear = [r["id"] for r in RECORDS if r["dpaAvailable"] == "unclear"]
    priv_unclear = [r["id"] for r in RECORDS if "Not clearly disclosed" in (r["trainingDataSummary"] + r["retentionSummary"])]
    pa = [r["id"] for r in RECORDS if r["paSpecific"]]
    needs_verify = [r["id"] for r in RECORDS if r["verificationMethod"] != "live-check"]
    lines += [
        "## Key slices", "",
        f"- Student-facing (student accounts = yes): {len(student_facing)} — {', '.join(student_facing)}",
        f"- Teacher-only tools (student accounts = no): {len(teacher_only)} — {', '.join(teacher_only)}",
        f"- Requiring district review before student/district use: {len(district_review)}",
        f"- DPA available (vendor-stated): {len(dpa_yes)} — {', '.join(dpa_yes)}",
        f"- DPA unclear: {len(dpa_unclear)} — {', '.join(dpa_unclear)}",
        f"- Records with unclear privacy disclosures: {len(priv_unclear)} — {', '.join(priv_unclear)}",
        f"- Pennsylvania-specific records: {len(pa)} — {', '.join(pa)}",
        "",
        "## Re-verification queue (catalog-review records awaiting first live check)", "",
        f"{len(needs_verify)} records:", "",
    ]
    lines += [f"- {rid}" for rid in needs_verify]
    lines += ["", "## Excluded resources and reasons", ""]
    lines += [f"- **{e['name']}** — {e['reason']}" for e in EXCLUDED]
    lines += ["", "## Time-sensitive facts most likely to change", "",
              "- ChatGPT for Teachers pricing after June 2027; Claude for Teachers pricing after its free year",
              "- Gemini/NotebookLM education availability, age handling, and add-on tiers",
              "- MagicSchool/SchoolAI/Brisk/Diffit free-tier limits and pricing",
              "- PDE AI guidance expansion and any PA legislative action",
              "- FTC COPPA rule amendment effective requirements", ""]
    return "\n".join(lines)

def main():
    errors = validate()
    if errors:
        print("VALIDATION FAILED:", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        sys.exit(1)

    os.makedirs(OUT, exist_ok=True)

    with open(os.path.join(OUT, "aiEdtechResources.json"), "w", encoding="utf-8") as f:
        json.dump(RECORDS, f, indent=2, ensure_ascii=False)
    with open(os.path.join(OUT, "featuredCollections.json"), "w", encoding="utf-8") as f:
        json.dump(COLLECTIONS, f, indent=2, ensure_ascii=False)
    with open(os.path.join(OUT, "aiEdtechResources.js"), "w", encoding="utf-8") as f:
        f.write(js_wrap("aiEdtechResources", RECORDS))
    with open(os.path.join(OUT, "featuredCollections.js"), "w", encoding="utf-8") as f:
        f.write(js_wrap("aiEdtechCollections", COLLECTIONS))
    rows = to_csv_rows(RECORDS)
    with open(os.path.join(OUT, "aiEdtechResources.csv"), "w", encoding="utf-8", newline="") as f:
        csv.writer(f).writerows(rows)
    stats = build_stats()
    with open(os.path.join(os.path.dirname(OUT), "STATS.md"), "w", encoding="utf-8") as f:
        f.write(stats)

    # Validate generated JS with Node if available
    for jsfile in ("aiEdtechResources.js", "featuredCollections.js"):
        path = os.path.join(OUT, jsfile)
        try:
            res = subprocess.run(["node", "--check", path], capture_output=True, text=True)
            status = "OK" if res.returncode == 0 else f"FAILED: {res.stderr.strip()}"
        except FileNotFoundError:
            status = "SKIPPED (node not found)"
        print(f"node --check {jsfile}: {status}")
        if "FAILED" in status:
            sys.exit(1)

    print(f"\nBuild complete: {len(RECORDS)} records, {len(COLLECTIONS)} collections, {len(EXCLUDED)} documented exclusions.")
    live = sum(1 for r in RECORDS if r["verificationMethod"] == "live-check")
    print(f"Live-verified: {live} | Catalog-review (queued for verification): {len(RECORDS) - live}")

if __name__ == "__main__":
    main()
