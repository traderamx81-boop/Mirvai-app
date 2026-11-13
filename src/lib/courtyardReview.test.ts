import test from 'node:test';
import assert from 'node:assert/strict';
import {
  defaultHomes,
  categoryLabel,
  ngn,
  filterHomes,
  toggleId,
  createReviewRequest,
  markRequestAsReviewed,
  resolveViewFromPath,
  pathForView,
  upsertListing,
  removeListing,
  buildWhatsAppUrl,
  resolveListingImage,
} from './courtyardReview';

test('ngn formats Naira amounts cleanly without decimals', () => {
  assert.equal(ngn(650000000), '₦650,000,000');
  assert.equal(ngn(42000000), '₦42,000,000');
});

test('categoryLabel resolves category labels and defaults gracefully', () => {
  assert.equal(categoryLabel('terrace'), 'Terrace duplex');
  assert.equal(categoryLabel('off-plan'), 'Off-plan');
  assert.equal(categoryLabel('unknown'), 'Property');
});

test('filterHomes filters by category, area, location search query, and excludes drafts', () => {
  assert.equal(filterHomes('all', 'all', []).length, 6);
  assert.equal(filterHomes('detached', 'all', []).length, 1);
  assert.equal(filterHomes('all', 'Island', []).length, 3);
  assert.equal(filterHomes('all', 'Mainland', []).length, 3);
  assert.equal(filterHomes('all', 'all', ['courtyard']).length, 5);
  assert.equal(filterHomes('detached', 'Mainland', []).length, 0);

  // Location search queries
  assert.equal(filterHomes('all', 'all', [], defaultHomes, 'Island').length, 3);
  assert.equal(filterHomes('all', 'all', [], defaultHomes, 'Lekki').length, 1);
  assert.equal(filterHomes('all', 'all', [], defaultHomes, 'Ikeja').length, 1);
  assert.equal(filterHomes('terrace', 'all', [], defaultHomes, 'Ikeja').length, 1);
  assert.equal(filterHomes('detached', 'all', [], defaultHomes, 'Ikeja').length, 0);
});

test('toggleId adds and removes IDs cleanly', () => {
  const added = toggleId([], 'courtyard');
  assert.deepEqual(added, ['courtyard']);
  const removed = toggleId(added, 'courtyard');
  assert.deepEqual(removed, []);
});

test('upsertListing and removeListing manage inventory accurately', () => {
  const custom = {
    ...defaultHomes[0],
    id: 'banana-island-1',
    name: 'Banana Island Residence',
    locale: 'Banana Island',
    price: 920000000,
  };
  const added = upsertListing(defaultHomes, custom);
  assert.equal(added.length, 7);
  assert.equal(filterHomes('all', 'all', [], added, 'Banana').length, 1);

  const edited = upsertListing(added, { ...custom, price: 980000000 });
  assert.equal(edited.length, 7);
  assert.equal(edited[0].price, 980000000);

  const deleted = removeListing(edited, 'banana-island-1');
  assert.equal(deleted.length, 6);
});

test('createReviewRequest & markRequestAsReviewed store full CRM details', () => {
  const req = createReviewRequest(
    'viewing',
    'Video walkthrough · Saturday morning',
    defaultHomes[0].id,
    'r-1'
  );
  assert.equal(req.kind, 'Viewing');
  assert.equal(req.title, 'The Courtyard House');
  assert.equal(req.reviewed, false);

  const updated = markRequestAsReviewed([req], 'r-1');
  assert.equal(updated[0].reviewed, true);

  const generalReq = createReviewRequest(
    'enquire',
    'Location: Victoria Island · 1 – 3 months · Detached',
    undefined,
    'r-2',
    defaultHomes,
    {
      location: 'Victoria Island',
      timeline: '1 – 3 months',
      propertyType: 'Detached',
      budget: '₦250M – ₦500M',
      clientName: 'Adaeze',
      clientContact: '+447700900123',
    }
  );
  assert.equal(generalReq.title, 'MIRVAI');
  assert.equal(generalReq.location, 'Victoria Island');
  assert.equal(generalReq.timeline, '1 – 3 months');
});

test('resolveViewFromPath and pathForView map website, app, team, and admin routes accurately', () => {
  assert.equal(resolveViewFromPath('/'), 'website');
  assert.equal(resolveViewFromPath('/app'), 'app');
  assert.equal(resolveViewFromPath('/app/'), 'app');
  assert.equal(resolveViewFromPath('/team'), 'team');
  assert.equal(resolveViewFromPath('/team-view'), 'team');
  assert.equal(resolveViewFromPath('/admin'), 'team');
  assert.equal(resolveViewFromPath('/', '#/admin'), 'team');
  assert.equal(resolveViewFromPath('/', '#/app'), 'app');
  assert.equal(resolveViewFromPath('/other'), 'website');
  assert.equal(pathForView('website'), '/');
  assert.equal(pathForView('app'), '/app');
  assert.equal(pathForView('team'), '/team');
});

test('buildWhatsAppUrl and resolveListingImage format cleanly', () => {
  const wa = buildWhatsAppUrl({
    propertyName: 'The Courtyard House',
    location: 'Ikoyi',
    timeline: 'Within 1 month',
  });
  assert.ok(wa.startsWith('https://wa.me/2349011081436?text='));
  assert.ok(decodeURIComponent(wa).includes('Ikoyi'));

  const resolvedDefault = resolveListingImage(defaultHomes[5]);
  assert.equal(resolvedDefault?.src, '/assets/grove.jpg');

  const resolvedCustom = resolveListingImage({
    name: 'Custom Villa',
    photoUrl: 'https://example.com/villa.jpg',
  });
  assert.equal(resolvedCustom?.src, 'https://example.com/villa.jpg');
});
