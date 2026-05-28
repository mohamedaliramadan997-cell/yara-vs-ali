/* ═══════════════════════════════════════════════════════════════════
   YARA VS ALI — Game Logic
   Full turn-based Truth or Dare with penalty system
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── Questions Database ─────────────────────────────────────── */
const QUESTIONS = [
  // ── CHILDHOOD ──────────────────────────────────────────────────
  { text: "What's the earliest memory that still makes you smile when you think about it?", category: "Childhood" },
  { text: "What did you want to be when you grew up at age 7? Was it realistic?", category: "Childhood" },
  { text: "What was the most mischievous thing you did as a kid that you never got caught for?", category: "Childhood" },
  { text: "What toy or game were you so obsessed with that your parents probably hid it sometimes?", category: "Childhood" },
  { text: "What childhood nickname do you still secretly love?", category: "Childhood" },
  { text: "What was your favorite subject in school and what made it click for you?", category: "Childhood" },
  { text: "Describe your childhood bedroom using exactly three words.", category: "Childhood" },
  { text: "What's a family tradition from your childhood that you'd want to keep forever?", category: "Childhood" },
  { text: "What's the most embarrassing thing that ever happened to you in school?", category: "Childhood" },
  { text: "Who was your childhood hero and why — and do you still admire them?", category: "Childhood" },
  { text: "What food did you absolutely hate as a kid that you can't get enough of now?", category: "Childhood" },
  { text: "What's the funniest lie you ever told your parents and did it work?", category: "Childhood" },
  { text: "Were you more of a shy, quiet kid or the one who had to be the center of attention?", category: "Childhood" },
  { text: "What's the first movie you remember watching in a cinema and how did you feel?", category: "Childhood" },
  { text: "Did you ever have an imaginary friend? If yes, what were they like?", category: "Childhood" },
  { text: "What game or activity could your younger self play for hours without getting bored?", category: "Childhood" },
  { text: "What's something your parents always said to you that stuck — for better or worse?", category: "Childhood" },
  { text: "Were you more of a rule-follower or a rule-bender growing up?", category: "Childhood" },
  { text: "What's your happiest birthday memory from when you were little?", category: "Childhood" },
  { text: "What cartoon or TV show could sum up your whole childhood?", category: "Childhood" },

  // ── DREAMS & AMBITIONS ─────────────────────────────────────────
  { text: "What's one dream you've never told anyone because it feels too big or too personal?", category: "Dreams" },
  { text: "If you could master any skill in exactly 30 days, what would you choose and why?", category: "Dreams" },
  { text: "Where do you see yourself in 10 years — honestly, not the polished version?", category: "Dreams" },
  { text: "What's on your bucket list that would genuinely surprise people who know you?", category: "Dreams" },
  { text: "If you could start any business with zero risk of failure, what would it be?", category: "Dreams" },
  { text: "What would you do with your entire life if money and judgment didn't exist?", category: "Dreams" },
  { text: "What's a goal you've been quietly working toward that not many people know about?", category: "Dreams" },
  { text: "If you had to pick one country to live in for the rest of your life, which would it be?", category: "Dreams" },
  { text: "What's the most ambitious thing you've ever attempted, regardless of whether it worked out?", category: "Dreams" },
  { text: "If you could be world-famous for one specific thing, what would you want it to be?", category: "Dreams" },
  { text: "What kind of legacy do you want to leave behind when you're gone?", category: "Dreams" },
  { text: "Describe your absolute dream house in as much detail as you want.", category: "Dreams" },
  { text: "If you had to write a book right now, what would it be about?", category: "Dreams" },
  { text: "What's something you've always wanted to learn but keep putting off?", category: "Dreams" },
  { text: "If you could switch careers for exactly one year, what would you do instead?", category: "Dreams" },
  { text: "What does your ideal Monday morning look like — every detail?", category: "Dreams" },
  { text: "What's your dream travel destination and what's the first thing you'd do when you landed?", category: "Dreams" },
  { text: "What would your life look like if you were living it exactly how you wanted?", category: "Dreams" },
  { text: "If you had a full year off with full financial support, how would you spend it?", category: "Dreams" },
  { text: "What's one thing you're afraid to want because you're not sure you deserve it?", category: "Dreams" },

  // ── RELATIONSHIPS ──────────────────────────────────────────────
  { text: "What quality do you think matters most in a relationship — and do you think you have it?", category: "Relationships" },
  { text: "What's your love language — and how do you usually show it to people you care about?", category: "Relationships" },
  { text: "What's something a person could do that would instantly win your heart?", category: "Relationships" },
  { text: "What's a small thing that matters a lot to you in a relationship that others might call minor?", category: "Relationships" },
  { text: "How do you usually show someone you care about them without saying it directly?", category: "Relationships" },
  { text: "What's the most romantic thing anyone has ever done for you?", category: "Relationships" },
  { text: "What does 'being there for someone' truly mean to you?", category: "Relationships" },
  { text: "Are you more of a texter or a caller in close relationships?", category: "Relationships" },
  { text: "What's usually the first thing you notice about someone new?", category: "Relationships" },
  { text: "How do you handle conflict or disagreements with someone you genuinely care about?", category: "Relationships" },
  { text: "What does trust truly mean to you — beyond just 'not lying'?", category: "Relationships" },
  { text: "What's an absolute non-negotiable in any relationship you're part of?", category: "Relationships" },
  { text: "Do you believe in soulmates? What does that idea mean to you?", category: "Relationships" },
  { text: "What's the nicest thing anyone has ever said to you that you still think about?", category: "Relationships" },
  { text: "What would your perfect date look like — from start to finish?", category: "Relationships" },
  { text: "How important is humor in a relationship to you?", category: "Relationships" },
  { text: "How do you know, deep down, when you truly like someone?", category: "Relationships" },
  { text: "What's the most important thing you've ever learned from a relationship?", category: "Relationships" },
  { text: "Are you someone who fights for things to work, or do you believe in letting go easily?", category: "Relationships" },
  { text: "What's something you've never been able to fully explain to a partner that you really needed them to understand?", category: "Relationships" },

  // ── PERSONAL VALUES ────────────────────────────────────────────
  { text: "What's one core belief that shapes most of your decisions in life?", category: "Values" },
  { text: "What's something you would genuinely never compromise on no matter what?", category: "Values" },
  { text: "What does success actually mean to you — your definition, not the world's?", category: "Values" },
  { text: "How do you personally define what a good person is?", category: "Values" },
  { text: "When honesty and kindness conflict, which do you usually choose?", category: "Values" },
  { text: "What's a cause or issue you feel genuinely strongly about?", category: "Values" },
  { text: "What do you think the world desperately needs more of right now?", category: "Values" },
  { text: "How important is family to you — and what does that word really mean to you?", category: "Values" },
  { text: "What's your honest philosophy on forgiveness?", category: "Values" },
  { text: "Do you genuinely believe people can change, or is that mostly wishful thinking?", category: "Values" },
  { text: "What's something society gets wrong that most people are afraid to say out loud?", category: "Values" },
  { text: "What does loyalty mean to you in practice — not just as a word?", category: "Values" },
  { text: "What's your personal definition of happiness?", category: "Values" },
  { text: "What's one thing you stand for no matter who's watching?", category: "Values" },
  { text: "What's your philosophy when it comes to taking risks in life?", category: "Values" },
  { text: "What's one thing you've learned that permanently changed how you see the world?", category: "Values" },
  { text: "What do you think is the most overrated thing people chase in life?", category: "Values" },
  { text: "How do you deal with people who see the world completely differently than you?", category: "Values" },
  { text: "What role does your faith, spirituality, or inner compass play in your daily life?", category: "Values" },
  { text: "What's something you believe that you know most people wouldn't agree with?", category: "Values" },

  // ── FUNNY EXPERIENCES ─────────────────────────────────────────
  { text: "What's the funniest thing that's ever happened to you in public — the kind you still laugh about?", category: "Funny" },
  { text: "What's the most ridiculous argument you've ever gotten into with someone?", category: "Funny" },
  { text: "What's a trend you fully committed to that you now deeply regret?", category: "Funny" },
  { text: "What's the weirdest, most random dream you've ever had?", category: "Funny" },
  { text: "What's a completely useless skill you've somehow mastered?", category: "Funny" },
  { text: "What's the most elaborate excuse you've ever made for something embarrassing?", category: "Funny" },
  { text: "What's something you believed was definitely true for way too long before someone corrected you?", category: "Funny" },
  { text: "What's a fashion choice you look back on and genuinely cannot explain?", category: "Funny" },
  { text: "What's the most random Wikipedia rabbit hole you've fallen into?", category: "Funny" },
  { text: "What's the weirdest food combination you secretly enjoy that others would judge you for?", category: "Funny" },
  { text: "What's your most embarrassing food moment — spills, mispronunciations, ordering disasters?", category: "Funny" },
  { text: "What's a movie or show you've watched so many times you could probably write the script?", category: "Funny" },
  { text: "What's the most chaotic autocorrect message you've accidentally sent?", category: "Funny" },
  { text: "What's a silly fear you have that makes absolutely no logical sense?", category: "Funny" },
  { text: "What's the most ridiculous reason you've ever been late to something?", category: "Funny" },

  // ── HYPOTHETICAL ──────────────────────────────────────────────
  { text: "If you could live inside any fictional universe, which one would you choose and why?", category: "Hypothetical" },
  { text: "If you could only eat one cuisine for the rest of your life, which would it be?", category: "Hypothetical" },
  { text: "If you had a fully functional time machine, which era would you visit first?", category: "Hypothetical" },
  { text: "If you could swap lives with someone for one week, who would it be?", category: "Hypothetical" },
  { text: "If you had to teach a class on something tomorrow, what topic would you own?", category: "Hypothetical" },
  { text: "If you could have any superpower, which would you pick — and what would you actually do with it?", category: "Hypothetical" },
  { text: "If you could instantly become fluent in any language, which would you choose?", category: "Hypothetical" },
  { text: "If you lost all social media for a year, what would change most in your life?", category: "Hypothetical" },
  { text: "If you could redesign one aspect of how society works, what would you change?", category: "Hypothetical" },
  { text: "If animals could talk, which species would be the most annoying and which the wisest?", category: "Hypothetical" },
  { text: "If you could delete one app from your phone forever, which would actually make your life better?", category: "Hypothetical" },
  { text: "If you could only wear one color for an entire year, which would you choose?", category: "Hypothetical" },
  { text: "If you got 24 hours to do absolutely anything with zero consequences, what would your day look like?", category: "Hypothetical" },
  { text: "If you could be any age forever, what age would you choose and why?", category: "Hypothetical" },
  { text: "If you had to give everything up and start over in a new city with a new identity, what would you do differently?", category: "Hypothetical" },

  // ── FEARS ─────────────────────────────────────────────────────
  { text: "What's your biggest fear — and do you know where it actually comes from?", category: "Fears" },
  { text: "What's something that used to genuinely terrify you but doesn't affect you anymore?", category: "Fears" },
  { text: "What's a fear you've overcome that you're quietly proud of?", category: "Fears" },
  { text: "Are you more afraid of failure or of succeeding and still feeling empty?", category: "Fears" },
  { text: "What's a social situation that makes you genuinely uncomfortable?", category: "Fears" },
  { text: "What's a fear you rarely admit to people?", category: "Fears" },
  { text: "What worries you most when you think about the future?", category: "Fears" },
  { text: "Are you more afraid of being completely alone, or being in the wrong relationship?", category: "Fears" },
  { text: "What's one thing you'd definitely try if you knew you absolutely could not fail?", category: "Fears" },
  { text: "What's something you want desperately but are afraid to go after?", category: "Fears" },

  // ── ROMANCE ───────────────────────────────────────────────────
  { text: "What's the most romantic thing you've ever done for someone?", category: "Romance" },
  { text: "What song do you think would perfectly soundtrack your love story?", category: "Romance" },
  { text: "What's a small, specific thing someone does that you find incredibly attractive?", category: "Romance" },
  { text: "How would you describe the feeling of chemistry when it's real?", category: "Romance" },
  { text: "What's the perfect way to end a perfect day spent with someone you like?", category: "Romance" },
  { text: "What does a genuinely healthy, loving relationship look like to you?", category: "Romance" },
  { text: "What's something that still gives you butterflies no matter how familiar it is?", category: "Romance" },
  { text: "Are you more of a grand romantic gesture person or a small daily kindness person?", category: "Romance" },
  { text: "What's the most thoughtful gift you've ever given — or received?", category: "Romance" },
  { text: "How do you know when something real is starting to develop between two people?", category: "Romance" },

  // ── DEEP & EMOTIONAL ──────────────────────────────────────────
  { text: "What's something you're still healing from — you don't have to share details if you don't want to?", category: "Deep" },
  { text: "What's a single moment that changed who you are forever?", category: "Deep" },
  { text: "Who has had the single biggest positive impact on your life and how?", category: "Deep" },
  { text: "What's the most important thing you've ever learned from hitting rock bottom?", category: "Deep" },
  { text: "What emotion do you find the most difficult to express, and why?", category: "Deep" },
  { text: "What's something you're genuinely proud of that most people don't even know about?", category: "Deep" },
  { text: "What's a part of yourself you're still figuring out?", category: "Deep" },
  { text: "If you could go back and say one thing to your younger self, what would it be?", category: "Deep" },
  { text: "What's the bravest thing you've ever done — even if no one else saw it?", category: "Deep" },
  { text: "What's something you've genuinely forgiven yourself for?", category: "Deep" },
  { text: "What does being truly vulnerable with someone mean to you?", category: "Deep" },
  { text: "When's the last time you felt completely, genuinely seen by another person?", category: "Deep" },
  { text: "What's a belief you held for a long time that you've since completely changed?", category: "Deep" },
  { text: "What brings you peace when everything around you feels chaotic?", category: "Deep" },
  { text: "What do you think is your greatest strength AND your greatest challenge as a person?", category: "Deep" },

  // ── LIFESTYLE ─────────────────────────────────────────────────
  { text: "Are you more of a morning person or a night owl — and which do you wish you were?", category: "Lifestyle" },
  { text: "What does your ideal, perfect weekend look like in detail?", category: "Lifestyle" },
  { text: "How do you recharge — alone, or by being around people?", category: "Lifestyle" },
  { text: "What's your honest relationship with your phone?", category: "Lifestyle" },
  { text: "What's the first thing you do when you wake up — ideally and actually?", category: "Lifestyle" },
  { text: "How do you usually handle stress — what's your go-to?", category: "Lifestyle" },
  { text: "What's your guiltiest pleasure that you have zero shame about?", category: "Lifestyle" },
  { text: "What's a habit you've been trying to build — and why does it keep stopping?", category: "Lifestyle" },
  { text: "How important is fitness and physical health in your day-to-day life?", category: "Lifestyle" },
  { text: "What does your perfect lazy, do-nothing day look like?", category: "Lifestyle" },
  { text: "What's something you do differently than most people that actually works for you?", category: "Lifestyle" },
  { text: "Do you tend to make decisions from your gut or from careful analysis?", category: "Lifestyle" },
  { text: "What's something you can genuinely never say no to?", category: "Lifestyle" },
  { text: "What's something you own that you have a deeply irrational attachment to?", category: "Lifestyle" },
  { text: "What's a small daily thing that makes your whole day better when it happens?", category: "Lifestyle" },

  // ── MUSIC & CULTURE ───────────────────────────────────────────
  { text: "What artist or band has been on permanent rotation in your life recently?", category: "Music & Art" },
  { text: "What song always, without fail, puts you deep in your feelings?", category: "Music & Art" },
  { text: "What genre of music would people be surprised to know you actually love?", category: "Music & Art" },
  { text: "If your life was a movie, what genre would it be — and who would play you?", category: "Music & Art" },
  { text: "What movie has had the most genuine impact on how you see the world?", category: "Music & Art" },
  { text: "What's a book that actually changed the way you think?", category: "Music & Art" },
  { text: "What song would play when you walk into a room — the soundtrack to your entrance?", category: "Music & Art" },
  { text: "What piece of art — music, film, or book — has made you actually cry?", category: "Music & Art" },
  { text: "What's a concert or live experience you'd travel anywhere in the world to see?", category: "Music & Art" },
  { text: "What show or movie did you love so much you were genuinely sad when it ended?", category: "Music & Art" },

  // ── RED FLAGS & GREEN FLAGS ────────────────────────────────────
  { text: "What's an immediate green flag you look for when you first meet someone?", category: "Flags" },
  { text: "What's a red flag that you've learned the hard way to spot early?", category: "Flags" },
  { text: "What's a tiny thing someone does that instantly makes you like them more?", category: "Flags" },
  { text: "What's an absolute dealbreaker for you — something others might overlook?", category: "Flags" },
  { text: "What's a green flag you genuinely try to embody yourself?", category: "Flags" },
  { text: "What behavior in friendships do you have zero tolerance for?", category: "Flags" },
  { text: "What's an unexpected quality that you find genuinely attractive in a person?", category: "Flags" },
  { text: "What impresses you more than wealth or looks when you meet someone?", category: "Flags" },
  { text: "How do you tell the difference between a red flag and just a quirk?", category: "Flags" },
  { text: "What's something people do without realizing how attractive it is?", category: "Flags" },

  // ── FUTURE ────────────────────────────────────────────────────
  { text: "What's one thing you genuinely want to change about your life this year?", category: "Future" },
  { text: "What does your ideal life look like in 5 years — be specific and honest?", category: "Future" },
  { text: "What relationship goal means the most to you right now?", category: "Future" },
  { text: "Where do you want to be living in 10 years, and what does daily life there look like?", category: "Future" },
  { text: "What's one habit that, if you started today, could genuinely change everything?", category: "Future" },
  { text: "What's an experience you're determined to have before this year ends?", category: "Future" },
  { text: "What's your biggest professional or personal ambition that still feels far away?", category: "Future" },
  { text: "How do you want to feel every single day five years from now?", category: "Future" },
  { text: "What's something you'll look back on and be glad you did even when it was hard?", category: "Future" },
  { text: "What's something you want to do soon but keep waiting for 'the right time'?", category: "Future" },

  // ── FRIENDSHIP ────────────────────────────────────────────────
  { text: "What makes someone a true, real friend to you — not just someone you know?", category: "Friendship" },
  { text: "What's the most important thing you value in a friendship?", category: "Friendship" },
  { text: "What's something your friends would be genuinely surprised to know about you?", category: "Friendship" },
  { text: "What friendship lesson did you learn the hard way?", category: "Friendship" },
  { text: "Are you more of the advice-giver or the advice-seeker in your close friendships?", category: "Friendship" },
  { text: "What's the friendship trait you're most proud of in yourself?", category: "Friendship" },
  { text: "How do you usually show up for your friends when things get hard?", category: "Friendship" },
  { text: "What's a friendship that ended that you still think about?", category: "Friendship" },
  { text: "What's something a friend did for you that completely restored your faith in people?", category: "Friendship" },
  { text: "What do you think is the biggest thing that kills friendships over time?", category: "Friendship" },

  // ── PERSONALITY & SELF ─────────────────────────────────────────
  { text: "How do you think the people who know you best would describe you in 3 words?", category: "Personality" },
  { text: "What's your least favorite thing about your own personality — be honest?", category: "Personality" },
  { text: "What's something about yourself that took you a long time to actually like?", category: "Personality" },
  { text: "Are you more introverted or extroverted — and do you think people can usually tell?", category: "Personality" },
  { text: "What's something you do when no one is watching that shows who you really are?", category: "Personality" },
  { text: "How do you handle compliments — do you accept them gracefully or deflect?", category: "Personality" },
  { text: "What's a contradiction in your personality that you've fully accepted?", category: "Personality" },
  { text: "Are you someone who holds grudges, or do you tend to let things go easily?", category: "Personality" },
  { text: "What's your default mode when life gets overwhelming?", category: "Personality" },
  { text: "What's something you do that you know is a little annoying but genuinely can't stop?", category: "Personality" },

  // ── COMMUNICATION ─────────────────────────────────────────────
  { text: "How do you prefer to be comforted when you're going through something hard?", category: "Communication" },
  { text: "What's something people often misunderstand about you from how you communicate?", category: "Communication" },
  { text: "Do you say what you mean, or do you often expect people to read between the lines?", category: "Communication" },
  { text: "What's your honest communication style when you're upset with someone close to you?", category: "Communication" },
  { text: "Are you someone who needs space after conflict, or do you prefer to resolve things immediately?", category: "Communication" },
  { text: "What's the most important thing you need someone to understand about how you express yourself?", category: "Communication" },
  { text: "What's a conversation you've been putting off having with someone?", category: "Communication" },
  { text: "Do you find it easier to say hard things in person or in writing?", category: "Communication" },
  { text: "What's something you wish you were better at expressing?", category: "Communication" },
  { text: "How do you know when someone truly understands you versus just saying they do?", category: "Communication" },

  // ── SECRETS & CONFESSIONS ─────────────────────────────────────
  { text: "What's something you've never told anyone that you've been wanting to say out loud?", category: "Secrets" },
  { text: "What's an opinion you hold that you know most people around you would disagree with?", category: "Secrets" },
  { text: "What's something you've secretly been judging yourself for?", category: "Secrets" },
  { text: "What's a hobby, interest, or obsession you hide because you think people would find it weird?", category: "Secrets" },
  { text: "What's something you did once that you've never admitted to anyone?", category: "Secrets" },
  { text: "What's a compliment you've always wanted to receive but never have?", category: "Secrets" },
  { text: "What do you secretly think about before you fall asleep most nights?", category: "Secrets" },
  { text: "What's something you've googled at 2am that you'd never say out loud in public?", category: "Secrets" },
  { text: "What's a version of yourself you've been hiding that you'd actually like to show more?", category: "Secrets" },
  { text: "What's the thing you want most right now but haven't told anyone you want?", category: "Secrets" },

  // ── BUCKET LIST ───────────────────────────────────────────────
  { text: "What's the single most exciting thing on your bucket list right now?", category: "Bucket List" },
  { text: "What's something on your bucket list that would genuinely surprise people who know you?", category: "Bucket List" },
  { text: "What's an experience you want to have at least once before you die, no matter what?", category: "Bucket List" },
  { text: "What's a place in the world you need to visit before you feel like your life is complete?", category: "Bucket List" },
  { text: "What skill would you want to learn just to say you did it, even if you never use it?", category: "Bucket List" },
  { text: "What's something you want to do that scares you a little but excites you more?", category: "Bucket List" },
  { text: "What's an experience you've come close to doing but always backed out of?", category: "Bucket List" },
  { text: "If you had to check one bucket list item off this year, what would you pick?", category: "Bucket List" },
  { text: "What's something on your bucket list that's more about feeling than doing?", category: "Bucket List" },
  { text: "What adventure would you go on if someone else was planning everything for you?", category: "Bucket List" },

  // ── PLAYFUL & FLIRTY ──────────────────────────────────────────
  { text: "What's something about you that you think takes people by surprise when they get to know you?", category: "Playful" },
  { text: "What's the most attractive quality someone can have — that has nothing to do with looks?", category: "Playful" },
  { text: "What's your most underrated quality that more people should notice?", category: "Playful" },
  { text: "What's something you do naturally that you've been told people find charming?", category: "Playful" },
  { text: "What kind of compliment means the most to you coming from someone you like?", category: "Playful" },
  { text: "What's the most interesting thing about you that takes people a while to discover?", category: "Playful" },
  { text: "What's your most endearing bad habit?", category: "Playful" },
  { text: "What's something you find weirdly attractive that most people wouldn't expect?", category: "Playful" },
  { text: "What would a perfect 'getting to know each other' day look like to you?", category: "Playful" },
  { text: "What's something you secretly hope people notice about you?", category: "Playful" },

  // ── FOOD & TRAVEL ─────────────────────────────────────────────
  { text: "What's a meal so good it changed your relationship with food?", category: "Food & Travel" },
  { text: "If you had to live on only three foods for a month, what would they be?", category: "Food & Travel" },
  { text: "What's your most controversial food opinion — the one that starts arguments?", category: "Food & Travel" },
  { text: "What travel experience has stayed with you the most and why?", category: "Food & Travel" },
  { text: "Are you more of a 'plan everything' or 'figure it out when you get there' traveler?", category: "Food & Travel" },
  { text: "What's your coffee or tea order — and what does it say about you?", category: "Food & Travel" },
  { text: "What's a place you've been to that felt like a completely different world?", category: "Food & Travel" },
  { text: "What country's cuisine do you think is the most underrated?", category: "Food & Travel" },
  { text: "What's a food you'd eat every single day if calories and consequences didn't exist?", category: "Food & Travel" },
  { text: "What's the best meal you've ever had and where was it?", category: "Food & Travel" }
];

/* ─── Dares Database ─────────────────────────────────────────── */
const DARES = [
  // ── VOICE / AUDIO ──────────────────────────────────────────────
  { text: "Record a 15-second voice note singing a line from your current most-played song and send it.", category: "Voice" },
  { text: "Do your best impression of a dramatic movie villain and send a voice note.", category: "Voice" },
  { text: "Say five genuine compliments about the other player in a funny accent — voice note format.", category: "Voice" },
  { text: "Narrate your current surroundings like a nature documentary narrator. Send the voice note.", category: "Voice" },
  { text: "Sing Happy Birthday in the most dramatic, over-the-top opera style you can manage.", category: "Voice" },
  { text: "Do an impression of a serious news anchor reporting on what you did today.", category: "Voice" },
  { text: "Record a fake weather forecast for tomorrow that includes your emotional forecast.", category: "Voice" },
  { text: "Say the alphabet backwards as fast as you possibly can without stopping — send a voice note.", category: "Voice" },
  { text: "Read your last text message out loud in a dramatic Shakespearean theatrical voice.", category: "Voice" },
  { text: "Freestyle a 30-second rap about what you're currently wearing. No skipping.", category: "Voice" },
  { text: "Give a 30-second motivational speech about the importance of something completely unimportant.", category: "Voice" },
  { text: "Do your best ASMR voice note about your favorite food as if it's a fine dining experience.", category: "Voice" },
  { text: "Impersonate a strict professor giving instructions about something completely trivial.", category: "Voice" },
  { text: "Record yourself doing a dramatic reading of your last three text messages like it's a novel.", category: "Voice" },
  { text: "Sing a lullaby you just made up about something that happened today.", category: "Voice" },
  { text: "Do your best impression of an elderly person telling an extremely long story about nothing.", category: "Voice" },
  { text: "Do a fake commercial advertisement for your own personality in 30 seconds.", category: "Voice" },
  { text: "Voice note a fake job interview where you're applying to be the other player's best friend.", category: "Voice" },
  { text: "Narrate making an imaginary sandwich as if you're on a Michelin-star cooking show.", category: "Voice" },
  { text: "Say something completely ordinary in five completely different emotional tones — voice note.", category: "Voice" },

  // ── SELFIE / PHOTO ─────────────────────────────────────────────
  { text: "Take a selfie making the absolute funniest, most ridiculous face you can and send it.", category: "Selfie" },
  { text: "Take a selfie in the most dramatically bad lighting you can find in your current space.", category: "Selfie" },
  { text: "Recreate a famous painting's pose using whatever items you have around you. Photo required.", category: "Selfie" },
  { text: "Take a selfie with the nearest random object on your head being used as an improvised hat.", category: "Selfie" },
  { text: "Strike a full red-carpet pose using your current room as the venue. Send the selfie.", category: "Selfie" },
  { text: "Take a selfie looking genuinely shocked by imaginary paparazzi outside your window.", category: "Selfie" },
  { text: "Take a straight-faced mugshot-style selfie and send it with no explanation.", category: "Selfie" },
  { text: "Take a selfie in the most theatrical 'deep thinking philosopher' pose you can manage.", category: "Selfie" },
  { text: "Take a selfie looking like you're about to give a world-changing TED Talk.", category: "Selfie" },
  { text: "Recreate a famous emoji face in real life. Send the photo. The other person has to guess which emoji.", category: "Selfie" },
  { text: "Take a photo of the messiest spot in your room right now and explain it without shame.", category: "Selfie" },
  { text: "Take a selfie styled as a Renaissance oil painting — noble, serious, dramatic.", category: "Selfie" },
  { text: "Take a sport victory celebration photo as if you just won a gold medal. Maximum energy.", category: "Selfie" },
  { text: "Take a photo of the most random, inexplicable item currently in your bag or pockets.", category: "Selfie" },
  { text: "Take a selfie pretending you just discovered you're the main character of a blockbuster movie.", category: "Selfie" },
  { text: "Find something near you that matches the other player's energy and take a photo of it.", category: "Selfie" },
  { text: "Take a photo of the view from your window right now with a one-sentence poetic caption.", category: "Selfie" },
  { text: "Describe your current outfit as if it's a high fashion runway piece. Send a photo to match.", category: "Selfie" },
  { text: "Take a selfie at your least flattering angle. Own it completely.", category: "Selfie" },
  { text: "Find the most chaotic-looking corner of your space and photograph it as if it's abstract art.", category: "Selfie" },

  // ── TEXT & CHAT ────────────────────────────────────────────────
  { text: "Write a 3-sentence horror story using only events from your week.", category: "Text" },
  { text: "Write a Haiku poem about what you're currently feeling right now and send it.", category: "Text" },
  { text: "Send a motivational quote you just completely made up as if it's famous.", category: "Text" },
  { text: "Write your own Wikipedia-style intro paragraph about yourself.", category: "Text" },
  { text: "Write a 4-line rhyming poem about your favorite food.", category: "Text" },
  { text: "Write a fake movie review of your own life using actual critic language.", category: "Text" },
  { text: "Create a brand new word, define it, and use it in a sentence.", category: "Text" },
  { text: "Write your autobiography in exactly three sentences — make them count.", category: "Text" },
  { text: "Describe your current mood as a Michelin-star restaurant menu item.", category: "Text" },
  { text: "Write a dramatic, literary caption for your most recent selfie and send it.", category: "Text" },
  { text: "Write a 10-word personal life philosophy that you'd actually put on a wall.", category: "Text" },
  { text: "Describe your week using only song titles — minimum five songs.", category: "Text" },
  { text: "Write the worst possible opening line for a dating profile. Make it hilariously bad.", category: "Text" },
  { text: "Write a fake positive news headline where you are the hero of the story.", category: "Text" },
  { text: "Write a fortune cookie message for yourself based on your current life situation.", category: "Text" },
  { text: "Write the dedication page of your future memoir — who gets the shoutout?", category: "Text" },
  { text: "Write a completely unhinged Instagram caption for a photo of your feet.", category: "Text" },
  { text: "Write a two-sentence glowing review of yourself as a friend.", category: "Text" },
  { text: "Write the world's most dramatic resignation letter from a made-up job.", category: "Text" },
  { text: "Describe today as if it were the plot summary of an arthouse film.", category: "Text" },

  // ── MEMORY & TRIVIA ────────────────────────────────────────────
  { text: "Name 5 specific things you know about the other player right now — no guessing allowed.", category: "Memory" },
  { text: "Tell the story of how you two first crossed paths as dramatically as possible.", category: "Memory" },
  { text: "Recall and retell the funniest thing the other player has ever said to you.", category: "Memory" },
  { text: "Name 3 things you've noticed about the other player that you've never said out loud.", category: "Memory" },
  { text: "Describe the other player's vibe using a color, a season, and a song.", category: "Memory" },
  { text: "Guess the other player's top 3 most-used emojis. They verify afterwards.", category: "Memory" },
  { text: "Describe the other player's personality as if it were a coffee order. Be specific.", category: "Memory" },
  { text: "Guess what the other player had for their last meal — full dish, not just 'food'.", category: "Memory" },
  { text: "Name 3 things you and the other player definitely have in common.", category: "Memory" },
  { text: "Tell the story of your own week in under 60 seconds. Go.", category: "Memory" },
  { text: "Name 5 things that are currently within 3 feet of you without looking. Then look and verify.", category: "Memory" },
  { text: "Guess the other player's biggest pet peeve. They score you on accuracy.", category: "Memory" },
  { text: "Describe what you think the other player's Instagram aesthetic is.", category: "Memory" },
  { text: "Name what superpower you think genuinely suits the other player's personality.", category: "Memory" },
  { text: "Recall a moment when the other player said or did something that stuck with you.", category: "Memory" },

  // ── PHYSICAL / PERFORMANCE ─────────────────────────────────────
  { text: "Do a 10-second dance to whatever song is currently stuck in your head. Send the video.", category: "Performance" },
  { text: "Do your best robot-dance impression and send a short video.", category: "Performance" },
  { text: "Do the most dramatically slow-motion entrance walk you can for 10 steps.", category: "Performance" },
  { text: "Strike your most powerful superhero landing pose and hold it for 5 seconds.", category: "Performance" },
  { text: "Do your best impression of someone walking in high heels for the first time.", category: "Performance" },
  { text: "Do a full, completely unironic victory dance as if you just won the Olympics.", category: "Performance" },
  { text: "Freeze completely still like a statue for 30 full seconds. No moving at all.", category: "Performance" },
  { text: "Perform 5 dance moves from 5 completely different decades back to back.", category: "Performance" },
  { text: "Do the most dramatic, theatrical slow-motion hair flip you can manage.", category: "Performance" },
  { text: "Act out waking up late for something critically important — 30 seconds, full commitment.", category: "Performance" },
  { text: "Do the most exaggerated chef's kiss gesture in five progressively more dramatic ways.", category: "Performance" },
  { text: "Mime eating your absolute favorite meal with zero words and complete facial commitment.", category: "Performance" },
  { text: "Act out discovering you have a superpower for the first time. Be specific about which power.", category: "Performance" },
  { text: "Perform a fake awards show acceptance speech for 'Most Likely to Still Be Awake at 3am'.", category: "Performance" },
  { text: "Act out trying to explain the concept of TikTok to someone from 1950.", category: "Performance" },

  // ── CREATIVE / ACTING ──────────────────────────────────────────
  { text: "Perform a 30-second TED Talk on why your favorite food is objectively superior to all others.", category: "Creative" },
  { text: "Do a full villain monologue about something completely minor, like losing a charger.", category: "Creative" },
  { text: "Act out being a live sports commentator covering you making your morning coffee.", category: "Creative" },
  { text: "Do an infomercial for your worst personal habit. Make it sound like a selling point.", category: "Creative" },
  { text: "Act out what your reaction would be if you found out you were secretly royalty.", category: "Creative" },
  { text: "Perform the dramatic opening scene of your life if it were a Netflix original.", category: "Creative" },
  { text: "Act out receiving absolutely devastating news about something completely trivial.", category: "Creative" },
  { text: "Perform a cooking show segment where the dish is completely invisible and imaginary.", category: "Creative" },
  { text: "Act out a press conference where you're defending your most controversial opinion.", category: "Creative" },
  { text: "Do a 20-second commercial that makes your personality sound like a luxury product.", category: "Creative" },
  { text: "Perform the dramatic Shakespeare-style version of reading and sending a text message.", category: "Creative" },
  { text: "Act out trying to explain your most niche interest to someone who has never heard of it.", category: "Creative" },
  { text: "Create and perform a fake news segment covering the most dramatic thing that happened to you this week.", category: "Creative" },
  { text: "Act out a job interview where you're applying to be the other person's official hype person.", category: "Creative" },
  { text: "Give a dramatic, emotional farewell speech to your least favorite habit.", category: "Creative" },

  // ── COMPLIMENT / CONNECTION ────────────────────────────────────
  { text: "Tell the other player 3 things you genuinely admire about them. Make them specific.", category: "Compliment" },
  { text: "Write the other player the kindest, most genuine text you can in exactly 2 minutes. Send it.", category: "Compliment" },
  { text: "Create a nickname for the other player based purely on their personality.", category: "Compliment" },
  { text: "Tell the other player the most interesting thing you've noticed about them.", category: "Compliment" },
  { text: "Describe the other player as if writing the opening paragraph of their biography.", category: "Compliment" },
  { text: "Tell the other player one specific thing they do that always makes you smile.", category: "Compliment" },
  { text: "Create the best possible Instagram bio for the other player.", category: "Compliment" },
  { text: "Write a 4-line rap that compliments the other player. Delivery counts.", category: "Compliment" },
  { text: "Tell the other player what city in the world matches their personality and why.", category: "Compliment" },
  { text: "Describe the other player's laugh without using the word 'nice', 'cute', or 'good'.", category: "Compliment" },
  { text: "Tell the other player what TV character they remind you of and give your full reasoning.", category: "Compliment" },
  { text: "Create a theme song title for the other player's life right now.", category: "Compliment" },
  { text: "Tell the other player what they'd be famous for if they lived in another era.", category: "Compliment" },
  { text: "Describe the other player's energy in a room using exactly 10 words — make each one count.", category: "Compliment" },
  { text: "Write the most flattering fake headline about the other player as if they're famous.", category: "Compliment" },

  // ── CHALLENGES ────────────────────────────────────────────────
  { text: "Name 20 different countries in under 30 seconds. Go.", category: "Challenge" },
  { text: "Type an entire paragraph with your eyes completely closed and send it unedited.", category: "Challenge" },
  { text: "Count backwards from 50 to 1 in under 20 seconds. Out loud.", category: "Challenge" },
  { text: "Name 10 celebrities without any letter appearing in more than one name. Go.", category: "Challenge" },
  { text: "Create an acronym from your first name where each letter represents a true fact about you.", category: "Challenge" },
  { text: "Spell your full name backwards out loud, no pausing.", category: "Challenge" },
  { text: "Name 5 things in your room right now that are the same color, without looking first.", category: "Challenge" },
  { text: "Hum a song for the other person to guess. You have 15 seconds. No words allowed.", category: "Challenge" },
  { text: "Say a tongue twister 3 times fast and send a voice note as evidence.", category: "Challenge" },
  { text: "List 7 emotions using only facial expressions. The other player must name each one.", category: "Challenge" },
  { text: "Describe today's mood in exactly 5 words. No more, no fewer.", category: "Challenge" },
  { text: "Say a greeting in 5 different languages in under 20 seconds.", category: "Challenge" },
  { text: "Name 10 things you're grateful for right now in under 60 seconds.", category: "Challenge" },
  { text: "Write your signature as if you're a world-famous artist and photograph it.", category: "Challenge" },
  { text: "Name 3 items within reach that could theoretically be combined into a new invention.", category: "Challenge" },

  // ── SOCIAL / FUN ──────────────────────────────────────────────
  { text: "Share the most embarrassing item currently in your camera roll. No deletions first.", category: "Social" },
  { text: "Open your notes app and share the most inexplicable note you find there.", category: "Social" },
  { text: "Show your phone's most-listened-to artist right now without any shame.", category: "Social" },
  { text: "Send the other player a GIF that perfectly captures your energy right now.", category: "Social" },
  { text: "Describe the contents of your fridge as if it's a Michelin-star restaurant menu.", category: "Social" },
  { text: "Find the most inexplicable item in your room and give it a dramatic backstory.", category: "Social" },
  { text: "Open your fridge and photograph it. The other player rates it from 1-10 with full commentary.", category: "Social" },
  { text: "Share your current phone wallpaper and explain why you chose it.", category: "Social" },
  { text: "Show your current phone battery percentage. If under 30%, charge it right now.", category: "Social" },
  { text: "Share the last thing you searched on YouTube or Netflix without context.", category: "Social" },
  { text: "Find the nearest book and read the first sentence aloud in the most dramatic voice possible.", category: "Social" },
  { text: "Send a voice note describing your ideal Saturday as if it's a luxury travel brochure.", category: "Social" },
  { text: "Take a photo of your feet. Send it with a single-word caption.", category: "Social" },
  { text: "Find something in your room that's been there so long you've forgotten where it came from.", category: "Social" },
  { text: "Share the playlist or album you'd put on to fall asleep. No judgment allowed.", category: "Social" },

  // ── WILDCARD / CREATIVE ────────────────────────────────────────
  { text: "Invent a brand new holiday, name it, and explain exactly how it's celebrated.", category: "Wildcard" },
  { text: "Create a 3-step plan for world domination using only items currently in your room.", category: "Wildcard" },
  { text: "Design your ideal sandwich, name it something ridiculous, and describe it in full.", category: "Wildcard" },
  { text: "Invent a sport that could only realistically exist on the moon.", category: "Wildcard" },
  { text: "Create a fake law you think everyone should be required to follow.", category: "Wildcard" },
  { text: "Invent a new dance move, name it after yourself, and demonstrate it.", category: "Wildcard" },
  { text: "Design a superhero whose power is entirely, completely useless in every situation.", category: "Wildcard" },
  { text: "Create a conspiracy theory about something completely harmless and argue it convincingly.", category: "Wildcard" },
  { text: "Design a fragrance and give it the most dramatically poetic name possible.", category: "Wildcard" },
  { text: "Write a 3-word mission statement for your current life chapter.", category: "Wildcard" },
  { text: "Invent a new ice cream flavor, name it, and write its origin story.", category: "Wildcard" },
  { text: "Pitch a fake TV show concept in exactly 30 seconds. Make it sound incredible.", category: "Wildcard" },
  { text: "Write the most absurd, over-the-top motivational poster slogan.", category: "Wildcard" },
  { text: "Design a fake band, name them, name their debut album, and describe their sound.", category: "Wildcard" },
  { text: "Invent a new emoji that the world desperately needs and describe exactly when to use it.", category: "Wildcard" },

  // ── BONUS EXTRA ───────────────────────────────────────────────
  { text: "Do your best impression of the other player — personality, mannerisms, everything.", category: "Performance" },
  { text: "Tell the other player something you've been meaning to say but kept finding excuses not to.", category: "Compliment" },
  { text: "Recite a poem you remember from school in the most theatrical voice you have.", category: "Performance" },
  { text: "Describe your personality as a weather pattern — full meteorological explanation.", category: "Creative" },
  { text: "Send a voice note of you making up a bedtime story with the other player as the hero.", category: "Voice" },
  { text: "Do a dramatic monologue about why your favorite season is definitively the best season.", category: "Creative" },
  { text: "Create a fake app idea that would genuinely make your life easier and pitch it.", category: "Wildcard" },
  { text: "Describe the last dream you remember in the style of a movie synopsis.", category: "Creative" },
  { text: "Do your best impression of a tour guide showing someone around your room.", category: "Performance" },
  { text: "Tell a joke — if they don't laugh, you still have to take the dare and try again.", category: "Challenge" }
];

/* ─── Penalty Messages ───────────────────────────────────────── */
const PENALTY_MESSAGES = [
  "That's okay — honesty costs money! 😄",
  "The coward tax has been applied. 💸",
  "Brave souls answer. Wise souls pay. You're wise! 🤑",
  "The great dodge of the century! −10 EGP to pay.",
  "Some secrets are worth 10 pounds. 😏",
  "Skipped! The treasury grows richer.",
  "You'll have to make up for this one! 👀",
  "A classic escape move. 10 EGP noted.",
  "Running from the dare — a true art form. 💸"
];

/* ─── Game State ─────────────────────────────────────────────── */
let state = {
  playerYara:  { name: "Yara",  emoji: "🌸", debt: 0, completed: 0, skipped: 0 },
  playerAli:   { name: "Ali",   emoji: "⚡", debt: 0, completed: 0, skipped: 0 },
  currentTurn: "yara",           // "yara" | "ali"
  currentMode: "random",         // "random" | "truth" | "dare"
  round:       1,
  cardsPlayed: 0,
  currentCard: null,             // { type, text, category }
  cardActive:  false,
  usedQuestions: [],
  usedDares:     [],
  timerInterval: null,
  timerSeconds:  60,
};

/* ─── DOM References ─────────────────────────────────────────── */
const $ = id => document.getElementById(id);

const screens = {
  landing:  $('screen-landing'),
  setup:    $('screen-setup'),
  game:     $('screen-game'),
  results:  $('screen-results'),
};

/* ─── Screen Navigation ──────────────────────────────────────── */
let currentScreen = 'landing';

function showScreen(name) {
  const prev = screens[currentScreen];
  if (prev) {
    prev.classList.remove('active');
    prev.classList.add('exit-left');
    setTimeout(() => prev.classList.remove('exit-left'), 600);
  }
  currentScreen = name;
  const next = screens[name];
  next.classList.add('active');
  window.scrollTo(0, 0);
}

/* ─── Particle System ────────────────────────────────────────── */
function initParticles() {
  const container = $('particles-container');
  const symbols = ['♥', '✦', '♠', '✧', '★', '✿', '◆'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = (12 + Math.random() * 20) + 's';
    p.style.animationDelay = (Math.random() * 15) + 's';
    p.style.fontSize = (10 + Math.random() * 10) + 'px';
    p.style.color = Math.random() > 0.5 ? 'rgba(255,45,120,0.3)' : 'rgba(200,164,74,0.25)';
    container.appendChild(p);
  }
}

/* ─── Avatar Pickers ─────────────────────────────────────────── */
function initAvatarPickers() {
  document.querySelectorAll('#yara-avatar-picker span').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('#yara-avatar-picker span').forEach(s => s.classList.remove('selected'));
      el.classList.add('selected');
      $('yara-emoji').textContent = el.dataset.emoji;
      state.playerYara.emoji = el.dataset.emoji;
    });
  });

  document.querySelectorAll('#ali-avatar-picker span').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('#ali-avatar-picker span').forEach(s => s.classList.remove('selected'));
      el.classList.add('selected');
      $('ali-emoji').textContent = el.dataset.emoji;
      state.playerAli.emoji = el.dataset.emoji;
    });
  });
}

/* ─── Shuffle Array ──────────────────────────────────────────── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── Pick Random Card (No Repeats Until Exhausted) ──────────── */
function pickQuestion() {
  if (state.usedQuestions.length >= QUESTIONS.length) state.usedQuestions = [];
  const available = QUESTIONS.filter((_, i) => !state.usedQuestions.includes(i));
  const shuffled = shuffle(available);
  const idx = QUESTIONS.indexOf(shuffled[0]);
  state.usedQuestions.push(idx);
  return shuffled[0];
}

function pickDare() {
  if (state.usedDares.length >= DARES.length) state.usedDares = [];
  const available = DARES.filter((_, i) => !state.usedDares.includes(i));
  const shuffled = shuffle(available);
  const idx = DARES.indexOf(shuffled[0]);
  state.usedDares.push(idx);
  return shuffled[0];
}

function drawCard() {
  let type;
  if (state.currentMode === 'truth')  type = 'truth';
  else if (state.currentMode === 'dare') type = 'dare';
  else type = Math.random() < 0.5 ? 'truth' : 'dare';

  const data = type === 'truth' ? pickQuestion() : pickDare();
  return { type, text: data.text, category: data.category };
}

/* ─── Update Turn UI ─────────────────────────────────────────── */
function updateTurnUI() {
  const p = state.currentTurn === 'yara' ? state.playerYara : state.playerAli;
  const banner = $('turn-banner');

  $('turn-avatar').textContent = p.emoji;
  $('turn-name').textContent   = p.name;
  $('round-number').textContent = state.round;

  banner.classList.remove('yara-turn', 'ali-turn');
  banner.classList.add(state.currentTurn + '-turn');
}

/* ─── Update Scoreboard Numbers ──────────────────────────────── */
function updateScoreUI() {
  $('yara-debt').textContent = state.playerYara.debt;
  $('ali-debt').textContent  = state.playerAli.debt;

  $('yara-completed').textContent    = state.playerYara.completed;
  $('yara-skipped').textContent      = state.playerYara.skipped;
  $('yara-debt-display').textContent = state.playerYara.debt + ' EGP';
  $('ali-completed').textContent     = state.playerAli.completed;
  $('ali-skipped').textContent       = state.playerAli.skipped;
  $('ali-debt-display').textContent  = state.playerAli.debt + ' EGP';
  $('score-round').textContent       = state.round;
  $('score-total-cards').textContent = state.cardsPlayed;
}

/* ─── Timer ──────────────────────────────────────────────────── */
function startTimer() {
  stopTimer();
  state.timerSeconds = 60;
  const ring = $('timer-ring-fill');
  const text = $('timer-text');
  const circumference = 264;
  $('timer-section').classList.add('visible');

  ring.style.stroke = 'var(--pink-bright)';

  state.timerInterval = setInterval(() => {
    state.timerSeconds--;
    text.textContent = state.timerSeconds;
    const offset = circumference - (state.timerSeconds / 60) * circumference;
    ring.style.strokeDashoffset = offset;

    if (state.timerSeconds <= 15) ring.style.stroke = '#ff4444';
    else if (state.timerSeconds <= 30) ring.style.stroke = '#ffaa44';
    else ring.style.stroke = 'var(--pink-bright)';

    if (state.timerSeconds <= 0) {
      stopTimer();
      text.textContent = '⏰';
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timerInterval);
  state.timerInterval = null;
  $('timer-section').classList.remove('visible');
}

/* ─── Show Card ───────────────────────────────────────────────── */
function showCard(card) {
  const activeCard = $('active-card');
  const idleCard   = $('idle-card');
  const badge      = $('card-type-badge');
  const category   = $('card-category');
  const content    = $('card-content');
  const number     = $('card-number');

  // Hide idle, show active
  idleCard.classList.add('hidden');
  activeCard.classList.remove('hidden');

  // Set card styles
  activeCard.className = 'card active-card';
  activeCard.classList.add(card.type + '-card');
  activeCard.classList.add(state.currentTurn + '-active');

  // Set badge
  badge.textContent = card.type.toUpperCase();
  badge.className   = 'card-type-badge';
  badge.classList.add(card.type + '-badge');

  category.textContent = card.category;
  content.textContent  = card.text;
  number.textContent   = '#' + state.cardsPlayed;

  // Hide draw, show post
  $('action-buttons').classList.add('hidden');
  $('post-card-buttons').classList.remove('hidden');

  startTimer();
}

/* ─── Show Penalty Overlay ───────────────────────────────────── */
function showPenalty(playerName) {
  const msg = PENALTY_MESSAGES[Math.floor(Math.random() * PENALTY_MESSAGES.length)];
  $('penalty-message').textContent  = playerName + ' skipped their turn!';
  $('penalty-sub-text').textContent = msg;
  $('overlay-penalty').classList.remove('hidden');
}

/* ─── Show Transition Overlay ────────────────────────────────── */
function showTransition(nextPlayer) {
  $('transition-emoji').textContent  = nextPlayer.emoji;
  $('transition-name').textContent   = nextPlayer.name + "'s";
  $('transition-name-2').textContent = nextPlayer.name;
  $('overlay-transition').classList.remove('hidden');
}

/* ─── Switch Turn ────────────────────────────────────────────── */
function switchTurn() {
  if (state.currentTurn === 'yara') {
    state.currentTurn = 'ali';
    state.round++;
  } else {
    state.currentTurn = 'yara';
  }
  updateTurnUI();
}

/* ─── Reset Card Area ────────────────────────────────────────── */
function resetCardArea() {
  $('active-card').classList.add('hidden');
  $('idle-card').classList.remove('hidden');
  $('action-buttons').classList.remove('hidden');
  $('post-card-buttons').classList.add('hidden');
  state.cardActive = false;
  state.currentCard = null;
  stopTimer();
}

/* ─── Build Results Screen ───────────────────────────────────── */
function buildResults() {
  const y = state.playerYara;
  const a = state.playerAli;

  $('result-yara-emoji').textContent = y.emoji;
  $('result-yara-name').textContent  = y.name;
  $('result-ali-emoji').textContent  = a.emoji;
  $('result-ali-name').textContent   = a.name;

  $('res-yara-completed').textContent = y.completed;
  $('res-yara-skipped').textContent   = y.skipped;
  $('res-yara-debt').textContent      = y.debt + ' EGP';
  $('res-ali-completed').textContent  = a.completed;
  $('res-ali-skipped').textContent    = a.skipped;
  $('res-ali-debt').textContent       = a.debt + ' EGP';

  // Winner = fewer skips, or lower debt
  let winnerName = '—';
  if (y.skipped < a.skipped) winnerName = y.name;
  else if (a.skipped < y.skipped) winnerName = a.name;
  else if (y.debt < a.debt) winnerName = y.name;
  else if (a.debt < y.debt) winnerName = a.name;
  else winnerName = y.name + ' & ' + a.name;

  $('winner-name').textContent = winnerName;
  $('winner-text').textContent = y.debt === a.debt && y.skipped === a.skipped
    ? "It's a tie! Both players win 💖"
    : "The winner is...";

  launchConfetti();
}

/* ─── Confetti ───────────────────────────────────────────────── */
function launchConfetti() {
  const container = $('results-confetti');
  container.innerHTML = '';
  const colors = ['#ff2d78','#c8a44a','#ff6fa8','#e8185d','#e0bc6e','#ffffff'];

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.top = '-20px';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (1.5 + Math.random() * 3) + 's';
    piece.style.animationDelay = (Math.random() * 2) + 's';
    piece.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
    container.appendChild(piece);
  }
}

/* ─── Save / Load State ──────────────────────────────────────── */
function saveState() {
  try { localStorage.setItem('yva_state', JSON.stringify(state)); } catch(e) {}
}

function loadState() {
  try {
    const saved = localStorage.getItem('yva_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
      return true;
    }
  } catch(e) {}
  return false;
}

/* ─── Init Game (after setup) ────────────────────────────────── */
function initGame() {
  // Read player names
  state.playerYara.name = $('yara-name-input').value.trim() || 'Yara';
  state.playerAli.name  = $('ali-name-input').value.trim()  || 'Ali';

  // Reset scores
  state.playerYara.debt = 0; state.playerYara.completed = 0; state.playerYara.skipped = 0;
  state.playerAli.debt  = 0; state.playerAli.completed  = 0; state.playerAli.skipped  = 0;
  state.round = 1; state.cardsPlayed = 0; state.currentTurn = 'yara';
  state.usedQuestions = []; state.usedDares = [];

  // Update UI with names
  $('topbar-yara-name').textContent  = state.playerYara.name;
  $('topbar-ali-name').textContent   = state.playerAli.name;
  $('topbar-yara-emoji').textContent = state.playerYara.emoji;
  $('topbar-ali-emoji').textContent  = state.playerAli.emoji;
  $('score-yara-emoji').textContent  = state.playerYara.emoji;
  $('score-ali-emoji').textContent   = state.playerAli.emoji;
  $('score-yara-name').textContent   = state.playerYara.name;
  $('score-ali-name').textContent    = state.playerAli.name;

  updateTurnUI();
  updateScoreUI();
  resetCardArea();
  saveState();
}

/* ═══════════════════════════════════════════════════════════════
   EVENT LISTENERS
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initAvatarPickers();

  /* ── Landing → Setup ── */
  $('btn-start-landing').addEventListener('click', () => showScreen('setup'));

  /* ── Setup → Game ── */
  $('btn-back-setup').addEventListener('click', () => showScreen('landing'));

  $('btn-start-game').addEventListener('click', () => {
    initGame();
    showTransition(state.playerYara);
    // After transition player confirms, they'll see game screen
  });

  /* ── Mode Buttons ── */
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentMode = btn.dataset.mode;
    });
  });

  /* ── Draw Card ── */
  $('btn-draw').addEventListener('click', () => {
    state.currentCard = drawCard();
    state.cardsPlayed++;
    state.cardActive = true;
    showCard(state.currentCard);
    updateScoreUI();
    saveState();
  });

  /* ── Complete ── */
  $('btn-complete').addEventListener('click', () => {
    const p = state.currentTurn === 'yara' ? state.playerYara : state.playerAli;
    p.completed++;
    stopTimer();
    updateScoreUI();
    saveState();
    nextTurnFlow();
  });

  /* ── Penalty / Skip ── */
  $('btn-penalty').addEventListener('click', () => {
    const p = state.currentTurn === 'yara' ? state.playerYara : state.playerAli;
    p.skipped++;
    p.debt += 10;
    stopTimer();
    updateScoreUI();
    saveState();
    showPenalty(p.name);
  });

  /* ── Dismiss Penalty → Transition ── */
  $('btn-dismiss-penalty').addEventListener('click', () => {
    $('overlay-penalty').classList.add('hidden');
    nextTurnFlow();
  });

  /* ── Next Turn ── */
  $('btn-next').addEventListener('click', () => {
    stopTimer();
    nextTurnFlow();
  });

  /* ── Transition Ready ── */
  $('btn-ready').addEventListener('click', () => {
    $('overlay-transition').classList.add('hidden');
    showScreen('game');
    resetCardArea();
  });

  /* ── Scoreboard ── */
  $('btn-scoreboard').addEventListener('click', () => {
    updateScoreUI();
    $('overlay-scoreboard').classList.remove('hidden');
  });

  $('btn-close-scoreboard').addEventListener('click', () => {
    $('overlay-scoreboard').classList.add('hidden');
  });

  /* ── End Game from Scoreboard ── */
  $('btn-end-game').addEventListener('click', () => {
    $('overlay-scoreboard').classList.add('hidden');
    buildResults();
    showScreen('results');
  });

  /* ── Play Again ── */
  $('btn-play-again').addEventListener('click', () => {
    showScreen('setup');
  });

  /* ── Back to Home ── */
  $('btn-back-home').addEventListener('click', () => {
    showScreen('landing');
  });

  /* ── Close overlays on backdrop click ── */
  [$('overlay-scoreboard'), $('overlay-penalty'), $('overlay-transition')].forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.add('hidden');
    });
  });

  /* ── Auto-load saved game ── */
  // loadState(); // Uncomment to enable session persistence
});

/* ─── Next Turn Flow ─────────────────────────────────────────── */
function nextTurnFlow() {
  resetCardArea();
  switchTurn();
  const nextP = state.currentTurn === 'yara' ? state.playerYara : state.playerAli;
  showTransition(nextP);
}
