import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../App';

export const teamData = [
  { id: 'tea-gotsiridze', name: { ka: 'თეა გოცირიძე', en: 'Tea Gotsiridze' }, role: { ka: 'კლინიკის ხელმძღვანელი / იმპლანტოლოგი', en: 'Clinic Head / Implantologist' }, image: 'https://framerusercontent.com/images/NL9ZihxOkco4TeWtDDi8fz20.jpg' },
  { id: 'giorgi-beridze', name: { ka: 'გიორგი ბერიძე', en: 'Giorgi Beridze' }, role: { ka: 'თერაპევტი / ორთოდონტი', en: 'Therapist / Orthodontist' }, image: 'https://framerusercontent.com/images/Es82GeniQfvbrLe8GIg5ctOEq6M.jpg' },
  { id: 'nino-kapanadze', name: { ka: 'ნინო კაპანაძე', en: 'Nino Kapanadze' }, role: { ka: 'ბავშვთა სტომატოლოგი', en: 'Pediatric Dentist' }, image: 'https://framerusercontent.com/images/0JhnuSVKqzhBvoFbmldufpEA.jpg' },
  { id: 'david-makharadze', name: { ka: 'დავით მახარაძე', en: 'David Makharadze' }, role: { ka: 'ყბა-სახის ქირურგი', en: 'Maxillofacial Surgeon' }, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800' },
];

const TeamPage: React.FC = () => {
  const context = useContext(LanguageContext);
  if (!context) return null;
  const { lang, siteData, team } = context;
  const t = siteData[lang];

  return (
    <div className="py-12 md:py-24 px-4 md:px-10 max-w-[1440px] mx-auto bg-white min-h-screen">
      <div className="text-center mb-16 md:mb-24">
        <h1 className="text-4xl md:text-8xl font-bold text-gray-900 uppercase mb-4 tracking-tighter">{t.teamPage.title}</h1>
        <p className="text-base md:text-xl text-[#005a5a] max-w-2xl mx-auto font-bold uppercase tracking-widest">{t.teamPage.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {team.map((member) => (
          <Link key={member.id} to={`/team/${member.id}`} className="group block">
            <div className="relative h-[400px] rounded-[2rem] overflow-hidden mb-4 shadow-sm group-hover:shadow-2xl transition-all duration-500">
              <img src={member.image} alt={member.name[lang]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-110 transition-all duration-700" />
            </div>
            <div className="px-2 text-center">
              <h3 className="text-xl font-bold text-gray-900 uppercase group-hover:text-[#005a5a] transition-colors">{member.name[lang]}</h3>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">{member.role[lang]}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;