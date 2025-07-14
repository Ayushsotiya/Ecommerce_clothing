from transformers import BlipProcessor, BlipForConditionalGeneration, CLIPProcessor, CLIPModel
from sentence_transformers import SentenceTransformer
from PIL import Image
import requests
import torch
from keybert import KeyBERT
import os
import sys
import json
from collections import Counter

# Setup device
device = 'cpu'

# Load Models
root_dir = os.path.dirname(os.path.abspath(__file__))

blip_processor = BlipProcessor.from_pretrained(os.path.join(root_dir, 'models', 'blip'))
blip_model = BlipForConditionalGeneration.from_pretrained(os.path.join(root_dir, 'models', 'blip')).to(device)

clip_processor = CLIPProcessor.from_pretrained(os.path.join(root_dir, 'models', 'clip'))
clip_model = CLIPModel.from_pretrained(os.path.join(root_dir, 'models', 'clip')).to(device)

kw_model = KeyBERT(model=os.path.join(root_dir, 'models', 'sbert'))

# -------- Helper functions --------

def load_image(image_input):
    try:
        if image_input.startswith("http"):
            image = Image.open(requests.get(image_input, stream=True).raw).convert('RGB')
        else:
            image = Image.open(image_input).convert('RGB')
        return image
    except Exception as e:
        raise Exception(f"Error loading image {image_input}: {e}")

def generate_description(image):
    inputs = blip_processor(image, return_tensors="pt").to(device)
    output = blip_model.generate(**inputs)
    description = blip_processor.decode(output[0], skip_special_tokens=True)
    return description

def predict_category(image):
    categories = ["shoes", "t-shirt", "jeans", "jacket", "dress", "watch", "bag", "laptop", "sunglasses", "sneakers", "heels"]
    text_inputs = clip_processor(text=categories, return_tensors="pt", padding=True).to(device)
    image_inputs = clip_processor(images=image, return_tensors="pt").to(device)

    with torch.no_grad():
        image_features = clip_model.get_image_features(**image_inputs)
        text_features = clip_model.get_text_features(**text_inputs)

    image_features /= image_features.norm(p=2, dim=-1, keepdim=True)
    text_features /= text_features.norm(p=2, dim=-1, keepdim=True)
    similarities = torch.matmul(image_features, text_features.T)

    best_idx = similarities.argmax().item()
    return categories[best_idx]

def extract_tags(description):
    keywords = kw_model.extract_keywords(description, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=5)
    return [kw[0] for kw in keywords]

# -------- Main CLI --------

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image paths provided"}))
        sys.exit(1)

    image_paths = sys.argv[1:]  # Accept multiple images
    all_descriptions = []
    all_categories = []
    all_tags = []

    try:
        for img_path in image_paths:
            image = load_image(img_path)

            description = generate_description(image)
            all_descriptions.append(description)

            category = predict_category(image)
            all_categories.append(category)

            tags = extract_tags(description)
            all_tags.extend(tags)

        # Aggregate output
        final_description = " ".join(all_descriptions)
        most_common_category = Counter(all_categories).most_common(1)[0][0]
        final_tags = list(dict(Counter(all_tags)).keys())[:5]

        result = {
            "description": final_description,
            "category": most_common_category,
            "tags": final_tags
        }

        print(json.dumps(result))  # ✅ The only output for backend

    except Exception as e:
        print(json.dumps({"error": str(e)}))
