const PRODUCT_ANALYSIS_PROMPT = `Analyze this product image(s) or video for an e-commerce clothing store.

Return ONLY a valid JSON object with this exact structure:
{
  "description": "Detailed 2-3 sentence description of the product, including material, style, fit, and key features. Make it engaging for a customer.",
  "category": "ONE category from: [shoes, t-shirt, jeans, jacket, dress, watch, bag, laptop, sunglasses, sneakers, heels]",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Rules:
- Be specific and accurate
- Description should be compelling for customers
- Category must match one from the list exactly (lowercase)
- Tags should be relevant and include: style, color, occasion, material, fit
- Output ONLY the JSON, no markdown formatting, no explanations, no code blocks`;

module.exports = { PRODUCT_ANALYSIS_PROMPT };
