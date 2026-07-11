// ═══════════════════════════════════════════════════════════════
// 24K REALTORS — Voice Command Service
// Powered by Web Speech API (Native Browser)
// Commands: Lead search | CRM navigation | WhatsApp | Follow-up
// ═══════════════════════════════════════════════════════════════

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechSynthesis = window.speechSynthesis;

// ── Voice Command Registry ───────────────────────────────────
const COMMAND_PATTERNS = [
  // Lead Management
  { pattern: /show (me )?(hot|warm|cold) leads?/i, action: 'FILTER_LEADS', extract: (m) => ({ status: m[2].toUpperCase() }) },
  { pattern: /show (me )?(all )?leads?/i, action: 'SHOW_ALL_LEADS', extract: () => ({}) },
  { pattern: /search (for )?(.+)/i, action: 'SEARCH_LEADS', extract: (m) => ({ query: m[2] }) },
  { pattern: /add (new )?lead[:\s]+(.+)/i, action: 'ADD_LEAD', extract: (m) => ({ name: m[2] }) },
  
  // Navigation
  { pattern: /go to (crm|dashboard|properties|leads|analytics)/i, action: 'NAVIGATE', extract: (m) => ({ tab: m[1] }) },
  { pattern: /open (crm|dashboard|properties|leads)/i, action: 'NAVIGATE', extract: (m) => ({ tab: m[1] }) },
  
  // Communication
  { pattern: /call (.+)/i, action: 'CALL_LEAD', extract: (m) => ({ name: m[1] }) },
  { pattern: /whatsapp (.+)/i, action: 'WHATSAPP_LEAD', extract: (m) => ({ name: m[1] }) },
  { pattern: /send message to (.+)/i, action: 'WHATSAPP_LEAD', extract: (m) => ({ name: m[1] }) },
  
  // Follow-ups
  { pattern: /schedule follow.?up (with )?(.+)/i, action: 'SCHEDULE_FOLLOWUP', extract: (m) => ({ name: m[2] }) },
  { pattern: /remind me about (.+)/i, action: 'SET_REMINDER', extract: (m) => ({ about: m[1] }) },
  
  // AI Actions
  { pattern: /score (this )?lead/i, action: 'AI_SCORE_LEAD', extract: () => ({}) },
  { pattern: /generate (whatsapp )?message/i, action: 'AI_GENERATE_MESSAGE', extract: () => ({}) },
  
  // General
  { pattern: /help/i, action: 'SHOW_HELP', extract: () => ({}) },
  { pattern: /stop listening/i, action: 'STOP_VOICE', extract: () => ({}) },
];

class VoiceCommandService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.onCommandCallback = null;
    this.onTranscriptCallback = null;
    this.onStateChangeCallback = null;
    this.isSupported = !!SpeechRecognition;
  }

  /**
   * Initialize and start listening
   * @param {Function} onCommand - Called when command is recognized
   * @param {Function} onTranscript - Called with live transcript
   * @param {Function} onStateChange - Called when listening state changes
   */
  startListening(onCommand, onTranscript, onStateChange) {
    if (!this.isSupported) {
      console.warn('[Voice] Speech Recognition not supported in this browser');
      onStateChange?.({ supported: false, error: 'Browser not supported. Use Chrome or Edge.' });
      return;
    }

    this.onCommandCallback = onCommand;
    this.onTranscriptCallback = onTranscript;
    this.onStateChangeCallback = onStateChange;

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-IN'; // Indian English
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isListening = true;
      onStateChange?.({ listening: true });
      this.speak('Listening. How can I help you?');
      console.log('[Voice] Recognition started');
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Send live transcript
      onTranscript?.(interimTranscript || finalTranscript);

      // Process final command
      if (finalTranscript) {
        this._processCommand(finalTranscript.trim());
      }
    };

    this.recognition.onerror = (event) => {
      console.error('[Voice] Error:', event.error);
      onStateChange?.({ listening: false, error: event.error });
      
      if (event.error === 'not-allowed') {
        this.speak('Please allow microphone access to use voice commands.');
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onStateChange?.({ listening: false });
      console.log('[Voice] Recognition ended');
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.error('[Voice] Start failed:', e);
    }
  }

  /**
   * Stop listening
   */
  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
    this.isListening = false;
    this.onStateChangeCallback?.({ listening: false });
  }

  /**
   * Toggle listening on/off
   */
  toggle(onCommand, onTranscript, onStateChange) {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening(onCommand, onTranscript, onStateChange);
    }
  }

  /**
   * Process spoken command and find matching action
   */
  _processCommand(transcript) {
    console.log('[Voice] Processing command:', transcript);
    
    for (const cmd of COMMAND_PATTERNS) {
      const match = transcript.match(cmd.pattern);
      if (match) {
        const commandData = {
          action: cmd.action,
          transcript,
          params: cmd.extract(match)
        };
        
        console.log('[Voice] Command matched:', commandData);
        this.onCommandCallback?.(commandData);
        this._speakResponse(cmd.action, commandData.params);
        return;
      }
    }

    // No match found
    console.log('[Voice] No command matched for:', transcript);
    this.onCommandCallback?.({
      action: 'UNKNOWN',
      transcript,
      params: {}
    });
  }

  /**
   * Text to speech response
   */
  speak(text) {
    if (!SpeechSynthesis) return;
    
    SpeechSynthesis.cancel(); // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    SpeechSynthesis.speak(utterance);
  }

  /**
   * Speak contextual response based on action
   */
  _speakResponse(action, params) {
    const responses = {
      'FILTER_LEADS': `Showing ${params.status?.toLowerCase()} leads`,
      'SHOW_ALL_LEADS': 'Showing all leads',
      'SEARCH_LEADS': `Searching for ${params.query}`,
      'ADD_LEAD': `Adding new lead: ${params.name}`,
      'NAVIGATE': `Going to ${params.tab}`,
      'CALL_LEAD': `Opening call for ${params.name}`,
      'WHATSAPP_LEAD': `Opening WhatsApp for ${params.name}`,
      'SCHEDULE_FOLLOWUP': `Scheduling follow-up with ${params.name}`,
      'AI_SCORE_LEAD': 'Analyzing lead with AI',
      'AI_GENERATE_MESSAGE': 'Generating personalized message',
      'SHOW_HELP': 'Here are the available commands',
    };

    const response = responses[action] || 'Processing your request';
    this.speak(response);
  }

  /**
   * Get list of available commands for help panel
   */
  getAvailableCommands() {
    return [
      { command: '"Show hot leads"', description: 'Filter by lead status' },
      { command: '"Search for Rahul"', description: 'Search by name' },
      { command: '"Add lead: Priya Sharma"', description: 'Quick add lead' },
      { command: '"Go to Dashboard"', description: 'Navigate tabs' },
      { command: '"WhatsApp Rahul"', description: 'Open WhatsApp chat' },
      { command: '"Schedule follow-up with Priya"', description: 'Set reminder' },
      { command: '"Generate message"', description: 'AI WhatsApp draft' },
      { command: '"Score this lead"', description: 'AI lead analysis' },
      { command: '"Stop listening"', description: 'Deactivate voice' },
    ];
  }
}

// Singleton instance
export const voiceService = new VoiceCommandService();
export default voiceService;
