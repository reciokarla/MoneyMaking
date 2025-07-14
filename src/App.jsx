import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, FileText, Target, Zap, Shield, Clock, CheckCircle, Info, Copy } from 'lucide-react';
import jsPDF from 'jspdf';

const SCREENS = [
  'Strategic Pre-Frame & Customer Deep Dive',
  'Unique Solution & Unbreakable Promises', 
  'Objection Killing & Value Stacking',
  'Urgency, Scarcity & Ethical Motivation',
  'Offer Summary & Copy Output'
];

const OFFER_CATEGORIES = [
  'Online Course',
  'Coaching Program', 
  'Software/SaaS',
  'Service Business',
  'Physical Product',
  'Consulting',
  'Membership Site',
  'Done-For-You Service'
];

const URGENCY_TRIGGERS = [
  { id: 'deadline', label: 'Deadline', description: 'Offer ends on specific date' },
  { id: 'limited_spots', label: 'Limited Spots', description: 'Only X seats available' },
  { id: 'disappearing_bonus', label: 'Disappearing Bonus', description: 'Bonus disappears in 48 hours' },
  { id: 'price_increase', label: 'Price Increase', description: 'Price rises after launch' },
  { id: 'cohort_based', label: 'Cohort-Based', description: 'Enrollment closes for this round' },
  { id: 'evergreen', label: 'Evergreen Urgency', description: 'Limited monthly acceptance' }
];

const OFFER_ENHANCERS = [
  {
    id: 'bundle',
    title: 'Special Offer / Bundle',
    description: 'Combine multiple products or services for added value',
    enhancerType: 'Special Offer Enhancer'
  },
  {
    id: 'bigger_opportunity', 
    title: 'Bigger Opportunity',
    description: 'Offer a broader or long-term outcome beyond the core promise',
    enhancerType: 'Bigger Opportunity Enhancer'
  },
  {
    id: 'speed',
    title: 'Speed Offer', 
    description: 'Help them get results faster with quick-start modules',
    enhancerType: 'Speed Enhancer'
  },
  {
    id: 'convenience',
    title: 'Convenience Offer',
    description: 'Reduce friction and simplify the user experience',
    enhancerType: 'Convenience Enhancer'
  },
  {
    id: 'simplicity',
    title: 'Simplicity Offer',
    description: 'Take the complexity out with templates and frameworks',
    enhancerType: 'Simplicity Enhancer'
  },
  {
    id: 'support',
    title: 'Support Offer',
    description: 'Add coaching, Q&A, or accountability features',
    enhancerType: 'Support Enhancer'
  },
  {
    id: 'done_for_you',
    title: 'Done-For-You Offer',
    description: 'Complete the work for them to maximize results',
    enhancerType: 'Done-For-You Enhancer'
  }
];

const CTA_EXAMPLES = [
  "Click here to claim your spot",
  "Join now and start your transformation",
  "Ready to transform your business? Click here to enroll now and secure your spot before the deadline!",
  "Yes, I Want In Now!",
  "Let's Get Started",
  "Reserve My Spot",
  "I'm Ready — Show Me the System",
  "Unlock the Full Offer Now"
];

function App() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [copiedCTA, setCopiedCTA] = useState(null);
  const [formData, setFormData] = useState({
    // Screen 1
    projectName: '',
    offerCategory: '',
    transformation: '',
    idealCustomer: '',
    beforeState: '',
    afterState: '',
    whenThen: '',
    painPoints: ['', '', '', '', ''],
    selfSabotage: '',
    enemy: '',
    previousAttempts: '',
    ultimateDream: '',
    shortTermGoal: '',
    successFeeling: '',
    
    // Screen 2
    coreProduct: '',
    biggestResult: '',
    mechanism: '',
    mechanismName: '',
    bigLie: '',
    truth: '',
    proof: '',
    unfairAdvantage: '',
    
    // Screen 3
    objections: [],
    selectedEnhancers: [],
    enhancerDetails: {},
    
    // Screen 4
    urgencyEnabled: false,
    urgencyTrigger: '',
    urgencyDetails: '',
    emotionalUrgency: '',
    ethicalPhrase: '',
    
    // Screen 5
    softClose: false
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addObjection = () => {
    setFormData(prev => ({
      ...prev,
      objections: [...prev.objections, { objection: '', solution: '', neutralized: false }]
    }));
  };

  const updateObjection = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      objections: prev.objections.map((obj, i) => 
        i === index ? { ...obj, [field]: value, neutralized: field === 'solution' && value.length > 0 } : obj
      )
    }));
  };

  const removeObjection = (index) => {
    setFormData(prev => ({
      ...prev,
      objections: prev.objections.filter((_, i) => i !== index)
    }));
  };

  const toggleEnhancer = (enhancerId) => {
    setFormData(prev => ({
      ...prev,
      selectedEnhancers: prev.selectedEnhancers.includes(enhancerId)
        ? prev.selectedEnhancers.filter(id => id !== enhancerId)
        : [...prev.selectedEnhancers, enhancerId]
    }));
  };

  const updateEnhancerDetails = (enhancerId, details) => {
    setFormData(prev => ({
      ...prev,
      enhancerDetails: { ...prev.enhancerDetails, [enhancerId]: details }
    }));
  };

  const copyCTA = (cta) => {
    navigator.clipboard.writeText(cta);
    setCopiedCTA(cta);
    setTimeout(() => setCopiedCTA(null), 2000);
  };

  const neutralizedObjections = formData.objections.filter(obj => obj.neutralized).length;
  const totalObjections = formData.objections.length;
  const selectedEnhancersCount = formData.selectedEnhancers.length;

  const generateHeadlines = () => {
    const { transformation, mechanismName, urgencyEnabled, enemy } = formData;
    const headlines = [];
    
    if (transformation && mechanismName) {
      headlines.push(`${transformation} Using Our Proven ${mechanismName}`);
      headlines.push(`The ${mechanismName} That ${transformation} (Even If You've Failed Before)`);
      headlines.push(`Stop ${enemy || 'Struggling'} - ${transformation} With ${mechanismName}`);
      
      if (urgencyEnabled) {
        headlines.push(`Last Chance: ${transformation} Using ${mechanismName}`);
        headlines.push(`${transformation} - Limited Time Access to ${mechanismName}`);
      }
    }
    
    return headlines;
  };

  const generateOfferSummary = () => {
    const { transformation, mechanismName, biggestResult, proof, urgencyEnabled } = formData;
    
    return `Discover how to ${transformation} using our proprietary ${mechanismName}. This proven system delivers ${biggestResult}, backed by ${proof}. We've eliminated every objection and obstacle that's been holding you back, giving you everything you need to succeed. ${urgencyEnabled ? 'But you must act now - this opportunity won\'t last forever.' : ''}`;
  };

  const generateCTAs = () => {
    const ctas = [
      'Click Here to Transform Your Life Today',
      'Join Now and Start Your Transformation',
      'Secure Your Spot Before It\'s Too Late',
      'Get Instant Access Now',
      'Claim Your Transformation Today'
    ];
    
    if (formData.urgencyEnabled) {
      ctas.push('Don\'t Miss Out - Enroll Before Time Runs Out');
      ctas.push('Last Chance - Secure Your Spot Now');
    }
    
    return ctas;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;
    
    const addText = (text, fontSize = 12, isBold = false) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(fontSize);
      if (isBold) doc.setFont(undefined, 'bold');
      else doc.setFont(undefined, 'normal');
      
      const lines = doc.splitTextToSize(text, 170);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * (fontSize * 0.4) + 5;
    };
    
    addText('MoneyMaking Offer AI - Complete Offer', 18, true);
    addText(`Project: ${formData.projectName}`, 14, true);
    
    addText('\nOffer Headlines:', 14, true);
    generateHeadlines().forEach(headline => addText(`• ${headline}`));
    
    addText('\nOffer Summary:', 14, true);
    addText(generateOfferSummary());
    
    addText('\nObjections Neutralized:', 14, true);
    formData.objections.forEach(obj => {
      if (obj.neutralized) {
        addText(`Problem: ${obj.objection}`);
        addText(`Solution: ${obj.solution}`);
        addText('');
      }
    });
    
    addText('\nOffer Enhancers Used:', 14, true);
    formData.selectedEnhancers.forEach(enhancerId => {
      const enhancer = OFFER_ENHANCERS.find(e => e.id === enhancerId);
      addText(`• ${enhancer.title}: ${formData.enhancerDetails[enhancerId] || enhancer.description}`);
    });
    
    addText('\nCall-to-Action Options:', 14, true);
    generateCTAs().forEach(cta => addText(`• ${cta}`));
    
    doc.save(`${formData.projectName || 'offer'}-summary.pdf`);
  };

  const exportToText = () => {
    let content = `MoneyMaking Offer AI - Complete Offer\n`;
    content += `Project: ${formData.projectName}\n\n`;
    
    content += `OFFER HEADLINES:\n`;
    generateHeadlines().forEach(headline => content += `• ${headline}\n`);
    
    content += `\nOFFER SUMMARY:\n${generateOfferSummary()}\n\n`;
    
    content += `OBJECTIONS NEUTRALIZED:\n`;
    formData.objections.forEach(obj => {
      if (obj.neutralized) {
        content += `Problem: ${obj.objection}\n`;
        content += `Solution: ${obj.solution}\n\n`;
      }
    });
    
    content += `OFFER ENHANCERS USED:\n`;
    formData.selectedEnhancers.forEach(enhancerId => {
      const enhancer = OFFER_ENHANCERS.find(e => e.id === enhancerId);
      content += `• ${enhancer.title}: ${formData.enhancerDetails[enhancerId] || enhancer.description}\n`;
    });
    
    content += `\nCALL-TO-ACTION OPTIONS:\n`;
    generateCTAs().forEach(cta => content += `• ${cta}\n`);
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.projectName || 'offer'}-summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderScreen1 = () => (
    <div className="card">
      <h2 style={{ marginBottom: '24px', color: '#1f2937' }}>Strategic Pre-Frame & Customer Deep Dive</h2>
      
      <div className="form-group">
        <label>Project Name</label>
        <input
          type="text"
          value={formData.projectName}
          onChange={(e) => updateFormData('projectName', e.target.value)}
          placeholder="e.g., My Coaching Program, New SaaS Launch"
        />
        <div className="example-box">
          <strong>Examples:</strong> "My Coaching Program," "New SaaS Launch," "Weight Loss Course"
        </div>
      </div>

      <div className="form-group">
        <label>Primary Offer Category</label>
        <select
          value={formData.offerCategory}
          onChange={(e) => updateFormData('offerCategory', e.target.value)}
        >
          <option value="">Select category...</option>
          {OFFER_CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>One-sentence Transformation</label>
        <input
          type="text"
          value={formData.transformation}
          onChange={(e) => updateFormData('transformation', e.target.value)}
          placeholder="What is the ONE big change your offer creates?"
        />
        <div className="example-box">
          <strong>Examples:</strong><br/>
          • "Helps busy parents reclaim their evenings"<br/>
          • "Doubles qualified leads in 30 days"<br/>
          • "Transforms overwhelmed entrepreneurs into confident leaders"
        </div>
      </div>

      <div className="form-group">
        <label>Ideal Customer Profile</label>
        <textarea
          value={formData.idealCustomer}
          onChange={(e) => updateFormData('idealCustomer', e.target.value)}
          placeholder="Demographics and psychographics of your perfect buyer..."
        />
        <div className="example-box">
          <strong>Example:</strong> "Busy, overwhelmed female entrepreneurs, 30-50, running service-based businesses, struggling with lead generation and time management, want more freedom and predictable income."
        </div>
      </div>

      <div className="form-group">
        <label>Before State: My customer feels...</label>
        <textarea
          value={formData.beforeState}
          onChange={(e) => updateFormData('beforeState', e.target.value)}
          placeholder="Describe their emotional and practical state before your solution..."
        />
        <div className="example-box">
          <strong>Example:</strong> "Overwhelmed by endless tasks, frustrated by inconsistent income, constantly stressed about finding new clients, feeling guilty about neglecting family."
        </div>
      </div>

      <div className="form-group">
        <label>After State: Now they can finally...</label>
        <textarea
          value={formData.afterState}
          onChange={(e) => updateFormData('afterState', e.target.value)}
          placeholder="Describe their emotional and practical state after your solution..."
        />
        <div className="example-box">
          <strong>Example:</strong> "Feel in control of their business, confident in their lead flow, enjoy predictable income, have more free time for family and hobbies, feel proud of their achievements."
        </div>
      </div>

      <div className="form-group">
        <label>When X happens, then they can Y</label>
        <input
          type="text"
          value={formData.whenThen}
          onChange={(e) => updateFormData('whenThen', e.target.value)}
          placeholder="When they implement our system, then they..."
        />
        <div className="example-box">
          <strong>Example:</strong> "When they implement our system, they stop chasing clients and start choosing them."
        </div>
      </div>

      <div className="form-group">
        <label>Their Deepest Pain Points & Frustrations (3-5)</label>
        <div className="helper-text">
          💡 Focus on specific, emotional pain points. What keeps them up at night? What tangible problems do they face?
        </div>
        {formData.painPoints.map((point, index) => (
          <input
            key={index}
            type="text"
            value={point}
            onChange={(e) => updateArrayField('painPoints', index, e.target.value)}
            placeholder={`Pain point ${index + 1}...`}
            style={{ marginBottom: '8px' }}
          />
        ))}
        <div className="example-box">
          <strong>Examples:</strong> "Inconsistent lead flow," "Too much time on admin tasks," "Difficulty converting leads," "Lack of clear marketing strategy," "Burnout from juggling roles"
        </div>
      </div>

      <div className="form-group">
        <label>Self-Sabotage Patterns</label>
        <textarea
          value={formData.selfSabotage}
          onChange={(e) => updateFormData('selfSabotage', e.target.value)}
          placeholder="What do they keep doing that isn't working? What emotional payoff keeps them stuck?"
        />
        <div className="example-box">
          <strong>Examples:</strong> "Procrastinating on sales calls (fear of rejection)," "Trying every new shiny object (fear of missing out)," "Over-delivering for free (seeking validation)"
        </div>
      </div>

      <div className="form-group">
        <label>Identify the Enemy</label>
        <textarea
          value={formData.enemy}
          onChange={(e) => updateFormData('enemy', e.target.value)}
          placeholder="Who or what is misleading them, hurting them, keeping them stuck?"
        />
        <div className="example-box">
          <strong>Examples:</strong> "The 'hustle culture' that promotes burnout," "Outdated marketing tactics that waste time," "Gurus selling quick fixes that don't work"
        </div>
      </div>

      <div className="form-group">
        <label>What have they already tried (that didn't work)?</label>
        <textarea
          value={formData.previousAttempts}
          onChange={(e) => updateFormData('previousAttempts', e.target.value)}
          placeholder="Previous solutions they've attempted..."
        />
        <div className="example-box">
          <strong>Examples:</strong> "They've downloaded 3 free lead magnets and still feel confused," "They've tried 5 diets and regained weight every time"
        </div>
      </div>

      <div className="form-group">
        <label>Ultimate Dream</label>
        <div className="dream-map-note">
          🎯 Also referred to as "Dream Mapping" — helps uncover the customer's emotional and lifestyle goals, as taught in Gary Halbert's frameworks.
        </div>
        <textarea
          value={formData.ultimateDream}
          onChange={(e) => updateFormData('ultimateDream', e.target.value)}
          placeholder="What's their emotional/lifestyle goal?"
        />
        <div className="example-box">
          <strong>Example:</strong> "Achieve financial freedom to travel the world with family, build a thriving business that runs without them"
        </div>
      </div>

      <div className="form-group">
        <label>Short-Term Goal</label>
        <input
          type="text"
          value={formData.shortTermGoal}
          onChange={(e) => updateFormData('shortTermGoal', e.target.value)}
          placeholder="What do they want to fix THIS month?"
        />
        <div className="example-box">
          <strong>Example:</strong> "Sign 3 new high-ticket clients," "Automate lead generation by 50%"
        </div>
      </div>

      <div className="form-group">
        <label>What Success Will Feel Like</label>
        <input
          type="text"
          value={formData.successFeeling}
          onChange={(e) => updateFormData('successFeeling', e.target.value)}
          placeholder="Peace? Relief? Control? Freedom?"
        />
        <div className="example-box">
          <strong>Example:</strong> "Feeling calm and confident about their business future, relief from financial stress, freedom to work from anywhere"
        </div>
      </div>
    </div>
  );

  const renderScreen2 = () => (
    <div className="card">
      <h2 style={{ marginBottom: '24px', color: '#1f2937' }}>Unique Solution & Unbreakable Promises</h2>
      
      <div className="form-group">
        <label>Core Product or Service</label>
        <textarea
          value={formData.coreProduct}
          onChange={(e) => updateFormData('coreProduct', e.target.value)}
          placeholder="What is the core product or service you are offering?"
        />
        <div className="example-box">
          <strong>Examples:</strong> "A 12-week online coaching program for service-based entrepreneurs," "A SaaS platform for automated social media scheduling"
        </div>
      </div>

      <div className="form-group">
        <label>Biggest Transformative Result</label>
        <textarea
          value={formData.biggestResult}
          onChange={(e) => updateFormData('biggestResult', e.target.value)}
          placeholder="What is the single, biggest, most transformative result your product delivers?"
        />
        <div className="example-box">
          <strong>Examples:</strong> "Guaranteed 5-figure monthly revenue in 90 days," "Automates 80% of social media posting, saving 10 hours/week"
        </div>
      </div>

      <div className="form-group">
        <label>Unique Mechanism</label>
        <textarea
          value={formData.mechanism}
          onChange={(e) => updateFormData('mechanism', e.target.value)}
          placeholder="What is the unique process that allows you to deliver this promise?"
        />
        <div className="example-box">
          <strong>Examples:</strong> "Our proprietary 3-step 'Rapid Revenue System'," "The 'Mind-Body Alignment' technique," "AI-powered 'Smart Scheduling Algorithm'"
        </div>
      </div>

      <div className="form-group">
        <label>Mechanism Name</label>
        <input
          type="text"
          value={formData.mechanismName}
          onChange={(e) => updateFormData('mechanismName', e.target.value)}
          placeholder="Give your method a branded name"
        />
        <div className="example-box">
          <strong>Examples:</strong> "The Client Attraction Blueprint," "The 10X Content Machine," "The Freedom Formula"
        </div>
      </div>

      <div className="form-group">
        <label>The "Big Lie"</label>
        <textarea
          value={formData.bigLie}
          onChange={(e) => updateFormData('bigLie', e.target.value)}
          placeholder="What false belief is holding your customer hostage?"
        />
        <div className="example-box">
          <strong>Example:</strong> "You need to work 80 hours a week to succeed"
        </div>
      </div>

      <div className="form-group">
        <label>The Truth</label>
        <textarea
          value={formData.truth}
          onChange={(e) => updateFormData('truth', e.target.value)}
          placeholder="What truth sets them free, and how does your offer reveal it?"
        />
        <div className="example-box">
          <strong>Example:</strong> "Smart systems and targeted strategies allow you to work less and earn more, and our program shows you exactly how"
        </div>
      </div>

      <div className="form-group">
        <label>Proof</label>
        <textarea
          value={formData.proof}
          onChange={(e) => updateFormData('proof', e.target.value)}
          placeholder="What proof do you have? Case studies? Testimonials? Track record?"
        />
        <div className="example-box">
          <strong>Examples:</strong> "50+ client testimonials with verifiable results," "Case study showing 300% ROI in 6 months," "Featured in Forbes and Entrepreneur magazine"
        </div>
      </div>

      <div className="form-group">
        <label>Unfair Advantage</label>
        <textarea
          value={formData.unfairAdvantage}
          onChange={(e) => updateFormData('unfairAdvantage', e.target.value)}
          placeholder="What makes your offer superior? Why you? Why now?"
        />
        <div className="example-box">
          <strong>Examples:</strong> "Unlike other programs, we provide 1-on-1 weekly coaching calls," "We guarantee results or your money back, no questions asked"
        </div>
      </div>
    </div>
  );

  const renderScreen3 = () => (
    <div className="card">
      <h2 style={{ marginBottom: '24px', color: '#1f2937' }}>Objection Killing & Value Stacking</h2>
      
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">{neutralizedObjections}</span>
          <div className="stat-label">Objections Neutralized</div>
        </div>
        <div className="stat-item">
          <span className="stat-number">{selectedEnhancersCount}</span>
          <div className="stat-label">Enhancers Used</div>
        </div>
        <div className="stat-item">
          <span className="stat-number">{Math.round((neutralizedObjections + selectedEnhancersCount) * 10)}%</span>
          <div className="stat-label">
            Confidence Score
            <div 
              className="tooltip-trigger"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Info size={16} />
              {showTooltip && (
                <div className="tooltip">
                  This score increases as you neutralize objections and apply value enhancers. It reflects the persuasive strength of your offer.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>Neutralize Each Objection</h3>
          <button className="button" onClick={addObjection}>
            Add Objection
          </button>
        </div>
        
        <div className="helper-text" style={{ marginBottom: '16px' }}>
          🎯 Provide a specific solution, guarantee, or bonus that directly eliminates this objection. Make it undeniable.
        </div>
        
        {formData.objections.map((obj, index) => (
          <div key={index} className={`objection-item ${obj.neutralized ? 'neutralized' : ''}`}>
            <div className="objection-header">
              <div className="objection-title">
                {obj.neutralized ? <CheckCircle size={20} /> : <Target size={20} />}
                <span style={{ marginLeft: '8px' }}>
                  {obj.neutralized ? '✅ Neutralized' : '🎯 Active Objection'}
                </span>
              </div>
              <button 
                onClick={() => removeObjection(index)}
                style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
              >
                Remove
              </button>
            </div>
            
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label>Objection</label>
              <input
                type="text"
                value={obj.objection}
                onChange={(e) => updateObjection(index, 'objection', e.target.value)}
                placeholder="e.g., It's too expensive, I don't have time..."
              />
            </div>
            
            <div className="form-group">
              <label>Solution/Neutralizer</label>
              <textarea
                value={obj.solution}
                onChange={(e) => updateObjection(index, 'solution', e.target.value)}
                placeholder="How do you eliminate this objection? What feature, guarantee, or bonus addresses this?"
              />
            </div>
          </div>
        ))}

        <div className="example-box">
          <strong>Common Objections & Solutions:</strong><br/>
          • "It's too expensive" → "Flexible payment plans + ROI calculator showing 5X potential earnings"<br/>
          • "What if it doesn't work?" → "100% Money-Back Guarantee, no questions asked"<br/>
          • "I don't have time" → "Designed for busy people, only 30 minutes/day required"
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px' }}>Enhance Your Offer with '7 Types of Irresistible Offers'</h3>
        <div className="enhancer-grid">
          {OFFER_ENHANCERS.map(enhancer => (
            <div key={enhancer.id}>
              <div className="enhancer-type-label">{enhancer.enhancerType}</div>
              <div
                className={`enhancer-card ${formData.selectedEnhancers.includes(enhancer.id) ? 'selected' : ''}`}
                onClick={() => toggleEnhancer(enhancer.id)}
              >
                <div className="enhancer-title">{enhancer.title}</div>
                <div className="enhancer-description">{enhancer.description}</div>
              </div>
            </div>
          ))}
        </div>

        {formData.selectedEnhancers.map(enhancerId => {
          const enhancer = OFFER_ENHANCERS.find(e => e.id === enhancerId);
          return (
            <div key={enhancerId} className="form-group">
              <label>{enhancer.title} - Details</label>
              <textarea
                value={formData.enhancerDetails[enhancerId] || ''}
                onChange={(e) => updateEnhancerDetails(enhancerId, e.target.value)}
                placeholder={`Describe how you'll implement ${enhancer.title.toLowerCase()}...`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderScreen4 = () => (
    <div className="card">
      <h2 style={{ marginBottom: '24px', color: '#1f2937' }}>Urgency, Scarcity & Ethical Motivation</h2>
      
      <div className="urgency-toggle">
        <div 
          className={`toggle-switch ${formData.urgencyEnabled ? 'active' : ''}`}
          onClick={() => updateFormData('urgencyEnabled', !formData.urgencyEnabled)}
        >
          <div className="toggle-slider"></div>
        </div>
        <div>
          <strong>Enable Urgency/Scarcity 🔥</strong>
          <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            Add time-sensitive elements to motivate action
          </div>
        </div>
      </div>

      {formData.urgencyEnabled && (
        <>
          <div className="form-group">
            <label>Choose Primary Trigger</label>
            <div style={{ display: 'grid', gap: '12px' }}>
              {URGENCY_TRIGGERS.map(trigger => (
                <div
                  key={trigger.id}
                  className={`enhancer-card ${formData.urgencyTrigger === trigger.id ? 'selected' : ''}`}
                  onClick={() => updateFormData('urgencyTrigger', trigger.id)}
                >
                  <div className="enhancer-title">{trigger.label}</div>
                  <div className="enhancer-description">{trigger.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Urgency Details</label>
            <textarea
              value={formData.urgencyDetails}
              onChange={(e) => updateFormData('urgencyDetails', e.target.value)}
              placeholder="Provide specific details for your chosen urgency trigger..."
            />
            <div className="example-box">
              <strong>Examples:</strong><br/>
              • "Offer ends on July 31st at 11:59 PM EST"<br/>
              • "Only 50 spots available for this exclusive cohort"<br/>
              • "The bonus 1-on-1 strategy session disappears in 48 hours"
            </div>
          </div>

          <div className="form-group">
            <label>Emotional Urgency</label>
            <textarea
              value={formData.emotionalUrgency}
              onChange={(e) => updateFormData('emotionalUrgency', e.target.value)}
              placeholder="What's the cost of waiting? Missed opportunity? More stress? More loss?"
            />
            <div className="example-box">
              <strong>Example:</strong> "Every day you wait is another day you're losing potential clients to your competitors. Don't let self-doubt keep you stuck in the same cycle of inconsistent income."
            </div>
          </div>

          <div className="form-group">
            <label>Ethical Phrase</label>
            <input
              type="text"
              value={formData.ethicalPhrase}
              onChange={(e) => updateFormData('ethicalPhrase', e.target.value)}
              placeholder="Phrase the urgency in a way that builds trust and clarity"
            />
            <div className="example-box">
              <strong>Examples:</strong><br/>
              • "Enrollment closes Sunday to ensure personalized support"<br/>
              • "Launch pricing ends Friday — no exceptions"<br/>
              • "We close access on Friday to ensure every new student receives dedicated 1-on-1 onboarding"
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderScreen5 = () => (
    <div className="card">
      <h2 style={{ marginBottom: '24px', color: '#1f2937' }}>Offer Summary & Copy Output</h2>
      
      <div className="output-section">
        <h3><Zap size={20} style={{ display: 'inline', marginRight: '8px' }} />Offer Headlines</h3>
        <div className="output-content">
          {generateHeadlines().map((headline, index) => `${index + 1}. ${headline}`).join('\n\n')}
        </div>
      </div>

      <div className="output-section">
        <h3><FileText size={20} style={{ display: 'inline', marginRight: '8px' }} />Offer Summary</h3>
        <div className="output-content">
          {generateOfferSummary()}
        </div>
      </div>

      <div className="output-section">
        <h3><Shield size={20} style={{ display: 'inline', marginRight: '8px' }} />Objection Killers</h3>
        <div className="output-content">
          {formData.objections
            .filter(obj => obj.neutralized)
            .map((obj, index) => `${index + 1}. Problem: ${obj.objection}\n   Solution: ${obj.solution}`)
            .join('\n\n')}
        </div>
      </div>

      <div className="output-section">
        <h3><Target size={20} style={{ display: 'inline', marginRight: '8px' }} />Offer Enhancers</h3>
        <div className="output-content">
          {formData.selectedEnhancers.map((enhancerId, index) => {
            const enhancer = OFFER_ENHANCERS.find(e => e.id === enhancerId);
            const details = formData.enhancerDetails[enhancerId];
            return `${index + 1}. ${enhancer.title}: ${details || enhancer.description}`;
          }).join('\n\n')}
        </div>
      </div>

      <div className="output-section">
        <h3><Clock size={20} style={{ display: 'inline', marginRight: '8px' }} />Psychological Triggers</h3>
        <div className="output-content">
          {`Big Lie: ${formData.bigLie}
Truth: ${formData.truth}
Enemy: ${formData.enemy}
Self-Sabotage: ${formData.selfSabotage}`}
        </div>
      </div>

      <div className="output-section">
        <h3>Call-to-Action Suggestions</h3>
        <div className="cta-context">
          📝 Use these CTAs near the end of your sales page, email, or ad — they should match your offer's urgency trigger and make the next step feel safe and exciting. These are based on classic direct response templates.
        </div>
        <div className="output-content">
          {generateCTAs().map((cta, index) => `${index + 1}. ${cta}`).join('\n')}
        </div>
        
        <div className="cta-examples-section">
          <h4>🚀 Ready-to-Use CTA Templates</h4>
          <div className="cta-examples-grid">
            {CTA_EXAMPLES.map((cta, index) => (
              <div key={index} className="cta-example-item">
                <div className="cta-text">{cta}</div>
                <button 
                  className="copy-button"
                  onClick={() => copyCTA(cta)}
                  title="Copy to clipboard"
                >
                  {copiedCTA === cta ? '✅' : <Copy size={16} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="checkbox-group">
        <input
          type="checkbox"
          id="softClose"
          checked={formData.softClose}
          onChange={(e) => updateFormData('softClose', e.target.checked)}
        />
        <label htmlFor="softClose">Add Soft Close Option</label>
      </div>

      {formData.softClose && (
        <div className="output-section">
          <h3>Soft Close</h3>
          <div className="output-content">
            "Even if you're unsure, save your spot now. You can always decide later."
          </div>
        </div>
      )}

      <div className="export-buttons">
        <button className="button export-button" onClick={exportToPDF}>
          <Download size={20} />
          Export PDF
        </button>
        <button className="button button-secondary" onClick={exportToText}>
          <FileText size={20} />
          Export Text
        </button>
      </div>
    </div>
  );

  const screens = [renderScreen1, renderScreen2, renderScreen3, renderScreen4, renderScreen5];

  return (
    <div className="container">
      <div className="header">
        <h1>MoneyMaking Offer AI</h1>
        <p>Create irresistible offers that your customers can't refuse</p>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((currentScreen + 1) / SCREENS.length) * 100}%` }}
        />
      </div>

      <div style={{ textAlign: 'center', marginBottom: '24px', color: '#6b7280' }}>
        Step {currentScreen + 1} of {SCREENS.length}: {SCREENS[currentScreen]}
      </div>

      {screens[currentScreen]()}

      <div className="navigation">
        <button
          className="button button-secondary"
          onClick={() => setCurrentScreen(Math.max(0, currentScreen - 1))}
          disabled={currentScreen === 0}
        >
          <ChevronLeft size={20} />
          Previous
        </button>

        <button
          className="button cta-button"
          onClick={() => setCurrentScreen(Math.min(SCREENS.length - 1, currentScreen + 1))}
          disabled={currentScreen === SCREENS.length - 1}
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default App;
