from transformers import BlipProcessor, BlipForConditionalGeneration, CLIPProcessor, CLIPModel
from sentence_transformers import SentenceTransformer

blip_path = "./models/blip"
clip_path = "./models/clip" 
sbert_path = "./models/sbert"

# Download and save BLIP
blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
blip_processor.save_pretrained(blip_path)
blip_model.save_pretrained(blip_path)

# Download and save CLIP
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
clip_processor.save_pretrained(clip_path)
clip_model.save_pretrained(clip_path)

# Download and save SBERT for KeyBERT
sbert_model = SentenceTransformer("all-MiniLM-L6-v2")
sbert_model.save(sbert_path)