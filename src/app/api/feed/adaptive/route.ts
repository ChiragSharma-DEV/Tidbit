import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import connectDB from '@/lib/db/mongoose';
import Course from '@/lib/db/models/Course';
import Chapter from '@/lib/db/models/Chapter';
import Module from '@/lib/db/models/Module';
import FeedCard from '@/lib/db/models/FeedCard';
import { generateTriVariantFeedCard } from '@/lib/ai/feedGenerator';
import { ApiResponse, StaminaGate } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const gate = (searchParams.get('gate') || 'short') as StaminaGate;

    if (!courseId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if feed cards already exist for this course
    let cards = await FeedCard.find({ courseId }).sort({ order: 1 });

    // If no cards exist, generate them dynamically from course content
    if (!cards || cards.length === 0) {
      const course = await Course.findById(courseId).lean();
      if (!course) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Course not found' },
          { status: 404 }
        );
      }

      // Fetch chapters in order
      const chapters = await Chapter.find({ courseId }).sort({ order: 1 }).lean();
      const chapterIds = chapters.map(c => c._id);

      // Fetch modules for these chapters in order
      const modules = await Module.find({ chapterId: { $in: chapterIds } }).sort({ order: 1 }).lean();

      if (modules.length === 0) {
        return NextResponse.json<ApiResponse>({
          success: true,
          data: [],
          message: 'No modules found in this course to generate feed cards.',
        });
      }

      // Generate cards for the modules (limit to first 10 modules for performance/cost during demo)
      const modulesToGenerate = modules.slice(0, 10);
      const generatedCards = [];

      for (let i = 0; i < modulesToGenerate.length; i++) {
        const mod = modulesToGenerate[i];
        try {
          const variants = await generateTriVariantFeedCard(
            course.title,
            mod.title,
            mod.content
          );

          const newCard = await FeedCard.create({
            courseId,
            conceptKey: `concept_${mod._id}`,
            order: i + 1,
            variants,
          });

          generatedCards.push(newCard);
        } catch (err) {
          console.error(`Error generating feed card for module ${mod.title}:`, err);
        }
      }

      cards = generatedCards;
    }

    // Project based on the currentGate/gate query param
    const projectedCards = cards.map((card) => {
      const variants = card.variants;
      const content = variants[gate] || variants.short; // fallback to short if undefined
      const activeRecallQuiz = card.activeRecallQuiz || getQuizForConcept(card.conceptKey, card.order);
      return {
        _id: card._id,
        courseId: card.courseId,
        conceptKey: card.conceptKey,
        order: card.order,
        gate,
        content,
        activeRecallQuiz,
      };
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: projectedCards,
    });
  } catch (error) {
    console.error('Error in adaptive feed API route:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to retrieve adaptive feed cards' },
      { status: 500 }
    );
  }
}

function getQuizForConcept(conceptKey: string, cardOrder: number): any {
  const quizzes: Record<string, any> = {
    ai_turing_test: {
      question: "Which of the following is true about the Turing Test proposed by Alan Turing in 1950?",
      options: [
        { id: "a", text: "It measures machine intelligence based on behavioral simulation rather than consciousness.", isCorrect: true },
        { id: "b", text: "It requires the machine to have a physical human-like robotic body.", isCorrect: false },
        { id: "c", text: "It is widely accepted as proof of genuine subjective consciousness.", isCorrect: false },
        { id: "d", text: "It tests mathematical computing speed and logic gates directly.", isCorrect: false }
      ],
      refresherCard: {
        title: "Refresher: The Turing Test",
        summary: "The Turing Test measures machine intelligence through text-based behavioral mimicry. If a human judge cannot tell the machine apart from a human, it passes.",
        keyTakeaway: "The test focuses on behavioral capability rather than conscious understanding (syntax vs semantics).",
        bulletPoints: [
          "First introduced in Alan Turing's 1950 paper.",
          "Does not test inner consciousness or biological processes.",
          "Criticized by John Searle's Chinese Room argument."
        ]
      }
    },
    ai_definition: {
      question: "What is the primary difference between Weak (Narrow) AI and Strong AI (AGI)?",
      options: [
        { id: "a", text: "Weak AI operates on simple databases, while Strong AI uses complex neural networks.", isCorrect: false },
        { id: "b", text: "Weak AI is designed for specific tasks, whereas Strong AI aims for domain-flexible, human-level general intelligence.", isCorrect: true },
        { id: "c", text: "Weak AI runs on local CPUs, while Strong AI requires specialized cloud GPUs.", isCorrect: false },
        { id: "d", text: "All current AI models in existence are considered Strong AI.", isCorrect: false }
      ],
      refresherCard: {
        title: "Refresher: Weak vs. Strong AI",
        summary: "Weak (Narrow) AI excels at specific tasks (like chess or translation) but lacks general problem-solving. Strong AI (AGI) possesses general, transferable cognitive abilities.",
        keyTakeaway: "Every existing AI system today is Narrow (Weak) AI.",
        bulletPoints: [
          "Narrow AI fails outside its highly optimized domain.",
          "AGI remains a hypothetical, highly researched target.",
          "Large language models (LLMs) are next-token predictors, not general reasoning minds."
        ]
      }
    },
    ai_supervised_learning: {
      question: "What is the key defining characteristic of Supervised Learning?",
      options: [
        { id: "a", text: "The algorithm learns using unlabeled, unstructured data on its own.", isCorrect: false },
        { id: "b", text: "A human programmer writes rule-based if/else statements for all scenarios.", isCorrect: false },
        { id: "c", text: "The algorithm maps inputs to outputs using historical labeled training data.", isCorrect: true },
        { id: "d", text: "It requires active feedback loops from live game environments.", isCorrect: false }
      ],
      refresherCard: {
        title: "Refresher: Supervised Learning",
        summary: "Supervised learning trains a model on historical, labeled input-output pairs to learn a mapping function f(x) = y.",
        keyTakeaway: "Requires labeled datasets. Consists of Classification (discrete classes) and Regression (continuous values).",
        bulletPoints: [
          "Primary cost is acquiring high-quality labeled datasets.",
          "Goal is to predict labels accurately for new, unseen features."
        ]
      }
    },
    ai_unsupervised_learning: {
      question: "Which task is commonly performed using Unsupervised Learning?",
      options: [
        { id: "a", text: "Clustering unlabeled data points into groups based on feature proximity.", isCorrect: true },
        { id: "b", text: "Predicting continuous housing prices based on labeled historical sales.", isCorrect: false },
        { id: "c", text: "Classifying incoming emails as Spam or Not Spam.", isCorrect: false },
        { id: "d", text: "Updating game agent policies through reinforcement rewards.", isCorrect: false }
      ],
      refresherCard: {
        title: "Refresher: Unsupervised Learning",
        summary: "Unsupervised learning uncovers patterns or structures (like clustering or dimensionality reduction) in unlabeled datasets.",
        keyTakeaway: "Finds hidden structures without predefined human labels.",
        bulletPoints: [
          "K-Means clustering divides data into groups based on similarity.",
          "Principal Component Analysis (PCA) reduces feature dimensions.",
          "Essential for exploratory data analysis and customer segmentation."
        ]
      }
    },
    ai_neural_networks: {
      question: "Why do artificial neural networks use non-linear activation functions (like ReLU)?",
      options: [
        { id: "a", text: "To prevent the network from collapsing into a simple linear equation.", isCorrect: true },
        { id: "b", text: "To speed up the flow of data through input layers.", isCorrect: false },
        { id: "c", text: "To convert analog signals into digital binary outputs.", isCorrect: false },
        { id: "d", text: "To store intermediate variables in database caches.", isCorrect: false }
      ],
      refresherCard: {
        title: "Refresher: Neural Networks",
        summary: "Neural networks stack input, hidden, and output layers of processing nodes. Nodes multiply inputs by weights, add bias, and apply activation functions.",
        keyTakeaway: "Activation functions inject non-linearity, enabling learning of complex relationships.",
        bulletPoints: [
          "A node calculates z = sum(w * x) + b.",
          "ReLU function f(z) = max(0, z) is the most common activation.",
          "Backpropagation updates weights based on errors."
        ]
      }
    },
    ai_transformers_attention: {
      question: "How did the Transformer architecture solve sequence length bottlenecks in NLP?",
      options: [
        { id: "a", text: "By using recurrent loops to process words one-by-one sequentially.", isCorrect: false },
        { id: "b", text: "By discarding token embeddings and using raw text strings directly.", isCorrect: false },
        { id: "c", text: "By using self-attention to process all words in parallel and establish context.", isCorrect: true },
        { id: "d", text: "By running on specialized desktop CPUs instead of server clusters.", isCorrect: false }
      ],
      refresherCard: {
        title: "Refresher: Transformers & Attention",
        summary: "Transformers process words in parallel using self-attention to calculate contextual relationships between all words in a sentence.",
        keyTakeaway: "Self-attention mapping token queries (Q) and keys (K) enables parallel processing on GPUs.",
        bulletPoints: [
          "Replaced slow sequential RNNs and LSTMs.",
          "Positional encodings track word ordering without recurrence.",
          "Forms the structural basis of state-of-the-art LLMs (GPT, Claude)."
        ]
      }
    }
  };

  const selected = quizzes[conceptKey];
  if (selected) {
    return {
      id: `quiz_${conceptKey}`,
      nodeId: conceptKey,
      ...selected
    };
  }

  // General fallback
  return {
    id: `quiz_fallback_${conceptKey}_${cardOrder}`,
    nodeId: conceptKey,
    question: `Quick recall check: What is the core learning objective discussed in card ${cardOrder}?`,
    options: [
      { id: "a", text: "To solidify understanding through active recall checks.", isCorrect: true },
      { id: "b", text: "To skim through content passively without retention checks.", isCorrect: false },
      { id: "c", text: "To memorize equations without understanding concepts.", isCorrect: false },
      { id: "d", text: "To ignore core principles and advance blindly.", isCorrect: false }
    ],
    refresherCard: {
      title: `Refresher: Card ${cardOrder} Concepts`,
      summary: `This refresher card reinforces the concepts presented in card ${cardOrder}.`,
      keyTakeaway: "Actively recalling information from memory strengthens learning retention.",
      bulletPoints: [
        "Passive scanning creates an illusion of competence.",
        "Self-testing via MCQ checks activates retrieval mechanisms.",
        "Refresher content assists learning without punishing errors."
      ]
    }
  };
}
