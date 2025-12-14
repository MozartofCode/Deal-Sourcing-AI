# Ollama Setup Guide

## What is Ollama?

Ollama is a free, open-source tool that lets you run large language models (LLMs) locally on your computer. **No API keys, no costs, completely free!**

## Quick Setup

### 1. Install Ollama

**Windows:**
- Download from: https://ollama.ai/download
- Run the installer
- Ollama will start automatically

**Mac:**
- Download from: https://ollama.ai/download
- Or use Homebrew: `brew install ollama`

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### 2. Pull a Model

After installation, open a terminal and run:

```bash
ollama pull llama3.2
```

This downloads the Llama 3.2 model (~2GB). Other good options:
- `ollama pull mistral` - Fast and efficient
- `ollama pull llama3` - Larger, more capable
- `ollama pull phi3` - Small and fast
- `ollama pull gemma2` - Google's model

### 3. Verify Installation

Test that Ollama is working:
```bash
ollama run llama3.2 "Hello, how are you?"
```

You should get a response from the AI!

### 4. Start Your Backend

Now your backend will automatically use Ollama. Just make sure Ollama is running (it should start automatically when you boot your computer).

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

## Configuration (Optional)

You can customize Ollama settings in your `.env` file:

```env
# Default values (you don't need to set these unless you want to change them)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

## Troubleshooting

### "Cannot connect to Ollama"
- Make sure Ollama is installed and running
- Check if Ollama is running: `ollama list` (should show your models)
- Try restarting Ollama or your computer

### "Model not found"
- Pull the model: `ollama pull llama3.2`
- Or change `OLLAMA_MODEL` in `.env` to a model you have

### Slow responses
- Try a smaller model: `ollama pull phi3` or `ollama pull mistral`
- Make sure you have enough RAM (models need 4-8GB+ depending on size)

## Benefits of Ollama

✅ **Completely Free** - No API costs ever  
✅ **Privacy** - All data stays on your machine  
✅ **No Internet Required** - Works offline  
✅ **Fast** - No network latency  
✅ **No Rate Limits** - Use as much as you want  

## Alternative: Hugging Face (Cloud-based, Free Tier)

If you prefer a cloud solution with a free tier, you can use Hugging Face Inference API instead. However, Ollama is recommended because it's completely free with no limits.

