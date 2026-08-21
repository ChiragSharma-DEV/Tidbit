export const DEFAULT_CURRICULA = [
  {
    nicheId: 'ai',
    title: 'Artificial Intelligence',
    nodes: [
      {
        id: 'ai-node-1',
        title: 'Basics of AI & Turing Test',
        description: 'Understand the founding principles of artificial intelligence and how we define machine thinking.',
        estimatedTime: 5,
        cards: [
          {
            id: 'ai-card-1-1',
            conceptKey: 'ai_turing_test',
            variants: {
              short: {
                headline: 'The Turing Test: Can Machines Think?',
                summary: 'Proposed by Alan Turing in 1950, it evaluates if a computer can imitate human conversation so well that a human judge cannot tell them apart.',
                takeaway: 'Focuses on behavioral simulation rather than actual consciousness.',
              },
              medium: {
                summary: 'The Turing Test measures machine intelligence through behavioral mimicry.',
                explanation: 'Alan Turing bypassed the philosophical question "Can machines think?" by proposing the "Imitation Game". A judge chats textually with a human and a computer. If the judge cannot reliably tell them apart, the machine passes.',
                bullets: [
                  'Introduced in Alan Turing\'s 1950 paper "Computing Machinery and Intelligence".',
                  'Funnels intelligence into linguistic capability.',
                  'Criticized by John Searle\'s Chinese Room argument.',
                ],
                example: 'Modern chatbots like ChatGPT frequently pass informal Turing tests, but still lack genuine subjective understanding.',
              },
              long: {
                title: 'The Turing Test & The Philosophy of Machine Minds',
                introduction: 'Can a machine truly think, or does it merely simulate thought? This question lies at the heart of Alan Turing\'s famous test.',
                content: `In 1950, Alan Turing published "Computing Machinery and Intelligence," introducing the Imitation Game. Rather than arguing definitions of "thinking," Turing proposed a pragmatic test: if a machine could converse so naturally that a human judge could not distinguish it from a real human, it possesses intelligence.

The test ignores the inner workings of the computer—it does not matter if the computer is conscious or just manipulating symbols. This functionalist view has sparked decades of debate. The most famous rebuttal is John Searle's "Chinese Room" argument, which asserts that symbol manipulation is not understanding. If a person in a room uses a rulebook to translate Chinese, they simulate understanding Chinese without actually comprehending a single word.`,
                takeaways: [
                  'Turing replaced the abstract question of "thinking" with a concrete conversational test.',
                  'Searle\'s Chinese Room argument distinguishes syntax (rules) from semantics (meaning).',
                  'Modern AI exhibits high syntactic fluency, renewing debates on machine cognition.',
                ],
              },
            },
          },
          {
            id: 'ai-card-1-2',
            conceptKey: 'ai_definition',
            variants: {
              short: {
                headline: 'Defining AI: Weak vs. Strong AI',
                summary: 'Weak AI is built to excel at specific tasks (e.g., chess, search), while Strong AI (AGI) aims for human-level general intelligence.',
                takeaway: 'All modern AI is Weak (Narrow) AI.',
              },
              medium: {
                summary: 'Artificial Intelligence is split into Narrow (Weak) and General (Strong) paradigms.',
                explanation: 'Narrow AI is highly optimized for a single problem, like facial recognition or web search. General AI (AGI) refers to machines capable of learning, reasoning, and executing any cognitive task a human can.',
                bullets: [
                  'Narrow AI: Excel at one task, fails at others.',
                  'Strong AI/AGI: Transferable knowledge across domains.',
                  'Superintelligence (ASI): Surpasses human intellect globally.',
                ],
                example: 'AlphaGo is a spectacular narrow AI. It dominates Go but cannot write a simple email or drive a car.',
              },
              long: {
                title: 'Weak vs. Strong AI: The Spectrum of Intelligence',
                introduction: 'When we talk about artificial intelligence, we often conflate specialized algorithms with science-fiction robots.',
                content: `Computer scientists categorize AI into two main categories:
1. Narrow AI (Weak AI): These systems are designed and trained for a specific task. They utilize statistics and pattern recognition to automate complex actions, from translating text to diagnosing medical images. They do not have self-awareness or generalized problem-solving skills.
2. Artificial General Intelligence (AGI or Strong AI): This is a hypothetical system that possesses the capacity to understand, learn, and apply knowledge across diverse fields, adapting to new environments just like a human.

Currently, every AI system in existence is Narrow AI. While Large Language Models appear general because they write code, compose poetry, and solve math problems, they are fundamentally next-token predictors trained on text, lacking general cognitive reasoning.`,
                takeaways: [
                  'Narrow AI is task-specific; General AI (AGI) is domain-flexible.',
                  'All current technologies (neural networks, transformers) fall under Narrow AI.',
                  'AGI remains an active, highly debated research target.',
                ],
              },
            },
          },
        ],
      },
      {
        id: 'ai-node-2',
        title: 'Introduction to Machine Learning',
        description: 'Transition from rule-based programming to data-driven learning paradigms.',
        estimatedTime: 8,
        cards: [
          {
            id: 'ai-card-2-1',
            conceptKey: 'ai_supervised_learning',
            variants: {
              short: {
                headline: 'Supervised Learning: Learning with Labels',
                summary: 'The algorithm learns a mapping from inputs to outputs using historical training data that is already labeled.',
                takeaway: 'Inputs are mapped to known targets (e.g., Spam vs. Not Spam).',
              },
              medium: {
                summary: 'Supervised learning trains models on labeled input-output pairs.',
                explanation: 'A model is fed features (X) alongside labels (Y). By minimizing the difference between its predictions and the actual labels (loss), the model learns a general function that can predict labels for new, unseen inputs.',
                bullets: [
                  'Requires labeled training datasets.',
                  'Classification: Predicting discrete classes (e.g., cat vs. dog).',
                  'Regression: Predicting continuous values (e.g., house prices).',
                ],
                example: 'A model trained on thousands of labeled email samples to classify incoming messages as "Inbox" or "Spam".',
              },
              long: {
                title: 'Supervised Learning: Foundations and Algorithms',
                introduction: 'Supervised learning is the workhorse of modern business analytics, mapping inputs to targets with high precision.',
                content: `In supervised learning, we assume the existence of a dataset containing features and corresponding target labels. The goal is to learn a mapping function f(x) = y.
Common algorithms include:
- Linear Regression: Fits a line to predict numeric values.
- Logistic Regression: Predicts probabilities for binary outcomes.
- Decision Trees & Random Forests: Split data based on feature thresholds.
- Support Vector Machines: Draw optimal boundaries between classes.

The bottleneck of supervised learning is the creation of labeled data, which often requires manual annotation by human experts.`,
                takeaways: [
                  'Supervised learning maps input features to predefined labels.',
                  'It consists of two main types: Classification (discrete) and Regression (continuous).',
                  'Label acquisition is the primary constraint and cost.',
                ],
              },
            },
          },
          {
            id: 'ai-card-2-2',
            conceptKey: 'ai_unsupervised_learning',
            variants: {
              short: {
                headline: 'Unsupervised Learning: Finding Hidden Patterns',
                summary: 'Algorithms analyze unlabeled data to discover underlying structures, clusters, or associations on their own.',
                takeaway: 'No teacher or labels are provided (e.g., customer segmentation).',
              },
              medium: {
                summary: 'Unsupervised learning uncovers hidden structures in unlabeled datasets.',
                explanation: 'Unlike supervised learning, the model is only given inputs (X) with no target outputs. The algorithm attempts to group similar items together or reduce dimensionality to reveal underlying patterns.',
                bullets: [
                  'Operates on raw, unlabeled datasets.',
                  'Clustering: Grouping data points (e.g., K-Means).',
                  'Dimensionality Reduction: Compressing features (e.g., PCA).',
                ],
                example: 'An e-commerce system grouping customers into distinct personas based on shopping habits without manual rules.',
              },
              long: {
                title: 'Unsupervised Learning & Clustering Algorithms',
                introduction: 'How do machines make sense of data when there are no right answers? Unsupervised learning solves this by clustering.',
                content: `Without labels, supervised classification is impossible. Unsupervised learning steps in to find structure.
The most common task is Clustering. In K-Means clustering, the algorithm divides data into K groups based on proximity in feature space. Another critical task is Dimensionality Reduction, such as Principal Component Analysis (PCA). PCA compresses datasets with hundreds of features down to a few principal dimensions while preserving variance, making data visualization and model training easier.`,
                takeaways: [
                  'Unsupervised learning works without human-provided labels.',
                  'Clustering groups similar points; dimensionality reduction compresses features.',
                  'Essential for exploratory data analysis and recommendations.',
                ],
              },
            },
          },
        ],
      },
      {
        id: 'ai-node-3',
        title: 'Deep Learning & Neural Networks',
        description: 'Explore the biological inspiration behind deep neural architectures.',
        estimatedTime: 10,
        cards: [
          {
            id: 'ai-card-3-1',
            conceptKey: 'ai_neural_networks',
            variants: {
              short: {
                headline: 'Neural Networks: Mimicking the Brain',
                summary: 'Layered mathematical networks of nodes (neurons) that process inputs, apply weights, and pass signals through activation functions.',
                takeaway: 'Composed of input, hidden, and output layers.',
              },
              medium: {
                summary: 'Artificial Neural Networks are computational models inspired by biological brain structures.',
                explanation: 'Inputs are multiplied by weights, summed together, added to a bias, and fed into an activation function (like ReLU) to decide if the neuron fires. Modern networks stack many "hidden" layers of these neurons to learn highly non-linear relationships.',
                bullets: [
                  'Neurons: Basic processing nodes.',
                  'Weights & Biases: Parameters adjusted during training.',
                  'Activation Functions: Inject non-linearity into predictions.',
                ],
                example: 'Sigmoid or ReLU functions converting linear sums into non-linear signals, enabling the network to learn complex curves.',
              },
              long: {
                title: 'Deep Neural Networks: Anatomy & Feedforward Propagation',
                introduction: 'Deep learning is neural networks with multiple hidden layers, enabling hierarchical feature learning.',
                content: `An Artificial Neural Network (ANN) consists of connected nodes:
- Input Layer: Receives raw features (e.g., pixels).
- Hidden Layers: Extract abstract features.
- Output Layer: Delivers the final prediction.

Each node computes: z = sum(weight * input) + bias. To prevent the entire network from collapsing into a simple linear equation, we pass z through a non-linear Activation Function, such as the Rectified Linear Unit (ReLU), defined as f(z) = max(0, z). Through backpropagation and gradient descent, the network calculates errors and adjusts weights backward from output to input.`,
                takeaways: [
                  'Neural networks stack nodes in layers to calculate complex math functions.',
                  'Activation functions (like ReLU) enable networks to learn non-linear patterns.',
                  'Backpropagation updates network weights based on output errors.',
                ],
              },
            },
          },
        ],
      },
      {
        id: 'ai-node-4',
        title: 'Large Language Models & Transformers',
        description: 'Investigate the revolutionary attention mechanism that powers modern generative AI.',
        estimatedTime: 12,
        cards: [
          {
            id: 'ai-card-4-1',
            conceptKey: 'ai_transformers_attention',
            variants: {
              short: {
                headline: 'The Transformer & Attention Mechanism',
                summary: 'Transformers process all words in a sentence simultaneously using self-attention to calculate how words relate to each other.',
                takeaway: 'Replaced sequential processing (RNNs) for massive speedups.',
              },
              medium: {
                summary: 'Transformers revolutionized NLP by replacing recurrent processing with parallel self-attention.',
                explanation: 'Introduced in the 2017 paper "Attention Is All You Need", the architecture processes whole sentences at once. The self-attention mechanism lets words look at every other word in the text to establish context (e.g., mapping "it" to "dog" or "bank" to "river").',
                bullets: [
                  'Self-Attention: Dynamic weight calculation between words.',
                  'Positional Encoding: Tracks word order without recurrence.',
                  'Parallelization: Enables training on massive GPU clusters.',
                ],
                example: 'In "The bank of the river," the word "bank" links to "river" instead of a financial institution using attention weights.',
              },
              long: {
                title: 'Transformers: Self-Attention and Generative AI',
                introduction: 'Modern LLMs like GPT-4 and Claude exist because of a single breakthrough architecture: the Transformer.',
                content: `Before 2017, language models processed text word-by-word sequentially (using RNNs or LSTMs). This was slow and struggled with long sentences. The Transformer architecture solved this using Self-Attention.
Self-attention maps input tokens to Queries (Q), Keys (K), and Values (V). By calculating dot-products of Q and K, the model determines how much attention word A should pay to word B. Positional Encodings are added to the input embeddings to preserve word ordering. This design allows models to be trained on internet-scale corpora in parallel.`,
                takeaways: [
                  'Transformers process words in parallel, speeding up training.',
                  'Self-Attention calculates relationships between all words in a sequence.',
                  'It forms the structural basis of all state-of-the-art LLMs.',
                ],
              },
            },
          },
        ],
      },
    ],
  },
  {
    nicheId: 'psychology',
    title: 'Psychology',
    nodes: [
      {
        id: 'psych-node-1',
        title: 'Foundations of Psychology',
        description: 'Explore the birth of psychology as a science and its core historical perspectives.',
        estimatedTime: 5,
        cards: [
          {
            id: 'psych-card-1-1',
            conceptKey: 'psych_foundations',
            variants: {
              short: {
                headline: 'The Birth of Psychology: Wundt\'s Lab',
                summary: 'Psychology split from philosophy in 1879 when Wilhelm Wundt established the first experimental laboratory in Leipzig, Germany.',
                takeaway: 'Shifted studying the mind from speculation to measurement.',
              },
              medium: {
                summary: 'Wilhelm Wundt founded experimental psychology using introspection.',
                explanation: 'By founding his laboratory in 1879, Wundt established psychology as a separate academic discipline. He used "structuralism" and systematic introspection, where trained subjects described conscious experiences in response to stimuli.',
                bullets: [
                  '1879: First psychology laboratory established.',
                  'Introspection: Examining one\'s own conscious thoughts.',
                  'Structuralism: Breaking down mental processes into basic components.',
                ],
                example: 'Metronome experiments where Wundt measured reaction times to auditory clicks to quantify conscious processing speed.',
              },
              long: {
                title: 'From Philosophy to Science: Wilhelm Wundt & Structuralism',
                introduction: 'For centuries, studying the human mind was the domain of philosophy. That changed in 1879.',
                content: `Wilhelm Wundt is widely regarded as the father of psychology. In Leipzig, Germany, he established a lab dedicated to researching human consciousness.
Wundt\'s approach was Structuralism—the attempt to catalog the basic structural elements of the mind. He relied on Introspection, a method where observers were exposed to sensory stimuli (like a color or sound) and asked to describe their immediate subjective feelings, thoughts, and sensations. Although introspection was later criticized as too subjective, Wundt\'s scientific methods laid the foundation for modern empirical psychology.`,
                takeaways: [
                  'Wundt made psychology a quantitative, empirical science in 1879.',
                  'Structuralism aimed to break down consciousness into basic sensory pieces.',
                  'Introspection paved the way, but lacked objective consistency.',
                ],
              },
            },
          },
        ],
      },
      {
        id: 'psych-node-2',
        title: 'Cognitive Psychology & Biases',
        description: 'Understand how the brain processes information, makes decisions, and falls into cognitive traps.',
        estimatedTime: 6,
        cards: [
          {
            id: 'psych-card-2-1',
            conceptKey: 'psych_heuristics',
            variants: {
              short: {
                headline: 'Heuristics: Mental Shortcuts',
                summary: 'Heuristics are cognitive shortcuts that help us make decisions quickly, but can lead to systematic errors (cognitive biases).',
                takeaway: 'Trading accuracy for speed to prevent decision fatigue.',
              },
              medium: {
                summary: 'Heuristics are mental rules-of-thumb that speed up decision-making.',
                explanation: 'Coined by Herbert Simon and expanded by Daniel Kahneman and Amos Tversky, heuristics help us navigate a complex world without exhausting mental energy. However, they cause systematic deviations from logic, known as cognitive biases.',
                bullets: [
                  'Availability Heuristic: Judging probability by how easily examples come to mind.',
                  'Representativeness Heuristic: Matching scenarios to mental stereotypes.',
                  'Anchoring Bias: Over-relying on the first piece of information received.',
                ],
                example: 'Fearing a shark attack more than a car accident because shark attacks receive dramatic news coverage (Availability).',
              },
              long: {
                title: 'Heuristics and Biases: How Our Brain Cuts Corners',
                introduction: 'We like to think of ourselves as rational decision-makers, but our brains are built for efficiency, not perfect logic.',
                content: `Daniel Kahneman and Amos Tversky revolutionized psychology by demonstrating that human judgment relies on heuristics—simple rules of thumb.
While heuristics are useful survival mechanisms, they lead to predictable errors:
- Availability Heuristic: If you can easily recall an event (e.g. plane crash), you overestimate its frequency.
- Anchoring Bias: When negotiating a salary, the first number spoken (the anchor) heavily biases all subsequent counter-offers, even if that number is completely arbitrary.
- Confirmation Bias: The tendency to search for, interpret, and recall information in a way that confirms your pre-existing beliefs.`,
                takeaways: [
                  'Heuristics are efficient cognitive shortcuts.',
                  'Biases are the systematic errors caused by those shortcuts.',
                  'Understanding these traps helps improve logical reasoning.',
                ],
              },
            },
          },
        ],
      },
    ],
  },
  {
    nicheId: 'marketing',
    title: 'Marketing',
    nodes: [
      {
        id: 'mktg-node-1',
        title: 'Marketing Fundamentals',
        description: 'Learn the core strategies, audience mappings, and classic frameworks of marketing.',
        estimatedTime: 5,
        cards: [
          {
            id: 'mktg-card-1-1',
            conceptKey: 'mktg_four_ps',
            variants: {
              short: {
                headline: 'The 4 Ps of the Marketing Mix',
                summary: 'A foundational framework consisting of Product, Price, Place, and Promotion to design a comprehensive market strategy.',
                takeaway: 'Aligning these four elements is essential for market fit.',
              },
              medium: {
                summary: 'The Marketing Mix (4 Ps) outlines the variables sellers control to satisfy buyers.',
                explanation: 'Developed by E. Jerome McCarthy in 1960, the 4 Ps are: Product (what is sold), Price (cost to buyer), Place (where it is distributed), and Promotion (how it is communicated). A successful campaign must balance all four parameters.',
                bullets: [
                  'Product: Features, design, branding, packaging.',
                  'Price: Strategy, discounts, subscription vs. outright purchase.',
                  'Place: Channels, inventory, logistics, retail vs. e-commerce.',
                  'Promotion: Advertising, PR, sales promotions, social media.',
                ],
                example: 'Apple positioning its Product as premium, Pricing it high, selling it in luxury Places (Apple Stores), and Promoting via high-production keynote events.',
              },
              long: {
                title: 'The 4 Ps of Marketing: A Comprehensive Deep Dive',
                introduction: 'No marketing campaign succeeds on advertising alone. A business must coordinate Product, Price, Place, and Promotion.',
                content: `The 4 Ps framework helps marketers align their value proposition with consumer demand:
1. Product: What are you selling? It must solve a specific customer problem.
2. Price: How much does it cost? Your pricing strategy determines positioning (premium vs. budget) and profit margins.
3. Place: Where do customers buy it? Distribution channels could be direct-to-consumer (D2C) online, retail stores, or third-party marketplaces.
4. Promotion: How do they find out about it? This includes advertising, PR, content marketing, and influencer partnerships.

For example, a luxury watch brand must ensure its Price is high to match premium quality, it is sold in high-end boutiques (Place), and promoted in yachting magazines rather than discount stores.`,
                takeaways: [
                  'The 4 Ps ensure a cohesive brand experience.',
                  'Marketers must align all four variables with customer expectations.',
                  'Failing to balance them (e.g. high price, low-quality distribution) breaks consumer trust.',
                ],
              },
            },
          },
        ],
      },
      {
        id: 'mktg-node-2',
        title: 'Digital Marketing & Acquisition',
        description: 'Understand modern acquisition channels, search engines, and optimization loops.',
        estimatedTime: 6,
        cards: [
          {
            id: 'mktg-card-2-1',
            conceptKey: 'mktg_seo_basics',
            variants: {
              short: {
                headline: 'SEO vs. SEM: Search Engine Marketing',
                summary: 'SEO focuses on organic traffic via search engine optimization, while SEM utilizes paid ads (PPC) to buy visibility.',
                takeaway: 'SEO is long-term and free; SEM is short-term and pay-to-play.',
              },
              medium: {
                summary: 'Search traffic is captured organically (SEO) or through paid listings (SEM).',
                explanation: 'Search Engine Optimization (SEO) involves tweaking website structure and content so search engines rank it naturally. Search Engine Marketing (SEM) involves bidding on keywords so search engines show your page as sponsored ads.',
                bullets: [
                  'SEO: High authority, slow results, compound traffic value.',
                  'SEM: Instant visibility, high cost-per-click, stops immediately when budget ends.',
                  'Keywords: The core search phrases users type.',
                ],
                example: 'Bidding on "best running shoes" via Google Ads (SEM) vs. writing a comprehensive blog post comparing running shoes that ranks organically (SEO).',
              },
              long: {
                title: 'SEO vs. SEM: Structuring a Search Acquisition Strategy',
                introduction: 'When users search Google, how do you ensure they click on your business rather than your competitors?',
                content: `Search engine marketing is divided into two disciplines:
1. Search Engine Optimization (SEO): The process of optimizing your website to rank higher in organic search results. It involves on-page optimization (high-quality content, keywords, fast load times) and off-page optimization (acquiring high-quality backlinks from other websites).
2. Search Engine Marketing (SEM): Using paid advertising platforms like Google Ads to display sponsored results at the top of search engine results pages. You bid on keywords and pay only when a user clicks (Pay-Per-Click / PPC).

The ideal strategy combines both: using SEM to acquire customers immediately for high-intent keywords, while investing in SEO to build a sustainable flow of organic traffic over time.`,
                takeaways: [
                  'SEO builds authority and long-term organic equity.',
                  'SEM yields immediate traffic but requires ongoing ad spend.',
                  'A balanced strategy uses SEM to bridge the gap while SEO scales.',
                ],
              },
            },
          },
        ],
      },
    ],
  },
];
