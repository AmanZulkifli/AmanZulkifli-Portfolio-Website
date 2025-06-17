import { useState, useEffect, useRef } from 'react';
import EarthSpinnerCanvas from './components/EarthSpinnerCanvas';
import emailjs from '@emailjs/browser';

export default function LeftPanel() {
  const [isSending, setIsSending] = useState(false);
  const [time, setTime] = useState(new Date());
  const [onlineStatus, setOnlineStatus] = useState('offline');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const emailInputRef = useRef(null);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState([
    'MESSAGE TERMINAL v1.0',
    '---------------------',
    'Enter sender name:',
    '>'
  ]);
  const [inputStep, setInputStep] = useState(0);
  const modalRef = useRef(null);
  const terminalEndRef = useRef(null);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Initialize terminal state
  const EMAILJS_SERVICE_ID = 'service_cf16n39';
  const EMAILJS_TEMPLATE_ID = 'template_ta4vx0q';
  const EMAILJS_PUBLIC_KEY = 'NsxMNsz36D1EdkgXB';


  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      if (day >= 1 && day <= 5) {
        if (hour >= 9 && hour < 20) setOnlineStatus('online');
        else if ((hour >= 7 && hour < 9) || (hour >= 20 && hour < 22)) setOnlineStatus('busy');
        else setOnlineStatus('offline');
      } else {
        setOnlineStatus('offline');
      }
    };

    updateStatus();
    const statusInterval = setInterval(updateStatus, 60000);
    const timeInterval = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(statusInterval);
      clearInterval(timeInterval);
    };
  }, []);

    useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalOutput]);


  const handleMouseDown = (e) => {
    if (e.target.classList.contains('terminal-header')) {
      setIsDragging(true);
      const rect = modalRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const day = time.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Jakarta' });
  const timeStr = time.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta', hour12: false,
  });

  const handleTerminalSubmit = async (e) => {
    e.preventDefault();
    
    const newOutput = [...terminalOutput, terminalInput];
    
    if (inputStep === 0) {
      setForm({ ...form, name: terminalInput });
      newOutput.push('Enter email address:', '>');
      setInputStep(1);
    } else if (inputStep === 1) {
      // Add basic email validation
      if (!validateEmail(terminalInput)) {
        newOutput.push('Invalid email format. Please try again:', '>');
        setTerminalOutput(newOutput);
        setTerminalInput('');
        return;
      }
      setForm({ ...form, email: terminalInput });
      newOutput.push('Enter your message:', '>');
      setInputStep(2);
    } else if (inputStep === 2) {
      setForm({ ...form, message: terminalInput });
      newOutput.push('Send this message? (Y/N)', '>');
      setInputStep(3);
    } else if (inputStep === 3) {
      if (terminalInput.toLowerCase() === 'y') {
        setIsSending(true);
        newOutput.push('Sending message...', '>');
        setTerminalOutput(newOutput);
        setTerminalInput('');
        
        try {
          // Send email using EmailJS
          const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
              from_name: form.name,
              from_email: form.email,
              message: form.message,
              reply_to: form.email // Add this to ensure replies go to the sender
            }
          );

          if (response.status === 200) {
            const successOutput = [...newOutput, '✓ Message sent successfully!', 'Terminal session ended.', '---------------------'];
            setTerminalOutput(successOutput);
          } else {
            throw new Error('Failed to send email');
          }
        } catch (error) {
          console.error('Email sending error:', error);
          const errorOutput = [...newOutput, '✗ Failed to send message. Please try again later.', '>'];
          setTerminalOutput(errorOutput);
          setInputStep(2); // Go back to message input step
        } finally {
          setIsSending(false);
        }
        
        setInputStep(4);
      } else if (terminalInput.toLowerCase() === 'n') {
        newOutput.push('Message discarded.', '---------------------');
        setInputStep(4);
      } else {
        newOutput.push('Invalid input. Please enter Y or N', '>');
        return;
      }
    } else {
      setIsModalOpen(false);
      resetTerminal();
      return;
    }
    
    if (inputStep !== 3 || terminalInput.toLowerCase() !== 'y') {
      setTerminalOutput(newOutput);
    }
    setTerminalInput('');
  };

    const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };


  const resetTerminal = () => {
    setTerminalOutput([
      'MESSAGE TERMINAL v1.0',
      '---------------------',
      'Enter sender name:',
      '>'
    ]);
    setTerminalInput('');
    setInputStep(0);
    setForm({ name: '', email: '', message: '' });
  };

  const statusColors = {
    online: 'bg-green-500',
    busy: 'bg-yellow-400',
    offline: 'bg-gray-400',
  };

  const statusText = {
    online: 'Available',
    busy: 'Busy',
    offline: 'Offline',
  };

  return (
    <div className="p-4 h-full bg-[#f0d5c4] text-[#5a4a42] space-y-4 overflow-y-auto pixel-font border-r-2 border-[#d4b8a8]">
      {/* Profile Card */}
      <div className="p-3 bg-[#f8e0d5] border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] pixel-corners">
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16 pixel-corners overflow-hidden border-2 border-[#d4b8a8]">
            <img
              src="/profile.jpg"
              alt="Profile"
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://ui-avatars.com/api/?name=Aman+Zulkifli';
              }}
            />
          </div>
          <div>
            <h1 className="text-lg font-bold">AMAN ZULKIFLI</h1>
            <p className="text-xs text-[#a38b7a]">FRONTEND DEVELOPER</p>
            <div className="flex items-center gap-1 mt-1">
              <span className={`w-2 h-2 pixel-corners ${statusColors[onlineStatus]}`}></span>
              <p className="text-xs">{statusText[onlineStatus]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Section */}
      <div className="p-3 bg-[#f8e0d5] border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] pixel-corners space-y-2">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="#5a4a42">
            <rect x="1" y="1" width="14" height="14" rx="1" fill="#e8a87c"/>
            <rect x="3" y="3" width="10" height="10" rx="0.5" fill="#f8e0d5"/>
          </svg>
          <p className="text-xs">ACTIVE 09:00–20:00 WIB</p>
        </div>
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="#5a4a42">
            <rect x="1" y="1" width="14" height="14" rx="1" fill="#e8a87c"/>
            <rect x="4" y="4" width="8" height="8" rx="0.5" fill="#f8e0d5"/>
          </svg>
          <p className="text-xs">BOGOR, INDONESIA</p>
        </div>
      </div>

      {/* Date & Action Widgets */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-2 bg-[#f8e0d5] border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] pixel-corners">
          <p className="text-xs text-[#a38b7a]">{day}</p>
          <p className="text-lg font-bold tracking-tight">
            {timeStr} <span className="text-xs">WIB</span>
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 bg-[#f8e0d5] border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] pixel-corners hover:bg-[#e8a87c] hover:text-[#fff5ee] transition-colors"
        >
          <p className="text-xs">📨 SEND MESSAGE</p>
          <p className="text-sm font-semibold">SAY "HELLO!"</p>
        </button>
      </div>

      {/* Bio Section */}
      <div className="p-3 bg-[#f8e0d5] border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] pixel-corners">
        <h3 className="text-xs font-bold text-[#a38b7a] mb-1">ABOUT ME</h3>
        <p className="text-xs leading-relaxed">
          Still learning, always building and passionate about design, code, and creating meaningful things.
          Currently focused on frontend development with React, Tailwind, and Bootstrap CSS. I also have experience working with the Laravel framework for backend development.
        </p>
      </div>

      {/* Project Info */}
      <div className="p-3 bg-[#f8e0d5] border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] pixel-corners text-center">
        <div className="inline-block p-2 bg-[#e8a87c] pixel-corners mb-1">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="#fff5ee">
            <rect x="1" y="1" width="14" height="14" rx="1" fill="#5a4a42"/>
            <rect x="3" y="3" width="10" height="10" rx="0.5" fill="#f8e0d5"/>
          </svg>
        </div>
        <h3 className="text-xs font-bold text-[#5a4a42] mb-1">PROJECT SPACE</h3>
        <p className="text-xs text-[#a38b7a] italic">🚧 UNDER CONSTRUCTION</p>
      </div>

      {/* Terminal Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/20 flex items-start justify-center px-4 pt-16"
          onMouseDown={() => setIsDragging(false)}
        >
          <div 
            ref={modalRef}
            className="w-full max-w-2xl bg-[#f8e0d5] text-[#5a4a42] border-2 border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#d4b8a8] border-b-[#d4b8a8] p-1 relative pixel-corners"
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              cursor: isDragging ? 'grabbing' : 'default',
            }}
          >
            <div 
              className="terminal-header bg-[#e8a87c] p-2 flex justify-between items-center cursor-grab"
              onMouseDown={handleMouseDown}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#d4b8a8] border border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#5a4a42] border-b-[#5a4a42]"></div>
                <div className="w-3 h-3 bg-[#d4b8a8] border border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#5a4a42] border-b-[#5a4a42]"></div>
                <div className="w-3 h-3 bg-[#d4b8a8] border border-t-[#fff5ee] border-l-[#fff5ee] border-r-[#5a4a42] border-b-[#5a4a42]"></div>
              </div>
              <span className="text-xs font-bold">MESSAGE TERMINAL v1.0</span>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetTerminal();
                }}
                className="w-6 h-6 flex items-center justify-center text-[#5a4a42] hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="terminal-body p-3 h-64 overflow-y-auto bg-[#f8e0d5] flex">
              {/* ASCII Art Column */}
              <div className="w-1/3 pr-2 border-r border-[#d4b8a8] flex flex-col">
                <pre className="text-xs terminal-font text-[#5a4a42] flex-1">
                  <EarthSpinnerCanvas />
                </pre>
                <div className="text-xs text-[#a38b7a] italic mt-auto">
                  AmanOS v1.0
                </div>
              </div>
              
              {/* Terminal Content Column */}
              <div className="w-2/3 pl-2 flex flex-col">
                <pre className="whitespace-pre-wrap break-words text-xs terminal-font flex-1">
                  {terminalOutput.join('\n')}
                </pre>
                <div ref={terminalEndRef} className="flex items-center border-t border-[#d4b8a8] pt-1">
                  <span className="text-[#5a4a42] mr-2">{'>'}</span>
                  <form onSubmit={handleTerminalSubmit} className="flex-1">
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      className="w-full bg-[#f8e0d5] text-[#5a4a42] border-none outline-none terminal-font text-xs"
                      autoFocus
                    />
                  </form>
                </div>
              </div>
            </div>
            
            <div className="terminal-footer bg-[#e8a87c] p-1 text-xs text-center border-t border-[#d4b8a8]">
              By filling out this form, you consent to the collection and use of your information.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}