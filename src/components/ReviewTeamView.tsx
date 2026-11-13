import React from 'react';
import {
  categoryLabel,
  homes,
  ReviewRequest,
} from '../lib/courtyardReview';

interface ReviewTeamViewProps {
  hidden: boolean;
  requests: ReviewRequest[];
  drafts: string[];
  onMarkReviewed: (requestId: string) => void;
  onToggleInventoryDraft: (propertyId: string) => void;
}

export const ReviewTeamView: React.FC<ReviewTeamViewProps> = ({
  hidden,
  requests,
  drafts,
  onMarkReviewed,
  onToggleInventoryDraft,
}) => {
  const reviewedCount = requests.filter((req) => req?.reviewed).length;
  const visibleListingsCount = homes.length - drafts.length;
  const newRequestsCount = requests.length - reviewedCount;

  const metrics: [number, string][] = [
    [visibleListingsCount, 'Visible sample listings'],
    [newRequestsCount, 'New sample requests'],
    [reviewedCount, 'Reviewed requests'],
  ];

  return (
    <section id="team" data-surface="" hidden={hidden} className="workspace">
      <div className="workspace-inner team-layout">
        <header className="section-intro">
          <div>
            <p className="eyebrow">MIRVAI / OPERATIONS DEMO</p>
            <h1>Team view.</h1>
          </div>
          <p>
            Try the proposed workflow for reviewing buyer requests and managing sample listings.
            This is separate from your live admin CRM.
          </p>
        </header>

        <div id="team-metrics" className="team-metrics">
          {metrics.map(([count, caption]) => (
            <div key={caption}>
              <b>{count}</b>
              <span>{caption}</span>
            </div>
          ))}
        </div>

        <section className="team-panel">
          <h2>Buyer requests</h2>
          <div id="team-enquiries">
            {requests.length === 0 ? (
              <p className="empty">
                Nothing to review yet. Submit a sample viewing from Website or App to see it here.
              </p>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="item-row">
                  <div>
                    <strong>
                      {req.kind} · {req.title}
                    </strong>
                    <span>{req.summary}</span>
                    <span>{req.reviewed ? 'Reviewed in demo' : 'New · demo only'}</span>
                  </div>
                  {!req.reviewed && (
                    <button
                      type="button"
                      className="button outline"
                      onClick={() => onMarkReviewed(req.id)}
                    >
                      Mark reviewed
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <section className="team-panel">
          <h2>Property inventory</h2>
          <p className="fineprint">Test draft and published states. Changes only affect this demo.</p>
          <div id="team-inventory">
            {homes.map((item) => {
              const isDraft = drafts.includes(item.id);
              return (
                <div key={item.id} className="item-row">
                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      {categoryLabel(item.type)} · {isDraft ? 'Draft' : 'Visible in preview'}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="button outline"
                    onClick={() => onToggleInventoryDraft(item.id)}
                  >
                    {isDraft ? 'Show listing' : 'Move to draft'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
};
