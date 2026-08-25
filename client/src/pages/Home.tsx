/* Quiet Commerce reminder: use editorial spacing, tactile paper surfaces, Signal Mint actions, and confident offline-first states. */
import {
  Archive,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bell,
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CloudOff,
  Copy,
  Download,
  Edit3,
  Eye,
  FileJson,
  Filter,
  Heart,
  Home as HomeIcon,
  Image as ImageIcon,
  LayoutGrid,
  LockKeyhole,
  LogOut,
  Menu,
  Minus,
  MoreHorizontal,
  PackageCheck,
  Palette,
  Pencil,
  Plus,
  RefreshCcw,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Store,
  Trash2,
  Truck,
  Upload,
  UserRound,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type View = "home" | "shop" | "saved" | "cart" | "account" | "admin";
type AdminSection = "overview" | "products" | "categories" | "orders" | "settings";
type OrderStatus = "New" | "Packed" | "Shipped" | "Completed";

type StoreSettings = {
  brandName: string;
  tagline: string;
  currency: string;
  contact: string;
  accent: string;
  darkMode: boolean;
  lowStockThreshold: number;
};

type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
  tint: string;
  visible: boolean;
  sort: number;
};

type Product = {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  image: string;
  price: number;
  compareAt?: number;
  stock: number;
  sku: string;
  tags: string[];
  featured: boolean;
  active: boolean;
  updatedAt: string;
};

type CartItem = { productId: string; quantity: number };
type Order = {
  id: string;
  items: Array<{ productId: string; title: string; price: number; quantity: number }>;
  customer: { name: string; phone: string; address: string; note: string };
  total: number;
  status: OrderStatus;
  createdAt: string;
};

type StoreState = {
  settings: StoreSettings;
  categories: Category[];
  products: Product[];
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
};

const STORAGE_KEY = "super-store-mobile:store:v2";
const ADMIN_KEY = "super-store-mobile:admin:v1";
const HERO_IMAGE = "/manus-storage/super-store-hero_5268bbbf.png";
const CATEGORY_IMAGE = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=85";
const PRODUCT_IMAGE = "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85";
const BAG_IMAGE = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85";
const MARK_IMAGE = "/manus-storage/super-store-mark_0221e868.png";

const uid = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
const today = () => new Date().toISOString();
const money = (value: number, currency: string) => `${currency} ${new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(value)}`;
const placeholder = (label: string, tint = "#DDF7EC") =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900"><rect width="900" height="900" fill="${tint}"/><circle cx="690" cy="170" r="180" fill="#ffffff" opacity=".46"/><path d="M112 720c170-220 330-200 510-20" fill="none" stroke="#18211D" stroke-width="14" opacity=".14"/><text x="80" y="130" fill="#18211D" font-family="Arial,sans-serif" font-size="42" font-weight="700">${label}</text></svg>`)}`;

const seedState: StoreState = {
  settings: {
    brandName: "Super Store",
    tagline: "Everyday things, considered.",
    currency: "PKR",
    contact: "+92 300 000 0000",
    accent: "Signal Mint",
    darkMode: false,
    lowStockThreshold: 5,
  },
  categories: [
    { id: "cat_carry", name: "Everyday carry", description: "Useful pieces for the hours between here and there.", image: BAG_IMAGE, tint: "#E8F3E7", visible: true, sort: 1 },
    { id: "cat_home", name: "Home essentials", description: "Quiet objects that make space feel ready.", image: CATEGORY_IMAGE, tint: "#F5E9DA", visible: true, sort: 2 },
    { id: "cat_desk", name: "Desk tools", description: "Clear the surface. Keep the signal.", image: PRODUCT_IMAGE, tint: "#E4EEE9", visible: true, sort: 3 },
    { id: "cat_care", name: "Personal care", description: "Small rituals, better made.", image: placeholder("CARE", "#F4E7E8"), tint: "#F4E7E8", visible: true, sort: 4 },
  ],
  products: [
    { id: "prod_bottle", categoryId: "cat_carry", title: "Daily Carry Bottle", description: "A balanced, matte insulated bottle that stays close without taking over the bag.", image: PRODUCT_IMAGE, price: 3490, compareAt: 3990, stock: 18, sku: "SS-DCB-01", tags: ["new", "carry"], featured: true, active: true, updatedAt: today() },
    { id: "prod_tote", categoryId: "cat_carry", title: "Canvas Market Tote", description: "Heavy canvas, wide handles, and one calm place for the day’s essentials.", image: BAG_IMAGE, price: 2450, stock: 9, sku: "SS-CMT-02", tags: ["carry", "utility"], featured: true, active: true, updatedAt: today() },
    { id: "prod_tray", categoryId: "cat_home", title: "Catchall Tray", description: "A low ceramic tray for keys, receipts, and the things that need a home.", image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=900&q=85", price: 1890, stock: 4, sku: "SS-CT-03", tags: ["home", "low stock"], featured: true, active: true, updatedAt: today() },
    { id: "prod_lamp", categoryId: "cat_home", title: "Soft Glow Lamp", description: "A warm, portable glow for bedside tables and slow evenings.", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85", price: 5250, compareAt: 5900, stock: 7, sku: "SS-SGL-04", tags: ["home", "gift"], featured: false, active: true, updatedAt: today() },
    { id: "prod_notebook", categoryId: "cat_desk", title: "Field Notes Set", description: "Three soft-cover notebooks for lists, sketches, and half-formed good ideas.", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=85", price: 1290, stock: 27, sku: "SS-FN-05", tags: ["desk", "paper"], featured: false, active: true, updatedAt: today() },
    { id: "prod_mug", categoryId: "cat_care", title: "Morning Ceramic Cup", description: "A generous, thumb-friendly cup with a quiet satin glaze.", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85", price: 1690, stock: 14, sku: "SS-MCC-06", tags: ["care", "home"], featured: false, active: true, updatedAt: today() },
  ],
  cart: [],
  favorites: [],
  orders: [],
};

function loadState(): StoreState {
  if (typeof window === "undefined") return seedState;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return seedState;
    const parsed = JSON.parse(saved) as StoreState;
    const migrateImage = (image: string, fallback: string) => image?.includes("/manus-storage/super-store-") ? fallback : image;
    return {
      ...seedState,
      ...parsed,
      settings: { ...seedState.settings, ...parsed.settings },
      categories: (parsed.categories || seedState.categories).map((category) => ({ ...category, image: migrateImage(category.image, CATEGORY_IMAGE) })),
      products: (parsed.products || seedState.products).map((product) => ({ ...product, image: migrateImage(product.image, PRODUCT_IMAGE) })),
    };
  } catch {
    return seedState;
  }
}

function downloadText(filename: string, text: string, type = "application/json") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return <div className="section-label"><span>{index}</span><span>{children}</span></div>;
}

function IconButton({ label, children, onClick, active = false, className = "" }: { label: string; children: React.ReactNode; onClick?: () => void; active?: boolean; className?: string }) {
  return <button type="button" aria-label={label} title={label} onClick={onClick} className={`icon-button ${active ? "icon-button-active" : ""} ${className}`}>{children}</button>;
}

function Badge({ children, tone = "mint" }: { children: React.ReactNode; tone?: "mint" | "dark" | "amber" | "rose" }) {
  return <span className={`status-badge status-${tone}`}>{children}</span>;
}

function ProductCard({ product, category, currency, favorite, onOpen, onAdd, onFavorite }: { product: Product; category?: Category; currency: string; favorite: boolean; onOpen: () => void; onAdd: () => void; onFavorite: () => void }) {
  const discount = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0;
  return <article className="product-card">
    <div className="product-image-wrap" onClick={onOpen} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && onOpen()}>
      <img src={product.image || placeholder(product.title)} alt={product.title} className="product-image" />
      <div className="product-image-topline">
        {product.featured ? <Badge>Featured</Badge> : <span />}
        <IconButton label={favorite ? "Remove from saved" : "Save product"} active={favorite} onClick={onFavorite}>{favorite ? <Heart size={17} fill="currentColor" /> : <Heart size={17} />}</IconButton>
      </div>
      {discount > 0 && <span className="discount-sticker">-{discount}%</span>}
    </div>
    <div className="product-card-copy">
      <div className="product-meta"><span>{category?.name || "Collection"}</span><span>{product.stock <= 5 ? `${product.stock} left` : "In stock"}</span></div>
      <button type="button" className="product-title" onClick={onOpen}>{product.title}</button>
      <div className="product-buy-row"><strong>{money(product.price, currency)}</strong><button type="button" className="add-button" onClick={onAdd} aria-label={`Add ${product.title} to cart`}><Plus size={17} /></button></div>
    </div>
  </article>;
}

function EmptyState({ icon, title, detail, action, onAction }: { icon: React.ReactNode; title: string; detail: string; action?: string; onAction?: () => void }) {
  return <div className="empty-state"><div className="empty-icon">{icon}</div><h3>{title}</h3><p>{detail}</p>{action && <button type="button" className="button button-dark" onClick={onAction}>{action}<ArrowRight size={16} /></button>}</div>;
}

export default function Home() {
  const [store, setStore] = useState<StoreState>(() => loadState());
  const [view, setView] = useState<View>("home");
  const [adminSection, setAdminSection] = useState<AdminSection>("overview");
  const [query, setQuery] = useState("");
  const [shopCategory, setShopCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine);
  const [toastMessage, setToastMessage] = useState("");
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => undefined);
    return () => { window.removeEventListener("online", online); window.removeEventListener("offline", offline); };
  }, []);

  const activeProducts = useMemo(() => store.products.filter((product) => product.active), [store.products]);
  const featuredProducts = useMemo(() => activeProducts.filter((product) => product.featured), [activeProducts]);
  const visibleCategories = useMemo(() => [...store.categories].filter((category) => category.visible).sort((a, b) => a.sort - b.sort), [store.categories]);
  const cartCount = store.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartItems = store.cart.map((item) => ({ ...item, product: store.products.find((product) => product.id === item.productId) })).filter((item) => item.product);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const lowStockCount = activeProducts.filter((product) => product.stock <= store.settings.lowStockThreshold).length;
  const filteredProducts = useMemo(() => activeProducts.filter((product) => {
    const matchesQuery = !query || `${product.title} ${product.description} ${product.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = shopCategory === "all" || product.categoryId === shopCategory;
    const matchesSaved = view !== "saved" || store.favorites.includes(product.id);
    return matchesQuery && matchesCategory && matchesSaved;
  }), [activeProducts, query, shopCategory, view, store.favorites]);

  const notify = (message: string) => {
    setToastMessage(message);
    toast.success(message);
  };

  const changeView = (next: View) => {
    setView(next);
    if (next !== "shop" && next !== "saved") setQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (productId: string, quantity = 1) => {
    setStore((current) => {
      const existing = current.cart.find((item) => item.productId === productId);
      return { ...current, cart: existing ? current.cart.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item) : [...current.cart, { productId, quantity }] };
    });
    notify("Added to your bag");
  };

  const updateCart = (productId: string, amount: number) => setStore((current) => ({ ...current, cart: current.cart.map((item) => item.productId === productId ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item).filter((item) => item.quantity > 0) }));
  const toggleFavorite = (productId: string) => setStore((current) => ({ ...current, favorites: current.favorites.includes(productId) ? current.favorites.filter((id) => id !== productId) : [...current.favorites, productId] }));
  const getCategory = (id: string) => store.categories.find((category) => category.id === id);

  const handleAdminLogin = (username: string, password: string) => {
    const valid = username === "admin" && password === "superstore";
    if (!valid) { toast.error("Use the demo credentials shown below"); return false; }
    setAdminUnlocked(true);
    setIsAdminLoginOpen(false);
    setView("admin");
    notify("Admin workspace unlocked on this device");
    return true;
  };

  const openAdmin = () => adminUnlocked ? setView("admin") : setIsAdminLoginOpen(true);

  const createOrder = (customer: { name: string; phone: string; address: string; note: string }) => {
    if (!cartItems.length) return;
    const order: Order = {
      id: `SS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      items: cartItems.map((item) => ({ productId: item.productId, title: item.product?.title || "Product", price: item.product?.price || 0, quantity: item.quantity })),
      customer,
      total: cartTotal,
      status: "New",
      createdAt: today(),
    };
    setStore((current) => ({ ...current, orders: [order, ...current.orders], cart: [] }));
    setIsCheckoutOpen(false);
    setView("account");
    notify(`Order ${order.id} saved locally`);
  };

  const deleteProduct = (id: string) => {
    if (!window.confirm("Delete this product from the local catalog?")) return;
    setStore((current) => ({ ...current, products: current.products.filter((product) => product.id !== id), cart: current.cart.filter((item) => item.productId !== id), favorites: current.favorites.filter((favorite) => favorite !== id) }));
    notify("Product deleted");
  };
  const deleteCategory = (id: string) => {
    const hasProducts = store.products.some((product) => product.categoryId === id);
    if (hasProducts) { toast.error("Move or delete the category products first"); return; }
    if (!window.confirm("Delete this category from the local catalog?")) return;
    setStore((current) => ({ ...current, categories: current.categories.filter((category) => category.id !== id) }));
    notify("Category deleted");
  };

  const exportBackup = () => { downloadText(`super-store-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(store, null, 2)); notify("Backup exported"); };
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { try { const imported = JSON.parse(String(reader.result)) as StoreState; if (!imported.products || !imported.categories) throw new Error("Invalid"); setStore({ ...seedState, ...imported, settings: { ...seedState.settings, ...imported.settings } }); notify("Backup restored on this device"); } catch { toast.error("This backup file is not valid"); } };
    reader.readAsText(file);
    event.target.value = "";
  };
  const resetCatalog = () => { if (!window.confirm("Restore the starter catalog? Your local orders will also be cleared.")) return; setStore(seedState); notify("Starter catalog restored"); };

  const renderPublicHeader = () => <>
    <header className="app-header">
      <div className="brand-lockup" onClick={() => changeView("home")} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && changeView("home")}>
        <img src={MARK_IMAGE} alt="" className="brand-mark" />
        <div><strong className="brand-wordmark"><span>{store.settings.brandName.split(" ")[0] || "Super"}</span><i>{store.settings.brandName.split(" ").slice(1).join(" ") || "Store"}</i></strong><span>Curated everyday goods</span></div>
      </div>
      <div className="header-actions">
        <div className={`connectivity ${isOnline ? "online" : "offline"}`} title={isOnline ? "Online" : "Offline — changes save locally"}><span className="signal-dot" />{isOnline ? "Online" : "Saved offline"}</div>
        <IconButton label="Search" onClick={() => setIsSearchOpen(true)}><Search size={19} /></IconButton>
        <button type="button" className="bag-button" onClick={() => changeView("cart")} aria-label={`Bag with ${cartCount} items`}><ShoppingBag size={19} /><span>{cartCount}</span></button>
      </div>
    </header>
    {!isOnline && <div className="offline-ribbon"><CloudOff size={15} /> Offline mode is on. Catalog, cart, and admin changes remain available on this device.</div>}
  </>;

  const renderBottomNav = () => <nav className="bottom-nav" aria-label="Primary navigation">
    {[{ id: "home" as View, label: "Home", icon: <HomeIcon size={19} /> }, { id: "shop" as View, label: "Shop", icon: <LayoutGrid size={19} /> }, { id: "saved" as View, label: "Saved", icon: <Heart size={19} /> }, { id: "account" as View, label: "Account", icon: <UserRound size={19} /> }].map((item) => <button type="button" key={item.id} className={view === item.id ? "nav-active" : ""} onClick={() => changeView(item.id)}>{item.icon}<span>{item.label}</span>{item.id === "saved" && store.favorites.length > 0 && <i>{store.favorites.length}</i>}</button>)}
  </nav>;

  const renderHome = () => <main className="public-main page-enter">
    <section className="hero-panel">
      <img src={HERO_IMAGE} alt="Curated objects arranged on a warm tabletop" className="hero-image" />
      <div className="hero-scrim" />
      <div className="hero-copy"><SectionLabel index="01 / CURATED DROP">The clear edit</SectionLabel><h1>Good things.<br /><em>Ready offline.</em></h1><p>Useful pieces for the way your day actually moves — saved on this device, even without signal.</p><div className="hero-local-cue"><span className="signal-dot" /> Local-first catalog · ready to browse</div><button type="button" className="button button-mint" onClick={() => { setShopCategory("all"); changeView("shop"); }}>Explore the collection <ArrowRight size={16} /></button></div>
      <div className="hero-index"><span>New collection</span><strong>03—24</strong></div>
    </section>
    <section className="home-section feature-section"><div className="section-heading"><div><SectionLabel index="02 / CATEGORIES">Shop by rhythm</SectionLabel><h2>Find your <em>everyday</em> better.</h2></div><button type="button" className="text-button" onClick={() => changeView("shop")}>View all <ArrowRight size={15} /></button></div><div className="category-strip">{visibleCategories.slice(0, 4).map((category) => <button type="button" className="category-card" key={category.id} onClick={() => { setShopCategory(category.id); changeView("shop"); }}><img src={category.image} alt="" /><span className="category-card-overlay" /><div><small>{String(category.sort).padStart(2, "0")}</small><strong>{category.name}</strong><span>{category.description}</span></div><ChevronRight size={17} /></button>)}</div></section>
    <section className="home-section"><div className="section-heading"><div><SectionLabel index="03 / THE EDIT">Selected now</SectionLabel><h2>Objects with <em>intent.</em></h2></div><button type="button" className="text-button" onClick={() => changeView("shop")}>See the edit <ArrowRight size={15} /></button></div><div className="product-grid">{featuredProducts.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} category={getCategory(product.categoryId)} currency={store.settings.currency} favorite={store.favorites.includes(product.id)} onOpen={() => setSelectedProduct(product)} onAdd={() => addToCart(product.id)} onFavorite={() => toggleFavorite(product.id)} />)}</div></section>
    <section className="manifesto-card"><div className="manifesto-mark"><Zap size={21} /></div><div><SectionLabel index="04 / OUR APPROACH">Less, but better</SectionLabel><h2>A small store with a <em>clear point of view.</em></h2><p>No endless scroll. No empty promises. Just considered goods, local-first control, and a bag that remembers where you left off.</p></div><button type="button" className="round-arrow" onClick={() => changeView("shop")}><ArrowRight size={18} /></button></section>
  </main>;

  const renderShop = () => <main className="public-main page-enter"><div className="page-title-row"><div><SectionLabel index={view === "saved" ? "05 / SAVED" : "05 / SHOP ALL"}>{view === "saved" ? "Your considered list" : "The complete edit"}</SectionLabel><h1>{view === "saved" ? "Saved for <em>later.</em>" : "Shop the <em>whole edit.</em>"}</h1></div><IconButton label="Filter products" onClick={() => toast.info("Use the category rail to filter your catalog")}><SlidersHorizontal size={19} /></IconButton></div><div className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, tags, or a mood" /><kbd>/</kbd></div><div className="chip-row"><button type="button" className={`chip ${shopCategory === "all" ? "chip-active" : ""}`} onClick={() => setShopCategory("all")}>All pieces</button>{visibleCategories.map((category) => <button type="button" className={`chip ${shopCategory === category.id ? "chip-active" : ""}`} key={category.id} onClick={() => setShopCategory(category.id)}>{category.name}</button>)}</div>{filteredProducts.length ? <div className="product-grid product-grid-wide">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} category={getCategory(product.categoryId)} currency={store.settings.currency} favorite={store.favorites.includes(product.id)} onOpen={() => setSelectedProduct(product)} onAdd={() => addToCart(product.id)} onFavorite={() => toggleFavorite(product.id)} />)}</div> : <EmptyState icon={<Heart size={24} />} title={view === "saved" ? "Nothing saved yet" : "No matching pieces"} detail={view === "saved" ? "Tap the heart on a product to keep it close." : "Try a different keyword or browse every category."} action={view === "saved" ? "Browse shop" : "Clear search"} onAction={() => { setQuery(""); setShopCategory("all"); if (view === "saved") changeView("shop"); }} />}</main>;

  const renderCart = () => <main className="public-main page-enter"><div className="page-title-row"><div><SectionLabel index="06 / YOUR BAG">Ready when you are</SectionLabel><h1>Your <em>bag.</em></h1></div><Badge tone="dark">{cartCount} {cartCount === 1 ? "piece" : "pieces"}</Badge></div>{cartItems.length ? <div className="cart-layout"><div className="cart-list">{cartItems.map(({ product, productId, quantity }) => product && <div className="cart-line" key={productId}><img src={product.image} alt="" /><div className="cart-line-main"><div className="product-meta"><span>{getCategory(product.categoryId)?.name || "Collection"}</span><button type="button" className="remove-link" onClick={() => updateCart(productId, -quantity)}>Remove</button></div><h3>{product.title}</h3><strong>{money(product.price, store.settings.currency)}</strong><div className="quantity-control"><button type="button" onClick={() => updateCart(productId, -1)}><Minus size={14} /></button><span>{quantity}</span><button type="button" onClick={() => updateCart(productId, 1)}><Plus size={14} /></button></div></div></div>)}</div><aside className="summary-card"><SectionLabel index="ORDER SUMMARY">Local checkout</SectionLabel><div className="summary-row"><span>Subtotal</span><strong>{money(cartTotal, store.settings.currency)}</strong></div><div className="summary-row"><span>Delivery</span><span className="summary-muted">Calculated at checkout</span></div><div className="summary-divider" /><div className="summary-row summary-total"><span>Total</span><strong>{money(cartTotal, store.settings.currency)}</strong></div><button type="button" className="button button-dark button-full" onClick={() => setIsCheckoutOpen(true)}>Continue to checkout <ArrowRight size={16} /></button><p className="summary-note"><ShieldCheck size={14} /> Your bag is saved on this device.</p></aside></div> : <EmptyState icon={<ShoppingBag size={25} />} title="Your bag is clear" detail="When something feels right, it will wait here for you." action="Explore the collection" onAction={() => changeView("shop")} />}</main>;

  const renderAccount = () => <main className="public-main page-enter"><div className="account-banner"><div className="account-avatar">SS</div><div><SectionLabel index="07 / YOUR SPACE">Local profile</SectionLabel><h1>Keep it <em>close.</em></h1><p>Your orders and saved pieces stay right here on this device.</p></div></div><section className="account-grid"><button type="button" className="account-tile" onClick={() => changeView("saved")}><Heart size={20} /><span><strong>Saved pieces</strong><small>{store.favorites.length} products kept for later</small></span><ChevronRight size={17} /></button><button type="button" className="account-tile" onClick={() => toast.info("Order history is stored locally on this device")}><Archive size={20} /><span><strong>Order history</strong><small>{store.orders.length} local {store.orders.length === 1 ? "order" : "orders"}</small></span><ChevronRight size={17} /></button><button type="button" className="account-tile" onClick={openAdmin}><Settings size={20} /><span><strong>Store settings</strong><small>Admin catalog and local data controls</small></span><ChevronRight size={17} /></button></section><section className="orders-section"><div className="section-heading"><div><SectionLabel index="08 / ACTIVITY">Your local orders</SectionLabel><h2>Recent <em>activity.</em></h2></div></div>{store.orders.length ? <div className="order-list">{store.orders.slice(0, 5).map((order) => <div className="order-row" key={order.id}><div className="order-icon"><PackageCheck size={17} /></div><div><strong>{order.id}</strong><span>{new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })} · {order.items.length} {order.items.length === 1 ? "item" : "items"}</span></div><Badge tone={order.status === "Completed" ? "mint" : "dark"}>{order.status}</Badge><strong className="order-amount">{money(order.total, store.settings.currency)}</strong></div>)}</div> : <div className="quiet-empty"><Archive size={18} /><span>No orders yet. Your next good find can start the list.</span></div>}</section><button type="button" className="admin-entry" onClick={openAdmin}><LockKeyhole size={16} /><span>Admin workspace</span><small>Catalog controls are local to this browser</small><ArrowRight size={16} /></button></main>;

  const renderAdmin = () => <main className="admin-main page-enter"><aside className="admin-sidebar"><div className="admin-sidebar-heading"><img src={MARK_IMAGE} alt="" /><div><strong>Store Console</strong><span>Local workspace</span></div></div><div className="admin-nav">{[{ id: "overview" as AdminSection, label: "Overview", icon: <BarChart3 size={17} /> }, { id: "products" as AdminSection, label: "Products", icon: <Box size={17} /> }, { id: "categories" as AdminSection, label: "Categories", icon: <LayoutGrid size={17} /> }, { id: "orders" as AdminSection, label: "Orders", icon: <Truck size={17} /> }, { id: "settings" as AdminSection, label: "Settings", icon: <Settings size={17} /> }].map((item) => <button type="button" className={adminSection === item.id ? "admin-nav-active" : ""} key={item.id} onClick={() => setAdminSection(item.id)}>{item.icon}<span>{item.label}</span>{item.id === "orders" && store.orders.length > 0 && <i>{store.orders.length}</i>}</button>)}</div><div className="admin-sidebar-foot"><div className="local-state"><span className="signal-dot" />{isOnline ? "Online · saving locally" : "Offline · saving locally"}</div><button type="button" onClick={() => { setAdminUnlocked(false); changeView("home"); }}><LogOut size={16} /> Exit console</button></div></aside><section className="admin-content"><div className="admin-topbar"><button type="button" className="back-link" onClick={() => changeView("home")}><ArrowLeft size={16} /> Storefront</button><div className="admin-top-actions"><IconButton label="Refresh local view" onClick={() => setStore(loadState())}><RefreshCcw size={17} /></IconButton><div className="admin-user"><div className="mini-avatar">A</div><span>Admin</span><ChevronDown size={14} /></div></div></div>{adminSection === "overview" && renderAdminOverview()}{adminSection === "products" && renderAdminProducts()}{adminSection === "categories" && renderAdminCategories()}{adminSection === "orders" && renderAdminOrders()}{adminSection === "settings" && renderAdminSettings()}</section></main>;

  const renderAdminOverview = () => <div className="admin-view"><div className="admin-view-heading"><div><SectionLabel index="CONSOLE / 01">Command overview</SectionLabel><h1>Good morning, <em>admin.</em></h1><p>Your local storefront is ready to be shaped.</p></div><Badge><Wifi size={13} /> Local-first</Badge></div><div className="stats-grid"><div className="stat-card"><span>Catalog items</span><strong>{activeProducts.length}</strong><small><ArrowUpRight /> {store.products.length - activeProducts.length} hidden</small></div><div className="stat-card"><span>Categories</span><strong>{visibleCategories.length}</strong><small><LayoutGrid size={13} /> organized collections</small></div><div className="stat-card"><span>Local orders</span><strong>{store.orders.length}</strong><small><PackageCheck size={13} /> device history</small></div><div className="stat-card stat-card-accent"><span>Low stock</span><strong>{lowStockCount}</strong><small><Bell size={13} /> review inventory</small></div></div><div className="admin-overview-grid"><div className="panel-card"><div className="panel-card-heading"><div><SectionLabel index="PULSE">Catalog health</SectionLabel><h2>Small signals, <em>clear action.</em></h2></div><button type="button" className="text-button" onClick={() => setAdminSection("products")}>Manage <ArrowRight size={15} /></button></div><div className="health-list"><div><span className="health-icon health-mint"><BadgeCheck size={16} /></span><span><strong>Storefront is live</strong><small>All active products are visible to shoppers.</small></span><b>Ready</b></div><div><span className="health-icon health-saffron"><Archive size={16} /></span><span><strong>{lowStockCount ? `${lowStockCount} products need attention` : "Inventory looks healthy"}</strong><small>{lowStockCount ? "Check stock levels before the next drop." : "No low-stock signals at the moment."}</small></span><b>{lowStockCount ? "Review" : "Clear"}</b></div><div><span className="health-icon health-ink"><FileJson size={16} /></span><span><strong>Backup your workspace</strong><small>Export a JSON copy before moving browsers.</small></span><button type="button" className="mini-action" onClick={exportBackup}>Export <Download size={14} /></button></div></div></div><div className="panel-card quick-actions"><SectionLabel index="SHORTCUTS">Make a move</SectionLabel><h2>Shape the <em>catalog.</em></h2><div className="shortcut-grid"><button type="button" onClick={() => { setEditingProduct(null); setIsProductFormOpen(true); }}><Plus size={17} /><span>Add product</span></button><button type="button" onClick={() => { setEditingCategory(null); setIsCategoryFormOpen(true); }}><LayoutGrid size={17} /><span>Add category</span></button><button type="button" onClick={exportBackup}><Download size={17} /><span>Export backup</span></button><button type="button" onClick={() => setAdminSection("orders")}><Truck size={17} /><span>View orders</span></button></div></div></div></div>;

  const renderAdminProducts = () => <div className="admin-view"><div className="admin-view-heading"><div><SectionLabel index="CONSOLE / 02">Catalog control</SectionLabel><h1>Products, <em>in order.</em></h1><p>Add imagery, stock, tags, pricing, and visibility without leaving the device.</p></div><button type="button" className="button button-dark" onClick={() => { setEditingProduct(null); setIsProductFormOpen(true); }}><Plus size={16} /> Add product</button></div><div className="toolbar"><div className="admin-search"><Search size={16} /><input placeholder="Search catalog" value={query} onChange={(event) => setQuery(event.target.value)} /></div><Badge tone="dark">{store.products.length} total</Badge><button type="button" className="mini-filter" onClick={() => setQuery("")}><RotateCcw size={14} /> Reset</button></div><div className="admin-table">{store.products.filter((product) => !query || product.title.toLowerCase().includes(query.toLowerCase()) || product.sku.toLowerCase().includes(query.toLowerCase())).map((product) => <div className="admin-product-row" key={product.id}><img src={product.image} alt="" /><div className="admin-product-name"><strong>{product.title}</strong><span>{product.sku} · {getCategory(product.categoryId)?.name || "Uncategorized"}</span></div><div className="admin-product-price">{money(product.price, store.settings.currency)}{product.compareAt && <small>{money(product.compareAt, store.settings.currency)}</small>}</div><Badge tone={product.stock <= store.settings.lowStockThreshold ? "amber" : product.active ? "mint" : "rose"}>{product.active ? `${product.stock} in stock` : "Hidden"}</Badge><div className="row-actions"><IconButton label={`Edit ${product.title}`} onClick={() => { setEditingProduct(product); setIsProductFormOpen(true); }}><Pencil size={15} /></IconButton><IconButton label={`Delete ${product.title}`} onClick={() => deleteProduct(product.id)}><Trash2 size={15} /></IconButton></div></div>)}</div></div>;

  const renderAdminCategories = () => <div className="admin-view"><div className="admin-view-heading"><div><SectionLabel index="CONSOLE / 03">Collection control</SectionLabel><h1>Make room for <em>good things.</em></h1><p>Keep categories visible, useful, and easy to browse on small screens.</p></div><button type="button" className="button button-dark" onClick={() => { setEditingCategory(null); setIsCategoryFormOpen(true); }}><Plus size={16} /> Add category</button></div><div className="category-admin-grid">{store.categories.sort((a, b) => a.sort - b.sort).map((category) => <div className="category-admin-card" key={category.id}><img src={category.image} alt="" /><div><div className="category-admin-top"><Badge tone={category.visible ? "mint" : "rose"}>{category.visible ? "Visible" : "Hidden"}</Badge><span>Order {category.sort}</span></div><h3>{category.name}</h3><p>{category.description}</p><div className="category-admin-actions"><button type="button" onClick={() => { setEditingCategory(category); setIsCategoryFormOpen(true); }}><Pencil size={14} /> Edit</button><button type="button" onClick={() => deleteCategory(category.id)}><Trash2 size={14} /> Delete</button></div></div></div>)}</div></div>;

  const renderAdminOrders = () => <div className="admin-view"><div className="admin-view-heading"><div><SectionLabel index="CONSOLE / 04">Order queue</SectionLabel><h1>Move orders <em>forward.</em></h1><p>Orders created at checkout are retained locally and can be advanced here.</p></div><Badge tone="dark">{store.orders.length} saved</Badge></div>{store.orders.length ? <div className="admin-table order-admin-table">{store.orders.map((order) => <div className="order-admin-row" key={order.id}><div className="order-id-block"><strong>{order.id}</strong><span>{new Date(order.createdAt).toLocaleString("en-PK", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span></div><div><strong>{order.customer.name}</strong><span>{order.items.length} {order.items.length === 1 ? "item" : "items"} · {order.customer.phone}</span></div><strong>{money(order.total, store.settings.currency)}</strong><select value={order.status} onChange={(event) => setStore((current) => ({ ...current, orders: current.orders.map((item) => item.id === order.id ? { ...item, status: event.target.value as OrderStatus } : item) }))}><option>New</option><option>Packed</option><option>Shipped</option><option>Completed</option></select><IconButton label="View order details" onClick={() => toast.info(`${order.customer.address || "No address"}${order.customer.note ? ` · ${order.customer.note}` : ""}`)}><Eye size={15} /></IconButton></div>)}</div> : <EmptyState icon={<Truck size={25} />} title="No local orders yet" detail="Checkout activity will appear here as shoppers place orders." action="View storefront" onAction={() => changeView("home")} />}</div>;

  const renderAdminSettings = () => <div className="admin-view"><div className="admin-view-heading"><div><SectionLabel index="CONSOLE / 05">Store settings</SectionLabel><h1>Keep the system <em>clear.</em></h1><p>These preferences live in this browser and shape the storefront immediately.</p></div><Badge><ShieldCheck size={13} /> Client-only</Badge></div><div className="settings-layout"><div className="settings-panel"><div className="settings-panel-heading"><Palette size={18} /><div><h3>Store identity</h3><p>Lightweight brand controls for the local storefront.</p></div></div><label className="form-field"><span>Store name</span><input value={store.settings.brandName} onChange={(event) => setStore((current) => ({ ...current, settings: { ...current.settings, brandName: event.target.value } }))} /></label><label className="form-field"><span>Tagline</span><input value={store.settings.tagline} onChange={(event) => setStore((current) => ({ ...current, settings: { ...current.settings, tagline: event.target.value } }))} /></label><label className="form-field"><span>Contact number</span><input value={store.settings.contact} onChange={(event) => setStore((current) => ({ ...current, settings: { ...current.settings, contact: event.target.value } }))} /></label><div className="settings-inline"><label className="form-field"><span>Currency</span><select value={store.settings.currency} onChange={(event) => setStore((current) => ({ ...current, settings: { ...current.settings, currency: event.target.value } }))}><option>PKR</option><option>USD</option><option>AED</option><option>INR</option></select></label><label className="form-field"><span>Low-stock alert at</span><input type="number" min="0" value={store.settings.lowStockThreshold} onChange={(event) => setStore((current) => ({ ...current, settings: { ...current.settings, lowStockThreshold: Number(event.target.value) } }))} /></label></div><div className="toggle-row"><div><strong>Dark accent mode</strong><small>Keep the storefront canvas light for Quiet Commerce.</small></div><button type="button" className={`toggle ${store.settings.darkMode ? "toggle-on" : ""}`} onClick={() => setStore((current) => ({ ...current, settings: { ...current.settings, darkMode: !current.settings.darkMode } }))}><span /></button></div></div><div className="settings-panel"><div className="settings-panel-heading"><FileJson size={18} /><div><h3>Local data</h3><p>Move your catalog safely between browsers.</p></div></div><button type="button" className="data-action" onClick={exportBackup}><span><Download size={17} /><b>Export JSON backup</b><small>Products, categories, orders, and settings</small></span><ArrowRight size={16} /></button><button type="button" className="data-action" onClick={() => importRef.current?.click()}><span><Upload size={17} /><b>Import JSON backup</b><small>Restore a previous local workspace</small></span><ArrowRight size={16} /></button><input ref={importRef} type="file" accept="application/json" className="visually-hidden" onChange={handleImport} /><button type="button" className="data-action" onClick={() => { setAdminUnlocked(false); setIsAdminLoginOpen(true); }}><span><LockKeyhole size={17} /><b>Lock admin workspace</b><small>Require the local passcode again</small></span><ArrowRight size={16} /></button><div className="danger-zone"><div><strong>Reset starter catalog</strong><small>Removes local changes and order history.</small></div><button type="button" className="mini-action mini-danger" onClick={resetCatalog}><RotateCcw size={14} /> Reset</button></div></div></div><div className="security-note"><ShieldCheck size={17} /><p><strong>Static hosting note:</strong> this is a device-local admin gate, not server authentication. For shared accounts, protected uploads, real payments, and cross-device sync, connect a backend such as Shopify or a full-stack service.</p></div></div>;

  return <div className={`app-shell ${store.settings.darkMode ? "accent-dark" : ""}`}><div className="app-frame">{view !== "admin" && renderPublicHeader()}{view === "home" && renderHome()}{(view === "shop" || view === "saved") && renderShop()}{view === "cart" && renderCart()}{view === "account" && renderAccount()}{view === "admin" && renderAdmin()}{view !== "admin" && renderBottomNav()}</div>{isSearchOpen && <SearchOverlay query={query} setQuery={setQuery} onClose={() => setIsSearchOpen(false)} products={activeProducts} onOpen={(product) => { setSelectedProduct(product); setIsSearchOpen(false); }} onShop={() => { setIsSearchOpen(false); changeView("shop"); }} />}{selectedProduct && <ProductModal product={selectedProduct} category={getCategory(selectedProduct.categoryId)} currency={store.settings.currency} favorite={store.favorites.includes(selectedProduct.id)} onClose={() => setSelectedProduct(null)} onFavorite={() => toggleFavorite(selectedProduct.id)} onAdd={(quantity) => { addToCart(selectedProduct.id, quantity); setSelectedProduct(null); }} />}{isCheckoutOpen && <CheckoutModal items={cartItems} total={cartTotal} currency={store.settings.currency} onClose={() => setIsCheckoutOpen(false)} onSubmit={createOrder} />}{isAdminLoginOpen && <AdminLoginModal onClose={() => setIsAdminLoginOpen(false)} onSubmit={handleAdminLogin} />}{isProductFormOpen && <ProductFormModal product={editingProduct} categories={store.categories} onClose={() => setIsProductFormOpen(false)} onSave={(product) => { setStore((current) => ({ ...current, products: editingProduct ? current.products.map((item) => item.id === product.id ? product : item) : [product, ...current.products] })); setIsProductFormOpen(false); notify(editingProduct ? "Product updated" : "Product added"); }} />}{isCategoryFormOpen && <CategoryFormModal category={editingCategory} onClose={() => setIsCategoryFormOpen(false)} onSave={(category) => { setStore((current) => ({ ...current, categories: editingCategory ? current.categories.map((item) => item.id === category.id ? category : item) : [...current.categories, category] })); setIsCategoryFormOpen(false); notify(editingCategory ? "Category updated" : "Category added"); }} />}{toastMessage && <span className="visually-hidden" aria-live="polite">{toastMessage}</span>}</div>;
}

function ArrowUpRight({ size = 13 }: { size?: number }) { return <ArrowRight size={size} className="arrow-up-right" />; }

function SearchOverlay({ query, setQuery, onClose, products, onOpen, onShop }: { query: string; setQuery: (value: string) => void; onClose: () => void; products: Product[]; onOpen: (product: Product) => void; onShop: () => void }) {
  const matches = products.filter((product) => `${product.title} ${product.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  return <div className="overlay" role="dialog" aria-modal="true"><div className="search-drawer"><div className="drawer-top"><SectionLabel index="QUICK FIND">Search the edit</SectionLabel><IconButton label="Close search" onClick={onClose}><X size={19} /></IconButton></div><div className="drawer-search"><Search size={19} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “carry” or “home”" /><kbd>ESC</kbd></div>{query ? <div className="search-results">{matches.length ? matches.map((product) => <button type="button" key={product.id} className="search-result" onClick={() => onOpen(product)}><img src={product.image} alt="" /><span><strong>{product.title}</strong><small>{product.tags.join(" · ")}</small></span><ChevronRight size={16} /></button>) : <EmptyState icon={<Search size={21} />} title="No close matches" detail="Try a simpler word or explore the full shop." action="Open shop" onAction={onShop} />}</div> : <div className="search-suggestions"><span>Try a direction</span><div>{["everyday carry", "home essentials", "desk tools", "new in"].map((suggestion) => <button type="button" key={suggestion} onClick={() => setQuery(suggestion)}>{suggestion}<ArrowUpRight size={14} /></button>)}</div></div>}</div></div>;
}

function ProductModal({ product, category, currency, favorite, onClose, onFavorite, onAdd }: { product: Product; category?: Category; currency: string; favorite: boolean; onClose: () => void; onFavorite: () => void; onAdd: (quantity: number) => void }) {
  const [quantity, setQuantity] = useState(1);
  return <div className="overlay" role="dialog" aria-modal="true"><div className="product-modal"><div className="modal-image-wrap"><img src={product.image} alt={product.title} /><IconButton label="Close product" onClick={onClose} className="modal-close"><X size={19} /></IconButton><div className="modal-photo-tag"><ImageIcon size={13} /> Studio edit</div></div><div className="modal-copy"><div className="product-meta"><span>{category?.name || "Collection"}</span><button type="button" className="save-text" onClick={onFavorite}>{favorite ? "Saved" : "Save for later"} <Heart size={15} fill={favorite ? "currentColor" : "none"} /></button></div><h2>{product.title}</h2><div className="modal-price"><strong>{money(product.price, currency)}</strong>{product.compareAt && <del>{money(product.compareAt, currency)}</del>}</div><p>{product.description}</p><div className="detail-line"><span>Availability</span><Badge tone={product.stock <= 5 ? "amber" : "mint"}>{product.stock <= 5 ? `${product.stock} left` : "In stock"}</Badge></div><div className="detail-line"><span>SKU</span><code>{product.sku}</code></div><div className="quantity-control large"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={14} /></button><span>{quantity}</span><button type="button" onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}><Plus size={14} /></button></div><button type="button" className="button button-dark button-full" onClick={() => onAdd(quantity)}>Add to bag <ArrowRight size={16} /></button></div></div></div>;
}

function CheckoutModal({ items, total, currency, onClose, onSubmit }: { items: Array<{ product?: Product; quantity: number }>; total: number; currency: string; onClose: () => void; onSubmit: (customer: { name: string; phone: string; address: string; note: string }) => void }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const valid = form.name.trim() && form.phone.trim() && form.address.trim();
  return <div className="overlay" role="dialog" aria-modal="true"><div className="checkout-modal"><div className="drawer-top"><div><SectionLabel index="CHECKOUT / 01">A good next step</SectionLabel><h2>Delivery <em>details.</em></h2></div><IconButton label="Close checkout" onClick={onClose}><X size={19} /></IconButton></div><div className="checkout-note"><ShieldCheck size={17} /><span>Order will be saved locally and queued in the admin workspace. Payment is arranged offline.</span></div><div className="form-grid"><label className="form-field"><span>Full name</span><input value={form.name} onChange={update("name")} placeholder="Your name" /></label><label className="form-field"><span>Phone number</span><input value={form.phone} onChange={update("phone")} placeholder="03xx xxx xxxx" /></label><label className="form-field form-full"><span>Delivery address</span><textarea value={form.address} onChange={update("address")} placeholder="House, street, city" rows={3} /></label><label className="form-field form-full"><span>Note <small>Optional</small></span><input value={form.note} onChange={update("note")} placeholder="A delivery note for the store" /></label></div><div className="checkout-footer"><div><span>{items.reduce((sum, item) => sum + item.quantity, 0)} pieces</span><strong>{money(total, currency)}</strong></div><button type="button" className="button button-dark" disabled={!valid} onClick={() => onSubmit(form)}>Place local order <Check size={16} /></button></div></div></div>;
}

function AdminLoginModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (username: string, password: string) => boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return <div className="overlay" role="dialog" aria-modal="true"><div className="login-modal"><div className="login-mark"><img src={MARK_IMAGE} alt="" /></div><IconButton label="Close admin login" onClick={onClose} className="modal-close"><X size={19} /></IconButton><SectionLabel index="PRIVATE / LOCAL">Admin workspace</SectionLabel><h2>Make the catalog <em>yours.</em></h2><p className="login-description">Manage products, categories, stock, orders, imagery, and local backups from one calm console.</p><label className="form-field"><span>Username</span><input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="admin" autoComplete="username" /></label><label className="form-field"><span>Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" autoComplete="current-password" onKeyDown={(event) => event.key === "Enter" && onSubmit(username, password)} /></label><button type="button" className="button button-dark button-full" onClick={() => onSubmit(username, password)}>Unlock console <LockKeyhole size={16} /></button><div className="demo-credentials"><span>Demo access</span><code>admin</code><code>superstore</code></div><p className="security-copy"><ShieldCheck size={13} /> Local convenience gate only. Do not use it for sensitive shared admin accounts.</p></div></div>;
}

function ProductFormModal({ product, categories, onClose, onSave }: { product: Product | null; categories: Category[]; onClose: () => void; onSave: (product: Product) => void }) {
  const [form, setForm] = useState<Product>(() => product || { id: uid("prod"), categoryId: categories[0]?.id || "", title: "", description: "", image: PRODUCT_IMAGE, price: 0, compareAt: undefined, stock: 0, sku: `SS-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, tags: [], featured: false, active: true, updatedAt: today() });
  const [tagText, setTagText] = useState(form.tags.join(", "));
  const update = (key: keyof Product) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((current) => ({ ...current, [key]: key === "price" || key === "compareAt" || key === "stock" ? Number(event.target.value) : event.target.value }));
  const readImage = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setForm((current) => ({ ...current, image: String(reader.result) })); reader.readAsDataURL(file); };
  const valid = form.title.trim() && form.description.trim() && form.price > 0 && form.categoryId;
  return <div className="overlay" role="dialog" aria-modal="true"><div className="editor-modal"><div className="drawer-top"><div><SectionLabel index="CATALOG / PRODUCT">{product ? "Edit product" : "New product"}</SectionLabel><h2>{product ? "Refine the <em>details.</em>" : "Add a <em>good thing.</em>"}</h2></div><IconButton label="Close product editor" onClick={onClose}><X size={19} /></IconButton></div><div className="editor-grid"><div className="image-upload"><img src={form.image} alt="Product preview" /><label className="upload-control"><Upload size={16} /> Choose product image<input type="file" accept="image/*" onChange={readImage} /></label><small>Stored as a local data URL in this browser.</small></div><div className="form-grid"><label className="form-field form-full"><span>Product title</span><input value={form.title} onChange={update("title")} placeholder="e.g. Daily Carry Bottle" /></label><label className="form-field form-full"><span>Description</span><textarea value={form.description} onChange={update("description")} rows={3} placeholder="What makes this piece useful?" /></label><label className="form-field"><span>Category</span><select value={form.categoryId} onChange={update("categoryId")}>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label><label className="form-field"><span>SKU</span><input value={form.sku} onChange={update("sku")} /></label><label className="form-field"><span>Price</span><input type="number" min="0" value={form.price || ""} onChange={update("price")} /></label><label className="form-field"><span>Compare at <small>Optional</small></span><input type="number" min="0" value={form.compareAt || ""} onChange={update("compareAt")} /></label><label className="form-field"><span>Stock</span><input type="number" min="0" value={form.stock} onChange={update("stock")} /></label><label className="form-field"><span>Tags <small>comma separated</small></span><input value={tagText} onChange={(event) => { setTagText(event.target.value); setForm((current) => ({ ...current, tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })); }} /></label><div className="form-toggles form-full"><label><input type="checkbox" checked={form.featured} onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))} /><span>Featured in selected edit</span></label><label><input type="checkbox" checked={form.active} onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))} /><span>Visible in storefront</span></label></div></div></div><div className="editor-footer"><button type="button" className="text-button" onClick={onClose}>Cancel</button><button type="button" className="button button-dark" disabled={!valid} onClick={() => onSave({ ...form, updatedAt: today() })}>{product ? "Save changes" : "Add product"}<Check size={16} /></button></div></div></div>;
}

function CategoryFormModal({ category, onClose, onSave }: { category: Category | null; onClose: () => void; onSave: (category: Category) => void }) {
  const [form, setForm] = useState<Category>(() => category || { id: uid("cat"), name: "", description: "", image: CATEGORY_IMAGE, tint: "#E8F3E7", visible: true, sort: 5 });
  const update = (key: keyof Category) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((current) => ({ ...current, [key]: key === "sort" ? Number(event.target.value) : event.target.value }));
  const readImage = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setForm((current) => ({ ...current, image: String(reader.result) })); reader.readAsDataURL(file); };
  return <div className="overlay" role="dialog" aria-modal="true"><div className="editor-modal category-editor"><div className="drawer-top"><div><SectionLabel index="CATALOG / CATEGORY">{category ? "Edit category" : "New category"}</SectionLabel><h2>Shape a <em>collection.</em></h2></div><IconButton label="Close category editor" onClick={onClose}><X size={19} /></IconButton></div><div className="editor-grid"><div className="image-upload"><img src={form.image} alt="Category preview" /><label className="upload-control"><Upload size={16} /> Choose category image<input type="file" accept="image/*" onChange={readImage} /></label><small>Local image storage keeps the category available offline.</small></div><div className="form-grid"><label className="form-field form-full"><span>Category name</span><input value={form.name} onChange={update("name")} placeholder="e.g. Travel light" /></label><label className="form-field form-full"><span>Short description</span><textarea value={form.description} onChange={update("description")} rows={3} placeholder="A simple line that guides the browse." /></label><label className="form-field"><span>Display order</span><input type="number" min="1" value={form.sort} onChange={update("sort")} /></label><label className="form-field"><span>Color cue</span><input type="text" value={form.tint} onChange={update("tint")} placeholder="#E8F3E7" /></label><div className="form-toggles form-full"><label><input type="checkbox" checked={form.visible} onChange={(event) => setForm((current) => ({ ...current, visible: event.target.checked }))} /><span>Visible in storefront</span></label></div></div></div><div className="editor-footer"><button type="button" className="text-button" onClick={onClose}>Cancel</button><button type="button" className="button button-dark" disabled={!form.name.trim() || !form.description.trim()} onClick={() => onSave(form)}>{category ? "Save changes" : "Add category"}<Check size={16} /></button></div></div></div>;
}
