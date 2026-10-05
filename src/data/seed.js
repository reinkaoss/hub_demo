import { svgArt } from './art';

/**
 * Seed data for the demo. Everything here is fictional: clients, people, universities and
 * addresses (example.com is a reserved domain). Dates are relative to "now", so the demo always
 * looks recent however long ago it was built.
 */
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const ago = (ms) => Date.now() - ms;

export const ADMIN = { id: 'ADM-1', name: 'Alex Morgan' };

const slug = (name) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]+/g, '.')
    .replace(/^\.|\.$/g, '');

function ambassadors() {
  const row = (n, name, university, campaigns, extra = {}) => ({
    id: `AMB-${1000 + n}`,
    name,
    email: `${slug(name)}@example.com`,
    university,
    campaigns,
    activated: true,
    suspended: false,
    online: false,
    lastSeenAt: ago(DAY),
    ...extra,
  });
  return [
    row(1, 'Sam Rivera', 'Eastfield University', ['HB26', 'OM26'], { online: true, lastSeenAt: Date.now() }),
    row(2, 'Priya Nair', 'Westmoor University', ['HB26', 'LE26'], { online: true, lastSeenAt: Date.now() }),
    row(3, 'Jordan Blake', 'Northbridge University', ['LE26', 'PC26'], { lastSeenAt: ago(25 * MIN) }),
    row(4, 'Mei Tanaka', 'Eastfield University', ['HB26', 'PC26'], { lastSeenAt: ago(3 * HOUR) }),
    row(5, 'Daniel Okafor', 'Riverside University', ['OM26'], { lastSeenAt: ago(DAY) }),
    row(6, 'Chloe Bennett', "St Aldric's College", ['LE26'], { lastSeenAt: ago(2 * DAY) }),
    row(7, 'Amir Haddad', 'Westmoor University', ['HB26'], { lastSeenAt: ago(5 * DAY) }),
    row(8, 'Freya Lindqvist', 'Northbridge University', ['PC26', 'OM26'], { activated: false, lastSeenAt: null }),
    row(9, 'Tomás Ferreira', 'Riverside University', ['HB26', 'LE26'], { activated: false, lastSeenAt: null }),
    row(10, 'Hannah Cole', 'Eastfield University', ['LE26'], { suspended: true, lastSeenAt: ago(12 * DAY) }),
    row(11, 'Kwame Mensah', "St Aldric's College", ['PC26'], { lastSeenAt: ago(6 * HOUR) }),
    row(12, 'Isla Murray', 'Westmoor University', ['OM26', 'PC26'], { lastSeenAt: ago(40 * MIN) }),
    row(13, 'Rohan Desai', 'Northbridge University', ['HB26'], { lastSeenAt: ago(9 * DAY) }),
    row(14, 'Lucy Armstrong', 'Riverside University', ['LE26', 'OM26'], { lastSeenAt: ago(4 * DAY) }),
  ];
}

const campaigns = () => [
  { code: 'HB26', name: 'Fresher Accounts', client: 'Halcyon Bank', payRate: 12.5, target: 600, signups: 412, hue: 172 },
  { code: 'LE26', name: 'Switch & Save', client: 'Lumen Energy', payRate: 11, target: 400, signups: 187, hue: 38 },
  { code: 'PC26', name: 'Student Lockers', client: 'Parcelly', payRate: 11.5, target: 300, signups: 241, hue: 262 },
  { code: 'OM26', name: 'SIM Launch', client: 'Orbit Mobile', payRate: 12, target: 500, signups: 96, hue: 210 },
];

function submissions() {
  const s = (n, ambassadorId, campaignCode, status, hours, extra = {}) => ({
    id: `SUB-${1000 + n}`,
    ambassadorId,
    campaignCode,
    type: 'timesheet',
    status,
    hours,
    bonus: 0,
    reach: 0,
    description: '',
    promotionType: 'other',
    socialUrl: null,
    createdAt: ago((n + 2) * 5 * HOUR),
    rejectionReason: null,
    ...extra,
  });
  return [
    s(1, 'AMB-1001', 'HB26', 'pending', 3, {
      promotionType: 'instagram',
      reach: 1850,
      description: 'Three stories and a reel on the Fresher Account offer, with the link in bio.',
      socialUrl: 'https://social.example/p/aa81',
    }),
    s(2, 'AMB-1002', 'HB26', 'pending', 4, {
      promotionType: 'face_to_face',
      reach: 140,
      description: 'Stall outside the student union. Handed out about 90 flyers and booked 12 sign-ups.',
    }),
    s(3, 'AMB-1003', 'LE26', 'pending', 2.5, {
      promotionType: 'whatsapp',
      reach: 320,
      description: 'Shared the offer across four society group chats.',
    }),
    s(4, 'AMB-1004', 'PC26', 'pending', 1.5, {
      promotionType: 'face_to_face',
      reach: 0,
      description: 'Put posters up in three halls of residence.',
    }),
    s(5, 'AMB-1012', 'OM26', 'pending', 3.5, {
      promotionType: 'tiktok',
      reach: 8800,
      description: 'Two short videos showing the SIM unboxing. 8.8k views so far.',
      socialUrl: 'https://social.example/v/tk93',
    }),
    s(6, 'AMB-1013', 'HB26', 'pending', 1, {
      promotionType: 'other',
      reach: 60,
      description: 'Spoke to the rugby club committee about a group offer.',
    }),
    s(7, 'AMB-1001', 'OM26', 'approved', 2, {
      promotionType: 'tiktok',
      reach: 5200,
      description: 'Launch-week TikTok with the campaign sound.',
      socialUrl: 'https://social.example/v/tk51',
    }),
    s(8, 'AMB-1002', 'LE26', 'approved', 5, {
      promotionType: 'face_to_face',
      reach: 260,
      description: 'Freshers fair stall, five hours, 31 sign-ups.',
    }),
    s(9, 'AMB-1005', 'OM26', 'approved', 3, {
      promotionType: 'instagram',
      reach: 2100,
      description: 'Carousel post and a story series.',
      socialUrl: 'https://social.example/p/ig44',
    }),
    s(10, 'AMB-1014', 'LE26', 'approved', 0, {
      bonus: 25,
      description: 'Bonus: most sign-ups in the week.',
    }),
    s(11, 'AMB-1003', 'PC26', 'approved', 2, {
      promotionType: 'linkedin',
      reach: 960,
      description: 'Post aimed at the careers society network.',
      socialUrl: 'https://social.example/in/li17',
    }),
    s(12, 'AMB-1006', 'LE26', 'paid', 4, {
      promotionType: 'face_to_face',
      reach: 180,
      description: 'Library entrance stall.',
    }),
    s(13, 'AMB-1007', 'HB26', 'paid', 2, {
      promotionType: 'whatsapp',
      reach: 410,
      description: 'Course group chats.',
    }),
    s(14, 'AMB-1004', 'HB26', 'paid', 6, {
      promotionType: 'face_to_face',
      reach: 300,
      description: 'Full-day stall at the open day.',
    }),
    s(15, 'AMB-1011', 'PC26', 'rejected', 2, {
      promotionType: 'email',
      reach: 220,
      description: 'Email to the halls mailing list.',
      rejectionReason: 'The evidence screenshot is cropped. Please re-upload the full email send.',
    }),
  ];
}

function expenses() {
  const e = (n, ambassadorId, campaignCode, status, amount, description, extra = {}) => ({
    id: `EXP-${1000 + n}`,
    ambassadorId,
    campaignCode,
    status,
    amount,
    description,
    isChargeback: false,
    createdAt: ago((n + 1) * 7 * HOUR),
    rejectionReason: null,
    ...extra,
  });
  return [
    e(1, 'AMB-1001', 'HB26', 'pending', 38.2, 'Train fare to the Westmoor fair'),
    e(2, 'AMB-1002', 'HB26', 'pending', 12.5, 'Printing flyers'),
    // The trap: a £0.00 expense. It can be submitted by a careless form, but cannot be approved.
    e(3, 'AMB-1003', 'LE26', 'pending', 0, 'Parking (receipt to follow)'),
    e(4, 'AMB-1012', 'OM26', 'pending', 18.75, 'Poster tube and tape'),
    e(5, 'AMB-1004', 'PC26', 'approved', 7.99, 'Blu-tack and sellotape'),
    e(6, 'AMB-1005', 'OM26', 'approved', 120, 'Banner stand hire'),
    e(7, 'AMB-1013', 'HB26', 'approved', 45, 'Damaged lanyard stock', { isChargeback: true }),
    e(8, 'AMB-1006', 'LE26', 'paid', 22.4, 'Stall table hire', { paidAt: ago(2 * DAY) }),
    e(9, 'AMB-1007', 'HB26', 'paid', 15, 'Photocopying', { paidAt: ago(2 * DAY) }),
    // Two paid expenses for the same person and campaign: the export sums them into one line.
    e(10, 'AMB-1002', 'LE26', 'paid', 9.6, 'Lanyards', { paidAt: ago(2 * DAY) }),
    e(11, 'AMB-1002', 'LE26', 'paid', 5.4, 'Name badges', { paidAt: ago(2 * DAY) }),
    e(12, 'AMB-1011', 'PC26', 'rejected', 64, 'Taxi to evening event', {
      rejectionReason: 'The receipt is not legible. Please upload a clearer photo.',
    }),
  ];
}

function folders() {
  const set = (code) => [
    { id: `${code}-brand`, campaignCode: code, name: 'Brand assets' },
    { id: `${code}-guides`, campaignCode: code, name: 'Scripts & guides' },
    { id: `${code}-photos`, campaignCode: code, name: 'Event photos' },
  ];
  return ['HB26', 'LE26', 'PC26', 'OM26'].flatMap(set);
}

function resources() {
  const r = (code, folder, title, kind, extra = {}) => ({
    id: `RES-${code}-${title.replace(/\W+/g, '').toLowerCase()}`,
    campaignCode: code,
    folderId: `${code}-${folder}`,
    title,
    kind,
    sizeBytes: 2_400_000,
    thumb: null,
    likes: 0,
    comments: 0,
    ...extra,
  });
  const img = (code, folder, title, extra) =>
    r(code, folder, title, 'image', { thumb: svgArt(`${code}${title}`, { variant: 'photo' }), ...extra });
  const vid = (code, folder, title, extra) =>
    r(code, folder, title, 'video', {
      thumb: svgArt(`${code}${title}`, { variant: 'frame', label: '0:42' }),
      sizeBytes: 38_000_000,
      ...extra,
    });

  return [
    img('HB26', 'brand', 'Hero banner.png', { likes: 6 }),
    img('HB26', 'brand', 'Story template.png', { likes: 3, comments: 1 }),
    r('HB26', 'brand', 'Logo pack.pdf', 'pdf', { sizeBytes: 840_000 }),
    vid('HB26', 'brand', 'Campaign explainer.mp4', { likes: 9, comments: 2 }),
    // Edge cases the viewer handles gracefully:
    img('HB26', 'brand', 'Roll-up banner (print).png', { sizeBytes: 31_000_000, tooLarge: true }),
    vid('HB26', 'photos', 'Archive footage.mov', { thumb: null, sizeBytes: 220_000_000 }),
    r('HB26', 'guides', 'Stall script.pdf', 'pdf', { sizeBytes: 410_000, likes: 4 }),
    r('HB26', 'guides', 'FAQ sheet.docx', 'document', { sizeBytes: 96_000 }),
    r('HB26', 'guides', 'Dos and donts.pdf', 'pdf', { sizeBytes: 220_000 }),
    img('HB26', 'photos', 'Freshers fair stall.jpg', { likes: 5 }),
    img('HB26', 'photos', 'Society night.jpg'),
    vid('HB26', 'photos', 'Launch day.mp4', { likes: 2 }),
    img('HB26', 'photos', 'Team photo.jpg', { likes: 8 }),

    img('LE26', 'brand', 'Offer poster.png'),
    r('LE26', 'guides', 'Switching guide.pdf', 'pdf'),
    vid('LE26', 'photos', 'Stall walkthrough.mp4'),
    img('LE26', 'photos', 'Library entrance.jpg'),

    img('PC26', 'brand', 'Locker mockup.png'),
    r('PC26', 'guides', 'Pitch notes.docx', 'document'),
    img('PC26', 'photos', 'Halls install.jpg'),

    img('OM26', 'brand', 'SIM pack render.png'),
    vid('OM26', 'brand', 'Unboxing reference.mp4'),
    r('OM26', 'guides', 'Hashtag guide.pdf', 'pdf'),
  ];
}

function socialPosts() {
  const p = (n, campaignCode, ambassadorId, platform, handle, caption, likes, extra = {}) => ({
    id: `POST-${1000 + n}`,
    campaignCode,
    ambassadorId,
    platform,
    handle,
    caption,
    likes,
    hidden: false,
    art: svgArt(`${campaignCode}${n}${platform}`, { variant: 'photo' }),
    ...extra,
  });
  return [
    p(1, 'HB26', 'AMB-1001', 'instagram', '@sam.studies', 'Free fresher account perk, link in bio.', 214),
    p(2, 'HB26', 'AMB-1004', 'tiktok', '@mei.on.campus', 'Day in the life at the freshers fair.', 1280),
    p(3, 'HB26', 'AMB-1002', 'instagram', '@priya.n', 'Come say hi at the union stall.', 96),
    p(4, 'HB26', 'AMB-1007', 'facebook', 'Amir Haddad', 'Westmoor freshers group, offer is live.', 41, {
      hidden: true,
    }),
    p(5, 'HB26', 'AMB-1013', 'linkedin', 'Rohan Desai', 'Practical money tips for new students.', 58),
    p(6, 'OM26', 'AMB-1001', 'tiktok', '@sam.studies', 'Unboxing the new SIM pack.', 5200),
    p(7, 'OM26', 'AMB-1005', 'instagram', '@dan.o', 'Carousel: what is in the box.', 322),
    p(8, 'LE26', 'AMB-1003', 'linkedin', 'Jordan Blake', 'Switching energy supplier in five minutes.', 73),
  ];
}

function threads() {
  const m = (from, author, text, at) => ({ id: `${from}-${at}`, from, author, text, at });
  const t = (n, ambassadorId, campaignCode, subject, messages, unreadForAdmin = false) => ({
    id: `THR-${1000 + n}`,
    ambassadorId,
    campaignCode,
    subject,
    messages,
    unreadForAdmin,
    unreadForAmbassador: false,
  });
  return [
    t(
      1,
      'AMB-1001',
      'HB26',
      'Stall location',
      [m('ambassador', 'Sam Rivera', 'Hi! Could I run the stall outside the library instead of the union? Far more footfall.', ago(2 * HOUR))],
      true,
    ),
    t(
      2,
      'AMB-1012',
      'OM26',
      'Reporting TikTok views',
      [
        m('ambassador', 'Isla Murray', 'For reach on my timesheet, do I use total views or unique viewers?', ago(5 * HOUR)),
      ],
      true,
    ),
    t(3, 'AMB-1003', 'LE26', 'Parking receipt', [
      m('admin', 'Alex Morgan', 'Hi Jordan, your parking expense shows £0.00. Could you edit it with the amount?', ago(DAY)),
      m('ambassador', 'Jordan Blake', 'Oh no, sorry! It was £4.50. I will fix it now.', ago(DAY - 40 * MIN)),
    ]),
    t(4, 'AMB-1005', 'OM26', 'Event photos', [
      m('admin', 'Alex Morgan', 'Thanks for the great turnout on Tuesday. Any photos for the gallery?', ago(2 * DAY)),
      m('ambassador', 'Daniel Okafor', 'Yes, uploading a few tonight.', ago(2 * DAY - HOUR)),
    ]),
  ];
}

export function buildSeed() {
  return {
    admin: ADMIN,
    ambassadors: ambassadors(),
    campaigns: campaigns(),
    submissions: submissions(),
    expenses: expenses(),
    folders: folders(),
    resources: resources(),
    socialPosts: socialPosts(),
    threads: threads(),
  };
}
