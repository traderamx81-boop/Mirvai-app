import test from 'node:test';
import assert from 'node:assert/strict';
import {
  homes,
  categoryLabel,
  ngn,
  filterHomes,
  toggleId,
  createReviewRequest,
  markRequestAsReviewed,
  resolveViewFromPath,
  pathForView,
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

test('filterHomes filters by category, area, and excludes drafts', () => {
  assert.equal(filterHomes('all', 'all', []).length, 6);
  assert.equal(filterHomes('detached', 'all', []).length, 1);
  assert.equal(filterHomes('all', 'Island', []).length, 3);
  assert.equal(filterHomes('all', 'Mainland', []).length, 3);
  assert.equal(filterHomes('all', 'all', ['courtyard']).length, 5);
  assert.equal(filterHomes('detached', 'Mainland', []).length, 0);
});

test('toggleId adds and removes IDs cleanly', () => {
  const added = toggleId([], 'courtyard');
  assert.deepEqual(added, ['courtyard']);
  const removed = toggleId(added, 'courtyard');
  assert.deepEqual(removed, []);
});

test('createReviewRequest & markRequestAsReviewed update state accurately', () => {
  const req = createReviewRequest('viewing', 'Video walkthrough · Saturday morning', homes[0].id, 'r-1');
  assert.equal(req.kind, 'Viewing');
  assert.equal(req.title, 'The Courtyard House');
  assert.equal(req.reviewed, false);

  const updated = markRequestAsReviewed([req], 'r-1');
  assert.equal(updated[0].reviewed, true);
});

test('resolveViewFromPath and pathForView map page routes accurately', () => {
  assert.equal(resolveViewFromPath('/'), 'website');
  assert.equal(resolveViewFromPath('/app'), 'app');
  assert.equal(resolveViewFromPath('/app/'), 'app');
  assert.equal(resolveViewFromPath('/team'), 'team');
  assert.equal(resolveViewFromPath('/team-view'), 'team');
  assert.equal(resolveViewFromPath('/other'), 'website');
  assert.equal(pathForView('website'), '/');
  assert.equal(pathForView('app'), '/app');
  assert.equal(pathForView('team'), '/team');
});
