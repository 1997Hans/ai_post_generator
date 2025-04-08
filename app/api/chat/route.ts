import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { generatePostPrompt, getSystemPrompt } from '@/lib/prompts';
import { getGeminiModel, isGeminiConfigured } from '@/lib/gemini';
import { generateImage } from '@/lib/huggingface';
import { enhanceImagePrompt } from '@/lib/image-prompts';

// Set a reasonable timeout for API calls
const API_TIMEOUT = 15000; // 15 seconds

// Create a timeout promise
const timeout = (ms: number) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);
  });
};

// Mock response data for different topics
const mockResponses = {
  default: {
    mainContent: "Experience the beauty of our world! From majestic mountains to serene beaches, nature has so much to offer. Take a break from the digital world and reconnect with the natural one. What's your favorite outdoor spot?",
    caption: "Finding peace in nature's embrace 🌿 #NatureLovers",
    hashtags: ["NatureLovers", "Outdoors", "Explore", "Adventure"],
    visualPrompt: "A beautiful landscape scene with mountains and a peaceful lake, golden sunlight streaming through trees",
    imageUrl: "/images/fallback-image.jpg"  // Default fallback image
  },
  
  "running era": {
    mainContent: "Ready for a run that changes everything? Lace up those shoes and join the running era! Whether you're a beginner or seasoned runner, every step is a victory. Share your journey, inspire others, and be part of something bigger than yourself.",
    caption: "Taking strides towards a healthier, happier you. Who's joining the movement?",
    hashtags: ["RunningEra", "FitnessGoals", "MoveWithPurpose"],
    visualPrompt: "A pair of running shoes on a sunrise trail, with motivational text overlay",
    imageUrl: "/images/fallback-image.jpg"  // Default fallback image
  },
  
  "nature adventure": {
    mainContent: "The wilderness is calling! Pack your bags for an unforgettable nature adventure. From hidden waterfalls to breathtaking mountain views, there's something magical about disconnecting from technology and reconnecting with Mother Earth. What will you discover?",
    caption: "Lost in nature, found myself. Every adventure tells a story! 🏞️🌲",
    hashtags: ["NatureAdventure", "Wilderness", "ExploreOutdoors", "EarthWonders"],
    visualPrompt: "A hiker standing on a mountain overlook with arms raised, overlooking a vast forest landscape with dramatic lighting",
    imageUrl: "/images/fallback-image.jpg"  // Default fallback image
  },
  
  "food": {
    mainContent: "Delicious flavors that bring people together! Whether you're a foodie exploring new cuisines or simply enjoying comfort food, every meal tells a story. What's on your plate today?",
    caption: "Good food, good mood! Savoring every bite of this culinary journey. 🍽️",
    hashtags: ["FoodLover", "CulinaryDelight", "TastyTreats", "FoodJourney"],
    visualPrompt: "A beautifully plated meal with vibrant colors and textures, soft natural lighting highlighting fresh ingredients",
    imageUrl: "/images/fallback-image.jpg"  // Default fallback image
  },
  
  "travel": {
    mainContent: "Adventure awaits around every corner! From bustling city streets to serene countryside views, travel opens our minds and hearts to new experiences. Where will your next journey take you?",
    caption: "Collecting moments, not things. Every destination a new chapter. ✈️🌍",
    hashtags: ["TravelBug", "Wanderlust", "Explore", "JourneyOn"],
    visualPrompt: "A traveler looking out at a scenic cityscape or landmark during golden hour, with a hint of adventure and wonder",
    imageUrl: "/images/fallback-image.jpg"  // Default fallback image
  }
};

// Set a higher timeout for this route
export const maxDuration = 60; // 60 seconds max duration for Vercel 

export async function POST(req: Request) {
  console.log('Chat API route called');
  
  try {
    // Parse the incoming request
    const body = await req.json();
    console.log('Request body:', body);
    
    // Get topic from either direct topic field or messages array
    const topic = body.topic || body.messages?.[body.messages.length - 1]?.content;
    
    if (!topic) {
      return new Response(
        JSON.stringify({ error: 'No topic provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Format response for the Vercel AI SDK
    const formatAsVercelAIMessage = (content: string) => {
      return JSON.stringify({ role: 'assistant', content });
    };
    
    // Create the prompt
    const prompt = generatePostPrompt({
      topic,
      tone: body.tone || 'friendly',
      platform: body.platform || 'instagram',
      visualStyle: body.visualStyle || 'realistic',
      maxLength: 280
    });
    
    console.log('Using prompt:', prompt);
    
    // Check if Gemini API is configured
    const apiConfigured = isGeminiConfigured();
    
    if (!apiConfigured) {
      console.log('Gemini API not configured, falling back to mock data');
      return useMockResponse(topic, formatAsVercelAIMessage, body.visualStyle || 'realistic');
    }
    
    try {
      // Get Gemini model
      const model = getGeminiModel();
      console.log('Gemini model initialized, generating content...');
      
      // Call the Gemini API with timeout
      const generateContentWithTimeout = async () => {
        try {
          // Race between the API call and a timeout
          const result = await Promise.race([
            model.generateContent({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
              },
              safetySettings: [
                {
                  category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                  threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                  category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                  threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
              ],
            }),
            timeout(API_TIMEOUT)
          ]);
          
          // Process the response
          const text = result.response.text();
          console.log('Generated response text:', text.substring(0, 100) + '...');
          
          // Parse the response text as JSON
          try {
            // First, try to parse as JSON directly
            const jsonContent = JSON.parse(text);
            console.log('Successfully parsed JSON response');
            
            // Generate image using the visual prompt
            if (jsonContent.visualPrompt) {
              try {
                console.log('Generating image for visual prompt:', jsonContent.visualPrompt);
                const visualStyle = body.visualStyle || 'realistic';
                
                // Combine the visual prompt with some content for better context
                const combinedPrompt = `${jsonContent.visualPrompt} ${jsonContent.mainContent.substring(0, 100)}`;
                
                // Enhance the prompt for better image generation
                const enhancedPrompt = enhanceImagePrompt(combinedPrompt, visualStyle);
                
                // Generate the image with timeout
                const imageResult = await Promise.race([
                  generateImage({
                    prompt: enhancedPrompt,
                    style: visualStyle,
                  }),
                  timeout(API_TIMEOUT)
                ]);
                
                if (imageResult) {
                  console.log('Successfully generated image');
                  jsonContent.imageUrl = imageResult;
                } else {
                  console.log('Image generation failed, using fallback image');
                  jsonContent.imageUrl = '/images/fallback-image.jpg';
                }
              } catch (imageError) {
                console.error('Error generating image:', imageError);
                jsonContent.imageUrl = '/images/fallback-image.jpg';
              }
            } else {
              // No visual prompt, use fallback image
              jsonContent.imageUrl = '/images/fallback-image.jpg';
            }
            
            // Return formatted content for Vercel AI SDK
            return formatAsVercelAIMessage(JSON.stringify(jsonContent));
          } catch (parseError) {
            console.error('Error parsing response as JSON, trying to extract JSON from text');
            
            // Try to extract JSON from text (in case model wrapped it with extra text)
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              try {
                const extractedJson = JSON.parse(jsonMatch[0]);
                console.log('Successfully extracted and parsed JSON from response');
                
                // Generate image using the visual prompt
                if (extractedJson.visualPrompt) {
                  try {
                    const visualStyle = body.visualStyle || 'realistic';
                    const combinedPrompt = `${extractedJson.visualPrompt} ${extractedJson.mainContent.substring(0, 100)}`;
                    const enhancedPrompt = enhanceImagePrompt(combinedPrompt, visualStyle);
                    
                    const imageUrl = await Promise.race([
                      generateImage({
                        prompt: enhancedPrompt,
                        style: visualStyle,
                      }),
                      timeout(API_TIMEOUT)
                    ]);
                    
                    if (imageUrl) {
                      extractedJson.imageUrl = imageUrl;
                    } else {
                      extractedJson.imageUrl = '/images/fallback-image.jpg';
                    }
                  } catch (imageError) {
                    console.error('Error generating image:', imageError);
                    extractedJson.imageUrl = '/images/fallback-image.jpg';
                  }
                } else {
                  extractedJson.imageUrl = '/images/fallback-image.jpg';
                }
                
                return formatAsVercelAIMessage(JSON.stringify(extractedJson));
              } catch (extractError) {
                console.error('Failed to extract valid JSON from response');
                throw extractError;
              }
            }
            
            // If all parsing attempts fail, throw an error to use mock data
            throw new Error('Failed to parse AI response');
          }
        } catch (error) {
          console.error('Error in content generation:', error);
          throw error;
        }
      };
      
      // Try to generate content with timeout handling
      const formattedContent = await generateContentWithTimeout();
      
      // Return the formatted content
      return new Response(formattedContent, {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (genError) {
      console.error('Gemini generation error:', genError);
      console.log('Falling back to mock response due to API error');
      
      // Fall back to mock response if API fails
      return useMockResponse(topic, formatAsVercelAIMessage, body.visualStyle || 'realistic');
    }
  } catch (error: any) {
    console.error('Chat API error:', error);
    // Return a more graceful error with fallback to mock data
    return useMockResponse('error fallback', formatAsVercelAIMessage, 'realistic');
  }
}

// Helper function to use mock response as fallback
async function useMockResponse(topic: string, formatAsVercelAIMessage: (content: string) => string, visualStyle: string = 'realistic') {
  console.log('Using mock response for topic:', topic);
  
  // Find the most appropriate mock response based on topic
  // Convert to lowercase and look for matches
  const topicLower = topic.toLowerCase();
  
  // Check if we have a specific mock for this topic
  let mockResponse;
  
  if (topicLower.includes('running') || topicLower.includes('fitness')) {
    mockResponse = mockResponses['running era'];
  } else if (topicLower.includes('nature') || topicLower.includes('outdoor') || topicLower.includes('adventure')) {
    mockResponse = mockResponses['nature adventure'];
  } else if (topicLower.includes('food') || topicLower.includes('cuisine') || topicLower.includes('cooking')) {
    mockResponse = mockResponses['food'];
  } else if (topicLower.includes('travel') || topicLower.includes('journey') || topicLower.includes('vacation')) {
    mockResponse = mockResponses['travel'];
  } else {
    // Use default response if no match
    mockResponse = mockResponses.default;
  }
  
  // Apply some customization based on the topic if not an exact match
  if (!Object.keys(mockResponses).some(key => topicLower.includes(key))) {
    mockResponse = {
      ...mockResponse,
      mainContent: mockResponse.mainContent.replace("our world", `the world of ${topic}`),
      caption: `${mockResponse.caption} #${topic.replace(/\s+/g, '')}`,
      hashtags: [...mockResponse.hashtags, topic.replace(/\s+/g, '')]
    };
  }
  
  // Try to generate an image for the mock response, but with proper error handling
  try {
    if (mockResponse.visualPrompt && !mockResponse.imageUrl.includes('fallback-image')) {
      console.log('Generating image for mock response...');
      const combinedPrompt = `${mockResponse.visualPrompt} ${mockResponse.mainContent.substring(0, 100)}`;
      const enhancedPrompt = enhanceImagePrompt(combinedPrompt, visualStyle);
      
      // Use timeout to avoid hanging
      const imageUrl = await Promise.race([
        generateImage({
          prompt: enhancedPrompt,
          style: visualStyle,
        }),
        timeout(API_TIMEOUT)
      ]);
      
      if (imageUrl) {
        console.log('Successfully generated image for mock response');
        mockResponse.imageUrl = imageUrl;
      } else {
        // Use fallback if image generation fails
        mockResponse.imageUrl = '/images/fallback-image.jpg';
      }
    }
  } catch (error) {
    console.error('Error generating image for mock response:', error);
    // Ensure we have a fallback image
    mockResponse.imageUrl = '/images/fallback-image.jpg';
  }
  
  // Convert the mock response to JSON
  const responseText = JSON.stringify(mockResponse);
  
  // Return formatted content for Vercel AI SDK
  return new Response(formatAsVercelAIMessage(responseText), {
    headers: { 'Content-Type': 'application/json' }
  });
} 