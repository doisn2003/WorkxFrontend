import { useState } from 'react'
import { Send, MessageSquare, Users, Settings, Search, MoreVertical, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [activeTab, setActiveTab] = useState('chats')

  return (
    <div className="flex w-full h-full bg-[#0f172a] text-slate-200">
      {/* Navigation Rail */}
      <div className="w-20 flex flex-col items-center py-8 bg-[#020617] border-r border-slate-800/50">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-indigo-500/20">
          <MessageSquare className="text-white" size={24} />
        </div>
        
        <nav className="flex flex-col gap-6">
          <NavIcon icon={<MessageSquare size={22} />} active={activeTab === 'chats'} onClick={() => setActiveTab('chats')} />
          <NavIcon icon={<Users size={22} />} active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <NavIcon icon={<Settings size={22} />} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>
        
        <div className="mt-auto">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
          </div>
        </div>
      </div>

      {/* Sidebar - Contacts List */}
      <div className="w-80 bg-[#0f172a] border-r border-slate-800/50 flex flex-col">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold font-outfit">Messages</h1>
            <button className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg hover:bg-indigo-600/20 transition-colors">
              <Plus size={20} />
            </button>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          <div className="flex flex-col gap-1">
            <ChatItem name="Alex Rivera" message="Hey, did you see the new update?" time="12:45 PM" unread={2} active={true} />
            <ChatItem name="Sarah Chen" message="Let's sync up later today" time="11:20 AM" unread={0} />
            <ChatItem name="Jordan Smith" message="The design looks amazing!" time="Yesterday" unread={0} />
            <ChatItem name="Work Group" message="Michael: Meeting moved to 3 PM" time="Yesterday" unread={0} />
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0f172a]">
        {/* Chat Header */}
        <div className="h-20 px-8 flex items-center justify-between border-b border-slate-800/50 glass">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-slate-800 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="avatar" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0f172a] rounded-full"></div>
            </div>
            <div>
              <h2 className="font-semibold text-slate-100">Alex Rivera</h2>
              <p className="text-xs text-emerald-500">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Search size={20} className="hover:text-slate-200 cursor-pointer" />
            <MoreVertical size={20} className="hover:text-slate-200 cursor-pointer" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
          <Message text="Hey! How's the project going?" sent={false} time="12:40 PM" />
          <Message text="It's going great. Just finished the real-time chat module initialization." sent={true} time="12:42 PM" />
          <Message text="That's awesome! Does it use Vite?" sent={false} time="12:44 PM" />
          <Message text="Yes, Vite + React + TypeScript. The performance is incredible. ⚡" sent={true} time="12:45 PM" />
        </div>

        {/* Input Area */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto flex items-center gap-4 bg-slate-900/50 border border-slate-800 rounded-2xl p-2 pl-4 focus-within:border-indigo-500/50 transition-all">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2"
            />
            <button className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function NavIcon({ icon, active, onClick }: { icon: React.ReactNode, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`p-3 rounded-xl transition-all duration-300 relative group ${
        active ? 'bg-indigo-600/10 text-indigo-500' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
      }`}
    >
      {icon}
      {active && (
        <motion.div 
          layoutId="nav-pill"
          className="absolute -left-[33px] w-1 h-8 bg-indigo-500 rounded-r-full"
        />
      )}
    </button>
  )
}

function ChatItem({ name, message, time, unread, active }: { name: string, message: string, time: string, unread: number, active?: boolean }) {
  return (
    <div className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 group ${
      active ? 'bg-indigo-600/10 border border-indigo-500/20' : 'hover:bg-slate-800/30 border border-transparent'
    }`}>
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex-shrink-0 overflow-hidden">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt={name} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className={`font-semibold text-sm truncate ${active ? 'text-indigo-400' : 'text-slate-200'}`}>{name}</h3>
            <span className="text-[10px] text-slate-500 whitespace-nowrap">{time}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-400 truncate pr-2">{message}</p>
            {unread > 0 && (
              <span className="w-5 h-5 bg-indigo-600 text-[10px] flex items-center justify-center rounded-full text-white font-bold">
                {unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Message({ text, sent, time }: { text: string, sent: boolean, time: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${sent ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[70%] group`}>
        <div className={`p-4 rounded-2xl text-sm shadow-sm ${
          sent 
            ? 'bg-indigo-600 text-white rounded-tr-none' 
            : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50'
        }`}>
          {text}
        </div>
        <p className={`text-[10px] mt-1 text-slate-500 ${sent ? 'text-right' : 'text-left'}`}>
          {time}
        </p>
      </div>
    </motion.div>
  )
}

export default App
