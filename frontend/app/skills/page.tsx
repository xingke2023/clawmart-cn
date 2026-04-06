'use client';

import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { listingsApi, Listing } from "@/lib/api";
import { Search, Star, Download, Loader2 } from "lucide-react";
import { ClawNav, ClawFooter, clawStyles } from "@/components/claw-layout";

const CATEGORIES = ["全部", "营销", "工程", "设计", "其他", "AI 角色", "行业方案"];

const SORT_OPTIONS = [
  { label: "最热门", value: "popular" },
  { label: "最新发布", value: "newest" },
  { label: "价格：从低到高", value: "price_asc" },
  { label: "价格：从高到低", value: "price_desc" },
];

export default function SkillsPage() {
  return (
    <Suspense>
      <SkillsContent />
    </Suspense>
  );
}

function SkillRow({ listing }: { listing: Listing }) {
  const avatarUrl = listing.category === 'AI 角色'
    ? `https://api.dicebear.com/9.x/open-peeps/svg?seed=${listing.id}&size=40&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
    : `https://api.dicebear.com/9.x/${['shapes', 'icons', 'identicon', 'rings', 'bottts', 'pixel-art', 'fun-emoji'][listing.id % 7]}/svg?seed=${listing.id}&size=40&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  return (
    <Link href={`/listings/${listing.slug}`} style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '16px 0',
      borderBottom: '1px solid rgba(42,31,25,0.07)',
      textDecoration: 'none', color: 'inherit',
      transition: 'background 0.15s',
    }}
      className="skill-row"
    >
      <img src={avatarUrl} alt="" width={40} height={40}
        style={{ borderRadius: 10, background: '#F0E8E1', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: 15, fontWeight: 700, color: '#2A1F19',
          marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {listing.name}
        </div>
        <div style={{
          fontSize: 13, color: '#9e8074',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {listing.description}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, color: '#6B5549',
          background: 'rgba(42,31,25,0.06)', borderRadius: 100,
          padding: '3px 10px', border: '1px solid rgba(42,31,25,0.08)',
        }}>
          {listing.category}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#9e8074', fontWeight: 500 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Star size={11} fill="#f5a623" style={{ color: '#f5a623' }} />
            {((listing.id * 137 + 23) % 200) + 20}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Download size={11} />
            {((listing.id * 89 + 11) % 50) + 5}k
          </span>
        </div>
        <span style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: 15, fontWeight: 700,
          color: parseFloat(listing.price) === 0 ? '#4a9e6b' : '#2A1F19',
          minWidth: 48, textAlign: 'right',
        }}>
          {parseFloat(listing.price) === 0 ? '免费' : `¥${listing.price}`}
        </span>
      </div>
    </Link>
  );
}

function SkillsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState(searchParams.get('search') || "");
  const [inputVal, setInputVal] = useState(searchParams.get('search') || "");
  const [category, setCategory] = useState("全部");
  const [sort, setSort] = useState("popular");
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchListings = useCallback(async (isLoadMore = false, loadPage = 1) => {
    if (!isLoadMore) setLoading(true);
    try {
      const params: Record<string, string | number> = { page: loadPage, sort };
      if (search) params.search = search;
      if (category !== '全部') params.category = category;

      const res = await listingsApi.getListings(params as any);
      const data: Listing[] = res?.data || [];

      if (isLoadMore) {
        setListings(prev => [...prev, ...data]);
      } else {
        setListings(data);
        setTotal(res?.total || 0);
      }
      setPage(res?.current_page || 1);
      setHasMore((res?.current_page || 1) < (res?.last_page || 1));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [category, sort, search]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(inputVal);
  };

  return (
    <>
      <style>{clawStyles}{`
        .skill-row:hover { background: rgba(42,31,25,0.025); border-radius: 8px; padding-left: 8px; padding-right: 8px; margin: 0 -8px; }
        .skills-cat-tab { padding: 6px 16px; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1.5px solid transparent; font-family: 'Manrope', sans-serif; transition: all 0.15s; background: transparent; color: #6B5549; }
        .skills-cat-tab:hover { background: rgba(42,31,25,0.06); color: #2A1F19; }
        .skills-cat-tab.active { background: #2A1F19; color: #fff; border-color: #2A1F19; }
      `}</style>
      <div className="claw-page">
        <ClawNav />

        <main>
          {/* Header */}
          <section style={{ padding: '56px 24px 32px', maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
              <div>
                <h1 style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 42, fontWeight: 800, color: '#2A1F19',
                  margin: '0 0 8px', letterSpacing: '-0.02em',
                }}>
                  技能库{' '}
                  <span style={{ fontSize: 22, fontWeight: 600, color: '#9e8074' }}>
                    ({total.toLocaleString()})
                  </span>
                </h1>
                <p style={{ fontSize: 16, color: '#6B5549', margin: 0 }}>
                  浏览所有可用的 AI 技能包，找到适合你的那一个。
                </p>
              </div>
              <Link href="/skills/publish" className="claw-btn-primary" style={{
                fontSize: 14, padding: '10px 22px', textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                borderRadius: 100, whiteSpace: 'nowrap', marginTop: 8,
              }}>
                + 发布技能
              </Link>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 24, maxWidth: 560 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9e8074' }} />
                <input
                  type="text"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  placeholder="搜索技能名称或描述..."
                  style={{
                    width: '100%', padding: '10px 14px 10px 40px',
                    borderRadius: 10, border: '1.5px solid rgba(42,31,25,0.12)',
                    fontSize: 14, fontFamily: "'Manrope', sans-serif",
                    background: '#fff', color: '#2A1F19', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <button type="submit" className="claw-btn-primary" style={{ padding: '10px 20px', fontSize: 14, borderRadius: 10, border: 'none', cursor: 'pointer' }}>
                搜索
              </button>
            </form>

            {/* Category tabs + sort */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`skills-cat-tab${category === cat ? ' active' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{
                  padding: '7px 12px', borderRadius: 8,
                  border: '1.5px solid rgba(42,31,25,0.12)',
                  fontSize: 13, fontWeight: 600, color: '#6B5549',
                  background: '#fff', fontFamily: "'Manrope', sans-serif",
                  cursor: 'pointer', outline: 'none',
                }}
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(42,31,25,0.08)', margin: '0 24px' }} />

          {/* List */}
          <section style={{ padding: '0 24px 64px', maxWidth: 1200, margin: '0 auto' }}>
            {loading ? (
              <div style={{ padding: '48px 0', display: 'flex', justifyContent: 'center' }}>
                <Loader2 size={24} style={{ color: '#E65C46', animation: 'spin 1s linear infinite' }} />
              </div>
            ) : listings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#9e8074', fontSize: 15 }}>
                没有找到匹配的技能，换个关键词试试。
              </div>
            ) : (
              <>
                <div style={{ paddingTop: 8 }}>
                  {listings.map(l => <SkillRow key={l.id} listing={l} />)}
                </div>
                {hasMore && (
                  <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <button
                      onClick={() => fetchListings(true, page + 1)}
                      className="claw-btn-ghost"
                      style={{ padding: '12px 36px', fontSize: 14 }}
                    >
                      加载更多
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </main>

        <ClawFooter />
      </div>
    </>
  );
}
