/**
 * Sample expert responses for testing
 */

export interface SampleResponse {
  expertId: string;
  expertName: string;
  model: string;
  output: string;
  confidence?: number;
}

export const SAMPLE_EXPERT_RESPONSES: SampleResponse[] = [
  {
    expertId: '1',
    expertName: 'Strategic Thinker',
    model: 'openai/gpt-4',
    output: `# Analysis of Neural Networks

Neural networks are computational models inspired by biological neural networks. 
They consist of interconnected nodes (neurons) organized in layers.

**Key Components:**
- Input layer: Receives raw data
- Hidden layers: Process and extract features
- Output layer: Produces predictions

**Advantages:**
- Pattern recognition capabilities
- Adaptability through training
- Handles complex non-linear relationships

**Confidence: 95%**`,
    confidence: 0.95,
  },
  {
    expertId: '2',
    expertName: 'Technical Expert',
    model: 'anthropic/claude-3-opus',
    output: `# Neural Network Technical Overview

From a technical perspective, neural networks use backpropagation 
for learning and gradient descent for optimization.

**Architecture Types:**
1. Feedforward networks (FFN)
2. Convolutional networks (CNN) - for images
3. Recurrent networks (RNN) - for sequences

**Training Process:**
- Initialize weights randomly
- Forward propagation
- Calculate loss
- Backpropagate errors
- Update weights

The mathematical foundation relies on linear algebra and calculus.

**Confidence: 90%**`,
    confidence: 0.90,
  },
  {
    expertId: '3',
    expertName: 'Practical Advisor',
    model: 'google/gemini-2.0-flash-001',
    output: `# Practical Neural Network Applications

Neural networks are used in many real-world applications:

**Popular Use Cases:**
- Image recognition (faces, objects)
- Natural language processing
- Speech recognition
- Autonomous vehicles
- Medical diagnosis

**Getting Started:**
- Use frameworks like TensorFlow or PyTorch
- Start with simple datasets (MNIST)
- Gradually increase complexity
- Monitor training metrics

**Confidence: 85%**`,
    confidence: 0.85,
  },
];

export const SAMPLE_CONFLICTING_RESPONSES: SampleResponse[] = [
  {
    expertId: '1',
    expertName: 'Expert A',
    model: 'openai/gpt-4',
    output: 'React is the best framework for web development due to its component-based architecture and large ecosystem.',
    confidence: 0.90,
  },
  {
    expertId: '2',
    expertName: 'Expert B',
    model: 'anthropic/claude-3-opus',
    output: 'Vue is superior to React because of its simpler learning curve and better documentation.',
    confidence: 0.85,
  },
  {
    expertId: '3',
    expertName: 'Expert C',
    model: 'google/gemini-2.0-flash-001',
    output: 'Svelte is the future of web development with its compile-time optimization and no virtual DOM.',
    confidence: 0.80,
  },
];

export const SAMPLE_LOW_QUALITY_RESPONSE: SampleResponse = {
  expertId: '4',
  expertName: 'Confused Expert',
  model: 'meta-llama/llama-3.1-8b',
  output: 'um i think neural networks are like computers that think maybe? not sure really',
  confidence: 0.30,
};

export const SAMPLE_CONSENSUS_RESPONSES: SampleResponse[] = [
  {
    expertId: '1',
    expertName: 'Expert A',
    model: 'openai/gpt-4',
    output: 'TypeScript is strongly typed JavaScript that compiles to plain JavaScript. Key benefits include type safety, better tooling, and improved code quality.',
    confidence: 0.95,
  },
  {
    expertId: '2',
    expertName: 'Expert B',
    model: 'anthropic/claude-3-opus',
    output: 'TypeScript provides static typing for JavaScript, which helps catch errors at compile time. It enhances developer productivity and code maintainability.',
    confidence: 0.92,
  },
  {
    expertId: '3',
    expertName: 'Expert C',
    model: 'google/gemini-2.0-flash-001',
    output: 'TypeScript adds optional static typing to JavaScript. This results in fewer runtime errors, better IDE support, and more maintainable codebases.',
    confidence: 0.90,
  },
];
