import { useState } from 'react';
import { Bot, Send } from 'lucide-react';
import { api } from '../utils/api.js';

export default function Chatbot() {
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Namaste! Ask me about schedules, tankers, complaints, or water-saving tips.' }]);
  const [question, setQuestion] = useState('');
  const ask = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    const q = question;
    setQuestion('');
    setMessages((m) => [...m, { from: 'user', text: q }]);
    try {
      const { data } = await api.post('/chat', { question: q });
      setMessages((m) => [...m, { from: 'bot', text: data.answer }]);
    } catch {
      setMessages((m) => [...m, { from: 'bot', text: 'Offline demo: please check the schedule or complaint pages for details.' }]);
    }
  };
  return <div className="glass-card p-4">
    <h3 className="mb-3 flex items-center gap-2 font-black"><Bot className="text-jal-600" /> AI JalMitra</h3>
    <div className="max-h-64 space-y-2 overflow-auto">{messages.map((m, i) => <div key={i} className={`rounded-2xl p-3 text-sm ${m.from === 'bot' ? 'bg-sky-50 dark:bg-slate-800' : 'ml-8 bg-jal-600 text-white'}`}>{m.text}</div>)}</div>
    <form onSubmit={ask} className="mt-3 flex gap-2"><input className="input" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask JalMitra..." /><button className="btn-primary !px-4"><Send size={18} /></button></form>
  </div>;
}
