
import React, { useState, useContext, useCallback } from 'react';
import { LanguageContext } from '../App';
import { API } from '../api';

const AdminPage: React.FC = () => {
  const context = useContext(LanguageContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ user: '', pass: '' });
  const [activeTab, setActiveTab] = useState<'about' | 'team' | 'pricing' | 'blog' | 'leads'>('blog');
  const [isSaving, setIsSaving] = useState(false);
  const [saveNote, setSaveNote] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  if (!context) return null;
  const { siteData, setSiteData, team, setTeam, blogPosts, setBlogPosts, leads, setLeads } = context;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.user === 'smile' && loginData.pass === 'smile2026') setIsLoggedIn(true);
    else alert('წვდომა უარყოფილია!');
  };

  const notify = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setSaveNote({ text, type });
    setTimeout(() => setSaveNote(null), 4000);
  };

  const publishData = async () => {
    setIsSaving(true);
    try {
      const res = await Promise.all([
        API.updateContent(siteData),
        API.updateTeam(team),
        API.updateBlogPosts(blogPosts)
      ]);
      if (res.every(r => r.ok)) notify('მონაცემები დასინქრონირდა!');
      else notify('ზოგიერთი მონაცემი ვერ აიტვირთა', 'error');
    } catch (e) { notify('კავშირის შეცდომა', 'error'); }
    finally { setIsSaving(false); }
  };

  const updateNested = useCallback((path: string, value: any) => {
    setSiteData((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return next;
    });
  }, [setSiteData]);

  const InputPair = ({ label, path, isTextArea = false }: { label: string, path: string, isTextArea?: boolean }) => {
    const getVal = (lang: string) => {
      const keys = path.split('.');
      let cur = siteData[lang];
      for (const k of keys) { if (!cur || !cur[k]) return ""; cur = cur[k]; }
      return cur;
    };
    return (
      <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-4">
        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] ml-2">{label}</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-teal-600 uppercase tracking-widest ml-1">KA</label>
            {isTextArea ? <textarea value={getVal('ka')} onChange={e => updateNested(`ka.${path}`, e.target.value)} rows={4} className="w-full p-4 bg-gray-50 rounded-xl font-medium outline-none border border-transparent focus:border-teal-100" /> : <input value={getVal('ka')} onChange={e => updateNested(`ka.${path}`, e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none border border-transparent focus:border-teal-100" />}
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-orange-600 uppercase tracking-widest ml-1">EN</label>
            {isTextArea ? <textarea value={getVal('en')} onChange={e => updateNested(`en.${path}`, e.target.value)} rows={4} className="w-full p-4 bg-gray-50 rounded-xl font-medium outline-none border border-transparent focus:border-orange-100" /> : <input value={getVal('en')} onChange={e => updateNested(`en.${path}`, e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none border border-transparent focus:border-orange-100" />}
          </div>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
      <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl w-full max-w-lg text-center">
        <img src="https://framerusercontent.com/images/0RLn6DL4qHZwAL47gzRU28dnWk.png" className="h-12 mx-auto mb-12" alt="Logo" />
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 text-gray-900">Admin Control Panel</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <input type="text" className="w-full p-5 bg-gray-50 rounded-2xl font-bold outline-none" placeholder="Username" onChange={e => setLoginData({...loginData, user: e.target.value})} />
          <input type="password" className="w-full p-5 bg-gray-50 rounded-2xl font-bold outline-none" placeholder="Password" onChange={e => setLoginData({...loginData, pass: e.target.value})} />
          <button className="w-full py-6 bg-[#005a5a] text-white font-black rounded-2xl uppercase tracking-[0.2em] hover:bg-black transition-all">ავტორიზაცია</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <div className="w-80 bg-[#0c0c0c] flex flex-col fixed h-full z-[100] shadow-2xl">
        <div className="p-10 border-b border-white/5">
          <img src="https://framerusercontent.com/images/0RLn6DL4qHZwAL47gzRU28dnWk.png" className="h-8 brightness-0 invert" alt="Logo" />
        </div>
        <nav className="flex-1 p-6 space-y-1 overflow-y-auto hide-scrollbar">
          {['about', 'team', 'pricing', 'blog', 'leads'].map(id => (
            <button key={id} onClick={() => setActiveTab(id as any)} className={`w-full flex items-center gap-5 p-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === id ? 'bg-[#005a5a] text-white' : 'text-white/30 hover:text-white'}`}>
              {id.toUpperCase()}
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-white/5">
          <button onClick={publishData} disabled={isSaving} className="w-full py-5 bg-orange-500 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-2xl hover:bg-orange-600 transition-all">
             {isSaving ? 'იტვირთება...' : '🚀 PUSH TO CLOUD'}
          </button>
        </div>
      </div>

      <div className="flex-1 ml-80 p-12 lg:p-24 min-h-screen">
        <div className="max-w-5xl mx-auto space-y-12">
          {saveNote && (
            <div className={`fixed top-10 right-10 p-6 rounded-2xl text-white font-black uppercase text-xs tracking-widest z-[2000] shadow-2xl animate-bounce ${saveNote.type === 'success' ? 'bg-[#005a5a]' : 'bg-red-500'}`}>
              {saveNote.text}
            </div>
          )}

          <div className="flex justify-between items-end">
            <h1 className="text-6xl font-black text-gray-900 uppercase tracking-tighter">{activeTab}</h1>
          </div>

          {activeTab === 'about' && (
            <div className="space-y-6">
              <InputPair label="About Section Title" path="aboutComp.title" />
              <InputPair label="About Section Description" path="aboutComp.desc" isTextArea={true} />
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="space-y-10">
              <button 
                onClick={() => setBlogPosts([{
                  id: 'new-post-' + Date.now(),
                  title: { ka: '', en: '' },
                  category: { ka: 'სიახლე', en: 'News' },
                  date: new Date().toLocaleDateString('ka-GE'),
                  image: '',
                  excerpt: { ka: '', en: '' },
                  content: { ka: '', en: '' }
                }, ...blogPosts])} 
                className="px-8 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#005a5a] transition-all"
              >
                + ახალი სტატია
              </button>

              <div className="space-y-12">
                {blogPosts.map((post, idx) => (
                  <div key={post.id} className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-8">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-6">
                       <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">სტატია #{blogPosts.length - idx}</span>
                       <button onClick={() => setBlogPosts(blogPosts.filter(p => p.id !== post.id))} className="text-red-400 font-bold uppercase text-[9px] tracking-widest hover:text-red-600 transition-colors">წაშლა</button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-6">
                          <label className="text-[9px] font-black text-teal-600 uppercase block tracking-widest">ქართული ვერსია (KA)</label>
                          <input value={post.title.ka} onChange={e => { const np = [...blogPosts]; np[idx].title.ka = e.target.value; setBlogPosts(np); }} className="w-full p-4 bg-gray-50 rounded-xl font-black outline-none" placeholder="სათაური" />
                          <input value={post.category.ka} onChange={e => { const np = [...blogPosts]; np[idx].category.ka = e.target.value; setBlogPosts(np); }} className="w-full p-4 bg-gray-50 rounded-xl font-bold text-xs" placeholder="კატეგორია" />
                          <textarea value={post.excerpt.ka} onChange={e => { const np = [...blogPosts]; np[idx].excerpt.ka = e.target.value; setBlogPosts(np); }} className="w-full p-4 bg-gray-50 rounded-xl font-medium text-sm" placeholder="მოკლე აღწერა" rows={3} />
                          <textarea value={post.content.ka} onChange={e => { const np = [...blogPosts]; np[idx].content.ka = e.target.value; setBlogPosts(np); }} className="w-full p-4 bg-gray-50 rounded-xl font-medium text-sm" placeholder="სრული ტექსტი" rows={8} />
                       </div>
                       <div className="space-y-6">
                          <label className="text-[9px] font-black text-orange-600 uppercase block tracking-widest">English Version (EN)</label>
                          <input value={post.title.en} onChange={e => { const np = [...blogPosts]; np[idx].title.en = e.target.value; setBlogPosts(np); }} className="w-full p-4 bg-orange-50/30 rounded-xl font-black outline-none" placeholder="Title" />
                          <input value={post.category.en} onChange={e => { const np = [...blogPosts]; np[idx].category.en = e.target.value; setBlogPosts(np); }} className="w-full p-4 bg-orange-50/30 rounded-xl font-bold text-xs" placeholder="Category" />
                          <textarea value={post.excerpt.en} onChange={e => { const np = [...blogPosts]; np[idx].excerpt.en = e.target.value; setBlogPosts(np); }} className="w-full p-4 bg-orange-50/30 rounded-xl font-medium text-sm" placeholder="Short Excerpt" rows={3} />
                          <textarea value={post.content.en} onChange={e => { const np = [...blogPosts]; np[idx].content.en = e.target.value; setBlogPosts(np); }} className="w-full p-4 bg-orange-50/30 rounded-xl font-medium text-sm" placeholder="Full Content" rows={8} />
                       </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pt-4">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">სურათის ლინკი</label>
                          <input value={post.image} onChange={e => { const np = [...blogPosts]; np[idx].image = e.target.value; setBlogPosts(np); }} className="w-full p-4 bg-gray-50 rounded-xl font-mono text-xs" placeholder="https://..." />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">თარიღი</label>
                          <input value={post.date} onChange={e => { const np = [...blogPosts]; np[idx].date = e.target.value; setBlogPosts(np); }} className="w-full p-4 bg-gray-50 rounded-xl font-bold text-xs" placeholder="მაგ: 12 თებერვალი, 2026" />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-10">
              <button onClick={() => setTeam([...team, { id: Date.now().toString(), name: {ka: '', en: ''}, role: {ka: '', en: ''}, image: '', bio: {ka: '', en: ''}, education: {ka: '', en: ''}, specialization: {ka: '', en: ''} }])} className="px-8 py-3 bg-black text-white rounded-full font-black text-[10px] uppercase">+ ახალი ექიმი</button>
              {team.map((m, idx) => (
                <div key={m.id} className="bg-white p-10 rounded-[4rem] border border-gray-100 shadow-sm space-y-6">
                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[9px] font-black text-teal-600 uppercase">Georgian Info</label>
                        <input value={m.name.ka} onChange={e => { const nt = [...team]; nt[idx].name.ka = e.target.value; setTeam(nt); }} className="w-full p-4 bg-gray-50 rounded-xl font-black" placeholder="სახელი (KA)" />
                        <textarea value={m.bio?.ka} onChange={e => { const nt = [...team]; if(!nt[idx].bio) nt[idx].bio={ka:'',en:''}; nt[idx].bio.ka = e.target.value; setTeam(nt); }} className="w-full p-4 bg-gray-50 rounded-xl" placeholder="ბიოგრაფია (KA)" rows={3} />
                        <textarea value={m.education?.ka} onChange={e => { const nt = [...team]; if(!nt[idx].education) nt[idx].education={ka:'',en:''}; nt[idx].education.ka = e.target.value; setTeam(nt); }} className="w-full p-4 bg-gray-50 rounded-xl" placeholder="განათლება (KA)" rows={2} />
                        <textarea value={m.specialization?.ka} onChange={e => { const nt = [...team]; if(!nt[idx].specialization) nt[idx].specialization={ka:'',en:''}; nt[idx].specialization.ka = e.target.value; setTeam(nt); }} className="w-full p-4 bg-gray-50 rounded-xl" placeholder="სპეციალიზაცია (KA)" rows={2} />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[9px] font-black text-orange-600 uppercase">English Info</label>
                        <input value={m.name.en} onChange={e => { const nt = [...team]; nt[idx].name.en = e.target.value; setTeam(nt); }} className="w-full p-4 bg-orange-50/30 rounded-xl font-black" placeholder="Name (EN)" />
                        <textarea value={m.bio?.en} onChange={e => { const nt = [...team]; if(!nt[idx].bio) nt[idx].bio={ka:'',en:''}; nt[idx].bio.en = e.target.value; setTeam(nt); }} className="w-full p-4 bg-orange-50/30 rounded-xl" placeholder="Bio (EN)" rows={3} />
                        <textarea value={m.education?.en} onChange={e => { const nt = [...team]; if(!nt[idx].education) nt[idx].education={ka:'',en:''}; nt[idx].education.en = e.target.value; setTeam(nt); }} className="w-full p-4 bg-orange-50/30 rounded-xl" placeholder="Education (EN)" rows={2} />
                        <textarea value={m.specialization?.en} onChange={e => { const nt = [...team]; if(!nt[idx].specialization) nt[idx].specialization={ka:'',en:''}; nt[idx].specialization.en = e.target.value; setTeam(nt); }} className="w-full p-4 bg-orange-50/30 rounded-xl" placeholder="Specialization (EN)" rows={2} />
                     </div>
                  </div>
                  <input value={m.image} onChange={e => { const nt = [...team]; nt[idx].image = e.target.value; setTeam(nt); }} className="w-full p-4 bg-gray-50 rounded-xl font-mono text-xs" placeholder="Image URL" />
                  <button onClick={() => { if(confirm('ნამდვილად გსურთ წაშლა?')) setTeam(team.filter(x => x.id !== m.id))}} className="text-red-400 font-bold uppercase text-[10px] hover:text-red-600 transition-colors">ექიმის წაშლა</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-10">
              <InputPair label="Price Page Header" path="pricePage.heroTitle" />
              {siteData.ka.pricePage.categories.map((cat: any, cIdx: number) => (
                <div key={cIdx} className="bg-white p-10 rounded-[4rem] shadow-sm border border-gray-100 space-y-6">
                  <InputPair label="Category Name" path={`pricePage.categories.${cIdx}.name`} />
                  <div className="space-y-3">
                    {cat.items.map((item: any, iIdx: number) => (
                      <div key={iIdx} className="grid grid-cols-12 gap-4">
                        <input className="col-span-8 p-4 bg-gray-50 rounded-xl font-bold" value={item.n} onChange={e => {
                          const nData = JSON.parse(JSON.stringify(siteData));
                          nData.ka.pricePage.categories[cIdx].items[iIdx].n = e.target.value;
                          nData.en.pricePage.categories[cIdx].items[iIdx].n = e.target.value;
                          setSiteData(nData);
                        }} placeholder="სერვისის სახელი" />
                        <input className="col-span-3 p-4 bg-gray-50 rounded-xl font-black text-teal-600" value={item.p} onChange={e => {
                          const nData = JSON.parse(JSON.stringify(siteData));
                          nData.ka.pricePage.categories[cIdx].items[iIdx].p = e.target.value;
                          nData.en.pricePage.categories[cIdx].items[iIdx].p = e.target.value;
                          setSiteData(nData);
                        }} placeholder="ფასი" />
                        <button className="col-span-1 text-red-300 font-bold hover:text-red-600 transition-colors" onClick={() => {
                          const nData = JSON.parse(JSON.stringify(siteData));
                          nData.ka.pricePage.categories[cIdx].items.splice(iIdx, 1);
                          nData.en.pricePage.categories[cIdx].items.splice(iIdx, 1);
                          setSiteData(nData);
                        }}>X</button>
                      </div>
                    ))}
                    <button className="w-full py-4 bg-teal-50 text-teal-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-teal-100 transition-all" onClick={() => {
                       const nData = JSON.parse(JSON.stringify(siteData));
                       nData.ka.pricePage.categories[cIdx].items.push({n: 'ახალი სერვისი', p: '0₾'});
                       nData.en.pricePage.categories[cIdx].items.push({n: 'New Service', p: '0₾'});
                       setSiteData(nData);
                    }}>+ ახალი ფასის დამატება</button>
                  </div>
                </div>
              ))}
              <button onClick={() => {
                  const nData = JSON.parse(JSON.stringify(siteData));
                  nData.ka.pricePage.categories.push({ name: 'ახალი კატეგორია', items: [] });
                  nData.en.pricePage.categories.push({ name: 'New Category', items: [] });
                  setSiteData(nData);
              }} className="w-full py-6 bg-black text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-[#005a5a] transition-all">
                + ახალი კატეგორიის დამატება
              </button>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-gray-100">
               <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">პაციენტი</th>
                      <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">ექიმი და ჩივილი</th>
                      <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">თარიღი</th>
                      <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">ქმედება</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leads.map(l => (
                      <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-8">
                          <p className="font-black text-gray-900">{l.name}</p>
                          <p className="text-xs text-[#005a5a] font-bold mt-1">{l.phone}</p>
                        </td>
                        <td className="p-8">
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Dr. {l.doctor}</p>
                          <p className="text-sm italic text-gray-600 mt-2">"{l.concern}"</p>
                        </td>
                        <td className="p-8 text-xs font-bold text-gray-400">{l.date}</td>
                        <td className="p-8">
                          <button onClick={() => { if(confirm('ნამდვილად გსურთ ამ ჯავშნის წაშლა?')) API.deleteLead(l.id).then(() => setLeads(leads.filter(x => x.id !== l.id))) }} className="text-red-400 font-bold text-[10px] uppercase hover:text-red-600 transition-colors">წაშლა</button>
                        </td>
                      </tr>
                    ))}
                    {leads.length === 0 && (
                      <tr><td colSpan={4} className="p-20 text-center text-gray-300 font-black uppercase tracking-widest text-xs">ჯავშნები ჯერ არ არის</td></tr>
                    )}
                  </tbody>
               </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
