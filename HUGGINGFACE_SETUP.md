# Hugging Face Setup Guide (No Disk Space Required!)

## What is Hugging Face?

Hugging Face Inference API is a **free, cloud-based** AI service that requires **zero installation** and **zero disk space**. Perfect if you're running low on storage!

## Quick Setup (2 minutes!)

### Option 1: No API Key (Easiest)

**Just start your backend - it works immediately!**

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

That's it! The app will use Hugging Face's free tier automatically.

**Note**: First request may take 20-30 seconds as the model "wakes up" from sleep.

### Option 2: With API Key (Recommended for Better Performance)

1. **Sign up for free** at: https://huggingface.co/join
   - Takes 30 seconds, no credit card needed

2. **Get your API token**:
   - Go to: https://huggingface.co/settings/tokens
   - Click "New token"
   - Name it (e.g., "deal-sourcing-ai")
   - Copy the token (starts with `hf_...`)

3. **Add to your `.env` file** in the `backend` folder:
   ```env
   HF_API_KEY=hf_your-token-here
   ```

4. **Restart your backend** - that's it!

## Benefits

✅ **Zero Installation** - No software to download  
✅ **Zero Disk Space** - Everything runs in the cloud  
✅ **Completely Free** - Generous free tier  
✅ **No Setup** - Works immediately  
✅ **Fast** - After first request, responses are quick  

## Free Tier Limits

- **Rate Limits**: Very generous for personal use
- **Model Loading**: Free models may sleep after inactivity (first request takes 20-30s)
- **No Credit Card**: Required for free tier

## Troubleshooting

### "Model is loading" error
- **Normal!** Free tier models sleep when inactive
- Wait 20-30 seconds and try again
- The model will stay awake for a while after first use

### Slow first response
- This is normal - the model needs to "wake up"
- Subsequent requests will be much faster
- Get an API key for better performance

### Rate limit errors
- Free tier has generous limits
- If you hit limits, wait a few minutes
- Consider getting an API key for higher limits

## Alternative Models

You can change the model in your `.env`:

```env
# Default (good balance)
HF_API_URL=https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2

# Other free options:
# HF_API_URL=https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf
# HF_API_URL=https://api-inference.huggingface.co/models/google/gemma-7b-it
```

## Comparison: Hugging Face vs Ollama

| Feature | Hugging Face | Ollama |
|---------|-------------|--------|
| Installation | None | Required |
| Disk Space | 0 MB | 2-8 GB+ |
| Setup Time | 0 minutes | 10-30 minutes |
| Internet | Required | Optional (after setup) |
| Speed | Fast (after wake) | Very fast |
| Privacy | Cloud-based | Local |

**Recommendation**: Use Hugging Face if you're low on disk space!

