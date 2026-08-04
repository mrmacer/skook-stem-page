#!/usr/bin/env python3
"""
STEELS Resource Library dataset builder — STEM@Skook29 / IU29
Single source of truth: the RESOURCES list below.
Emits: steelsResources.json, steelsResources.js, steelsResources.csv,
       featuredCollections.json, STATS.md
"""
import json, csv, io, datetime
from collections import Counter

TODAY = "2026-07-24"

def R(id, title, description, publisher, url, gradeBands, steelsDomains,
      resourceType, access, paSpecific=False, featured=False,
      disciplinaryCoreIdeas=None, sciencePractices=None, crosscuttingConcepts=None,
      keywords=None, recommendedPathways=None, estimatedTime="Varies",
      confidence="High", notes="", relatedResources=None):
    return {
        "id": id, "title": title, "description": description,
        "publisher": publisher, "url": url,
        "gradeBands": gradeBands, "steelsDomains": steelsDomains,
        "disciplinaryCoreIdeas": disciplinaryCoreIdeas or [],
        "sciencePractices": sciencePractices or [],
        "crosscuttingConcepts": crosscuttingConcepts or [],
        "keywords": keywords or [], "resourceType": resourceType,
        "access": access, "paSpecific": paSpecific, "featured": featured,
        "recommendedPathways": recommendedPathways or [],
        "estimatedTime": estimatedTime, "reviewDate": TODAY,
        "confidence": confidence, "notes": notes,
        "relatedResources": relatedResources or []
    }

RESOURCES = [
# ============ PENNSYLVANIA OFFICIAL ============
R("sas-steels-hub", "PDE STEELS Hub (SAS)",
  "Pennsylvania's official one-stop hub for STEELS implementation: the standards, Foundation Boxes, curriculum frameworks, instructional resources, assessment guidance, safety guidelines, and recorded PDE webinars.",
  "Pennsylvania Department of Education / SAS", "https://www.pdesas.org/Page/Viewer/ViewPage/58/",
  ["K-2","3-5","6-8","9-12"], ["3.1","3.2","3.3","3.4","3.5","Cross-domain"],
  "Official standards & guidance", "Free", paSpecific=True, featured=True,
  sciencePractices=["All SEPs"], crosscuttingConcepts=["All CCCs"],
  keywords=["standards","foundation boxes","implementation","official","PDE"],
  recommendedPathways=["beginner-teacher","instructional-coach","administrator"],
  estimatedTime="Reference — bookmark it",
  notes="THE authoritative starting point. Every STEELS question starts here. Verified via direct fetch.",
  relatedResources=["steels-foundation-boxes","steels-assessment-toolkit","pde-science-standards-page"]),

R("steels-foundation-boxes", "STEELS Foundation Boxes & Webinar",
  "PDE's standard-by-standard unpacking: each STEELS standard's supporting Foundation Box details the practices, core ideas, crosscutting concepts, PA contexts, and career-ready skills behind it, with a recorded walkthrough webinar by PDE Science Advisor David Bauman.",
  "Pennsylvania Department of Education", "https://www.pdesas.org/Page/Viewer/ViewPage/58/",
  ["K-2","3-5","6-8","9-12"], ["3.1","3.2","3.3","3.4","3.5"],
  "Standards unpacking tool", "Free", paSpecific=True, featured=True,
  keywords=["foundation boxes","unpacking","webinar","3-dimensional"],
  recommendedPathways=["beginner-teacher","instructional-coach"],
  estimatedTime="45–60 min webinar; reference thereafter",
  notes="Access via the STEELS Hub navigation (Standards section). The single best answer to 'what does this standard actually ask for?'",
  relatedResources=["sas-steels-hub","nap-framework"]),

R("steels-curriculum-frameworks", "STEELS Curriculum Frameworks",
  "PDE-developed frameworks for Science, Technology & Engineering, and Environmental Literacy & Sustainability that guide standards-based curriculum design, including big ideas, concepts, and competencies by grade level.",
  "Pennsylvania Department of Education", "https://www.pdesas.org/Page/Viewer/ViewPage/58/",
  ["K-2","3-5","6-8","9-12"], ["3.1","3.2","3.3","3.4","3.5"],
  "Curriculum-mapping support", "Free", paSpecific=True,
  keywords=["curriculum framework","scope and sequence","curriculum design"],
  recommendedPathways=["instructional-coach","administrator"],
  estimatedTime="Planning reference",
  notes="Access via STEELS Hub navigation. Pair with district scope-and-sequence work.",
  relatedResources=["sas-steels-hub"]),

R("steels-assessment-toolkit", "STEELS Assessment Toolkit",
  "PDE's three-module toolkit with ready-to-use three-dimensional performance tasks (e.g., Hurricane Boardwalk, Sea Stars, Snow Day), multidimensional rubrics, scoring guides, and facilitation guides for building local assessment literacy.",
  "Pennsylvania Department of Education", "https://www.pdesas.org/Page/Viewer/ViewPage/58/",
  ["K-2","3-5","6-8","9-12"], ["Cross-domain","Assessment"],
  "Assessment tool", "Free", paSpecific=True, featured=True,
  sciencePractices=["Developing and Using Models","Constructing Explanations","Engaging in Argument from Evidence"],
  keywords=["performance tasks","rubrics","3D assessment","PSSA","Keystone"],
  recommendedPathways=["instructional-coach","beginner-teacher"],
  estimatedTime="Tasks: 1–3 class periods each",
  notes="Access via STEELS Hub Assessment section. The only STEELS-explicit performance-task bank in existence. Unusually valuable and free.",
  relatedResources=["sas-steels-hub","snap-assessments"]),

R("steels-safety-guide", "STEELS Safety Guide",
  "PDE's reference for safe classroom, laboratory, and field experiences under STEELS, with an introduction video and PowerPoint for staff training.",
  "Pennsylvania Department of Education", "https://www.pdesas.org/Page/Viewer/ViewPage/58/",
  ["K-2","3-5","6-8","9-12"], ["Cross-domain"],
  "Official standards & guidance", "Free", paSpecific=True,
  keywords=["safety","lab safety","field experiences","liability"],
  recommendedPathways=["administrator","beginner-teacher"],
  estimatedTime="Reference; 20-min intro video",
  notes="Access via STEELS Hub. Administrators: this is your walkthrough/liability companion for hands-on science.",
  relatedResources=["sas-steels-hub"]),

R("pde-science-standards-page", "PDE Science Standards Page",
  "The Commonwealth's official science standards page: the STEELS adoption timeline, sunset of the 2002 standards (June 30, 2025), full implementation expectations for 2025-26, and links to the STEELS Hub.",
  "Pennsylvania Department of Education", "https://www.pa.gov/agencies/education/programs-and-services/instruction/elementary-and-secondary-education/curriculum/science/science-standards",
  ["K-2","3-5","6-8","9-12"], ["Cross-domain"],
  "Official standards & guidance", "Free", paSpecific=True,
  keywords=["policy","timeline","implementation","compliance"],
  recommendedPathways=["administrator"],
  estimatedTime="10-min read",
  notes="The citable source for board presentations and compliance questions. Verified via direct search.",
  relatedResources=["sas-steels-hub"]),

R("pdesas-portal", "SAS Portal (Standards Aligned System)",
  "Pennsylvania's comprehensive standards portal: browse all PA standards including STEELS by grade and code, with linked materials, resources, and assessment information.",
  "Pennsylvania Department of Education", "https://www.pdesas.org/",
  ["K-2","3-5","6-8","9-12"], ["3.1","3.2","3.3","3.4","3.5","CS-CT","Cross-domain"],
  "Official standards & guidance", "Free", paSpecific=True,
  keywords=["standards browser","SAS","alignment","standards codes"],
  recommendedPathways=["beginner-teacher","instructional-coach","administrator"],
  estimatedTime="Reference",
  notes="Free account optional for saving materials. The standards-code browser behind future search-by-standard features.",
  relatedResources=["sas-steels-hub"]),

R("pa-gateway-to-green", "Pennsylvania Gateway to Green",
  "Statewide portal for PA environmental education: MWEE guidance, provider directory, grants (including PA DEP Environmental Education Grants), and professional learning across agencies and nonprofits.",
  "PA Association of Environmental Educators & partners", "https://pagatewaytogreen.org/environmental-education-sustainability/mwee/",
  ["K-2","3-5","6-8","9-12"], ["3.4"],
  "Environmental investigation", "Free", paSpecific=True,
  keywords=["MWEE","environmental education","grants","watershed","provider directory"],
  recommendedPathways=["instructional-coach","administrator"],
  estimatedTime="Reference",
  notes="The connective tissue of PA environmental education — use it to find funding and partners for 3.4 work.",
  relatedResources=["dcnr-watershed-education","stroud-education-curricula"]),

R("dcnr-watershed-education", "DCNR Watershed Education Program",
  "Bureau of State Parks' interdisciplinary grades 6-12 watershed curriculum blending classroom and field investigation. DCNR explicitly states the curriculum supports the STEELS standards and the MWEE framework. Curriculum is obtained by attending a 1-2 day teacher workshop (Act 48 approved).",
  "PA Department of Conservation and Natural Resources", "https://www.pa.gov/agencies/dcnr/education/water-education",
  ["6-8","9-12"], ["3.4","3.3"],
  "Watershed & outdoor learning", "Workshop", paSpecific=True, featured=True,
  disciplinaryCoreIdeas=["ESS3: Earth and Human Activity","Environmental Literacy Skills","Sustainability and Stewardship"],
  sciencePractices=["Planning and Carrying Out Investigations","Analyzing and Interpreting Data"],
  crosscuttingConcepts=["Systems and System Models","Cause and Effect"],
  keywords=["watershed","field investigation","MWEE","Act 48","state parks","stream study"],
  recommendedPathways=["instructional-coach"],
  estimatedTime="1–2 day workshop; year-long classroom program",
  notes="EXPLICIT STEELS alignment stated by DCNR — rare and valuable. Includes on-loan water testing equipment and a statewide student data-sharing database. Verified 2026-07-24.",
  relatedResources=["stroud-education-curricula","pfbc-education-portal","pa-gateway-to-green"]),

R("dcnr-educator-pd", "PA State Parks Educator Professional Development",
  "DCNR's professional development menu for classroom and non-formal educators: Watershed Education workshops, Project Learning Tree, PA Songbirds (K-8), GO Teach, and more — all addressing PA academic standards including STEELS.",
  "PA Department of Conservation and Natural Resources", "https://www.pa.gov/agencies/dcnr/education/professional-development.html",
  ["K-2","3-5","6-8","9-12"], ["3.4","Professional Learning"],
  "Professional learning", "Workshop", paSpecific=True,
  keywords=["Act 48","workshops","state parks","Project Learning Tree","outdoor learning"],
  recommendedPathways=["instructional-coach","beginner-teacher"],
  estimatedTime="Half-day to 2-day workshops",
  notes="Sign up for the State Parks monthly educator email to catch workshop announcements. Verified 2026-07-24.",
  relatedResources=["dcnr-watershed-education","project-learning-tree"]),

R("pa-envirothon", "Pennsylvania Envirothon",
  "Statewide competition for teams of five high school students in aquatic ecology, forestry, soils, wildlife, and current environmental issues — combining classroom learning with outdoor field testing, run county-by-county through conservation districts.",
  "Pennsylvania Envirothon", "https://www.envirothonpa.org/",
  ["9-12"], ["3.4","3.1","3.3"],
  "Competition & design challenge", "Free", paSpecific=True, featured=True,
  disciplinaryCoreIdeas=["LS2: Ecosystems","ESS3: Earth and Human Activity","Environmental Literacy Skills"],
  sciencePractices=["Analyzing and Interpreting Data","Engaging in Argument from Evidence"],
  keywords=["competition","Envirothon","field science","conservation","aquatics","forestry","soils","wildlife"],
  recommendedPathways=["high"],
  estimatedTime="Season-long prep; 1-day county event",
  notes="Study guides and resources on site; free PSECU-sponsored study app available. IU29's county competition runs through the Schuylkill Conservation District. Verified 2026-07-24.",
  relatedResources=["schuylkill-conservation-district","dcnr-watershed-education"]),

R("pfbc-education-portal", "PFBC Activities & Education Portal",
  "Pennsylvania Fish & Boat Commission's free online portal: 100+ printable activity sheets, videos, publications, and newsletters on PA aquatic species, habitats, fishing, and water safety — all downloadable PDFs, no account needed.",
  "PA Fish and Boat Commission", "https://www.pa.gov/agencies/fishandboat/education/activities-education-portal",
  ["K-2","3-5","6-8"], ["3.1","3.4"],
  "Lesson plans & activities", "Free", paSpecific=True, featured=True,
  disciplinaryCoreIdeas=["LS1: Structures and Processes","LS2: Ecosystems"],
  keywords=["aquatic","fish","printable","activity sheets","Trout in the Classroom","no login"],
  recommendedPathways=["elementary","beginner-teacher"],
  estimatedTime="15–45 min per activity",
  notes="Genuine Monday-morning material: print and go. Teachers page also connects to Trout in the Classroom and Watersheds programs. Verified 2026-07-24.",
  relatedResources=["dcnr-watershed-education","macroinvertebrates-org"]),

R("schuylkill-conservation-district", "Schuylkill Conservation District Environmental Education",
  "IU29's home-county partner for environmental education: school programs from 'Tickly & Prickly' (early learners) to 'Ways of Wildlife,' nature faires, summer day camps, and teacher workshops run in cooperation with Schuylkill Intermediate Unit 29.",
  "Schuylkill Conservation District", "https://www.schuylkillcd.com/departments/environmental-education",
  ["K-2","3-5","6-8","9-12"], ["3.4","3.1"],
  "Environmental investigation", "Free", paSpecific=True, featured=True,
  keywords=["Schuylkill County","local","field trips","teacher workshops","nature center","conservation district"],
  recommendedPathways=["elementary","beginner-teacher"],
  estimatedTime="Program-based; donation suggested",
  notes="THE local anchor. Their own page cites the IU29 partnership — programs offered on a donation basis, including for special education populations. Verified 2026-07-24.",
  relatedResources=["pa-envirothon","stroud-education-curricula","hawk-mountain"]),

R("stroud-education-curricula", "Stroud Water Research Center Curricula (WATERS, Shared Waters & more)",
  "Free watershed science curricula from a world-class PA freshwater research center: the 10-lesson WATERS unit (middle school, UDL-designed, NSF-funded), Shared Waters (grades 3-6, NOAA-funded, emphasizing environmental literacy and sustainability), Trout Grow on Trees, and high school wetlands units.",
  "Stroud Water Research Center", "https://stroudcenter.org/education/curricula/",
  ["3-5","6-8","9-12"], ["3.4","3.1","3.3"],
  "Model unit", "Registration", paSpecific=True, featured=True,
  disciplinaryCoreIdeas=["LS2: Ecosystems","ESS2: Earth's Systems","Environmental Literacy Skills","Sustainability and Stewardship"],
  sciencePractices=["Planning and Carrying Out Investigations","Analyzing and Interpreting Data","Using Mathematics and Computational Thinking"],
  crosscuttingConcepts=["Systems and System Models","Stability and Change"],
  keywords=["watershed","MWEE","UDL","place-based","water quality","stream ecology","free curriculum"],
  recommendedPathways=["instructional-coach","middle","elementary"],
  estimatedTime="10-lesson units (4–8 weeks)",
  notes="Publisher states Shared Waters emphasizes environmental literacy and sustainability standards. WATERS uses Universal Design for Learning — a natural Living IEP Lab crossover. Free teacher account unlocks the learning portal. Verified 2026-07-24.",
  relatedResources=["stroud-wikiwatershed","dcnr-watershed-education","macroinvertebrates-org"]),

R("stroud-wikiwatershed", "WikiWatershed / Model My Watershed",
  "Stroud's free web toolkit for real watershed analysis: Model My Watershed lets students delineate any PA watershed, analyze land cover and soil data, and model runoff scenarios with actual geospatial data — professional-grade tools scaled for classrooms.",
  "Stroud Water Research Center", "https://wikiwatershed.org/",
  ["6-8","9-12"], ["3.4","3.3","CS-CT"],
  "Data set & simulation", "Free", paSpecific=True,
  disciplinaryCoreIdeas=["ESS2: Earth's Systems","ESS3: Earth and Human Activity"],
  sciencePractices=["Analyzing and Interpreting Data","Using Mathematics and Computational Thinking","Developing and Using Models"],
  crosscuttingConcepts=["Systems and System Models","Scale, Proportion, and Quantity"],
  keywords=["GIS","modeling","runoff","land use","real data","Schuylkill River","simulation"],
  recommendedPathways=["middle","high"],
  estimatedTime="1–3 class periods per investigation",
  notes="Students can model their OWN school's watershed — instant place-based relevance for every IU29 district. Account optional for saving work.",
  relatedResources=["stroud-education-curricula","codap","usgs-water-science-school"]),

R("da-vinci-steels-pd", "Da Vinci Science Center STEELS Professional Development",
  "Act 48-approved, STEELS-explicit professional development from PA's regional NGSX provider: Becoming a Next Generation Science Teacher courses, the PLANS pathway for administrators and instructional leaders, and traveling science programs with co-teaching support.",
  "Da Vinci Science Center", "https://www.davincisciencecenter.org/programs-for-educators/",
  ["K-2","3-5","6-8","9-12"], ["Professional Learning","Cross-domain"],
  "Professional learning", "Paid", paSpecific=True,
  keywords=["NGSX","Act 48","BNGST","PLANS","administrators","district contracts","Lehigh Valley"],
  recommendedPathways=["administrator","instructional-coach"],
  estimatedTime="1.5-day to multi-day courses",
  notes="Explicitly built for PA STEELS implementation; district-contracted pricing. The PLANS administrator pathway is one of very few PD offerings aimed at leaders rather than teachers. Verified 2026-07-24.",
  relatedResources=["sas-steels-hub","ambitious-science-teaching"]),

R("hawk-mountain", "Hawk Mountain Sanctuary Education Programs",
  "The world's first raptor sanctuary — on Schuylkill County's doorstep in Kempton — offering school programs, raptor migration data going back to 1934, and one of the region's most compelling natural phenomena for anchoring life science and data-analysis lessons.",
  "Hawk Mountain Sanctuary", "https://www.hawkmountain.org/",
  ["3-5","6-8","9-12"], ["3.1","3.4"],
  "Environmental investigation", "Paid", paSpecific=True,
  disciplinaryCoreIdeas=["LS2: Ecosystems","LS4: Biological Evolution"],
  keywords=["raptors","migration","phenomena","field trip","long-term data","Kempton","local"],
  recommendedPathways=["elementary","middle"],
  estimatedTime="Field trips: half-day; datasets: 1–2 periods",
  notes="Program fees apply; migration count data is free online. The 90-year migration dataset is a ready-made local phenomenon for the Schuylkill Phenomena Bank. Program-page URL pending direct verification.",
  confidence="Medium",
  relatedResources=["schuylkill-conservation-district","pa-envirothon"]),

# ============ FEDERAL ============
R("nasa-learning-resources", "NASA STEM Learning Resources",
  "NASA's searchable hub of free K-12 lessons, activities, and multimedia across Earth and space science, engineering design, and technology — filterable by grade and topic.",
  "NASA", "https://www.nasa.gov/learning-resources/",
  ["K-2","3-5","6-8","9-12"], ["3.3","3.5","3.2"],
  "Lesson plans & activities", "Free",
  disciplinaryCoreIdeas=["ESS1: Earth's Place in the Universe","ETS1: Engineering Design"],
  keywords=["space","Earth science","engineering","NASA","free lessons"],
  recommendedPathways=["beginner-teacher","middle"],
  estimatedTime="30–60 min per activity",
  notes="NASA reorganized its STEM pages recently — URL reflects the current hub; re-verify at quarterly link check.",
  confidence="Medium",
  relatedResources=["noaa-education","usgs-water-science-school"]),

R("noaa-data-in-classroom", "NOAA Data in the Classroom",
  "Structured modules where students use real NOAA environmental data — water quality, coral bleaching, ocean acidification — through scaffolded levels from guided exploration to independent investigation.",
  "NOAA", "https://dataintheclassroom.noaa.gov/",
  ["6-8","9-12"], ["3.3","3.4"],
  "Data set & simulation", "Free",
  sciencePractices=["Analyzing and Interpreting Data","Using Mathematics and Computational Thinking"],
  crosscuttingConcepts=["Patterns","Stability and Change"],
  keywords=["real data","ocean","climate","water quality","modules"],
  recommendedPathways=["middle","high"],
  estimatedTime="Multi-day modules",
  notes="FLAG: some modules (heat islands, El Niño, sea level) temporarily offline after a site migration and being restored. Check module availability before assigning; re-verify in October 2026.",
  confidence="Medium",
  relatedResources=["noaa-education","codap"]),

R("noaa-education", "NOAA Education Resource Collections",
  "NOAA's curated collections of teaching resources on weather, climate, oceans, coasts, and watersheds — background science, multimedia, data, and lesson links organized by topic.",
  "NOAA", "https://www.noaa.gov/education/resource-collections",
  ["K-2","3-5","6-8","9-12"], ["3.3","3.4"],
  "Lesson plans & activities", "Free",
  keywords=["weather","climate","ocean","watersheds","collections"],
  recommendedPathways=["beginner-teacher"],
  estimatedTime="Varies by collection",
  notes="More stable than Data in the Classroom during the migration; good background-building for teachers new to Earth systems content.",
  relatedResources=["noaa-data-in-classroom","nasa-learning-resources"]),

R("usgs-water-science-school", "USGS Water Science School",
  "The definitive free reference on all things water: the water cycle (including the updated diagram with human activity), groundwater, streamflow, water quality, and PA-relevant data — with diagrams, interactives, and real-time data links.",
  "U.S. Geological Survey", "https://www.usgs.gov/special-topics/water-science-school",
  ["3-5","6-8","9-12"], ["3.3","3.4"],
  "Interactive science tool", "Free", featured=True,
  disciplinaryCoreIdeas=["ESS2: Earth's Systems"],
  crosscuttingConcepts=["Systems and System Models","Energy and Matter"],
  keywords=["water cycle","groundwater","streams","real-time data","no login"],
  recommendedPathways=["elementary","middle","beginner-teacher"],
  estimatedTime="Reference + 1-period explorations",
  notes="Pairs perfectly with local watershed work — USGS real-time gauges exist on the Schuylkill and Swatara. No account, no ads, no fuss.",
  relatedResources=["stroud-wikiwatershed","noaa-education"]),

R("epa-students-educators", "EPA Students & Educators Resources",
  "EPA's free environmental education materials: lesson plans and project ideas on air, water, waste, and climate, plus environmental data tools students can use for local investigations.",
  "U.S. Environmental Protection Agency", "https://www.epa.gov/students",
  ["K-2","3-5","6-8","9-12"], ["3.4"],
  "Environmental investigation", "Free",
  keywords=["environment","air quality","waste","climate","EPA"],
  recommendedPathways=["beginner-teacher"],
  estimatedTime="Varies",
  notes="Useful for the human-impact side of 3.4; quality varies by page, so preview before assigning.",
  relatedResources=["noaa-education","pa-gateway-to-green"]),

R("smithsonian-makerspaces", "Smithsonian Science for Makerspaces",
  "Nine free engineering design challenges for grades 1-5 connecting emerging technologies to hands-on making — each with teacher guides, material lists, and explicit engineering-design framing from the Smithsonian Science Education Center.",
  "Smithsonian Science Education Center", "https://ssec.si.edu/smithsonian-science-for-makerspaces",
  ["K-2","3-5"], ["3.5"],
  "Engineering design challenge", "Free", featured=True,
  disciplinaryCoreIdeas=["ETS1: Engineering Design"],
  sciencePractices=["Designing Solutions","Planning and Carrying Out Investigations"],
  keywords=["makerspace","engineering design","elementary","hands-on","free challenges"],
  recommendedPathways=["elementary"],
  estimatedTime="45–90 min per challenge",
  notes="Directly bridges Make @ Skook29 makerspace programming with elementary 3.5 standards. Exact URL pending direct verification (confirmed via Smithsonian press release).",
  confidence="Medium",
  relatedResources=["teachengineering","exploratorium-tinkering"]),

R("globe-program", "GLOBE Program",
  "NASA/NOAA-sponsored international program where students collect real environmental data (atmosphere, hydrosphere, biosphere, soil) using vetted protocols and contribute to a global scientific database.",
  "GLOBE Program (NASA/NOAA/NSF)", "https://www.globe.gov/",
  ["K-2","3-5","6-8","9-12"], ["3.3","3.4","3.1"],
  "Environmental investigation", "Registration",
  sciencePractices=["Planning and Carrying Out Investigations","Analyzing and Interpreting Data"],
  keywords=["citizen science","protocols","data collection","global database","field work"],
  recommendedPathways=["instructional-coach","middle"],
  estimatedTime="Ongoing program; protocols 30–60 min",
  notes="Teacher training required for data entry (free, online). Turns any schoolyard into a research station.",
  relatedResources=["stroud-wikiwatershed","noaa-data-in-classroom"]),

# ============ NGSS ECOSYSTEM & NONPROFITS ============
R("nextgenscience-org", "NextGenScience (nextgenscience.org)",
  "The home of the Next Generation Science Standards — the national standards STEELS was adapted from — including the standards browser, evidence statements, and implementation resources.",
  "WestEd / NextGenScience", "https://www.nextgenscience.org/",
  ["K-2","3-5","6-8","9-12"], ["Cross-domain"],
  "Official standards & guidance", "Free",
  keywords=["NGSS","evidence statements","standards","national"],
  recommendedPathways=["instructional-coach"],
  estimatedTime="Reference",
  notes="Because STEELS is NGSS-adapted, nearly everything here transfers — but always check against PA Foundation Boxes, especially for 3.4 and 3.5, which differ.",
  relatedResources=["ngss-quality-examples","sas-steels-hub","nap-framework"]),

R("ngss-quality-examples", "Examples of Quality NGSS Design (incl. EQuIP Rubric)",
  "Vetted example units and lessons that earned the NGSS Design Badge, plus the EQuIP Rubric for evaluating whether instructional materials are genuinely three-dimensional — the screening tool PA's own STEELS 101 guidance points teachers toward.",
  "WestEd / NextGenScience", "https://www.nextgenscience.org/resources/examples-quality-ngss-design",
  ["K-2","3-5","6-8","9-12"], ["Three-Dimensional Teaching"],
  "Curriculum-mapping support", "Free",
  keywords=["EQuIP","curriculum screening","quality examples","design badge","vetting"],
  recommendedPathways=["instructional-coach","administrator"],
  estimatedTime="Rubric review: 2–4 hrs per unit",
  notes="Cited in PDE's STEELS 101 document. The tool for answering 'is this curriculum we're being sold actually 3-D?'",
  relatedResources=["nextgenscience-org","openscied"]),

R("stem-teaching-tools", "STEM Teaching Tools",
  "Short, research-based practice briefs from the University of Washington on every aspect of 3-D science teaching: talk moves, assessment, equity, phenomena selection, and family engagement — each a focused 2-page read built for PLCs.",
  "University of Washington Institute for Science + Math Education", "https://stemteachingtools.org/",
  ["K-2","3-5","6-8","9-12"], ["Three-Dimensional Teaching","Professional Learning"],
  "Professional learning", "Free", featured=True,
  keywords=["practice briefs","PLC","equity","talk moves","phenomena","research-based"],
  recommendedPathways=["instructional-coach","beginner-teacher"],
  estimatedTime="10-min reads; PLC-ready",
  notes="Cited in PDE's STEELS 101 guidance. The best PLC fuel in science education — pick one brief per meeting and go.",
  relatedResources=["ambitious-science-teaching","wonder-of-science"]),

R("openscied", "OpenSciEd",
  "Complete, free, openly licensed NGSS science units for elementary, middle, and high school — storyline-driven, phenomenon-anchored, and externally reviewed, with teacher guides, slides, and student materials.",
  "OpenSciEd", "https://www.openscied.org/",
  ["K-2","3-5","6-8","9-12"], ["3.1","3.2","3.3","Three-Dimensional Teaching"],
  "Model unit", "Registration", featured=True,
  disciplinaryCoreIdeas=["Multiple across LS, PS, ESS"],
  sciencePractices=["All SEPs"],
  crosscuttingConcepts=["All CCCs"],
  keywords=["full curriculum","storylines","phenomena","OER","free units","field-tested"],
  recommendedPathways=["instructional-coach","middle","high"],
  estimatedTime="Full units: 4–8 weeks each",
  notes="Free account required to download. The strongest free full-curriculum option for districts that can't buy new materials — pair adoption with PD, not as a PDF dump.",
  relatedResources=["ngss-storylines","ngss-quality-examples","stem-teaching-tools"]),

R("wonder-of-science", "The Wonder of Science",
  "Paul Andersen's practical 3-D teaching site: phenomena organized by standard and grade, Claim-Evidence-Reasoning templates and rubrics, assessment probes, and clear explainer videos for every SEP and CCC.",
  "The Wonder of Science (Paul Andersen)", "https://thewonderofscience.com/",
  ["K-2","3-5","6-8","9-12"], ["Three-Dimensional Teaching","Assessment"],
  "Phenomena collection", "Free", featured=True,
  sciencePractices=["All SEPs"],
  crosscuttingConcepts=["All CCCs"],
  keywords=["phenomena","CER","claim evidence reasoning","rubrics","videos","by standard"],
  recommendedPathways=["beginner-teacher","elementary","middle"],
  estimatedTime="Phenomena: 5-min hooks; CER tasks: 1 period",
  notes="Probably the fastest on-ramp for a teacher who's never taught 3-D. Phenomena indexed by performance expectation — map to STEELS via the NGSS crosswalk.",
  relatedResources=["stem-teaching-tools","snap-assessments"]),

R("ambitious-science-teaching", "Ambitious Science Teaching",
  "A coherent framework of core teaching practices — planning for engagement, eliciting student ideas, supporting sensemaking, and pressing for evidence-based explanations — with free tools, videos of real classrooms, and discourse primers.",
  "Ambitious Science Teaching (UW)", "https://ambitiousscienceteaching.org/",
  ["K-2","3-5","6-8","9-12"], ["Three-Dimensional Teaching","Professional Learning"],
  "Professional learning", "Free",
  keywords=["core practices","discourse","sensemaking","classroom videos","framework"],
  recommendedPathways=["instructional-coach"],
  estimatedTime="Tool-based; book study over a semester",
  notes="The pedagogical backbone behind programs like NGSX. Classroom video library is gold for coaching conversations.",
  relatedResources=["stem-teaching-tools","da-vinci-steels-pd"]),

R("nap-framework", "A Framework for K-12 Science Education",
  "The National Academies consensus report that STEELS (via NGSS) is built on — the definitive explanation of the three dimensions, why they matter, and how learning progresses K-12. Free PDF download.",
  "National Academies of Sciences", "https://nap.nationalacademies.org/catalog/13165/a-framework-for-k-12-science-education-practices-crosscutting-concepts",
  ["K-2","3-5","6-8","9-12"], ["Three-Dimensional Teaching","Professional Learning"],
  "Official standards & guidance", "Registration", featured=True,
  keywords=["framework","research basis","three dimensions","National Research Council"],
  recommendedPathways=["instructional-coach","administrator"],
  estimatedTime="Book-length; ch. 1–2 essential (90 min)",
  notes="Free PDF (email requested at download). PDE cites this as a primary source document for STEELS. When someone asks 'why are we changing how we teach science?' — this is the answer, with receipts.",
  relatedResources=["steels-foundation-boxes","nextgenscience-org"]),

R("snap-assessments", "Stanford NGSS Assessment Project (SNAP)",
  "Free three-dimensional performance assessments from Stanford SCALE: short performance assessments, instructionally-embedded tasks, multidimensional rubric templates, and free online courses teaching educators to design their own — including rare K-4 examples.",
  "Stanford Graduate School of Education (SCALE)", "https://scienceeducation.stanford.edu/assessments",
  ["K-2","3-5","6-8","9-12"], ["Assessment","Three-Dimensional Teaching"],
  "Assessment tool", "Free", featured=True,
  sciencePractices=["Developing and Using Models","Constructing Explanations","Engaging in Argument from Evidence"],
  keywords=["performance assessment","rubrics","3D assessment","task design","free courses"],
  recommendedPathways=["instructional-coach"],
  estimatedTime="Tasks: 30 min–multi-day; courses: self-paced",
  notes="The natural companion to PDE's Assessment Toolkit — use SNAP's design tools to build IU29-original tasks. Verified 2026-07-24.",
  relatedResources=["steels-assessment-toolkit","wonder-of-science"]),

R("phet", "PhET Interactive Simulations",
  "170+ free, research-based science and math simulations from CU Boulder — forces, circuits, states of matter, natural selection, and more — running in-browser with no account, plus teacher-contributed lesson plans.",
  "University of Colorado Boulder", "https://phet.colorado.edu/",
  ["3-5","6-8","9-12"], ["3.2","3.1","3.3"],
  "Data set & simulation", "Free", featured=True,
  disciplinaryCoreIdeas=["PS1: Matter","PS2: Motion and Stability","PS3: Energy","LS4: Evolution"],
  sciencePractices=["Developing and Using Models","Planning and Carrying Out Investigations"],
  keywords=["simulations","physics","chemistry","no login","interactive","inquiry"],
  recommendedPathways=["beginner-teacher","middle","high"],
  estimatedTime="20–45 min per sim activity",
  notes="The gold standard for no-friction interactive science. Works on Chromebooks, no accounts, translated into dozens of languages.",
  relatedResources=["concord-consortium","codap"]),

R("concord-consortium", "Concord Consortium STEM Resource Finder",
  "Free, technology-rich science activities and virtual labs — molecular dynamics, genetics, seismic data, sensor-based investigations — with class-management features for tracking student work.",
  "Concord Consortium", "https://learn.concord.org/",
  ["6-8","9-12"], ["3.2","3.1","3.3","CS-CT"],
  "Data set & simulation", "Registration",
  keywords=["virtual labs","molecular","genetics","sensors","models"],
  recommendedPathways=["middle","high"],
  estimatedTime="1–2 periods per activity",
  notes="Free accounts unlock assignment tracking. Concord co-developed Stroud's WATERS curriculum — same design DNA.",
  relatedResources=["codap","phet","stroud-education-curricula"]),

R("codap", "CODAP (Common Online Data Analysis Platform)",
  "Free, browser-based data analysis built for education: drag-and-drop graphing, mapping, and modeling of any dataset — the easiest serious on-ramp to data science practices in 6-12 science.",
  "Concord Consortium", "https://codap.concord.org/",
  ["6-8","9-12"], ["CS-CT","3.3","Cross-domain"],
  "Interactive science tool", "Free",
  sciencePractices=["Analyzing and Interpreting Data","Using Mathematics and Computational Thinking"],
  crosscuttingConcepts=["Patterns","Scale, Proportion, and Quantity"],
  keywords=["data analysis","data science","graphing","computational thinking","no login"],
  recommendedPathways=["middle","high","instructional-coach"],
  estimatedTime="15-min learning curve; then per-lesson",
  notes="Drop in local data — Envirothon results, stream monitoring, Hawk Mountain counts — and 'CT is the OS' becomes a lesson, not a slogan.",
  relatedResources=["concord-consortium","stroud-wikiwatershed","noaa-data-in-classroom"]),

R("teachengineering", "TeachEngineering",
  "The largest free K-12 engineering library: 1,650+ NSF-funded, teacher-tested lessons and hands-on activities from 50+ university engineering programs, searchable by grade, cost of materials, and time — no account required.",
  "TeachEngineering (NSF / University of Colorado)", "https://www.teachengineering.org/",
  ["K-2","3-5","6-8","9-12"], ["3.5"],
  "Engineering design challenge", "Free", featured=True,
  disciplinaryCoreIdeas=["ETS1: Engineering Design","ETS2: Links Among Engineering, Technology, Science, and Society"],
  sciencePractices=["Designing Solutions","Asking Questions and Defining Problems"],
  keywords=["engineering","design challenges","hands-on","NSF","no login","maker"],
  recommendedPathways=["beginner-teacher","elementary","middle","high"],
  estimatedTime="Activities: 45 min–1 week",
  notes="The backbone for 3.5 — a domain where PA teachers have the least prior training. Filter by low-cost materials for makerspace-on-a-budget builds.",
  relatedResources=["smithsonian-makerspaces","exploratorium-tinkering","pblworks"]),

R("nsta", "National Science Teaching Association (NSTA)",
  "The national professional association for science educators: free Daily Do sensemaking lessons, journals, position statements, web seminars, and an extensive resource library — with deeper access via paid membership.",
  "NSTA", "https://www.nsta.org/",
  ["K-2","3-5","6-8","9-12"], ["Professional Learning","Three-Dimensional Teaching"],
  "Professional learning", "Registration",
  keywords=["professional association","Daily Do","journals","web seminars","membership"],
  recommendedPathways=["instructional-coach","beginner-teacher"],
  estimatedTime="Varies",
  notes="Free account unlocks a meaningful slice; full journals and books require paid membership (~$89/yr individual). Clearly disclose the tier when recommending.",
  relatedResources=["stem-teaching-tools","ambitious-science-teaching"]),

R("pblworks", "PBLWorks",
  "The Buck Institute's gold-standard project-based learning resources: the research-based Gold Standard PBL model, a searchable project idea library, rubrics, and planning tools.",
  "Buck Institute for Education", "https://www.pblworks.org/",
  ["K-2","3-5","6-8","9-12"], ["Project-Based Learning","Cross-domain"],
  "Project-based learning unit", "Registration",
  keywords=["PBL","gold standard","project library","rubrics","driving questions"],
  recommendedPathways=["instructional-coach"],
  estimatedTime="Projects: 2–8 weeks",
  notes="Free account for the project library; paid PD services. Use the Gold Standard design elements as the quality bar for IU29-original design challenges.",
  relatedResources=["teachengineering","ngss-storylines"]),

R("project-learning-tree", "Project Learning Tree",
  "Award-winning environmental education using forests as a lens: the Explore Your Environment K-8 guide contains 50 field-tested activities; in PA, workshops and materials are delivered through DCNR as the state host.",
  "Sustainable Forestry Initiative / PLT", "https://www.plt.org/",
  ["K-2","3-5","6-8"], ["3.4","3.1"],
  "Environmental investigation", "Paid", 
  keywords=["forests","trees","outdoor learning","activity guide","workshops"],
  recommendedPathways=["elementary"],
  estimatedTime="Activities: 30–90 min",
  notes="K-8 guide is $34.99 print or obtained via workshop (often through DCNR PA workshops, sometimes included in registration). Some free sample activities online. Access clearly disclosed: primarily paid/workshop.",
  relatedResources=["dcnr-educator-pd","schuylkill-conservation-district"]),

R("exploratorium-tinkering", "Exploratorium Tinkering Studio & Science Snacks",
  "The Exploratorium's free maker-education activities and 'Science Snacks' — cheap-materials versions of museum exhibits with clear science explanations — from the institution that basically invented museum-based tinkering pedagogy.",
  "Exploratorium", "https://www.exploratorium.edu/tinkering",
  ["3-5","6-8","9-12"], ["3.5","3.2"],
  "MakerSpace integration", "Free",
  keywords=["tinkering","maker","science snacks","cheap materials","exhibits"],
  recommendedPathways=["middle"],
  estimatedTime="45 min–2 hrs per activity",
  notes="Science Snacks are ideal makerspace stations. URL pending direct verification at quarterly link check.",
  confidence="Medium",
  relatedResources=["smithsonian-makerspaces","teachengineering"]),

R("pbs-learningmedia", "PBS LearningMedia",
  "Free standards-searchable library of videos, interactives, and lesson plans from PBS and partner producers (NOVA, Nature, local stations including WVIA/WITF), organized by grade and subject.",
  "PBS & local member stations", "https://www.pbslearningmedia.org/",
  ["K-2","3-5","6-8","9-12"], ["3.1","3.2","3.3","Cross-domain"],
  "Interactive science tool", "Free",
  keywords=["video","NOVA","media","interactives","free account optional"],
  recommendedPathways=["elementary","beginner-teacher"],
  estimatedTime="Clips: 3–15 min; lessons: 1 period",
  notes="Optional free account for saving. Search by standard is NGSS-based — crosswalk to STEELS applies.",
  relatedResources=["wonder-of-science","hhmi-biointeractive"]),

R("mystery-science", "Mystery Science",
  "Highly popular ready-made elementary science lessons built around mystery phenomena, with videos, discussion prompts, and simple-materials hands-on activities — a lifeline for elementary generalists.",
  "Mystery Science (Discovery Education)", "https://mysteryscience.com/",
  ["K-2","3-5"], ["3.1","3.2","3.3"],
  "Lesson plans & activities", "Paid",
  keywords=["elementary","phenomena","ready-made","videos","hands-on"],
  recommendedPathways=["elementary"],
  estimatedTime="Lessons: 45–60 min",
  notes="Limited free lessons; full access requires school/district subscription. Included despite paid status because elementary demand is intense and quality is real — clearly labeled as paid.",
  confidence="Medium",
  relatedResources=["wonder-of-science","openscied"]),

R("hhmi-biointeractive", "HHMI BioInteractive",
  "Free, stunning high school life science resources: data-rich case studies, short films, interactive media, and click-and-learn activities on evolution, ecology, and molecular biology — built by scientists, beloved by AP and honors teachers.",
  "Howard Hughes Medical Institute", "https://www.biointeractive.org/",
  ["9-12"], ["3.1"],
  "Lab investigation", "Registration",
  disciplinaryCoreIdeas=["LS1: Structures and Processes","LS2: Ecosystems","LS4: Biological Evolution"],
  sciencePractices=["Analyzing and Interpreting Data","Constructing Explanations"],
  keywords=["biology","evolution","case studies","short films","data","high school"],
  recommendedPathways=["high"],
  estimatedTime="Activities: 1–3 periods",
  notes="Free account for full downloads. Directly strengthens the thin 9-12 life science band; strong Keystone Biology relevance.",
  relatedResources=["snap-assessments","pbs-learningmedia"]),

R("ngss-storylines", "NextGen Science Storylines",
  "Free, coherent storyline units from Northwestern University where each lesson is driven by student questions about an anchoring phenomenon — the instructional model behind OpenSciEd, with units for elementary through high school.",
  "Northwestern University", "https://www.nextgenstorylines.org/",
  ["3-5","6-8","9-12"], ["3.1","3.2","3.3","Three-Dimensional Teaching"],
  "Model unit", "Free",
  keywords=["storylines","anchoring phenomena","coherence","units","Northwestern"],
  recommendedPathways=["instructional-coach","middle"],
  estimatedTime="Units: 3–6 weeks",
  notes="URL pending direct verification at quarterly link check. Excellent for showing teachers what phenomenon-driven coherence looks like before committing to full OpenSciEd adoption.",
  confidence="Medium",
  relatedResources=["openscied","wonder-of-science"]),

R("macroinvertebrates-org", "Macroinvertebrates.org",
  "Free interactive atlas for identifying aquatic insects of eastern North America with stunning zoomable photography — the digital field guide for stream studies, Leaf Pack investigations, and Envirothon aquatics prep.",
  "Carnegie Mellon University & Stroud Water Research Center", "https://www.macroinvertebrates.org/",
  ["3-5","6-8","9-12"], ["3.1","3.4"],
  "Interactive science tool", "Free",
  disciplinaryCoreIdeas=["LS2: Ecosystems"],
  keywords=["macroinvertebrates","stream study","identification","aquatic insects","water quality","no login"],
  recommendedPathways=["middle","high"],
  estimatedTime="Reference during field work",
  notes="Cited by PA conservation districts as a core teaching resource. Load it on tablets for creek days — bioassessment becomes self-serve.",
  relatedResources=["stroud-education-curricula","pfbc-education-portal","pa-envirothon"]),

# ============ CS / COMPUTATIONAL THINKING ============
R("code-org", "Code.org",
  "Free K-12 computer science curriculum: CS Fundamentals for elementary, CS Discoveries for middle school, CS Principles for high school — with teacher dashboards, self-paced PD, and no-cost everything.",
  "Code.org", "https://code.org/",
  ["K-2","3-5","6-8","9-12"], ["CS-CT"],
  "Model unit", "Registration",
  keywords=["computer science","coding","CS Fundamentals","curriculum","free PD"],
  recommendedPathways=["elementary","middle","high"],
  estimatedTime="Full courses; lessons 45 min",
  notes="Free teacher accounts for class management. The default statewide CS on-ramp — connects to your CSO Regional Lead network.",
  relatedResources=["cs-unplugged","scratch","csta-standards"]),

R("cs-unplugged", "CS Unplugged",
  "Free computational thinking activities that teach CS concepts — algorithms, binary, sorting networks — entirely without computers, using cards, string, and movement. Perfect for K-8 and low-tech classrooms.",
  "University of Canterbury, NZ", "https://www.csunplugged.org/",
  ["K-2","3-5","6-8"], ["CS-CT"],
  "Lesson plans & activities", "Free",
  keywords=["unplugged","computational thinking","no computers","algorithms","kinesthetic"],
  recommendedPathways=["elementary"],
  estimatedTime="30–60 min per activity",
  notes="No devices, no accounts, no excuses. The cleanest demonstration that computational thinking is thinking, not typing.",
  relatedResources=["code-org","scratch"]),

R("scratch", "Scratch",
  "MIT's free block-based programming environment where students create interactive stories, games, and science simulations — the world's largest kids' coding community, with an educator dashboard for classes.",
  "MIT Media Lab", "https://scratch.mit.edu/",
  ["3-5","6-8"], ["CS-CT","3.5"],
  "Interactive science tool", "Free",
  keywords=["block coding","MIT","creative computing","simulations","projects"],
  recommendedPathways=["elementary","middle"],
  estimatedTime="Projects: 1 period–multi-week",
  notes="Accounts optional (needed for saving/sharing). Have students BUILD science simulations rather than just use them — modeling practice meets computational thinking.",
  relatedResources=["code-org","cs-unplugged","phet"]),

R("csta-standards", "CSTA K-12 Computer Science Standards",
  "The national K-12 computer science standards framework — the reference point for mapping computational thinking connections across STEELS domains and for districts building CS pathways.",
  "Computer Science Teachers Association", "https://csteachers.org/k12standards/",
  ["K-2","3-5","6-8","9-12"], ["CS-CT"],
  "Official standards & guidance", "Free",
  keywords=["CS standards","CSTA","framework","pathways","computational thinking"],
  recommendedPathways=["instructional-coach","administrator"],
  estimatedTime="Reference",
  notes="Use alongside STEELS T&E standards when advising districts on integrated CS. URL pending direct verification.",
  confidence="Medium",
  relatedResources=["code-org","pdesas-portal"]),
]

# ---------------- FEATURED COLLECTIONS ----------------
COLLECTIONS = [
 {"id":"new-to-steels","title":"New to STEELS","description":"Start here if STEELS is new to you: what changed, why, and what your standards actually ask for.",
  "resourceIds":["sas-steels-hub","steels-foundation-boxes","pde-science-standards-page","nap-framework"]},
 {"id":"ready-monday-morning","title":"Ready for Monday Morning","description":"No logins, no prep marathons — vetted resources you can use tomorrow.",
  "resourceIds":["phet","pfbc-education-portal","usgs-water-science-school","wonder-of-science","cs-unplugged","macroinvertebrates-org"]},
 {"id":"engineering","title":"Engineering & Design","description":"Hands-on engineering design challenges for the 3.5 standards — the domain most PA teachers never trained for.",
  "resourceIds":["teachengineering","smithsonian-makerspaces","exploratorium-tinkering","pblworks"]},
 {"id":"assessment","title":"Assessment & Student Evidence","description":"Three-dimensional performance tasks, rubrics, and the tools to build your own.",
  "resourceIds":["steels-assessment-toolkit","snap-assessments","wonder-of-science","ngss-quality-examples"]},
 {"id":"environmental-literacy","title":"Environmental Literacy (3.4)","description":"Pennsylvania's distinctive fifth domain — watershed, sustainability, and stewardship resources.",
  "resourceIds":["stroud-education-curricula","dcnr-watershed-education","pa-envirothon","stroud-wikiwatershed","epa-students-educators","pa-gateway-to-green"]},
 {"id":"elementary","title":"Elementary (K-5)","description":"Curated for elementary generalists — approachable, materials-light, and phenomena-first.",
  "resourceIds":["wonder-of-science","smithsonian-makerspaces","pfbc-education-portal","mystery-science","cs-unplugged","scratch"]},
 {"id":"middle-school","title":"Middle School (6-8)","description":"Storyline units, real data, and field investigations for the middle grades.",
  "resourceIds":["openscied","stroud-education-curricula","phet","codap","teachengineering","noaa-data-in-classroom"]},
 {"id":"high-school","title":"High School (9-12)","description":"Data-rich, rigorous resources for biology, chemistry, physics, and environmental science.",
  "resourceIds":["hhmi-biointeractive","phet","snap-assessments","pa-envirothon","concord-consortium","stroud-wikiwatershed"]},
 {"id":"no-login","title":"No Login Required","description":"Zero-friction: everything here works without creating any account.",
  "resourceIds":["phet","usgs-water-science-school","teachengineering","wonder-of-science","stem-teaching-tools","codap","cs-unplugged","macroinvertebrates-org","pfbc-education-portal"]},
 {"id":"administrator","title":"For Administrators","description":"Implementation timelines, walkthrough guidance, and leadership-level PD.",
  "resourceIds":["pde-science-standards-page","sas-steels-hub","steels-safety-guide","da-vinci-steels-pd","ngss-quality-examples","nap-framework"]},
 {"id":"instructional-coach","title":"For Instructional Coaches","description":"Practice briefs, coaching frameworks, and curriculum evaluation tools.",
  "resourceIds":["stem-teaching-tools","ambitious-science-teaching","snap-assessments","ngss-quality-examples","openscied","steels-curriculum-frameworks"]},
 {"id":"beginner-teacher","title":"Beginner Teacher Pathway","description":"STEELS in five steps: orient, unpack, see a model, try one thing, get support.",
  "resourceIds":["sas-steels-hub","steels-foundation-boxes","wonder-of-science","phet","stem-teaching-tools"]},
 {"id":"computational-thinking","title":"Computational Thinking & CS","description":"CT is the OS — computer science and data practices woven through science.",
  "resourceIds":["code-org","cs-unplugged","scratch","codap","csta-standards"]},
 {"id":"makerspace","title":"MakerSpace Integration","description":"Making with standards attached — challenges and tinkering built for makerspace programs.",
  "resourceIds":["smithsonian-makerspaces","teachengineering","exploratorium-tinkering","scratch"]},
 {"id":"schuylkill-county","title":"Schuylkill County Connections","description":"Place-based partners and phenomena in and around IU29's backyard.",
  "resourceIds":["schuylkill-conservation-district","pa-envirothon","hawk-mountain","stroud-education-curricula","stroud-wikiwatershed","macroinvertebrates-org"]},
 {"id":"professional-learning","title":"Professional Learning","description":"PD for every budget: free self-serve briefs to Act 48 workshops and district contracts.",
  "resourceIds":["stem-teaching-tools","ambitious-science-teaching","dcnr-educator-pd","da-vinci-steels-pd","nsta","nap-framework"]},
 {"id":"ai-integration","title":"AI & Data Integration","description":"Data tools and simulations that pair with AI-assisted lesson design — the retrieval layer for STEM@Skook29 AI tools.",
  "resourceIds":["codap","stroud-wikiwatershed","concord-consortium","phet","noaa-data-in-classroom"]},
]

# ---------------- VALIDATION ----------------
ids = [r["id"] for r in RESOURCES]
assert len(ids) == len(set(ids)), "Duplicate resource IDs!"
idset = set(ids)
for r in RESOURCES:
    for rel in r["relatedResources"]:
        assert rel in idset, f"Bad relatedResource '{rel}' in {r['id']}"
for c in COLLECTIONS:
    for rid in c["resourceIds"]:
        assert rid in idset, f"Bad collection ref '{rid}' in {c['id']}"
for r in RESOURCES:
    assert r["access"] in ("Free","Registration","Workshop","Paid"), r["id"]
    assert r["confidence"] in ("High","Medium","Low"), r["id"]

# ---------------- OUTPUTS ----------------
import os
base = os.path.dirname(os.path.abspath(__file__))
data_dir = os.path.join(base, "data")
browser_dir = os.path.abspath(os.path.join(base, "..", "..", "js", "steels-library"))
os.makedirs(data_dir, exist_ok=True)
os.makedirs(browser_dir, exist_ok=True)

# JSON
with open(f"{base}/data/steelsResources.json","w") as f:
    json.dump(RESOURCES, f, indent=2, ensure_ascii=False)

# JS
js = "// STEELS Resource Library — canonical dataset\n"
js += "// STEM@Skook29 / Schuylkill Intermediate Unit 29\n"
js += f"// Generated {TODAY} — {len(RESOURCES)} resources. Regenerate via build_dataset.py; do not hand-edit derived files.\n\n"
js += "const steelsResources = " + json.dumps(RESOURCES, indent=2, ensure_ascii=False) + ";\n\n"
js += 'if (typeof module !== "undefined" && module.exports) { module.exports = steelsResources; }\n'
with open(f"{base}/data/steelsResources.js","w") as f:
    f.write(js)
with open(os.path.join(browser_dir, "steelsResources.js"), "w") as f:
    f.write(js)

# featuredCollections.json
with open(f"{base}/data/featuredCollections.json","w") as f:
    json.dump(COLLECTIONS, f, indent=2, ensure_ascii=False)

collections_js = "// STEELS Resource Library — featured collections\n"
collections_js += "// Generated from the maintenance dataset by build_dataset.py; do not edit independently.\n"
collections_js += "// Collection entries reference canonical resource IDs and contain no duplicated resource records.\n\n"
collections_js += "const featuredCollections = " + json.dumps(COLLECTIONS, indent=2, ensure_ascii=False) + ";\n\n"
collections_js += 'if (typeof module !== "undefined" && module.exports) { module.exports = featuredCollections; }\n'
with open(os.path.join(browser_dir, "featuredCollections.js"), "w") as f:
    f.write(collections_js)

# CSV
fields = ["id","title","description","publisher","url","gradeBands","steelsDomains",
          "disciplinaryCoreIdeas","sciencePractices","crosscuttingConcepts","keywords",
          "resourceType","access","paSpecific","featured","recommendedPathways",
          "estimatedTime","reviewDate","confidence","notes","relatedResources"]
with open(f"{base}/data/steelsResources.csv","w",newline="") as f:
    w = csv.DictWriter(f, fieldnames=fields)
    w.writeheader()
    for r in RESOURCES:
        row = dict(r)
        for k,v in row.items():
            if isinstance(v, list): row[k] = "; ".join(v)
            elif isinstance(v, bool): row[k] = "TRUE" if v else "FALSE"
        w.writerow(row)

# ---------------- STATS ----------------
def count_multi(key):
    c = Counter()
    for r in RESOURCES:
        for v in r[key]: c[v]+=1
    return c

grade_c = count_multi("gradeBands")
domain_c = count_multi("steelsDomains")
type_c = Counter(r["resourceType"] for r in RESOURCES)
access_c = Counter(r["access"] for r in RESOURCES)
pub_c = Counter(r["publisher"] for r in RESOURCES)
conf_c = Counter(r["confidence"] for r in RESOURCES)
pa_count = sum(1 for r in RESOURCES if r["paSpecific"])
feat_count = sum(1 for r in RESOURCES if r["featured"])

missing = []
for r in RESOURCES:
    gaps = []
    if not r["disciplinaryCoreIdeas"]: gaps.append("disciplinaryCoreIdeas")
    if not r["sciencePractices"]: gaps.append("sciencePractices")
    if not r["crosscuttingConcepts"]: gaps.append("crosscuttingConcepts")
    if gaps: missing.append((r["id"], gaps))

medium_conf = [r["id"] for r in RESOURCES if r["confidence"]=="Medium"]

lines = []
lines.append("# STEELS Resource Library — Dataset Statistics")
lines.append(f"\nGenerated: {TODAY}\n")
lines.append(f"**Total resources: {len(RESOURCES)}**  |  PA-specific: {pa_count}  |  Featured: {feat_count}  |  Collections: {len(COLLECTIONS)}\n")
lines.append("## By Grade Band")
for k in ["K-2","3-5","6-8","9-12"]:
    lines.append(f"- {k}: {grade_c[k]}")
lines.append("\n## By STEELS Domain")
for k,v in domain_c.most_common():
    lines.append(f"- {k}: {v}")
lines.append("\n## By Resource Type")
for k,v in type_c.most_common():
    lines.append(f"- {k}: {v}")
lines.append("\n## By Access")
for k,v in access_c.most_common():
    lines.append(f"- {k}: {v}")
lines.append("\n## By Confidence")
for k,v in conf_c.most_common():
    lines.append(f"- {k}: {v}")
lines.append("\n## By Publisher")
for k,v in pub_c.most_common():
    lines.append(f"- {k}: {v}")
lines.append("\n## Metadata Gaps (dimension tagging incomplete)")
lines.append(f"\n{len(missing)} of {len(RESOURCES)} records lack one or more dimension tags (DCIs/SEPs/CCCs). This is honest: portal-type and PD resources span dimensions and were deliberately left untagged rather than falsely tagged. The V2 standards-metadata pass should complete tagging for classroom-facing records:\n")
for rid, gaps in missing:
    lines.append(f"- `{rid}`: missing {', '.join(gaps)}")
lines.append("\n## Verification Queue (Medium confidence — re-verify exact URLs at next quarterly check)")
for rid in medium_conf:
    lines.append(f"- `{rid}`")
lines.append("\n## Known Integrity Flags")
lines.append("- `noaa-data-in-classroom`: partial module outage post-migration; re-verify Oct 2026")
lines.append("- `hawk-mountain`, `smithsonian-makerspaces`, `exploratorium-tinkering`, `ngss-storylines`, `csta-standards`, `nasa-learning-resources`, `mystery-science`: organization verified, exact program URL pending direct fetch")
lines.append("- Maker Ed deliberately EXCLUDED per Phase 2 curatorial decision (organization wound down ~2022)")

with open(f"{base}/STATS.md","w") as f:
    f.write("\n".join(lines) + "\n")

print(f"OK — {len(RESOURCES)} resources, {len(COLLECTIONS)} collections")
print(f"PA-specific: {pa_count} | Featured: {feat_count}")
print(f"Access: {dict(access_c)}")
print(f"Confidence: {dict(conf_c)}")
