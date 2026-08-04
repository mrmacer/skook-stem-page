(function () {
  'use strict';

  // =============================================
  // DISTRICT DATA
  // All 14 IU29 member districts + non-public partners.
  // Programs and competitions reflect what STEM@Skook29
  // offers/makes available to all districts. Current and
  // future ecosystem connections may include all items shown.
  // =============================================

  var DISTRICTS = [

    // ---- Northern tier ----
    {
      id: 'north-schuylkill',
      name: 'North Schuylkill',
      type: 'Public School District',
      region: 'Northern',
      website: 'https://www.northschuylkill.net/',
      pub: true,
      programs: [
        'STEELS Standards Implementation Support',
        'EdTech & AI Professional Learning',
        'Teacher Coaching & Instructional PD',
        'STEM Summer Institutes (Act 48 Eligible)'
      ],
      competitions: [
        'Keystone STEM Competition',
        'STEM Design Challenge',
        'Sea-Air-Land Robotics Challenge',
        'Media & Design Competition'
      ],
      teacherSupport: [
        'Standards unpacking and curriculum mapping',
        'Instructional coaching available on request',
        'AI Literacy for Educators workshop access'
      ],
      community: [
        'Regional STEM ecosystem partnership via IU29',
        'WSCAM industry partner connection potential',
        'Workforce alignment and career pathway support'
      ],
      next: 'Connect North Schuylkill student teams with STEM competitions and pursue AI literacy PD to build teacher confidence across grade bands.'
    },

    {
      id: 'mahanoy-area',
      name: 'Mahanoy Area',
      type: 'Public School District',
      region: 'Northern',
      website: 'https://www.mabears.net/',
      pub: true,
      programs: [
        'STEELS Standards Implementation Support',
        'EdTech & AI Professional Learning',
        'Teacher Coaching & Instructional PD',
        'STEM Summer Institutes (Act 48 Eligible)'
      ],
      competitions: [
        'Keystone STEM Competition',
        'STEM Design Challenge',
        'Sea-Air-Land Robotics Challenge',
        'What\'s So Cool About Manufacturing? (WSCAM)'
      ],
      teacherSupport: [
        'Standards unpacking and curriculum mapping',
        'Instructional coaching available on request',
        'Cross-district PLC participation'
      ],
      community: [
        'Regional STEM ecosystem partnership via IU29',
        'WSCAM student video competition history',
        'Local industry workforce connection opportunities'
      ],
      next: 'Expand student competition participation and leverage WSCAM connections to showcase local industry to Mahanoy Area students.'
    },

    {
      id: 'shenandoah-valley',
      name: 'Shenandoah Valley',
      type: 'Public School District',
      region: 'Northern',
      website: 'https://www.svbluedevils.org/',
      pub: true,
      programs: [
        'STEELS Standards Implementation Support',
        'EdTech & AI Professional Learning',
        'Teacher Coaching & Instructional PD',
        'STEM Summer Institutes (Act 48 Eligible)'
      ],
      competitions: [
        'Keystone STEM Competition',
        'STEM Design Challenge',
        'Sea-Air-Land Robotics Challenge',
        'Media & Design Competition'
      ],
      teacherSupport: [
        'Standards unpacking and curriculum mapping',
        'Instructional coaching available on request',
        'District PD day facilitation available'
      ],
      community: [
        'Regional STEM ecosystem partnership via IU29',
        'Community workforce alignment opportunities',
        'Partnership with local organizations and nonprofits'
      ],
      next: 'Build community-workforce connections through STEM@Skook29 and introduce student teams to regional competition opportunities.'
    },

    {
      id: 'tamaqua-area',
      name: 'Tamaqua Area',
      type: 'Public School District',
      region: 'Northeastern',
      website: 'https://www.tamaqua.k12.pa.us/',
      pub: true,
      programs: [
        'STEELS Standards Implementation Support',
        'EdTech & AI Professional Learning',
        'Teacher Coaching & Instructional PD',
        'STEM Summer Institutes (Act 48 Eligible)'
      ],
      competitions: [
        'Keystone STEM Competition',
        'STEM Design Challenge',
        'Sea-Air-Land Robotics Challenge',
        'What\'s So Cool About Manufacturing? (WSCAM)'
      ],
      teacherSupport: [
        'Standards unpacking and curriculum mapping',
        'EdTech integration coaching',
        'Cross-district PLC participation'
      ],
      community: [
        'Regional STEM ecosystem partnership via IU29',
        'WSCAM industry connection pipeline',
        'Higher ed and workforce alignment pathways'
      ],
      next: 'Grow the EdTech and competition pipeline at Tamaqua Area and connect industry partners through the WSCAM ecosystem.'
    },

    // ---- Central tier ----
    {
      id: 'williams-valley',
      name: 'Williams Valley',
      type: 'Public School District',
      region: 'Central',
      website: 'https://www.wvschools.net/',
      pub: true,
      programs: [
        'STEELS Standards Implementation Support',
        'EdTech & AI Professional Learning',
        'Teacher Coaching & Instructional PD',
        'STEM Summer Institutes (Act 48 Eligible)'
      ],
      competitions: [
        'Keystone STEM Competition',
        'STEM Design Challenge',
        'Sea-Air-Land Robotics Challenge',
        'Environmental Literacy Challenges'
      ],
      teacherSupport: [
        'Standards unpacking and curriculum mapping',
        'Environmental science STEELS alignment support',
        'Act 48-eligible workshops available'
      ],
      community: [
        'Regional STEM ecosystem partnership via IU29',
        'Environmental and natural resource partner connections',
        'Rural workforce pathway opportunities'
      ],
      next: 'Leverage environmental literacy strengths at Williams Valley by connecting STEELS science instruction to local landscape and industry.'
    },

    {
      id: 'saint-clair-area',
      name: 'Saint Clair Area',
      type: 'Public School District',
      region: 'Central',
      website: 'https://www.saintclairsd.org/',
      pub: true,
      programs: [
        'STEELS Standards Implementation Support',
        'EdTech & AI Professional Learning',
        'Teacher Coaching & Instructional PD',
        'STEM Summer Institutes (Act 48 Eligible)'
      ],
      competitions: [
        'Keystone STEM Competition',
        'STEM Design Challenge',
        'Sea-Air-Land Robotics Challenge',
        'Media & Design Competition'
      ],
      teacherSupport: [
        'Standards unpacking and curriculum mapping',
        'Personalized instructional coaching',
        'Smaller-district, high-touch support model'
      ],
      community: [
        'Regional STEM ecosystem partnership via IU29',
        'Local community and civic organization engagement',
        'Workforce alignment through IU29 network'
      ],
      next: 'Build a targeted, high-impact STEM program model at Saint Clair with focused competition entry and teacher coaching support.'
    },

    {
      id: 'minersville-area',
      name: 'Minersville Area',
      type: 'Public School District',
      region: 'Central',
      website: 'https://www.battlinminers.com/',
      pub: true,
      programs: [
        'STEELS Standards Implementation Support',
        'EdTech & AI Professional Learning',
        'Teacher Coaching & Instructional PD',
        'Make@Skook29 Makerspace Access'
      ],
      competitions: [
        'Keystone STEM Competition',
        'STEM Design Challenge',
        'Sea-Air-Land Robotics Challenge',
        'What\'s So Cool About Manufacturing? (WSCAM)'
      ],
      teacherSupport: [
        'Engineering Design and Maker ed support',
        'Instructional coaching available on request',
        'STEELS curriculum alignment sessions'
      ],
      community: [
        'Regional STEM ecosystem partnership via IU29',
        'Mining and industrial heritage workforce connections',
        'WSCAM industry partner network access'
      ],
      next: 'Connect Minersville\'s industrial heritage with engineering design and WSCAM storytelling opportunities for students.'
    },

    {
      id: 'pottsville-area',
      name: 'Pottsville Area',
      type: 'Public School District',
      region: 'Central',
      website: 'https://www.pottsville.k12.pa.us/',
      pub: true,
      programs: [
        'STEELS Standards Implementation Support',
        'EdTech & AI Professional Learning',
        'Teacher Coaching & Instructional PD',
        'Chief Science Officers student leadership program',
        'Make@Skook29 Makerspace Access'
      ],
      competitions: [
        'Keystone STEM Competition',
        'STEM Design Challenge',
        'Sea-Air-Land Robotics Challenge',
        'What\'s So Cool About Manufacturing? (WSCAM)',
        'Media & Design Competition'
      ],
      teacherSupport: [
        'Full suite of IU29 STEELS and EdTech PD',
        'Coaching and co-planning support',
        'AI Literacy for Educators workshops'
      ],
      community: [
        'County seat — anchor district for regional partnerships',
        'Healthcare, tech, and business sector connections',
        'WSCAM industry partner and higher ed engagement'
      ],
      next: 'As the county\'s anchor district, Pottsville Area has broad access to the full STEM@Skook29 ecosystem — competitions, PD, and community partnerships.'
    },

    // ---- Southern / Southwest tier ----
    {
      id: 'schuylkill-haven',
      name: 'Schuylkill Haven',
      type: 'Public School District',
      region: 'Central-South',
      website: 'https://www.haven.k12.pa.us/',
      pub: true,
      programs: [
        'STEELS Standards Implementation Support',
        'EdTech & AI Professional Learning',
        'Teacher Coaching & Instructional PD',
        'Chief Science Officers student leadership program'
      ],
      competitions: [
        'Keystone STEM Competition',
        'STEM Design Challenge',
        'Sea-Air-Land Robotics Challenge',
        'Media & Design Competition'
      ],
      teacherSupport: [
        'Standards unpacking and curriculum alignment',
        'Career & technical education integration support',
        'Act 48-eligible workshop access'
      ],
      community: [
        'Regional STEM ecosystem partnership via IU29',
        'Schuylkill River and watershed environmental connections',
        'Local business and workforce partner outreach'
      ],
      next: 'Support Chief Science Officers at Schuylkill Haven as they develop student-led STEM Action Plans for their school and community.'
    },

    {
      id: 'pine-grove-area',
      name: 'Pine Grove Area',
      type: 'Public School District',
      region: 'Southern',
      website: 'https://www.pgasd.com/',
      pub: true,
      programs: [
        'STEELS Standards Implementation Support',
        'EdTech & AI Professional Learning',
        'Teacher Coaching & Instructional PD',
        'Environmental Literacy Programming'
      ],
      competitions: [
        'Keystone STEM Competition',
        'STEM Design Challenge',
        'Sea-Air-Land Robotics Challenge',
        'Environmental Literacy Challenges'
      ],
      teacherSupport: [
        'Environmental and Earth science STEELS support',
        'Instructional coaching on request',
        'Cross-district PLC participation'
      ],
      community: [
        'Regional STEM ecosystem partnership via IU29',
        'State Gamelands and natural resource partner potential',
        'Rural agricultural and environmental workforce connections'
      ],
      next: 'Build on Pine Grove\'s rural environmental strengths — connecting STEELS Earth and life science standards with local landscape and outdoor learning.'
    },

    {
      id: 'tri-valley',
      name: 'Tri-Valley',
      type: 'Public School District',
      region: 'Western',
      website: 'https://www.tri-valley.org/',
      pub: true,
      programs: [
        'STEELS Standards Implementation Support',
        'EdTech & AI Professional Learning',
        'Teacher Coaching & Instructional PD',
        'STEM Summer Institutes (Act 48 Eligible)'
      ],
      competitions: [
        'Keystone STEM Competition',
        'STEM Design Challenge',
        'Sea-Air-Land Robotics Challenge',
        'Media & Design Competition'
      ],
      teacherSupport: [
        'Rural district support model — flexible delivery',
        'Standards unpacking and curriculum planning',
        'Remote and in-person coaching options'
      ],
      community: [
        'Regional STEM ecosystem partnership via IU29',
        'Agricultural and rural workforce connections',
        'Nature and environmental partner opportunities in the western county'
      ],
      next: 'Expand STEM@Skook29 regional access for Tri-Valley students — connecting a rural western district to county-wide competition and professional learning.'
    },

    {
      id: 'blue-mountain',
      name: 'Blue Mountain',
      type: 'Public School District',
      region: 'Southern',
      website: 'https://www.bmsd.org/',
      pub: true,
      programs: [
        'STEELS Standards Implementation Support',
        'EdTech & AI Professional Learning',
        'Teacher Coaching & Instructional PD',
        'STEM Summer Institutes (Act 48 Eligible)'
      ],
      competitions: [
        'Keystone STEM Competition',
        'STEM Design Challenge',
        'Sea-Air-Land Robotics Challenge',
        'What\'s So Cool About Manufacturing? (WSCAM)'
      ],
      teacherSupport: [
        'Standards unpacking and curriculum mapping',
        'Instructional coaching available on request',
        'EdTech integration support'
      ],
      community: [
        'Regional STEM ecosystem partnership via IU29',
        'Southern Schuylkill workforce alignment opportunities',
        'WSCAM industry partner connection potential'
      ],
      next: 'Connect Blue Mountain student teams with regional competitions and STEELS professional learning to strengthen the southern county pipeline.'
    },

    // ---- Non-Public Partners ----
    {
      id: 'nativity-bvm',
      name: 'Nativity BVM',
      type: 'Non-Public Partner School',
      region: 'Pottsville Area',
      website: 'https://www.nativitybvm.net/',
      pub: false,
      programs: [
        'STEM Competition Eligibility via IU29 Partnership',
        'EdTech & AI Professional Learning (by request)',
        'Teacher PD Access through IU29 Network'
      ],
      competitions: [
        'Keystone STEM Competition (partner eligible)',
        'STEM Design Challenge (partner eligible)',
        'Sea-Air-Land Robotics Challenge (partner eligible)'
      ],
      teacherSupport: [
        'IU29 workshop and PD access on invitation basis',
        'STEELS alignment resources available',
        'Cross-school collaboration opportunities'
      ],
      community: [
        'Non-public school community partner in Schuylkill County',
        'Local faith-based and civic organization connections',
        'Shared regional workforce and higher ed pathway interest'
      ],
      next: 'Continue building Nativity BVM\'s connection to the IU29 STEM ecosystem through competition access and shared professional learning opportunities.'
    },

    {
      id: 'good-shepherd',
      name: 'Good Shepherd',
      type: 'Non-Public Partner School',
      region: 'Central Schuylkill',
      website: 'https://www.gssdschool.com/',
      pub: false,
      programs: [
        'STEM Competition Eligibility via IU29 Partnership',
        'EdTech & AI Professional Learning (by request)',
        'Teacher PD Access through IU29 Network'
      ],
      competitions: [
        'Keystone STEM Competition (partner eligible)',
        'STEM Design Challenge (partner eligible)',
        'Media & Design Competition (partner eligible)'
      ],
      teacherSupport: [
        'IU29 workshop and PD access on invitation basis',
        'STEELS-aligned resources available to educators',
        'Cross-school collaboration and ecosystem events'
      ],
      community: [
        'Non-public school community partner in Schuylkill County',
        'Community organization and faith-based network connections',
        'Shared student success and workforce readiness goals'
      ],
      next: 'Deepen Good Shepherd\'s participation in the regional STEM ecosystem through competition access and shared community partnership opportunities.'
    }

  ];

  // =============================================
  // RENDER: DISTRICT NODES
  // =============================================

  function renderNodes(gridEl) {
    var publicDistricts  = DISTRICTS.filter(function (d) { return d.pub; });
    var privateDistricts = DISTRICTS.filter(function (d) { return !d.pub; });

    // Public district nodes
    publicDistricts.forEach(function (d) {
      var btn = document.createElement('button');
      btn.type        = 'button';
      btn.className   = 'eco-district-btn';
      btn.dataset.id  = d.id;
      btn.textContent = d.name;
      btn.setAttribute('aria-pressed', 'false');
      gridEl.appendChild(btn);
    });

    // Divider + non-public label
    var divider = document.createElement('div');
    divider.className = 'eco-node-divider';
    gridEl.appendChild(divider);

    var label = document.createElement('div');
    label.className = 'eco-node-label';
    label.textContent = 'Non-Public Partners';
    gridEl.appendChild(label);

    // Non-public partner nodes
    privateDistricts.forEach(function (d) {
      var btn = document.createElement('button');
      btn.type       = 'button';
      btn.className  = 'eco-district-btn nonpublic';
      btn.dataset.id = d.id;
      btn.textContent = d.name;
      btn.setAttribute('aria-pressed', 'false');
      gridEl.appendChild(btn);
    });
  }

  // =============================================
  // RENDER: PLACEHOLDER PANEL
  // =============================================

  function renderPlaceholder(panelEl) {
    panelEl.innerHTML =
      '<div class="eco-detail-placeholder">' +
        '<div class="eco-detail-placeholder-icon" aria-hidden="true">🗺️</div>' +
        '<p class="eco-detail-placeholder-title">Select a District</p>' +
        '<p class="eco-detail-placeholder-sub">Click any district to explore how STEM@Skook29 programs, competitions, and partnerships connect across Schuylkill County.</p>' +
      '</div>';
  }

  // =============================================
  // RENDER: DISTRICT DETAIL CARD
  // =============================================

  function tagHtml(text, style) {
    return '<span class="eco-tag eco-tag-' + style + '">' +
      '<span class="eco-tag-dot" aria-hidden="true"></span>' + text +
      '</span>';
  }

  function tagsHtml(items, style) {
    return items.map(function (t) { return tagHtml(t, style); }).join('');
  }

  function renderDetail(panelEl, district) {
    var websiteHtml = district.website
      ? '<a href="' + district.website + '" target="_blank" rel="noopener noreferrer" ' +
          'class="btn btn-secondary btn-sm" style="text-decoration:none;">' +
          'Visit District Website →</a>'
      : '';

    panelEl.innerHTML =
      '<div class="eco-detail-card">' +

        // Header
        '<div class="eco-detail-header">' +
          '<div class="eco-detail-badge">' + district.type + '</div>' +
          '<h3 class="eco-detail-name">' + district.name + '</h3>' +
          '<div class="eco-detail-meta">' +
            '<span class="eco-detail-meta-chip">' +
              '<span aria-hidden="true">📍</span> ' + district.region + ' Schuylkill County' +
            '</span>' +
          '</div>' +
        '</div>' +

        // Body
        '<div class="eco-detail-body">' +

          // Programs
          '<div>' +
            '<div class="eco-detail-section-title">Available STEM@Skook29 Programs</div>' +
            '<div class="eco-tag-row">' + tagsHtml(district.programs, 'purple') + '</div>' +
          '</div>' +

          // Competitions
          '<div>' +
            '<div class="eco-detail-section-title">Competition Connections</div>' +
            '<div class="eco-tag-row">' + tagsHtml(district.competitions, 'orange') + '</div>' +
          '</div>' +

          // Teacher support
          '<div>' +
            '<div class="eco-detail-section-title">Teacher Support Opportunities</div>' +
            '<div class="eco-tag-row">' + tagsHtml(district.teacherSupport, 'gray') + '</div>' +
          '</div>' +

          // Community connections
          '<div>' +
            '<div class="eco-detail-section-title">Community &amp; Industry Connections</div>' +
            '<div class="eco-tag-row">' + tagsHtml(district.community, 'gray') + '</div>' +
          '</div>' +

          // Next opportunity
          '<div class="eco-detail-next">' +
            '<div class="eco-detail-next-label">Next Opportunity</div>' +
            '<p class="eco-detail-next-text">' + district.next + '</p>' +
          '</div>' +

        '</div>' +

        // Footer
        '<div class="eco-detail-footer">' +
          websiteHtml +
          '<a href="contact.html" class="btn btn-primary btn-sm" style="text-decoration:none;">' +
            'Connect with IU29 →' +
          '</a>' +
        '</div>' +

      '</div>';
  }

  // =============================================
  // INIT
  // =============================================

  function initMap() {
    var gridEl  = document.getElementById('eco-node-grid');
    var panelEl = document.getElementById('eco-detail-panel');
    if (!gridEl || !panelEl) return;

    renderNodes(gridEl);
    renderPlaceholder(panelEl);

    var activeId = null;

    gridEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.eco-district-btn');
      if (!btn) return;

      var id = btn.dataset.id;
      if (!id) return;

      // Toggle off same district
      if (id === activeId) {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
        activeId = null;
        renderPlaceholder(panelEl);
        return;
      }

      // Deactivate previous
      var prev = gridEl.querySelector('.eco-district-btn.active');
      if (prev) {
        prev.classList.remove('active');
        prev.setAttribute('aria-pressed', 'false');
      }

      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      activeId = id;

      var district = null;
      for (var i = 0; i < DISTRICTS.length; i++) {
        if (DISTRICTS[i].id === id) { district = DISTRICTS[i]; break; }
      }
      if (!district) return;

      renderDetail(panelEl, district);

      // On mobile, scroll detail into view
      if (window.innerWidth < 1024) {
        setTimeout(function () {
          panelEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 60);
      }
    });
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
  } else {
    initMap();
  }

}());
