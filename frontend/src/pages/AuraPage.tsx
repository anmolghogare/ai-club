import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const teamMembers = [
  { name: 'Vedant Shah' },
  { name: 'Parth Agrawal' },
  { name: 'Aditya Vaish' },
  { name: 'Nisarg Trivedi' },
  { name: 'Madhav Thesiya' },
  { name: 'Meet Virugama' },
  { name: 'Khushi Gandhi' },
  { name: 'Kaveesha Gupta' },
  { name: 'Bhagyashree Khemwani' },
  { name: 'Dhruvam Panchal' },
  { name: 'Manal Patel' },
  { name: 'Shlok Diwan' },
  { name: 'Om Patel' },
  { name: 'Pushkar Patel' },
];

const facultyMembers = [
  { name: 'Prof. G. Venkatesh', role: 'Vision' },
  { name: 'Prof. Arpit Rana', role: 'System Architecture & Project Supervision' },
  { name: 'Mr. Ashwin Chaudhary', role: 'Infrastructure Setup' },
];

const AuraPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7f0] to-[#fff0e0] text-slate-900 pt-24 pb-20 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-12 transition-colors">
          <ArrowLeft size={20} /> Back to Home
        </Link>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-24"
        >
          <img src="/aura-logo.png" alt="AURA Logo" className="w-64 md:w-80 h-auto object-contain mb-8 drop-shadow-xl" />
          
          <div className="border-2 border-orange-500 rounded-full px-6 md:px-10 py-3 bg-white/50 backdrop-blur-sm shadow-sm inline-block">
            <h2 className="text-lg md:text-xl font-bold">
              One Assistant for <span className="text-orange-500">Everything at DAU</span>
            </h2>
            <p className="text-sm md:text-base text-slate-600 mt-1">
              Built by <span className="text-orange-500 font-semibold">students</span>, for <span className="text-orange-500 font-semibold">everyone</span>.
            </p>
          </div>
        </motion.div>

        {/* The Builders Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="border-2 border-orange-400 rounded-2xl p-6 md:p-8 bg-white/60 backdrop-blur-md mb-12 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="uppercase tracking-widest text-sm font-semibold text-slate-500 mb-1">The Builders</p>
              <h2 className="text-3xl font-bold">Development Team</h2>
            </div>
            <p className="text-orange-500 font-medium text-center md:text-right max-w-md">
              Fourteen students across carried AURA from idea to something the whole campus can rely on.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
            {teamMembers.map((member, idx) => (
              <motion.div 
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full border-4 border-orange-400/30 p-1 mb-4 bg-gradient-to-br from-orange-100 to-orange-50 shadow-inner flex items-center justify-center">
                  <span className="text-3xl font-black text-orange-400/50">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-semibold text-sm">{member.name}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Guidance Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="border-2 border-orange-400 rounded-2xl p-6 md:p-8 bg-white/60 backdrop-blur-md mb-12 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="uppercase tracking-widest text-sm font-semibold text-slate-500 mb-1">Guidance</p>
              <h2 className="text-3xl font-bold">Faculty & Mentors</h2>
            </div>
            <p className="text-orange-500 font-medium text-center md:text-right max-w-md">
              The people who set AURA's direction and kept its architecture honest.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start bg-white/40 p-8 rounded-3xl border border-orange-200/50 backdrop-blur-sm">
            <div className="space-y-10">
              {facultyMembers.map((faculty) => (
                <div key={faculty.name} className="flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="w-24 h-24 rounded-full border-4 border-orange-400 p-1 mb-4 bg-white flex items-center justify-center overflow-hidden">
                    <span className="text-2xl font-black text-slate-300">
                      {faculty.name.split(' ').slice(1).map(n => n[0]).join('').replace('.', '')}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-orange-500">{faculty.name}</h3>
                  <p className="text-sm font-medium text-slate-700">{faculty.role}</p>
                </div>
              ))}
            </div>

            <div className="md:border-l-2 md:border-orange-200 md:pl-12 pt-4">
              <h3 className="text-xl font-bold text-orange-500 mb-6 uppercase tracking-wide">A Note From Them</h3>
              <div className="space-y-6 text-lg text-slate-800 leading-relaxed font-medium">
                <p>
                  From day-to-day searches to timetable confusion, AURA brings everything students need at DAU into one intelligent assistant.
                </p>
                <p>
                  This is only <strong>Version 1.</strong> More capabilities, more team members, and more faculty mentors will shape what comes next.
                </p>
                <div className="pt-6">
                  <p className="text-orange-500 font-bold">Faculty & Mentors</p>
                  <p className="text-slate-600">AURA - Dhirubhai Ambani University</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AuraPage;
