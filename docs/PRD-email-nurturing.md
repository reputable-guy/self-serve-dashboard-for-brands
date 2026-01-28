# PRD: Participant Email Nurturing System

## Overview

Automated email sequences that guide participants through the study journey, maximize completion rates, and recover at-risk participants.

## Context

From `enrollment-store.ts`, participants move through these stages:
```
clicked → signed_up → waiting → started → active → completed
                                              ↓
                                          dropped
```

Current nurture types defined:
- `welcome` - Day 0
- `day3_reminder` - Day 3
- `day7_checkin` - Day 7  
- `day14_milestone` - Day 14
- `day21_final_push` - Day 21
- `at_risk_outreach` - Triggered when compliance drops

## Goals

1. **Maximize completion rate** (target: 80%+)
2. **Reduce drop-off** at key friction points
3. **Maintain engagement** without being annoying
4. **Recover at-risk participants** before they fully disengage

---

## Email Sequences

### Sequence 1: Onboarding (Days 0-3)

#### Email 1.1: Welcome Email
**Trigger:** Immediately after sign-up (`signed_up` stage)  
**From:** {brand_name} via Reputable  
**Subject:** You're in! Here's how to get started 🎉

```
Hi {first_name},

Welcome to the {study_name} study! You're one of {enrollment_count} people 
participating in this verified product experience.

Here's what happens next:

📱 STEP 1: Download the Reputable App
{app_download_link}

⏱️ STEP 2: Complete Your Baseline (5 min)
Before your product arrives, we'll capture how you're feeling now. 
This is what makes your results meaningful.

{if has_wearable_tier}
⌚ STEP 3: Connect Your Wearable (Optional)
Link your {device_type} for automatic sleep/recovery tracking.
{endif}

📦 Your product is on its way and should arrive in {estimated_delivery_days} days.

Questions? Reply to this email — we're here to help.

— The {brand_name} Team

---
Verified by Reputable | Why this matters: {verification_link}
```

**Tracking:** Open rate, click rate (app download), click rate (wearable connect)

---

#### Email 1.2: Baseline Reminder
**Trigger:** 24 hours after welcome IF baseline not completed  
**Subject:** Quick reminder: Complete your baseline ({time_estimate})

```
Hi {first_name},

Just a friendly nudge — your baseline check-in is waiting!

This takes about 5 minutes and captures how you're feeling *before* 
you start using {product_name}. It's what makes your results credible.

{baseline_cta_button}

Your product should arrive in {days_until_delivery} days. Let's make 
sure you're ready to start!

— The {brand_name} Team
```

---

#### Email 1.3: Baseline Complete Confirmation
**Trigger:** Immediately after baseline completion  
**Subject:** Baseline complete ✓ You're ready to start

```
Hi {first_name},

Your baseline is locked in:

📊 Your starting {category_label} score: {baseline_score}/100
📅 Study start date: When your product arrives
💰 Completion reward: ${rebate_amount}

{if has_wearable_data}
⌚ Wearable connected: {device_name}
   We're now tracking your {wearable_metrics} automatically.
{endif}

We'll email you when it's time to begin your 28-day journey.

— The {brand_name} Team
```

---

### Sequence 2: Study Active (Days 1-28)

#### Email 2.1: Day 1 - Let's Go
**Trigger:** Participant marks "product received" OR estimated delivery date  
**Subject:** Day 1 starts now — your 28-day journey begins 🚀

```
Hi {first_name},

It's go time! Your 28-day {study_name} study officially starts today.

📋 YOUR DAILY ROUTINE:
{daily_routine_description}

⏰ Daily check-in: ~1 minute
   We'll send a reminder each day at {preferred_reminder_time}.

💡 PRO TIP: {category_specific_tip}

{open_app_button}

Here's to the next 28 days!

— The {brand_name} Team

---
Day 1 of 28 | ${rebate_amount} reward on completion
```

---

#### Email 2.2: Day 3 - Habit Formation
**Trigger:** Day 3, 6pm local time  
**Subject:** Day 3 check-in — you're building momentum

```
Hi {first_name},

Three days in! You've completed {checkins_completed}/3 check-ins so far.

{if checkins_completed == 3}
🔥 Perfect streak! You're in the top 20% of participants.
{else}
⚡ Quick catch-up: {missed_checkins_cta}
{endif}

Most people start noticing subtle changes around day 5-7. 
Keep going — the data gets interesting from here.

{open_app_button}

— The {brand_name} Team
```

---

#### Email 2.3: Day 7 - First Week Complete
**Trigger:** Day 7, morning  
**Subject:** Week 1 complete — here's what we're seeing 👀

```
Hi {first_name},

One week down, three to go!

📊 YOUR WEEK 1 SNAPSHOT:
• Check-ins completed: {checkins_completed}/7
• Compliance rate: {compliance_percent}%
{if has_wearable_data}
• Average {primary_wearable_metric}: {week1_avg} (baseline: {baseline_avg})
{endif}

{if early_improvement}
📈 Early signal: Your {improved_metric} is trending up {improvement_percent}% vs baseline.
   (This is early data — the real results come at day 28!)
{endif}

Keep it up. You're doing great.

{open_app_button}

— The {brand_name} Team

---
Day 7 of 28 | ${rebate_amount} reward on completion
```

---

#### Email 2.4: Day 14 - Halfway Milestone
**Trigger:** Day 14, morning  
**Subject:** 🎯 Halfway there — you're crushing it

```
Hi {first_name},

You're officially halfway through your {study_name} study!

📊 YOUR PROGRESS:
• Days completed: 14/28
• Check-ins: {checkins_completed}/14
• Current streak: {current_streak} days

{if compliance >= 80}
🏆 You're on track for the full ${rebate_amount} reward!
{else}
⚠️ Your completion rate is at {compliance_percent}%. 
   Complete your remaining check-ins to qualify for your ${rebate_amount} reward.
{endif}

💬 QUICK QUESTION:
How are you feeling compared to when you started?

{feeling_better_button} {same_button} {not_sure_button}

Two more weeks. Let's finish strong.

— The {brand_name} Team
```

---

#### Email 2.5: Day 21 - Final Push
**Trigger:** Day 21, morning  
**Subject:** One week left — the finish line is in sight 🏁

```
Hi {first_name},

Just 7 days to go!

📊 YOUR STATUS:
• Days remaining: 7
• Check-ins completed: {checkins_completed}/21
• On track for reward: {reward_status}

🎯 THE FINAL STRETCH:
Your last week of data is crucial — it's what we compare against 
your baseline to measure real change. Every check-in counts.

{if has_wearable_data}
⌚ Your wearable is still syncing perfectly. 
   We'll include your {wearable_metric} data in your final report.
{endif}

{open_app_button}

Almost there!

— The {brand_name} Team
```

---

#### Email 2.6: Day 28 - Completion
**Trigger:** Day 28 check-in completed  
**Subject:** 🎉 You did it! Here are your results

```
Hi {first_name},

Congratulations — you've completed the {study_name} study!

📊 YOUR RESULTS:

{category_label} Score:
  Baseline: {baseline_score}/100
  Final: {final_score}/100
  Change: {score_change_direction}{score_change_points} points ({score_change_percent}%)

{if has_wearable_data}
{primary_wearable_metric}:
  Before: {baseline_wearable_value}
  After: {final_wearable_value}
  Change: {wearable_change_direction}{wearable_change_percent}%
{endif}

{if improved}
🎯 {improvement_headline}
{endif}

💰 YOUR REWARD:
Your ${rebate_amount} reward is being processed. 
Expect it within {payout_timeline}.

📝 ONE LAST THING:
Would you share a quick testimonial about your experience?
{testimonial_cta_button}

Thank you for being part of this study. Your data helps others 
make informed decisions about {product_name}.

— The {brand_name} Team

---
View your full verified results: {results_page_link}
```

---

### Sequence 3: At-Risk Recovery

#### Trigger Conditions:
- Missed 2+ consecutive check-ins
- Compliance drops below 50%
- No app opens in 3+ days
- Wearable disconnected for 3+ days

---

#### Email 3.1: Gentle Nudge (First Miss)
**Trigger:** 2 consecutive missed check-ins  
**Subject:** We missed you — everything okay?

```
Hi {first_name},

We noticed you haven't checked in for a couple days. 
Just wanted to make sure everything's alright!

📱 Quick catch-up: {catch_up_cta}
   (Takes less than a minute)

Life gets busy — we get it. But your data matters, and we want 
to make sure you get your full ${rebate_amount} reward.

{if days_remaining > 7}
Good news: You still have {days_remaining} days to get back on track.
{endif}

Need help? Just reply to this email.

— The {brand_name} Team
```

---

#### Email 3.2: Concern Check (3+ Days Inactive)
**Trigger:** 3+ days without check-in, 5+ days remaining  
**Subject:** {first_name}, can we help?

```
Hi {first_name},

It's been {days_since_checkin} days since your last check-in.

We want to make sure you can still complete the study and 
earn your ${rebate_amount} reward.

🤔 What's going on?

{too_busy_button} — We'll simplify your check-ins
{forgot_button} — We'll adjust your reminder time  
{product_issue_button} — Let us know what's happening
{want_to_quit_button} — No hard feelings

Your feedback helps us improve the experience for everyone.

— The {brand_name} Team
```

---

#### Email 3.3: Final Recovery Attempt
**Trigger:** 5+ days inactive, 3+ days remaining, hasn't responded to previous  
**Subject:** Last chance: {days_remaining} days to complete your study

```
Hi {first_name},

Your {study_name} study ends in {days_remaining} days.

Current status:
• Check-ins completed: {checkins_completed}/{total_expected}
• Eligible for reward: {reward_eligibility}

{if can_still_complete}
✅ You can still finish! Complete your remaining check-ins 
   and you'll qualify for your ${rebate_amount} reward.

{catch_up_cta_button}
{else}
Unfortunately, with {days_remaining} days left, completing the 
minimum check-ins isn't possible. But we'd still love your feedback.
{endif}

No response needed if you've decided to stop — we understand.

— The {brand_name} Team
```

---

### Sequence 4: Post-Study

#### Email 4.1: Results Ready
**Trigger:** Results processed (24-48h after completion)  
**Subject:** Your verified results are ready to view

```
Hi {first_name},

Your complete study results are now available!

📊 View Your Results: {results_page_link}

What you'll see:
• Your before/after comparison
• How you compared to other participants  
• Your verified testimonial (if shared)
• Shareable results badge

{if improved}
🎉 Your results showed improvement — feel free to share!
{social_share_buttons}
{endif}

Thank you for contributing to verified product research.

— The {brand_name} Team
```

---

#### Email 4.2: Testimonial Follow-up
**Trigger:** 3 days after completion IF no testimonial submitted  
**Subject:** Quick favor? Share your {product_name} experience

```
Hi {first_name},

Hope you're still feeling the benefits of {product_name}!

We noticed you haven't shared a testimonial yet. Your experience 
helps other people make informed decisions.

It takes 2 minutes:
{testimonial_cta_button}

{if improved}
Your results showed a {score_change_percent}% improvement — 
that's a story worth sharing!
{endif}

Thanks for considering it.

— The {brand_name} Team
```

---

## Technical Requirements

### Email Service
- **Provider:** Resend (recommended) or Postmark
- **Features needed:**
  - Transactional sending
  - Template variables
  - Open/click tracking
  - Scheduling
  - Unsubscribe handling

### Data Requirements

Each email needs access to:

```typescript
interface EmailContext {
  // Participant
  participant: {
    id: string;
    firstName: string;
    email: string;
    timezone: string;
    preferredReminderTime: string;
  };
  
  // Study
  study: {
    id: string;
    name: string;
    productName: string;
    brandName: string;
    category: string;
    categoryLabel: string;
    rebateAmount: number;
    durationDays: number;
    dailyRoutine: string;
    hasWearables: boolean;
    deviceType?: string;
  };
  
  // Progress
  progress: {
    currentDay: number;
    daysRemaining: number;
    checkinsCompleted: number;
    checkinsExpected: number;
    compliancePercent: number;
    currentStreak: number;
    lastCheckinAt?: string;
    daysSinceCheckin: number;
  };
  
  // Scores (when available)
  scores?: {
    baselineScore: number;
    currentScore?: number;
    finalScore?: number;
    scoreChange?: number;
    scoreChangePercent?: number;
    improved: boolean;
  };
  
  // Wearable data (when available)
  wearable?: {
    connected: boolean;
    deviceName: string;
    primaryMetric: string;
    baselineValue: number;
    currentValue?: number;
    weeklyAvg?: number;
  };
  
  // Reward
  reward: {
    amount: number;
    eligible: boolean;
    status: 'pending' | 'processing' | 'paid';
  };
}
```

### Trigger System

```typescript
interface EmailTrigger {
  type: 
    | 'immediate'      // Send now
    | 'scheduled'      // Send at specific time
    | 'condition';     // Send when condition met
    
  // For scheduled
  scheduleAt?: {
    dayOfStudy: number;
    timeOfDay: string;  // "09:00" in participant timezone
  };
  
  // For condition
  condition?: {
    field: string;
    operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
    value: number | string | boolean;
  };
  
  // Don't send if
  suppressIf?: {
    previousEmailOpened?: boolean;
    actionCompleted?: string;
    daysSinceLastEmail?: number;
  };
}
```

### Database Schema

```sql
-- Email templates
CREATE TABLE email_templates (
  id UUID PRIMARY KEY,
  slug VARCHAR(50) UNIQUE NOT NULL,  -- e.g., 'welcome', 'day7_checkin'
  sequence VARCHAR(30) NOT NULL,      -- 'onboarding', 'active', 'at_risk', 'post_study'
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT NOT NULL,
  trigger_config JSONB NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sent emails (for tracking)
CREATE TABLE email_sends (
  id UUID PRIMARY KEY,
  template_id UUID REFERENCES email_templates(id),
  participant_id UUID NOT NULL,
  study_id UUID NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  click_target VARCHAR(100),
  bounced BOOLEAN DEFAULT false,
  unsubscribed BOOLEAN DEFAULT false,
  context_snapshot JSONB  -- Store the context used for debugging
);

-- Email preferences
CREATE TABLE email_preferences (
  participant_id UUID PRIMARY KEY,
  reminder_time TIME DEFAULT '09:00',
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  unsubscribed BOOLEAN DEFAULT false,
  unsubscribed_at TIMESTAMP
);
```

### Implementation with Inngest (Recommended)

```typescript
// src/inngest/functions/email-sequences.ts

import { inngest } from './client';
import { resend } from '@/lib/resend';

// Onboarding sequence
export const onboardingSequence = inngest.createFunction(
  { id: 'onboarding-email-sequence' },
  { event: 'participant/signed-up' },
  async ({ event, step }) => {
    const { participantId, studyId } = event.data;
    
    // Email 1: Welcome (immediate)
    await step.run('send-welcome', async () => {
      const context = await buildEmailContext(participantId, studyId);
      await sendEmail('welcome', context);
    });
    
    // Wait 24 hours
    await step.sleep('wait-for-baseline', '24h');
    
    // Email 2: Baseline reminder (only if not completed)
    await step.run('send-baseline-reminder', async () => {
      const context = await buildEmailContext(participantId, studyId);
      if (!context.progress.baselineCompleted) {
        await sendEmail('baseline_reminder', context);
      }
    });
  }
);

// Daily active sequence
export const dailyCheckScheduler = inngest.createFunction(
  { id: 'daily-check-scheduler' },
  { cron: '0 * * * *' },  // Every hour, check for emails to send
  async ({ step }) => {
    await step.run('process-daily-emails', async () => {
      // Find participants who should receive day-based emails
      const participants = await getParticipantsForDailyEmails();
      
      for (const p of participants) {
        const dayOfStudy = calculateDayOfStudy(p);
        const emailsForDay = getDayEmails(dayOfStudy);
        
        for (const emailSlug of emailsForDay) {
          if (shouldSendEmail(p, emailSlug)) {
            const context = await buildEmailContext(p.id, p.studyId);
            await sendEmail(emailSlug, context);
          }
        }
      }
    });
  }
);

// At-risk detection
export const atRiskDetector = inngest.createFunction(
  { id: 'at-risk-detector' },
  { cron: '0 18 * * *' },  // Every day at 6pm
  async ({ step }) => {
    await step.run('detect-at-risk', async () => {
      const atRiskParticipants = await findAtRiskParticipants({
        missedCheckins: 2,
        daysSinceActivity: 3,
      });
      
      for (const p of atRiskParticipants) {
        const tier = getAtRiskTier(p);
        const context = await buildEmailContext(p.id, p.studyId);
        await sendEmail(`at_risk_${tier}`, context);
      }
    });
  }
);
```

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Email open rate | > 50% | Resend analytics |
| Click-through rate | > 20% | Resend analytics |
| Completion rate | > 80% | Participants reaching day 28 |
| At-risk recovery rate | > 40% | At-risk participants who re-engage |
| Testimonial submission rate | > 60% | Completed participants who submit |
| Unsubscribe rate | < 2% | Unsubscribes / total sent |

---

## Implementation Phases

### Phase 1: Core Sequence (Week 1)
- [ ] Set up Resend account and API integration
- [ ] Implement `welcome` email
- [ ] Implement `day1_start` email
- [ ] Basic email tracking (sent, opened)

### Phase 2: Full Journey (Week 2)
- [ ] All day-based emails (day 3, 7, 14, 21, 28)
- [ ] Completion email with results
- [ ] Click tracking and CTA analytics

### Phase 3: Smart Triggers (Week 3)
- [ ] At-risk detection logic
- [ ] Recovery email sequence
- [ ] Suppression rules (don't spam)
- [ ] A/B testing framework

### Phase 4: Optimization (Ongoing)
- [ ] Testimonial follow-up sequence
- [ ] Time-of-day optimization per participant
- [ ] Dynamic content based on wearable data
- [ ] Win-back campaigns for dropped participants

---

## Open Questions

1. **Sender identity:** Should emails come from the brand or Reputable?
   - Recommendation: "Brand Name via Reputable" for trust
   
2. **Reminder timing:** Should participants choose their reminder time?
   - Recommendation: Yes, during onboarding
   
3. **SMS fallback:** For at-risk participants, should we SMS?
   - Recommendation: Phase 2, opt-in only
   
4. **Brand customization:** How much can brands customize email copy?
   - Recommendation: Allow tone/voice customization, not structure

---

## Appendix: Email Subject Line Alternatives

For A/B testing:

**Welcome:**
- "You're in! Here's how to get started 🎉"
- "Welcome to the {study_name} study"
- "{first_name}, your study starts here"

**Day 7:**
- "Week 1 complete — here's what we're seeing 👀"
- "Your first week: {compliance_percent}% complete"
- "7 days in — how are you feeling?"

**At-risk:**
- "We missed you — everything okay?"
- "{first_name}, just checking in"
- "Your {study_name} study misses you"

**Completion:**
- "🎉 You did it! Here are your results"
- "Congratulations! Your results are in"
- "{first_name}, your {product_name} journey is complete"
