
import React, { useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';

const TeamMemberPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const context = useContext(LanguageContext);
  if (!context) return null;
  const { lang, team } = context;
  const member = team.find(m => m.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!member) return null;

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10">
        <button onClick={() => navigate('/team')} className="flex items-center gap-3 text-gray-400 hover:text-[#005a5a] font-bold uppercase text-xs tracking-widest transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          {lang === 'ka' ? 'ყველა წევრი' : 'All members'}
        </button>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-10 grid lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-5">
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
            <img src={member.image} alt={member.name[lang]} className="w-full aspect-[4/5] object-cover" />
          </div>
        </div>

        <div className="lg:col-span-7 pt-8">
          <span className="text-[#005a5a] font-bold uppercase tracking-[0.3em] text-sm block mb-4">{lang === 'ka' ? 'პროფესიონალი' : 'Professional'}</span>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 uppercase tracking-tighter mb-4 leading-none">{member.name[lang]}</h1>
          <p className="text-2xl text-gray-400 font-medium uppercase mb-12">{member.role[lang]}</p>

          <div className="space-y-12 max-w-3xl">
            {member.bio?.[lang] && (
              <div>
                <h4 className="text-[#005a5a] font-bold uppercase text-xs tracking-widest mb-6 border-b border-[#005a5a]/10 pb-2">{lang === 'ka' ? 'მოკლე მიმოხილვა' : 'Brief Overview'}</h4>
                <p className="text-lg text-gray-600 leading-relaxed font-medium whitespace-pre-line">{member.bio[lang]}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-10">
              {member.education?.[lang] && (
                <div>
                  <h4 className="text-[#005a5a] font-bold uppercase text-xs tracking-widest mb-6 border-b border-[#005a5a]/10 pb-2">{lang === 'ka' ? 'განათლება' : 'Education'}</h4>
                  <p className="text-gray-600 font-medium whitespace-pre-line">{member.education[lang]}</p>
                </div>
              )}
              {member.specialization?.[lang] && (
                <div>
                  <h4 className="text-[#005a5a] font-bold uppercase text-xs tracking-widest mb-6 border-b border-[#005a5a]/10 pb-2">{lang === 'ka' ? 'სპეციალიზაცია' : 'Specialization'}</h4>
                  <p className="text-gray-600 font-medium whitespace-pre-line">{member.specialization[lang]}</p>
                </div>
              )}
            </div>

            <div className="pt-8">
              <Link to="/contact" className="inline-block bg-[#005a5a] text-white px-12 py-5 rounded-2xl font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-[#005a5a]/20">
                {lang === 'ka' ? 'ჩაეწერეთ ვიზიტზე' : 'Book a visit with'} {member.name[lang].split(' ')[0]}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberPage;
