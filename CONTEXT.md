# Reputable Health - Brand Self-Serve Dashboard

## What We're Building
A self-serve dashboard where wellness brands create "rebate studies." Participants buy products at full price, complete a 30-day tracking study using their wearables, and receive a rebate upon completion. Brands get verified testimonials with real biometric data.

## How Rebate Studies Work
1. Brand creates a study (product info, rebate amount, what metrics to track)
2. Brand embeds our widget on their checkout page
3. Customer buys product, sees offer: "Complete our 30-day study, get $X back"
4. Customer downloads Reputable app, joins study, connects wearable
5. For 30 days: wearable syncs automatically + daily check-in questions
6. Upon completion: customer gets rebate, brand gets verified testimonial

## Study Data Model

### Brand Inputs (they provide)
- productName: string
- productImage: file
- productDescription: string (2-3 sentences)
- productPrice: number
- productUrl: string (optional)
- category: "Sleep" | "Stress" | "Energy" | "Recovery" | "Fitness" | "Nutrition" | "Skin"
- rebateAmount: number
- durationDays: number (default 30)
- totalSpots: number
- requiredDevice: "Oura" | "Whoop" | "Apple Watch" | "Garmin" | "Fitbit" | "Any"
- metricsToTrack: array of "Sleep Quality" | "Deep Sleep" | "REM Sleep" | "HRV" | "Resting Heart Rate" | "Stress" | "Recovery Score" | "Steps" | "Energy"

### Custom Questions (Optional)
- villainVariable: string (the symptom/problem, e.g. "afternoon brain fog")
- villainQuestionDays: array of numbers (default [7, 14, 21, 28])
- customQuestions: array of {
    questionText: string,
    questionType: "multiple_choice" | "text" | "voice_and_text",
    options: array of strings (if multiple_choice),
    showOnDays: array of numbers
  }

### Generated Content (LLM creates from inputs, brand can edit)
- studyTitle: string (e.g. "Better Sleep Study")
- hookQuestion: string (e.g. "Do essential oils actually help YOU sleep better?")
- discoverItems: array of { question: string, explanation: string } - uses "YOUR" language
- dailyRoutine: array of { action: string, details: string }
- whatYouGet: array of { item: string, value: number, note: string }
- heartbeatsReward: number (calculated from rebate amount)

### System Managed
- status: "Draft" | "Recruiting" | "Filling Fast" | "Full" | "Completed"
- spotsRemaining: number
- enrolledCount: number

## Design Reference
The mobile app screenshots show:
1. Study catalog cards - how studies appear in the browse list
2. Study details page - the full page participants see before joining

Key design patterns to match:
- Dark theme (#111827 background)
- Teal accent color (#00D1C1) for highlights and CTAs
- Status badges: "Recruiting" (teal), "Filling fast" (yellow with ⚡)
- Heartbeat rewards shown as "Earn up to: ❤️ +X,XXX (≈ $XX in rewards)"
- "What You'll Discover" section uses checkmarks and "YOUR" language
- Cards have subtle borders, rounded corners (12-16px radius)
