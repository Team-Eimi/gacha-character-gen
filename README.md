# Gacha Character Generator

A multi-step gacha system for rolling characters and artwork drops with customizable odds and banners.

## 🎮 How It Works

The gacha generator follows a 4-step process:

### 1. **Choose Banner** (`index.html`)
- Select from available banners (loaded from `banners.json`)
- Each banner has its own unique set of drops with different rarities
- Only active banners are displayed

### 2. **Select Character** (`character.html`)
- Choose a character pool (Wuxia, Ael Academy, or The Keys)
- Optionally enable **Gold Star Boost** for a specific character
  - Specify a character name and boost percentage
  - Adds that percentage directly to the character's base probability
  - Example: 10% base + 25% boost = 35% chance to get that character

### 3. **Choose Coin** (`coin.html`)
- Select a token that affects your drop rarity odds
- **Diamond Token**: 10% special, 30% legendary, 40% rare, 20% common
- **Gold Token**: 5% special, 15% legendary, 40% rare, 40% common
- **Silver Token**: 1% special, 9% legendary, 30% rare, 60% common
- **Copper Token**: 0% special, 5% legendary, 10% rare, 85% common

### 4. **Results** (`results.html`)
- Performs two independent rolls:
  1. **Character Roll**: Uses selected pool + gold star boost (if applicable)
  2. **Drop Roll**: 
     - First rolls for rarity based on coin odds
     - Then selects a specific drop from the banner's drops matching that rarity
- Displays animation based on rarity (special, legendary, rare, common)
- Shows final character + drop type result

## 📊 Drop Rarities Explained

- **Special** ✨: Special written piece (AU fanfic or canon backstory/side story)
- **Legendary** 🌟: Fully rendered piece (may include background depending on banner)
- **Rare** 💎: Clean sketch (finished line art with shading, sometimes includes color)
- **Common** ⭐: Sketch (whatever doodle mood of the day)

## 📁 File Structure

```
├── index.html           # Banner selection page
├── character.html       # Character pool & gold star selection
├── coin.html           # Token selection
├── results.html        # Final roll & results display
├── banners.json        # Banner configurations & drops
├── coins.json          # Coin types & rarity odds
├── characters.json     # Character pools (wuxia, academy, keys)
└── banner_art/         # Banner images
```

## 🔧 JSON Configuration

### `banners.json`
```json
{
  "banners": [
    {
      "name": "cutesy",
      "active": true,
      "img": "banner_art/bannercutesy.png",
      "drops": [
        {
          "item": "single chibi",
          "chance": 0.5,
          "rarity": "common"
        }
      ]
    }
  ]
}
```

### `coins.json`
```json
{
  "coins": [
    {
      "name": "diamond",
      "displayName": "Diamond Token",
      "img": "coins/diamond.png",
      "rarityOdds": {
        "special": 0.10,
        "legendary": 0.30,
        "rare": 0.40,
        "common": 0.20
      }
    }
  ]
}
```

### `characters.json`
```json
{
  "wuxia": ["Character 1", "Character 2"],
  "academy": ["Character 3", "Character 4"],
  "keys": ["Character 5", "Character 6"]
}
```

## 🎲 Probability Math

### Character Roll with Gold Star
When gold star is enabled:
1. Calculate base probability: `1 / pool_size`
2. Add boost: `boosted_prob = base_prob + (boost_percentage / 100)`
3. Remaining probability: `remaining = 1 - boosted_prob`
4. Other characters: `other_prob = remaining / (pool_size - 1)`

Example with 10 characters and 25% boost:
- Gold star character: 10% + 25% = **35% chance**
- Other 9 characters: 65% / 9 = **7.22% each**

### Drop Roll
1. **Rarity Roll**: Uses coin's `rarityOdds` to determine rarity level
2. **Drop Selection**: From banner's drops matching that rarity, weighted by each drop's `chance` value

## 🚀 Running Locally

Since the project uses `fetch()` to load JSON files, you need a local web server:

### Option 1: Python
```bash
cd "r:\source\OC Creator\gacha-generator"
python -m http.server 8000
```
Visit: `http://localhost:8000`

### Option 2: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

## 🎨 Customization

- **Add new banners**: Edit `banners.json` and add new banner objects
- **Add new coins**: Edit `coins.json` to create new token types
- **Add characters**: Edit `characters.json` to add characters to pools
- **Modify odds**: Adjust `chance` values in banners or `rarityOdds` in coins
- **Change styling**: Edit the `<style>` sections in each HTML file

## 📝 Notes

- All probabilities should sum to 1.0 within each system
- The `chance` values in banner drops are relative weights (don't need to sum to 1)
- Banner images should be placed in `banner_art/` folder
- Coin images should be placed in `coins/` folder (optional)
- Set `"active": false` in `banners.json` to hide a banner without deleting it

## 🐛 Troubleshooting

**Characters not loading**: Make sure `characters.json` is in the same directory as the HTML files

**Banners not displaying**: Check that banner image paths in `banners.json` are correct

**CORS errors**: Use a local web server (see "Running Locally" section)
