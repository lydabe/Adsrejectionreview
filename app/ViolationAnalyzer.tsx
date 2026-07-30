"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Issue = {
  id: number;
  time: number;
  end: number;
  severity: "Violation" | "Needs review";
  title: string;
  policy: string;
  reason: string;
  detected: string;
  fix: string[];
  position: { left: string; top: string; width: string; height: string };
};

const issues: Issue[] = [
  {
    id: 1,
    time: 0.6,
    end: 15.2,
    severity: "Violation",
    title: "Social casino gameplay is not clearly disclosed",
    policy: "Gambling and Games · Social casino games",
    reason:
      "The creative prominently shows simulated slot-machine gameplay. For US delivery, social casino ads must be approved by TikTok, remain free-to-play with no money-out option, and clearly communicate that players cannot win real money or anything with real-world value.",
    detected: "Slot reels, jackpot totals, “BUY,” and casino-style game controls",
    fix: [
      "Add a persistent, readable disclosure: “No real-money gambling. No cash or real-world prizes.”",
      "Confirm the game is free-to-play and remove every money-out or cash-redemption path.",
      "Work with a TikTok sales representative to obtain eligibility and permission before running the ad in the US.",
    ],
    position: { left: "8%", top: "8%", width: "84%", height: "43%" },
  },
  {
    id: 2,
    time: 4.1,
    end: 18.4,
    severity: "Violation",
    title: "Rewards may be interpreted as real-world value",
    policy: "Gambling and Games · Financial rewards",
    reason:
      "Large jackpot figures, coin balances, purchase controls, and winning reactions can imply that rewards have cash or real-world value. US social casino ads must make the absence of real-money winnings unmistakable.",
    detected: "Large coin totals, “GRAND / MAJOR” jackpots, and celebratory win visuals",
    fix: [
      "Avoid dollar symbols, cash imagery, or language such as “cash out,” “earn,” or “win money.”",
      "Label virtual coins as “in-game currency with no real-world value.”",
      "Keep the no-cash-prize disclosure visible during jackpot and reward sequences.",
    ],
    position: { left: "5%", top: "5%", width: "90%", height: "26%" },
  },
  {
    id: 3,
    time: 12.6,
    end: 20.2,
    severity: "Needs review",
    title: "Required US eligibility and safety context is missing",
    policy: "Gambling and Games · US market requirements",
    reason:
      "The closing frames do not provide clear eligibility, age, responsible-play, or promotion terms. TikTok requires market eligibility and encourages clear warnings, legally required taglines, and transparent terms.",
    detected: "End card does not show age, eligibility, responsible-play, or offer terms",
    fix: [
      "Add the applicable age requirement and “Play responsibly” to the end card.",
      "Link to promotion terms and a responsible-play resource where applicable.",
      "Keep disclosures on screen long enough to read and use high-contrast text.",
    ],
    position: { left: "7%", top: "72%", width: "86%", height: "20%" },
  },
];

const duration = 20.94;

const frameAnnotations: Record<number, Array<{
  label: string;
  risk: "HIGH" | "MED";
  position: { left: string; top: string; width: string; height: string };
}>> = {
  1: [
    { label: "Slot Machine", risk: "HIGH", position: { left: "8%", top: "11%", width: "84%", height: "29%" } },
    { label: "Buy feature", risk: "HIGH", position: { left: "57%", top: "3%", width: "34%", height: "11%" } },
    { label: "Spin Button", risk: "MED", position: { left: "62%", top: "39%", width: "29%", height: "18%" } },
  ],
  2: [
    { label: "Jackpot total", risk: "HIGH", position: { left: "7%", top: "5%", width: "86%", height: "15%" } },
    { label: "Coin balance", risk: "MED", position: { left: "6%", top: "21%", width: "35%", height: "13%" } },
    { label: "Win animation", risk: "HIGH", position: { left: "18%", top: "34%", width: "66%", height: "25%" } },
  ],
  3: [
    { label: "Missing 21+", risk: "MED", position: { left: "8%", top: "70%", width: "38%", height: "16%" } },
    { label: "End card terms", risk: "HIGH", position: { left: "51%", top: "70%", width: "41%", height: "20%" } },
  ],
};

function formatTime(time: number) {
  return `00:${Math.floor(time).toString().padStart(2, "0")}`;
}

function ViolationDetail({ onBack }: { onBack: () => void }) {
  const [selectedId, setSelectedId] = useState(1);
  const [currentTime, setCurrentTime] = useState(0.6);
  const [isPlaying, setIsPlaying] = useState(false);
  const uploadedVideo = "./ad-demo.mp4";
  const fileName = "20260729-133534.mp4";
  const isAnalyzing = false;
  const [reviewed, setReviewed] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const market = "US";
  const [drawer, setDrawer] = useState<"appeal" | "ai" | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(1);
  const [appealSent, setAppealSent] = useState(false);
  const [proposalApplied, setProposalApplied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [approvalTeams, setApprovalTeams] = useState(["Legal", "Creative"]);
  const [approvalSent, setApprovalSent] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const selected = useMemo(
    () => issues.find((issue) => issue.id === selectedId) ?? issues[0],
    [selectedId],
  );

  useEffect(() => {
    if (!isPlaying || uploadedVideo) return;
    const timer = window.setInterval(() => {
      setCurrentTime((time) => {
        if (time >= duration) {
          setIsPlaying(false);
          return 0;
        }
        return Math.min(duration, time + 0.1);
      });
    }, 100);
    return () => window.clearInterval(timer);
  }, [isPlaying, uploadedVideo]);

  useEffect(() => {
    const activeIssues = issues.filter(
      (issue) => currentTime >= issue.time && currentTime <= issue.end,
    );
    const selectedStillActive = activeIssues.some((issue) => issue.id === selectedId);
    if (!selectedStillActive && activeIssues[0]) setSelectedId(activeIssues[0].id);
  }, [currentTime, selectedId]);

  function jumpTo(issue: Issue) {
    setSelectedId(issue.id);
    setCurrentTime(issue.time);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = issue.time;
      videoRef.current.pause();
    }
  }

  function togglePlayback() {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        void videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
    setIsPlaying((playing) => !playing);
  }

  function scrubTo(event: ChangeEvent<HTMLInputElement>) {
    const nextTime = Number(event.target.value);
    setCurrentTime(nextTime);
    if (videoRef.current) videoRef.current.currentTime = nextTime;
  }

  async function copyGuidance() {
    const guidance = `${selected.title}\n\nWhy it was flagged:\n${selected.reason}\n\nHow to fix:\n${selected.fix
      .map((step, index) => `${index + 1}. ${step}`)
      .join("\n")}`;
    await navigator.clipboard?.writeText(guidance);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function openAiFix() {
    setDrawer("ai");
    setAiGenerating(true);
    setProposalApplied(false);
    window.setTimeout(() => setAiGenerating(false), 1400);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="workspace-pill" aria-hidden="true">
          <span className="grid-mark">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="avatar">A</span>
        </div>
        <div className="brand-mark" aria-hidden="true">
          <span />
        </div>
        <span className="product-name">TikTok Ads Manager</span>
        <span className="header-divider" />
        <span className="tool-name">Ad Rejection Insights</span>
        <div className="top-actions">
          <button className="icon-button" aria-label="Help">
            ?
          </button>
          <button className="icon-button" aria-label="Notifications">
            <span className="bell">♢</span>
          </button>
          <span className="account-chip">ACME</span>
        </div>
      </header>

      <aside className="side-nav" aria-label="Primary navigation">
        <button className="nav-icon" aria-label="Overview">
          <span>⌂</span>
        </button>
        <button className="nav-icon active" aria-label="Campaigns">
          <span>▤</span>
        </button>
        <button className="nav-icon" aria-label="Ad Rejection Insights">
          <span>✓</span>
        </button>
        <button className="nav-icon" aria-label="Analytics">
          <span>⌁</span>
        </button>
      </aside>

      <section className="page">
        <div className="page-heading">
          <div>
            <button className="back-link" onClick={onBack}>
              ← Back to ads
            </button>
            <div className="breadcrumb">
              Campaigns / US Slots – Summer Acquisition / US Broad · iOS /
              Slots Team Reaction v3
            </div>
            <h1>Ad rejection details</h1>
            <p>
              See the exact frame and element that contributed to this
              rejection.
            </p>
          </div>
          <div className="heading-actions">
            <button className="button primary">Edit and resubmit</button>
          </div>
        </div>

        <div className="status-strip">
          <span className="status-icon">!</span>
          <div>
            <strong>
              Rejected · 3 {market === "US" ? "US" : market} policy concerns
              found
            </strong>
            <span>
              Analysis ID 7291845603 · Completed today at 10:42 AM
            </span>
          </div>
        </div>

        <div className="review-grid">
          <section className="viewer-card" aria-label="Video review">
            <div className="panel-header">
              <div>
                <span className="file-name">{fileName}</span>
                <span className="file-meta">20.94 sec · 360 × 640</span>
              </div>
              <div className="legend">
                <span>
                  <i className="legend-dot red" /> Violation
                </span>
                <span>
                  <i className="legend-dot amber" /> Needs review
                </span>
              </div>
            </div>

            <div className="stage-wrap">
              <div className="video-stage">
                <video
                  ref={videoRef}
                  src={uploadedVideo}
                  onLoadedMetadata={(event) => {
                    event.currentTarget.currentTime = currentTime;
                  }}
                  onTimeUpdate={(event) =>
                    setCurrentTime(event.currentTarget.currentTime)
                  }
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  playsInline
                  aria-label="Uploaded ad video"
                />

                {!isAnalyzing && frameAnnotations[selected.id].map((annotation, index) => (
                  <button
                    key={annotation.label}
                    className={`element-annotation ${annotation.risk === "HIGH" ? "high" : "medium"}`}
                    style={annotation.position}
                    onClick={() => jumpTo(selected)}
                    aria-label={`${annotation.label}, ${annotation.risk} risk`}
                  >
                    <span className="annotation-tag">
                      <b>△</b>
                      <strong>{annotation.label}</strong>
                      <em>{annotation.risk}</em>
                    </span>
                    <span className="annotation-index">{index + 1}</span>
                  </button>
                ))}

                {isAnalyzing && (
                  <div className="analyzing-overlay">
                    <span className="scan-line" />
                    <strong>Checking creative…</strong>
                    <span>Reviewing visual, text, and audio signals</span>
                  </div>
                )}
              </div>
            </div>

            <div className="timeline-section">
              <div className="player-controls">
                <button
                  className="play-button"
                  onClick={togglePlayback}
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? "Ⅱ" : "▶"}
                </button>
                <span className="timecode">
                  {formatTime(currentTime)} / 00:21
                </span>
                <div className="control-spacer" />
                <button className="plain-icon" aria-label="Mute">
                  ◖
                </button>
                <button className="plain-icon" aria-label="Full screen">
                  ⛶
                </button>
              </div>

              <div className="timeline">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.1"
                  value={Math.min(currentTime, duration)}
                  onChange={scrubTo}
                  aria-label="Video timeline"
                />
                <div
                  className="progress-fill"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                <div
                  className="timeline-playhead"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                  aria-hidden="true"
                />
                {issues.map((issue) => (
                  <button
                    key={issue.id}
                    className={`issue-range ${
                      issue.severity === "Violation" ? "danger" : "warning"
                    } ${issue.id === selectedId ? "selected" : ""}`}
                    style={{
                      left: `${(issue.time / duration) * 100}%`,
                      width: `${((issue.end - issue.time) / duration) * 100}%`,
                      top: `${10 + (issue.id - 1) * 25}px`,
                    }}
                    onClick={() => jumpTo(issue)}
                    aria-label={`Jump to ${issue.title} at ${formatTime(
                      issue.time,
                    )}`}
                  >
                    <span className="range-number">{issue.id}</span>
                    <span className="range-name">
                      {issue.id === 1 ? "Casino gameplay" : issue.id === 2 ? "Reward value" : "Missing terms"}
                    </span>
                  </button>
                ))}
                <div className="tick-labels">
                  <span>00:00</span>
                  <span>00:05</span>
                  <span>00:10</span>
                  <span>00:15</span>
                  <span>00:21</span>
                </div>
              </div>
            </div>
          </section>

          <aside className="issues-panel" aria-label="Policy concerns">
            <div className="issues-heading">
              <div>
                <h2>Policy concerns</h2>
                <span>
                  3 moments need your attention ·{" "}
                  {market === "US" ? "United States" : market}
                </span>
              </div>
              <span className="count-badge">3</span>
            </div>

            <div className="issue-list">
              {issues.map((issue) => (
                <button
                  key={issue.id}
                  className={`issue-card ${
                    issue.id === selectedId ? "active" : ""
                  }`}
                  onClick={() => jumpTo(issue)}
                >
                  <span
                    className={`number-badge ${
                      issue.severity === "Violation" ? "danger" : "warning"
                    }`}
                  >
                    {issue.id}
                  </span>
                  <span className="issue-card-content">
                    <span className="issue-card-topline">
                      <span
                        className={`severity ${
                          issue.severity === "Violation"
                            ? "danger"
                            : "warning"
                        }`}
                      >
                        {issue.severity}
                      </span>
                      <span>{formatTime(issue.time)}</span>
                      {reviewed.includes(issue.id) && (
                        <span className="reviewed-label">Reviewed</span>
                      )}
                    </span>
                    <strong>{issue.title}</strong>
                    <small>{issue.policy}</small>
                  </span>
                  <span className="chevron">›</span>
                </button>
              ))}
            </div>
          </aside>
        </div>

        <section className="explanation-card" aria-live="polite">
          <div className="explanation-main">
            <div className="explanation-title">
            <span
              className={`number-badge ${
                selected.severity === "Violation" ? "danger" : "warning"
              }`}
            >
              {selected.id}
            </span>
            <div>
              <div className="explanation-eyebrow">
                {formatTime(selected.time)}–{formatTime(selected.end)} ·{" "}
                {selected.policy}
              </div>
              <h2>{selected.title}</h2>
            </div>
            <button
              className="button secondary compact"
              onClick={() =>
                setReviewed((items) =>
                  items.includes(selected.id)
                    ? items.filter((id) => id !== selected.id)
                    : [...items, selected.id],
                )
              }
            >
              {reviewed.includes(selected.id)
                ? "Mark as unresolved"
                : "Mark as reviewed"}
            </button>
            </div>

            <div className="explanation-grid">
            <div className="reason-column">
              <div className="market-context">
                <span>Market applied</span>
                <strong>
                  {market === "US"
                    ? "United States"
                    : `${market} · Preview mode`}
                </strong>
                <p>
                  {market === "US"
                    ? "US guidance is applied. Social casino ads require TikTok permission, must be F2P with no money-out, and must clearly state that no real-world value can be won."
                    : "This prototype currently contains detailed US guidance. Verify the selected market’s latest requirements before submission."}
                </p>
              </div>
              <h3>Why this was flagged</h3>
              <p>{selected.reason}</p>
              <div className="detected-quote">
                <span>Detected in your ad</span>
                <strong>“{selected.detected.replaceAll("“", "").replaceAll("”", "")}”</strong>
              </div>
              <a
                className="policy-link"
                href="https://ads.tiktok.com/help/article/tiktok-ads-policy-gambling-and-games"
                target="_blank"
                rel="noreferrer"
              >
                Read Gambling and Games policy <span>↗</span>
              </a>
            </div>
            <div className="fix-column">
              <h3>Recommended fix</h3>
              <ol>
                {selected.fix.map((step, index) => (
                  <li key={step}>
                    <span>{index + 1}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
              <div className="fix-actions">
                <button className="button secondary" onClick={copyGuidance}>
                  {copied ? "Guidance copied" : "Copy fix guidance"}
                </button>
              </div>
            </div>
            </div>
          </div>
          <aside className="resolution-actions" aria-label="Resolution actions">
              <div className="resolution-box ai">
                <span className="resolution-icon">✦</span>
                <div>
                  <strong>AI video fix</strong>
                  <p>
                    Generate two complete video options that address all 3
                    policy concerns.
                  </p>
                  <button className="button ai-button" onClick={openAiFix}>
                    Generate video options
                  </button>
                </div>
              </div>
              <div className="resolution-box appeal-card">
                <strong>Believe this is incorrect?</strong>
                <p>
                  An appeal does not change the original creative. It requests
                  another review of this decision.
                </p>
                <button className="button secondary" onClick={() => setDrawer("appeal")}>
                  Appeal decision
                </button>
              </div>
          </aside>
        </section>

        <div className="bottom-note">
          <span>ⓘ</span>
          This guidance explains likely policy concerns and does not guarantee
          approval. Your updated ad will be reviewed again after submission.
        </div>
      </section>

      {drawer && (
        <>
          <button
            className="drawer-backdrop"
            onClick={() => setDrawer(null)}
            aria-label="Close panel"
          />
          <aside className="action-drawer" aria-label={drawer === "appeal" ? "Appeal rejection" : "AI video proposals"}>
            <div className="drawer-header">
              <div>
                <span className="drawer-eyebrow">{drawer === "appeal" ? "Review decision" : "Creative Assistant"}</span>
                <h2>{drawer === "appeal" ? "Appeal this rejection" : "AI video fix proposals"}</h2>
              </div>
              <button className="drawer-close" onClick={() => setDrawer(null)} aria-label="Close">×</button>
            </div>

            {drawer === "appeal" ? (
              <div className="drawer-body appeal-body">
                {appealSent ? (
                  <div className="drawer-success">
                    <span>✓</span>
                    <h3>Appeal submitted</h3>
                    <p>Your case was sent for another review. You can track it from the ad status column.</p>
                    <button className="button primary" onClick={() => setDrawer(null)}>Done</button>
                  </div>
                ) : (
                  <>
                    <div className="appeal-summary">
                      <span className="table-status rejected"><i /> Rejected</span>
                      <strong>Slots Team Reaction v3</strong>
                      <p>Gambling and Games · United States</p>
                    </div>
                    <label className="field-label">
                      Why should this ad be approved?
                      <textarea defaultValue="This is a free-to-play social casino game. Players cannot cash out or win anything with real-world value. We can provide supporting product evidence." />
                    </label>
                    <label className="field-label">
                      Supporting evidence
                      <button className="upload-evidence">＋ Upload file</button>
                      <small>Product screenshots, licenses, or terms · PDF, JPG, PNG</small>
                    </label>
                    <div className="drawer-note">Appeals are reviewed against the policy and market that applied when the ad was rejected.</div>
                    <div className="drawer-footer">
                      <button className="button secondary" onClick={() => setDrawer(null)}>Cancel</button>
                      <button className="button primary" onClick={() => setAppealSent(true)}>Submit appeal</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="drawer-body ai-body">
                <div className="ai-context">
                  <span>✦</span>
                  <div><strong>3 issues will be addressed</strong><p>Based on the rejected frames and US Gambling &amp; Games policy.</p></div>
                </div>
                {aiGenerating ? (
                  <div className="ai-generating">
                    <span className="ai-orbit">✦</span>
                    <h3>Building compliant alternatives…</h3>
                    <p>Reworking disclosures, reward framing, and the end card.</p>
                    <i />
                  </div>
                ) : (
                  <>
                    <div className="proposal-list">
                      {[
                        {
                          id: 1,
                          type: "Covers 3/3 concerns",
                          title: "Option A · Compliance-first cut",
                          meta: "Safest approach · 22.4 sec",
                          text: "21+ • VIRTUAL CURRENCY ONLY • NO CASH PRIZES",
                          note: "Adds persistent no-cash disclosures, clarifies all rewards as virtual currency, and finishes with a responsible-play end card.",
                        },
                        {
                          id: 2,
                          type: "Covers 3/3 concerns",
                          title: "Option B · Minimal-change edit",
                          meta: "Preserves more original footage · 21.6 sec",
                          text: "FREE-TO-PLAY • NO REAL-WORLD VALUE",
                          note: "Softens jackpot and Buy visuals, adds a continuous free-to-play disclosure, and includes US eligibility and safety terms.",
                        },
                        {
                          id: 3,
                          type: "Covers 3/3 concerns",
                          title: "Option C · Max business performance",
                          meta: "Performance-optimized · 20.9 sec",
                          text: "21+ • FREE-TO-PLAY • NO CASH PRIZES",
                          note: "Preserves the strongest opening hook, fast pacing, creator reaction, and CTA while reframing rewards and adding all required disclosures.",
                        },
                      ].map((item) => (
                        <button key={item.id} className={`proposal-card ${selectedProposal === item.id ? "selected" : ""}`} onClick={() => setSelectedProposal(item.id)}>
                          <div className="proposal-video">
                            <video src="./ad-demo.mp4" muted controls playsInline />
                            <span>{item.text}</span>
                          </div>
                          <div className="proposal-copy">
                            <span className="proposal-radio">{selectedProposal === item.id ? "●" : "○"}</span>
                            <div><strong>{item.title}</strong><small>{item.meta}</small><p>{item.note}</p></div>
                            <em>{item.type}</em>
                          </div>
                        </button>
                      ))}
                    </div>
                    {proposalApplied && <div className="applied-message">✓ Proposal selected. It is ready to open in the video editor.</div>}
                    {shareOpen && (
                      <div className="approval-share">
                        {approvalSent ? (
                          <div className="approval-sent">
                            <span>✓</span>
                            <div><strong>Approval request sent</strong><p>Legal and Creative can review the selected proposal, policy context, and flagged frames.</p></div>
                          </div>
                        ) : (
                          <>
                            <div className="approval-share-title">
                              <div><strong>Share for approval</strong><p>Proposal {selectedProposal} · reviewers receive a read-only review link</p></div>
                              <button onClick={() => setShareOpen(false)} aria-label="Close share panel">×</button>
                            </div>
                            <div className="team-picker">
                              {["Legal", "Creative"].map((team) => (
                                <button
                                  key={team}
                                  className={approvalTeams.includes(team) ? "selected" : ""}
                                  onClick={() => setApprovalTeams((teams) => teams.includes(team) ? teams.filter((item) => item !== team) : [...teams, team])}
                                >
                                  <span>{approvalTeams.includes(team) ? "✓" : "+"}</span>{team} team
                                </button>
                              ))}
                            </div>
                            <textarea defaultValue="Please review the proposed edits against the US Gambling & Games policy and approve for resubmission." aria-label="Message to reviewers" />
                            <button className="button primary" disabled={!approvalTeams.length} onClick={() => setApprovalSent(true)}>Send approval request</button>
                          </>
                        )}
                      </div>
                    )}
                    <div className="drawer-footer">
                      <button className="button secondary" onClick={openAiFix}>Regenerate</button>
                      <button className="button secondary" onClick={() => { setShareOpen(true); setApprovalSent(false); }}>↗ Share for approval</button>
                      <button className="button primary" onClick={() => setProposalApplied(true)}>Use selected proposal</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </aside>
        </>
      )}
    </main>
  );
}

type HierarchyLevel = "campaigns" | "adgroups" | "ads";
type HierarchyRow = {
  name: string;
  status: string;
  attention?: boolean;
  [key: string]: string | boolean | undefined;
};

const campaignRows = [
  {
    name: "US Slots – Summer Acquisition",
    status: "Has rejected ads",
    objective: "App promotion",
    result: "4,218 installs",
    spend: "$18,420.36",
    rejected: "2",
    updated: "12 min ago",
    attention: true,
  },
  {
    name: "US Social Casino – Retargeting",
    status: "Active",
    objective: "App promotion",
    result: "1,946 installs",
    spend: "$9,804.11",
    rejected: "0",
    updated: "34 min ago",
  },
  {
    name: "CA Slots – Evergreen",
    status: "Active",
    objective: "App promotion",
    result: "2,731 installs",
    spend: "$11,285.92",
    rejected: "0",
    updated: "1 hr ago",
  },
  {
    name: "US Puzzle Game – Prospecting",
    status: "Paused",
    objective: "App promotion",
    result: "8,102 installs",
    spend: "$24,901.60",
    rejected: "0",
    updated: "Yesterday",
  },
];

const adGroupRows = [
  {
    name: "US Broad · iOS",
    status: "Has rejected ads",
    targeting: "US · 21+ · Broad",
    budget: "$850.00 daily",
    result: "2,604 installs",
    rejected: "2",
    updated: "12 min ago",
    attention: true,
  },
  {
    name: "US Interest · Casino Games · Android",
    status: "Active",
    targeting: "US · 21+ · Interest",
    budget: "$600.00 daily",
    result: "1,614 installs",
    rejected: "0",
    updated: "46 min ago",
  },
];

const adRows = [
  {
    name: "Slots Team Reaction v3",
    status: "Rejected",
    creative: "20260729-133534.mp4",
    destination: "App Store · iOS",
    rejection: "Gambling and Games",
    submitted: "Today, 10:31 AM",
    attention: true,
  },
  {
    name: "Jackpot Gameplay v2",
    status: "Rejected",
    creative: "jackpot_gameplay_v2.mp4",
    destination: "App Store · iOS",
    rejection: "Gambling and Games",
    submitted: "Today, 10:28 AM",
    attention: true,
  },
  {
    name: "Daily Bonus – No Gameplay",
    status: "Active",
    creative: "daily_bonus_static.mp4",
    destination: "App Store · iOS",
    rejection: "—",
    submitted: "Jul 28, 4:12 PM",
  },
];

function HierarchyView({
  onOpenDetail,
}: {
  onOpenDetail: () => void;
}) {
  const [level, setLevel] = useState<HierarchyLevel>("campaigns");
  const [rejectedOnly, setRejectedOnly] = useState(false);
  const baseRows: HierarchyRow[] =
    level === "campaigns"
      ? campaignRows
      : level === "adgroups"
        ? adGroupRows
        : adRows;
  const rows =
    level === "ads" && rejectedOnly
      ? baseRows.filter((row) => row.status === "Rejected")
      : baseRows;

  function changeLevel(nextLevel: HierarchyLevel) {
    setLevel(nextLevel);
    if (nextLevel !== "ads") setRejectedOnly(false);
  }

  const title =
    level === "campaigns"
      ? "Campaigns"
      : level === "adgroups"
        ? "Ad groups"
        : "Ads";

  function drillDown(rowIndex: number) {
    if (rowIndex !== 0) return;
    if (level === "campaigns") changeLevel("adgroups");
    else if (level === "adgroups") changeLevel("ads");
    else onOpenDetail();
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="workspace-pill" aria-hidden="true">
          <span className="grid-mark">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="avatar">A</span>
        </div>
        <div className="brand-mark" aria-hidden="true">
          <span />
        </div>
        <span className="product-name">TikTok Ads Manager</span>
        <span className="header-divider" />
        <span className="tool-name">Ad Rejection Insights</span>
        <div className="top-actions">
          <button className="icon-button" aria-label="Help">
            ?
          </button>
          <button className="icon-button" aria-label="Notifications">
            <span className="bell">♢</span>
          </button>
          <span className="account-chip">ACME</span>
        </div>
      </header>

      <aside className="side-nav" aria-label="Primary navigation">
        <button className="nav-icon" aria-label="Overview">
          <span>⌂</span>
        </button>
        <button className="nav-icon active" aria-label="Campaigns">
          <span>▤</span>
        </button>
        <button className="nav-icon" aria-label="Reports">
          <span>✓</span>
        </button>
        <button className="nav-icon" aria-label="Analytics">
          <span>⌁</span>
        </button>
      </aside>

      <section className="page hierarchy-page">
        <div className="hierarchy-breadcrumb" aria-label="Breadcrumb">
          <button onClick={() => changeLevel("campaigns")}>Campaigns</button>
          {level !== "campaigns" && (
            <>
              <span>›</span>
              <button onClick={() => changeLevel("adgroups")}>
                US Slots – Summer Acquisition
              </button>
            </>
          )}
          {level === "ads" && (
            <>
              <span>›</span>
              <strong>US Broad · iOS</strong>
            </>
          )}
        </div>

        <div className="ttam-title-row">
          <div>
            <h1>{level === "campaigns" ? "Campaign" : title}</h1>
            {level !== "campaigns" && <p>{level === "adgroups" ? "US Slots – Summer Acquisition" : "US Slots – Summer Acquisition · US Broad · iOS"}</p>}
          </div>
          <div className="split-create">
            <button>＋ Create</button><button aria-label="More create options">⌄</button>
          </div>
        </div>

        <div className="ttam-actionbar">
          <label className="ttam-search"><span>⌕</span><input placeholder="Search & filter (/) | Tips: Metric filters are available in table header" /></label>
          <button className="ttam-control"><span>▣</span><div><strong>Jul 23, 2026</strong><small>– Jul 29, 2026</small></div><b>⌄</b></button>
          <button className="ttam-control"><span>≡</span><div><strong>Columns</strong><small>Community interaction</small></div><b>⌄</b></button>
          <button className="ttam-control"><span>▦</span><div><strong>Breakdown</strong><small>None</small></div><b>⌄</b></button>
          <button className="ttam-refresh" aria-label="Refresh">↻</button>
        </div>

        <div className="insight-banner">
          <span className="status-icon">!</span>
          <div>
            <strong>2 ads were rejected after review</strong>
            <p>
              Open the affected ads to understand the rejection reason at
              creative, frame, and element level.
            </p>
          </div>
          <button
            className="text-button"
            onClick={() => {
              setLevel("ads");
              setRejectedOnly(true);
            }}
          >
            {level === "ads" && rejectedOnly ? "Showing rejected ads" : "View rejected ads"}
          </button>
        </div>

        <div className="data-card">
          <div className="table-toolbar">
            <div className="level-tabs">
              <button
                className={level === "campaigns" ? "active" : ""}
                onClick={() => changeLevel("campaigns")}
              >
                Campaign
              </button>
              <button
                className={level === "adgroups" ? "active" : ""}
                onClick={() => changeLevel("adgroups")}
                disabled={level === "campaigns"}
              >
                Ad group
              </button>
              <button
                className={level === "ads" ? "active" : ""}
                onClick={() => changeLevel("ads")}
                disabled={level !== "ads"}
              >
                Ad
              </button>
            </div>
            <div className="table-actions">
              <button className="button secondary compact">View data</button>
              <button className="button secondary compact">Export</button>
              <button className="row-menu" aria-label="More actions">•••</button>
            </div>
          </div>

          <div className="table-scroll">
            <table className={`campaign-table level-${level}`}>
              <thead>
                {level === "campaigns" ? (
                  <tr>
                    <th>On/Off</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Cost</th>
                    <th>Impressions</th>
                    <th>CPM</th>
                    <th>Rejected ads</th>
                    <th />
                  </tr>
                ) : level === "adgroups" ? (
                  <tr>
                    <th>Ad group</th>
                    <th>Status</th>
                    <th>Targeting</th>
                    <th>Budget</th>
                    <th>Result</th>
                    <th>Rejected ads</th>
                    <th>Updated</th>
                    <th />
                  </tr>
                ) : (
                  <tr>
                    <th>Ad</th>
                    <th>Status</th>
                    <th>Creative</th>
                    <th>Destination</th>
                    <th>Rejection reason</th>
                    <th>Submitted</th>
                    <th />
                  </tr>
                )}
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={row.name}
                    className={row.attention ? "attention-row" : ""}
                    onClick={() => drillDown(index)}
                  >
                    {level === "campaigns" && <td><span className="campaign-switch"><i /></span></td>}
                    <td>
                      <div className="entity-cell">
                        {level === "ads" && (
                          <video
                            className="creative-thumb"
                            src={
                              index === 0
                                ? "./ad-demo.mp4#t=0.8"
                                : "./ad-demo.mp4#t=8"
                            }
                            muted
                            preload="metadata"
                          />
                        )}
                        <div>
                          <strong>{row.name}</strong>
                          <small>
                            {level === "campaigns"
                              ? `Campaign ID 183746920${index + 1}`
                              : level === "adgroups"
                                ? `Ad group ID 183746940${index + 1}`
                                : `Ad ID 183746960${index + 1}`}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`table-status ${
                          row.status.includes("Rejected") ||
                          row.status.includes("rejected")
                            ? "rejected"
                            : row.status === "Active"
                              ? "active"
                              : "paused"
                        }`}
                      >
                        <i />
                        {row.status}
                      </span>
                    </td>
                    {level === "campaigns" ? (
                      <>
                        <td>{row.spend}</td>
                        <td>{index === 0 ? "78,239" : index === 1 ? "21,840" : index === 2 ? "38,500" : "60,320"}</td>
                        <td>{index === 0 ? "$23.54" : index === 1 ? "$18.71" : index === 2 ? "$19.32" : "$21.08"}</td>
                        <td>
                          <span
                            className={
                              row.rejected !== "0" ? "reject-count" : ""
                            }
                          >
                            {row.rejected}
                          </span>
                        </td>
                      </>
                    ) : level === "adgroups" ? (
                      <>
                        <td>{row.targeting}</td>
                        <td>{row.budget}</td>
                        <td>{row.result}</td>
                        <td>
                          <span
                            className={
                              row.rejected !== "0" ? "reject-count" : ""
                            }
                          >
                            {row.rejected}
                          </span>
                        </td>
                        <td>{row.updated}</td>
                      </>
                    ) : (
                      <>
                        <td>{row.creative}</td>
                        <td>{row.destination}</td>
                        <td>
                          {row.rejection === "—" ? (
                            "—"
                          ) : (
                            <span className="reason-chip">
                              {row.rejection}
                            </span>
                          )}
                        </td>
                        <td>{row.submitted}</td>
                      </>
                    )}
                    <td>
                      {row.attention ? (
                        <button
                          className="open-row-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            drillDown(index);
                          }}
                        >
                          {level === "ads" ? "View details" : "Open"} ›
                        </button>
                      ) : (
                        <button className="row-menu" aria-label="More actions">
                          •••
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            <span>Showing {rows.length} items</span>
            <span>1–{rows.length} of {rows.length}</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function AdRejectionInsights() {
  const [showDetail, setShowDetail] = useState(false);

  return showDetail ? (
    <ViolationDetail onBack={() => setShowDetail(false)} />
  ) : (
    <HierarchyView onOpenDetail={() => setShowDetail(true)} />
  );
}
