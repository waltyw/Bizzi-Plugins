export type Block =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'steps'; items: string[] }
  | { type: 'list'; items: string[] }
  | { type: 'code'; text: string }
  | { type: 'tip'; text: string }
  | { type: 'table'; head: string[]; rows: string[][] };

export type Guide = { slug: string; title: string; summary: string; pro?: boolean; body: Block[] };

export const GUIDES: Guide[] = [
  {
    slug: 'getting-started',
    title: 'Install & first steps',
    summary: 'Install the plugin, open the dashboard and show your first widget in five minutes.',
    body: [
      { type: 'h', text: 'Install the free plugin' },
      { type: 'steps', items: [
        'Download bizzi-reviews.zip from the Download section on our home page.',
        'In WordPress go to Plugins → Add New → Upload Plugin, choose the zip and click Install Now.',
        'Click Activate. A new Bizzi Reviews menu appears in your admin sidebar.',
      ] },
      { type: 'h', text: 'Your first five minutes' },
      { type: 'steps', items: [
        'Open Bizzi Reviews → Sources & API and connect Google (see “Connect Google reviews”), or add a testimonial under Bizzi Reviews → Add Review.',
        'On the Dashboard click Sync to pull your latest Google reviews.',
        'Check Bizzi Reviews → All Reviews to see what was imported.',
        'Edit any page, add the “Bizzi Reviews Carousel” block (or drag in the “Bizzi Reviews” Elementor widget) and publish.',
        'Open Settings → Widget Styling to match your brand colours.',
      ] },
      { type: 'tip', text: 'Reviews sync automatically once a day after the first connection, so new reviews appear on their own.' },
    ],
  },
  {
    slug: 'connect-google',
    title: 'Connect Google reviews',
    summary: 'Create a Google Places API key, find your Place ID and run your first sync.',
    body: [
      { type: 'p', text: 'Bizzi Reviews uses the official Google Places API to read your public Google reviews. You need two things: an API key and your business Place ID.' },
      { type: 'h', text: '1. Create a Google Places API key' },
      { type: 'steps', items: [
        'Go to console.cloud.google.com and sign in with your Google account.',
        'Click the project picker at the top → New Project, give it a name (e.g. “Website reviews”) and click Create.',
        'Open Billing and link a billing account. Google requires this for the Places API, but normal review syncing (once a day) stays well inside Google’s free monthly allowance.',
        'Go to APIs & Services → Library, search for “Places API” and click Enable.',
        'Go to APIs & Services → Credentials → Create Credentials → API key. Copy the key.',
        'Recommended: click the key, under API restrictions choose “Restrict key” and tick Places API, then Save.',
      ] },
      { type: 'tip', text: 'Do not add a “Websites (HTTP referrers)” restriction — the request comes from your server, not a browser, so Google would reject it. Use API restrictions instead.' },
      { type: 'h', text: '2. Find your Place ID' },
      { type: 'steps', items: [
        'Open Google’s Place ID Finder: developers.google.com/maps/documentation/places/web-service/place-id',
        'Type your business name exactly as it appears on Google Maps and pick it from the list.',
        'Copy the Place ID shown on the map (it starts with “ChIJ…”).',
      ] },
      { type: 'h', text: '3. Connect in WordPress' },
      { type: 'steps', items: [
        'Go to Bizzi Reviews → Sources & API.',
        'Paste the API key and Place ID into the Google section and save.',
        'Click Test Connection — you should see your business name.',
        'Go to the Dashboard and click Sync. Your reviews appear under All Reviews.',
      ] },
      { type: 'tip', text: 'Google’s API returns up to 5 of your most relevant reviews per sync. Bizzi Reviews keeps every review it has ever imported, so your collection grows as new reviews arrive each day.' },
    ],
  },
  {
    slug: 'woocommerce-manual',
    title: 'Manual reviews',
    summary: 'Add testimonials by hand (WooCommerce import needs Pro).',
    body: [
      { type: 'h', text: 'Add a review by hand' },
      { type: 'steps', items: [
        'Go to Bizzi Reviews → Add Review.',
        'Enter the reviewer name, star rating, date and review text.',
        'Optionally add a Source Label (e.g. “Yelp” or “Email”) and an avatar image URL.',
        'Click Save. Manual reviews are approved straight away and show in every widget.',
      ] },
      { type: 'p', text: 'There is no limit on how many manual reviews you can add.' },
      { type: 'h', text: 'WooCommerce product reviews (Pro)' },
      { type: 'p', text: 'With Bizzi Reviews Pro installed and WooCommerce active, go to Sources & API, enable WooCommerce and click Sync. Approved product reviews are imported and can be filtered with source="woocommerce".' },
    ],
  },
  {
    slug: 'moderation',
    title: 'Moderating reviews',
    summary: 'Approve, hide or reject reviews and set auto-approve rules.',
    body: [
      { type: 'h', text: 'Review statuses' },
      { type: 'table', head: ['Status', 'Shown on site?', 'Meaning'], rows: [
        ['Approved', 'Yes', 'Visible in all widgets'],
        ['Pending', 'No', 'Waiting for you to approve'],
        ['Hidden', 'No', 'Kept, but not displayed'],
        ['Rejected', 'No', 'Declined; will not be re-imported as approved'],
      ] },
      { type: 'h', text: 'Change a review’s status' },
      { type: 'p', text: 'Open Bizzi Reviews → All Reviews, filter by status or source if needed, and use the action buttons on each review.' },
      { type: 'h', text: 'Auto-approve rules' },
      { type: 'p', text: 'Under Bizzi Reviews → Settings → Moderation choose how newly synced reviews are handled:' },
      { type: 'list', items: [
        'All Reviews — every new review is approved automatically (default).',
        'Minimum Rating — only reviews at or above “Min Rating to Auto-Approve” (e.g. 4 stars) are approved; the rest go to Pending.',
        'Manual Only — every new review waits in Pending for you.',
      ] },
    ],
  },
  {
    slug: 'add-widget',
    title: 'Add a widget to a page',
    summary: 'Use blocks, Elementor widgets or shortcodes to place a carousel, single review or combined rating.',
    body: [
      { type: 'h', text: 'Using the block editor' },
      { type: 'steps', items: [
        'Edit a page or post and click the + button.',
        'Search for “Bizzi Reviews Carousel” and insert it.',
        'Use the block settings on the right to change source, number of reviews and colours.',
        'Update / Publish the page.',
      ] },
      { type: 'h', text: 'Using Elementor' },
      { type: 'p', text: 'Bizzi Reviews has native Elementor widgets — no shortcodes needed. See “Elementor widgets” for the full guide.' },
      { type: 'h', text: 'Using shortcodes (other page builders)' },
      { type: 'p', text: 'Add a Shortcode block (or a text/shortcode widget in Divi, Beaver Builder, etc.) and paste one of these:' },
      { type: 'code', text: '[bizzi_reviews]                       ← review carousel\n[bizzi_reviews layout="single"]       ← one featured review\n[bizzi_single_review id="12"]         ← a specific review\n[bizzi_combined_rating]               ← overall rating summary' },
      { type: 'p', text: 'Pro adds grid, list, wall and floating badge layouts: layout="grid", layout="list", layout="wall" and [bizzi_rating_badge].' },
      { type: 'tip', text: 'You can find a review’s ID in Bizzi Reviews → All Reviews.' },
    ],
  },
  {
    slug: 'elementor',
    title: 'Elementor widgets',
    summary: 'Drag Bizzi Reviews widgets into any Elementor page and style them in the panel.',
    body: [
      { type: 'p', text: 'With Elementor active, Bizzi Reviews adds its own widget category. The widgets render live in the editor, so you see exactly what visitors will see.' },
      { type: 'h', text: 'Add a widget' },
      { type: 'steps', items: [
        'Edit a page with Elementor.',
        'In the widget panel search for “Bizzi” (or scroll to the Bizzi Reviews category).',
        'Drag a widget onto the page and adjust it in the Content tab.',
        'Click Publish / Update.',
      ] },
      { type: 'table', head: ['Widget', 'What it shows'], rows: [
        ['Bizzi Reviews', 'A carousel of reviews (grid, list and wall with Pro)'],
        ['Single Review', 'One review you pick from a searchable list'],
        ['Combined Rating', 'Your overall star rating and review count'],
        ['Rating Badge (Pro)', 'A star badge, inline or floating in a corner'],
      ] },
      { type: 'h', text: 'Content options' },
      { type: 'list', items: [
        'Source, number of reviews, minimum rating, date range and keyword filters.',
        'Columns per device (desktop, tablet, mobile), autoplay and slide speed.',
        'Show or hide stars, review text, names, photos, dates and source, plus a text length limit.',
      ] },
      { type: 'h', text: 'Style tab' },
      { type: 'p', text: 'Set primary, star, text and background colours, card corner radius, padding and shadow, plus font and font size. These override your site-wide Widget Styling for that widget only.' },
      { type: 'tip', text: 'If a widget shows a dashed orange box in the editor, no reviews match its filters yet. Widen the filters or sync your reviews — the box never appears to visitors.' },
    ],
  },
  {
    slug: 'widget-styling',
    title: 'Match widgets to your site',
    summary: 'Set colours, fonts, corners and shadows site-wide or per widget.',
    body: [
      { type: 'h', text: 'Site-wide defaults' },
      { type: 'p', text: 'Go to Bizzi Reviews → Settings → Widget Styling. Set the primary colour, star colour, text and background colours, corner radius, card shadow and font. Every widget uses these unless you override them.' },
      { type: 'h', text: 'Per-widget overrides' },
      { type: 'p', text: 'Any shortcode can override the defaults:' },
      { type: 'code', text: '[bizzi_reviews primary_color="#000000" star_color="#ffb000" background_color="#ffffff" card_border_radius="20" card_shadow="false" font_family="Poppins"]' },
      { type: 'tip', text: 'Use font_family="inherit" (the default) to use your theme’s font automatically.' },
    ],
  },
  {
    slug: 'shortcodes',
    title: 'Shortcode reference',
    summary: 'Every shortcode and attribute in one table.',
    body: [
      { type: 'h', text: '[bizzi_reviews]' },
      { type: 'table', head: ['Attribute', 'Default', 'Description'], rows: [
        ['layout', 'carousel', 'carousel, single (Pro: grid, list, wall, badge)'],
        ['source', '(all)', 'google, manual (Pro: facebook, woocommerce)'],
        ['limit', '20', 'Number of reviews (1–100)'],
        ['min_rating', '0', 'Only show reviews with at least this many stars'],
        ['keyword', '', 'Only show reviews containing this word'],
        ['date_range', '', 'last_30, last_90, last_12m, last_2y'],
        ['columns / columns_tablet / columns_mobile', '3 / 2 / 1', 'Cards per row'],
        ['max_text_length', '200', 'Characters before “Read more”'],
        ['show_name, show_avatar, show_date, show_source, show_rating, show_text', 'true', 'Set to false to hide'],
        ['autoplay / speed', 'true / 5', 'Carousel autoplay and seconds per slide'],
        ['primary_color, text_color, background_color, star_color', 'Settings', 'Hex colours'],
        ['card_border_radius / card_shadow / card_padding', '12 / true / 24', 'Card shape'],
        ['font_family / font_size / gap', 'inherit / 14 / 20', 'Typography and spacing'],
      ] },
      { type: 'h', text: '[bizzi_single_review]' },
      { type: 'p', text: 'id (review ID; leave empty for the latest top-rated review), plus the show_* and colour attributes above.' },
      { type: 'h', text: '[bizzi_combined_rating]' },
      { type: 'p', text: 'Shows your overall average and a per-source breakdown. Accepts primary_color, text_color, background_color, star_color, card_border_radius, font_family.' },
      { type: 'h', text: '[bizzi_rating_badge] (Pro)' },
      { type: 'p', text: 'Floating rating badge. position (bottom-right, bottom-left, top-right, top-left), dismissible (true/false), link (URL to open on click), plus colour attributes.' },
    ],
  },
  {
    slug: 'connect-facebook',
    title: 'Facebook reviews (Pro)',
    summary: 'Get a Page ID and a long-lived Page access token.',
    pro: true,
    body: [
      { type: 'p', text: 'Facebook recommendations require Bizzi Reviews Pro and admin access to your Facebook Page.' },
      { type: 'h', text: '1. Create a Meta app' },
      { type: 'steps', items: [
        'Go to developers.facebook.com → My Apps → Create App. Choose “Other” then “Business”.',
        'Open Tools → Graph API Explorer. Select your app, then “Get Page Access Token” and choose your Page.',
        'Add the permissions pages_show_list, pages_read_engagement and pages_read_user_content, then Generate Access Token.',
      ] },
      { type: 'h', text: '2. Make the token long-lived' },
      { type: 'steps', items: [
        'Open the Access Token Debugger (developers.facebook.com/tools/debug/accesstoken), paste the token and click “Extend Access Token”.',
        'Back in Graph API Explorer, run me/accounts with the extended user token. Copy the access_token and id of your Page — this Page token does not expire.',
      ] },
      { type: 'h', text: '3. Connect in WordPress' },
      { type: 'steps', items: [
        'Go to Bizzi Reviews → Sources & API → Facebook.',
        'Paste the Page ID and Page access token, save and click Test Connection.',
        'Click Sync on the Dashboard.',
      ] },
    ],
  },
  {
    slug: 'license-updates',
    title: 'Pro licence & updates (Pro)',
    summary: 'Install the Pro add-on, activate your key and get one-click updates.',
    pro: true,
    body: [
      { type: 'steps', items: [
        'Buy Pro or Agency from the Pricing section. After payment you’ll see your licence key and a Download Bizzi Reviews Pro button.',
        'Keep the free Bizzi Reviews plugin installed and active — Pro is an add-on.',
        'In WordPress go to Plugins → Add New → Upload Plugin, upload bizzi-reviews-pro.zip and activate it.',
        'Go to Bizzi Reviews → Pro Licence, paste your key (BIZZI-PRO-… or BIZZI-AGENCY-…) and click Activate.',
      ] },
      { type: 'h', text: 'Sites per licence' },
      { type: 'list', items: ['Pro — 1 website', 'Agency — unlimited websites'] },
      { type: 'p', text: 'To move Pro to another site, click Deactivate on the old site first, then activate on the new one.' },
      { type: 'h', text: 'Updates' },
      { type: 'p', text: 'While your licence is active, new Pro versions appear in Dashboard → Updates and on the Plugins page like any other plugin — click Update now.' },
    ],
  },
  {
    slug: 'troubleshooting',
    title: 'Troubleshooting',
    summary: 'Fixes for sync errors, missing widgets and caching.',
    body: [
      { type: 'h', text: 'Google: “REQUEST_DENIED” or “API key invalid”' },
      { type: 'list', items: [
        'Check the Places API is enabled in the same Google Cloud project as the key.',
        'Make sure billing is linked to the project.',
        'Remove any HTTP referrer (website) restriction from the key — use API restrictions only.',
      ] },
      { type: 'h', text: 'Google: “NOT_FOUND” or “INVALID_REQUEST”' },
      { type: 'p', text: 'The Place ID is wrong. Look it up again with Google’s Place ID Finder and paste it without spaces.' },
      { type: 'h', text: 'Widget shows “No reviews found”' },
      { type: 'list', items: [
        'Check All Reviews — are the reviews Approved (not Pending)?',
        'Remove filters such as source, min_rating, keyword or date_range from the shortcode.',
      ] },
      { type: 'h', text: 'Widget looks unstyled or doesn’t slide' },
      { type: 'p', text: 'Clear any caching or optimisation plugin (WP Rocket, LiteSpeed, Autoptimize, etc.) and your CDN cache. If you use “delay JavaScript”, exclude files containing bizzi-reviews.' },
      { type: 'h', text: 'Reviews stopped updating' },
      { type: 'p', text: 'Daily sync uses WP-Cron, which needs site visitors to run. Click Sync on the Dashboard manually, or ask your host to set up a real cron job for wp-cron.php.' },
      { type: 'h', text: 'Pro licence won’t activate' },
      { type: 'list', items: [
        'Copy the key exactly, including the BIZZI- prefix.',
        'A Pro key works on one site — deactivate it on the old site first.',
        'If your subscription lapsed, renew from the Pricing section.',
      ] },
    ],
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
