(function () {
  'use strict';

  // =============================================
  // PD LINKS
  // =============================================

  var PD = {
    cultivating: {
      name: 'Cultivating Creativity in a Digital World: From Engagement to Expression',
      link: 'https://www.solutionwhere.com/WW/Aspx/Public/Search/ShowSession.aspx?sessionId=41ggekrarevxnhgp25l33ymw3%2f30%2f20263%3a09%3a56+PM793&cId=179&pCId=0',
      context: 'Explore how creativity, digital tools, and AI intersect in real classroom practice — with time to apply ideas directly to your own instruction.'
    },
    make: {
      name: 'Make Yourself: Using AI to Be a Better You',
      link: 'https://www.solutionwhere.com/WW/Aspx/Public/Search/ShowSession.aspx?sessionId=41ggekrarevxnhgp25l33ymw3%2f30%2f20263%3a07%3a56+PM968&cId=179&pCId=0',
      context: 'Hands-on with AI tools for teacher productivity — planning, differentiation, communication, and more. Leave with tools you can use Monday morning.'
    },
    math: {
      name: 'AI in the Math Classroom: Amplifying Thinking, Reasoning, and Problem Solving',
      link: 'https://www.solutionwhere.com/WW/Aspx/Public/Search/ShowCourse.aspx?courseNum=56&cId=179&pCId=0',
      context: 'Designed specifically for math educators — learn how to use AI tools to deepen reasoning and inquiry without giving students a shortcut to answers.'
    },
    engineering: {
      name: 'Engineering by Design: STEELS-Aligned Engineering Thinking',
      link: 'https://www.solutionwhere.com/WW/Aspx/Public/Search/ShowSession.aspx?sessionId=41ggekrarevxnhgp25l33ymw3%2f30%2f20263%3a11%3a25+PM243&cId=179&pCId=0',
      context: 'Build confidence with the STEELS engineering design standards through hands-on activities — and explore where technology tools fit into the design process.'
    }
  };

  // =============================================
  // RESPONSE DATA BANK
  // =============================================

  var RESPONSES = {

    ela: {
      topic: 'AI in English, Writing & Literacy',
      quickAnswer: 'Start with AI as a thinking partner, not a writing replacement. Have students use AI to compare feedback on a paragraph they already wrote, brainstorm counterarguments, or generate revision questions — then decide what to keep, change, or push back on.',
      tryTomorrow: 'Ask students to write a short claim-evidence-reasoning paragraph first. Then let them ask an AI tool for feedback on clarity, evidence, and organization. Each student must decide which piece of AI feedback to apply — and write one sentence explaining why they made that choice. The reasoning is the assignment.',
      toolSuggestion: 'MagicSchool AI or SchoolAI both offer teacher-controlled prompts and safer student interaction modes designed for K–12. Class Companion takes a Socratic approach — asking students guiding questions rather than handing them a rewritten draft.',
      safetyNote: 'Do not have students enter personal information into any AI tool. Keep the activity focused on feedback, questioning, revision, or reflection rather than generating final answers. Model what responsible AI use looks like — including disagreeing with AI output — before students try it independently.',
      pd: PD.cultivating
    },

    planning: {
      topic: 'AI for Teacher Planning & Productivity',
      quickAnswer: 'Start with one task that costs you significant time every week — writing rubrics, generating discussion questions, differentiating an existing worksheet, or drafting family communication. AI can produce a strong draft faster than you can type the prompt. Your job is editing, not starting from scratch.',
      tryTomorrow: 'Take one lesson you\'re already teaching next week. Paste the learning objective into MagicSchool AI\'s Lesson Planner or Rubric Generator. Review what it produces, revise it for your students\' actual context, and note how much time you saved compared to starting from a blank page.',
      toolSuggestion: 'MagicSchool AI covers rubric generation, lesson planning, IEP support, sub plan creation, and family communication — all in one teacher-facing dashboard. Brisk Teaching is a Chrome extension that adds AI-powered feedback directly inside Google Docs.',
      safetyNote: 'Never paste student names, IEP details, or identifiable information into any AI tool. Use role-based descriptions instead: "a 5th-grade student reading below grade level who benefits from sentence starters and visual organizers." You get useful output without putting student data at risk.',
      pd: PD.make
    },

    integrity: {
      topic: 'AI Use, Academic Integrity & Student Norms',
      quickAnswer: 'Reframe the conversation — AI use in education is a pedagogy and policy design problem, not just a discipline problem. The most effective response isn\'t better detection software: it\'s redesigning tasks so that authentic thinking is visible and unreplaceable.',
      tryTomorrow: 'Choose one upcoming assignment and add one step AI cannot replicate on its own: a student verbal defense of a key choice, a written reflection on their revision process, or a requirement to explain what they changed from their first draft — and why. Making thinking visible changes everything.',
      toolSuggestion: 'Class Companion prompts students with Socratic questions rather than producing answers — a genuinely useful tool for writing-heavy classes. Brisk Teaching can help you evaluate whether AI was used in submitted work, while keeping the conversation pedagogical rather than punitive.',
      safetyNote: 'Build a classroom AI use norm together with students — what\'s okay, what\'s not, and why. Co-created policies build ownership. ISTE and Common Sense Education both have strong frameworks to start from. If your district doesn\'t have an AI acceptable use policy yet, IU29 has a customizable template.',
      pd: PD.cultivating
    },

    elementary: {
      topic: 'AI for Elementary Classrooms (K–5)',
      quickAnswer: 'At the elementary level, the teacher is always in control. Use AI to prepare richer materials — not to put tools directly in front of young students. Think AI-generated story starters at different reading levels, discussion question sets, or sorting activity cards that you review and curate before sharing.',
      tryTomorrow: 'Use MagicSchool AI to generate 10 discussion questions at three different reading levels for a science or social studies concept your class is exploring this week. Pick the questions that fit your students best, use them in a think-pair-share, and notice which ones spark the best conversation.',
      toolSuggestion: 'MagicSchool AI is the best teacher-facing option for elementary planning and differentiation. For age-appropriate student conversations about AI itself, Common Sense Media\'s free Digital Citizenship curriculum includes K–5 lessons on what AI is and how it works.',
      safetyNote: 'Most AI tools are not designed for students under 13. At the elementary level, treat AI as a teacher tool, not a student-facing one. When you do talk to students about AI, keep it simple and honest: AI is a tool that learns from patterns — it\'s not thinking, and it makes mistakes. Their thinking always matters more.',
      pd: PD.cultivating
    },

    math: {
      topic: 'AI in Math: Reasoning & Problem Solving',
      quickAnswer: 'Use AI to deepen reasoning — not to produce answers. In math, the most powerful AI integration is when students use it to check their thinking process, generate similar problems, or explore "what if" variations on something they\'ve already solved. The AI is a thinking tool, not a calculator shortcut.',
      tryTomorrow: 'Give students a multi-step word problem to solve. After they work it, have them ask an AI tool to generate a similar problem with a different context or numbers. Students compare the two problems: What changed? What stayed the same? Which one would be harder to teach to a younger student — and why? This builds mathematical reasoning AI cannot replicate.',
      toolSuggestion: 'Khanmigo (by Khan Academy) is a teacher-controlled AI tutor specifically built for K–12 math reasoning. It asks guiding questions rather than handing students solutions. For teacher planning, Desmos Activity Builder helps design problem-based math experiences AI can support but not replace.',
      safetyNote: 'Teach students early that AI makes mathematical errors — especially on multi-step reasoning, fractions, and word problem interpretation. Verifying AI output with their own reasoning isn\'t a backup plan, it\'s core to the activity. "The AI got a different answer — let\'s find out why" is a stronger math lesson than any worksheet.',
      pd: PD.math
    },

    engineering: {
      topic: 'AI in Engineering Design & STEELS Science',
      quickAnswer: 'AI fits naturally into the engineering design process — especially the research, iteration, and reflection stages. Students can use it to explore what solutions already exist, investigate material properties, or generate criteria and constraints they haven\'t considered yet. The design decisions still belong entirely to the student.',
      tryTomorrow: 'At the start of a design challenge, have each team ask an AI tool: "What are three ways humans have already tried to solve this problem?" Teams compare the AI\'s response to their own brainstorm — noting overlap, gaps, and ideas worth investigating further before they start building. Research before building is a real engineering habit.',
      toolSuggestion: 'ChatGPT or Claude work well for engineering research and ideation when teachers structure the prompts. Pair AI-assisted research with Canva for student design documentation and presentation, so the thinking is captured in a form students own — not just a chat log.',
      safetyNote: 'AI-generated engineering information should always be verified against a second source. Build this into the activity explicitly: "The AI told us X — where\'s the evidence? What does a real engineer or science source say?" This is how engineers actually work, and it\'s a transferable habit that goes well beyond any single lesson.',
      pd: PD.engineering
    },

    differentiation: {
      topic: 'AI for Differentiation & Learner Support',
      quickAnswer: 'AI is particularly effective at generating differentiated versions of the same content — at different reading levels, with different scaffolds, or reformatted as visual summaries. It\'s a strong first draft tool. That said, it\'s a starting point, not a substitute for knowing your individual students.',
      tryTomorrow: 'Take an informational text your students are reading this week. Paste the key passage into MagicSchool AI\'s Text Leveler and ask it to rewrite it at three reading levels. Review each version for accuracy, adjust what needs adjusting, and use the versions that actually fit your learners. Then share one insight from the process with a co-teacher or interventionist.',
      toolSuggestion: 'MagicSchool AI\'s Differentiation Assistant and Text Leveler tools are built specifically for this purpose. IEP-adjacent planning tools are also included — but the privacy rule still applies unconditionally, regardless of tool.',
      safetyNote: 'Never paste student names, IEP goals, disability labels, or any identifiable information into an AI tool. Use role-based descriptions only: "a student with a reading IEP who benefits from chunked text and sentence frames." This protects student privacy while still producing useful, personalized output.',
      pd: PD.make
    },

    evaluation: {
      topic: 'Evaluating & Selecting EdTech Tools',
      quickAnswer: 'Before any new tool enters your classroom, run it through three questions: Does it protect student privacy? Does it require genuine higher-order thinking — or does it replace it? Does it make learning measurably better, or just faster and more convenient? If you can\'t answer all three confidently, slow down.',
      tryTomorrow: 'Pull up IU29\'s EdTech Tool Evaluation Rubric — or the ISTE Student Standards — and walk one tool you\'re currently curious about through the checklist. Then share your findings with a colleague. Two perspectives almost always catch what one misses, and the conversation itself builds good evaluation habits.',
      toolSuggestion: 'Common Sense Privacy (commonsense.org/education) gives school-safe privacy ratings for thousands of educational apps and tools. For AI-specific tools, check whether the platform has an educator or district tier — these typically offer better data controls than free consumer versions.',
      safetyNote: 'Data privacy is non-negotiable, and the work of checking belongs on the teacher and district side — not with students or parents. If a tool doesn\'t have a clear, readable privacy policy, doesn\'t say whether it sells student data, or requires account creation for students under 13 without parental consent, it\'s not ready for your classroom.',
      pd: PD.cultivating
    },

    fallback: {
      topic: 'EdTech & AI in the Classroom',
      quickAnswer: 'IU29 offers a range of EdTech and AI professional learning for Schuylkill County educators — from half-day AI literacy workshops to multi-session PLC cohorts. The best first step is almost always a direct conversation about what you\'re already doing and what you\'re trying to accomplish for your students.',
      tryTomorrow: 'Browse the IU29 EdTech & AI resource library on this page — there\'s a framework, a starter toolkit, workshop slides, and a digital citizenship lesson bank. You don\'t have to wait for a formal PD session. A 10-minute read of the AI Literacy Framework can shift how you think about every tool you already use.',
      toolSuggestion: 'Start with MagicSchool AI — it\'s free, teacher-focused, and designed to reduce planning time without adding complexity. It\'s consistently among the most practical AI tools available for K–12 educators, and it takes about 5 minutes to get a useful result.',
      safetyNote: 'Whenever you introduce new technology to your classroom, start as a learner first. Explore the tool yourself before asking students to use it. Notice what it does well and where it falls short — that firsthand perspective will make every student conversation and classroom decision better.',
      pd: PD.cultivating
    }

  };

  // =============================================
  // KEYWORD RULES — ordered most-specific first
  // =============================================

  var RULES = [
    { pattern: /cheat|integrit|academic honesty|plagiar|honor code|without cheat|ai polic|use ai without/i,           key: 'integrity'      },
    { pattern: /differenti|learner variab|iep|special ed|accommodat|diverse learner|inclusion|all learner/i,           key: 'differentiation' },
    { pattern: /evaluat|worth using|tool select|choosing.*tool|vett|trusted tool|data priva|data safe|tool.*safe/i,    key: 'evaluation'     },
    { pattern: /english\b|writing\b|ela\b|literacy|revision|revise\b|essay|paragraph|middle school english/i,          key: 'ela'            },
    { pattern: /planning|save time|workload|time.sav|lesson plan|prep time|teacher time|teacher planning/i,            key: 'planning'       },
    { pattern: /elementary|k-?2\b|k-?5\b|k-?3\b|k-?4\b|\bprimary\b|young learner|early grade|grades? [1-5]\b/i,       key: 'elementary'     },
    { pattern: /\bmath\b|mathemat|calculat|algebra|geometry|problem.solv|equation|fraction|number sense/i,             key: 'math'           },
    { pattern: /engineer|steels|science class|design challenge|prototype|robotics|coding|scratch\b|programming/i,      key: 'engineering'    }
  ];

  function matchResponse(query) {
    var q = query.trim();
    if (!q) return null;
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i].pattern.test(q)) {
        return RESPONSES[RULES[i].key];
      }
    }
    return RESPONSES.fallback;
  }

  // =============================================
  // CLIPBOARD HELPERS
  // =============================================

  function buildCopyText(response, queryText) {
    return [
      'EdTech Concierge — STEM@Skook29 / IU29',
      'Question: ' + queryText,
      '',
      'Topic: ' + response.topic,
      '',
      'Quick Answer:',
      response.quickAnswer,
      '',
      'Try This Tomorrow:',
      response.tryTomorrow,
      '',
      'Tool Suggestion:',
      response.toolSuggestion,
      '',
      'Safety & Digital Citizenship:',
      response.safetyNote,
      '',
      'Recommended IU29 PD: ' + response.pd.name,
      'Register: ' + response.pd.link
    ].join('\n');
  }

  function confirmCopy(btn) {
    var orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(function () { btn.textContent = orig; }, 2200);
  }

  function copyToClipboard(text, btn) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        confirmCopy(btn);
      }).catch(function () { fallbackCopy(text, btn); });
    } else {
      fallbackCopy(text, btn);
    }
  }

  function fallbackCopy(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); confirmCopy(btn); } catch (e) { /* silent */ }
    document.body.removeChild(ta);
  }

  // =============================================
  // RENDER RESPONSE
  // =============================================

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function truncate(str, max) {
    if (str.length <= max) return str;
    return str.slice(0, max - 1) + '…';
  }

  function relatedLibraryUrl(queryText) {
    var query = queryText.toLowerCase();
    var params = new URLSearchParams();
    if (query.includes('privacy') || query.includes('safe')) {
      params.set('collection', 'col-privacy-data');
    } else if (query.includes('cheat') || query.includes('assessment') || query.includes('integrity')) {
      params.set('collection', 'col-integrity-assessment');
    } else if (query.includes('differentiat') || query.includes('special education') || query.includes('accessib')) {
      params.set('collection', 'col-accessibility-sped');
    } else if (query.includes('elementary')) {
      params.set('grade', 'K-2');
    } else if (query.includes('planning') || query.includes('teacher')) {
      params.set('audience', 'Classroom Teacher');
    } else {
      params.set('category', 'AI Literacy Foundations');
    }
    return 'ai-edtech-resource-library.html?' + params.toString();
  }

  function renderResponse(outputEl, response, queryText) {
    var displayQuery = truncate(queryText.trim(), 90);

    outputEl.innerHTML =
      '<div class="cierge-card">' +

        // Header
        '<div class="cierge-header">' +
          '<span class="cierge-header-badge">EdTech Concierge</span>' +
          '<h3 class="cierge-topic">' + escapeHtml(response.topic) + '</h3>' +
          '<p class="cierge-query-echo">&ldquo;' + escapeHtml(displayQuery) + '&rdquo;</p>' +
        '</div>' +

        // Body
        '<div class="cierge-body">' +

          // Quick Answer — full width
          '<div class="cierge-field cierge-field-full">' +
            '<div class="cierge-field-label">Quick Answer</div>' +
            '<p class="cierge-field-text">' + escapeHtml(response.quickAnswer) + '</p>' +
          '</div>' +

          // Two-column: Try Tomorrow + Tool Suggestion
          '<div class="cierge-two-col">' +
            '<div class="cierge-field">' +
              '<div class="cierge-field-label">Try This Tomorrow</div>' +
              '<p class="cierge-field-text">' + escapeHtml(response.tryTomorrow) + '</p>' +
            '</div>' +
            '<div class="cierge-field">' +
              '<div class="cierge-field-label">Tool Suggestion</div>' +
              '<p class="cierge-field-text">' + escapeHtml(response.toolSuggestion) + '</p>' +
            '</div>' +
          '</div>' +

          // Safety note — full width, accent border
          '<div class="cierge-field cierge-field-safety">' +
            '<div class="cierge-field-label cierge-label-safety">Safety &amp; Digital Citizenship</div>' +
            '<p class="cierge-field-text">' + escapeHtml(response.safetyNote) + '</p>' +
          '</div>' +

        '</div>' +

        // PD Banner
        '<div class="cierge-pd-banner">' +
          '<div class="cierge-pd-eyebrow">Recommended IU29 Professional Learning</div>' +
          '<div class="cierge-pd-name">' + escapeHtml(response.pd.name) + '</div>' +
          '<p class="cierge-pd-context">' + escapeHtml(response.pd.context) + '</p>' +
          '<div class="cierge-pd-actions">' +
            '<a href="' + response.pd.link + '" target="_blank" rel="noopener noreferrer" ' +
              'class="btn btn-white btn-sm cierge-register-btn" ' +
              'aria-label="Register for ' + escapeHtml(response.pd.name) + '">' +
              'Register for This PD →' +
            '</a>' +
            '<button class="btn btn-outline-white btn-sm cierge-js-copy" type="button">' +
              'Copy Response' +
            '</button>' +
            '<a href="' + relatedLibraryUrl(queryText) + '" class="btn btn-outline-white btn-sm">' +
              'Browse Related Resources →' +
            '</a>' +
          '</div>' +
        '</div>' +

      '</div>';

    outputEl.hidden = false;

    // Wire copy button
    var copyBtn = outputEl.querySelector('.cierge-js-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        copyToClipboard(buildCopyText(response, queryText), copyBtn);
      });
    }
  }

  // =============================================
  // INIT
  // =============================================

  function init() {
    var inputEl  = document.getElementById('concierge-input');
    var askBtn   = document.getElementById('concierge-ask-btn');
    var outputEl = document.getElementById('concierge-output');
    var chips    = document.querySelectorAll('.concierge-chip');

    if (!inputEl || !askBtn || !outputEl) return;

    var activeChip = null;

    function ask(query) {
      if (!query.trim()) return;
      var response = matchResponse(query);
      if (!response) return;

      renderResponse(outputEl, response, query);

      setTimeout(function () {
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        outputEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
      }, 60);
    }

    function setActiveChip(chip) {
      if (activeChip) activeChip.classList.remove('active');
      activeChip = chip || null;
      if (activeChip) activeChip.classList.add('active');
    }

    askBtn.addEventListener('click', function () {
      setActiveChip(null);
      ask(inputEl.value);
    });

    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        setActiveChip(null);
        ask(inputEl.value);
      }
    });

    // Clear active chip when user types manually
    inputEl.addEventListener('input', function () {
      setActiveChip(null);
    });

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var prompt = chip.dataset.prompt;
        if (!prompt) return;
        inputEl.value = prompt;
        setActiveChip(chip);
        ask(prompt);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
