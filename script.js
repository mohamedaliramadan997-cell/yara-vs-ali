/* ═══════════════════════════════════════════════════════════════
   YARA VS ALI — Real-Time Multiplayer Engine
   ─────────────────────────────────────────────────────────────
   HOW IT WORKS:
   • Player 1 creates a room → gets a 6-char code
   • Player 2 opens the shared link or enters the code
   • Both phones listen to the same Firebase room in real-time
   • Every action (draw, complete, skip) updates Firebase
   • Both phones instantly reflect the change
   ─────────────────────────────────────────────────────────────
   PENALTY LOGIC:
   • When YOU skip → the OTHER player earns +10 EGP
   • Earnings represent what the skipper owes you
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────────
   FIREBASE CONFIGURATION
   Replace the placeholder values below with YOUR Firebase config.
   See SETUP.md for step-by-step instructions.
   ───────────────────────────────────────────────────────────── */
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyDZKaCRb3Gd59jzbajkkCAQH7xXAUrveYU",
  authDomain:        "multiple-game-setup.firebaseapp.com",
  databaseURL:       "https://multiple-game-setup-default-rtdb.firebaseio.com",
  projectId:         "multiple-game-setup",
  storageBucket:     "multiple-game-setup.firebasestorage.app",
  messagingSenderId: "889196114556",
  appId:             "1:889196114556:web:32a74518ed0d333748cff9"
};

/* ─── Detect if Firebase is configured ───────────────────────── */
const FIREBASE_READY = !FIREBASE_CONFIG.apiKey.includes('REPLACE');

let db = null;
if (FIREBASE_READY) {
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.database();
  } catch (e) {
    console.warn('Firebase init failed:', e);
  }
}

/* ═══════════════════════════════════════════════════════════════
   QUESTIONS DATABASE  (200 questions across 18 categories)
   ═══════════════════════════════════════════════════════════════ */
const QUESTIONS = [
  // ── CHILDHOOD ──
  { text:"What's the earliest memory that still makes you smile?", category:"Childhood" },
  { text:"What did you want to be when you grew up at age 7?", category:"Childhood" },
  { text:"What was the most mischievous thing you did as a kid?", category:"Childhood" },
  { text:"What toy or game were you completely obsessed with as a child?", category:"Childhood" },
  { text:"What was your childhood nickname — and did you like it?", category:"Childhood" },
  { text:"What was your favorite subject in school, and why did it click?", category:"Childhood" },
  { text:"Describe your childhood bedroom in exactly three words.", category:"Childhood" },
  { text:"What's a family tradition from your childhood you'd keep forever?", category:"Childhood" },
  { text:"What's the most embarrassing thing that happened to you in school?", category:"Childhood" },
  { text:"Who was your childhood hero — do you still admire them?", category:"Childhood" },
  { text:"What food did you hate as a kid that you love now?", category:"Childhood" },
  { text:"What's the funniest lie you ever told your parents?", category:"Childhood" },
  { text:"Were you a shy kid or the one who had to be the center of attention?", category:"Childhood" },
  { text:"What was the first movie you remember watching in a cinema?", category:"Childhood" },
  { text:"Did you have an imaginary friend? What were they like?", category:"Childhood" },
  { text:"What game could your younger self play for hours without getting bored?", category:"Childhood" },
  { text:"What's something your parents always said that stuck with you?", category:"Childhood" },
  { text:"Were you more of a rule-follower or a rule-bender growing up?", category:"Childhood" },
  { text:"What's your happiest birthday memory from when you were little?", category:"Childhood" },
  { text:"What cartoon or TV show could sum up your entire childhood?", category:"Childhood" },
  // ── DREAMS ──
  { text:"What's one dream you've never told anyone because it feels too big?", category:"Dreams" },
  { text:"If you could master any skill in 30 days, what would you choose?", category:"Dreams" },
  { text:"Where do you see yourself in 10 years — honestly, not the polished version?", category:"Dreams" },
  { text:"What's on your bucket list that would genuinely surprise people who know you?", category:"Dreams" },
  { text:"If you could start any business with zero risk, what would it be?", category:"Dreams" },
  { text:"What would you do with your life if money and judgment didn't exist?", category:"Dreams" },
  { text:"What's a goal you've been quietly working toward that nobody knows about?", category:"Dreams" },
  { text:"If you had to pick one country to live in forever, which would it be?", category:"Dreams" },
  { text:"What's the most ambitious thing you've ever attempted?", category:"Dreams" },
  { text:"If you could be world-famous for one thing, what would you choose?", category:"Dreams" },
  { text:"What kind of legacy do you want to leave behind?", category:"Dreams" },
  { text:"Describe your absolute dream house in as much detail as you want.", category:"Dreams" },
  { text:"If you had to write a book right now, what would it be about?", category:"Dreams" },
  { text:"What's something you've always wanted to learn but keep putting off?", category:"Dreams" },
  { text:"If you could switch careers for one year, what would you do instead?", category:"Dreams" },
  // ── RELATIONSHIPS ──
  { text:"What quality matters most in a relationship — and do you think you have it?", category:"Relationships" },
  { text:"What's your love language, and how do you usually show it?", category:"Relationships" },
  { text:"What's something a person could do that would instantly win your heart?", category:"Relationships" },
  { text:"What's a small thing that matters a lot to you in a relationship?", category:"Relationships" },
  { text:"What's the most romantic thing anyone has ever done for you?", category:"Relationships" },
  { text:"What does 'being there for someone' truly mean to you?", category:"Relationships" },
  { text:"Are you more of a texter or a caller in close relationships?", category:"Relationships" },
  { text:"What's usually the first thing you notice about someone new?", category:"Relationships" },
  { text:"How do you handle conflict with someone you genuinely care about?", category:"Relationships" },
  { text:"What does trust mean to you — beyond just 'not lying'?", category:"Relationships" },
  { text:"What's an absolute non-negotiable in any relationship you're in?", category:"Relationships" },
  { text:"Do you believe in soulmates? What does that mean to you?", category:"Relationships" },
  { text:"What's the nicest thing anyone has ever said to you that you still think about?", category:"Relationships" },
  { text:"What would your perfect date look like — from start to finish?", category:"Relationships" },
  { text:"How important is humor to you in a relationship?", category:"Relationships" },
  // ── PERSONAL VALUES ──
  { text:"What's one core belief that shapes most of your decisions in life?", category:"Values" },
  { text:"What's something you would genuinely never compromise on?", category:"Values" },
  { text:"What does success actually mean to you — your definition, not the world's?", category:"Values" },
  { text:"When honesty and kindness conflict, which do you usually choose?", category:"Values" },
  { text:"What's a cause you feel genuinely strongly about?", category:"Values" },
  { text:"What do you think the world desperately needs more of right now?", category:"Values" },
  { text:"What does loyalty mean to you in practice?", category:"Values" },
  { text:"What's your personal definition of happiness?", category:"Values" },
  { text:"What's your philosophy when it comes to taking risks?", category:"Values" },
  { text:"What's one thing you've learned that permanently changed how you see the world?", category:"Values" },
  { text:"What do you think is the most overrated thing people chase in life?", category:"Values" },
  { text:"Do you believe people can genuinely change?", category:"Values" },
  { text:"How important is family to you — what does that word mean to you?", category:"Values" },
  { text:"What's something society gets wrong that most people are afraid to say?", category:"Values" },
  { text:"What's one thing you stand for, no matter who's watching?", category:"Values" },
  // ── FUNNY ──
  { text:"What's the funniest thing that's ever happened to you in public?", category:"Funny" },
  { text:"What's the most ridiculous argument you've ever gotten into?", category:"Funny" },
  { text:"What's a trend you fully committed to that you now deeply regret?", category:"Funny" },
  { text:"What's the weirdest dream you've ever had?", category:"Funny" },
  { text:"What's a completely useless skill you've somehow mastered?", category:"Funny" },
  { text:"What's something you believed was true for way too long before someone corrected you?", category:"Funny" },
  { text:"What's a fashion choice from your past you genuinely cannot explain?", category:"Funny" },
  { text:"What's the weirdest food combination you secretly enjoy?", category:"Funny" },
  { text:"What's the most elaborate excuse you've ever made for something?", category:"Funny" },
  { text:"What's the most ridiculous reason you've ever been late to something?", category:"Funny" },
  // ── HYPOTHETICAL ──
  { text:"If you could live inside any fictional universe, which would you choose?", category:"Hypothetical" },
  { text:"If you could only eat one cuisine for the rest of your life, which would it be?", category:"Hypothetical" },
  { text:"If you had a time machine, which era would you visit first?", category:"Hypothetical" },
  { text:"If you could swap lives with someone for one week, who would it be?", category:"Hypothetical" },
  { text:"If you had to teach a class on something tomorrow, what would you own?", category:"Hypothetical" },
  { text:"If you could have any superpower — and what would you actually do with it?", category:"Hypothetical" },
  { text:"If you lost all social media for a year, what would change most?", category:"Hypothetical" },
  { text:"If animals could talk, which species would be most annoying and which wisest?", category:"Hypothetical" },
  { text:"If you could only wear one color for an entire year, which would you pick?", category:"Hypothetical" },
  { text:"If you got 24 hours to do absolutely anything with no consequences, what's your day?", category:"Hypothetical" },
  { text:"If you could be any age forever, which would you choose and why?", category:"Hypothetical" },
  { text:"If you had to give everything up and start fresh in a new city, what would you do differently?", category:"Hypothetical" },
  // ── FEARS ──
  { text:"What's your biggest fear — and do you know where it comes from?", category:"Fears" },
  { text:"What's something that used to terrify you that doesn't anymore?", category:"Fears" },
  { text:"Are you more afraid of failure, or of succeeding and still feeling empty?", category:"Fears" },
  { text:"What's a fear you rarely admit to people?", category:"Fears" },
  { text:"What worries you most when you think about the future?", category:"Fears" },
  { text:"Are you more afraid of being alone, or being in the wrong relationship?", category:"Fears" },
  { text:"What's one thing you'd definitely try if you knew you absolutely could not fail?", category:"Fears" },
  { text:"What's something you want desperately but are afraid to go after?", category:"Fears" },
  // ── ROMANCE ──
  { text:"What's the most romantic thing you've ever done for someone?", category:"Romance" },
  { text:"What song would perfectly soundtrack your love story?", category:"Romance" },
  { text:"What's a small, specific thing someone does that you find incredibly attractive?", category:"Romance" },
  { text:"How would you describe real chemistry when you feel it?", category:"Romance" },
  { text:"What's the perfect way to end a perfect day with someone you like?", category:"Romance" },
  { text:"Are you more of a grand gesture person or a small daily kindness person?", category:"Romance" },
  { text:"What's the most thoughtful gift you've ever given or received?", category:"Romance" },
  { text:"How do you know when something real is developing between two people?", category:"Romance" },
  // ── DEEP ──
  { text:"What's something you're still healing from — you don't have to share details?", category:"Deep" },
  { text:"What's a single moment that changed who you are forever?", category:"Deep" },
  { text:"Who has had the single biggest positive impact on your life and how?", category:"Deep" },
  { text:"What's the most important thing you learned from hitting rock bottom?", category:"Deep" },
  { text:"What emotion do you find the hardest to express — and why?", category:"Deep" },
  { text:"What's something you're genuinely proud of that most people don't know about?", category:"Deep" },
  { text:"If you could go back and say one thing to your younger self, what would it be?", category:"Deep" },
  { text:"What's the bravest thing you've ever done — even if no one else saw it?", category:"Deep" },
  { text:"What's something you've genuinely forgiven yourself for?", category:"Deep" },
  { text:"When's the last time you felt completely, truly seen by another person?", category:"Deep" },
  { text:"What's a belief you held for a long time that you've since completely changed?", category:"Deep" },
  { text:"What brings you peace when everything around you feels chaotic?", category:"Deep" },
  { text:"What do you think is your greatest strength AND your greatest challenge as a person?", category:"Deep" },
  { text:"What's a part of yourself you're still figuring out?", category:"Deep" },
  { text:"What's something you've never been able to fully explain to someone that you needed them to understand?", category:"Deep" },
  // ── LIFESTYLE ──
  { text:"Are you a morning person or night owl — and which do you wish you were?", category:"Lifestyle" },
  { text:"What does your ideal, perfect weekend look like in detail?", category:"Lifestyle" },
  { text:"How do you recharge — alone, or by being around people?", category:"Lifestyle" },
  { text:"What's your honest relationship with your phone?", category:"Lifestyle" },
  { text:"How do you usually handle stress — what's your go-to?", category:"Lifestyle" },
  { text:"What's your guiltiest pleasure that you have zero shame about?", category:"Lifestyle" },
  { text:"What's a habit you've been trying to build — and why does it keep stopping?", category:"Lifestyle" },
  { text:"What does your perfect lazy, do-nothing day look like?", category:"Lifestyle" },
  { text:"Do you make decisions from your gut, or from careful analysis?", category:"Lifestyle" },
  { text:"What's something you can genuinely never say no to?", category:"Lifestyle" },
  // ── MUSIC & CULTURE ──
  { text:"What artist or band has been on permanent rotation in your life recently?", category:"Music & Art" },
  { text:"What song always, without fail, puts you in your feelings?", category:"Music & Art" },
  { text:"What genre of music would people be surprised to know you love?", category:"Music & Art" },
  { text:"If your life was a movie, what genre would it be?", category:"Music & Art" },
  { text:"What movie has had the most genuine impact on how you see the world?", category:"Music & Art" },
  { text:"What's a book that actually changed the way you think?", category:"Music & Art" },
  { text:"What piece of art — music, film, or book — has made you actually cry?", category:"Music & Art" },
  { text:"What show or movie were you genuinely sad when it ended?", category:"Music & Art" },
  // ── FLAGS ──
  { text:"What's an immediate green flag you look for when you meet someone?", category:"Green Flags" },
  { text:"What's a red flag you've learned the hard way to spot early?", category:"Red Flags" },
  { text:"What's a tiny thing someone does that instantly makes you like them more?", category:"Green Flags" },
  { text:"What's an absolute dealbreaker for you?", category:"Red Flags" },
  { text:"What behavior in friendships do you have zero tolerance for?", category:"Red Flags" },
  { text:"What's an unexpected quality you find genuinely attractive?", category:"Green Flags" },
  { text:"What impresses you more than wealth or looks when you first meet someone?", category:"Green Flags" },
  { text:"What's something people do without realizing how attractive it is?", category:"Green Flags" },
  // ── FUTURE ──
  { text:"What's one thing you genuinely want to change about your life this year?", category:"Future" },
  { text:"What does your ideal life look like in 5 years — be specific?", category:"Future" },
  { text:"What's your biggest professional or personal ambition that still feels far away?", category:"Future" },
  { text:"What's an experience you're determined to have before this year ends?", category:"Future" },
  { text:"How do you want to feel every single day, five years from now?", category:"Future" },
  { text:"What's something you'll look back on and be glad you did even when it was hard?", category:"Future" },
  // ── FRIENDSHIP ──
  { text:"What makes someone a true friend to you — not just someone you know?", category:"Friendship" },
  { text:"What's something your friends would be genuinely surprised to know about you?", category:"Friendship" },
  { text:"What friendship lesson did you learn the hardest way?", category:"Friendship" },
  { text:"Are you more the advice-giver or advice-seeker in your friendships?", category:"Friendship" },
  { text:"What did a friend do for you that completely restored your faith in people?", category:"Friendship" },
  // ── PERSONALITY ──
  { text:"How would the people who know you best describe you in 3 words?", category:"Personality" },
  { text:"What's your least favorite thing about your own personality — be honest?", category:"Personality" },
  { text:"What's something about yourself that took you a long time to actually like?", category:"Personality" },
  { text:"What's a contradiction in your personality that you've fully accepted?", category:"Personality" },
  { text:"What's something you do when no one is watching that shows who you really are?", category:"Personality" },
  // ── COMMUNICATION ──
  { text:"How do you prefer to be comforted when you're going through something hard?", category:"Communication" },
  { text:"What's something people often misunderstand about you from how you communicate?", category:"Communication" },
  { text:"Do you say what you mean, or expect people to read between the lines?", category:"Communication" },
  { text:"Are you someone who needs space after conflict, or resolves things immediately?", category:"Communication" },
  { text:"What's something you wish you were better at expressing?", category:"Communication" },
  // ── SECRETS ──
  { text:"What's something you've never told anyone that you've been wanting to say out loud?", category:"Secrets" },
  { text:"What's an opinion you hold that most people around you would disagree with?", category:"Secrets" },
  { text:"What's a hobby or interest you hide because you think people would find it weird?", category:"Secrets" },
  { text:"What's a compliment you've always wanted to receive but never have?", category:"Secrets" },
  { text:"What do you secretly think about before you fall asleep most nights?", category:"Secrets" },
  { text:"What's a version of yourself you've been hiding that you'd like to show more?", category:"Secrets" },
  // ── PLAYFUL ──
  { text:"What about you takes people by surprise when they really get to know you?", category:"Playful" },
  { text:"What's the most attractive quality someone can have — nothing to do with looks?", category:"Playful" },
  { text:"What's your most underrated quality that more people should notice?", category:"Playful" },
  { text:"What kind of compliment means the most to you coming from someone you like?", category:"Playful" },
  { text:"What would a perfect 'getting to know each other' day look like to you?", category:"Playful" },
  { text:"What's something you hope people notice about you?", category:"Playful" },
  // ── FOOD & TRAVEL ──
  { text:"What's a meal so good it changed your relationship with food?", category:"Food & Travel" },
  { text:"If you had to live on only three foods for a month, what would they be?", category:"Food & Travel" },
  { text:"What travel experience has stayed with you the most and why?", category:"Food & Travel" },
  { text:"Are you a 'plan everything' or 'figure it out' traveler?", category:"Food & Travel" },
  { text:"What's your coffee or tea order, and what does it say about you?", category:"Food & Travel" },
  { text:"What's a place you've visited that felt like a completely different world?", category:"Food & Travel" },
  { text:"What's the best meal you've ever had and where was it?", category:"Food & Travel" },
  // ── BUCKET LIST ──
  { text:"What's the single most exciting thing on your bucket list right now?", category:"Bucket List" },
  { text:"What experience do you need to have at least once before you die?", category:"Bucket List" },
  { text:"What's somewhere in the world you need to visit to feel complete?", category:"Bucket List" },
  { text:"What's something on your bucket list that scares you a little but excites you more?", category:"Bucket List" },
  { text:"If you had to check off one bucket list item this year, what would you pick?", category:"Bucket List" },
];

/* ═══════════════════════════════════════════════════════════════
   DARES DATABASE  (200 dares across 10 styles)
   ═══════════════════════════════════════════════════════════════ */
const DARES = [
  // ── VOICE ──
  { text:"Record a 15-second voice note singing from your most-played song right now. Send it.", category:"Voice" },
  { text:"Do your best dramatic movie villain impression — voice note format.", category:"Voice" },
  { text:"Say 5 genuine compliments about the other player in a funny accent. Voice note.", category:"Voice" },
  { text:"Narrate your current surroundings like a nature documentary. Send the voice note.", category:"Voice" },
  { text:"Sing Happy Birthday in the most dramatic opera style you can manage.", category:"Voice" },
  { text:"Impersonate a serious news anchor reporting on what you did today.", category:"Voice" },
  { text:"Record a fake weather forecast for tomorrow that includes your emotional forecast.", category:"Voice" },
  { text:"Read your last text message in a dramatic Shakespearean voice. Voice note.", category:"Voice" },
  { text:"Freestyle a 30-second rap about what you're currently wearing. No skipping.", category:"Voice" },
  { text:"Give a 30-second motivational speech about something completely unimportant.", category:"Voice" },
  { text:"Do an ASMR voice note about your favorite food as if it's a fine dining experience.", category:"Voice" },
  { text:"Impersonate a strict professor giving homework about something completely trivial.", category:"Voice" },
  { text:"Do a dramatic reading of your last three text messages like it's a novel. Voice note.", category:"Voice" },
  { text:"Sing a lullaby you just made up about something that happened today.", category:"Voice" },
  { text:"Do your best impression of an elderly person telling an extremely long story about nothing.", category:"Voice" },
  { text:"Do a fake commercial for your own personality in 30 seconds.", category:"Voice" },
  { text:"Narrate making an imaginary sandwich as if you're on a Michelin-star cooking show.", category:"Voice" },
  { text:"Say something completely ordinary in five completely different emotional tones.", category:"Voice" },
  { text:"Do a voice note job interview where you're applying to be the other player's hype person.", category:"Voice" },
  { text:"Impersonate a sleepy person desperately trying to stay awake while giving instructions.", category:"Voice" },
  // ── SELFIE ──
  { text:"Take a selfie making the absolute funniest, most ridiculous face you can. Send it.", category:"Selfie" },
  { text:"Take a selfie in the most dramatically bad lighting you can find. Send.", category:"Selfie" },
  { text:"Recreate a famous painting's pose using items around you. Photo required.", category:"Selfie" },
  { text:"Take a selfie with the nearest random object used as an improvised hat.", category:"Selfie" },
  { text:"Strike a full red-carpet pose using your current room as the venue. Send.", category:"Selfie" },
  { text:"Take a mugshot-style selfie with a totally straight, serious expression.", category:"Selfie" },
  { text:"Take a selfie in the most theatrical 'deep thinking philosopher' pose.", category:"Selfie" },
  { text:"Take a selfie looking like you're about to give a world-changing TED Talk.", category:"Selfie" },
  { text:"Recreate a famous emoji face in real life and send it. Other player has to guess which emoji.", category:"Selfie" },
  { text:"Take a photo of the messiest spot in your room and explain it without shame.", category:"Selfie" },
  { text:"Take a selfie styled as a Renaissance oil painting — noble, serious, dramatic.", category:"Selfie" },
  { text:"Take a victory celebration photo as if you just won an Olympic gold medal.", category:"Selfie" },
  { text:"Take a photo of the most random, inexplicable item in your bag or pockets.", category:"Selfie" },
  { text:"Take a selfie pretending you just discovered you're the main character of a blockbuster.", category:"Selfie" },
  { text:"Take a selfie at your least flattering angle. Own it completely.", category:"Selfie" },
  { text:"Find something near you that matches the other player's energy. Photograph it.", category:"Selfie" },
  { text:"Take a photo of the view from your window right now with a one-sentence poetic caption.", category:"Selfie" },
  { text:"Describe your current outfit as if it's high fashion runway couture. Send a photo.", category:"Selfie" },
  { text:"Find the most chaotic corner of your space and photo it as if it's abstract art.", category:"Selfie" },
  { text:"Take a photo of your feet. Send it with a single-word caption.", category:"Selfie" },
  // ── TEXT ──
  { text:"Write a 3-sentence horror story using only events from your week.", category:"Text" },
  { text:"Write a Haiku about what you're currently feeling. Send it.", category:"Text" },
  { text:"Send a motivational quote you just completely made up as if it's famous.", category:"Text" },
  { text:"Write your Wikipedia-style intro paragraph about yourself.", category:"Text" },
  { text:"Write a 4-line rhyming poem about your favorite food.", category:"Text" },
  { text:"Write a fake movie review of your own life using actual critic language.", category:"Text" },
  { text:"Create a brand new word, define it, and use it in a sentence.", category:"Text" },
  { text:"Write your autobiography in exactly three sentences.", category:"Text" },
  { text:"Describe your current mood as a Michelin-star restaurant menu item.", category:"Text" },
  { text:"Write a dramatic caption for your most recent selfie.", category:"Text" },
  { text:"Write a 10-word personal life philosophy you'd put on a wall.", category:"Text" },
  { text:"Describe your week using only song titles — minimum five songs.", category:"Text" },
  { text:"Write the worst possible opening line for a dating profile. Make it hilariously bad.", category:"Text" },
  { text:"Write a fake positive news headline where you are the hero of the story.", category:"Text" },
  { text:"Write a fortune cookie message for yourself based on your current life situation.", category:"Text" },
  { text:"Write the dedication page of your future memoir — who gets the shoutout?", category:"Text" },
  { text:"Write a two-sentence glowing review of yourself as a friend.", category:"Text" },
  { text:"Describe today as if it's the plot summary of an arthouse film.", category:"Text" },
  { text:"Write the world's most dramatic resignation letter from a made-up job.", category:"Text" },
  { text:"Write a fake law you think everyone should be required to follow.", category:"Text" },
  // ── MEMORY ──
  { text:"Name 5 specific things you know about the other player right now. No guessing.", category:"Memory" },
  { text:"Tell the story of how you two first crossed paths as dramatically as possible.", category:"Memory" },
  { text:"Recall and retell the funniest thing the other player has ever said to you.", category:"Memory" },
  { text:"Name 3 things you've noticed about the other player you've never said out loud.", category:"Memory" },
  { text:"Describe the other player's vibe using a color, a season, and a song.", category:"Memory" },
  { text:"Guess the other player's top 3 most-used emojis. They verify afterwards.", category:"Memory" },
  { text:"Describe the other player's personality as if it were a coffee order. Be specific.", category:"Memory" },
  { text:"Guess what the other player had for their last meal — full dish, not just 'food'.", category:"Memory" },
  { text:"Name 3 things you and the other player definitely have in common.", category:"Memory" },
  { text:"Guess the other player's biggest pet peeve. They score your accuracy.", category:"Memory" },
  { text:"Describe what you think the other player's Instagram aesthetic is.", category:"Memory" },
  { text:"Name the superpower you think genuinely suits the other player's personality.", category:"Memory" },
  { text:"Recall a moment when the other player said or did something that stuck with you.", category:"Memory" },
  { text:"Tell your own origin story in under 60 seconds. Go.", category:"Memory" },
  { text:"Name 5 things currently within 3 feet of you without looking. Then verify.", category:"Memory" },
  // ── PERFORMANCE ──
  { text:"Do a 10-second dance to whatever song is currently stuck in your head. Video.", category:"Performance" },
  { text:"Do your best robot-dance impression. Send a video.", category:"Performance" },
  { text:"Do the most dramatic slow-motion entrance walk for 10 steps.", category:"Performance" },
  { text:"Strike your most powerful superhero landing pose. Hold it for 5 seconds.", category:"Performance" },
  { text:"Do your best impression of someone walking in high heels for the first time.", category:"Performance" },
  { text:"Do a full, unironic victory dance as if you just won the Olympics.", category:"Performance" },
  { text:"Freeze completely still like a statue for 30 full seconds. No moving at all.", category:"Performance" },
  { text:"Perform 5 dance moves from 5 completely different decades back to back.", category:"Performance" },
  { text:"Do the most dramatic theatrical slow-motion hair flip you can manage.", category:"Performance" },
  { text:"Act out waking up late for something critically important — 30 seconds, full commitment.", category:"Performance" },
  { text:"Do the chef's kiss gesture five times in progressively more dramatic ways.", category:"Performance" },
  { text:"Mime eating your favorite meal with zero words and complete facial commitment.", category:"Performance" },
  { text:"Act out discovering you have a superpower for the first time. Be specific about which one.", category:"Performance" },
  { text:"Perform a fake awards acceptance speech for 'Most Likely to Still Be Awake at 3am'.", category:"Performance" },
  { text:"Act out trying to explain TikTok to someone from 1950.", category:"Performance" },
  // ── CREATIVE ──
  { text:"Perform a 30-second TED Talk on why your favorite food is objectively superior to all others.", category:"Creative" },
  { text:"Do a full villain monologue about something completely minor, like losing a charger.", category:"Creative" },
  { text:"Act out a live sports commentator covering you making your morning coffee.", category:"Creative" },
  { text:"Do an infomercial for your worst personal habit. Make it sound like a selling point.", category:"Creative" },
  { text:"Act out your reaction if you found out you were secretly royalty.", category:"Creative" },
  { text:"Perform the dramatic opening scene of your life as a Netflix original.", category:"Creative" },
  { text:"Act out receiving devastating news about something completely trivial.", category:"Creative" },
  { text:"Perform a cooking show segment where the dish is completely invisible.", category:"Creative" },
  { text:"Act out a press conference defending your most controversial opinion.", category:"Creative" },
  { text:"Do a 20-second commercial that makes your personality sound like a luxury product.", category:"Creative" },
  { text:"Perform the Shakespeare-style version of reading and sending a text message.", category:"Creative" },
  { text:"Act out trying to explain your most niche interest to someone who's never heard of it.", category:"Creative" },
  { text:"Create and perform a fake news segment covering the most dramatic thing from your week.", category:"Creative" },
  { text:"Give a dramatic, emotional farewell speech to your least favorite habit.", category:"Creative" },
  { text:"Describe your personality as a weather pattern — full meteorological explanation.", category:"Creative" },
  // ── COMPLIMENT ──
  { text:"Tell the other player 3 things you genuinely admire about them. Make them specific.", category:"Compliment" },
  { text:"Write the other player the kindest text you can in exactly 2 minutes. Send it.", category:"Compliment" },
  { text:"Create a nickname for the other player based purely on their personality.", category:"Compliment" },
  { text:"Tell the other player the most interesting thing you've noticed about them.", category:"Compliment" },
  { text:"Describe the other player as if writing the opening paragraph of their biography.", category:"Compliment" },
  { text:"Tell the other player one specific thing they do that always makes you smile.", category:"Compliment" },
  { text:"Create the best possible Instagram bio for the other player.", category:"Compliment" },
  { text:"Write a 4-line rap that compliments the other player. Delivery counts.", category:"Compliment" },
  { text:"Tell the other player what city in the world matches their personality and why.", category:"Compliment" },
  { text:"Describe the other player's laugh without using the word 'nice', 'cute', or 'good'.", category:"Compliment" },
  { text:"Tell the other player what TV character they remind you of with your full reasoning.", category:"Compliment" },
  { text:"Create a theme song title for the other player's life right now.", category:"Compliment" },
  { text:"Tell the other player what they'd be famous for if they lived in another era.", category:"Compliment" },
  { text:"Describe the other player's energy in a room using exactly 10 words.", category:"Compliment" },
  { text:"Write the most flattering fake headline about the other player as if they're famous.", category:"Compliment" },
  // ── CHALLENGE ──
  { text:"Name 20 different countries in under 30 seconds. Go.", category:"Challenge" },
  { text:"Type an entire paragraph with your eyes completely closed and send it unedited.", category:"Challenge" },
  { text:"Count backwards from 50 to 1 in under 20 seconds. Out loud.", category:"Challenge" },
  { text:"Create an acronym from your first name where each letter is a true fact about you.", category:"Challenge" },
  { text:"Spell your full name backwards out loud, no pausing.", category:"Challenge" },
  { text:"Name 5 things in your room right now that are the same color, without looking first.", category:"Challenge" },
  { text:"Hum a song for the other person to guess. 15 seconds. No words allowed.", category:"Challenge" },
  { text:"Say a tongue twister 3 times fast and send a voice note as evidence.", category:"Challenge" },
  { text:"List 7 emotions using only facial expressions. Other player names each one.", category:"Challenge" },
  { text:"Describe today's mood in exactly 5 words. No more, no fewer.", category:"Challenge" },
  { text:"Say a greeting in 5 different languages in under 20 seconds.", category:"Challenge" },
  { text:"Name 10 things you're grateful for right now in under 60 seconds.", category:"Challenge" },
  { text:"Write your signature as if you're a world-famous artist. Photograph it.", category:"Challenge" },
  { text:"Name 3 items within reach that could theoretically be combined into a new invention.", category:"Challenge" },
  { text:"Guess the other player's top 5 most-used emojis. They verify each one.", category:"Challenge" },
  // ── SOCIAL ──
  { text:"Share the most embarrassing item currently in your camera roll. No deletions.", category:"Social" },
  { text:"Open your notes app and share the most inexplicable note you find.", category:"Social" },
  { text:"Show your phone's most-listened-to artist right now without any shame.", category:"Social" },
  { text:"Describe the contents of your fridge as if it's a Michelin-star menu.", category:"Social" },
  { text:"Find the most inexplicable item in your room and give it a dramatic backstory.", category:"Social" },
  { text:"Share your current phone wallpaper and explain why you chose it.", category:"Social" },
  { text:"Find the nearest book and read the first sentence aloud in the most dramatic voice.", category:"Social" },
  { text:"Send a voice note describing your ideal Saturday as if it's a luxury travel brochure.", category:"Social" },
  { text:"Find something in your room that's been there so long you've forgotten where it came from.", category:"Social" },
  { text:"Share the playlist you put on to fall asleep. No judgment allowed.", category:"Social" },
  // ── WILDCARD ──
  { text:"Invent a brand new holiday — name it and explain exactly how it's celebrated.", category:"Wildcard" },
  { text:"Create a 3-step plan for world domination using only items currently in your room.", category:"Wildcard" },
  { text:"Design your ideal sandwich, name it something ridiculous, and describe it in full.", category:"Wildcard" },
  { text:"Invent a sport that could only realistically exist on the moon.", category:"Wildcard" },
  { text:"Invent a new dance move, name it after yourself, and demonstrate it.", category:"Wildcard" },
  { text:"Design a superhero whose power is entirely, completely useless in every situation.", category:"Wildcard" },
  { text:"Create a conspiracy theory about something completely harmless and argue it convincingly.", category:"Wildcard" },
  { text:"Design a fragrance and give it the most dramatically poetic name possible.", category:"Wildcard" },
  { text:"Write a 3-word mission statement for your current life chapter.", category:"Wildcard" },
  { text:"Invent a new ice cream flavor, name it, and write its origin story.", category:"Wildcard" },
  { text:"Pitch a fake TV show concept in exactly 30 seconds. Make it sound incredible.", category:"Wildcard" },
  { text:"Write the most absurd, over-the-top motivational poster slogan.", category:"Wildcard" },
  { text:"Design a fake band, name them, name their debut album, and describe their sound.", category:"Wildcard" },
  { text:"Invent a new emoji the world desperately needs. Describe exactly when to use it.", category:"Wildcard" },
  { text:"Create a fake app idea that would genuinely make your life easier and pitch it.", category:"Wildcard" },
];

/* ─── Penalty Quips ───────────────────────────────────────────── */
const SKIP_QUIPS = [
  "That's okay — bravery is overrated! 😄",
  "The coward tax has been collected. 💸",
  "Some secrets are worth 10 pounds. 😏",
  "The classic escape move. Noted.",
  "Running from the dare — a true art form.",
  "Bold strategy. The other player thanks you! 🤑",
  "A worthy donation to your partner. 👑",
  "Wisdom: knowing when to fold. 😌",
  "The penalty jar grows richer!",
];

/* ═══════════════════════════════════════════════════════════════
   LOCAL STATE
   ═══════════════════════════════════════════════════════════════ */
let myRole    = null;   // "p1" | "p2"  — which player am I on this device?
let roomCode  = null;   // 6-char room code
let roomRef   = null;   // Firebase reference to this room
let roomSnap  = null;   // latest room data snapshot
let timerInt  = null;   // setInterval handle for the countdown
let selectedMode = 'random';  // current mode selection on this device

/* ─── DOM Shorthand ───────────────────────────────────────────── */
const $ = id => document.getElementById(id);

/* ═══════════════════════════════════════════════════════════════
   SCREEN NAVIGATION
   ═══════════════════════════════════════════════════════════════ */
let activeScreen = 'landing';
const SCREENS = {
  landing: $('screen-landing'),
  room:    $('screen-room'),
  setup:   $('screen-setup'),
  waiting: $('screen-waiting'),
  game:    $('screen-game'),
  results: $('screen-results'),
};

function goTo(name) {
  const prev = SCREENS[activeScreen];
  if (prev) {
    prev.classList.remove('active');
    prev.classList.add('exit-left');
    setTimeout(() => prev.classList.remove('exit-left'), 600);
  }
  activeScreen = name;
  SCREENS[name].classList.add('active');
  window.scrollTo(0, 0);
}

/* ═══════════════════════════════════════════════════════════════
   PARTICLE SYSTEM
   ═══════════════════════════════════════════════════════════════ */
function initParticles() {
  const c = $('particles-container');
  const symbols = ['♥','✦','♠','✧','★','◆'];
  for (let i = 0; i < 16; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = symbols[i % symbols.length];
    p.style.left = (Math.random() * 100) + 'vw';
    p.style.animationDuration = (14 + Math.random() * 20) + 's';
    p.style.animationDelay   = (Math.random() * 18) + 's';
    p.style.fontSize = (9 + Math.random() * 9) + 'px';
    p.style.color = Math.random() > .5 ? 'rgba(255,45,120,.28)' : 'rgba(200,164,74,.22)';
    c.appendChild(p);
  }
}

/* ═══════════════════════════════════════════════════════════════
   ROOM CODE UTILITIES
   ═══════════════════════════════════════════════════════════════ */
function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getCodeFromURL() {
  return window.location.hash.slice(1).toUpperCase() || null;
}

function setCodeInURL(code) {
  window.location.hash = code;
}

/* ─── Save/restore my identity in localStorage ─────────────────── */
function saveMyIdentity() {
  localStorage.setItem('yva_role', myRole);
  localStorage.setItem('yva_room', roomCode);
}
function loadMyIdentity() {
  myRole   = localStorage.getItem('yva_role');
  roomCode = localStorage.getItem('yva_room');
}
function clearMyIdentity() {
  localStorage.removeItem('yva_role');
  localStorage.removeItem('yva_room');
}

/* ═══════════════════════════════════════════════════════════════
   CARD PICKING (no repeats until pool exhausted)
   ═══════════════════════════════════════════════════════════════ */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickFromPool(pool, usedStr) {
  const usedIdx = usedStr ? usedStr.split(',').map(Number).filter(n => !isNaN(n)) : [];
  const available = pool.reduce((acc, _, i) => {
    if (!usedIdx.includes(i)) acc.push(i);
    return acc;
  }, []);
  const finalPool = available.length > 0 ? available : pool.map((_, i) => i);
  const shuffled = shuffle(finalPool);
  const picked = shuffled[0];
  const newUsed = finalPool === pool.map((_, i) => i) ? [picked] : [...usedIdx, picked];
  return { item: pool[picked], newUsedStr: newUsed.join(',') };
}

function drawCard(mode, usedQ, usedD) {
  const type = mode === 'truth' ? 'truth'
             : mode === 'dare'  ? 'dare'
             : Math.random() < .5 ? 'truth' : 'dare';
  if (type === 'truth') {
    const { item, newUsedStr } = pickFromPool(QUESTIONS, usedQ);
    return { type, text: item.text, category: item.category, newUsedQ: newUsedStr, newUsedD: usedD };
  } else {
    const { item, newUsedStr } = pickFromPool(DARES, usedD);
    return { type, text: item.text, category: item.category, newUsedQ: usedQ, newUsedD: newUsedStr };
  }
}

/* ═══════════════════════════════════════════════════════════════
   FIREBASE OPERATIONS
   ═══════════════════════════════════════════════════════════════ */

/* Initial room template */
function makeRoom(p1Name, p1Emoji) {
  return {
    p1: { name: p1Name, emoji: p1Emoji, ready: true },
    p2: { name: '', emoji: '', ready: false, joined: false },
    game: {
      phase:     'waiting_p2',  // waiting_p2 | setup | playing | ended
      turn:      'p1',
      round:     1,
      cardsPlayed: 0,
      mode:      'random',
      card:      null,
      cardPhase: 'idle',        // idle | shown | done
      cardDrawnAt: 0,
    },
    scores: {
      p1: { earnings: 0, completed: 0, skipped: 0 },
      p2: { earnings: 0, completed: 0, skipped: 0 },
    },
    usedQ: '',
    usedD: '',
    createdAt: Date.now(),
  };
}

async function createRoom(name, emoji) {
  if (!db) { showNoFirebase(); return; }
  const code = generateCode();
  const room = makeRoom(name, emoji);
  try {
    await db.ref('rooms/' + code).set(room);
    myRole   = 'p1';
    roomCode = code;
    saveMyIdentity();
    setCodeInURL(code);
    attachRoomListener();
    goTo('waiting');
    $('share-code').textContent = code;
    $('setup-room-code-display').textContent = code;
    updateShareLink(code);
  } catch(e) {
    alert('Could not create room. Check Firebase config.');
    console.error(e);
  }
}

async function joinRoom(code) {
  if (!db) { showNoFirebase(); return; }
  code = code.toUpperCase().trim();
  if (!code || code.length < 4) { showJoinError('Enter a valid room code.'); return; }
  try {
    const snap = await db.ref('rooms/' + code).get();
    if (!snap.exists()) { showJoinError('Room not found. Check the code.'); return; }
    const data = snap.val();

    // Block only if P2 is actively connected on another device right now
    if (data.p2 && data.p2.joined && data.p2.connected) {
      showJoinError('Room is full — partner is currently connected.');
      return;
    }

    myRole   = 'p2';
    roomCode = code;
    saveMyIdentity();
    setCodeInURL(code);
    attachRoomListener();

    // If P2 already completed setup (rejoining after refresh/disconnect), skip setup screen
    if (data.p2 && data.p2.joined && data.p2.name) {
      $('share-code').textContent = code;
      goTo('waiting');   // onRoomUpdate will forward to game if phase=playing
      return;
    }

    // First-time join: go through name/avatar setup
    $('setup-role-badge').textContent = 'Player 2';
    $('setup-role-badge').style.background = 'rgba(200,164,74,.1)';
    $('setup-role-badge').style.color = '#e0bc6e';
    $('setup-role-badge').style.borderColor = '#7a5e1a';
    $('setup-avatar-large').classList.add('ali-style');
    buildEmojiGrid('p2');
    $('setup-room-code-display').textContent = code;
    $('setup-name-input').placeholder = 'Your name';
    goTo('setup');
  } catch(e) {
    showJoinError('Could not connect. Try again.');
    console.error(e);
  }
}

function showJoinError(msg) {
  const el = $('join-error');
  el.textContent = msg;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 4000);
}

function showNoFirebase() {
  $('config-warning').classList.remove('hidden');
}

async function submitSetup(name, emoji) {
  if (!db || !roomCode || !myRole) return;
  const update = {};
  update[myRole + '/name']  = name;
  update[myRole + '/emoji'] = emoji;
  update[myRole + '/ready'] = true;
  if (myRole === 'p2') update['p2/joined'] = true;

  await db.ref('rooms/' + roomCode).update(update);

  // Check if we can advance phase
  const snap = await db.ref('rooms/' + roomCode).get();
  const data = snap.val();

  if (myRole === 'p1') {
    // P1 goes to waiting screen
    goTo('waiting');
    $('share-code').textContent = roomCode;
    updateShareLink(roomCode);
  } else {
    // P2: check if p1 is already ready
    if (data.p1 && data.p1.ready) {
      await db.ref('rooms/' + roomCode + '/game').update({ phase: 'playing' });
    }
    goTo('waiting');
    $('share-code').textContent = roomCode;
  }
}

function attachRoomListener() {
  if (!db || !roomCode) return;
  roomRef = db.ref('rooms/' + roomCode);
  roomRef.on('value', snap => {
    if (!snap.exists()) return;
    roomSnap = snap.val();
    onRoomUpdate(roomSnap);
  });

  // Track own presence
  db.ref('.info/connected').on('value', snap => {
    if (snap.val() && roomCode && myRole) {
      const presRef = db.ref('rooms/' + roomCode + '/' + myRole + '/connected');
      presRef.set(true);
      presRef.onDisconnect().set(false);
    }
  });
}

/* ═══════════════════════════════════════════════════════════════
   ROOM UPDATE HANDLER  (fires on every Firebase change)
   ═══════════════════════════════════════════════════════════════ */
function onRoomUpdate(data) {
  if (!data) return;
  const game = data.game || {};

  // ── Phase transitions ────────────────────────────────────────
  if (activeScreen === 'waiting') {
    // Update partner status indicator
    const other = myRole === 'p1' ? 'p2' : 'p1';
    const partner = data[other] || {};
    if (partner.joined || partner.connected) {
      $('partner-status-text').textContent = (partner.name || 'Partner') + ' connected!';
      $('partner-status').querySelector('.status-dot').classList.add('active');
    }

    // Navigate straight to game if phase already playing (handles refresh/rejoin)
    if (game.phase === 'playing') {
      initGameUI(data);
      goTo('game');
      return;
    }

    // Both ready but phase not yet playing → BOTH players race to set it
    // (idempotent — whoever wins writes the same value)
    if (data.p1 && data.p1.ready && data.p2 && data.p2.ready) {
      if (game.phase !== 'playing' && game.phase !== 'ended') {
        db.ref('rooms/' + roomCode + '/game').update({ phase: 'playing' });
        // Do NOT navigate yet — wait for the next Firebase callback
        // which will arrive with phase='playing' and trigger the block above
      }
    }
    return;
  }

  if (activeScreen === 'setup') {
    // If game flips to playing while I'm still in setup, move along
    if (game.phase === 'playing') {
      initGameUI(data);
      goTo('game');
    }
    return;
  }

  if (activeScreen === 'game') {
    syncGameUI(data);
  }

  if (game.phase === 'ended' && activeScreen === 'game') {
    buildResults(data);
    goTo('results');
  }
}

/* ═══════════════════════════════════════════════════════════════
   GAME UI — INITIAL SETUP
   ═══════════════════════════════════════════════════════════════ */
function initGameUI(data) {
  const p1 = data.p1 || {};
  const p2 = data.p2 || {};
  $('tb-p1-emoji').textContent = p1.emoji || '🌸';
  $('tb-p1-name').textContent  = p1.name  || 'Player 1';
  $('tb-p2-emoji').textContent = p2.emoji || '⚡';
  $('tb-p2-name').textContent  = p2.name  || 'Player 2';
  syncGameUI(data);
}

/* ═══════════════════════════════════════════════════════════════
   GAME UI — SYNC FROM FIREBASE DATA
   ═══════════════════════════════════════════════════════════════ */
function syncGameUI(data) {
  if (!data) return;
  const game   = data.game   || {};
  const scores = data.scores || {};
  const p1     = data.p1     || {};
  const p2     = data.p2     || {};
  const isMyTurnNow = game.turn === myRole;

  /* ── Connection bar ── */
  const p1conn = p1.connected;
  const p2conn = p2.connected;
  const dot    = $('conn-dot');
  if (p1conn && p2conn) {
    dot.className = 'conn-dot connected';
    $('conn-text').textContent = 'Both connected';
  } else if (p1conn || p2conn) {
    dot.className = 'conn-dot partial';
    $('conn-text').textContent = 'Partner may be offline';
  } else {
    dot.className = 'conn-dot disconnected';
    $('conn-text').textContent = 'Reconnecting…';
  }

  /* ── Earnings in top bar ── */
  $('tb-p1-earn').textContent = scores.p1 ? scores.p1.earnings : 0;
  $('tb-p2-earn').textContent = scores.p2 ? scores.p2.earnings : 0;

  /* ── Turn banner ── */
  const turnPlayer = game.turn === 'p1' ? p1 : p2;
  const banner = $('turn-banner');
  banner.className = 'turn-banner is-' + game.turn;
  $('turn-avatar').textContent = turnPlayer.emoji || '🌸';
  $('round-number').textContent = game.round || 1;

  if (isMyTurnNow) {
    $('turn-label').textContent = 'Your turn';
    $('turn-name').textContent  = turnPlayer.name || 'You';
  } else {
    $('turn-label').textContent = "Their turn";
    $('turn-name').textContent  = turnPlayer.name || 'Them';
  }

  /* ── Mode selector visibility ── */
  $('mode-selector').style.visibility = isMyTurnNow ? 'visible' : 'hidden';

  /* ── Card + buttons based on cardPhase ── */
  const cp = game.cardPhase || 'idle';

  if (cp === 'idle') {
    $('idle-my').classList.toggle('hidden', !isMyTurnNow);
    $('idle-them').classList.toggle('hidden', isMyTurnNow);
    $('active-card').classList.add('hidden');
    $('row-draw').classList.toggle('hidden', !isMyTurnNow);
    $('row-post').classList.add('hidden');
    $('watching-footer').classList.toggle('hidden', isMyTurnNow);
    stopTimer();

    if (!isMyTurnNow) {
      $('watching-idle-text').textContent = 'Waiting for ' + (turnPlayer.name || 'them') + ' to draw…';
      $('watching-name-text').textContent = 'Watching ' + (turnPlayer.name || 'them') + "'s turn…";
    }

  } else if (cp === 'shown') {
    $('idle-my').classList.add('hidden');
    $('idle-them').classList.add('hidden');
    $('active-card').classList.remove('hidden');
    $('row-draw').classList.add('hidden');
    $('row-post').classList.toggle('hidden', !isMyTurnNow);
    $('watching-footer').classList.toggle('hidden', isMyTurnNow);

    // Render card
    const card = game.card || {};
    renderCard(card, game.turn);

    // Sync timer from draw timestamp
    if (game.cardDrawnAt) syncTimer(game.cardDrawnAt);

    if (!isMyTurnNow) {
      $('watching-name-text').textContent = 'Watching ' + (turnPlayer.name || 'them') + "'s turn…";
    }

  } else if (cp === 'done') {
    // Brief done state before turn switches — just show card read-only
    $('idle-my').classList.add('hidden');
    $('idle-them').classList.add('hidden');
    $('active-card').classList.remove('hidden');
    $('row-draw').classList.add('hidden');
    $('row-post').classList.add('hidden');
    $('watching-footer').classList.add('hidden');
    stopTimer();
  }
}

/* ─── Render a card from Firebase data ────────────────────────── */
function renderCard(card, activeTurn) {
  const ac = $('active-card');
  ac.className = 'card active-card';
  ac.classList.add(card.type + '-card');
  ac.classList.add('is-' + activeTurn);

  const badge = $('card-type-badge');
  badge.textContent = (card.type || 'truth').toUpperCase();
  badge.className = 'card-type-badge ' + (card.type === 'dare' ? 'dare-badge' : 'truth-badge');

  $('card-category').textContent = card.category || '—';
  $('card-content').textContent  = card.text || '…';
  $('card-number').textContent   = '#' + (roomSnap && roomSnap.game ? roomSnap.game.cardsPlayed : '?');
}

/* ─── Timer (synchronized to Firebase cardDrawnAt timestamp) ───── */
function syncTimer(drawnAt) {
  stopTimer();
  const ring = $('timer-ring-fill');
  const text = $('timer-text');
  $('timer-section').classList.add('visible');

  const tick = () => {
    const elapsed  = (Date.now() - drawnAt) / 1000;
    const remaining = Math.max(0, 60 - elapsed);
    const offset   = 264 - (remaining / 60) * 264;
    ring.style.strokeDashoffset = offset;
    text.textContent = remaining <= 0 ? '⏰' : Math.ceil(remaining);
    ring.style.stroke = remaining <= 15 ? '#ff4444'
                       : remaining <= 30 ? '#ffaa44' : 'var(--pink)';
  };

  tick();
  timerInt = setInterval(tick, 500);
}

function stopTimer() {
  clearInterval(timerInt);
  timerInt = null;
  $('timer-section').classList.remove('visible');
}

/* ═══════════════════════════════════════════════════════════════
   GAME ACTIONS  (write to Firebase)
   ═══════════════════════════════════════════════════════════════ */
async function actionDraw() {
  if (!db || !roomCode || !roomSnap) return;
  const g = roomSnap.game || {};
  if (g.turn !== myRole || g.cardPhase !== 'idle') return;

  const mode = selectedMode;
  const { type, text, category, newUsedQ, newUsedD } = drawCard(mode, roomSnap.usedQ || '', roomSnap.usedD || '');

  await db.ref('rooms/' + roomCode).update({
    'game/card':      { type, text, category },
    'game/cardPhase': 'shown',
    'game/cardDrawnAt': Date.now(),
    'game/cardsPlayed': (g.cardsPlayed || 0) + 1,
    usedQ: newUsedQ,
    usedD: newUsedD,
  });
}

async function actionComplete() {
  if (!db || !roomCode || !roomSnap) return;
  const g = roomSnap.game || {};
  if (g.turn !== myRole || g.cardPhase !== 'shown') return;

  const myScorePath  = 'scores/' + myRole + '/completed';
  const curCompleted = (roomSnap.scores && roomSnap.scores[myRole]) ? roomSnap.scores[myRole].completed : 0;

  await db.ref('rooms/' + roomCode).update({
    [myScorePath]: curCompleted + 1,
    'game/cardPhase': 'done',
  });

  // Auto-advance to next turn after 1.5 seconds
  setTimeout(() => advanceTurn(), 1500);
}

async function actionSkip() {
  if (!db || !roomCode || !roomSnap) return;
  const g = roomSnap.game || {};
  if (g.turn !== myRole || g.cardPhase !== 'shown') return;

  const other = myRole === 'p1' ? 'p2' : 'p1';
  const mySkipPath  = 'scores/' + myRole + '/skipped';
  const otherEarnPath = 'scores/' + other + '/earnings';
  const curSkipped = (roomSnap.scores && roomSnap.scores[myRole]) ? roomSnap.scores[myRole].skipped : 0;
  const curEarning = (roomSnap.scores && roomSnap.scores[other]) ? roomSnap.scores[other].earnings : 0;

  const skipper = (roomSnap[myRole] && roomSnap[myRole].name) ? roomSnap[myRole].name : 'Player';
  const earner  = (roomSnap[other] && roomSnap[other].name) ? roomSnap[other].name : 'Partner';

  await db.ref('rooms/' + roomCode).update({
    [mySkipPath]:   curSkipped + 1,
    [otherEarnPath]: curEarning + 10,
    'game/cardPhase': 'done',
  });

  showPenaltyOverlay(skipper, earner);
}

async function actionNext() {
  if (!db || !roomCode || !roomSnap) return;
  const g = roomSnap.game || {};
  if (g.turn !== myRole) return;

  await advanceTurn();
}

async function advanceTurn() {
  if (!db || !roomCode || !roomSnap) return;
  const g   = roomSnap.game || {};
  const next = g.turn === 'p1' ? 'p2' : 'p1';

  await db.ref('rooms/' + roomCode).update({
    'game/turn':      next,
    'game/card':      null,
    'game/cardPhase': 'idle',
    'game/cardDrawnAt': 0,
    'game/round':     g.turn === 'p2' ? (g.round || 1) + 1 : (g.round || 1),
  });
}

async function actionEndGame() {
  if (!db || !roomCode) return;
  await db.ref('rooms/' + roomCode + '/game').update({ phase: 'ended' });
}

/* ═══════════════════════════════════════════════════════════════
   PENALTY OVERLAY
   ═══════════════════════════════════════════════════════════════ */
function showPenaltyOverlay(skipperName, earnerName) {
  const quip = SKIP_QUIPS[Math.floor(Math.random() * SKIP_QUIPS.length)];
  $('penalty-msg').textContent = skipperName + ' skipped their turn!';
  $('penalty-earn-badge').textContent = '+10 EGP → ' + earnerName;
  $('penalty-sub').textContent = quip;
  $('overlay-penalty').classList.remove('hidden');
}

/* ═══════════════════════════════════════════════════════════════
   SCOREBOARD OVERLAY  (sync latest data)
   ═══════════════════════════════════════════════════════════════ */
function openScoreboard() {
  if (!roomSnap) return;
  const s  = roomSnap.scores || {};
  const p1 = roomSnap.p1 || {};
  const p2 = roomSnap.p2 || {};
  const g  = roomSnap.game || {};
  const s1 = s.p1 || {};
  const s2 = s.p2 || {};

  $('sc-p1-emoji').textContent    = p1.emoji || '🌸';
  $('sc-p1-name').textContent     = p1.name  || 'Player 1';
  $('sc-p1-completed').textContent = s1.completed || 0;
  $('sc-p1-skipped').textContent  = s1.skipped || 0;
  $('sc-p1-earn').textContent     = (s1.earnings || 0) + ' EGP';

  $('sc-p2-emoji').textContent    = p2.emoji || '⚡';
  $('sc-p2-name').textContent     = p2.name  || 'Player 2';
  $('sc-p2-completed').textContent = s2.completed || 0;
  $('sc-p2-skipped').textContent  = s2.skipped || 0;
  $('sc-p2-earn').textContent     = (s2.earnings || 0) + ' EGP';

  $('sc-round').textContent = g.round || 1;
  $('sc-cards').textContent = g.cardsPlayed || 0;

  $('overlay-scoreboard').classList.remove('hidden');
}

/* ═══════════════════════════════════════════════════════════════
   RESULTS SCREEN
   ═══════════════════════════════════════════════════════════════ */
function buildResults(data) {
  const s  = data.scores || {};
  const p1 = data.p1 || {};
  const p2 = data.p2 || {};
  const s1 = s.p1 || {};
  const s2 = s.p2 || {};

  $('res-p1-emoji').textContent    = p1.emoji || '🌸';
  $('res-p1-name').textContent     = p1.name  || 'Player 1';
  $('res-p1-completed').textContent = s1.completed || 0;
  $('res-p1-skipped').textContent  = s1.skipped   || 0;
  $('res-p1-earn').textContent     = (s1.earnings || 0) + ' EGP';

  $('res-p2-emoji').textContent    = p2.emoji || '⚡';
  $('res-p2-name').textContent     = p2.name  || 'Player 2';
  $('res-p2-completed').textContent = s2.completed || 0;
  $('res-p2-skipped').textContent  = s2.skipped   || 0;
  $('res-p2-earn').textContent     = (s2.earnings || 0) + ' EGP';

  // Winner = most earnings (meaning opponent skipped more)
  const earn1 = s1.earnings || 0;
  const earn2 = s2.earnings || 0;
  let winnerName, debtLine;
  if (earn1 > earn2) {
    winnerName = p1.name || 'Player 1';
    const owedBy = p2.name || 'Player 2';
    debtLine = owedBy + ' owes ' + winnerName + ' ' + earn1 + ' EGP 💸';
  } else if (earn2 > earn1) {
    winnerName = p2.name || 'Player 2';
    const owedBy = p1.name || 'Player 1';
    debtLine = owedBy + ' owes ' + winnerName + ' ' + earn2 + ' EGP 💸';
  } else {
    winnerName = (p1.name || 'P1') + ' & ' + (p2.name || 'P2');
    debtLine = "It's perfectly even! 🤝";
  }
  $('winner-name').textContent = winnerName;
  $('winner-debt').textContent = debtLine;
  launchConfetti();
}

function launchConfetti() {
  const container = $('results-confetti');
  container.innerHTML = '';
  const colors = ['#ff2d78','#c8a44a','#ff6fa8','#e8185d','#e0bc6e','#ffffff'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = '-20px';
    p.style.backgroundColor = colors[i % colors.length];
    p.style.animationDuration = (1.5 + Math.random() * 3) + 's';
    p.style.animationDelay = (Math.random() * 2) + 's';
    p.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
    container.appendChild(p);
  }
}

/* ═══════════════════════════════════════════════════════════════
   SHARE LINK
   ═══════════════════════════════════════════════════════════════ */
function getShareLink(code) {
  return window.location.origin + window.location.pathname + '#' + code;
}

function updateShareLink(code) {
  // Done inline when copy button is clicked
}

/* ═══════════════════════════════════════════════════════════════
   EMOJI GRID BUILDER
   ═══════════════════════════════════════════════════════════════ */
const P1_EMOJIS = ['🌸','🌷','💖','🦋','🌺','✨','🌙','💎','🌹','🎀'];
const P2_EMOJIS = ['⚡','🔥','🦅','🎯','🌊','🏆','🎸','🌑','🛡️','🦁'];

function buildEmojiGrid(role) {
  const grid    = $('setup-emoji-grid');
  const display = $('setup-emoji-display');
  const emojis  = role === 'p1' ? P1_EMOJIS : P2_EMOJIS;
  grid.innerHTML = '';
  // Select first by default
  display.textContent = emojis[0];
  emojis.forEach((em, i) => {
    const span = document.createElement('span');
    span.textContent = em;
    if (i === 0) span.classList.add('sel');
    span.addEventListener('click', () => {
      grid.querySelectorAll('span').forEach(s => s.classList.remove('sel'));
      span.classList.add('sel');
      display.textContent = em;
    });
    grid.appendChild(span);
  });
}

/* ═══════════════════════════════════════════════════════════════
   EVENT LISTENERS
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  buildEmojiGrid('p1');  // default for creator

  // Check URL for room code on load
  const urlCode = getCodeFromURL();
  if (urlCode && urlCode.length >= 4) {
    $('join-code-input').value = urlCode;
  }

  /* ── Landing → Room ── */
  $('btn-start-landing').addEventListener('click', () => goTo('room'));

  /* ── Room: back ── */
  $('btn-back-room').addEventListener('click', () => goTo('landing'));

  /* ── Room: Create ── */
  $('btn-create-room').addEventListener('click', () => {
    myRole = 'p1';
    $('setup-role-badge').textContent = 'Player 1';
    buildEmojiGrid('p1');
    goTo('setup');
  });

  /* ── Room: Join ── */
  $('btn-join-room').addEventListener('click', async () => {
    const code = $('join-code-input').value.toUpperCase().trim();
    if (!code) { showJoinError('Enter the room code first.'); return; }
    await joinRoom(code);
  });

  $('join-code-input').addEventListener('keydown', async e => {
    if (e.key === 'Enter') $('btn-join-room').click();
  });

  /* ── Setup: Ready ── */
  $('btn-ready').addEventListener('click', async () => {
    const name  = $('setup-name-input').value.trim() || (myRole === 'p1' ? 'Player 1' : 'Player 2');
    const emoji = $('setup-emoji-display').textContent;
    if (myRole === 'p1' && !roomCode) {
      // First time P1 clicks ready — create the room
      await createRoom(name, emoji);
    } else {
      await submitSetup(name, emoji);
    }
  });

  /* ── Copy share link ── */
  $('btn-copy-link').addEventListener('click', () => {
    const link = getShareLink(roomCode || $('share-code').textContent);
    navigator.clipboard.writeText(link).then(() => {
      const btn = $('btn-copy-link');
      btn.classList.add('copied');
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy Link';
      }, 2500);
    });
  });

  /* ── Mode buttons ── */
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedMode = btn.dataset.mode;
    });
  });

  /* ── Draw card ── */
  $('btn-draw').addEventListener('click', actionDraw);

  /* ── Complete ── */
  $('btn-complete').addEventListener('click', actionComplete);

  /* ── Skip ── */
  $('btn-skip').addEventListener('click', actionSkip);

  /* ── Next turn ── */
  $('btn-next').addEventListener('click', actionNext);

  /* ── Scoreboard open ── */
  $('btn-scoreboard').addEventListener('click', openScoreboard);

  /* ── Scoreboard close ── */
  $('btn-close-scoreboard').addEventListener('click', () => $('overlay-scoreboard').classList.add('hidden'));

  /* ── End game ── */
  $('btn-end-game').addEventListener('click', async () => {
    $('overlay-scoreboard').classList.add('hidden');
    await actionEndGame();
  });

  /* ── Dismiss penalty ── */
  $('btn-dismiss-penalty').addEventListener('click', () => {
    $('overlay-penalty').classList.add('hidden');
    // If it was my skip, next turn happens already via actionSkip → advanceTurn (after delay)
  });

  /* ── Play again ── */
  $('btn-play-again').addEventListener('click', () => {
    clearMyIdentity();
    if (roomRef) roomRef.off();
    roomRef = null; roomCode = null; myRole = null; roomSnap = null;
    window.location.hash = '';
    goTo('room');
  });

  /* ── Back to home ── */
  $('btn-back-home').addEventListener('click', () => {
    clearMyIdentity();
    if (roomRef) roomRef.off();
    roomRef = null; roomCode = null; myRole = null; roomSnap = null;
    window.location.hash = '';
    goTo('landing');
  });

  /* ── Close overlays on backdrop click ── */
  [$('overlay-scoreboard'), $('overlay-penalty')].forEach(o => {
    o.addEventListener('click', e => { if (e.target === o) o.classList.add('hidden'); });
  });

  /* ── Auto-rejoin if identity saved in localStorage ── */
  loadMyIdentity();
  if (roomCode && myRole && FIREBASE_READY) {
    // Restore URL hash and start listening — onRoomUpdate will navigate
    // to the correct screen (waiting or game) based on current Firebase state
    setCodeInURL(roomCode);
    $('share-code').textContent = roomCode;
    attachRoomListener();
    // Temporarily go to waiting; onRoomUpdate will forward to game if already playing
    goTo('waiting');
  } else if (!roomCode) {
    // Check if URL has a room code (P2 opening shared link on fresh device/browser)
    const urlCode = getCodeFromURL();
    if (urlCode && FIREBASE_READY) {
      $('join-code-input').value = urlCode;
      // Auto-trigger join
      joinRoom(urlCode);
    }
  }
});
