import React, { useState, useEffect } from 'react';
import { Save, Download, Shuffle, BookOpen, PenTool, Heart, Trash2, FileText, Plus } from 'lucide-react';
import './GhostScramble.css';

const GhostScrambleApp = () => {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [entries, setEntries] = useState({});
  const [reflection, setReflection] = useState('');
  const [savedSessions, setSavedSessions] = useState([]);
  const [sessionTitle, setSessionTitle] = useState('');
  const [isReflectionMode, setIsReflectionMode] = useState(false);

  // Load saved sessions from localStorage on app start
  useEffect(() => {
    const savedData = localStorage.getItem('ghostScrambleSessions');
    if (savedData) {
      try {
        const sessions = JSON.parse(savedData);
        setSavedSessions(sessions);
      } catch (error) {
        console.error('Error loading saved sessions:', error);
      }
    }
  }, []);

  // Save sessions to localStorage whenever savedSessions changes
  useEffect(() => {
    if (savedSessions.length > 0) {
      localStorage.setItem('ghostScrambleSessions', JSON.stringify(savedSessions));
    }
  }, [savedSessions]);

  const prompts = [
    { key: 'G', german: 'Gedanke', english: 'Thought', placeholder: 'What thought keeps returning to you today?' },
    { key: 'H', german: 'Herz', english: 'Heart', placeholder: 'What does your heart feel right now?' },
    { key: 'O', german: 'Objekt', english: 'Object', placeholder: 'What object holds meaning for you today?' },
    { key: 'S', german: 'Stimmung', english: 'Mood', placeholder: 'How would you describe the atmosphere around you?' },
    { key: 'T', german: 'Text', english: 'Text', placeholder: 'What words, quote, or text resonates with you?' },
    { key: 'S2', german: 'Symbol', english: 'Logo/Symbol', placeholder: 'What symbol or image represents this moment?' },
    { key: 'C', german: 'Crux', english: 'Crux of the Matter', placeholder: 'What is the heart of what you\'re experiencing?' },
    { key: 'R', german: 'Richtung', english: 'Direction', placeholder: 'Where do you feel yourself moving toward?' },
    { key: 'A', german: 'Abwesenheit', english: 'Absence', placeholder: 'What is missing or what do you long for?' },
    { key: 'M', german: 'Mensch', english: 'Person', placeholder: 'Who comes to mind? What person influences this moment?' },
    { key: 'B', german: 'Bild', english: 'Picture', placeholder: 'What image or scene do you see in your mind?' },
    { key: 'L', german: 'Lied', english: 'Song', placeholder: 'What music or rhythm matches your inner state?' },
    { key: 'E', german: 'Erinnerungsort', english: 'Memory Place', placeholder: 'What place - real or imagined - holds significance?' }
  ];

  const handleEntryChange = (key, value) => {
    setEntries(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSession = () => {
    if (!sessionTitle.trim()) {
      alert('Please add a title for your session');
      return;
    }
    
    const session = {
      id: Date.now(),
      title: sessionTitle,
      date: new Date().toLocaleDateString(),
      entries,
      reflection,
      wordCount: Object.values(entries).join(' ').split(' ').length + reflection.split(' ').length
    };
    
    setSavedSessions(prev => [session, ...prev]);
    
    // Reset for new session
    setEntries({});
    setReflection('');
    setSessionTitle('');
    setCurrentPrompt(0);
    setIsReflectionMode(false);
    
    alert('Session saved successfully!');
  };

  const handleLoadSession = (session) => {
    setEntries(session.entries);
    setReflection(session.reflection);
    setSessionTitle(session.title + ' (copy)');
    setCurrentPrompt(0);
    setIsReflectionMode(false);
  };

  const handleNewSession = () => {
    if (Object.keys(entries).length > 0 || reflection.trim() || sessionTitle.trim()) {
      if (!window.confirm('Start a new session? Any unsaved work will be lost.')) {
        return;
      }
    }
    
    setEntries({});
    setReflection('');
    setSessionTitle('');
    setCurrentPrompt(0);
    setIsReflectionMode(false);
  };

  const handleDeleteSession = (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      setSavedSessions(prev => prev.filter(session => session.id !== sessionId));
    }
  };

  const handleExport = () => {
    let exportText = `GHOST SCRAMBLE Session: ${sessionTitle || 'Untitled'}\n`;
    exportText += `Date: ${new Date().toLocaleDateString()}\n\n`;
    
    prompts.forEach(prompt => {
      const entry = entries[prompt.key];
      if (entry) {
        exportText += `${prompt.key} - ${prompt.german} (${prompt.english}):\n${entry}\n\n`;
      }
    });
    
    if (reflection) {
      exportText += `Reflection:\n${reflection}\n`;
    }
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ghost-scramble-${sessionTitle || 'session'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shufflePrompts = () => {
    setCurrentPrompt(Math.floor(Math.random() * prompts.length));
  };

  const completedPrompts = Object.keys(entries).length;
  const progress = (completedPrompts / prompts.length) * 100;

  return (
    <div className="ghost-app">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>GHOST SCRAMBLE</h1>
          <p>Ein Portal zu Gedanken und Gefühlen</p>
        </div>

        <div className="grid-container">
          {/* Left Sidebar - Prompts Navigation */}
          <div className="prompts-sidebar">
            <div className="card">
              <div className="prompts-header">
                <h3>Prompts</h3>
                <button 
                  onClick={shufflePrompts}
                  className="shuffle-btn"
                  title="Shuffle prompts"
                >
                  <Shuffle size={16} />
                </button>
              </div>
              
              <div className="prompts-list">
                {prompts.map((prompt, index) => (
                  <button
                    key={prompt.key}
                    onClick={() => {
                      setCurrentPrompt(index);
                      setIsReflectionMode(false);
                    }}
                    className={`prompt-btn ${currentPrompt === index && !isReflectionMode ? 'active' : ''}`}
                  >
                    <div className="prompt-info">
                      <div className="prompt-text">
                        <div className="german">
                          {prompt.key} - {prompt.german}
                        </div>
                        <div className="english">{prompt.english}</div>
                      </div>
                      {entries[prompt.key] && (
                        <div className="completion-dot"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setIsReflectionMode(true)}
                className={`prompt-btn reflection ${isReflectionMode ? 'active' : ''}`}
              >
                <div className="reflection-btn-content">
                  <Heart size={16} />
                  <span>Reflection</span>
                </div>
              </button>
            </div>

            {/* Progress */}
            <div className="card">
              <h4>Progress</h4>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="progress-text">
                {completedPrompts} of {prompts.length} prompts completed
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="main-content">
            {!isReflectionMode ? (
              <>
                <div className="content-header">
                  <h2>{prompts[currentPrompt].german}</h2>
                  <p>{prompts[currentPrompt].english}</p>
                  <div className="accent-line indigo"></div>
                </div>
                
                <textarea
                  value={entries[prompts[currentPrompt].key] || ''}
                  onChange={(e) => handleEntryChange(prompts[currentPrompt].key, e.target.value)}
                  placeholder={prompts[currentPrompt].placeholder}
                  className="main-textarea"
                />
              </>
            ) : (
              <>
                <div className="content-header">
                  <h2>Reflection</h2>
                  <p>Synthesize your thoughts and feelings</p>
                  <div className="accent-line purple"></div>
                </div>
                
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Let your thoughts flow... How do these elements connect? What story emerges from your GHOST SCRAMBLE?"
                  className="main-textarea reflection"
                />
              </>
            )}
          </div>

          {/* Right Sidebar - Session Management */}
          <div className="session-sidebar">
            <div className="card">
              <h3>Current Session</h3>
              
              <input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                placeholder="Session title..."
                className="session-title-input"
              />
              
              <div className="session-actions">
                <button
                  onClick={handleNewSession}
                  className="action-btn secondary"
                >
                  <Plus size={16} />
                  New Session
                </button>
                
                <button
                  onClick={handleSaveSession}
                  className="action-btn primary"
                >
                  <Save size={16} />
                  Save Session
                </button>
                
                <button
                  onClick={handleExport}
                  className="action-btn secondary"
                >
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>

            {/* Saved Sessions */}
            {savedSessions.length > 0 && (
              <div className="card">
                <h3 className="saved-sessions-header">
                  <BookOpen size={16} />
                  Saved Sessions
                </h3>
                <div className="sessions-list">
                  {savedSessions.map(session => (
                    <div key={session.id} className="session-item">
                      <div className="session-item-title">{session.title}</div>
                      <div className="session-item-meta">{session.date}</div>
                      <div className="session-item-meta">{session.wordCount} words</div>
                      <div className="session-actions" style={{marginTop: '8px', display: 'flex', gap: '4px'}}>
                        <button 
                          onClick={() => handleLoadSession(session)}
                          className="action-btn primary"
                          style={{fontSize: '0.75rem', padding: '4px 8px'}}
                        >
                          <FileText size={12} />
                          Load
                        </button>
                        <button 
                          onClick={() => handleDeleteSession(session.id)}
                          className="action-btn secondary"
                          style={{fontSize: '0.75rem', padding: '4px 8px'}}
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="tips-card">
              <h4>✨ Tips</h4>
              <ul className="tips-list">
                <li>• Don't overthink - let intuition guide you</li>
                <li>• Skip prompts that don't speak to you today</li>
                <li>• Use the shuffle button for fresh perspective</li>
                <li>• Write in any language that feels right</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GhostScrambleApp;
