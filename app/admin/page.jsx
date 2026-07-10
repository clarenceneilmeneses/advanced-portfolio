'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import GridLayout from 'react-grid-layout/legacy';
import {
  Header, About, Highlights, Experience, TechStack, Projects, Certifications,
  MembershipCard, SocialLinkCard,
} from '@/components/sections';
import Gallery from '@/components/Gallery';
import BentoGrid from '@/components/BentoGrid';
import { DEFAULT_LAYOUT, accentStyle, renderSection } from '@/components/portfolioSections';
import {
  LogOut, Plus, Trash2, Save, Loader2, Upload, ExternalLink,
  Check, GripVertical, EyeOff, LayoutDashboard, RefreshCw,
  UserRound, LayoutGrid, Globe, Cpu, FolderKanban, Briefcase, Award,
  Sparkles, Users, Share2, Image as ImageIcon,
  Sun, Moon, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Collection definitions
// ---------------------------------------------------------------------------
const COLLECTIONS = [
  {
    key: 'tech_stack', label: 'Tech Stack', titleField: 'name',
    fields: [
      { name: 'category', label: 'Category', placeholder: 'Frontend / Backend / DevOps & Cloud' },
      { name: 'name', label: 'Name' },
      { name: 'featured', label: 'Show on home page', type: 'bool', default: true },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  {
    key: 'projects', label: 'Projects', titleField: 'title', hasBlocks: true,
    fields: [
      { name: 'title', label: 'Title' },
      { name: 'description', label: 'Short description', type: 'textarea', rows: 2 },
      { name: 'url', label: 'Live URL' },
      { name: 'display_url', label: 'Display URL', placeholder: 'codecred.dev' },
      { name: 'slug', label: 'Slug (case-study URL: /projects/slug)', placeholder: 'codecred' },
      { name: 'published', label: 'Case study visible to the public', type: 'bool' },
      { name: 'cover_image_url', label: 'Cover image', type: 'image' },
      { name: 'tech', label: 'Tech used (comma-separated)', placeholder: 'Next.js, Node.js, PostgreSQL' },
      { name: 'featured', label: 'Show on home page', type: 'bool', default: true },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  {
    key: 'experiences', label: 'Experience', titleField: 'title',
    fields: [
      { name: 'title', label: 'Title' },
      { name: 'organization', label: 'Organization' },
      { name: 'year_label', label: 'Year', placeholder: '2025' },
      { name: 'is_current', label: 'Current role (filled dot)', type: 'bool' },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  {
    key: 'certifications', label: 'Certifications', titleField: 'title',
    fields: [
      { name: 'title', label: 'Title' },
      { name: 'issuer', label: 'Issuer' },
      { name: 'url', label: 'Credential URL' },
      { name: 'featured', label: 'Show on home page', type: 'bool', default: true },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  {
    key: 'highlights', label: 'Highlights', titleField: 'title',
    fields: [
      { name: 'kind', label: 'Type', type: 'select', options: ['image', 'access_card'], default: 'image' },
      { name: 'title', label: 'Title' },
      { name: 'subtitle', label: 'Subtitle (access card role line)' },
      { name: 'member_name', label: 'Member name (access card)' },
      { name: 'image_url', label: 'Logo / image (access card: replaces the QR)', type: 'image' },
      { name: 'card_color', label: 'Card color (access card)', type: 'color' },
      { name: 'hide_label', label: 'Hide the "ACCESS CARD" label (access card)', type: 'bool' },
      { name: 'link_url', label: 'Link URL' },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  {
    key: 'memberships', label: 'Memberships', titleField: 'name',
    fields: [
      { name: 'name', label: 'Name' },
      { name: 'url', label: 'URL' },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  {
    key: 'social_links', label: 'Social Links', titleField: 'platform',
    fields: [
      { name: 'platform', label: 'Platform', placeholder: 'LinkedIn / GitHub / Instagram' },
      { name: 'url', label: 'URL' },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  {
    key: 'gallery', label: 'Gallery', titleField: 'caption',
    fields: [
      { name: 'image_url', label: 'Photo', type: 'image' },
      { name: 'caption', label: 'Caption' },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
];

const PROFILE_FIELDS = [
  { name: 'name', label: 'Name' },
  { name: 'verified', label: 'Show verified badge', type: 'bool' },
  { name: 'location', label: 'Location' },
  { name: 'headline', label: 'Headline', placeholder: 'AI \\ Software Engineer \\ Content Creator' },
  { name: 'badge_text', label: 'Badge text', placeholder: 'DICT OpenGov Hackathon 2025 Champion' },
  { name: 'badge_url', label: 'Badge link' },
  { name: 'about', label: 'About (blank line between paragraphs)', type: 'textarea', rows: 10 },
  { name: 'avatar_url', label: 'Profile photo', type: 'image' },
  { name: 'email', label: 'Email' },
  { name: 'calendly_url', label: 'Schedule a Call URL' },
  { name: 'blog_url', label: 'Blog URL' },
  { name: 'accent_color', label: 'Page accent color (blank = default theme)', type: 'color' },
];

// ---------------------------------------------------------------------------
// Layout editor config
// ---------------------------------------------------------------------------
const PORTFOLIO_SECTIONS = [
  { key: 'header',         label: 'Header',         desc: 'Profile photo, name & headline' },
  { key: 'about',          label: 'About',           desc: 'Bio paragraphs' },
  { key: 'highlights',     label: 'Highlights',      desc: 'Featured cards & access cards' },
  { key: 'tech_stack',     label: 'Tech Stack',      desc: 'Technology chips by category' },
  { key: 'projects',       label: 'Projects',        desc: 'Featured project cards' },
  { key: 'experience',     label: 'Experience',      desc: 'Work history timeline' },
  { key: 'certifications', label: 'Certifications',  desc: 'Credentials & awards' },
  { key: 'gallery',        label: 'Gallery',         desc: 'Photo gallery' },
  { key: 'footer',         label: 'Footer',          desc: 'Memberships, social links & contact' },
];

// Bento grid constants
const BENTO_COLS = 4;
const BENTO_ROW_HEIGHT = 130; // px per grid row unit in the admin editor

// ---------------------------------------------------------------------------
// Sortable wrapper — render-prop gives children the drag-handle attributes
// ---------------------------------------------------------------------------
function SortableWrapper({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? 'opacity-50 z-50 relative' : ''}
    >
      {children({ isDragging, dragProps: { ...attributes, ...listeners } })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared field input
// ---------------------------------------------------------------------------
function Field({ field, value, onChange, onCommit }) {
  const id = `f-${field.name}`;
  if (field.type === 'bool') {
    return (
      <label className="flex items-center gap-2 text-sm py-1.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded accent-zinc-900 dark:accent-white"
        />
        {field.label}
      </label>
    );
  }
  if (field.type === 'image') return <ImageField field={field} value={value} onChange={onChange} onCommit={onCommit} />;
  if (field.type === 'color') {
    return (
      <div>
        <label htmlFor={id} className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
          {field.label}
        </label>
        <div className="flex items-center gap-3">
          <input
            id={id} type="color" value={value || '#18181b'}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-12 rounded-lg cursor-pointer bg-transparent border border-zinc-200 dark:border-zinc-700"
          />
          <input
            type="text" className="glass-input flex-1" value={value ?? ''}
            placeholder={field.placeholder || 'e.g. #7a0c2e — leave blank for default'}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && (
            <button type="button" onClick={() => onChange('')}
              className="text-xs text-zinc-500 hover:text-red-500 transition-colors">
              Reset
            </button>
          )}
        </div>
      </div>
    );
  }
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
        {field.label}
      </label>
      {field.type === 'textarea' ? (
        <textarea
          id={id} className="glass-input resize-y" rows={field.rows || 4}
          value={value ?? ''} placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : field.type === 'select' ? (
        <select
          id={id} className="glass-input" value={value ?? field.default}
          onChange={(e) => onChange(e.target.value)}
        >
          {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          id={id} className="glass-input"
          type={field.type === 'number' ? 'number' : 'text'}
          value={value ?? ''} placeholder={field.placeholder}
          onChange={(e) => onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)}
        />
      )}
    </div>
  );
}

// Best-effort delete of a previously-uploaded object in our `media` bucket so
// replacing/removing an image doesn't leave orphaned duplicates behind.
// Only touches files we uploaded — external/pasted URLs are left alone.
async function removeStorageObject(url) {
  if (!url) return;
  const marker = '/media/';
  const i = url.indexOf(marker);
  if (i === -1) return;
  const path = url.slice(i + marker.length);
  if (!path) return;
  try { await supabase.storage.from('media').remove([path]); } catch { /* ignore */ }
}

function ImageField({ field, value, onChange, onCommit }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  // `onCommit` (when provided) persists the value immediately — used by the
  // blocks editor so an uploaded image is saved without a separate "Save" click.
  const persisted = !!onCommit;
  const commit = onCommit || onChange;
  async function upload(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // reset so the same file can be re-selected later
    if (!file) return;
    setBusy(true); setErr('');
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    const { error } = await supabase.storage.from('media').upload(path, file);
    if (error) { setErr(error.message); setBusy(false); return; }
    const prev = value;
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    commit(data.publicUrl);
    if (persisted) removeStorageObject(prev);
    setBusy(false);
  }
  function clear() {
    const prev = value;
    commit('');
    if (persisted) removeStorageObject(prev);
  }
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">{field.label}</label>
      <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-14 h-14 rounded-xl object-cover ring-1 ring-white/40 dark:ring-white/10" />
        ) : (
          <div className="w-14 h-14 rounded-xl glass-inner" />
        )}
        <label className="glass-btn cursor-pointer">
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {busy ? 'Uploading…' : 'Upload image'}
          <input type="file" accept="image/*" className="hidden" onChange={upload} disabled={busy} />
        </label>
        {value && (
          <button type="button" onClick={clear}
            className="text-xs text-zinc-500 hover:text-red-500 transition-colors">
            Remove
          </button>
        )}
      </div>
      <input
        className="glass-input mt-2" value={value ?? ''}
        placeholder="…or paste an image URL"
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => persisted && onCommit(e.target.value)}
      />
      {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Live preview — renders the real public components with the in-progress data
// ---------------------------------------------------------------------------
const PREVIEW_RENDERERS = {
  tech_stack: (row) => <TechStack items={[row]} full />,
  projects: (row) => <Projects items={[row]} full />,
  experiences: (row) => <Experience items={[row]} />,
  certifications: (row) => <Certifications items={[row]} full />,
  highlights: (row) => <Highlights items={[row]} />,
  memberships: (row) => <MembershipCard m={row} />,
  social_links: (row) => <SocialLinkCard s={row} />,
  gallery: (row) => <Gallery items={[row]} />,
};

function PreviewBox({ children }) {
  return (
    <div>
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Live preview</p>
      <div className="portfolio-bg rounded-xl p-4 pointer-events-none select-none ring-1 ring-black/5 dark:ring-white/10">
        {children}
      </div>
    </div>
  );
}

function LivePreview({ collectionKey, row }) {
  const render = PREVIEW_RENDERERS[collectionKey];
  if (!render) return null;
  return <PreviewBox>{render(row)}</PreviewBox>;
}

// ---------------------------------------------------------------------------
// Generic collection editor — with drag-and-drop reordering
// ---------------------------------------------------------------------------
function CollectionEditor({ config }) {
  const [rows, setRows] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const load = useCallback(async () => {
    const { data, error } = await supabase.from(config.key).select('*').order('sort_order');
    if (error) setError(error.message);
    else setRows(data);
  }, [config.key]);

  useEffect(() => { setRows(null); setOpenId(null); load(); }, [load]);

  function update(id, name, value) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [name]: value } : r)));
  }

  async function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;
    setRows((prev) => {
      const oldIdx = prev.findIndex((r) => r.id === active.id);
      const newIdx = prev.findIndex((r) => r.id === over.id);
      const reordered = arrayMove(prev, oldIdx, newIdx).map((r, i) => ({ ...r, sort_order: i + 1 }));
      Promise.all(reordered.map((r) =>
        supabase.from(config.key).update({ sort_order: r.sort_order }).eq('id', r.id),
      ));
      return reordered;
    });
  }

  async function save(row) {
    setSaving(true); setError('');
    const { id, ...rest } = row;
    if (config.hasBlocks && !rest.slug && rest.title) {
      rest.slug = rest.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      update(id, 'slug', rest.slug);
    }
    const { error } = await supabase.from(config.key).update(rest).eq('id', id);
    if (error) setError(error.message);
    setSaving(false);
  }

  async function add() {
    setError('');
    const blank = { sort_order: (rows?.length || 0) + 1 };
    for (const f of config.fields) {
      if (f.name === 'sort_order') continue;
      blank[f.name] = f.default ?? (f.type === 'bool' ? false : f.type === 'number' ? 0 : '');
    }
    if ('name' in blank && !blank.name) blank.name = 'New item';
    if ('title' in blank && !blank.title) blank.title = 'New item';
    if ('platform' in blank && !blank.platform) blank.platform = 'New link';
    if ('url' in blank && blank.url === undefined) blank.url = '';
    if ('image_url' in blank && blank.image_url === undefined) blank.image_url = '';
    if (config.key === 'gallery' && !blank.image_url) blank.image_url = 'https://placehold.co/600x600';
    if (config.key === 'social_links' && !blank.url) blank.url = 'https://';
    const { data, error } = await supabase.from(config.key).insert(blank).select().single();
    if (error) { setError(error.message); return; }
    setRows((rs) => [...rs, data]);
    setOpenId(data.id);
  }

  async function remove(id) {
    if (!confirm('Delete this item?')) return;
    const { error } = await supabase.from(config.key).delete().eq('id', id);
    if (error) { setError(error.message); return; }
    setRows((rs) => rs.filter((r) => r.id !== id));
  }

  if (!rows) return (
    <p className="text-sm text-zinc-500 flex items-center gap-2">
      <Loader2 size={14} className="animate-spin" /> Loading…
    </p>
  );

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-500">{error}</p>}
      {rows.length === 0 && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No items yet. Add the first one below.</p>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-2">
            {rows.map((row) => (
              <SortableWrapper key={row.id} id={row.id}>
                {({ dragProps }) => (
                  <div className="glass-card overflow-hidden">
                    <div className="flex items-center">
                      <button
                        className="drag-handle ml-1"
                        {...dragProps}
                        aria-label="Drag to reorder"
                      >
                        <GripVertical size={15} />
                      </button>
                      <button
                        className="flex-1 flex items-center justify-between px-3 py-3 text-left transition-colors hover:bg-white/20 dark:hover:bg-white/5"
                        onClick={() => setOpenId(openId === row.id ? null : row.id)}
                      >
                        <span className="text-sm font-medium truncate">
                          {row[config.titleField] || (
                            <span className="text-zinc-400 dark:text-zinc-500">Untitled</span>
                          )}
                        </span>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0 ml-3">
                          #{row.sort_order}
                        </span>
                      </button>
                    </div>
                    {openId === row.id && (
                      <div className="mx-3 mb-3 glass-inner px-4 py-3 space-y-3">
                        {config.fields.map((f) => (
                          <Field key={f.name} field={f} value={row[f.name]}
                            onChange={(v) => update(row.id, f.name, v)} />
                        ))}
                        <LivePreview collectionKey={config.key} row={row} />
                        <div className="flex items-center gap-2 pt-1">
                          <button className="glass-btn glass-btn-primary" onClick={() => save(row)} disabled={saving}>
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                          </button>
                          <button className="glass-btn glass-btn-danger" onClick={() => remove(row.id)}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                        {config.hasBlocks && <BlocksEditor projectId={row.id} slug={row.slug} />}
                      </div>
                    )}
                  </div>
                )}
              </SortableWrapper>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <button className="glass-btn" onClick={add}><Plus size={14} /> Add item</button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Case-study block editor — with drag-and-drop reordering
// ---------------------------------------------------------------------------
const BLOCK_FIELDS = {
  heading: [{ name: 'text', label: 'Heading text' }],
  text: [{ name: 'text', label: 'Paragraph', type: 'textarea', rows: 5 }],
  image: [
    { name: 'image_url', label: 'Image', type: 'image' },
    { name: 'caption', label: 'Caption' },
  ],
};

function BlocksEditor({ projectId, slug }) {
  const [blocks, setBlocks] = useState(null);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    supabase.from('project_blocks').select('*').eq('project_id', projectId).order('sort_order')
      .then(({ data, error }) => (error ? setError(error.message) : setBlocks(data)));
  }, [projectId]);

  function update(id, name, value) {
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, [name]: value } : b)));
  }

  // Persist a single field immediately (used for image uploads so they save
  // without a separate "Save block" click — the source of the disappearing-image bug).
  async function commitField(id, name, value) {
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, [name]: value } : b)));
    const { error } = await supabase.from('project_blocks').update({ [name]: value }).eq('id', id);
    if (error) setError(error.message);
  }

  async function add(kind) {
    const { data, error } = await supabase.from('project_blocks')
      .insert({ project_id: projectId, kind, sort_order: (blocks?.length || 0) + 1 })
      .select().single();
    if (error) { setError(error.message); return; }
    setBlocks((bs) => [...bs, data]);
  }

  async function save(block) {
    setSavingId(block.id); setError('');
    const { id, ...rest } = block;
    const { error } = await supabase.from('project_blocks').update(rest).eq('id', id);
    if (error) setError(error.message);
    setSavingId(null);
  }

  async function remove(id) {
    if (!confirm('Delete this block?')) return;
    const { error } = await supabase.from('project_blocks').delete().eq('id', id);
    if (error) { setError(error.message); return; }
    setBlocks((bs) => bs.filter((b) => b.id !== id));
  }

  async function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;
    setBlocks((prev) => {
      const oldIdx = prev.findIndex((b) => b.id === active.id);
      const newIdx = prev.findIndex((b) => b.id === over.id);
      const reordered = arrayMove(prev, oldIdx, newIdx).map((b, i) => ({ ...b, sort_order: i + 1 }));
      Promise.all(reordered.map((b) =>
        supabase.from('project_blocks').update({ sort_order: b.sort_order }).eq('id', b.id),
      ));
      return reordered;
    });
  }

  return (
    <div className="mt-3 pt-3 border-t border-white/20 dark:border-white/10">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold">Case study content</h4>
        {slug && (
          <a href={`/projects/${slug}`} target="_blank" rel="noreferrer"
            className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            Preview page
          </a>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
      {!blocks ? (
        <p className="text-sm text-zinc-500 flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" /> Loading…
        </p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <ul className="space-y-2">
              {blocks.map((b) => (
                <SortableWrapper key={b.id} id={b.id}>
                  {({ dragProps }) => (
                    <div className="glass-inner p-3 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button className="drag-handle" {...dragProps} aria-label="Drag to reorder">
                            <GripVertical size={13} />
                          </button>
                          <span className="text-xs font-mono uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                            {b.kind}
                          </span>
                        </div>
                        <button onClick={() => remove(b.id)} aria-label="Delete block"
                          className="p-1 text-zinc-400 hover:text-red-500 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                      {BLOCK_FIELDS[b.kind].map((f) => (
                        <Field key={f.name} field={f} value={b[f.name]}
                          onChange={(v) => update(b.id, f.name, v)}
                          onCommit={(v) => commitField(b.id, f.name, v)} />
                      ))}
                      <button
                        className="glass-btn text-xs !py-1 !px-2.5"
                        onClick={() => save(b)} disabled={savingId === b.id}
                      >
                        {savingId === b.id ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                        Save block
                      </button>
                    </div>
                  )}
                </SortableWrapper>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
      <div className="flex gap-2 mt-3">
        <button className="glass-btn text-xs" onClick={() => add('heading')}><Plus size={13} /> Heading</button>
        <button className="glass-btn text-xs" onClick={() => add('text')}><Plus size={13} /> Paragraph</button>
        <button className="glass-btn text-xs" onClick={() => add('image')}><Plus size={13} /> Image</button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bento layout editor — drag to reorder, pull edges/corners to resize
// ---------------------------------------------------------------------------
function BentoEditor() {
  const [profileId, setProfileId] = useState(null);
  const [layout, setLayout] = useState(DEFAULT_LAYOUT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const gridRef = useRef(null);
  const [gridWidth, setGridWidth] = useState(640);

  // Measure container width so react-grid-layout can fill it
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const update = () => setGridWidth(el.offsetWidth);
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Load saved layout from DB
  useEffect(() => {
    supabase.from('profile').select('id, section_config').limit(1).maybeSingle().then(({ data }) => {
      if (!data) return;
      setProfileId(data.id);
      if (Array.isArray(data.section_config)) {
        const saved = data.section_config;
        const savedKeys = saved.map((s) => s.i);
        // Append any new sections not yet in the saved config
        setLayout([...saved, ...DEFAULT_LAYOUT.filter((s) => !savedKeys.includes(s.i))]);
      }
    });
  }, []);

  const visibleItems = layout.filter((s) => s.visible !== false);
  const hiddenItems = layout.filter((s) => s.visible === false);

  function onLayoutChange(newLayout) {
    setLayout((prev) => prev.map((s) => {
      const up = newLayout.find((n) => n.i === s.i);
      if (!up) return s;
      return { ...s, x: up.x, y: up.y, w: up.w, h: up.h };
    }));
  }

  function toggleVisibility(key) {
    setLayout((prev) => prev.map((s) => s.i === key ? { ...s, visible: !s.visible } : s));
  }

  async function save() {
    if (!profileId) return;
    setSaving(true); setError(''); setSaved(false);
    const { error } = await supabase.from('profile')
      .update({ section_config: layout })
      .eq('id', profileId);
    if (error) setError(error.message);
    else { setSaved(true); setTimeout(() => setSaved(false), 2500); }
    setSaving(false);
  }

  async function reset() {
    setLayout(DEFAULT_LAYOUT);
    if (profileId) await supabase.from('profile').update({ section_config: null }).eq('id', profileId);
  }

  return (
    <div className="xl:flex xl:items-start xl:gap-6">
      <div className="space-y-4 max-w-2xl mx-auto xl:flex-1 xl:min-w-0">
      <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
        Drag cards to rearrange. Pull a side or bottom handle to resize — other sections reflow automatically.
        Use the “Hide” button on a card to remove it from your public portfolio.
      </p>

      <div ref={gridRef} className="w-full">
        <div className="glass-inner overflow-hidden">
        <GridLayout
          layout={visibleItems}
          cols={BENTO_COLS}
          rowHeight={BENTO_ROW_HEIGHT}
          width={gridWidth}
          onLayoutChange={onLayoutChange}
          draggableHandle=".bento-grip"
          // No top handles — they'd sit on top of the drag strip and the Hide
          // button (invisible 28px hit areas), making both a pain to click.
          resizeHandles={['s', 'e', 'se', 'sw', 'w']}
          compactType="vertical"
          margin={[8, 8]}
          containerPadding={[8, 8]}
          isResizable
          isDraggable
        >
          {visibleItems.map((s) => {
            const meta = PORTFOLIO_SECTIONS.find((p) => p.key === s.i);
            return (
              <div key={s.i} className="glass-card flex flex-col overflow-hidden select-none">
                {/* Drag strip */}
                <div className="bento-grip flex items-center gap-2 px-2.5 pt-2 pb-1.5 cursor-grab active:cursor-grabbing border-b border-white/20 dark:border-white/10">
                  <GripVertical size={13} className="text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
                  <span className="text-xs font-semibold truncate flex-1 text-zinc-700 dark:text-zinc-200">
                    {meta?.label || s.i}
                  </span>
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onClick={() => toggleVisibility(s.i)}
                    className="relative z-20 flex-shrink-0 flex items-center gap-1 px-1.5 py-1 rounded-md text-[10px] font-medium text-zinc-500 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    title="Hide this section from the public site"
                    aria-label={`Hide ${meta?.label || s.i}`}
                  >
                    <EyeOff size={13} /> Hide
                  </button>
                </div>
                {/* Card body */}
                <div className="flex-1 px-2.5 py-2 flex flex-col items-center justify-center gap-1 min-h-0 text-center">
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-snug line-clamp-2">
                    {meta?.desc}
                  </p>
                  <p className="text-[10px] font-mono text-zinc-300 dark:text-zinc-600">
                    {s.w}w&nbsp;×&nbsp;{s.h}h
                  </p>
                </div>
              </div>
            );
          })}
        </GridLayout>
        </div>
      </div>

      {/* Hidden items — click to restore */}
      {hiddenItems.length > 0 && (
        <div className="text-center">
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-2">Hidden — click to restore</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {hiddenItems.map((s) => {
              const meta = PORTFOLIO_SECTIONS.find((p) => p.key === s.i);
              return (
                <button key={s.i} onClick={() => toggleVisibility(s.i)}
                  className="glass-btn text-xs gap-1 opacity-60 hover:opacity-100">
                  <EyeOff size={11} />
                  {meta?.label || s.i}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <button className="glass-btn glass-btn-primary" onClick={save} disabled={saving}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? 'Saved!' : 'Save layout'}
        </button>
        <button className="glass-btn text-sm" onClick={reset}>Reset to default</button>
      </div>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center">Changes appear on the public site within 60 seconds.</p>
      </div>

      {/* Live preview of the real homepage, driven by the in-progress layout.
          Sits beside the editor on wide screens (sticky, own scrollbar) so
          there's no scrolling back and forth; stacks below on smaller ones. */}
      <div className="no-scrollbar mt-6 pt-5 border-t border-black/[0.07] dark:border-white/10 xl:mt-0 xl:pt-0 xl:border-0 xl:w-[46%] xl:flex-shrink-0 xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto">
        <SitePreview layout={layout} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Profile editor
// ---------------------------------------------------------------------------
function ProfileEditor() {
  const [row, setRow] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('profile').select('*').limit(1).maybeSingle();
      if (error) { setError(error.message); return; }
      if (data) setRow(data);
      else {
        const { data: created, error: e2 } = await supabase.from('profile')
          .insert({ name: 'Your Name' }).select().single();
        if (e2) setError(e2.message); else setRow(created);
      }
    })();
  }, []);

  async function save() {
    setSaving(true); setError(''); setSaved(false);
    const { id, ...rest } = row;
    rest.updated_at = new Date().toISOString();
    const { error } = await supabase.from('profile').update(rest).eq('id', id);
    if (error) setError(error.message);
    else { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    setSaving(false);
  }

  if (error && !row) return <p className="text-sm text-red-500">{error}</p>;
  if (!row) return (
    <p className="text-sm text-zinc-500 flex items-center gap-2">
      <Loader2 size={14} className="animate-spin" /> Loading…
    </p>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <div className="space-y-4">
        {PROFILE_FIELDS.map((f) => (
          <Field key={f.name} field={f} value={row[f.name]}
            onChange={(v) => setRow((r) => ({ ...r, [f.name]: v }))} />
        ))}
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="glass-btn glass-btn-primary" onClick={save} disabled={saving}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? 'Saved!' : 'Save profile'}
        </button>
      </div>
      <div className="lg:sticky lg:top-4">
        <PreviewBox>
          <div className="space-y-4">
            <div className="glass-panel p-6"><Header profile={row} /></div>
            <About profile={row} />
          </div>
        </PreviewBox>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scale-to-fit frame — renders children at a fixed desktop width, then
// transform-scales them down to the container so the preview always shows the
// homepage's real desktop arrangement, even in a narrow column.
// ---------------------------------------------------------------------------
function ScaledFrame({ width = 1024, children }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    // offsetWidth/offsetHeight ignore the transform, so this never feeds back.
    const measure = () => {
      const s = Math.min(1, outer.offsetWidth / width);
      setScale(s);
      setHeight(inner.offsetHeight * s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={outerRef} style={{ height }} className="overflow-hidden">
      <div ref={innerRef} style={{ width, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Full-site preview — the real homepage (BentoGrid + public components),
// rendered from the latest saved content. When the layout editor passes its
// in-progress `layout`, the preview rearranges live as cards are dragged.
// ---------------------------------------------------------------------------
function SitePreview({ layout: layoutProp }) {
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setRefreshing(true); setError('');
    const [profile, tech, projects, experiences, certs, memberships, socials, gallery, highlights] =
      await Promise.all([
        supabase.from('profile').select('*').limit(1).maybeSingle(),
        supabase.from('tech_stack').select('*').order('sort_order'),
        supabase.from('projects').select('*').order('sort_order'),
        supabase.from('experiences').select('*').order('sort_order'),
        supabase.from('certifications').select('*').order('sort_order'),
        supabase.from('memberships').select('*').order('sort_order'),
        supabase.from('social_links').select('*').order('sort_order'),
        supabase.from('gallery').select('*').order('sort_order'),
        supabase.from('highlights').select('*').order('sort_order'),
      ]);
    if (profile.error) setError(profile.error.message);
    else setData({
      profile: profile.data,
      tech: tech.data || [],
      projects: projects.data || [],
      experiences: experiences.data || [],
      certs: certs.data || [],
      memberships: memberships.data || [],
      socials: socials.data || [],
      gallery: gallery.data || [],
      highlights: highlights.data || [],
    });
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!data) return (
    <p className="text-sm text-zinc-500 flex items-center gap-2">
      <Loader2 size={14} className="animate-spin" /> Loading…
    </p>
  );

  const rawConfig = data.profile?.section_config;
  const layout = layoutProp || (Array.isArray(rawConfig) ? rawConfig : DEFAULT_LAYOUT);
  const visibleItems = layout
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.y - b.y || a.x - b.x);
  const accent = accentStyle(data.profile?.accent_color);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {layoutProp
            ? 'Your real homepage — it rearranges as you edit above. Save layout to publish.'
            : 'Your homepage with the latest saved content — the public site catches up within 60 seconds.'}
        </p>
        <div className="flex items-center gap-2">
          <button className="glass-btn text-xs" onClick={load} disabled={refreshing}>
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} /> Refresh
          </button>
          <Link href="/" target="_blank" className="glass-btn text-xs">
            <ExternalLink size={13} /> Open site
          </Link>
        </div>
      </div>
      <div className="portfolio-bg rounded-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
        <ScaledFrame width={1024}>
          <div
            className={`p-6 pointer-events-none select-none${accent ? ' accent-on' : ''}`}
            style={accent || undefined}
          >
            <BentoGrid
              items={visibleItems
                .map((s) => ({ i: s.i, x: s.x, w: s.w, h: s.h, node: renderSection(s.i, data) }))
                .filter((it) => it.node)}
            />
          </div>
        </ScaledFrame>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function signIn(e) {
    e.preventDefault();
    setBusy(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setBusy(false);
  }

  return (
    <div className="admin-bg flex items-center justify-center px-4 py-16">
      <form onSubmit={signIn} className="glass-panel p-8 w-full max-w-sm space-y-5">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl glass-inner flex items-center justify-center mb-4 mx-auto">
            <LayoutDashboard size={22} className="text-zinc-700 dark:text-zinc-300" />
          </div>
          <h1 className="text-xl font-bold">Portfolio CMS</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Sign in to manage your content</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5" htmlFor="email">
            Email
          </label>
          <input id="email" className="glass-input" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5" htmlFor="password">
            Password
          </label>
          <input id="password" className="glass-input" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="glass-btn glass-btn-primary w-full justify-center" disabled={busy}>
          {busy && <Loader2 size={14} className="animate-spin" />} Sign in
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shell — sidebar navigation + content pane
// ---------------------------------------------------------------------------
const COLLECTION_ICONS = {
  tech_stack: Cpu,
  projects: FolderKanban,
  experiences: Briefcase,
  certifications: Award,
  highlights: Sparkles,
  memberships: Users,
  social_links: Share2,
  gallery: ImageIcon,
};

const NAV_ITEMS = [
  { key: 'profile', label: 'Profile', icon: UserRound },
  { key: 'layout',  label: 'Layout & Preview', icon: LayoutGrid },
  ...COLLECTIONS.map((c) => ({ key: c.key, label: c.label, icon: COLLECTION_ICONS[c.key], content: true })),
];

// Sidebar item styling — shared by nav tabs and the footer actions.
// `collapsed` only applies on md+ screens; mobile always shows labels.
function navCls(active, collapsed) {
  return `w-full flex items-center gap-2.5 text-sm px-3 py-2 rounded-xl font-medium text-left whitespace-nowrap transition-all ${
    collapsed ? 'md:justify-center md:px-0 md:gap-0' : ''
  } ${
    active
      ? 'bg-black/[0.09] dark:bg-white/[0.13] text-zinc-900 dark:text-white shadow-inner ring-1 ring-inset ring-black/[0.07] dark:ring-white/[0.12]'
      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08]'
  }`;
}

// Same behaviour as components/ThemeToggle, restyled as a sidebar item.
function SidebarThemeButton({ collapsed }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.theme = next ? 'dark' : 'light'; } catch {}
  }
  const label = dark ? 'Light mode' : 'Dark mode';
  return (
    <button onClick={toggle} className={navCls(false, collapsed)}
      title={collapsed ? label : undefined} aria-label={label}>
      {dark ? <Sun size={15} className="flex-shrink-0" /> : <Moon size={15} className="flex-shrink-0" />}
      <span className={collapsed ? 'md:hidden' : ''}>{label}</span>
    </button>
  );
}

export default function AdminPage() {
  const [session, setSession] = useState(undefined);
  const [tab, setTab] = useState('profile');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Restore the collapsed state after mount (avoids SSR hydration mismatch)
  useEffect(() => {
    try { if (localStorage.adminSidebarCollapsed === '1') setCollapsed(true); } catch {}
  }, []);

  function toggleCollapsed() {
    setCollapsed((c) => {
      try { localStorage.adminSidebarCollapsed = c ? '' : '1'; } catch {}
      return !c;
    });
  }

  if (session === undefined) {
    return (
      <div className="admin-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-zinc-400 dark:text-zinc-500" size={32} />
      </div>
    );
  }
  if (!session) return <Login />;

  const active = NAV_ITEMS.find((t) => t.key === tab);

  return (
    <div className="admin-bg">
      <div className="max-w-[100rem] mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-start">

          {/* Sidebar — sticky + collapsible on desktop, a top panel on mobile */}
          <aside
            className={`glass-panel w-full md:flex-shrink-0 md:sticky md:top-6 md:max-h-[calc(100vh-3rem)] p-3 flex flex-col gap-3 transition-[width] duration-200 ${
              collapsed ? 'md:w-[68px]' : 'md:w-60'
            }`}
          >
            {/* Brand + collapse toggle */}
            <div className={`flex items-center gap-2.5 px-1 ${collapsed ? 'md:flex-col md:gap-1.5 md:px-0' : ''}`}>
              <div className="w-9 h-9 rounded-xl glass-inner flex items-center justify-center flex-shrink-0">
                <LayoutDashboard size={18} className="text-zinc-700 dark:text-zinc-300" />
              </div>
              <div className={`min-w-0 flex-1 ${collapsed ? 'md:hidden' : ''}`}>
                <h1 className="text-sm font-bold leading-tight">Portfolio CMS</h1>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{session.user.email}</p>
              </div>
              <button
                onClick={toggleCollapsed}
                className="hidden md:flex items-center justify-center p-1.5 rounded-lg flex-shrink-0 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
              </button>
            </div>

            {/* Nav — horizontal scroll strip on mobile, vertical list on desktop */}
            <nav className="no-scrollbar flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible md:overflow-y-auto md:flex-1 -mx-1 px-1 pb-1 md:pb-0">
              {NAV_ITEMS.map((t, idx) => {
                const Icon = t.icon;
                const firstCollection = t.content && !NAV_ITEMS[idx - 1]?.content;
                return (
                  <div key={t.key} className="flex-shrink-0 md:flex-shrink">
                    {firstCollection && (collapsed ? (
                      <div className="hidden md:block border-t border-black/[0.07] dark:border-white/10 my-2 mx-2" />
                    ) : (
                      <p className="hidden md:block text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 px-3 pt-3 pb-1">
                        Content
                      </p>
                    ))}
                    <button
                      onClick={() => setTab(t.key)}
                      className={navCls(tab === t.key, collapsed)}
                      title={collapsed ? t.label : undefined}
                    >
                      {Icon && <Icon size={15} className="flex-shrink-0" />}
                      <span className={collapsed ? 'md:hidden' : ''}>{t.label}</span>
                    </button>
                  </div>
                );
              })}
            </nav>

            {/* Footer actions — same style as nav items */}
            <div className="no-scrollbar pt-2 border-t border-black/[0.07] dark:border-white/10 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible -mx-1 px-1 md:mx-0 md:px-0">
              <Link href="/" target="_blank" className={navCls(false, collapsed)}
                title={collapsed ? 'View site' : undefined}>
                <Globe size={15} className="flex-shrink-0" />
                <span className={collapsed ? 'md:hidden' : ''}>View site</span>
              </Link>
              <SidebarThemeButton collapsed={collapsed} />
              <button onClick={() => supabase.auth.signOut()} className={navCls(false, collapsed)}
                title={collapsed ? 'Sign out' : undefined}>
                <LogOut size={15} className="flex-shrink-0" />
                <span className={collapsed ? 'md:hidden' : ''}>Sign out</span>
              </button>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div className="glass-panel px-4 sm:px-6 py-6">
              <h2 className="text-lg font-bold tracking-tight mb-5">{active?.label}</h2>
              {tab === 'profile' ? <ProfileEditor /> :
               tab === 'layout'  ? <BentoEditor /> :
               <CollectionEditor key={tab} config={COLLECTIONS.find((c) => c.key === tab)} />}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
