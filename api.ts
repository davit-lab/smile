
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://zgvdmiabgbutfcsaqysc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpndmRtaWFiZ2J1dGZjc2FxeXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjAzNjEsImV4cCI6MjA4NjYzNjM2MX0.G9_dWZX6G91-nDExAS3aot1Jceio3SIYWD7XBjpUc-A';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const API = {
  async getContent(defaults: any) {
    try {
      const { data, error } = await supabase.from('site_content').select('*').eq('id', 1).single();
      if (error || !data) throw error;
      return {
        ka: { ...defaults.ka, ...data.ka_data },
        en: { ...defaults.en, ...data.en_data }
      };
    } catch (e) {
      return defaults;
    }
  },

  async updateContent(data: any) {
    try {
      const { error } = await supabase.from('site_content').update({
        ka_data: data.ka,
        en_data: data.en,
        updated_at: new Date().toISOString()
      }).eq('id', 1);
      return { ok: !error };
    } catch (e) { return { ok: false }; }
  },

  async getTeam(defaults: any[]) {
    try {
      const { data, error } = await supabase.from('team_members').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) {
        return data.map(m => ({
          id: m.id,
          name: { ka: m.name_ka, en: m.name_en },
          role: { ka: m.role_ka, en: m.role_en },
          image: m.image_url,
          bio: { ka: m.bio_ka || '', en: m.bio_en || '' },
          education: { ka: m.education_ka || '', en: m.education_en || '' },
          specialization: { ka: m.specialization_ka || '', en: m.specialization_en || '' }
        }));
      }
    } catch (e) {}
    return defaults;
  },

  async updateTeam(teamData: any[]) {
    try {
      // Clean up and insert updated team
      await supabase.from('team_members').delete().neq('name_ka', '_TEMP_');
      const toInsert = teamData.map(m => ({
        name_ka: m.name.ka,
        name_en: m.name.en,
        role_ka: m.role.ka,
        role_en: m.role.en,
        image_url: m.image,
        bio_ka: m.bio?.ka || '',
        bio_en: m.bio?.en || '',
        education_ka: m.education?.ka || '',
        education_en: m.education?.en || '',
        specialization_ka: m.specialization?.ka || '',
        specialization_en: m.specialization?.en || ''
      }));
      const { error } = await supabase.from('team_members').insert(toInsert);
      return { ok: !error };
    } catch (e) { return { ok: false }; }
  },

  async getBlogPosts() {
    try {
      const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data.map(p => ({
        id: p.slug,
        title: { ka: p.title_ka, en: p.title_en },
        content: { ka: p.content_ka, en: p.content_en },
        category: { ka: p.category_ka, en: p.category_en },
        excerpt: { ka: p.excerpt_ka, en: p.excerpt_en },
        image: p.image_url,
        date: p.post_date
      }));
    } catch (e) { return []; }
  },

  async updateBlogPosts(posts: any[]) {
    try {
      await supabase.from('blog_posts').delete().neq('slug', '_TEMP_');
      const toInsert = posts.map(p => ({
        slug: p.id,
        title_ka: p.title.ka,
        title_en: p.title.en,
        content_ka: p.content.ka,
        content_en: p.content.en,
        category_ka: p.category.ka,
        category_en: p.category.en,
        excerpt_ka: p.excerpt.ka,
        excerpt_en: p.excerpt.en,
        image_url: p.image,
        post_date: p.date
      }));
      const { error } = await supabase.from('blog_posts').insert(toInsert);
      return { ok: !error };
    } catch (e) { return { ok: false }; }
  },

  async getLeads() {
    try {
      const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      return data || [];
    } catch (e) { return []; }
  },

  async createLead(lead: any) {
    try {
      const { error } = await supabase.from('leads').insert([{
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        doctor: lead.doctor,
        concern: lead.concern,
        message: lead.message,
        date: lead.date
      }]);
      return { ok: !error };
    } catch (e) { return { ok: false }; }
  },

  async deleteLead(id: any) {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    return { ok: !error };
  }
};
