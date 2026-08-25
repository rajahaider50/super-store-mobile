# Super Store Mobile — Design Direction

## تین ممکنہ اسٹائلسٹک اپروچز

### Approach 01 — Quiet Commerce
**Very Brief Intro:** ایک نرم، روشن اور editorial انداز جس میں warm paper surfaces، گہرا graphite text، اور محدود mint accents ہوں۔ یہ direction اعتماد، سادگی اور premium product discovery کا احساس پیدا کرے گا۔

**Probability:** 0.04

### Approach 02 — Signal Market
**Very Brief Intro:** ایک dark, high-contrast retail interface جس میں cobalt signals، compact data panels اور subtle glow-based interaction states ہوں۔ یہ direction technology-forward اور energetic محسوس ہوگا۔

**Probability:** 0.08

### Approach 03 — Citrus Utility
**Very Brief Intro:** ایک crisp utility-first store جس میں soft stone background، citrus highlight اور bold condensed typography ہو۔ یہ direction تیز، واضح اور mobile-native browsing کے لیے بنایا جائے گا۔

**Probability:** 0.06

## منتخب اپروچ — Quiet Commerce

### Design Movement
Contemporary editorial commerce، جس میں Dieter Rams کی functional restraint، Japanese retail packaging کی ترتیب، اور iOS-style spatial clarity کو یکجا کیا گیا ہے۔

### Core Principles
1. **Calm hierarchy:** ہر screen پر ایک واضح primary action ہوگا؛ visual noise کو جان بوجھ کر کم رکھا جائے گا۔
2. **Tactile surfaces:** cards اور controls نرم depth، subtle borders، paper-like warmth اور responsive press states کے ساتھ محسوس ہوں گے۔
3. **Editorial rhythm:** product imagery، price، metadata اور whitespace کو magazine-like cadence میں ترتیب دیا جائے گا۔
4. **Offline confidence:** sync status، local data، drafts اور saved state کو غیر واضح نہ رکھا جائے؛ app ہمیشہ اپنے current state کا صاف اشارہ دے گی۔

### Color Philosophy
Base tone ایک warm porcelain canvas ہے تاکہ product imagery اور category color زیادہ نمایاں رہیں۔ Text کے لیے ink graphite استعمال ہوگا جو pure black کی سختی سے بچاتا ہے۔ Signature mint-green action color freshness، trust اور “ready to buy” momentum کو ظاہر کرتا ہے، جبکہ saffron صرف important notices، stock signals اور limited promotional emphasis کے لیے ہوگا۔

**Core palette:** Porcelain `#F6F5F1`, Ink `#18211D`, Graphite `#52605A`, Signal Mint `#18B981`, Soft Mint `#DDF7EC`, Saffron `#E9A23B`, Rose Alert `#C85252`.

### Layout Paradigm
Mobile-first vertical canvas، جس میں top app bar compact رہے گا، hero content edge-to-edge ہوگا، اور catalog content asymmetric editorial blocks میں بہے گا۔ Desktop پر interface ایک centered “device-like” commerce canvas نہیں بنے گا؛ بلکہ max-width content، split panes اور persistent admin sidebar کے ذریعے responsive expansion کرے گا۔ Bottom navigation public shopping کے لیے thumb-reachable ہوگی، جبکہ admin میں persistent left rail استعمال ہوگا۔

### Signature Elements
- **Mint signal dot:** online/offline/sync status اور active states کے لیے چھوٹا circular mint indicator۔
- **Paper rail cards:** warm surfaces، hairline borders، soft shadow اور clipped image corners والا product card system۔
- **Catalog index labels:** section headers کے ساتھ uppercase micro-labels جیسے `01 / NEW IN` اور `02 / CATEGORIES` تاکہ store کو editorial index کا احساس ملے۔

### Interaction Philosophy
Tap targets واضح اور thumb-friendly ہوں گے؛ ہر button press پر subtle scale response اور ہر destructive action پر confirmation ہوگا۔ Empty states users کو اگلا قدم بتائیں گے، صرف خاموش blank screens نہیں ہوں گے۔ Offline state کو error کے طور پر نہیں بلکہ “saved locally” confidence state کے طور پر communicate کیا جائے گا۔

### Animation
Entrance transitions صرف opacity اور translateY پر مبنی ہوں گی، 180–260ms کے snappy ease-out کے ساتھ۔ Product cards 30–50ms کے stagger سے آ سکتے ہیں؛ drawers اور dialogs 220ms کے اندر کھلیں گے۔ Button press پر 0.97 scale ہوگا۔ Cart badge، sync indicator اور toast میں مختصر micro-motion ہوگا۔ `prefers-reduced-motion` کے تحت decorative motion بند رہے گی۔

### Typography System
- **Display:** `DM Sans`، 700/800 weights — product titles، dashboard numbers اور hero headings کے لیے۔
- **Body:** `Manrope`، 400/500/600 weights — descriptions، labels، forms اور navigation کے لیے۔
- **Utility:** `Space Mono`، 500/700 — prices، inventory counts، order IDs اور technical status labels کے لیے۔

Hierarchy میں H1 compact مگر bold، H2 editorial section marker، body line-height generous، اور utility labels uppercase tracking کے ساتھ ہوں گے۔

### Brand Essence
**Positioning:** Super Store Mobile ایک offline-first، premium local commerce workspace ہے جو Android users کو تیز shopping اور store owners کو آسان catalog control ایک ہی app میں دیتا ہے۔

**Personality:** calm، precise، capable.

### Brand Voice
Headlines مختصر، واضح اور product-aware ہوں گی؛ CTAs action-oriented مگر pushy نہیں ہوں گے؛ microcopy صارف کو system state صاف بتائے گی۔

**Example lines:**
- “روزمرہ کی اچھی چیزیں، ایک صاف جگہ پر۔”
- “اپنا catalog سنبھالیں، چاہے connection موجود نہ ہو۔”

### Wordmark & Logo
Logo ایک abstract “S” نہیں بلکہ دو interlocking shelf-ribbons پر مبنی ہوگا: اوپر والا ribbon discovery اور نیچے والا ribbon storage/fulfillment کو ظاہر کرے گا۔ دونوں ribbons ایک compact square mark میں بند ہوں گے، جس میں negative space ایک subtle shopping-bag notch بنائے گا۔ Wordmark rounded geometric lettering میں ہوگا، مگر icon خود text کے بغیر استعمال ہو سکے گا۔

### Signature Brand Color
**Signal Mint `#18B981`** — یہ Super Store Mobile کی ownable action color ہے: calm green نہیں، بلکہ crisp retail mint جو saved state، availability اور confident action کو ایک ساتھ communicate کرتی ہے۔

## Product Scope Vocabulary

### Public storefront
Home discovery، search، category browse، product detail، favorites، cart، checkout form، order confirmation، order history، profile/settings، theme toggle، language-ready labels، offline banner، install prompt، and empty/error states.

### Admin workspace
Admin login، dashboard metrics، product CRUD، category CRUD، image upload to local storage, pricing/discount/stock fields، featured toggle، low-stock filter، order queue، storefront settings، export/import JSON backup، reset demo catalog، local data health، change password، logout، and delete confirmations.

### Data model
`StoreSettings` stores brand name, currency, contact details, checkout behavior and theme. `Category` stores id, name, slug, description, image data URL, color, visibility and sort order. `Product` stores id, category id, title, slug, description, image data URL, price, compare-at price, stock, SKU, tags, featured state, active state and updated timestamp. `CartItem` stores product id and quantity. `Order` stores id, items snapshot, customer details, totals, status and created timestamp. All records persist in versioned localStorage keys with import/export support.

## Non-negotiable implementation constraint
GitHub Pages is static hosting. Therefore this version will provide a **working client-side admin experience**, offline localStorage persistence, and a convenience username/password gate, but it cannot provide cryptographically secure multi-user authentication, server-side image uploads, shared cloud data, real payment processing, or cross-device synchronization without a backend. The UI will make this boundary explicit rather than implying server security that does not exist.

## Style Decisions

- The header must always show the shelf-ribbon square mark and the rounded geometric Super Store wordmark treatment.
- Quiet Commerce product and category surfaces default to warm paper/card tactility; dark overlays are used only where photography needs contrast.
- Primary public screens include a subtle offline/local-confidence cue, using Signal Mint for ready, saved, and available states.
- Copy should stay short and calm while naming the product and operational value more directly, rather than relying only on generic lifestyle minimalism.
