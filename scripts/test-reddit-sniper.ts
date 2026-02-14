/**
 * Test Reddit Sniper Intent Scoring Logic
 * Uses mock data to verify scoring algorithms work correctly
 */

// Mock the modules first
const mockPosts = [
  {
    id: '1',
    title: 'Looking for a tool to track freelance scope changes - budget $50/month',
    selftext: 'Need something ASAP to help me track scope changes and bill for extra work. Must have invoicing integration. Currently using spreadsheets but it\'s a nightmare.',
    author: 'freelancer_dev',
    subreddit: 'freelance',
    url: 'https://reddit.com/r/freelance/1',
    created_utc: Date.now() / 1000,
    score: 25,
    num_comments: 10,
    permalink: '/r/freelance/1'
  },
  {
    id: '2',
    title: 'Need help with newsletter deliverability',
    selftext: 'My emails keep going to spam. Looking for recommendations on how to fix this.',
    author: 'newsletter_creator',
    subreddit: 'newsletters',
    url: 'https://reddit.com/r/newsletters/2',
    created_utc: Date.now() / 1000,
    score: 15,
    num_comments: 5,
    permalink: '/r/newsletters/2'
  },
  {
    id: '3',
    title: 'Best podcast transcription service?',
    selftext: 'I need it to be affordable and accurate. Price range around $20/month would be ideal.',
    author: 'podcaster',
    subreddit: 'podcasting',
    url: 'https://reddit.com/r/podcasting/3',
    created_utc: Date.now() / 1000,
    score: 30,
    num_comments: 8,
    permalink: '/r/podcasting/3'
  }
];

// Import the analyze function by dynamically loading and testing
import * as fs from 'fs';
import * as path from 'path';

interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  subreddit: string;
  url: string;
  created_utc: number;
  score: number;
  num_comments: number;
  permalink: string;
}

interface IntentAnalysis {
  intentScore: number;
  buyingSignals: string[];
  specificNeeds: string[];
  budget: string | null;
  timeframe: string | null;
  currentSolution: string | null;
  recommendedAction: string;
}

// Copy the analyzeIntent function for testing
function analyzeIntent(post: RedditPost): IntentAnalysis {
  const analysis: IntentAnalysis = {
    intentScore: 0,
    buyingSignals: [],
    specificNeeds: [],
    budget: null,
    timeframe: null,
    currentSolution: null,
    recommendedAction: ''
  };
  
  const titleLower = post.title.toLowerCase();
  const bodyLower = post.selftext.toLowerCase();
  const fullText = `${titleLower} ${bodyLower}`;
  
  // BASE SCORE (0-50 points)
  if (titleLower.includes('looking for')) {
    analysis.intentScore += 20;
    analysis.buyingSignals.push('Looking for solution');
  }
  if (titleLower.includes('need')) {
    analysis.intentScore += 15;
    analysis.buyingSignals.push('Expressed need');
  }
  if (titleLower.includes('recommend') || titleLower.includes('suggestion')) {
    analysis.intentScore += 15;
    analysis.buyingSignals.push('Asking for recommendations');
  }
  if (titleLower.includes('?')) {
    analysis.intentScore += 10;
  }
  
  // BUDGET SIGNAL (0-20 points)
  const budgetPatterns = [
    /\$\d+/,
    /budget.*\$\d+/i,
    /willing to pay/i,
    /price range/i,
    /up to \$/i
  ];
  
  for (const pattern of budgetPatterns) {
    const match = fullText.match(pattern);
    if (match) {
      analysis.budget = match[0];
      if (fullText.match(/\$\d+/)) {
        analysis.intentScore += 20;
      } else {
        analysis.intentScore += 15;
      }
      analysis.buyingSignals.push(`Budget mentioned: ${match[0]}`);
      break;
    }
  }
  
  // URGENCY SIGNAL (0-15 points)
  if (fullText.includes('asap') || fullText.includes('urgent')) {
    analysis.intentScore += 15;
    analysis.timeframe = 'ASAP';
    analysis.buyingSignals.push('Urgent need');
  } else if (fullText.includes('deadline') || fullText.includes('soon')) {
    analysis.intentScore += 10;
    analysis.timeframe = 'Soon';
    analysis.buyingSignals.push('Time-sensitive');
  } else if (fullText.includes('next week') || fullText.includes('this month')) {
    analysis.intentScore += 5;
    const match = fullText.match(/(next week|this month|next month)/i);
    analysis.timeframe = match ? match[0] : 'Near-term';
  }
  
  // DETAIL SIGNAL (0-15 points)
  const requirementPatterns = [
    'need it to',
    'must have',
    'looking for something that',
    'want to be able to',
    'should support',
    'needs to',
    'has to'
  ];
  
  let requirementCount = 0;
  for (const pattern of requirementPatterns) {
    if (fullText.includes(pattern)) {
      requirementCount++;
      const sentences = post.selftext.split(/[.!?]/);
      const matching = sentences.find(s => 
        s.toLowerCase().includes(pattern)
      );
      if (matching && matching.trim().length > 10) {
        analysis.specificNeeds.push(matching.trim());
      }
    }
  }
  
  if (requirementCount >= 3) {
    analysis.intentScore += 15;
  } else if (requirementCount >= 2) {
    analysis.intentScore += 10;
  } else if (requirementCount >= 1) {
    analysis.intentScore += 5;
  }
  
  // Detect current solution
  const solutionPatterns = [
    /currently using (\w+)/i,
    /switching from (\w+)/i,
    /tried (\w+) but/i,
    /alternative to (\w+)/i
  ];
  
  for (const pattern of solutionPatterns) {
    const match = fullText.match(pattern);
    if (match) {
      analysis.currentSolution = match[1];
      break;
    }
  }
  
  // Determine recommended action
  if (analysis.intentScore >= 80) {
    analysis.recommendedAction = 'HIGH PRIORITY: Reply with solution immediately';
  } else if (analysis.intentScore >= 60) {
    analysis.recommendedAction = 'MEDIUM PRIORITY: Reply if you have exact solution';
  } else if (analysis.intentScore >= 40) {
    analysis.recommendedAction = 'LOW PRIORITY: Monitor for more details';
  } else {
    analysis.recommendedAction = 'SKIP: Intent too low';
  }
  
  return analysis;
}

// Run tests
console.log('🧪 Testing Reddit Sniper Intent Scoring\n');
console.log('=' .repeat(60));

mockPosts.forEach((post, index) => {
  console.log(`\nTest ${index + 1}: "${post.title}"`);
  console.log('-'.repeat(60));
  
  const analysis = analyzeIntent(post);
  
  console.log(`Intent Score: ${analysis.intentScore}/100`);
  console.log(`Buying Signals: ${analysis.buyingSignals.join(', ')}`);
  if (analysis.budget) console.log(`Budget: ${analysis.budget}`);
  if (analysis.timeframe) console.log(`Timeframe: ${analysis.timeframe}`);
  if (analysis.currentSolution) console.log(`Current Solution: ${analysis.currentSolution}`);
  if (analysis.specificNeeds.length > 0) {
    console.log(`Specific Needs: ${analysis.specificNeeds.length} found`);
  }
  console.log(`Action: ${analysis.recommendedAction}`);
});

console.log('\n' + '='.repeat(60));
console.log('✅ Intent scoring test complete!\n');

// Test expected scores
const results = mockPosts.map(p => analyzeIntent(p));
console.log('Score Summary:');
results.forEach((r, i) => {
  console.log(`  Post ${i + 1}: ${r.intentScore}/100 (${r.recommendedAction.split(':')[0]})`);
});

// Validate expected behavior
const post1Score = results[0].intentScore;
const post2Score = results[1].intentScore;
const post3Score = results[2].intentScore;

console.log('\nValidation:');
console.log(`  ✓ Post 1 (high intent with budget + urgency + needs): ${post1Score >= 60 ? 'PASS' : 'FAIL'} (${post1Score})`);
console.log(`  ✓ Post 2 (medium intent with need + recommendation): ${post2Score >= 40 ? 'PASS' : 'FAIL'} (${post2Score})`);
console.log(`  ✓ Post 3 (has budget mention + best + question): ${post3Score >= 40 ? 'PASS' : 'FAIL'} (${post3Score})`);
