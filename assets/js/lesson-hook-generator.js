(function () {
  'use strict';

  // =============================================
  // DATA BANK
  // =============================================

  var data = {

    titles: {
      forces: {
        k2:   ['Push It, Pull It!', 'What Makes It Move?', 'Roll, Spin, Stop!'],
        g35:  ['Crash Test Engineers', 'The Marble Run Challenge', 'How Far Will It Go?'],
        g68:  ['Building a Better Bumper', "Newton's Laws on Wheels", 'Speed, Force & Impact'],
        g912: ['Engineering Safer Roads', 'Vehicle Collision Analysis', 'The Physics of Protection']
      },
      eco: {
        k2:   ['Who Eats Who?', 'Home Sweet Habitat', 'Our Neighborhood Food Web'],
        g35:  ['Food Web Engineers', 'Ecosystem in a Bottle', 'Predator & Prey Balance'],
        g68:  ['When Ecosystems Break', 'Invasive Species Design Challenge', 'Biodiversity Counts'],
        g912: ['Trophic Cascades & Human Impact', 'Rewilding a Local Habitat', 'Ecosystem Services Analysis']
      },
      weather: {
        k2:   ["What's the Weather Today?", 'Rain, Cloud, Sun — What Comes Next?', 'Weather Watchers'],
        g35:  ['Be a Meteorologist!', 'Build a Mini Weather Station', 'Storm Warning Systems'],
        g68:  ['Modeling Extreme Weather', 'The Urban Heat Island', 'Climate Pattern Investigators'],
        g912: ['Climate Attribution Analysis', 'Local Climate Risk Assessment', 'Engineering Climate Resilience']
      },
      earth: {
        k2:   ['Dirt Detectives', 'Rocks, Soil & Water', "What's Under Our Feet?"],
        g35:  ['Rock Cycle Remix', 'Erosion in Action', 'Earth Layers Investigation'],
        g68:  ['Plate Tectonics Design Sprint', 'Watershed Mapping Challenge', 'Erosion & Deposition Model'],
        g912: ['Geologic Time & Change', 'Local Watershed Health Study', 'Landform Transformation Analysis']
      },
      energy: {
        k2:   ['Where Does Energy Come From?', 'Light, Heat, Sound!', 'Energy Is Everywhere'],
        g35:  ['Solar Oven Challenge', 'The Energy Transfer Challenge', 'Power Up!'],
        g68:  ['Designing a Mini Wind Turbine', 'Energy Transformation Tracker', 'The Renewable Energy Sprint'],
        g912: ['Community Energy Audit', 'Renewable vs. Grid Analysis', 'Engineering a Zero-Carbon Solution']
      },
      engineering: {
        k2:   ['Can You Build a Bridge?', 'Tower Challenge!', 'Design It, Test It, Fix It!'],
        g35:  ['Egg Drop Engineers', 'Bridge Load Testing', 'Build Your Best Solution'],
        g68:  ['Solving a Real School Problem', 'Iterative Design Sprint', 'Engineering Under Constraints'],
        g912: ['Human-Centered Design Challenge', 'Community Problem Solving Sprint', 'Systems Thinking Design Project']
      },
      robotics: {
        k2:   ['Make the Robot Move!', 'Coding Commands', 'Robots Do What We Say'],
        g35:  ['Code a Solution', 'Robots in the Real World', 'The Debugging Challenge'],
        g68:  ['Automate a Task', 'Algorithm Design Sprint', 'Sensor & Response Coding Challenge'],
        g912: ['Build an Autonomous Solution', 'AI-Assisted Code Project', 'Robotics Systems Design']
      },
      enviro: {
        k2:   ['Take Care of Our Earth', 'Where Does Trash Go?', 'Clean Water, Clean Air'],
        g35:  ['Our Environmental Footprint', 'Reduce, Reuse, Redesign', 'Local Environmental Problem Solvers'],
        g68:  ['Environmental Justice Investigation', 'Carbon Footprint Analysis', 'Designing for Sustainability'],
        g912: ['Community Environmental Audit', 'Policy & Science: What Should We Do?', 'Environmental Action Project']
      }
    },

    questions: {
      forces: {
        k2:   'What happens when you push something really hard? What about really softly? Can you find something in the room that moves when you push it — and something that does not?',
        g35:  'If you wanted to protect something fragile from a crash, how would you design the container around it — and what would you need to test to know if it worked?',
        g68:  'Why do cars have crumple zones? How do engineers decide how much force a structure needs to absorb — and what happens when they get that calculation wrong?',
        g912: 'How do engineers use crash test data to design safety systems that protect people across different body types, ages, and vehicle speeds — and where does the data come from?'
      },
      eco: {
        k2:   'What do you think would happen if all the rabbits in a forest disappeared overnight? Who would be happy about it — and who would be in trouble?',
        g35:  'If you removed one organism from a food web, how many other living things would be affected? How could you show that with a diagram?',
        g68:  'What happens to an ecosystem when a new species arrives that nothing else has evolved to control? Can you think of a real example from Pennsylvania?',
        g912: 'How do human land-use decisions change the services that ecosystems provide — like clean water, pollination, and flood control — and who bears the cost when those services disappear?'
      },
      weather: {
        k2:   'Why does it rain on some days and not others? What clues in the sky might help you predict what is coming — before you even check the weather app?',
        g35:  'How do meteorologists predict weather before it happens? What kinds of data do they collect — and why does more data make better predictions?',
        g68:  'Why are some communities hit harder by extreme weather events than others, even when they are in the same region? What makes a neighborhood more or less vulnerable?',
        g912: 'How do climate scientists connect a specific storm or heat wave to broader climate change patterns — and what does it mean when they say there is "attribution uncertainty"?'
      },
      earth: {
        k2:   'What do you think is happening under the ground right now, even though we cannot see it? If we dug down very, very far — what would we find?',
        g35:  'How do rivers shape the land over time — and what happens when humans build dams or pave over riverbanks and change how rivers flow?',
        g68:  'How do scientists know what happened on Earth millions of years ago, when no one was there to observe it? What kinds of evidence do they use — and how confident can they be?',
        g912: 'How do geologic processes that move slowly over millions of years interact with the fast-paced environmental changes humans are creating today — and where do those timescales collide?'
      },
      energy: {
        k2:   'When you turn on a lamp, where do you think that energy comes from before it gets to your house? Can you trace it all the way back to where it started?',
        g35:  'How does energy from the sun end up in the food we eat? What are all the steps it takes to get from sunlight to your lunch?',
        g68:  'What tradeoffs do communities face when choosing between renewable and non-renewable energy sources — and who usually gets to make that decision?',
        g912: 'If your school wanted to reduce its energy-related carbon footprint, where would you start — and how would you measure whether the changes you made actually worked?'
      },
      engineering: {
        k2:   'What would you build if you wanted to help someone who has trouble carrying heavy things? What materials would you use — and how would you know if it worked?',
        g35:  'When your first design does not work, how do engineers decide what to change — and what do they keep the same? Why is it important not to change everything at once?',
        g68:  'How do engineers balance cost, safety, and performance when they cannot have all three at once? What gets sacrificed — and who decides?',
        g912: 'How do the needs of users who are different from you — in age, ability, language, or background — change the way you design a solution? What do you miss when you only design for people like yourself?'
      },
      robotics: {
        k2:   'What jobs do you think robots could help people with? What would a robot need to know — and what would it need to be able to see or feel — to do that job well?',
        g35:  'What is the difference between giving a robot exact step-by-step instructions and teaching it to make decisions on its own? Which is harder — and why?',
        g68:  'How does breaking a big problem into small steps help programmers write better code and catch mistakes faster? Can you think of a time that approach would have helped you?',
        g912: 'What are the ethical limits of automation — and how should engineers and society decide which tasks humans should always stay in control of, no matter how capable the machine becomes?'
      },
      enviro: {
        k2:   'Where does the water go when rain falls in our schoolyard? Follow it in your mind — where does it end up by the end of the day?',
        g35:  'What is one thing your school or neighborhood does that creates an environmental problem — and what is one change that could reduce that problem without costing a lot?',
        g68:  'Why do environmental problems often affect some communities more than others, even when everyone shares the same air, water, and land? What makes that fair or unfair?',
        g912: 'How do you use both scientific evidence and community values to make a decision about an environmental problem — and what happens when the science and the community disagree?'
      }
    },

    activities: {
      forces: {
        quick:     'Students watch a slow-motion video of a car crash and then sketch and label where the energy goes during the collision. Pair-share: "What surprised you?" Debrief with one whole-class question about force and motion.',
        hands:     'Students build a simple "car" from craft materials, crash it into a wall using different padding materials (foam, bubble wrap, cardboard), and measure how far a marble "passenger" travels inside after impact. Record and compare results.',
        invest:    'Students drop identical balls from three different heights onto playdough and measure the depth of the impression each leaves. They use the data to describe the relationship between height, speed, and impact force — and make a prediction about a fourth height.',
        sprint:    'Teams have 20 minutes and a limited supply of materials to build the best crash-absorbing bumper for a marble car. They crash-test it, measure results, iterate once with new information, and present their final design with data.',
        realworld: 'Students examine real safety data comparing seatbelt injuries and non-seatbelt fatalities, then design a data display — chart, infographic, or argument poster — that communicates what the evidence says to a specific audience (parents, other students, a city council).'
      },
      eco: {
        quick:     'Students receive a role card (sun, plant, rabbit, hawk, decomposer, bacteria) and physically form a food web using yarn. One "species" drops out — the class predicts and discusses the ripple effects. Debrief: what surprised you about how connected everything was?',
        hands:     'Students build a closed mini-ecosystem in a clear plastic bottle using soil, small plants, and moisture. They seal it, observe daily for two weeks, and record changes — tracking what shifts as the system runs without any input from the outside.',
        invest:    'Students research a real invasive species currently documented in Pennsylvania, trace its spread using public data sources, and identify which native organisms are most at risk. They present findings as an ecological impact brief.',
        sprint:    'Teams design a habitat restoration plan for a degraded local ecosystem — choosing which organisms to reintroduce based on their ecological role — then defend their choices to the class using evidence from their research. One team plays skeptic.',
        realworld: 'Students examine before-and-after satellite images of a local landscape and identify ecosystem changes visible over 10–20 years. They write a short cause-and-effect brief explaining what happened, what drove it, and what it means for people who live there.'
      },
      weather: {
        quick:     'Students examine two weather maps from a real local event — one taken the day before a significant storm and one taken the day after — and reconstruct what they think the weather looked like in between. Compare predictions to actual data.',
        hands:     'Students build a simple barometer and thermometer from household materials, then collect readings daily for one week. They compare their homemade instrument data to the official forecast and investigate where and why their readings differ.',
        invest:    'Students access 10 years of local precipitation data from NOAA, identify the three most extreme weather events in that dataset, and look for patterns in the atmospheric conditions that preceded each. They document findings in a short data analysis report.',
        sprint:    'Teams design an early warning system for a specific extreme weather type (flooding, heat wave, severe thunderstorm) — specifying what data to collect, how often, what triggers an alert, and how the warning reaches the people who need it most.',
        realworld: 'Students analyze a real community affected by flooding and design one infrastructure change that would reduce harm to the most vulnerable residents. They must show cost, expected benefit, and who bears risk if the change is not made.'
      },
      earth: {
        quick:     'Students examine "core samples" — created from layered materials in clear tubes or cups — and try to reconstruct what events happened over time, from oldest layer to newest. They compare interpretations across groups and discuss what evidence was most useful.',
        hands:     'Students use sand, soil, and water in a stream table to model erosion in action, then test what happens when they add a "dam," a "root system" (sponge material), or a "concrete channel" to change how water moves. They record and compare results.',
        invest:    'Students use topographic maps and publicly available erosion data to determine which part of a local watershed is most at risk for significant erosion events — and write a short brief explaining their determination and the evidence behind it.',
        sprint:    'Teams design a landform stabilization solution for a simulated eroding hillside using only the provided materials. They test the design by simulating rainfall, measure the amount of erosion prevented, refine once, and present results with their reasoning.',
        realworld: 'Students examine a local storm drain map and trace the full path rainwater takes from the schoolyard to its final destination. They identify one point in the system where improved earth management would reduce downstream flooding — and explain the evidence.'
      },
      energy: {
        quick:     'Students trace the complete energy path from a solar panel to a lit light bulb — drawing each transformation step, labeling what kind of energy is present at each stage, and noting where energy is lost to heat. Debrief: where do we lose the most?',
        hands:     'Students build a solar oven using a pizza box, aluminum foil, and plastic wrap, then test it against an unmodified box control. They measure temperature inside each over 20 minutes and calculate how much more energy the solar design captured.',
        invest:    'Students collect and analyze the school utility bills for the past 12 months, identify the highest-energy-use months, hypothesize what drives those patterns, and design a one-question survey to test their hypothesis with school staff.',
        sprint:    'Teams build a mini wind turbine from limited materials and test how much weight it can lift using fan power at two different fan speeds. They iterate once after seeing their initial results, then compare final performance data across all teams.',
        realworld: 'Students map energy use in their school (or home), identify the top three changes that would produce the greatest energy reduction, and calculate an estimated impact using school utility data or publicly available energy consumption averages.'
      },
      engineering: {
        quick:     'Students receive a strict challenge: use only 3 provided materials, build something in 5 minutes that keeps a marble from rolling off a table edge. After testing, they identify what they would change with two more minutes and one more material — and why.',
        hands:     'Students build a container to protect a raw egg from a 2-meter drop using only the provided materials and one roll of tape. After testing, they analyze what failed and why, then iterate once with the same materials and a new design strategy.',
        invest:    'Students observe a real problem in their school or community, conduct three brief "user interviews" to understand how different people experience that problem, and document what they learned — without proposing any solutions yet.',
        sprint:    'Teams move through a compressed full design sprint — empathize (5 min), define the problem (5 min), ideate (10 min), prototype (15 min), test (10 min) — then share their biggest learning from each phase and what they would do differently with more time.',
        realworld: 'Students identify a real accessibility barrier in their school — a heavy door, a confusing sign, a hard-to-reach shelf — and design a low-cost solution that addresses the needs of the person most affected. They present it to someone who actually faces the barrier.'
      },
      robotics: {
        quick:     'Students write precise step-by-step instructions to direct a classmate from the classroom door to a specific desk — without using any directional words like "left," "right," "that way," or "over there." They test, debug, and reflect: what made exact instruction so hard?',
        hands:     'Students program a robot or on-screen turtle to navigate a taped course on the floor. When the robot fails, they identify exactly which instruction caused the problem, fix only that line, and test again — keeping a running log of every bug they found and fixed.',
        invest:    'Students trace the algorithm behind a familiar app or device they use daily — autocorrect, a social media feed, a recommendation engine — mapping the inputs, decisions, and outputs the system uses. They identify one decision the algorithm makes that a human might make differently.',
        sprint:    'Teams design an automated solution to a real school problem using either physical robots or a Scratch simulation. They prototype in 40 minutes, live-test in front of the class, and present their biggest design decision — including what they gave up to make it work.',
        realworld: 'Students research a specific job being automated in their region, identify exactly what the robot or AI does well and where it still fails, and build a written argument for where human skill and judgment still matter — and why that matters for their own future.'
      },
      enviro: {
        quick:     'Students take a 10-minute environmental audit walk around the schoolyard or building, noting five things that could be more sustainable. Back in class, they rank the five by potential impact and by ease of change — then identify which one they would tackle first, and why.',
        hands:     'Students build a three-stage water filter from sand, gravel, and activated charcoal and test it on a sample of muddy water. They compare filtered results to an unfiltered control, measure clarity, and document what each layer removed — and what it did not.',
        invest:    'Students use publicly available data to map two environmental quality indicators (air quality, green space access, flood risk, or water quality) across their county, then describe any patterns they find and generate a hypothesis about what is driving them.',
        sprint:    'Teams design a zero-waste lunch campaign for the school — identifying what gets wasted, why it gets wasted, and what one systems-level change would have the biggest measurable impact. They present their campaign plan with a proposed way to measure success.',
        realworld: 'Students identify one environmental issue directly affecting their community — flooding, air quality, urban heat — research its causes using at least two sources, and draft a one-page evidence brief addressed to a specific local official or decision-maker.'
      }
    },

    steels: {
      forces:      'Students engage in practices of planning and carrying out investigations, using mathematical and computational thinking to describe force-and-motion relationships, and constructing explanations grounded in data — directly addressing Physical Science STEELS standards around forces, motion, and energy transfer at their grade band.',
      eco:         'Students analyze and interpret ecological data, engage in evidence-based argumentation about cause and effect in biological systems, and apply the crosscutting concepts of stability, change, and interdependence — aligning with Life Science STEELS standards for ecosystems, biodiversity, and human impact on living systems.',
      weather:     'Students develop and use models, analyze patterns in environmental data, and construct explanations for Earth system phenomena — directly addressing STEELS Earth and Space Science standards for weather, climate, and the interactions between human activity and Earth systems.',
      earth:       'Students construct models of Earth processes, engage in data analysis and interpretation across geologic timescales, and apply the crosscutting concepts of scale, proportion, and systems — aligning with Earth and Space Science STEELS standards for Earth materials, surface processes, and Earth history.',
      energy:      'Students plan and carry out investigations around energy transfer and transformation, apply mathematical reasoning to energy relationships, and engage with engineering practices around efficiency and design tradeoffs — directly addressing Physical Science and Engineering Design STEELS standards for energy systems and conservation.',
      engineering: 'Students engage in the complete engineering design process — defining problems with criteria and constraints, generating and evaluating solutions, building and testing prototypes, and iterating based on evidence — addressing STEELS Engineering, Technology, and Application of Science standards at their grade band.',
      robotics:    'Students develop and use computational models, engage in algorithmic thinking and debugging, and apply engineering design practices to real problems — addressing STEELS standards for engineering and technology, including the role of automation, artificial intelligence, and human decision-making in designed systems.',
      enviro:      'Students apply crosscutting concepts of cause and effect, systems thinking, and scale to real-world environmental questions, engage in data collection and analysis, and connect scientific evidence to civic and social contexts — aligning with STEELS Earth and Space Science and Engineering standards for sustainability, human impact, and environmental stewardship.'
    },

    products: {
      quick:     'A labeled sketch or diagram, a written or verbal "What I noticed / What I wonder" reflection with at least two observations, and one testable question for further investigation.',
      hands:     'A tested physical model or prototype, a completed data recording sheet with measurements and observations from at least two trials, and a short written conclusion connecting their results to the driving science concept.',
      invest:    'A data display (graph, table, map, or chart), a written analysis interpreting the patterns found in their data, and a claim supported by at least two pieces of specific evidence drawn from their investigation.',
      sprint:    'A physical or digital prototype, a one-page design record documenting the problem, key decisions, tradeoffs, and test results, and a brief class presentation of what they built, what failed, and what they learned.',
      realworld: 'A written brief, argument poster, or slide deck that clearly identifies the real problem, presents evidence, proposes a specific and realistic solution, and addresses at least one tradeoff or limitation of their proposal.'
    },

    extensions: {
      forces:      'Students prompt an AI chatbot to explain how engineers design crumple zones, then compare the AI\'s explanation to real automotive safety engineering resources. They document one thing the AI explained well and one place where the AI oversimplified or missed a key nuance a real engineer would not.',
      eco:         'Students ask an AI tool to predict what would happen if a specific invasive species were removed from their local ecosystem, then compare the AI\'s prediction to what ecologists actually observed in a real restoration project. They evaluate: where did the AI get it right, and where did it miss what happened on the ground?',
      weather:     'Students use an AI assistant to help interpret climate data from their local region, then fact-check the AI\'s analysis against NOAA or EPA primary sources. They create a short "accuracy audit" noting where the AI was correct, where it oversimplified, and one thing it got flat wrong.',
      earth:       'Students ask an AI tool to describe the geology behind a specific local landform or event (a nearby mountain range, a historic flood, a local quarry), then compare the response to a primary geological survey. They identify at least one claim the AI made that they cannot verify — and explain how they would find out.',
      energy:      'Students use an AI assistant to help identify the top three energy-saving changes for a school or home, then evaluate whether those suggestions are realistic for their actual context — given their climate, building type, and budget. They revise the AI\'s recommendations with local knowledge the AI did not have.',
      engineering: 'Students input their design constraints into an AI tool and ask it to generate five solution ideas. They compare those ideas to their own designs — rating each AI suggestion on feasibility, creativity, and fit — and explain in writing which AI idea was most useful and why, and which was least useful and why.',
      robotics:    'Students use an AI coding assistant to generate one section of their program or algorithm, then carefully read and test the code the AI produced — checking whether it actually does what they intended. They document every change they had to make to the AI\'s output and explain why the original version did not work.',
      enviro:      'Students use an AI tool to research the environmental issue they identified in class, then conduct a source audit of the AI\'s claims — verifying each against at least one credible scientific report. They document in writing at least one thing the AI got right, one thing it got wrong, and one thing it presented as a fact that is actually still debated among scientists.'
    }
  };

  // =============================================
  // GENERATOR CORE
  // =============================================

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generate(grade, topic, style) {
    return {
      title:     pick(data.titles[topic][grade]),
      question:  data.questions[topic][grade],
      activity:  data.activities[topic][style],
      steels:    data.steels[topic],
      product:   data.products[style],
      extension: data.extensions[topic]
    };
  }

  // =============================================
  // RENDER
  // =============================================

  function renderOutput(result, outputEl) {
    outputEl.innerHTML =
      '<div class="hook-output-card">' +
        '<div class="hook-output-header">' +
          '<span class="hook-output-tag">Generated Lesson Hook</span>' +
          '<h3 class="hook-output-title">' + result.title + '</h3>' +
        '</div>' +
        '<div class="hook-output-body">' +
          '<div class="hook-result-field">' +
            '<div class="hook-result-label">Opening Question</div>' +
            '<p class="hook-result-text">' + result.question + '</p>' +
          '</div>' +
          '<div class="hook-result-field">' +
            '<div class="hook-result-label">Hands-On Activity</div>' +
            '<p class="hook-result-text">' + result.activity + '</p>' +
          '</div>' +
          '<div class="hook-result-field">' +
            '<div class="hook-result-label">STEELS Connection</div>' +
            '<p class="hook-result-text">' + result.steels + '</p>' +
          '</div>' +
          '<div class="hook-result-field">' +
            '<div class="hook-result-label">Possible Student Product</div>' +
            '<p class="hook-result-text">' + result.product + '</p>' +
          '</div>' +
          '<div class="hook-result-field hook-result-accent">' +
            '<div class="hook-result-label">AI / EdTech Extension</div>' +
            '<p class="hook-result-text">' + result.extension + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="hook-output-actions">' +
          '<button class="btn btn-secondary btn-sm hook-js-another" type="button">Generate Another</button>' +
          '<button class="btn btn-primary btn-sm hook-js-copy" type="button">Copy Idea</button>' +
        '</div>' +
        '<p class="hook-disclaimer">This demo uses prebuilt planning logic, not live student data or an external AI API.</p>' +
      '</div>';
  }

  function buildCopyText(result) {
    return [
      'STEELS Lesson Hook Generator — STEM@Skook29 / IU29',
      '',
      'Title: ' + result.title,
      '',
      'Opening Question:',
      result.question,
      '',
      'Hands-On Activity:',
      result.activity,
      '',
      'STEELS Connection:',
      result.steels,
      '',
      'Possible Student Product:',
      result.product,
      '',
      'AI / EdTech Extension:',
      result.extension
    ].join('\n');
  }

  // =============================================
  // INIT
  // =============================================

  function initGenerator(wrapperSelector) {
    var wrapper = document.querySelector(wrapperSelector);
    if (!wrapper) return;

    var gradeEl    = wrapper.querySelector('[data-hook-grade]');
    var topicEl    = wrapper.querySelector('[data-hook-topic]');
    var styleEl    = wrapper.querySelector('[data-hook-style]');
    var generateEl = wrapper.querySelector('[data-hook-generate]');
    var outputEl   = wrapper.querySelector('[data-hook-output]');

    if (!gradeEl || !topicEl || !styleEl || !generateEl || !outputEl) return;

    var lastResult = null;

    function doGenerate() {
      lastResult = generate(gradeEl.value, topicEl.value, styleEl.value);
      renderOutput(lastResult, outputEl);
      outputEl.hidden = false;

      // Wire buttons inside freshly rendered output
      var anotherBtn = outputEl.querySelector('.hook-js-another');
      var copyBtn    = outputEl.querySelector('.hook-js-copy');

      if (anotherBtn) {
        anotherBtn.addEventListener('click', doGenerate);
      }

      if (copyBtn) {
        copyBtn.addEventListener('click', function () {
          if (!lastResult) return;
          var text = buildCopyText(lastResult);

          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
              confirmCopy(copyBtn);
            }).catch(function () {
              fallbackCopy(text, copyBtn);
            });
          } else {
            fallbackCopy(text, copyBtn);
          }
        });
      }

      // Scroll output into view gently
      setTimeout(function () {
        outputEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 60);
    }

    generateEl.addEventListener('click', doGenerate);
  }

  function confirmCopy(btn) {
    var original = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(function () { btn.textContent = original; }, 2200);
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
  // BOOT — works whether script loads sync or async
  // =============================================

  function boot() {
    initGenerator('.hook-generator-featured');
    initGenerator('.hook-generator-full');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

}());
